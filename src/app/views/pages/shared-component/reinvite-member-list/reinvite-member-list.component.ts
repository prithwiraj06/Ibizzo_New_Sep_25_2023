import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { InviteService } from "../../../../../provider/invite/invite.service";
import {
  MatTableDataSource,
  MatPaginator,
  MatDialog,
  MatSort,
} from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { ToastrService } from "ngx-toastr";
import _ from "lodash";
import { AddCommentsComponent } from "../../dashboard/partner/add-comments/add-comments.component";
import { SeeHistoryComponent } from "../../dashboard/partner/see-history/see-history.component";
import { AuthService } from "../../../../views/pages/auth/auth.service";
import { ReInviteComponent } from "../re-invite/re-invite.component";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { ActivatedRoute } from "@angular/router";
import { PartnerService } from "../../../../../provider/partner/partner.service";

@Component({
  selector: "kt-reinvite-member-list",
  templateUrl: "./reinvite-member-list.component.html",
  styleUrls: ["./reinvite-member-list.component.scss"],
})
export class ReinviteMemberListComponent implements OnInit {
  serachList: boolean;
  option: any;
  searchText: any;
  setDataSourceTable(data, option) {
    this.searchText = data;
    this.option = option;
    return this.search();
  }

  _reinvite() {
    this.sendBulkReinvite();
  }

  @Input() memberList: any = [];
  @Input() type: string;
  @Input() length: number;
  dataSource: any = [];
  searchItem: any = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("sort1", { static: true }) sort: MatSort;
  displayedColumns: any = [
    "#",
    "name",
    "companyName",
    "email",
    "phoneNo",
    "block",
  ];
  reinviteList: any = [];
  updatedList: any = [];
  isCheck: boolean;
  sortContent: any;
  selection: any = [];
  loading: boolean = false;
  page: any = {
    index: 1,
    page: 10,
  };

  constructor(
    private service: InviteService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private authService: AuthService,
    public dialog: MatDialog,
    private baseUrlPipe: BaseUrlPipe,
    private route: ActivatedRoute,
    private partnerService: PartnerService
  ) { }

  ngOnInit() {
    if (this.type == "updatedProfile") {
      this.displayedColumns.push(
        "sales",
        "purchase",
        "dateTime",
        "profile",
        "status"
      );
    } else {
      this.displayedColumns.push("dateTime", "profile");
    }
    this.route.queryParams.subscribe((params) => {
      this.searchText = params.id;
      if (params && params.id != undefined) {
        this.searchItem = false;
        console.log("search", this.searchText);
        this.search();
      }
    });
    this.searchItem ? this.search() : "";
  }

  async getMembers(param, page) {
    this.loading = true;
    this.cd.detectChanges();
    let res = await this.service.getAllInviteMembersByToken(param, page);
    this.setTable(res);
  }

  async sortData(event) {
    if (event) {
      this.loading = true;
      this.sortContent = {
        sortOrder: event.direction.toUpperCase(),
        sortKey: event.active,
      };

      try {
        let res = await this.partnerService.sortPendingList(
          this.memberList,
          this.sortContent,
          this.page
        );
        this.setTable(res);
      } catch {
        this.loading = false;
      }
    }
  }

  //set table
  setTable(list) {
    this.dataSource = new MatTableDataSource<any>(list);
    this.selection = new SelectionModel<any>(true, []);
    this.cd.detectChanges();
    this.isCheck =
      this.selection.hasValue() && this.isAllSelected() ? true : false;

    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.hasData = list.length > 0 ? true : false;
    this.loading = false;
    this.cd.detectChanges();
  }

  async search() {
    this.loading = true;
    this.serachList = true;
    this.cd.detectChanges();
    this.cd.detectChanges();
    let res = await this.service.searchInviteMember(
      this.searchText,
      this.memberList,
      this.option,
      this.page
    );
    if (res) {
      this.setTable(res);
      this.cd.detectChanges();
    }
  }

