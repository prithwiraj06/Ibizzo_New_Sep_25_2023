import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { PartnerService } from "../../../../../../provider/partner/partner.service";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { InviteSettingsComponent } from "../../../shared-component/invite-settings/invite-settings.component";

const MAX_SIZE: number = 1048576;
export class FileToUpload {
  fileName: string = "";
  fileSize: number = 0;
  fileType: string = "";
  lastModifiedTime: number = 0;
  lastModifiedDate: Date = null;
  fileAsBase64: string = "";
  Token: number;
  MemberCompanyID: string;
}

@Component({
  selector: "kt-bulk-email",
  templateUrl: "./bulk-email.component.html",
  styleUrls: ["./bulk-email.component.scss"],
})
export class BulkEmailComponent implements OnInit {
  theFile: any;
  fileName: any;
  messages: any;
  public bulkInviteUpload: FormGroup;
  emailInviteForm: FormGroup;
  @ViewChild("invitationComposer", { static: false })
  invitationComposer: InviteSettingsComponent;
  memberCompanyId: any;
  model: any = {};
  dataSource1: any;
  displayedColumns: string[] = ["invite", "already", "registration"];
  hidePreviousButton: boolean = false;
  list: any = [
    {
      invite: 0,
      already: 0,
      registration: 0,
    },
  ];

  @ViewChild("sort1", { static: true }) sort: MatSort;
  @ViewChild("wizard", { static: true }) el: ElementRef;
  wizardInstance: any;
  next: any = 1;
  prev: number;
  inviteUser: any = {};
  loading: boolean;
  isPrevent: boolean;

  constructor(
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private partner: PartnerService,
    private cd: ChangeDetectorRef
  ) {
    this.memberCompanyId = JSON.parse(
      localStorage.getItem("memberData")
    ).memberUserInfo.companyId;
  }

  ngOnInit() {
    this.bulkInviteUpload = this.formBuilder.group({
      file: new FormControl(null, Validators.required),
    });
    this.createForm();
    // this.getMyInviteEmailSettings(this.memberCompanyId)
  }

  createForm() {
    this.emailInviteForm = this.formBuilder.group({
      fromEmail: ["", [Validators.required]],
      testEMails: [""],
      subjectLine: [""],
      htmlBody: ["", [Validators.required]],
    });
  }

  config: any = {
    height: 200,
    theme: "modern",
    relative_urls: false,
    convert_urls: false,
    // powerpaste advcode toc tinymcespellchecker a11ychecker mediaembed linkchecker help
    plugins:
      "print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern",
    toolbar:
      "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat",
    image_advtab: true,
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

  previous() {
    this.prev = this.next;
    this.next = this.next - 1;

    this.wizardInstance.goPrev();
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    this.wizardInstance = new KTWizard(this.el.nativeElement, {
      startStep: 1,
      manualStepForward: true,
    });
  }

  nextStep() {
    const controls = this.bulkInviteUpload.controls;
    if (this.bulkInviteUpload.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.toast.error("Enter the required fields");
      return;
    }
    this.next = 2;
    this.wizardInstance.goNext();
    this.cd.detectChanges();
  }

  uploadFile(theFile) {
    return new Promise((resolved, reject) => {
      let file: any = new FileToUpload();
      // Set File Information
      file.fileName = theFile.name;
      file.fileSize = theFile.size;
      file.fileType = theFile.type;
      file.lastModifiedTime = theFile.lastModified;
      file.lastModifiedDate = theFile.lastModifiedDate;
      file.fileAsByteArray = "";

      // Use FileReader() object to get file to upload
      // NOTE: FileReader only works with newer browsers
      let reader = new FileReader();

      // Setup onload event for reader
      reader.onload = () => {
        // Store base64 encoded representation of file
        file.fileAsBase64 = reader.result.toString();

        // POST to server
        this.partner
          .uploadFile(file, this.memberCompanyId, theFile.name)
          .then((res: any) => {
            this.inviteUser = JSON.parse(res);
            this.hidePreviousButton = true;
            this.cd.detectChanges();
            this.toast.success(
              "Upload is complete and Invite Sent Successfully",
              "Success"
            );
            resolved();
          })
          .catch((err: any) => {
            this.toast.error("Error to uploading page", "Error", err);
            reject();
          });
      };
      // Read the file
      reader.readAsDataURL(theFile);
    });
  }

  onFileChange(event) {
    this.theFile = null;
    // See if any file(s) have been selected from input
    if (event.target.files && event.target.files.length > 0) {
      // Don't allow file sizes over 1MB
      if (event.target.files[0].size < MAX_SIZE) {
        // Set theFile property
        this.theFile = event.target.files[0];
        this.fileName = this.theFile.name.split(".");
        localStorage.setItem("fileName", JSON.stringify(this.fileName[0]));
        if (this.fileName[1] != "csv") {
          this.toast.error("Please Upload File of type csv.", "Notification");
        }
      } else {
        // Display error message
        this.messages.push(
          "File: " + event.target.files[0].name + " is too large to upload."
        );
      }
    }
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

  async invite() {
    this.loading = true;
    let data = await this.invitationComposer.submit();

    if (data) {
      await this.fileUloader();
    } else {
      this.loading = false;
      this.toast.error("Error occured in invite users");
    }
  }

  async fileUloader() {
    try {
      await this.uploadFile(this.theFile).then(() => {
        // this.onSubmit();
        this.loading = false;
        this.wizardInstance.goNext();
        this.wizardInstance.goNext();
        this.next = 3;

        this.list[0].invite =
          this.inviteUser.newInviteSentList.length != 0
            ? this.inviteUser.newInviteSentList.length
            : 0;
        this.list[0].already =
          this.inviteUser.alreadyInvitedList.length != 0
            ? this.inviteUser.alreadyInvitedList.length
            : 0;
        this.list[0].registration =
          this.inviteUser.alreadyRegList != null
            ? this.inviteUser.alreadyRegList.length
            : 0;
        this.dataSource1 = new MatTableDataSource<any>(this.list);
        this.dataSource1.sort = this.sort;
        this.cd.detectChanges();
      });
    } catch {
      this.loading = false;
    }
  }

  async downloadSample() {
    window.location.href = "/../../../../../assets/images/sample_csv_file.csv";
  }
}
