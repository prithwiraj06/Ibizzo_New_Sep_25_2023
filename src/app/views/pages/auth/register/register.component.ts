// Angular
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmPasswordValidator } from "./confirm-password.validator";
import { SignUpService } from "../../../../../../src/provider/sign-up/sign-up.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material";
import { AppState } from "../../../../core/reducers";
import { Login } from "../../../../core/auth";
import { AuthService } from "../../../../views/pages/auth/auth.service";
import { TermsConditionComponent } from "../login-page/terms-condition/terms-condition.component";
import _ from "lodash";
import { PartnerService } from "../../../../../provider/partner/partner.service";
import { EmailComponent } from "../../../pages/auth//login-page/email/email.component";
import { BaseService } from "../../../../../provider/base-service/base.service";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { NavigationEnd, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { UserProfileService } from "../../../../../provider/user-profile/user-profile.service";
import { NgbPopoverConfig } from "@ng-bootstrap/ng-bootstrap";
import { SharedVerifyModelComponent } from "../../shared-component/shared-verify-model/shared-verify-model.component";

@Component({
  selector: "kt-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild("wizard", { static: true }) el: ElementRef;
  @ViewChild("productName", { static: true }) public productName: any;
  @ViewChild("productName", { static: true }) public producName: any;
  @ViewChild("d", { static: true }) public salesProduct: any;
  @ViewChild("d1", { static: true }) public purchaseProduct: any;

  private wizardInstance: any;
  public captchaResponse: any;
  businessCategories: any = [];
  loadingCategory: boolean = false;
  unsbcCategory: any = [];
  emailVerify: FormGroup;
  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  loading = false;
  isEmailVerified: boolean = true;
  nextButton: boolean = true;
  prevButton: boolean = false;
  categoryError: boolean = false;
  successPage: boolean = false;
  businessCategoryName: any = {};
  autoSuggestedDbProducts: any = [];
  loadingProducts: any = {
    productLoading: false,
    salesLoading: false,
    addBtnLoading: false,
  };

  public currentPartner: any;
  emailPattern: RegExp;
  phoneNumberPattern: RegExp;
  inputMode: string = "enabled";
  loadingEmail: any;
  userdata: string = "";
  namePattern: RegExp;
  temp: any;
  userData: any;
  invitedMember: any;
  userDetails: any;
  newMember: any;
  registerStep: boolean = false;
  constructor(
    private fb: FormBuilder,
    private signUpService: SignUpService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private partnerService: PartnerService,
    private base: BaseService,
    private baseUrlPipe: BaseUrlPipe,
    private router: Router,
    private store: Store<AppState>,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    config: NgbPopoverConfig
  ) {
    // customize default values of popovers used by this component tree
    config.placement = "right";
    config.triggers = "hover";
  }

  ngOnInit() {
    console.log("default", this.authService.getDefaultDashboardUrl());
    this.currentPartner = this.partnerService.getCurrentPartner();
    this.emailPattern = this.base.emailPattern;
    this.phoneNumberPattern = this.base.phoneNumber;
    this.namePattern = this.base.userName;
    this.initForm1();
    this.initForm2();
    this.initForm3();
  }
  

  onProductChange(data: any, type: string) {
    if (type == "producName") {
      this.form2.patchValue({
        producName: data.text,
        unsbcProductCode: data.id,
      });
    } else {
      this.form2.patchValue({
        purchaseProductName: data.text,
      });
    }
  }

  onBusinessCategoryChange(data: any) {
    this.unsbcCategory = data;
  }

  ngAfterViewInit() {
    // Initialize form wizard
    this.wizardInstance = new KTWizard(this.el.nativeElement, {
      startStep: 1,
      clickableSteps: false,
      manualStepForward: true,
    });

      var ele = document.getElementById("email");
      ele.scrollIntoView({ behavior: "smooth" });
  }

  async nextStep() {
    const step = this.wizardInstance.currentStep;
    switch (step) {
      case 1:
        this.checkAccountExists();
        break;

      case 2:
        this.validateForm2();
        break;

      case 3:
        this.submit();
        break;
    }
  }

  //ngx-tags input action
  onTagsChanged(event) {
    if (event.change == "add") {
      this.unsbcCategory.push({ unsbcCode: 0, name: event.tag.name });
    } else {
      let index = _.findIndex(this.unsbcCategory, { name: event.tag.name });
      if (index > -1) {
        this.unsbcCategory.splice(index, 1);
      }
    }
    this.categoryError = this.unsbcCategory.length > 0 ? false : true;
  }

  //push to the ngx-tags
  addCategory() {
    if (((this.businessCategoryName || {}).target || {}).value) {
      this.loadingProducts.addBtnLoading = true;
      setTimeout(() => {
        let index = _.findIndex(this.businessCategories, {
          name: this.businessCategoryName.target.value,
        });
        if (index == -1 && this.businessCategoryName.target.value) {
          this.unsbcCategory.push({
            unsbcCode: 0,
            name: this.businessCategoryName.target.value,
          });
          this.businessCategories.push({
            name: this.businessCategoryName.target.value,
          });
        }

        this.businessCategoryName.target.value = "";
        this.categoryError = this.unsbcCategory.length > 0 ? false : true;
        this.loadingProducts.addBtnLoading = false;
        this.productName.close();
        this.cd.detectChanges();
      }, 1000);
    }
  }

  //return the serach item in business category
  returnBusinessCategory(value) {
    this.businessCategoryName = value;
  }

  onChangePincode() {
    let form = this.form2.controls;
    if (form.location.value != "" && form.location.value != null) {
      this.userProfileService.getArea(form.location.value).then((res: any) => {
        if (res.pincodeInfo.length != 0) {
          this.form2.patchValue(res.pincodeInfo[0]);
          this.form2.controls.state.setValue(res.pincodeInfo[0].statename);
        }
      });
    }
  }

  //FORM1
  initForm1() {
    this.emailVerify = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.emailPattern),
        ],
      ],
    });
    this.form1 = this.fb.group({
      applicationKey: "IBiz",
      name: ["", Validators.required],
      companyName: ["", [Validators.required]],

      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(this.phoneNumberPattern)],
      ],
    });
    this.form1.disable();
  }

  //FORM2
  initForm2() {
    this.form2 = this.fb.group({
      businessCategoryName: "",
      producName: ["", Validators.compose([Validators.required])],
      purchaseProductName: ["", Validators.compose([Validators.required])],
      location: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]{6}$"),
        ]),
      ],
      productType: 1,
      state: [""],
      divisionname: [""],
      regionname: [""],
      circlename: [""],
      organizationId: this.currentPartner.id || 1,
      customOrganizationId: 140,
      unsbcProductCode: 0,
      OrgInfo: "/registration",
      locationType: 1,
    });
  }

  //FORM3
  initForm3() {
    this.form3 = this.fb.group(
      {
        username: ["", Validators.required],
        password: [
          "",
          Validators.compose([Validators.required, Validators.minLength(7)]),
        ],
        confirmPassword: [
          "",
          Validators.compose([Validators.required, Validators.minLength(7)]),
        ],
        confirm: false,
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  prevStep() {
    let step: number = this.wizardInstance.currentStep;
    if (step > 1) {
      step--;
    }
    if (step != 4) {
      this.nextButton = true;
    }
    this.wizardInstance.goTo();
    this.wizardInstance.goTo(step);
    this.cd.detectChanges();
  }

  validateForm2() {
    let controls = this.form2.controls;
    this.categoryError = this.unsbcCategory.length > 0 ? false : true;
    if (this.form2.invalid || this.categoryError) {
      this.toastr.warning("Please fill all the required fields to continue");
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    } else {
      this.registerStep = true;
      this.form3.patchValue({ username: this.emailVerify.value.email.trim() });
      this.onChangePincode();
      this.prevButton = true;
      this.wizardInstance.goTo();
      this.wizardInstance.goTo(3);
      this.cd.detectChanges();
    }
  }

  acceptTermsAndCondition(): void {
    const dialogRef = this.dialog.open(TermsConditionComponent, {
      width: "650px",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }
  t;
  resolvedCaptch(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
  }

  getClass() {
    return this.loadingEmail
      ? "kt-spinner kt-spinner--sm kt-spinner--light zero-font btn btn-primary"
      : "btn btn-primary";
  }

  async verify() {
    if (this.emailVerify.value.email&&!this.isControlHasError('email', 'pattern')) {
      this.temp = this.emailVerify.value;
      this.loadingEmail = true;
      this.cd.detectChanges();
      const result: any = await this.signUpService.addUsername(
        this.emailVerify.value
      );
      this.userData = await this.signUpService.verifyEmail(
        this.temp.email.trim()
      );
      if (this.userData.message == "ProfileUpdate") {
        this.userDetails = this.userData.userDetails;
      } else if (this.userData.message == "Invited") {
        this.userDetails = this.userData.inviteDetails;
      }
  
      if (this.userDetails) {
        this.form1.patchValue({
          applicationKey: "IBiz",
          name: this.userDetails.name,
          companyName: this.userDetails.companyName,
          phoneNumber: this.userDetails.phone || this.userDetails.phoneNumber,
        });
      }
  
      if (this.userData.message == "User Already Registered") {
        this.toastr.warning("Email address is already registered.");
        this.loadingEmail = false;
      } else {
        this.toggleInputLock("lock");
        this.loadingEmail = false;
      }
      this.cd.detectChanges();
    }
   
  }

  toggleInputLock(type: string) {
    if (type == "unlock") {
      this.inputMode = "enabled";
      this.form1.disable();
      this.emailVerify.enable();
      this.cd.detectChanges();
    } else if (type == "lock") {
      this.inputMode = "disabled";
      this.form1.enable();
      this.emailVerify.disable();
      this.cd.detectChanges();
    }
  }

  //SUBMIT:
  async submit() {
    this.temp = this.emailVerify.value;
    let controls = this.form3.controls;
    if (this.form3.invalid) {
      this.toastr.warning("Please fill all the required fields to continue");
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    if (!this.form3.value.confirm) {
      this.toastr.warning("Please agree Terms and Condition");
      return;
    }
    if (!this.captchaResponse) {
      this.toastr.warning("Please verify the Re-captcha");
      return;
    }

    let data = this.getFinalData();
    this.loading = true;
    data.unsbcCategory = this.unsbcCategory;
    data.email = data.email.trim();
    try {
      let res: any = null;
      // if (this.userData.inviteDetails) {
      //   data.id =
      //     this.userData.inviteDetails.id || this.userData.userDetails.id;
      //   data.confirmPassword = this.form3.value.confirmPassword;
      //   res = await this.signUpService.registerInvitedMember(data);
      // } else if (this.userData.userDetails) {
      //   data.id = this.userData.userDetails.id;
      //   data.confirmPassword = this.form3.value.confirmPassword;
      //   res = await this.signUpService.registerInvitedMember(data);
      // } else {
      //   res = await this.signUpService.registerUser(data);
      // }

      console.log("data", data);
      let verify: any = await this.verifyPhone();
      if (verify) {
        data.otp = verify.otp;
        data.phoneNumber = verify.phone;
        this.form1.controls.phoneNumber.patchValue(verify.phone);
        res = await this.signUpService.registerUser(data);
      }
      console.log("res", res);
      let userInfo: any;
      if (res.isRegistard) {
        userInfo = {
          email: this.temp.email.trim(),
          phoneNumber: this.form1.value.phoneNumber,
          password: this.form3.value.password,
          applicationKey: "IBiz",
        };
        this.base.LogIn(userInfo).then((res: any) => {
          localStorage.setItem("memberData", JSON.stringify(res));
          localStorage.setItem("isRegistered",'true')
          this.userdata = res.token;
          if (this.authService.hasRole("Partner")) {
            res.memberUserInfo.partnerInfo = this.userProfileService.getOrganizationOwner(
              userInfo.token
            );
            localStorage.setItem("memberData", JSON.stringify(res));
          }
        });
        this.nextButton = false;
        this.prevButton = false;
        this.toastr.success("Registered Successfully");
        this.loading = false;
        this.successPage = true;
        this.wizardInstance.goTo();
        this.wizardInstance.goTo(4);
        this.cd.detectChanges();
      } else {
        this.toastr.error("Registration Failed");
        this.loading = false;
        this.cd.detectChanges();
      }
    } catch (e) {
      this.toastr.error("Registration Failed");
      this.loading = false;
      this.cd.detectChanges();
    }
  }

  verifyPhone() {
    return new Promise((resolved, reject) => {
      const dialogRef = this.dialog.open(SharedVerifyModelComponent, {
        data: {
          phone: this.form1.value,
          isCheck: "Registration",
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

  getFinalData() {
    let data: any = {};
    _.each(
      [
        "name",
        "companyName",
        "phoneNumber",
        "email",
        "unsbcProductCode",
        "productType",
        "producName",
        "purchaseProductName",
        "location",
        "locationType",
        "customOrganizationId",
        "organizationId",
        "OrgInfo",
        "password",
        "state",
        "divisionname",
        "regionname",
        "circlename",
      ],
      (key: string) => {
        data[key] =
          this.emailVerify.value[key] ||
          this.form1.value[key] ||
          this.form2.value[key] ||
          this.form3.value[key];
      }
    );
    return data;
  }

  async checkAccountExists() {
    const controls = this.form1.controls;
    console.log("email form", this.form1.value);
    if (this.form1.invalid) {
      this.toastr.warning("Please fill all the required fields to continue");
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    try {
      this.loading = true;
      const result: any = await this.signUpService.addUsername(
        this.form1.value
      );
      if (result.isAuthenticated) {
        this.toastr.warning("Phone No is already registered.");
      } else {
        this.wizardInstance.goTo();
        this.wizardInstance.goTo(2);
      }
      this.prevButton = true;
      this.loading = false;
      this.cd.detectChanges();
      return false;
    } catch (e) {}
  }

  //search suggested products
  async suggestPurchaseProduct(value, key) {
    if (value) {
      this.loadingProducts[key] = true;
      try {
        let res: any = await this.signUpService.getAutoSuggestDBProduct({
          searchText: value,
          appKey: "IBiz",
        });
        if (res.totalRows > 0) {
          this.autoSuggestedDbProducts = res.suggestedProducts;
          this.loadingProducts[key] = false;
          this.cd.detectChanges();
        } else {
          this.loadingProducts[key] = false;
          this.toastr.error("No Result Found");
          this.cd.detectChanges();
        }
      } catch (e) {
        this.loadingProducts[key] = false;
        this.toastr.error("No Result Found");
        this.cd.detectChanges();
      }
    }
  }

  //patch value selectedproduct
  patchValue(value, key) {
    let data: any = {};
    data[key] = value;
    this.form2.patchValue(data);
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control =
      this.emailVerify.controls[controlName] ||
      this.form1.controls[controlName] ||
      this.form2.controls[controlName] ||
      this.form3.controls[controlName];
    // console.log("control", control);
    if (!control) {
      console.log("result");
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    if (result) {
      this.isEmailVerified = false;
    }
    return result;
  }

  GotoDashboard() {
    this.store.dispatch(new Login({ authToken: this.userdata }));
    if (JSON.parse(localStorage.getItem("liveRfq"))) {
      window.location.href = "/main/dashboard/business/sales/enquiry";
    } else {
      window.location.href = this.authService.getDefaultDashboardUrl();
    }
  }
  onStep3Next(event: any) {}
}
