import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { productData } from "../product-data";
import { NgbPopoverConfig } from "@ng-bootstrap/ng-bootstrap";
import { ProductService } from "../../../../../../provider/product-service/product-service.service";
import _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { UserProfileService } from "../../../../../../provider/user-profile/user-profile.service";
import { MatDialog } from "@angular/material";
import { HsnLookupComponent } from "../../../../../components/hsn-lookup/hsn-lookup.component";
import { CategoryLookupComponent } from "../../../../../components/category-lookup/category-lookup.component";
import { HsnListItemComponent } from "../../hsn-list-item/hsn-list-item.component";
import { SuperadminService } from "../../../../../../provider/superadmin/superadmin.service";
import { DynamicObjectValueComponent } from "../../dynamic-object-value/dynamic-object-value.component";
import { PhotoEditorComponent } from "../../photo-editor/photo-editor.component";

@Component({
  selector: "kt-sales-edit",
  templateUrl: "./sales-edit.component.html",
  styleUrls: ["./sales-edit.component.scss"],
})
export class SalesEditComponent implements OnInit {
  //properties
  @Output() refresh = new EventEmitter<any>();
  @Input() productCategoryList: any = [];
  @Input() list: any = [];
  @Input() data: any = undefined;
  @Input("token") memberToken: number;
  @Input() isMember: boolean = false;
  @Input() addMemberApi: boolean = false;
  @Input() isPending: boolean;
  @Input() addUserMemberProfile: boolean;
  @Output() isMemberAdded = new EventEmitter<any>();
  @ViewChild("categoryLookUps", { static: false })
  public categoryLookUps: CategoryLookupComponent;
  @ViewChild("businessCategory", { static: true }) public ProductCategory: any;
  @ViewChild("newCategory", { static: true }) public newCategory: any;
  @ViewChild("buyerIndustry", { static: true }) public buyerIndustry: any;
  // @ViewChild("productNameSelector", { static: true })
  @ViewChild("hsnLookUps", { static: false })
  public hsnLookUps: HsnLookupComponent;
  @ViewChild("dymicKey", { static: false })
  dymicKey: DynamicObjectValueComponent;

  optionValue: any;
  public productNameSelector: any;

  newCategoryValue: any = {};
  addBtnLoading: boolean = false;
  hsnaLoading: boolean = false;
  intervalsIds: any = [];
  ajaxLoading: boolean = false;
  product: string;
  cartItemsList: any;
  imageLoading: boolean;
  loadingHsn: boolean;
  isMemberProfile: boolean = false;
  additionalDetails:any=[]
  arrList: any;
  save() {
    return this.submit();
  }

  descriptions: FormArray;
  keyWordsList: FormArray;
  form: FormGroup;
  token: any;
  productTypeOption = productData.productTypeOption;
  productBuyerType = productData.BuyerIndustry;
  productQuantityType = productData.ProductQuantityType;
  supplyDurationType = productData.SupplyDurationType;
  userProduct: any = {
    productId: "",
  };
  buyerIndustries: any = [];
  productCategory: any = [];
  customProductCategory: any = [];
  urls: any = [];
  productServiceList: any = [];
  _productCategory: any = [];
  imageRank:any=[];

  //for handle ngx-tags-input
  fields: any = {
    productCategory: [],
    customProductCategory: [],
    buyerIndustries: [],
  };
  loading: boolean = false;
  businessTypeList:any = [
    { text: "Exporter", value: "1" },
    { text: "Importer", value: "2" },
    { text: "Trader", value: "3" },
    { text: "Service provider", value: "4" },
    { text: "Manufacturer", value: "5" },
  ];

  constructor(
    private fb: FormBuilder,
    public config: NgbPopoverConfig,
    private service: ProductService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private userProfile: UserProfileService,
    private el: ElementRef,
    private dialog: MatDialog,
    private activateRouter: ActivatedRoute,

    private superAdmin: SuperadminService
  ) {
    // customize default values of popovers used by this component tree
    config.placement = "right";
    config.triggers = "hover";
  }

  async ngOnInit() {
    this.initForm();
    if (this.memberToken) {
      this.token = this.memberToken;
    } else {
      let res: any = JSON.parse(localStorage.getItem("memberData"));
      if (res.token) {
        this.token = res.token;
      }
    }
    this.getProductInfo();
    this.removeFormValidation();
    console.log("para", this.activateRouter.snapshot.params);
    console.log("ispending", this.isPending);
  }

