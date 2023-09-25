import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { NgbPopoverConfig } from "@ng-bootstrap/ng-bootstrap";
import { ProductService } from "../../../../../../provider/product-service/product-service.service";
import { productData } from "../../sales/product-data";
import _ from "lodash";
import { LayoutUtilsService } from "../../../../../core/_base/crud";
import { ToastrService } from "ngx-toastr";
import { UserProfileService } from "../../../../../../provider/user-profile/user-profile.service";
import Swal from "sweetalert2";
import { Router, ActivatedRoute } from "@angular/router";

import { SuperadminService } from "../../../../../../provider/superadmin/superadmin.service";
import { HsnLookupComponent } from "../../../../../components/hsn-lookup/hsn-lookup.component";
import { CategoryLookupComponent } from "../../../../../components/category-lookup/category-lookup.component";

@Component({
  selector: "kt-purchase-edit",
  templateUrl: "./purchase-edit.component.html",
  styleUrls: ["./purchase-edit.component.scss"],
})
export class PurchaseEditComponent implements OnInit {
  @Input() data: any = undefined;
  @Input() productCategoryList: any = [];
  @Output() refresh = new EventEmitter<any>();
  @Input() isMember: boolean = false;
  @Input() addMemberApi: boolean = false;
  @Input() addUserMemberProfile: boolean;

  @Output() isMemberAdded = new EventEmitter<any>();
  @ViewChild("productName", { static: true }) public productName: any;
  @ViewChild("newCategory", { static: true }) public newCategory: any;
  @ViewChild("hsnLookUps", { static: false })
  public hsnLookUps: HsnLookupComponent;
  @ViewChild("categoryLookUps", { static: false })
  public categoryLookUps: CategoryLookupComponent;
  hsnaLoading: boolean = false;
  loading: boolean = false;
  addBtnLoading: boolean = false;
  form: FormGroup;
  @Input() token: string = "";
  @Input() isPending: boolean;
  productTypeOption = productData.productTypeOption;
  supplyDurationType = productData.SupplyDurationType;
  frequencyData = productData.frequencyData;
  productQuantityType = productData.ProductQuantityType;
  userProduct: any = {
    productId: "",
  };
  fields: any = {
    productCategory: [],
    customProductCategory: [],
  };
  productCategory: any = [];
  customProductCategory: any = [];
  productServiceList: any = [];
  newCategoryValue: any = {};
  customProductCategoryData: any;
  loadingHsn: boolean;

