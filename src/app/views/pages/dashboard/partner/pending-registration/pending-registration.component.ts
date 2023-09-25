import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { InviteService } from "../../../../../../provider/invite/invite.service";
import { ReinviteMemberListComponent } from "../../../shared-component/reinvite-member-list/reinvite-member-list.component";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from '../../../auth/auth.service'

@Component({
  selector: "kt-pending-registration",
  templateUrl: "./pending-registration.component.html",
  styleUrls: ["./pending-registration.component.scss"],
})
export class PendingRegistrationComponent implements OnInit {
  @ViewChild("pendingRegistration", { static: false })
  pendingRegistration: ReinviteMemberListComponent;
  memberList: any = 0;
  sendItems: boolean = false;
  searchText: string = "";
  loading: boolean = true;
  text: any;
  option: number = 1
  count: any;

  constructor(
    private service: InviteService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private auth: AuthService
  ) { }

  async ngOnInit() {

    let option = {
      Token: "IBizzo",
      MemberCompanyID: this.auth.getCompanyId()
    }
    let str = await this.service.getPendingCount(option);
    this.count = str ? "(" + str + ")" : '';

    console.log(this.count);

  }

  async search() {
    this.pendingRegistration.setDataSourceTable(this.searchText.trim(), this.option);
    this.loading = false;
    this.cd.detectChanges();
  }
}