  initForm() {
    this.form = this.fb.group({
      productType: [null, Validators.required],
      productName: ["", Validators.required],
      buyerIndustries: [],
      hsn: null,
      keyWordsList: this.fb.array([this.createForm()]),
      unsbscProductCode: "0",
      descriptionsOne: ["", Validators.required],
      descriptionsTwo: "",
      descriptions: this.fb.array([this.createForm()]),
      videoLink: [
        null,
        Validators.pattern(
          /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/
        ),
      ],
      productCatogories: ["", Validators.required],
      supplyDetail: new FormGroup({
        moq: new FormControl(undefined),
        priceMin: new FormControl(undefined),
        priceMax: new FormControl(undefined),
        capacity: new FormControl(undefined),
        supplyDurationTypeId: new FormControl(undefined),
        unit: new FormControl(undefined),
        quantityPerPack: new FormControl(undefined),
      }),
      description_ranking:[""],
      image_ranking:[""],
      addtionalDetails: [""]
    });
  }

  addtionalDetails(event){
    this.additionalDetails=event;
    let obj={}
    this.additionalDetails.map((item)=>{
      obj[this.getKeyName(item)]=item[this.getKeyName(item)]
    })

    console.log("object",obj);
    
    this.form.controls.addtionalDetails.setValue(JSON.stringify(obj))
  }

  getKeyName(key){
    return Object.keys(key)[0]
  }

