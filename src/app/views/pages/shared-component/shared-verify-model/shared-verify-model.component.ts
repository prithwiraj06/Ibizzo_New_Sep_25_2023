import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SignUpService } from "../../../../../provider/sign-up/sign-up.service";
import { ToastrService } from "ngx-toastr";
import { UrlHandlingStrategy } from "@angular/router";

@Component({
  selector: "kt-shared-verify-model",
  templateUrl: "./shared-verify-model.component.html",
  styleUrls: ["./shared-verify-model.component.scss"],
})
export class SharedVerifyModelComponent implements OnInit {
  phone: any;
  isEnable: boolean;
  isEnableLength: any;
  enableEdit: boolean = true;
  otpNumber: any;
  constructor(
    public dialogRef: MatDialogRef<SharedVerifyModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public signUpService: SignUpService,
    public toastr: ToastrService
  ) {}

  ngOnInit() {
    this.phone = this.data.phone.phoneNumber
      ? this.data.phone.phoneNumber
      : this.data.phone;
    console.log(this.data);

    this.sent();
  }

  async sent() {
    this.otpNumber = "";
    if (this.data.isCheck && this.phone) {
      let url =
        this.data.isCheck == "Registration"
          ? "SendSMSOtpRegistration"
          : "SendSMSOtpRFQ";
      let data = {
        applicationKey: "IBiz",
        companyName: this.data.companyName,
        name: this.data.name,
        phoneNumber: this.phone,
      };
      const result: any = await this.signUpService.addUsername(data);
      console.log("result", result);
      if (result.isAuthenticated) {
        this.toastr.warning("Phone No is already registered.");
      } else {
        let res: any = await this.signUpService.sendRegistrationOtp(
          this.phone,
          url
        );
        if (res.isSmsSent) {
          let message = res.message;
          this.toastr.success(
            message.includes("OTP_ALREADY_SENT")
              ? "Already sent OTP"
              : "OTP sent to your phone number"
          );
        } else {
          this.toastr.error("Failed to sent OTP");
        }
      }
    } else {
      this.comparePhone();
    }
  }

  comparePhone() {
    if (!this.phone) {
      this.isEnable = true;
      this.isEnableLength = false;
    } else if (this.phone.length < 10 && this.phone.length > 0) {
      this.isEnableLength = true;
      this.isEnable = false;
    } else {
      this.isEnableLength = false;
      this.isEnable = false;
    }
  }

  compare() {}

  editPhone() {
    this.enableEdit = !this.enableEdit;
    console.log(this.enableEdit);
  }

  async verifyOTP() {
    if (!this.otpNumber) {
      this.toastr.error("Please Enter the otp");
      return;
    }
    let param = {
      memberId: 0,
      sentTo: this.phone,
      operation: "string",
      otp: this.otpNumber,
    };
    let url =
      this.data.isCheck == "Registration"
        ? "Register/VerifyOTPForRegister"
        : "User/VerifyOTPForRFQ";

    let res: any = await this.signUpService.verifyOtp(param, url);
    console.log(res);
    if (res.isOTPVerified) {
      let option = {
        otp: this.otpNumber,
        phone: this.phone,
      };
      this.toastr.success("Phone number is verified successfully");
      this.dialogRef.close(option);
    } else {
      this.toastr.error("Failed to varify OTP");
    }
  }
}
