import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { SettingService } from "../../../../../provider/setting/setting.service";
import { PartnerService } from "../../../../../provider/partner/partner.service";
import { AuthService } from "../../auth/auth.service";
import { SuggestedClustersService } from "../../../../../provider/suggested-cluster/suggested-clusters.service";
import { EmailComponent } from "../../auth/login-page/email/email.component";
import { ActivatedRoute, Router } from "@angular/router";

declare var require: any;

@Component({
  selector: "kt-create-article-post",
  templateUrl: "./create-article-post.component.html",
  styleUrls: ["./create-article-post.component.scss"],
})
export class CreateArticlePostComponent implements OnInit {
  articleForm: FormGroup;
  isDiscussion: boolean = false;
  //tinymce properties
  config: any = {
    height: 200,
    theme: "modern",
    // powerpaste advcode toc tinymcespellchecker a11ychecker mediaembed linkchecker help
    plugins:
      "print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern",
    toolbar:
      "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat",
    image_advtab: true,
    menubar: false,
    imagetools_toolbar:
      "rotateleft rotateright | flipv fliph | editimage imageoptions",
    templates: [
      { title: "Test template 1", content: "Test 1" },
      { title: "Test template 2", content: "Test 2" },
    ],
    content_css: [
      "//fonts.googleapis.com/css?family=Lato:300,300i,400,400i",
      "//www.tinymce.com/css/codepen.min.css",
    ],
  };
  fetching: boolean;
  memberData: any;
  isPublic: boolean;
  constructor(
    public dialogRef: MatDialogRef<CreateArticlePostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastrService,
    public fb: FormBuilder,
    private authService: AuthService,
    private router: Router,

    private setting: SettingService,
    private partner: PartnerService,
    private dialog: MatDialog,
    private cluster: SuggestedClustersService
  ) {}

  async ngOnInit() {
    this.memberData = this.authService.getCurrentUser();
    this.initForm();
  }
  initForm() {
    this.articleForm = this.fb.group({
      link: ["", Validators.compose([Validators.pattern("https?://.+")]), ,],
      discussion: [""],
    });
  }
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.articleForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
  async postArtile() {
    this.fetching = true;
    let url: any;
    const controls = this.articleForm.controls;
    if (this.articleForm.invalid) {
      this.toast.error("Please fill the required fields.");
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.fetching = false;
      return;
    }
    try {
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
          webLink: this.articleForm.controls["link"].value,
          contentLink: "",
          contentType:
            this.articleForm.controls["discussion"].value &&
            this.articleForm.controls["link"].value
              ? "link_article"
              : this.articleForm.controls["link"].value
              ? "link"
              : "article",
          isApproved: true,
          articleContent: this.articleForm.controls["discussion"].value
            ? this.articleForm.controls["discussion"].value
            : "",
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
          webLink: this.articleForm.controls["link"].value,
          contentLink: "",
          contentType:
            this.articleForm.controls["discussion"].value &&
            this.articleForm.controls["link"].value
              ? "link_article"
              : this.articleForm.controls["link"].value
              ? "link"
              : "article",
          isApproved: true,
          articleContent: this.articleForm.controls["discussion"].value
            ? this.articleForm.controls["discussion"].value
            : "",
        };
        localStorage.setItem("previousPost", JSON.stringify(data));
        this.setting.createGroupPosts(data).then(async (res: any) => {
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
      }
    } catch (err) {
      console.log(err);
    }
  }
  openDiscussion(type) {
    if (type == "true") {
      this.isDiscussion = true;
    }
  }
  async getOpenGraphUrl(path) {
    const { getMetadata } = require("page-metadata-parser");
    const domino = require("domino");
    const url = path;
    const response = await fetch(url, {
      headers: {
        mode: "no-cors",
      },
    });
    const html = await response.text();
    const doc = domino.createWindow(html).document;
    const metadata = getMetadata(doc, url);
    return metadata;
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
