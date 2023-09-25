import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  Input,
  ViewChild,
} from "@angular/core";
import { productData } from "../../shared-component/sales/product-data";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { ProductService } from "../../../../../provider/product-service/product-service.service";
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../../pages/auth/auth.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import { SimilarSupplierComponent } from "../similar-supplier/similar-supplier.component";
import { EmailComponent } from "../../auth/login-page/email/email.component";
import { ProductLookupComponent } from "../../../../components/product-lookup/product-lookup.component";
import { SuperadminService } from "../../../../../provider/superadmin/superadmin.service";
import { HsnLookupComponent } from "../../../../components/hsn-lookup/hsn-lookup.component";

@Component({
  selector: "kt-rfq-without-id",
  templateUrl: "./rfq-without-id.component.html",
  styleUrls: ["./rfq-without-id.component.scss"],
})
export class RfqWithoutIdComponent implements OnInit {
  productQuantityType: any = productData.ProductQuantityType;
  form: FormGroup;
  id: any;
  user: any = {
    token: "",
    pincode: "",
  };
  loading: boolean = false;
  picodeInfo: any = [];
  memberData: any;
  searchName: any;
  @Input() info: any;
  @ViewChild("productLookUps", { static: false })
  public productLookUps: ProductLookupComponent;
  @ViewChild("hsnLookUps", { static: false })
  public hsnLookUps: HsnLookupComponent;
  enquiryId: any;
  isRfq: boolean;
  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private fb: FormBuilder,
    private service: ProductService,
    private router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RfqWithoutIdComponent>,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private superAdmin: SuperadminService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.initForm();
    window.location.href.includes('?productName=')?this.form.controls.productName.patchValue(decodeURI(window.location.href.split("?productName=")[1])):''
    this.isRfq = window.location.href.includes("business/quote") ? true : false;
    this.memberData = this.authService.getCurrentUser();
    this.patchValue(this.info);
    let res: any = JSON.parse(localStorage.getItem("memberData"));
    if (res && res.token) {
      this.user.token = res.token;
      this.user.pincode = res.memberUserInfo.location;
    }
    this.getPincodeDetails();
  }

  initForm() {
    this.form = this.fb.group({
      productName: ["", Validators.required],
      purchaserQuery: ["", Validators.required],
      quantity: [null ],
      quantityType: [null],
      hsnsacCode: "",
      imageReference: "",
      category: "",
      deliveryLocation: "",
      deliveryPinCode: "",
      searchName: "",
      lastDate: "",
    });
  }

  patchValue(id) {
    let data: any = {};
    let productDetails: any = JSON.parse(
      localStorage.getItem("RFQ_PRODUCT_" + id)
    );
    if (productDetails) {
      data.productName = productDetails.productName;
      data.hsnsacCode = productDetails.hsn;
      data.quantityType = parseInt(productDetails.unitTypeId) || undefined;
      data.quantity = parseInt(productDetails.annualRequirement);
      data.purchaserQuery = productDetails.productSpecification;
      data.deliveryPinCode = this.memberData.location;
      // data.lastDate = moment(productDetails.lastDate).format('YYYY-MM-DD');
      this.form.patchValue(data);
    }
  }

  async onProductChange(data: any) {
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
        this.hsnLookUps.setHsnCode(data);
        this.onHSNChange(data);
        this.cd.detectChanges();
      }
    } catch (err) {}
  }

  onHSNChange(data: any) {
    this.form.patchValue({
      hsnsacCode: data.text,
    });
  }

  //user pincode details
  async getPincodeDetails() {
    if (this.user.pincode) {
      let res: any = await this.service.getUserPincodeInfo(this.user.pincode);
      if (res.pincodeInfo) {
        this.picodeInfo = res.pincodeInfo;
        this.form.patchValue({
          deliveryPinCode: this.picodeInfo[0].pincode,
          deliveryLocation: this.picodeInfo[0].districtname,
        });
      }
    }
  }

  //upload file
  async fileUpload(event) {
    let reader = new FileReader();
    let files = event.target.files;
    reader.onload = (e: any) => {};
    reader.readAsDataURL(files[0]);
    if (files) {
      for (let file of files) {
        if (file.size < 1200000) {
          let image = await this.service.uploadImage(file);
          this.form.value.imageReference = image;
        } else {
          this.toastr.error("Please Upload image Size less than 1 MB.");
        }
      }
    }
  }

  //POST : request for quote
  async submit() {
    let controls = this.form.controls;
    let isCheck: boolean;
    if (this.form.invalid) {
      Object.keys(controls).forEach((key) => {
        controls[key].markAllAsTouched();
      });
      return;
    }
    try {
      this.loading = true;
      this.form.value.memberId = parseInt(this.user.token);
      if (!this.authService.getUserId()) {
        isCheck = true;
        try {
          await this.authentication();
          if (this.authService.getUserId()) {
            this.form.value.memberId = this.authService.getUserId();
          } else {
            this.loading = false;
            this.cd.detectChanges();
            this.dialogRef.close();
            return;
          }
        } catch (e) {
          this.loading = false;
          this.cd.detectChanges();
          return;
        }
      }
      this.form.value.searchName = this.searchName ? this.searchName : "";
      this.form.value.quantityType=this.form.value.quantityType?this.form.value.quantityType:-1;
      this.form.value.quantity=this.form.value.quantity?this.form.value.quantity:0;
      
      let res: any = await this.service.postRfqForProduct(this.form.value);
      if (res) {
        localStorage.removeItem("RFQ_PRODUCT_" + this.id);
        this.toastr.success("Your Request has been posted.");
        this.loading = false;
        this.cd.detectChanges();
        const _title: string = "Success";
        const _description: string = "Your Request has been posted.";
        const _cancelText: string = "Similar Products";
        const submit: string = "Cancel";
        const textOne: string = "Get Quotes For Similar Products";
        const textTwo: string = "Click on similar products to view the list.";
        this.enquiryId = res.enquiryId || res.hsnEnquiryId;

        const dialogRef = this.layoutUtilsService.ActionElement(
          _title,
          _description,
          _cancelText,
          submit,
          textOne,
          textTwo
        );
        this.loading = false;
        this.cd.detectChanges();
        dialogRef.afterClosed().subscribe(async (res) => {
          if ((res || {}).searchHsn) {
            this.hsnProductSearch();
          } else {
            this.loading = false;
            this.dialogRef.close();
            if (!(this.data == "groups")) {
              isCheck
                ? window.location.reload()
                : this.router.navigateByUrl("dashboard/purchase/catalogue");
            }
            this.cd.detectChanges();
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  authentication() {
    let user = {
      isRFQ: this.form.value,
    };
    return new Promise((resolve, rejects) => {
      const dialogRef = this.dialog.open(EmailComponent, {
        width: "450px",
        data: user,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          rejects();
          return;
        }
        resolve();
      });
    });
  }

  //searching for similar hsn
  async hsnProductSearch() {
    try {
      let response: any = await this.service.getHsnProduct(
        this.user.token,
        this.form.value.hsnsacCode
      );
      if (response.userProducts.length == 0) {
        const _title: string = "Success";
        const _description: string = "Similar Suppliers";
        const _cancelText: string = "Cancel";
        const submit: string = "";
        const textOne: string = "Sorry there is no match found";
        const textTwo: string =
          "Are you looking for any other Products? Please click on RFQ.";
        const dialogRef = this.layoutUtilsService.ActionElement(
          _title,
          _description,
          _cancelText,
          submit,
          textOne,
          textTwo
        );
        dialogRef.afterClosed().subscribe(async (res) => {
          if ((res || {}).resetForm) {
            this.form.reset();
            this.productLookUps.resetProduct();
            this.getPincodeDetails();
          } else {
            if (!(this.data == "groups")) {
              this.router.navigateByUrl("dashboard/purchase/catalogue");
            }
            this.dialogRef.close();
          }
        });
      } else {
        console.log("data", this.form.value);
        let supplers = {
          user: response,
          id: this.enquiryId,
          from: "dashboard",
          quantity: this.form.value.quantity,
          quantityType: this.form.value.quantityType,
        };
        const dialogRef = this.dialog.open(SimilarSupplierComponent, {
          disableClose: true,
          data: supplers,
        });
        dialogRef.afterClosed().subscribe((res) => {
          if (!res) {
            return;
          }
        });
      }
    } catch (e) {
      console.log(e);
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
  onTextChange(user: string) {
    this.searchName = user;
    console.log("user", this.searchName);
  }
}
