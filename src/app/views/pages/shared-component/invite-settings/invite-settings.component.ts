import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { PartnerService } from "../../../../../provider/partner/partner.service";

@Component({
  selector: "kt-invite-settings",
  templateUrl: "./invite-settings.component.html",
  styleUrls: ["./invite-settings.component.scss"],
})
export class InviteSettingsComponent implements OnInit {
  emailInviteForm: FormGroup;
  memberCompanyId: any;
  @Input() footer: any;
  @Input() hideToaster: any;

  submit(): any {
    return this.onSubmit();
  }

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private partner: PartnerService
  ) {
    this.memberCompanyId = JSON.parse(
      localStorage.getItem("memberData")
    ).memberUserInfo.companyId;
  }
  config: any = {
    height: 200,
    theme: "modern",
    relative_urls: false,
    convert_urls: false,
    // powerpaste advcode toc tinymcespellchecker a11ychecker mediaembed linkchecker help
    plugins: ["link", "paste", "table", "code", "lists"],
    toolbar:
      "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat",
    image_advtab: true,
    imagetootinymcet_css: [
      "//fonts.googleapis.com/css?family=Lato:300,300i,400,400i",
      "//www.tinymce.com/css/codepen.min.css",
    ],
    menu: {
      file: {
        title: "File",
        items:
          "newdocument restoredraft | preview | print | fontselect | fontsizeselect",
      },
      edit: {
        title: "Edit",
        items: "undo redo | cut copy paste pastetext | selectall",
      },
      // newmenu: self.helper,
      view: {
        title: "View",
        items:
          "code | visualaid visualchars visualblocks | spellchecker | preview fullscreen",
      },
      insert: {
        title: "Insert",
        items:
          "image link media template codesample inserttable | charmap hr | pagebreak nonbreaking anchor toc | insertdatetime",
      },
      format: {
        title: "Format",
        items:
          "bold italic underline strikethrough superscript subscript codeformat | blockformats align | removeformat",
      },
      tools: {
        title: "Tools",
        items: "spellchecker spellcheckerlanguage | a11ycheck code",
      },
      table: { title: "Table" },
      help: { title: "Help" },
    },
  };

  ngOnInit() {
    this.createForm();
    this.getMyInviteEmailSettings(this.memberCompanyId);
  }

  onClose(evtn) {
    console.log("sdsasd", evtn);
  }

  createForm() {
    this.emailInviteForm = this.formBuilder.group({
      fromEmail: [
        "invite@ibizzo.com",
        Validators.compose([
          Validators.pattern(
            /^[a-zA-Z][a-zA-Z0-9.%+-]+@[a-zA-Z0-9.%+-][a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
          ),
        ]),
      ],
      subjectLine: [""],
      htmlBody: ["", [Validators.required]],
    });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.emailInviteForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  async onSubmit() {
    return new Promise(async (resolve, reject) => {
      const controls = this.emailInviteForm.controls;

      if (this.emailInviteForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
        );
        this.hideToaster ? "" : this.toastr.error("Enter the reuired fields");
        reject();
        return;
      }
      if (this.emailInviteForm.valid) {
        let data = {
          memberCompanyID: parseInt(this.memberCompanyId),
          fromEmail: controls.fromEmail.value,
          subjectLine: controls.subjectLine.value || "",
          htmlBody: controls.htmlBody.value,
          Token: "IBizzo",
          code: "",
        };
        this.partner
          .sendInviteSettings(data)
          .then((res) => {
            if (res) {
              this.hideToaster
                ? ""
                : this.toastr.success("Invite Template is Saved");
              resolve(res);
            } else {
              this.hideToaster ? "" : this.toastr.error("Failed in settings");
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            this.hideToaster ? "" : this.toastr.error("Failed in settings");
            reject();
          });
      }
    });
  }

  getMyInviteEmailSettings(id?: any) {
    this.partner
      .getMyTemplate(id ? id : this.memberCompanyId)
      .then((res: any) => {
        this.emailInviteForm.controls.subjectLine.setValue(res.subjectLine);
        this.emailInviteForm.controls.fromEmail.setValue(res.fromEmail);
        this.emailInviteForm.controls.htmlBody.patchValue(res.htmlBody);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
}
