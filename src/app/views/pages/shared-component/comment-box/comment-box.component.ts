import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SettingService } from "../../../../../provider/setting/setting.service";
import { AuthService } from "../../auth/auth.service";
import { PartnerService } from "../../../../../provider/partner/partner.service";

@Component({
  selector: "kt-comment-box",
  templateUrl: "./comment-box.component.html",
  styleUrls: ["./comment-box.component.scss"],
})
export class CommentBoxComponent implements OnInit {
  comments: any = [];
  comment: string = "";
  pageNumber: number = 1;
  records: any = 100;
  postMemberId: any;
  fetching: boolean;
  memberData: any;
  isPartner: boolean;
  constructor(
    public dialogRef: MatDialogRef<CommentBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private setting: SettingService,
    private authService: AuthService,
    private partner: PartnerService,

    private cd: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.isPartner = window.location.href.includes("/pages/home")
      ? true
      : false;
    this.memberData = this.authService.getCurrentUser();
    this.getGroupComments();

    console.log("data", this.data);
  }
  close() {
    this.dialogRef.close();
  }

  async getGroupComments() {
    this.fetching = true;
    try {
      let params: any = {
        pageNumber: this.pageNumber,
        records: this.records,
        postId: this.data.id,
      };
      let data: any = this.isPartner
        ? await this.partner.getPartnerCommentsList(params)
        : await this.setting.getGroupCommentsList(params);
      this.comments = data;
      this.fetching = false;
    } catch (err) {
      console.log("Failed to fetch data.");
      this.fetching = false;
    }
  }
  async reply() {
    try {
      if (this.comment && this.isPartner) {
        let data: any = {
          partnerPostId: this.data.id,
          commentMemberId: this.memberData.id,
          commentText: this.comment,
        };
        let res: any = await this.partner.createPartnerComments(data);
        console.log("result", res);
        this.getGroupComments();
        this.comment = "";
        this.cd.detectChanges();
      } else {
        let data: any = {
          groupPostId: this.data.id,
          commentMemberId: this.memberData.id,
          commentText: this.comment,
        };
        let res: any = await this.setting.createGroupComments(data);
        console.log("result", res);
        this.getGroupComments();
        this.comment = "";
        this.cd.detectChanges();
      }
    } catch (err) {
      console.log("Failed to add comment");
    }
  }
  getCharname(name) {
    return (name || "").substr(0, 2);
  }
  isPublic() {
    return !JSON.parse(localStorage.getItem("memberData")) ? true : false;
  }
}
