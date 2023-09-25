import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  ElementRef,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { SuperadminService } from "../../../../../../provider/superadmin/superadmin.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ViewImageComponent } from "../../../shared-component/view-image/view-image.component";

import * as _ from "underscore";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "kt-new-upload",
  templateUrl: "./new-upload.component.html",
  styleUrls: ["./new-upload.component.scss"],
})
export class NewUploadComponent implements OnInit {
  videos: any = [];
  isBlockedVideo: boolean = false;
  loading: boolean;
  fetching: boolean = false;
  memberId: any;
  companyId: any;
  listOfItems: any = [];
  docArray: any = [];
  imageArray: any = [];
  videoArray: any = [];
  videoData: any;
  docData: any;
  imageData: any;
  isCheck: boolean;
  public selectRef: any;
  Ids: any = [];
  isImageCheck: boolean = true;
  isDocCheck: boolean = true;
  isVideoCheck: boolean = true;
  loader: boolean;
  load: boolean;
  constructor(
    private el: ElementRef,
    public dialogRef: MatDialogRef<NewUploadComponent>,
    private service: SuperadminService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  validationImages: any = [];
  validationVideos: any = [];
  validationDoc: any = [];
  videoContentId: string = "";

  ngOnInit() {
    this.getValidationContent();
  }
  cancel() {
    this.dialogRef.close();
  }
  async getValidationContent() {
    this.loading = true;
    try {
      if (this.data) {
        let res: any = await this.service.getValidationContent(
          this.data.memberId
        );
        let listContentValidation = res.listContentValidation || [];
        if (listContentValidation.length > 0) {
          this.loading = false;
          listContentValidation.forEach(async (item: any) => {
            // for logo
            this.companyId = item.memberCompanyId;
            this.memberId = item.memberId;
            if (item.contentPath == "UPLOAD_LOGO" && item.fileName) {
              let images = item.fileName.split(",");
              // this.companyData.firstImage = this.validationImages[0];
              _.each(images, (image) => {
                this.companyId = item.memberCompanyId;
                this.validationImages.push({
                  image: image,
                  contentId: item.id,
                  memberId: item.memberId,
                  isBlocked: item.isBlocked,
                  isImageCheck: item.isBlocked ? false : true,
                });
              });
            }
            //for companyDatas
            if (item.contentPath == "UPLOAD_IMAGES" && item.fileName) {
              let images = item.fileName.split(",");
              // this.companyData.firstImage = this.validationImages[0];
              _.each(images, (image) => {
                this.validationImages.push({
                  image: image,
                  contentId: item.id,
                  memberId: item.memberId,
                  isBlocked: item.isBlocked,
                  isImageCheck: item.isBlocked ? false : true,
                });
              });
            }
            //for videos
            if (item.contentPath == "LINK_TO_VIDEOS") {
              this.validationVideos = item.fileName.split(",");
              this.videoContentId = item.id;
              this.isBlockedVideo = item.isBlocked;
              await this.getVedioesLink();
            }
            //for documents
            if (item.contentPath == "UPLOAD_DOCS") {
              let docs = item.fileName.split(",");
              if (docs.length > 1) {
                _.each(docs, (doc) => {
                  this.validationDoc.push({
                    doc: encodeURIComponent(doc),
                    contentId: item.id,
                    memberId: item.memberId,
                    isBlocked: item.isBlocked,
                    isDocCheck: item.isBlocked ? false : true,
                  });
                });
              } else {
                this.validationDoc.push({
                  doc: encodeURIComponent(docs[0]),
                  contentId: item.id,
                  memberId: item.memberId,
                  isBlocked: item.isBlocked,
                  isDocCheck: item.isBlocked ? false : true,
                });
              }
              console.log("doc", this.validationDoc);
            }
          });
        }
      }
    } catch (err) {}
  }

  getImage(image) {
    return this.service.getImageUrl(image, "GetDownload");
  }

  getVedioesLink() {
    this.validationVideos.forEach((key) => {
      if (key) {
        let id = this.getVedioById(key);
        let video = this.sanitizer.bypassSecurityTrustResourceUrl(
          "https://www.youtube.com/embed/" + id + "?showinfo=0&rel=0"
        );

        this.videos.push({
          video: video,
          videoOrg: "https://www.youtube.com/watch?" + id,
          isBlocked: this.isBlockedVideo,
          contentId: this.videoContentId,
          memberId: this.memberId,
          isVideoCheck: this.isBlockedVideo ? false : true,
        });
      }
    });
  }
  getVedioById(video) {
    let str = video.split("?")[1] || "";
    let data = str.split("=");
    let index = data.indexOf("v");
    return index > -1 ? data[index + 1] : undefined;
  }
  getDocName(doc: any) {
    let file = doc.includes("%23~%23") ? doc.split("%23~%23")[1] : doc;
    return file.includes("%20") ? file.replace(/%20/g, " ") : file;
  }
  downloadDoc(file) {
    return this.service.getImageUrl(file, "GetCompanyDocumentDownload");
  }
  async enbleAndDisableContent(event, data: any, type: any) {
    try {
      if (data) {
        if (type == "doc") {
          let doc = { name: "" };
          let flag = event.target.checked == false ? 1 : 0;
          doc.name = data.doc.includes("%23~%23")
            ? data.doc.split("%23~%23")[0]
            : data.doc;
          console.log("documrnt", doc);
          this.docArray.push({ [doc.name]: flag });
          let obj = await this.arrayToObject(this.docArray);
          let item: any = {
            contentId: data.contentId,
            companyId: this.companyId,
            isVerify: 1,
            values: obj,
          };
          this.docData = item;
        }
        if (type == "image") {
          console.log("logo", data);
          let flag = event.target.checked == false ? 1 : 0;
          this.imageArray.push({ [data.image]: flag });
          let obj = await this.arrayToObject(this.imageArray);
          let item: any = {
            contentId: data.contentId,
            companyId: this.companyId,
            isVerify: 1,
            values: obj,
          };
          this.imageData = item;
          console.log("image", this.imageData);
        }
        if (type == "video") {
          let flag = event.target.checked == false ? 1 : 0;

          this.videoArray.push({ [data.videoOrg]: flag });
          let obj = await this.arrayToObject(this.videoArray);
          let item: any = {
            contentId: data.contentId,
            companyId: this.companyId,
            isVerify: 1,
            values: obj,
          };
          this.videoData = item;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  async submit(text?: any) {
    this.fetching = true;
    if (this.imageData) {
      this.listOfItems.push(this.imageData);
    }
    if (this.docData) {
      this.listOfItems.push(this.docData);
    }
    if (this.videoData) {
      this.listOfItems.push(this.videoData);
    }

    let data: any = {
      memberId: this.memberId,
      contentStatusData: this.listOfItems,
      applicationKey: "IBiz",
    };
    if (this.listOfItems.length > 0) {
      let title =
        "Once changed content cannot be reverted, Do you want to continue?";
      Swal.fire({
        title: title,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (res: any) => {
        if (res.value && res) {
          try {
            this.service.blockContent(data).then((result: any) => {
              if (result.isUpdate) {
                this.fetching = false;
                this.loader = false;
                this.toastr.success("Changes are Updated.");
                this.dialogRef.close();
              } else {
                this.toastr.error("Failed to make changes.");
                this.fetching = false;
                this.loader = false;
                this.cd.detectChanges();
              }
            });
          } catch (err) {
            console.log("Failed to disable contant", err);
          }
        }
      });
    } else {
      this.toastr.warning("Select content to verify.");
      this.fetching = false;
    }
  }

  //image view in model
  viewImage(image: any) {
    const dialogRef = this.dialog.open(ViewImageComponent, {
      data: image,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.cd.detectChanges();
        return;
      }
    });
  }
  //converting object
  arrayToObject(arr) {
    let b = {};
    arr.forEach((item) => {
      let prop = Object.keys(item)[0];
      let value = Object.values(item)[0];
      b[prop] = value;
    });
    return b;
  }
  async markAsVerify() {
    if (this.memberId) {
      let title =
        "Once changed content cannot be reverted, Do you want to continue?";
      Swal.fire({
        title: title,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result && result.value) {
          try {
            let res: any = this.service.markContentVerified(this.memberId);
            if (res) {
              this.toastr.success("Member is verified successfully");
              this.dialogRef.close();

              this.cd.detectChanges();
            }
          } catch (err) {
            this.toastr.error("Error in verifieying member");
            this.cd.detectChanges();
          }
        }
      });
    }
  }
}