  async onProductChange(data: any) {
    this.loadingHsn = true;
    let categoryName = [];
    this.form.patchValue({
      productName: data.text,
      unsbscProductCode: data.newTag ? 0 : data.id,
    });
    console.log(data);
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
        this.hsnLookUps.setHsnCode(data);
        this.onHSNChange(data);
        this.loadingHsn = false;
        this.cd.detectChanges();
      } else {
        this.loadingHsn = false;
        this.cd.detectChanges();
      }
    } catch (e) {
      this.loadingHsn = false;
      this.cd.detectChanges();
      console.log(e);
    }
  }

  onHSNChange(data: any) {
    console.log(data);

    this.form.patchValue({
      hsn: data.text,
    });
  }

  async onCategoryChange(data: any) {
    this.form.patchValue({
      productCatogories: data,
    });
  }

  onBusinessCategoryChange(data: any) {
    this.form.patchValue({
      buyerIndustries: data,
    });
  }

  //dynamic create form
  createForm(value?: any) {
    return this.fb.group({
      value: value || "",
    });
  }

  createAddional(value?: any,type:any='value') {
    return this.fb.group({
      [type]: value || "",
    });
  }

  //handle description and keyword case
  addCell(key) {
    debugger
    let feildName = this.form.get(key) as FormArray;
    feildName.push(this.createForm());
    if (key == "keyWordsList") {
      this.keyWordsList = feildName;
    } else {
      this.descriptions = feildName;
    }
  }

  async getProductInfo() {
    debugger
    if (this.data) {
      let data = {};
      this.userProduct = this.data;
      data["descriptionsOne"] =
        this.userProduct.descriptionList[0] &&
        this.userProduct.descriptionList[0].description;
      data["descriptionsTwo"] =
        this.userProduct.descriptionList[1] &&
        this.userProduct.descriptionList[1].description;
      this.customProductCategory = this.userProduct.customProductCatogories;
      this.buyerIndustries = this.userProduct.buyerIndustries;
      this.form.patchValue(this.userProduct);

      this.optionValue = this.userProduct.productType;
      // this.form.controls['productType'].patchValue(this.userProduct.productType)
      this.form.controls["supplyDetail"].patchValue(this.userProduct);
      this.form.patchValue(data);
      this.handleFormArray("keyWordsList", "productKeywords");
      this.handleFormArray("descriptions", "descriptionList");
      this.storeProductImages();
      this.arrList=this.data.additionalDetails;
      if (!this.userProduct.productKeywords) {
        this.addCell("keyWordsList");
      }
      this.cd.detectChanges();
    } else {
      this.data = {
        productCatogories: [],
        customProductCatogories: [],
      };
    }
  }

  setTag() {
    let array = this.userProduct.productCatogories.concat(
      this.userProduct.customProductCatogories
    );
    _.each(array, (item) => {
      this.customProductCategory.push({
        categoryId: item.name,
        productId: item.productId,
        name: item.name,
        id: item.categoryId,
      });
    });
  }

  //for displaying product images
  storeProductImages() {
    this.userProduct.productImages.forEach((key) => {
      if (key.imageName) {
        let array = key.imageName.split(",");
        array.forEach((value) => {
          let str = value.replace("?", "");
          if (str) {
            this.urls.push(str);
          }
        });
      }
    });
  }

  //for incresing fields of keyword and description
  handleFormArray(key, apiKey) {
    let keywords: any = [];
    if (apiKey == "descriptionList") {
      for (var i = 2; i < this.userProduct.descriptionList.length; i++) {
        keywords.push(this.userProduct.descriptionList[i].description);
      }
    } else {
      keywords =
        this.userProduct[apiKey] && this.userProduct[apiKey].split(",");
    }
    let formArray = this.form.controls[key] as FormArray;

    formArray.removeAt(0);
    _.each(keywords, (key) => {
      if (key) {
        formArray.push(this.createForm(key));
      }
    });
  }
  //Get the Quality image Count

  imageQuality(event){

  }

  //conversion of formobject into array
  formObjectToArray(list, value1?: string, value2?: string) {
    let desCount=0;
    let array: any = [];
    if (value1) {
      value1.length>=25?desCount=10:desCount=5
      array.push(value1);
    }
    if (value2) {
      desCount+5;
      array.push(value2);
    }
    if (list) {
      desCount+5;
      list.forEach((key) => {
        if (key.value) {
          array.push(key.value);
        }
      });
    }
    this.additionalDetails.map((item)=>{
      if(desCount<=100){
        desCount+10
      }
    })
    this.form.controls.description_ranking.setValue(desCount>=100?100:desCount)
    return array;
  }

  //Product images uploads
  async fileUpload(event) {
    let file = event.event;

    // let file = event.target.files[0];
    if (this.urls.length == 4) {
      this.toastr.error("Maximum four images can be uploaded.");
      return;
    }
    if (file) {
      this.imageLoading = true;
      // for (let file of files) {
        if (
          file.name.indexOf("jpg") >= 0 ||
          file.name.indexOf("png") >= 0 ||
          file.name.indexOf("jpeg") >= 0 ||
          file.name.indexOf("jpeg") >= 0 ||
          file.name.indexOf("gif") >= 0
        ) {
          let reader = new FileReader();
          // if (file.size < 1200000) {
            reader.onload = (e: any) => { };
            reader.readAsDataURL(file);
            try{
              let image = await this.service.uploadProductImages(file);
              this.urls.push(image);
              if(event&&event.imageSize){
                let count=0;
                if(event.imageSize.width<300||event.imageSize.height<300){
                  count=10
                }
                else{
                  count=25
                }
                this.imageRank.push(count)
              }
              this.cd.detectChanges();
            }
            catch(err){
              this.toastr.error(err);
            }
           
          // } else {
          //   this.toastr.error("Please Upload image Size less than 1 MB.");
          // }
        } else {
          this.toastr.error("Please Upload image of type .jpg,.gif,.png.");
          return;
        }
      // }
      this.imageLoading = false;
      this.cd.detectChanges();
    }
  }

  deleteImage(index) {
    this.urls.splice(index, 1);
    if(this.imageRank&&this.imageRank.length!=0){
      this.imageRank.splice(index, 1);
    }
  }

  //Post: data
  getFinalData() {
    let data: any = { supplyDetail: {} };
    let fiteredCategories = this.filterCategories();
    data["productCategory"] = fiteredCategories["productCategory"];
    data["customProductCategory"] = fiteredCategories["customProductCategory"];

    data.token = this.token ? this.token : this.activateRouter.snapshot.params;
    if (
      (this.isMember || this.isPending) &&
      !window.location.href.includes("business/profile")
    ) {
      data.mode = "SuperAdmin";
    }
    data.keyWords = this.formObjectToArray(this.form.value.keyWordsList);
    
    data.descriptions = this.formObjectToArray(
      this.form.value.descriptions,
      this.form.value.descriptionsOne,
      this.form.value.descriptionsTwo
    );
    let count=0;
    if(this.form.value.image_ranking){
      let itemCount=parseInt(this.form.value.image_ranking);
      count=itemCount
    }
    if(this.imageRank&&this.imageRank.length!=0){
      this.imageRank.map((item)=>{
        if(count>=100){
          count=100
        }
        else{
          count= count+item
        }
      })
    }

    this.form.controls.image_ranking.setValue(count)
    data.buyerIndustries = this.form.value.buyerIndustries || [];
    

    _.each(
      ["productType", "productName", "hsn", "unsbscProductCode",
       "videoLink",
      'description_ranking','image_ranking','addtionalDetails'],
      (key: string) => {
        data[key] = this.fields[key] || this.form.value[key];
      }
    );

debugger
    _.each(
      [
        "moq",
        "priceMin",
        "priceMax",
        "capacity",
        "supplyDurationTypeId",
        "unit",
        "quantityPerPack"
      ],
      (key: string) => {
        data.supplyDetail[key] =
         parseInt(this.form.value.supplyDetail[key]) || 0;
      }
    );
    return data;
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
      if (item.type === "productCategory") {
        categories.push(item.categoryId);
      } else {
        custom.push(item.name);
      }
    });

    return {
      customProductCategory: custom,
      productCategory: categories,
    };
  }

  fetchCategory(isCustom) {
    let productList: any = [];
    let customList: any = [];
    let array = this.form.value.productCatogories;
    _.each(array, (item) => {
      let index = _.findIndex(this._productCategory, { name: item.name });
      if (index > -1) {
        productList.push(this._productCategory[index].categoryId);
      } else if (Number(item.categoryId)) {
        productList.push(item.categoryId);
        customList.push(item.name);
      } else {
      }
    });
    return isCustom ? customList : productList;
  }

  hasControl(controlName: string) {
    return this.form.controls[controlName];
  }

  //submit
  async submit() {
    this.dymicKey.save()
    let validate: boolean = false;
    let controls = this.form.controls;
    let index = _.findIndex(this.list, {
      productName: this.form.value.productName,
    });
    if (index > -1) {
      this.product = this.list[index]["productName"];
    }
    console.log("form", this.form);
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
      let data = this.getFinalData();
      let res: any;
      let _description: string = "";
      try {
        if (this.data && !this.data.productId) {
          _description = "Product is Added.";

          //CHECK: 1.Member 2.then add member-profileAPi
          if (this.addMemberApi || this.addUserMemberProfile) {
            await this.addMemberProfile();
          }
          if (this.product != this.form.value.productName) {
            res = await this.service.AddProduct(data);
          }
          if (res.isProductAdded) {
            await this.uploadProductImages(res.productId, data.productName);
          }
        } else {
          data.productId = this.userProduct.productId;
          res = await this.service.updateProduct(data);

          if (res.isProductAdded) {
            await this.uploadProductImages(res.productId, encodeURI(data.productName));
          }
          _description = "Product is Updated.";
        }
        if ((res || {}).isProductAdded) {
        let getAll:any= await this.service.GetMemberCart();
          this.cartItemsList = (getAll.cartDetail&&getAll.cartDetail.length!=0)?getAll.cartDetail:(getAll.offersInCart&&getAll.offersInCart.length!=0)?getAll.offersInCart:[];
          this.loading = false;
          this.cd.detectChanges();
          if (
            this.cartItemsList.length != 0 &&
            !window.location.href.includes("member-profile")
          ) {
            Swal.fire({
              icon: "success",
              title: "Product is Updated.",
              showConfirmButton: window.location.href.includes("member-profile")
                ? false
                : this.urls.length > 0 || this.form.value.videoLink,
              showCancelButton: true,
              confirmButtonText: window.location.href.includes("member-profile")
                ? "Ok"
                : "Pay Now/Cart",
              cancelButtonText: "Ok",
            }).then((res: any) => {
              if (res.value == true) {
                this.service.broadcastEvent("CART_UPDATED", { cart_size: 2 });
                this.router.navigateByUrl("/p/dashboard/business/cart-details");
              } else if (res.dismiss == "cancel") {
                this.service.broadcastEvent("CART_UPDATED", { cart_size: 2 });
                this.refresh.emit({ refresh: true });
              }
            });
          } else {
            Swal.fire({
              icon: "success",
              title: "Product is Updated.",
              showConfirmButton: true,
            }).then((res: any) => {
              this.service.broadcastEvent("CART_UPDATED", { cart_size: 2 });
              this.service.broadcastEvent("SALES-LIST", null);

              // if (!window.location.href.includes("member-profile")) {
              // }
            });
          }
        } else {
          this.toastr.error("Error in sending product information");
          this.loading = false;
          this.cd.detectChanges();
        }
      } catch (e) {
        console.log("error", e);
        this.loading = false;
        this.cd.detectChanges();
      }
    }
  }
  getClass() {
    return window.location.href.includes("/member-profile")
      ? ""
      : "mandatory-field";
  }
  //product image upload
  async uploadProductImages(id, name) {
    let image = this.urls.join(",");
    await this.service.addProductImages(id, name, this.token, image);
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

  viewImage(image) {
    return this.service.getImageUrl(image, "GetDownload");
  }

  imageEdit(event) {
    const dialogRef = this.dialog.open(PhotoEditorComponent,{
      width:"80%",
      data:event,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      console.log("result", res);
      this.fileUpload(res)

      this.cd.detectChanges();
    });
  }

  openHsn() {
    const dialogRef = this.dialog.open(HsnListItemComponent);
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      console.log("result", res);
      let data = {
        text: res.hsnCode,
        id: res.hsnCode,
      };
      this.hsnLookUps.setHsnCode(data);
      this.onHSNChange(data);
      this.cd.detectChanges();
    });
  }
  removeFormValidation() {
    if (window.location.href.includes("/member-profile")) {
      this.form.get("productCatogories").clearValidators();
      this.form.get("productCatogories").updateValueAndValidity();
      this.form.get("descriptionsOne").clearValidators();
      this.form.get("descriptionsOne").updateValueAndValidity();
      this.form.get("productType").clearValidators();
      this.form.get("productType").updateValueAndValidity();
    }
  }
}
