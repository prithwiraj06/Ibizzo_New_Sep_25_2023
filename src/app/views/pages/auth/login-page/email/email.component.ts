import { Component, OnInit, ChangeDetectorRef, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { MatDialog } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ForgotPasswordComponent } from "../forgot-password/forgot-password.component";
import { SignUpService } from "../../../../../../../src/provider/sign-up/sign-up.service";
import { ToastrService } from "ngx-toastr";
// Store
import { Store } from "@ngrx/store";
import { AppState } from "../../../../../core/reducers";
import { Login } from "../../../../../core/auth";
import { Router } from "@angular/router";
import { RegisterPageComponent } from "../register-page/register-page.component";
import { ProductService } from "../../../../../../provider/product-service/product-service.service";
import { AuthService } from "../../../../../views/pages/auth/auth.service";
import { BaseService } from "../../../../../../provider/base-service/base.service";
import { UserProfileService } from "../../../../../../provider/user-profile/user-profile.service";
import { TermsAndConditionsComponent } from "../terms-and-conditions/terms-and-conditions.component";
import { InviteService } from "../../../../../../provider/invite/invite.service";
import { SharedVerifyModelComponent } from "../../../shared-component/shared-verify-model/shared-verify-model.component";
import { BaseUrlPipe } from "../../../../../core/_base/layout/pipes/base-url";