  save() {
    return this.submit();
  }

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    config: NgbPopoverConfig,
    private service: ProductService,
    private layoutUtilsService: LayoutUtilsService,
    private cd: ChangeDetectorRef,
    private userProfile: UserProfileService,
    private router: Router,
    private el: ElementRef,
    private activateRouter: ActivatedRoute,
    private superAdmin: SuperadminService
  ) {
    // customize default values of popovers used by this component tree
    config.placement = "right";
    config.triggers = "hover";
  }

  async ngOnInit() {
    this.initForm();
    //product info
    if (this.data) {
      this.getProductInfo();
    } else {
      this.data = {
        productCatogories: [],
        customProductCatogories: [],
      };
    }
    this.removeFormValidation();
    console.log("ispending", this.isPending);
  }

  initForm() {
    this.form = this.fb.group({
      productType: [null, Validators.required],
      productName: ["", Validators.required],
      hsn: null,
      productSpecification: "",
      productCatogories: ["", Validators.required],
      annualRequirement: undefined,
      unitTypeId: undefined,
      frequencyOfPurchase: undefined,
    });
  }

  async onProductChange(data: any) {
    this.loadingHsn = true;
    let categoryName = [];
    this.form.patchValue({
      productName: data.text,
    });
    let option = {
      searchText: data.text.split("-")[0],
      sortKey: "",
      sortOrder: "",
      pageNumber: 0,
      records: 1,
    };
    try {
      let res: any = await this.superAdmin.getUserProductList(option);
      console.log(res);
      if (
        res &&
        res.customProductList.length != 0 &&
        res.customProductList[0].hsnCode != 0
      ) {
        let data = {
          text: res.customProductList[0].hsnCode,
          id: res.customProductList[0].hsnCode,
        };
        let temp: any = await this.superAdmin.getProductCategoryDetails(
          res.customProductList[0].systemCategoryName
        );
        if (temp.productCategoryList.length != 0) {
          categoryName.push({
            categoryId: temp.productCategoryList[0].id,
            id: temp.productCategoryList[0].id,
            name: temp.productCategoryList[0].name,
            newTag: temp.productCategoryList[0].isCustom == 0 ? false : true,
            productId: 0,
            type:
              temp.productCategoryList[0].isCustom == 0
                ? "productCategory"
                : "customCategory",
          });
          this.categoryLookUps.setCategory(categoryName[0]);
          this.onCategoryChange(categoryName);
          this.cd.detectChanges();
        }
        console.log("data", data);
        this.hsnLookUps.setHsnCode(data);
        this.onHSNChange(data);
        this.loadingHsn = false;
        this.cd.detectChanges();
      }
    } catch (e) {
      this.loadingHsn = false;
      this.cd.detectChanges();
      console.log(e);
    }
  }

  async onBusinessCategoryChange(data: any) {
    this.form.patchValue({
      buyerIndustries: data,
    });
  }

  onHSNChange(data: any) {
    this.form.patchValue({
      hsn: data.text,
    });
  }

  async getProductInfo() {
    let data = {};
    this.userProduct = this.data;
    this.productCategory = this.userProduct.productCatogories;
    this.customProductCategory = this.userProduct.customProductCatogories;
    this.form.patchValue(this.userProduct);
    data["productType"] = parseInt(this.userProduct.productType);
    data["frequencyOfPurchase"] = parseInt(
      this.userProduct.frequencyOfPurchase
    );
    data["unitTypeId"] = parseInt(this.userProduct.unitTypeId);
    this.form.patchValue(data);
    this.cd.detectChanges();
  }

  //on ngx-actions
  onTagsChanged(event, key) {
    if (event.change == "add") {
      this.fields[key].push(event.tag);
      console.log("event", this.fields[key]);
    } else {
      let index = _.findIndex(this.fields[key], { name: event.tag.name });
      if (index > -1) {
        this.fields[key].splice(index, 1);
      }
    }
  }

  //push to the ngx-tags
  addCategory() {
    if (((this.newCategoryValue || {}).target || {}).value) {
      this.addBtnLoading = true;
      setTimeout(() => {
        let index = _.findIndex(this.customProductCategory, {
          name: this.newCategoryValue.target.value,
        });
        if (index == -1 && this.newCategoryValue.target.value) {
          this.fields["customProductCategory"].push(
            this.newCategoryValue.target.value
          );
          this.customProductCategory.push({
            name: this.newCategoryValue.target.value,
          });
        }

        this.newCategoryValue.target.value = "";
        this.addBtnLoading = false;
        this.newCategory.close();
        this.cd.detectChanges();
      }, 1000);
    }
  }

  //return the serach item in business category
  returnBusinessCategory(value) {
    this.newCategoryValue = value;
  }

  formatCategories(list, isProductCategory) {
    let array: any = [];
    list.forEach((key) => {
      if (isProductCategory) {
        array.push(key.categoryId);
      } else {
        array.push(key.name);
      }
    });
    return array;
  }

  filterCategories() {
    let categories: any = [];
    let custom: any = [];
    let array = this.form.value.productCatogories;
    _.each(array, (item) => {
      if (item.type == "productCategory") {
        categories.push(parseInt(item.id));
      } else {
        custom.push(item.name);
      }
    });
    return {
      customProductCategory: custom,
      productCatogory: categories,
    };
  }

  setFinalData() {
    let data: any = this.form.value;
    data.token = this.token;
    if (
      (this.isMember || this.isPending) &&
      !window.location.href.includes("business/profile")
    ) {
      data.mode = "SuperAdmin";
    }
    let fiteredCategories = this.filterCategories();
    data["ProductCategory"] = fiteredCategories["productCatogory"];
    data["customProductCategory"] = fiteredCategories["customProductCategory"];

    _.each(
      ["productType", "annualRequirement", "unitTypeId", "frequencyOfPurchase"],
      (key: string) => {
        data[key] = parseInt(this.form.value[key]) || 0;
      }
    );
    _.each(["productName", "hsn", "productCatogory"], (key: string) => {
      data[key] = this.form.value[key] || null;
    });
    return data;
  }

  async addMemberProfile() {
    let data: any = {};
    let inviteDetails: any = JSON.parse(
      localStorage.getItem("MEMBER_PROFILE_" + this.token)
    );
    console.log("data", inviteDetails);
    if (inviteDetails == null) {
      return;
    }
    if (Object.keys(inviteDetails).length > 0) {
      data["phoneNumber"] = inviteDetails.phoneNo;
      data["location"] = inviteDetails.pinCode;
      data["locationType"] = 1;
      _.each(
        ["name", "companyName", "email", "website", "id"],
        (key: string) => {
          data[key] = inviteDetails[key];
        }
      );
      let res: any = await this.userProfile.addMemberProfile(data);
      if (res.isProfileAdded) {
        localStorage.removeItem("MEMBER_PROFILE_" + this.token);
        this.isMemberAdded.emit({ memberAdded: false, profile: data });
        this.toastr.success("Profile Added successfully");
      } else {
        this.isMemberAdded.emit({ memberAdded: true });
        this.toastr.success("Profile Added Failed");
      }
    }
  }

  // search and add categories
  async searchSuggestedProduct(value) {
    if (value) {
      this.productName.open();
      let suggestedDbProduct: any = await this.service.getAutoSuggestDBProductBYText(
        value
      );
      let suggestedProduct: any = await this.service.getAutoSuggestProductByText(
        value
      );
      // this.productServiceList = suggestedDbProduct.suggestedProducts || suggestedProduct.suggestedProducts;
    }
  }

  //search HSN or SAC code
  async searchSuggestedHsnSac(value) {
    if (value) {
      this.hsnaLoading = true;
      let suggestedHsn: any = await this.service.getAutoSuggestHsnSac(value);
      let suggestedDescription: any = await this.service.getAutoSuggestDescription(
        value
      );
      if (
        suggestedHsn.suggestedHsnSac ||
        suggestedDescription.hsnSacDescription
      ) {
        this.productServiceList =
          suggestedHsn.suggestedHsnSac ||
          suggestedDescription.hsnSacDescription;
      } else {
        this.toastr.error("No result found");
      }
      this.hsnaLoading = false;
      this.cd.detectChanges();
    }
  }

  //set value from list
  setValue(item) {
    this.form.patchValue({ productName: item });
  }

  //submit
  async submit() {
    let validate: boolean = false;
    let controls = this.form.controls;
    if (this.form.invalid) {
      validate = true;
      Object.keys(controls).forEach((key) => {
        controls[key].markAllAsTouched();
      });

      const invalidElements = this.el.nativeElement.querySelectorAll(
        ".ng-invalid"
      );
      if (invalidElements.length > 0) {
        invalidElements[0].scrollIntoView();
      }
      this.toastr.error("Plese provide all the required fields");
      return;
    }

    if (!validate) {
      this.loading = true;
      let data = this.setFinalData();
      try {
        let res: any = {};
        let _description: string = "";
        if (this.data && !this.data.productId) {
          _description = "Product is Added.";

          //CHECK: 1.Member 2.then add member-profileAPi
          if (this.addMemberApi || this.addUserMemberProfile) {
            await this.addMemberProfile();
          }
          res = await this.service.postPurchaseProduct(data);
          console.log("data", res);
        } else {
          data.productId = this.data.productId;
          _description = "Product is Updated.";
          res = await this.service.updatePurchaseProduct(data);
        }
        if ((res || {}).isProductAdded) {
          this.loading = false;
          this.cd.detectChanges();

          Swal.fire({
            icon: "success",
            title: "Product is Updated.",
          }).then((res: any) => {
            this.refresh.emit({ refresh: true });
          });
        } else {
          this.loading = false;
          this.cd.detectChanges();
          this.toastr.error("Product or Service is already exists");
        }
      } catch (e) {
        console.log("error", e);
        this.loading = false;
        this.cd.detectChanges();
      }
    }
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  cancel() {
    this.refresh.emit({ refresh: false });
  }
  onCategoryChange(data: any) {
    this.form.patchValue({
      productCatogories: data,
    });
  }
  getClass() {
    return window.location.href.includes("/member-profile")
      ? ""
      : "mandatory-field";
  }
  removeFormValidation() {
    if (window.location.href.includes("/member-profile")) {
      this.form.get("productCatogories").clearValidators();
      this.form.get("productCatogories").updateValueAndValidity();
      this.form.get("productType").clearValidators();
      this.form.get("productType").updateValueAndValidity();
    }
  }
}
