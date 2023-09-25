import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectorRef,
  Inject,
} from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { PartnerService } from "../../../../../provider/partner/partner.service";
import { ToastrService } from "ngx-toastr";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { MembersService } from "../../../../../provider/members/members.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "underscore";
import { SuperadminService } from "../../../../../provider/superadmin/superadmin.service";
import {environment} from '../../../../../environments/environment'

@Component({
  selector: "kt-data-source-table",
  templateUrl: "./data-source-table.component.html",
  styleUrls: ["./data-source-table.component.scss"],
})
export class DataSourceTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @Input() type: any;
  @Input() partnerId: any;
  @Input() searchData: any;
  @Input() isGroup: any;

  isEdit: boolean = false;
  paginationInfo: any = {
    length: 13,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
  };
  credits: number = 0;
  min = 0;
  count: any = 1000;
  sortContent: any;
  dataSource1: any;
  displayedColumns2: string[] = [
    "id",
    "name",
    "email",
    "phone",
    "companyName",
    "sales",
    "purchase",
    "cartItem",

    "profile",
    "singleColumn",
  ];
  displayedColumns1: string[] = [
    "id",
    "name",
    "email",
    "phone",
    "companyName",
    "sales",
    "purchase",
    "twoColumn",
  ];
  empty: boolean;
  memberList: any = [];
  fetching: boolean;
  member: any = "Member";
  nonMember: any = "Non Member";
  validate: any;
  search: any;
  isAdmin: boolean = false;
  id: any;
  loading: boolean;
  lists: any = [];
  constructor(
    private partner: PartnerService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private baseUrlPipe: BaseUrlPipe,
    private memberListService: MembersService,
    private router: Router,
    private superAdmin: SuperadminService,
    public dialogRef: MatDialogRef<DataSourceTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.isGroup) {
      this.displayedColumns2.splice(8, 1);
      this.displayedColumns2.splice(8, 1);
      this.displayedColumns2.splice(7, 1);
      if (!this.data.isMember) {
        this.displayedColumns2.push("action");
      }
    }

    this.partner.onEvent("SEARCH").subscribe((res) => {
      this.validate = true;
      this.member = "Add as member";
      this.memberList = res.result;
      this.dataSourceList();
    });
    if (this.partnerId) {
      const index = this.displayedColumns1.indexOf("singleColumn");
      this.displayedColumns1.splice(index, 1);
      const ind = this.displayedColumns2.indexOf("twoColumn");
      this.displayedColumns2.splice(ind, 1);
    }

    if (this.type) {
      this.route.queryParams.subscribe((params) => {
        if (params) {
          if (this.type == "2"&&params.id ) {
            console.log("para", params);
            this.displayedColumns2.push("credits");
          }
        }
      });
      this.fetching = true;
      this.getListItem();
    } else {
      this.validate = true;
      this.member = "Add as member";
      this.memberList = this.searchData;
      this.dataSourceList();
      this.fetching = false;
      this.toast.error("Error fetching records");
    }
  }

  sortData(event) {
    if (event) {
      this.fetching = true;
      this.sortContent = {
        sortOrder: event.direction.toUpperCase(),
        sortKey: event.active,
      };
      this.getListItem(this.sortContent);
    }
  }

  getDisplayedColumns() {
    if (this.type == "1") {
      return this.displayedColumns1;
    }
    return this.displayedColumns2;
  }

  getListItem(sort?: any) {
    this.member = "Member";
    this.nonMember = "Non Member";
    this.validate = false;
    let size = this.paginator
      ? (this.paginator.pageIndex + 1) * this.paginator.pageSize
      : 10;
    let index = this.paginator
      ? this.paginator.pageIndex * this.paginator.pageSize + 1
      : 1;
    let token = this.partnerId
      ? this.partnerId
      : JSON.parse(localStorage.getItem("memberData")).token;
    this.partner
      .getMembership(this.type, token, sort, index, size)
      .then((res: any) => {
        this.memberList = res.partnerMemberList;
        this.memberList.length ? "" : this.toast.error("No records founds");
        this.dataSourceList();
      })
      .catch((err: any) => {
        this.fetching = false;
        this.toast.error("Error fetching records");
      });
  }

  addToMember(index: any) {
    index = this.paginationInfo.pageIndex
      ? this.paginationInfo.pageSize + index
      : index;
    let data = {
      token: JSON.parse(localStorage.getItem("memberData")).token,
      requestInfo: [
        {
          organizationId: this.memberList[index].organizationId,
          memberId: this.memberList[index].memberId,
        },
      ],
      applicationKey: "IBiz",
    };

    this.partner
      .getToValidateMember(data)
      .then((res) => {
        this.toast.success("Successfully added as member");
        this.getListItem();
      })
      .catch((err: any) => {
        this.toast.error("Error fetching records");
      });
  }

  memberProfile(member) {
    window.open(
      this.baseUrlPipe.transform([
        "/dashboard/partner/member-profile/" + member + "?isMember=false",
      ]),
      "_blank"
    );
  }

  removeToMember(index: any) {
    index = this.paginationInfo.pageIndex
      ? this.paginationInfo.pageSize + index
      : index;
    let data = {
      token: JSON.parse(localStorage.getItem("memberData")).token,
      requestInfo: [
        {
          organizationId: this.memberList[index].organizationId,
          memberId: this.memberList[index].memberId,
        },
      ],
      applicationKey: "IBiz",
    };

    this.partner
      .rejectMember(data)
      .then((res) => {
        this.toast.success("Successfully added as Non member");
        this.getListItem();
      })
      .catch((err: any) => {
        this.toast.error("Error fetching records");
      });
  }

  dataSourceList() {
    let temp = [];
    this.memberList.forEach((element) => {
      element.isEdit = false;
      temp.push(element);
    });
    this.dataSource1 = new MatTableDataSource<any>(temp);
    // if (this.memberList.length < this.paginator.pageSize) {
    //   this.count = this.memberList.length;
    // }
    this.paginationInfo.length = this.memberList.length;
    // this.dataSource1.paginator = this.paginator
    this.fetching = false;
    this.cd.detectChanges();
  }

  pageChangeEvent(event: any) {
    this.fetching = true;

    if (this.search) {
      this.search.pageNumber =
        this.paginator.pageIndex * this.paginator.pageSize + 1;
      this.searchInfo(this.search);
    } else if (this.sortContent) {
      this.getListItem(this.sortContent);
    } else {
      this.getListItem();
    }
  }

  getMemberProfileUrl(memberId: number) {
    return `/dashboard/partner/member-profile/${memberId}`;
  }

  getQueryParams(element: any) {
    return {
      companyName: this.memberListService.removeSpaces(
        element.memberCompanyName
      ),
      sellerId: element.memberId,
    };
  }

  searchInfo(list, index?: any) {
    this.fetching = true;
    this.cd.detectChanges();
    this.search = list;
    this.search.records = this.paginator
      ? index
        ? (0 + 1) * this.paginator.pageSize
        : (this.paginator.pageIndex + 1) * this.paginator.pageSize
      : 10;
    this.paginator.pageIndex = index ? 0 : this.paginator.pageIndex;

    this.partner
      .searchMember(this.search)
      .then((res: any) => {
        this.memberList = res.partnerMemberList;

        this.memberList.length ? "" : this.toast.error("No records founds");
        this.dataSourceList();
        // this.searchData.searchInfo(res.partnerMemberList)
      })
      .catch((err: any) => {
        this.fetching = false;
        this.toast.error("Error fetching records");
      });
    // this.memberList = list;
    // this.dataSourceList();
    this.cd.detectChanges();
    // }
  }

  getUrl(element) {
    let query =
      element.memberCompanyName
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      element.memberId +
      ".html";
    // window.open(this.baseUrlPipe.transform(["/m/h/" + query]), "_blank");
    window.open(environment.SEO_URL+'/minisite/'+query, "_blank");

    
  }

  select(group) {
    this.dialogRef.close(group);
  }

  addGroupMember(member, event) {
    if (event.checked) {
      this.lists.push(member.memberId);
    } else {
      _.each(this.lists, (item, i) => {
        if (item == member.memberId) {
          this.lists.splice(i, item);
        }
      });
    }
  }
  addUser() {
    let str = "";
    _.each(this.lists, (item, i) => {
      if (this.lists.length - 1 == i) {
        str += item;
      } else {
        str += item + ",";
      }
    });
    console.log(str);
    this.dialogRef.close(str);
  }
  editCredits(item, text) {
    if (text == "edit") {
      this.min = item.flyerCredits;
      item.isEdit = true;
    } else {
      item.isEdit = false;
    }
  }
  async addCredits(item) {
    this.loading = true;
    try {
      let res: any = await this.superAdmin.updateCreditsForPartners(
        item.flyerCredits,
        item.memberId
      );
      if (res && res.creditsUpdated) {
        this.toast.success(res.message);
        item.isEdit = false;
        this.loading = false;
        this.getListItem();
        this.cd.detectChanges();
      } else {
        this.toast.error(res.message);
        this.loading = false;
        this.getListItem();
        this.cd.detectChanges();
      }
    } catch (err) {
      console.log("error", err);
      this.loading = false;
    }
  }
  incrementValue(item) {
    item.flyerCredits++;
  }
  decrementValue(item) {
    if (this.min != item.flyerCredits && item.flyerCredits > this.min) {
      item.flyerCredits--;
    } else {
      this.toast.warning("Minimum credits should be " + this.min);
    }
  }
}