@Component({
  selector: "kt-email",
  templateUrl: "./email.component.html",
  styleUrls: ["./email.component.scss"],
})
export class EmailComponent implements OnInit {
  emailForm: FormGroup;
  passwordForm: FormGroup;
  email: any;
  password: any;
  userName: any;
  enterPassword: boolean = false;
  wrongPassword: boolean = false;
  fetching: boolean = false;
  emalPattern: RegExp;
  isAgreedForTandC: boolean;
  memberData: any;
  role: string;
  name: string;
  loading: boolean;
  isName: boolean;
  titleChange: boolean;
  isEnable: boolean;
  nonPhone: any;
  pincode: any;
  isPhone: boolean;
  isPin: boolean;
  isForm: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<EmailComponent>,
    private fb: FormBuilder,
    private signUpService: SignUpService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private store: Store<AppState>,
    private product: ProductService,
    private authService: AuthService,
    private base: BaseService,
    private userProfileService: UserProfileService,
    private router: Router,
    private baseUrlPipe: BaseUrlPipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private inviteService: InviteService
  ) { }

  ngOnInit() {
    this.emalPattern = this.base.emailPattern;
    this.initEmailForm();
  }

  initEmailForm() {
    this.emailForm = this.fb.group({
      email: [this.email, Validators.compose([Validators.required])],
    });

    this.passwordForm = this.fb.group({
      password: [this.password, Validators.compose([Validators.required])],
      userName: "",
    });
  }

  onSubmit() {
    let str = this.emailForm.value.email;
    this.email = str.replace(/\s/g, "");
    if (!this.emalPattern.test(this.email)) {
      this.toastr.error("pattern is incorrect");
      return;
    }
    const controls = this.emailForm.controls;
    /** check form */
    if (this.emailForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loading = true;
    this.cd.detectChanges();

    let data = {
      emailId: this.email,
      phoneNumber: this.email,
      applicationKey: "IBiz",
    };
    this.fetching = true;
    let value = this.signUpService.addUsername(data).then((res: any) => {
      this.fetching = false;
      if (res.isAuthenticated == true) {
        this.userName = res.userName;
        this.enterPassword = true;
        this.isEnable = false;
        this.loading = false;
        this.cd.detectChanges();
      } else {
        if (this.data && (this.data == "isRFQ" || this.data.isRFQ)) {
          this.enterPassword = true;
          this.isEnable = true;
          this.titleChange = true;
          this.loading = false;
          this.cd.detectChanges();
        } else {
          this.loading = false;
          this.dialogRef.close();
          this.toastr.error("This email is not Registered, please Register!");
          this.router.navigate([
            this.baseUrlPipe.transform(["/auth/register"]),
          ]);
          this.cd.detectChanges();
        }
      }
    });
  }

  onClose() {
    this.dialogRef.close();
    localStorage.removeItem("previousRfq");
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control =
      this.emailForm.controls[controlName] ||
      this.passwordForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    if (result) {
    }
    return result;
  }
  register() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(RegisterPageComponent, {
      width: "450px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }

  verifyPhone() {
    console.log("phon", this.nonPhone);
    return new Promise((resolved, reject) => {
      const dialogRef = this.dialog.open(SharedVerifyModelComponent, {
        data: {
          phone: this.nonPhone,
          isCheck: "RFQ",
        },
        width: "300px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          reject();
        }
        resolved(res);
      });
    });
  }

  onSubmitPass() {
    this.passwordForm.get("password").setValidators(Validators.required);
    const controls = this.passwordForm.controls;
    /** check form */
    if (this.passwordForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.loading = true;
    this.cd.detectChanges();
    let data = {
      email: this.email,
      phoneNumber: this.emailForm.controls["email"].value,
      password: this.passwordForm.controls["password"].value,
      applicationKey: "IBiz",
    };
    this.fetching = true;
    this.signUpService
      .addpassword(data)
      .then(async (userInfo: any) => {
        this.fetching = false;
        if (userInfo.isAuthenticated == true) {
          localStorage.setItem("memberData", JSON.stringify(userInfo));
          // check for the parner details
          if (this.authService.hasRole("Partner")) {
            userInfo.memberUserInfo.partnerInfo = await this.userProfileService.getOrganizationOwner(
              userInfo.token
            );
            localStorage.setItem("memberData", JSON.stringify(userInfo));
          }

          this.product.broadcastEvent("CART_UPDATED", { cart_size: 2 });
          if (this.data == "isRFQ" || this.data.isRFQ) {
            this.dialogRef.close(true);
          }
          this.cd.markForCheck();
        }
        if (userInfo.isAuthenticated == false) {
          this.wrongPassword = true;
          this.loading = false;
          this.toastr.error("Password is incorrect");
          return;
        } else {
          this.store.dispatch(new Login({ authToken: userInfo.token }));
          this.toastr.success("Logged-in successfully.");
          this.dialogRef.close(userInfo);
          this.role = this.authService.getRole();
          this.memberData = this.authService.getCurrentUser();
          this.isAgreedForTandC = this.memberData.isAgreedForTandC;
          if (JSON.parse(localStorage.getItem("liveRfq"))) {
            window.location.href = this.baseUrlPipe.transform([
              "/dashboard/business/sales/enquiry",
            ]);
          }
          console.log("dsandjksa", this.data);

          if (!this.data) {
            this.gotoDashboard();
          }
        }
        this.loading = true;
        this.cd.detectChanges();
      })
      .catch(() => {
        this.loading = true;
        this.dialogRef.close();
        this.cd.detectChanges();
      });
  }

  setName(text) {
    console.log("name", this.name);
    if (text == "name") {
      this.name == "" ? (this.isName = true) : (this.isName = false);
    } else if (text == "phone") {
      this.nonPhone == "" ? (this.isPhone = true) : (this.isPhone = false);
    } else if (text == "pin") {
      this.pincode == "" ? (this.isPin = true) : (this.isPin = false);
    }
  }

  gotoDashboard() {
    if (this.role == "Partner") {
      if (this.isAgreedForTandC) {
        window.location.href = this.authService.getDefaultDashboardUrl();
      } else {
        const dialogRef = this.dialog.open(TermsAndConditionsComponent, {
          width: "750px",
          height: "640px",
          disableClose: true,
          data: {
            partnerInfo: this.memberData.partnerInfo.name,
            token: this.memberData.id,
          },
        });
        dialogRef.afterClosed().subscribe((res) => {
          if (!res) {
            return;
          } else if (res == "updated") {
            window.location.href = this.authService.getDefaultDashboardUrl();
          }
        });
      }
    } else {
      window.location.href = this.authService.getDefaultDashboardUrl();
    }
  }

  forgotPassword() {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: "450px",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }
  async onSubmitResult() {
    this.loading = true;
    this.cd.detectChanges();

    if (this.name != "") {
      let rfq;
      let info;
      let result;
      let res: any = await this.verifyPhone();
      if (!res) {
        this.loading = false;
        this.cd.detectChanges();
        this.toastr.error("Failed to veriefing phone number");
        this.dialogRef.close(false);
      }
      if (this.data == "isRFQ") {
        rfq = JSON.parse(localStorage.getItem("previousRfq"));
        console.log("rfq", rfq);
        info = {
          applicationKey: "IBiz",
          request: {
            email: this.email,
            name: this.name,
            pinCode: this.pincode,
            companyId: 0,
            phoneNumber: res.phone,
            productId: rfq.productId,
            quantity: rfq.quantity,
            quantityType: rfq.quantityType,
            purchaserQuery: rfq.purchaserQuery,
            getQuoteFromAll: rfq.getQuoteFromAll,
            shareContact: true,
            otp: res.otp,
          },
        };
        result = await this.inviteService.nonMemberEnquiry(info);
        this.cd.detectChanges();
      } else {
        info = {
          applicationKey: "IBiz",
          data: {
            searchName: '',
            email: this.email,
            name: this.name,
            pinCode: this.pincode,
            companyId: 0,
            phoneNumber: res.phone,
            productName: this.data.isRFQ.productName,
            purchaserQuery: this.data.isRFQ.purchaserQuery,
            hsnsacCode: this.data.isRFQ.hsnsacCode,
            quantity: this.data.isRFQ.quantity ? this.data.isRFQ.quantity : 0,
            quantityType: this.data.isRFQ.quantityType
              ? this.data.isRFQ.quantityType
              : -1,
            category: this.data.isRFQ.category,
            deliveryLocation: this.data.isRFQ.deliveryLocation,
            imageReference: this.data.isRFQ.imageReference,
            deliveryPinCode: this.data.isRFQ.deliveryPinCode,
            otp: res.otp,
          }
        };
        result = await this.inviteService.nonHSNMemberEnquiry(info);
      }
      if (result.isEnquirySent || result.hsnEnquiryId) {
        this.loading = false;
        this.cd.detectChanges();
        this.toastr.success("Successfuly sent the RFQ request");
        this.dialogRef.close(true);
      } else {
        this.loading = false;
        this.cd.detectChanges();
        this.dialogRef.close(false);
      }
    }
  }
}
