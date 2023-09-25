import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { InviteService } from "../../../../../../provider/invite/invite.service";
import { ReinviteMemberListComponent } from "../../../shared-component/reinvite-member-list/reinvite-member-list.component";

@Component({
  selector: "kt-profile-updated",
  templateUrl: "./profile-updated.component.html",
  styleUrls: ["./profile-updated.component.scss"],
})
export class ProfileUpdatedComponent implements OnInit {
  @ViewChild("pendingRegistrtion", { static: false })
  pendingRegistrtion: ReinviteMemberListComponent;

  memberList: any = 3;
  sendItems: boolean = false;
  searchText: string = "";
  loading: boolean = true;

  constructor(
    private inviteService: InviteService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  async search() {
    this.pendingRegistrtion.setDataSourceTable(this.searchText.trim(), 1);
    this.cd.detectChanges();
    this.loading = false;
  }
}
