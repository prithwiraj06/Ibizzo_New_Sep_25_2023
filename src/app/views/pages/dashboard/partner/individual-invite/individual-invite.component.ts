import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { InviteService } from "../../../../../../provider/invite/invite.service";
import { PartnerService } from "../../../../../../provider/partner/partner.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { InviteSettingsComponent } from "../../../shared-component/invite-settings/invite-settings.component";
import { BaseService } from "../../../../../../provider/base-service/base.service";
import { AuthService } from "../../../../../views/pages/auth/auth.service";
import { BaseUrlPipe } from "../../../../../core/_base/layout/pipes/base-url";
import { UserProfileService } from "../../../../../../provider/user-profile/user-profile.service";
import _ from "lodash";

@Component({
  selector: "kt-individual-invite",
  templateUrl: "./individual-invite.component.html",
  styleUrls: ["./individual-invite.component.scss"],
})
export class IndividualInviteComponent implements OnInit {
  @ViewChild("wizard", { static: true }) el: ElementRef;
  @ViewChild("invitationComposer", { static: false })
  invitationComposer: InviteSettingsComponent;

  //properties
  form: FormGroup;
  formDetails: FormGroup;
  validate: boolean = false;
  loading: any = {
    submit: false,
    inviteLoading: false,
    updateLoading: false,
    profile: false,
  };
  isDisable:any=false;
  allowInvite: boolean = false;
  wizardInstance: any;
  result: any = {};
  next: number = 1;
  partnerUser: any;
  individualForm: any;
  emailPattern: any;
  pinCodePattern: any;
  text: any;
  public currentPartner: any;
  constructor(
    private formBuilder: FormBuilder,
    private inviteService: InviteService,
    private toastr: ToastrService,
    private base: BaseService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private partner: PartnerService,
    private authService: AuthService,
    private baseUrlPipe: BaseUrlPipe,
    private userService: UserProfileService,
    private partnerService: PartnerService
  ) {}

