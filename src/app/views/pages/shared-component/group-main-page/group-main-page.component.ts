import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SettingService } from "../../../../../provider/setting/setting.service";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";

import { GroupMemberDataSourceComponent } from "../group-member-data-source/group-member-data-source.component";
import { from } from "rxjs";
@Component({
  selector: "kt-group-main-page",
  templateUrl: "./group-main-page.component.html",
  styleUrls: ["./group-main-page.component.scss"],
})
export class GroupMainPageComponent implements OnInit {
  stats: any = {
    totalMembers: 0,
    totalPosts: 0,
    totalPurchaseProduct: 0,
    totalSalesProduct: 0,
  };
  groupId: any;
  image: string;
  myImgUrl: string = "../../../../../assets/media/placeholder/product.jpg";
  constructor(
    private activedRouter: ActivatedRoute,
    private setting: SettingService,
    public dialog: MatDialog,

    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (window.location.href.includes("p/g/")) {
      this.activedRouter.fragment.subscribe((param) => {});
      let groupInfo = this.activedRouter.snapshot.params.id;
      console.log("user info", groupInfo);
      if (groupInfo) {
        let arrInfo = groupInfo.split("-");
        this.groupId = arrInfo[arrInfo.length - 1].split(".")[0];
      }
    } else {
      this.activedRouter.params.subscribe((param) => {
        console.log(param);
        if (param && param.id) {
          this.groupId = param.id;
        }
      });
    }

    this.getGroupPublicStats();
    this.cd.detectChanges();
  }
  async getGroupPublicStats() {
    try {
      let data = {
        groupId: this.groupId,
      };
      this.stats = await this.setting.getGroupPublicStats(data);
      this.image = await this.getImage(this.stats.groupIcon);
      console.log("ima", this.stats.groupIcon);
      this.cd.detectChanges();
    } catch (err) {
      console.log(err);
    }
  }
  openMembers() {
    const dialogRef = this.dialog.open(GroupMemberDataSourceComponent, {
      data: this.groupId,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.cd.detectChanges();
        return;
      }
    });
  }
  getImage(image) {
    return this.setting.getImageUrl(image, "GetDownload");
  }
}
