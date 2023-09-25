import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  Input,
  ViewChild,
} from "@angular/core";
import { productData } from "../../../shared-component/sales/product-data";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { ProductService } from "../../../../../../provider/product-service/product-service.service";
import { LayoutUtilsService } from "../../../../../core/_base/crud";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../../../pages/auth/auth.service";
import { BaseService } from "../../../../../../provider/base-service/base.service";
import { InviteService } from "../../../../../../provider/invite/invite.service";

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
// import { SimilarSupplierComponent } from "../similar-supplier/similar-supplier.component";
import { EmailComponent } from "../../../auth/login-page/email/email.component";
import { ProductLookupComponent } from "../../../../../components/product-lookup/product-lookup.component";
import { SuperadminService } from "../../../../../../provider/superadmin/superadmin.service";
import { HsnLookupComponent } from "../../../../../components/hsn-lookup/hsn-lookup.component";
import Swal from "sweetalert2";

@Component({
  selector: "kt-create-rfq",
  templateUrl: "./create-rfq.component.html",
  styleUrls: ["./create-rfq.component.scss"],
})
export class CreateRfqComponent implements OnInit {
  productQuantityType: any = productData.ProductQuantityType;
  form: FormGroup;
  id: any;
  user: any = {
    token: "",
    pincode: "",
  };
  loading: boolean = false;
  picodeInfo: any = [];
  keyWords: any = [];
  memberData: any;
  searchName: any;
  emailPattern: RegExp;
  phoneNumberPattern: RegExp;
  @Input() info: any;
  @ViewChild("productLookUps", { static: false })
  public productLookUps: ProductLookupComponent;
  @ViewChild("hsnLookUps", { static: false })
  public hsnLookUps: HsnLookupComponent;
  enquiryId: any;
  isRfq: boolean;
  loadingImg: boolean;
  imageName=""
  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private fb: FormBuilder,
    private service: ProductService,
    private router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateRfqComponent>,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private superAdmin: SuperadminService,
    private base: BaseService,
    private inviteService: InviteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.emailPattern = this.base.emailPattern;
    this.phoneNumberPattern = this.base.phoneNumber;
    this.initForm();
    console.log("sr", this.form.value.productName);
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
      quantity: [null],
      quantityType: [null],
      hsnsacCode: [""],
      images: "",
      category: "",
      deliveryLocation: "",
      buyersEmail: [
        "",
        [Validators.pattern(this.emailPattern)],
      ],
      buyerCompanyName:"",
      buyerName:"",
      pincode:"",
      searchName: "",
      purchaserPincode:'',
      imageReference:"",
      buyersPhno: ["", [Validators.pattern(this.phoneNumberPattern)]],
    });
  }

  async selectPincode(event){
    console.log("sdfsdf========>",event.target.value);
    if(event.target.value&&event.target.value.length==6){
      let res: any = await this.service.getUserPincodeInfo(event.target.value);
      if (res.pincodeInfo) {
        this.picodeInfo = res.pincodeInfo;
        console.log("pincode", this.picodeInfo);
        this.form.patchValue({
          // deliveryPinCode: this.picodeInfo[0].pincode,
          deliveryLocation: this.picodeInfo[0].districtname,
        });
      }
    }
   
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
      // data.deliveryPinCode = this.memberData.location;
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
    } catch (err) { }
  }

  onHSNChange(data: any) {
    this.form.patchValue({
      hsnsacCode: data.text,
    });
  }

  async detectFiles(event: any) {
    debugger
    
    this.loadingImg = true;
    let checkImage = false;
    let files = event.target.files;
    let checkFileTypeValid = false;
    let checkFileSizeVaild = false;
    let reader = new FileReader();
    let canUpload = true;
    if (files) {
      for (let file of files) {
        if (
          file.name.indexOf("jpg") >= 0 ||
          file.name.indexOf("png") >= 0 ||
          file.name.indexOf("jpeg") >= 0 ||
          file.name.indexOf("jpeg") >= 0
        ) {
          checkFileTypeValid = true;
        } else {
          // alert("Please Upload image of type .jpg, .png.");
     
          this.toastr.error("Please Upload image of type .jpg, .png, .jpeg");
          if (!checkImage) 
          canUpload = false;
          this.form.controls.images.setValue("");
          checkFileTypeValid = false;
          break;
        }
        if (file.size < 300000) {
          checkFileSizeVaild = true;
        } else {
          //alert("Please Upload image Size less than 200 kB.")
          // this.isDiaPopupOpened = true;
          this.toastr.error("Please Upload image Size less than 300 kB.");
          // this.logoLoading = false;
          if (!checkImage) this.imageName = "";
          this.form.controls.images.setValue("");
          canUpload = false;
          checkFileSizeVaild = false;
          break;
        }
      }

      if (canUpload) {
        if (checkFileTypeValid) {
          reader.onload = (e: any) => { };
          reader.readAsDataURL(files[0]);
        }
        for (let file of files) {
        let res=await this.superAdmin.uploadImage(file);
        this.form.controls.images.setValue(res);
        this.imageName=files[0].name
        console.log("ll",res);
        }
      }
    }
  }

  //user pincode details
  async getPincodeDetails() {
    if (this.user.pincode) {
      let res: any = await this.service.getUserPincodeInfo(this.user.pincode);
      if (res.pincodeInfo) {
        this.picodeInfo = res.pincodeInfo;
        console.log("pincode", this.picodeInfo);
        this.form.patchValue({
          // deliveryPinCode: this.picodeInfo[0].pincode,
          deliveryLocation: this.picodeInfo[0].districtname,
        });
      }
    }
  }

  //POST : request for quote
  async submit() {
    let controls = this.form.controls;
    let info: any;
    if (this.form.invalid) {
      Object.keys(controls).forEach((key) => {
        controls[key].markAllAsTouched();
      });
      return;
    }
    if (this.form.valid) {
      if (!(this.form.value.buyersEmail || this.form.value.buyersPhno)) {
        Swal.fire({
          title: "Please Fill the Email Or Phone Number",
          icon: "warning",
          showCancelButton: false,
          confirmButtonText: "Ok",
        }).then((result: any) => {
        })
      return;

      }
    }
    this.loading = true;

    try {
      let delivery=""
      if(this.form.controls["purchaserPincode"].value&&this.form.controls["deliveryLocation"].value){
       delivery=this.form.controls["deliveryLocation"].value+"-"+this.form.controls["purchaserPincode"].value
      }
      else{
        delivery=this.form.controls["deliveryLocation"].value
      }
      info = {
        applicationKey: "IBiz",
        data: {
          searchName: '',
          email: this.form.controls["buyersEmail"].value,
          name: "",
          pinCode: delivery,
          companyId: 0,
          phoneNumber: this.form.controls["buyersPhno"].value,
          productName: this.form.controls["productName"].value,
          purchaserQuery: this.form.controls["purchaserQuery"].value,
          hsnsacCode: this.form.controls["hsnsacCode"].value,
          quantity: this.form.controls["quantity"].value
            ? this.form.controls["quantity"].value
            : 0,
          quantityType: this.form.controls["quantityType"].value
            ? this.form.controls["quantityType"].value
            : -1,
          category: "",
          keywords: this.keyWords,
          createBySuperAdmin: true,
          deliveryLocation: "",
          images: "",
          deliveryPinCode: "",
          otp: null,
          buyerCompanyName:this.form.controls["buyerCompanyName"].value,
          buyerName:this.form.controls["buyerName"].value,
          imageReference:this.form.controls["images"].value,
          purchaserPincode:this.form.controls["purchaserPincode"].value

        },
      };
      let result: any = await this.inviteService.nonHSNMemberEnquiry(info);
      if (result.hsnEnquiryId) {
        this.loading = false;
        this.cd.detectChanges();
        this.toastr.success("Successfuly sent the RFQ request");
        this.form.reset();
        this.productLookUps.resetProduct();
        this.getPincodeDetails();
        this.imageName=""
        this.dialogRef.close(true);
      } else {
        this.loading = false;
        this.cd.detectChanges();
        this.dialogRef.close(false);
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
        resolve(true);
      });
    });
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
    console.log("user", this.searchName);
  }
}
