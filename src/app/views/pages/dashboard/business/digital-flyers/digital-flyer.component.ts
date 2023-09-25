import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";

import * as _ from "underscore";
import { DigitalFlyerService } from "../../../../../../provider/digital-flyers/digital-flyer.service";
import { PartnerService } from "../../../../../../provider/partner/partner.service";
import { AuthService } from "../../../auth/auth.service";
import { PaymentjsService } from "paymentjs";
import { BaseUrlPipe } from "../../../../../core/_base/layout/pipes/base-url";
import { environment } from "../../../../../../environments/environment";
import { Router } from "@angular/router";
import { ProductService } from "../../../../../../provider/product-service/product-service.service";
import { UserProfileService } from "../../../../../../provider/user-profile/user-profile.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { EnquiryService } from "../../../../../../provider/enquiry/enquiry.service";
import { SuperadminService } from "../../../../../../provider/superadmin/superadmin.service";
import { async } from "@angular/core/testing";
import { ConditionalExpr } from "@angular/compiler";
import { SellerNotificationComponent } from "../../../shared-component/seller-notification/seller-notification.component";

@Component({
  selector: "kt-digital-flyer",
  templateUrl: "./digital-flyer.component.html",
  styleUrls: ["./digital-flyer.component.scss"],
})
export class DigitalFlyerComponent implements OnInit {
  sidebar: boolean;
  businessTypeList: any = [1, 2, 3, 4];
  organizations: any = [];
  form: FormGroup;
  receiptNumber: string;
  totalOfPay: number;
  totalWithGST: any;
  packageTypeId: any;
  subLoading: boolean;
  memberPackageDetails: any;
  totalMembers: number;
  paymentType: any;
  Filterdata: { key: string; value: any }[];
  filterData: any;
  fileName: any = "Choose the file";
  message: any;
  @ViewChild("content", { static: false }) contect: ElementRef;
  doc: unknown;
  loadingCount: boolean;
  fileLoading: boolean;
  timeoutHandler: any;
  leftCredits: number;
  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private digital: DigitalFlyerService,
    private partners: PartnerService,
    private payment: PaymentjsService,
    private authService: AuthService,
    private baseUrlPipe: BaseUrlPipe,
    private router: Router,
    private product: ProductService,
    private userProfile: UserProfileService,
    private toastr: ToastrService,
    private superAdmin: SuperadminService,
    private enquiryService: EnquiryService,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.createForm();
    this.getMemberCount();
    this.getPackageDetails();
    this.getCreditsDetails();
  }

  createForm() {
    this.form = this.fb.group({
      compaignName: ["", Validators.required],
      location: [""],
      bussinessCatagory: [""],
      groups: [""],
      hsn: [""],
      message: [""],
      info: [""],
      numberOfCom: [0],
      chooseFile: [""],
      website: ["", Validators.pattern("https?://.+")],
    });
  }

  decrement() {
    if (this.form.controls.numberOfCom.value > 0) {
      this.form.controls.numberOfCom.setValue(
        this.form.controls.numberOfCom.value - 1
      );
    }
  }

  increment() {
    if (this.totalMembers != this.form.controls.numberOfCom.value)
      this.form.controls.numberOfCom.setValue(
        this.form.controls.numberOfCom.value + 1
      );
  }

  onHSNChange(data) {
    let str = "";
    _.each(data, (item, i) => {
      if (data.length != i + 1) {
        str += item.name + ",";
      } else {
        str += item.name;
      }
    });
    this.form.controls.hsn.patchValue(str);
    this.getMemberCount();
  }

  onOrgChange(data) {
    let str = "";
    _.each(data, (item, i) => {
      if (data.length != i + 1) {
        str += item.unsbcCode + ",";
      } else {
        str += item.unsbcCode;
      }
    });
    this.form.controls.groups.patchValue(str);
    this.getMemberCount();
  }

  onBusinessChange(data) {
    let str = "";
    _.each(data, (item, i) => {
      if (data.length != i + 1) {
        str += item.name + ",";
      } else {
        str += item.name;
      }
    });
    this.form.controls.bussinessCatagory.patchValue(str);
    this.getMemberCount();
  }

  onLocation(data) {
    let str = "";
    _.each(data, (item, i) => {
      if (data.length != i + 1) {
        str += item.name + ",";
      } else {
        str += item.name;
      }
    });
    this.form.controls.location.patchValue(str);
    this.getMemberCount();
  }
  getCreditsDetails() {
    return new Promise(async (resolve) => {
      this.enquiryService
        .getUserCredits(this.authService.getUserId())
        .then((res: any) => {
          this.leftCredits = res.userDetails.flyerCredits || 0;
          this.cd.detectChanges();
          resolve(true);
        });
      this.cd.detectChanges();
    });
  }

  onFileChange(event: any) {
    this.fileLoading = true;
    let docFiles = event.target.files;
    for (let docFile of docFiles) {
      if (docFile.size < 5000000) {
        this.userProfile
          .uploadFlyerDocument(docFile)
          .then((res) => {
            this.fileName = docFiles[0].name;
            this.fileLoading = false;
            this.cd.detectChanges();
            this.doc = res;
          })
          .catch((err: any) => {
            this.fileLoading = false;
            this.cd.detectChanges();
            this.toastr.error("Image is not Uploaded");
          });
      } else {
        this.fileLoading = false;
        this.toastr.error("Please Upload image Size less than 2 MB");
        break;
      }
    }
  }

  public mouseup() {
    if (this.timeoutHandler) {
      clearInterval(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }

  public mousedown() {
    this.timeoutHandler = setInterval(() => {
      if (this.totalMembers != this.form.controls.numberOfCom.value)
        this.form.controls.numberOfCom.setValue(
          parseInt(this.form.controls.numberOfCom.value) + 1
        );
    }, 100);
  }

  public mouseupDecrement() {
    if (this.timeoutHandler) {
      clearInterval(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }

  public mousedownDecrement() {
    this.timeoutHandler = setInterval(() => {
      if (this.form.controls.numberOfCom.value != 0)
        this.form.controls.numberOfCom.setValue(
          this.form.controls.numberOfCom.value - 1
        );
    }, 100);
  }

  getMemberCount() {
    this.loadingCount = true;
    this.cd.detectChanges();
    this.filterData = [
      {
        key: "Location",
        value: this.form.controls.location.value,
        dataType: "string",
      },
      {
        key: "BusinessCategory",
        value: this.form.controls.bussinessCatagory.value,
        dataType: "string",
      },
      {
        key: "Groups",
        value: this.form.controls.groups.value,
        dataType: "string",
      },
      {
        key: "HSN_SACCode",
        value: this.form.controls.hsn.value,
        dataType: "string",
      },
    ];
    let content = {
      type: "string",
      filters: this.filterData,
      token: "string",
      code: "string",
    };
    this.digital
      .getNumOfMember(content)
      .then((res: any) => {
        this.totalMembers = parseInt(res.noOfMembers);
        this.form.controls.numberOfCom.patchValue(res.noOfMembers);
        this.loadingCount = false;
        this.cd.detectChanges();
      })
      .catch((err) => {
        this.loadingCount = false;
        this.cd.detectChanges();
      });
  }

  async getPackageDetails() {
    try {
      this.memberPackageDetails = await this.product.getCartPackages(4);
    } catch (e) {
      console.log(e);
    }
  }
  async previewFlyer() {
    const controls = this.form.controls;
    if (this.form.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.userProfile
      .getProfile(this.authService.getUserId())
      .then((res: any) => {
        debugger;
        console.log("member", res);
        let item: any = {
          compaignName: this.form.controls.compaignName.value,
          compnayImage:(res.userDetails.companyImages&&res.userDetails.companyImages.length!=0)? res.userDetails.companyImages[0].imageName:'',
          email: res.userDetails.email,
          fileName: this.fileName ? this.doc : null,
          id: res.userDetails.id,
          location: res.userDetails.location,
          logo: res.userDetails.logo,
          message: this.contect.nativeElement.value,
          phoneNumber: res.userDetails.phoneNumber,
          productId: 0,
          productName: null,
          senderCompany: res.userDetails.companyName,
          senderCompanyId: res.userDetails.companyId,
          senderId: res.userDetails.id,
          senderName: res.userDetails.name,
          isPreview: true,
          flyerType: "digitalFlyers",
          website:this.form.controls.website.value
        };
        const dialogRef = this.dialog.open(SellerNotificationComponent, {
          data: item,
        });
        dialogRef.afterClosed().subscribe(async (result) => {
          console.log("result");
          if (!result) {
            return;
          }
        });
      });
  }
  async submit() {
    const controls = this.form.controls;

    let remainCredits: any;
    if (this.form.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    console.log("numbe", this.form.controls.numberOfCom.value);
    this.totalOfPay =
      this.form.controls.numberOfCom.value *
        this.memberPackageDetails.packageDetails[0].price <=
      60
        ? 60
        : this.form.controls.numberOfCom.value *
          this.memberPackageDetails.packageDetails[0].price;
    if (
      this.form.controls.numberOfCom.value > 0 &&
      this.form.controls.numberOfCom.value <= this.totalMembers
    ) {
      if (this.totalOfPay >= this.leftCredits) {
        this.totalOfPay = this.totalOfPay - this.leftCredits;
        remainCredits = 0;
      } else {
        remainCredits = this.leftCredits - this.totalOfPay;
        this.totalOfPay = 0;
      }
      console.log("credits", remainCredits);
      console.log("totol", this.totalOfPay);
      this.totalOfPay = this.totalOfPay > 999 ? 999 : this.totalOfPay;
      this.subLoading = true;
      await Swal.fire({
        title:
          "You have " +
          this.leftCredits +
          " credits and you need to pay " +
          this.totalOfPay +
          " INR",
        text: "Would you like to continue?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel",
      }).then(async (result: any) => {
        if (result && result.value) {
          if (this.totalOfPay != 0) {
            await this.proceedToPay();
            let res: any = await this.superAdmin.updateCreditsForPartners(
              remainCredits,
              this.authService.getUserId()
            );
          } else {
            await this.sendCampaignWithoutPayment();
            let res: any = await this.superAdmin.updateCreditsForPartners(
              remainCredits,
              this.authService.getUserId()
            );
          }
        } else {
          return;
        }
      });
    } else {
      this.toastr.error(
        "Flyers count is greater then 0 or less then Total flyers count"
      );
    }
  }

  sendCampaign() {
    let package_: any = this.memberPackageDetails.packageDetails[0];
    let info = {
      memberCompanyId: this.authService.getCompanyId(),
      memberId: this.authService.getUserId(),
      targetedBuyers: this.form.controls.numberOfCom.value,
      paymentInfo: {
        razorpay_order_id:
          this.paymentType.raw_response.razorpay_order_id || "",
        razorpay_payment_id: this.paymentType.trxn_id,
        razorpay_signature: this.paymentType.razorpay_signature || "",
        amountPaid: this.paymentType.total_amount,
        taxAmount: 0,
      },
      packageDetails: {
        id: package_.id,
        packageDetailId: package_.packageTypeId,
        packageDetailName: package_.name,
        appSecretKeyPassed: environment.APP_SECRET_KEY,
        price: package_.price,
        quantity: package_.quantity,
        durationType: package_.durationType,
        prdId: package_.prdId,
        prdName: package_.prdName,
        totalAmountPaid: package_.totalAmountPaid,
      },
      filters: this.filterData,
      fileName: this.doc,
      message: this.contect.nativeElement.value,
      compaignName: this.form.controls.compaignName.value,
      website:this.form.controls.website.value,
      token: "IBizzo",
      amountPaid: this.paymentType.total_amount,
    };
    this.digital.postDigitalFlyer(info);
    this.toastr.success(
      "Initiated successfully, The operation might take few minutes to complete."
    );
    setTimeout(() => {
      this.subLoading = false;
      this.router.navigate([
        "/main/dashboard/business/digital-markting/my-campaign",
      ]);
    }, 4000);
  }

  sendCampaignWithoutPayment() {
    let package_: any = this.memberPackageDetails.packageDetails[0];
    console.log("package", package_);
    let info = {
      memberCompanyId: this.authService.getCompanyId(),
      memberId: this.authService.getUserId(),
      targetedBuyers: this.form.controls.numberOfCom.value,
      packageDetails: {
        id: package_.id,
        packageDetailId: package_.packageTypeId,
        packageDetailName: package_.name,
        appSecretKeyPassed: environment.APP_SECRET_KEY,
        price: package_.price,
        quantity: package_.quantity,
        durationType: package_.durationType,
        prdId: package_.prdId,
        prdName: package_.prdName,
        totalAmountPaid: package_.totalAmountPaid,
      },
      filters: this.filterData,
      fileName: this.doc,
      message: this.contect.nativeElement.value,
      compaignName: this.form.controls.compaignName.value,
      website:this.form.controls.website.value,
      token: "IBizzo",
      amountPaid: this.totalOfPay,
    };
    this.digital.postDigitalFlyer(info);
    this.toastr.success(
      "Initiated successfully, The operation might take few minutes to complete."
    );
    setTimeout(() => {
      this.subLoading = false;
      this.router.navigate([
        "/main/dashboard/business/digital-markting/my-campaign",
      ]);
    }, 4000);
  }

  async proceedToPay() {
    let CGST = (this.totalOfPay * 0) / 100;
    let SGST = (this.totalOfPay * 0) / 100;
    this.totalWithGST = this.totalOfPay + CGST + SGST;
    this.receiptNumber = `Receipt#${
      Math.floor(Math.random() * 5123 * 43) + 10
    }`;
    const currentUser: any = this.authService.getCurrentUser();
    localStorage.setItem("receiptNum", JSON.stringify(this.receiptNumber));
    localStorage.setItem("totalInvoice", JSON.stringify(this.totalWithGST));

    let orderDetails = {
      email: currentUser.email,
      phonenumber: currentUser.phoneNumber,
      amount: this.totalOfPay,
      receipt: this.receiptNumber,
      currency: "INR",
      payment_capture: 1,
      username: environment.RAZORPAY_PUBLIC_KEY,
      description: "",
    };

    let addCardSnap = {
      secretKey: environment.CARTSNAP_SECRET_KEY,
      applicationKey: "IBiz",
      memberId: this.authService.getUserId(),
      Type: 3,
      // ReferenceId: this.receiptNumber
    };
    try {
      let res: any = await this.digital.addMemberCartSnapshot(addCardSnap);
      if (res) {
        orderDetails.description = res.referenceId + "#~#DIGITALFLYERS" || "";
        event.preventDefault();
        const response: any = await this.payment.checkout({
          paymentInstrument: "payment_razorpay",
          params: orderDetails,
        });
        this.paymentResponseHander(response);
      }
    } catch (e) {
      this.subLoading = false;
      this.cd.detectChanges();
    }
  }

  paymentAdded;
  paymentResponseHander(response) {
    try {
      if (response.trxn_id) {
        this.paymentType = response;
        let x = this.returnPaymentData(response);
        this.product.addMemberPackageDetail(x).then((Response) => {
          this.paymentAdded = Response;

          if (response.trxn_id != null) {
            this.sendCampaign();
          }
        });
      } else {
        this.subLoading = false;
        this.router.navigate([
          this.baseUrlPipe.transform(["/dashboard/business/payment/error"]),
        ]);
      }
    } catch (Exp) {
      this.subLoading = false;
      this.router.navigate([
        this.baseUrlPipe.transform(["/dashboard/business/payment/error"]),
      ]);
    }
  }

  returnPaymentData(response) {
    debugger;
    let data = {
      token: this.authService.getUserId(),
      packageId: this.packageTypeId || 0,
      offerId: 1,
      appSecretKeyPassed: environment.APP_SECRET_KEY,
      referenceId: this.receiptNumber,
      transationDetails: {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.trxn_id,
        razorpay_signature: response.razorpay_signature,
        amountPaid: this.totalOfPay,
        taxAmount: 0,
      },
      packageDetails: this.memberPackageDetails.packageDetails || "",
      applicationKey: "IBiz",
      secretKey: environment.APP_SECRET_KEY,
    };

    return data;
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
}
