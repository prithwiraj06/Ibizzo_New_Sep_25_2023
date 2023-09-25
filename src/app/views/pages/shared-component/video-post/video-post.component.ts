import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../auth/auth.service";
import { SettingService } from "../../../../../provider/setting/setting.service";
import { SuggestedClustersService } from "../../../../../provider/suggested-cluster/suggested-clusters.service";
import { PartnerService } from "../../../../../provider/partner/partner.service";
import { EmailComponent } from "../../auth/login-page/email/email.component";

@Component({
  selector: "kt-video-post",
  templateUrl: "./video-post.component.html",
  styleUrls: ["./video-post.component.scss"],
})
export class VideoPostComponent implements OnInit {
  videoForm: FormGroup;
  fetching: boolean;
  memberData: any;
  isPublic: boolean;

  constructor(
    public dialogRef: MatDialogRef<VideoPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastrService,
    public fb: FormBuilder,
    private setting: SettingService,
    private authService: AuthService,
    private cluster: SuggestedClustersService,
    private dialog: MatDialog,

    private partner: PartnerService
  ) {}

  ngOnInit() {
    this.memberData = this.authService.getCurrentUser();

    this.initForm();
  }
  initForm() {
    this.videoForm = this.fb.group({
      videoPath: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/
          ),
        ]),
        ,
      ],
    });
  }
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.videoForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
  async postVideo() {
    this.fetching = true;
    try {
      const controls = this.videoForm.controls;
      if (this.videoForm.invalid) {
        this.toast.error("Please fill the required fields.");
        Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
        );
        this.fetching = false;
        return;
      }
      if (window.location.href.includes("/pages/home")) {
        if (!JSON.parse(localStorage.getItem("memberData"))) {
          try {
            this.dialogRef.close();

            await this.authentication();
            this.isPublic = true;
          } catch {
            return;
          }
        }
        let data: any = {
          partnerId: this.data.id,
          postMemberId: JSON.parse(localStorage.getItem("memberData"))
            .memberUserInfo.id,
          contentLink: this.videoForm.controls["videoPath"].value,
          contentType: "video",
          isApproved: true,
          token: "IBizzo",
        };
        localStorage.setItem("previousPost", JSON.stringify(data));
        this.partner.createPartnerPosts(data).then(async (res: any) => {
          if (res.message == "This member cannot create discussion") {
            this.toast.warning(res.message);
            this.fetching = false;
            localStorage.removeItem("previousPost");
          } else {
            this.toast.success(res.message);
            this.fetching = false;
            localStorage.removeItem("previousPost");
            if (this.isPublic) {
              window.location.reload();
            }
            this.dialogRef.close();
          }
        });
      } else {
        if (!JSON.parse(localStorage.getItem("memberData"))) {
          try {
            this.dialogRef.close();

            await this.authentication();
            this.isPublic = true;
          } catch {
            return;
          }
        }
        let data: any = {
          groupId: this.data.id,
          postMemberId: JSON.parse(localStorage.getItem("memberData"))
            .memberUserInfo.id,
          contentLink: this.videoForm.controls["videoPath"].value,
          contentType: "video",
          isApproved: true,
        };
        localStorage.setItem("previousPost", JSON.stringify(data));

        this.setting.createGroupPosts(data).then(async (res: any) => {
          if (res.message == "This member cannot create discussion") {
            this.toast.warning(res.message);
            localStorage.removeItem("previousPost");

            this.fetching = false;
          } else {
            this.toast.success(res.message);
            this.fetching = false;
            localStorage.removeItem("previousPost");
            if (this.isPublic) {
              window.location.reload();
            }
            this.dialogRef.close();
          }
        });
      }
    } catch (err) {
      console.log(err);
      this.fetching = false;
    }
  }
  authentication() {
    return new Promise((resolve, rejects) => {
      const dialogRef = this.dialog.open(EmailComponent, {
        width: "450px",
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
}