  async pageChangeEvent() {
    this.loading = true;
    this.cd.detectChanges();
    this.page.index = this.paginator.pageIndex * this.paginator.pageSize + 1;
    this.page.page = (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    this.isCheck =
      this.selection.hasValue() && this.isAllSelected() ? true : false;

    // if (this.sortData) {
    //   let res = await this.partnerService.sortPendingList(
    //     0,
    //     this.sortContent,
    //     this.page
    //   );
    //   this.setTable(res);
    // } else 
    if (this.serachList) {
      this.search();
    } else {
      this.getMembers(this.memberList, this.page);
    }
  }

  //INVITE
  async sendBulkReinvite() {
    if (!this.reinviteList.length) {
      this.toastr.warning("Select member to invite");
      return;
    }
    this.loading = true;
    let data = {
      reInviteLsist: this.reinviteList,
      memberCompanyID: parseInt(
        JSON.parse(localStorage.getItem("memberData")).memberUserInfo.companyId
      ),
      token: "IBizzo",
    };
    const dialogRef = this.dialog.open(ReInviteComponent);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        this.loading = false;
        this.cd.detectChanges();
        return;
      }
      try {
        let res: any = await this.service.postBulkInvite(data);
        if (
          res.alreadyInvitedList == 0 &&
          res.alreadyRegList == 0 &&
          res.newInviteSentList == 0
        ) {
          this.toastr.warning(res.message);
          this.loading = false;
          this.reinviteList = [];
          this.isCheck = false;
          this.selection.clear();
          this.cd.detectChanges();
        } else {
          this.toastr.success("Invitation sent");
          this.loading = false;
          this.reinviteList = [];
          this.isCheck = false;
          this.selection.clear();
          this.cd.detectChanges();
        }
      } catch (e) {
        this.loading = false;
        this.toastr.error("Error in sending invite");
        this.cd.detectChanges();
      }
    });
  }

  async blockInvitedMember(member: any) {
    try {
      let res = await this.service.blockMember({
        id: member.id,
        memberCompanyID: this.authService.getCompanyId(),
      });
      this.setTable(this.memberList);
      if (res) {
        let index = _.findIndex(this.memberList, { id: member.id });
        this.memberList[index].isActive = 0;
        this.setTable(this.memberList);
        this.toastr.success("Member Blocked");
        this.cd.detectChanges();
      }
    } catch (e) {
      this.toastr.error("Error in Blocking member");
      this.cd.detectChanges();
    }
  }

  async unblockInvitedMember(member: any) {
    try {
      let res = await this.service.unblockMember({
        id: member.id,
        memberCompanyID: this.authService.getCompanyId(),
      });
      if (res) {
        let index = _.findIndex(this.memberList, { id: member.id });
        this.memberList[index].isActive = 1;
        this.setTable(this.memberList);
        this.toastr.success("Member UnBlocked");
        this.cd.detectChanges();
      }
    } catch (e) {
      this.toastr.error("Error in UnBlocking member");
      this.cd.detectChanges();
    }
  }

  handleInviteMember(item, event) {
    if (event.checked) {
      this.reinviteList.push({
        name: item.name,
        companyName: item.companyName || "inqude",
        toEmail: item.email,
        phone: item.phoneNo,
        id: item.id,
        pinCode: item.pinCode,
        website: item.website,
      });
    } else {
      let index = _.findIndex(this.reinviteList, { email: item.email });
      if (index > -1) {
        this.reinviteList.splice(index, 1);
      }
      console.log("re", this.reinviteList);
    }
  }

  memberProfile(member) {
    if (this.type != "updatedProfile") {
      localStorage.setItem(
        "MEMBER_PROFILE_" + member.id,
        JSON.stringify(member)
      );
    }
    window.open(
      this.baseUrlPipe.transform([
        "/dashboard/partner/member-profile/" + member.id,
      ]),
      "_blank"
    );
  }

  addComment(value) {
    const dialogRef = this.dialog.open(AddCommentsComponent, {
      height: "248px",
      width: "300px",
      data: value,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
    });
  }

  seeHistory(value) {
    const dialogRef = this.dialog.open(SeeHistoryComponent, {
      data: value,
      width: "500px",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
    });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.clear() : this.select();
  }

  select() {
    let temp: any = [];
    this.reinviteList = [];
    this.dataSource.data.forEach((row) => this.selection.select(row));
    this.dataSource.data.forEach((row) => temp.push(row));
    temp.forEach((item) => {
      this.reinviteList.push({
        name: item.name,
        companyName: item.companyName || "",
        toEmail: item.email,
        phone: item.phoneNo,
        id: item.id,
        pinCode: item.pinCode,
        website: item.website,
      });
    });
    console.log("selected result", this.reinviteList);
  }

  clear() {
    this.selection.clear();
    this.reinviteList = [];
  }
}
