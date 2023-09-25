import { Component, OnInit, Input } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";

import { GroupMembersComponent } from "../group-members/group-members.component";
import { CreateGroupClusterComponent } from "../create-group-cluster/create-group-cluster.component";
import { InviteMemberComponent } from "../invite-member/invite-member.component";
import { AuthService } from "../../auth/auth.service";
import { iif } from "rxjs";
import { SuggestedClustersService } from "../../../../../provider/suggested-cluster/suggested-clusters.service";
@Component({
  selector: "kt-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  memberTab: boolean = true;
  newRequestTab: boolean;
  @Input() groupId: any;
  isCheck: any;
  publicUrl: any;
  queryParam: string;
  memberDetails: any;
  companyName: any;
  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private router: Router,
    private cluster: SuggestedClustersService
  ) {}

  ngOnInit() {
    console.log(this.groupId);
    this.publicUrl = ["pages/group"];
    this.isCheck = window.location.href.includes("partner");
    this.memberDetails = this.authService.getCurrentUser();
    console.log("member", this.memberDetails);
    this.companyName = this.memberDetails.companyName;
    this.queryParam =
      this.companyName
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      this.groupId +
      ".html";
    console.log("data", this.queryParam);
  }

  invite() {
    const dialogRef = this.dialog.open(InviteMemberComponent, {
      data: this.groupId,
      height: "",
      disableClose: true,
    });
  }
  members() {
    const dialogRef = this.dialog.open(GroupMembersComponent, {
      data: "member",
      disableClose: true,
    });
  }
  newRequest() {
    const dialogRef = this.dialog.open(GroupMembersComponent, {
      data: "new",
      disableClose: true,
    });
  }
  Revenue() {}

  onTabPanelClick(event) {
    this.memberTab = event.index === 0 ? true : false;
    this.newRequestTab = event.index === 1 ? true : false;
  }
  update() {
    const dialogRef = this.dialog.open(CreateGroupClusterComponent, {
      data: {
        group: "true",
        id: this.groupId,
        isCheck: this.isCheck,
      },
      disableClose: true,
    });
  }
  async view() {
    if (this.queryParam) {
      window.open("/m/p/g/" + this.queryParam, "_blank");
    }
  }

  checkForPartner() {
    return window.location.href.includes("manage-groups") ? true : false;
  }
}