  ngOnInit() {
    this.currentPartner = this.partnerService.getCurrentPartner();
    this.emailPattern = this.base.emailPattern;
    this.pinCodePattern = this.base.pincode;
    this.partnerUser = this.authService.getCurrentUser();
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(this.emailPattern),
        ]),
      ],
    });
  }

  ngAfterViewInit(): void {
    this.wizardInstance = new KTWizard(this.el.nativeElement, {
      startStep: 1,
      manualStepForward: true,
    });
  }

  async inviteMember(redirectToProfileUpdate: boolean) {
    redirectToProfileUpdate = !!redirectToProfileUpdate;

    this.validateForm();
    if (this.validate) {
      this.individualForm = this.formDetails.value;
      this.individualForm.isReferal = false;
      this.individualForm.memberCompanyID = this.authService.getCompanyId();
      this.individualForm.toAddress = this.form.value.email;
      (this.individualForm.email = this.form.value.email),
        (this.individualForm.phone = this.individualForm.phone.toString());
      this.individualForm.code = "";

      this.next = 3;
      this.wizardInstance.goTo();
      this.wizardInstance.goTo(3);
      this.cd.detectChanges();
    }
  }

  validateForm() {
    const controls = this.formDetails.controls;
    if (this.formDetails.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.toastr.error("Enter the required fields");

      this.validate = false;
    } else {
      this.validate = true;
    }
  }

  async addTemplate(key, rootValidate) {
    let data = null;
    this.loading[key] = true;
    this.isDisable=true
    try {
      data = await this.invitationComposer.submit();
      if (data) {
        await this.inviteAndProfileUpdate(key, rootValidate);
      } else {
        this.returnFalse(key);
      }
    } catch (e) {
      this.returnFalse(key);
    }
  }

  returnFalse(key) {
    this.loading[key] = false;
    this.isDisable=false
    this.toastr.error("Error occured in invite users");
    this.cd.detectChanges();
  }

  async inviteAndProfileUpdate(key, rootValidate) {
    try {
      this.result = await this.inviteService.memberInvite(
        this.partnerUser.id,
        this.individualForm
      );
      this.result = JSON.parse(this.result);
      if (this.result.message == "Member Invited successfuly") {
        this.loading[key] = false;
        this.cd.detectChanges();
      } else {
        this.loading[key] = false;
        this.cd.detectChanges();
      }
      if (rootValidate) {
        Swal.fire({
          title: "Invite sent Successfully",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "View Invite Member",
          cancelButtonText: "New Invite",
        }).then((result: any) => {
          if (result && result.value) {
            this.router.navigate(
              [
                this.baseUrlPipe.transform([
                  "/dashboard/partner/invite/pending-registration",
                ]),
              ],
              { queryParams: { id: this.form.controls.email.value } }
            );
          } else {
            this.next = 1;
            this.allowInvite = false;
            this.form.reset();
            this.wizardInstance.goTo();
            this.wizardInstance.goTo(1);
            this.cd.detectChanges();
          }
        });
      } else {
        localStorage.setItem(
          "MEMBER_PROFILE_" + this.result.invitedDetails.id,
          JSON.stringify(this.result.invitedDetails)
        );
        this.router.navigate([
          this.baseUrlPipe.transform([
            "/dashboard/partner/member-profile/",
            this.result.invitedDetails.id,
          ]),
        ]);
      }
    } catch (e) {
      this.returnFalse(key);
    }
  }

  async checkForInvite() {
    const controls = this.form.controls;
    if (this.form.valid) {
      this.loading.submit = true;
      let data={
        email:controls.email.value,
        memberId:this.authService.getUserId()
      }
      try {
        let res: any = await this.inviteService.checkUserAlreadyInvitedByEmail(
          data
        );
        let self = this;
        if (res.message == "Already Registered") {
          if (res.companyName == this.currentPartner.name) {
            self.text = "User already registered";
          } else {
            self.text = "User already registered in group " + res.companyName;
          }
          Swal.fire({
            title: self.text,
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: "Cancel",
          }).then((result: any) => {
            if (result && result.value) {
              this.loading.submit = false;
              this.router.navigate(
                [
                  this.baseUrlPipe.transform([
                    "/dashboard/partner/invite/pending-registration",
                  ]),
                ],
                { queryParams: { id: this.form.controls.email.value } }
              );
            } else {
              this.loading.submit = false;
              this.form.reset();
              this.cd.detectChanges();
            }
          });
        }
        //already invited --> PENDING REG
        else if (res.message == "Already Invited") {
          let showbtn: boolean;
          if (res.companyName == this.currentPartner.name) {
            self.text = "User already invited";
            showbtn = true;
          } else {
            self.text = "User already invited by group " + res.companyName;
            showbtn = false;
          }
          Swal.fire({
            title: self.text,
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: showbtn,
            confirmButtonText: "View Pending Registration",
            cancelButtonText: "Cancel",
          }).then((result: any) => {
            if (result && result.value) {
              this.router.navigate(
                [
                  this.baseUrlPipe.transform([
                    "/dashboard/partner/invite/pending-registration",
                  ]),
                ],
                { queryParams: { id: this.form.controls.email.value } }
              );
            } else {
              this.loading.submit = false;
              this.form.reset();
              this.cd.detectChanges();
            }
          });
          this.cd.detectChanges();
        } else {
          //new INVITE
          this.declareFields();
          this.allowInvite = true;
          this.loading.submit = false;
          this.next = 2;
          this.wizardInstance.goTo();
          this.wizardInstance.goTo(2);
          this.cd.detectChanges();
        }
      } catch (e) {
        this.loading.submit = false;
        this.cd.detectChanges();
      }
    }
  }

  previous() {
    this.next = this.next - 1;
    let step = this.wizardInstance.currentStep;
    if (this.next == 1) {
      this.allowInvite = false;
    }
    this.cd.detectChanges();

    this.wizardInstance.goTo();
    this.wizardInstance.goTo(this.wizardInstance.currentStep - 1);
    this.cd.detectChanges();
  }

  declareFields() {
    this.formDetails = this.formBuilder.group({
      email: [
        this.form.controls.email.value,
        Validators.compose([
          Validators.required,
          Validators.pattern(this.emailPattern),
        ]),
      ],
      name: ["", Validators.required],
      companyName: ["", Validators.required],
      phone: [""],
      website: ["", Validators.pattern("https?://.+")],
      pinCode: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(this.pinCodePattern),
        ]),
      ],
      token: ["IBizzo"],
    });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.allowInvite
      ? this.formDetails.controls[controlName]
      : this.form.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
