import { Component, OnInit, ChangeDetectorRef, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SettingService } from "../../../../../provider/setting/setting.service";
import { PartnerService } from "../../../../../provider/partner/partner.service";
import { BaseUrlPipe  } from '../../../../core/_base/layout/pipes/base-url';

@Component({
  selector: "kt-member-details",
  templateUrl: "./member-details.component.html",
  styleUrls: ["./member-details.component.scss"],
})
export class MemberDetailsComponent implements OnInit {
  groupId: any;
  memberData: any;
  isPartner: boolean;
  constructor(
    public dialogRef: MatDialogRef<MemberDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private setting: SettingService,
    private partner: PartnerService,
    private baseUrlPipe:BaseUrlPipe
  ) {}

  ngOnInit() {
    this.isPartner = window.location.href.includes("/pages/home")
      ? true
      : false;
    this.getMemberDetail();
  }
  close() {
    this.dialogRef.close();
  }

  async getMemberDetail() {
    console.log("data", this.data);

    try {
      if (this.isPartner) {
        let params: any = {
          memberId: this.data.memberId,
        };
        this.memberData = await this.partner.getPartnerDetail(params);
        console.log("dataxksd", this.memberData);
      } else {
        let params: any = {
          groupId: this.data.groupId,
          memberId: this.data.memberId,
          pageNumber: 1,
          records: 1,
        };
        this.memberData = await this.setting.getGroupMemberDetails(params);
        console.log("dataxksd", this.memberData);
      }
    } catch (err) {
      console.log(err);
    }
  }
  getImage(image) {
    return this.setting.getImageUrl(image, "GetDownload");
  }
  openMiniSite() {
    let query =
      this.memberData.companyName
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      this.memberData.memberId +
      ".html";

    window.open(this.baseUrlPipe.transform(["/m/h/" + query]), "_blank");
  }
}
