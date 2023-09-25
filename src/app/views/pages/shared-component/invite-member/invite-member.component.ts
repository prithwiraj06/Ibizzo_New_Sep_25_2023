import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BaseService } from "../../../../../provider/base-service/base.service";
import { SettingService } from "../../../../../provider/setting/setting.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "kt-invite-member",
  templateUrl: "./invite-member.component.html",
  styleUrls: ["./invite-member.component.scss"],
})
export class InviteMemberComponent implements OnInit {
  public inviteForm: FormGroup;
  fetching: boolean;
  memberData: any;
  constructor(
    private fb: FormBuilder,
    private base: BaseService,
    public dialogRef: MatDialogRef<InviteMemberComponent>,
    private toast: ToastrService,
    private authService: AuthService,

    private setting: SettingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.memberData = this.authService.getCurrentUser();
    this.createForm();
  }
  createForm() {
    this.inviteForm = this.fb.group({
      name: ["", [Validators.required]],
      email: [
        "",
        [Validators.required, Validators.pattern(this.base.emailPattern)],
      ],
      phoneNumber: ["", [Validators.minLength(10)]],
    });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.inviteForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
  submit() {
    this.fetching = true;
    try {
      const controls = this.inviteForm.controls;
      if (this.inviteForm.invalid) {
        this.toast.error("Please fill the required fields.");
        Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
        );
        return;
      }
      let data = {
        groupId: parseInt(this.data),
        emailId: this.inviteForm.controls["email"].value,
        phoneNumber: this.inviteForm.controls["phoneNumber"].value,
        name: this.inviteForm.controls["name"].value,
        token: "IBizzo",
        code: "",
        memberId: this.memberData.id,
      };
      this.setting.groupMemberInvite(data).then((res: any) => {
        console.log(res);
        if (res.message == "User already registered") {
          this.toast.error(res.message);
          this.fetching = false;
        } else if (res.message == "Member Invited successfuly") {
          this.toast.success(res.message);
          this.fetching = false;
          this.dialogRef.close();
        }
      });
    } catch (err) {
      console.log(err);
      this.fetching = false;
      this.dialogRef.close();
    }
  }
  getTitle() {
    return window.location.href.includes("manage-groups")
      ? "Invite a business to start"
      : "Invite a business to start and earn 10 INR for each valid business registration using your link";
  }
}
