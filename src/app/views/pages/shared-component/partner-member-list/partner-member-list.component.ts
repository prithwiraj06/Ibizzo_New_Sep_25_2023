import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  Input,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PartnerService } from "../../../../../provider/partner/partner.service";
import { AuthService } from "../../auth/auth.service";
import { ToastrService } from "ngx-toastr";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialogRef,
} from "@angular/material";
import { DataSourceTableComponent } from "../data-source-table/data-source-table.component";

@Component({
  selector: "kt-partner-member-list",
  templateUrl: "./partner-member-list.component.html",
  styleUrls: ["./partner-member-list.component.scss"],
})
export class PartnerMemberListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild("sort1", { static: false }) sort: MatSort;
  @ViewChild("searchData", { static: false })
  searchData: DataSourceTableComponent;
  @Input() search: any;
  @Input() isGroup: any;
  dataSource1: any;
  displayedColumns: string[] = [
    "id",
    "name",
    "email",
    "phone",
    "companyName",
    "registeredPartner",
    "actions",
  ];
  selectedIndex: number = 0;
  newRequestTab: boolean = true;
  memberTab: boolean;
  nonMemberTab: boolean;
  option: any = 1;
  searchTypes: any = [
    { text: "Email", value: 1 },
    { text: "phone", value: 2 },
    { text: "Name", value: 3 },
    { text: "CompanyName", value: 4 },
  ];
  searchText: any;
  searchBar: boolean;
  memberList: any = [];
  fetching: boolean;
  count: any = 1000;
  partnerId: any;
  id: number;
  searchMember: any;
  searchTextData: any;
  type: any = 1;
  info: any;
  content: any;
  constructor(
    private partnerService: PartnerService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<PartnerMemberListComponent>
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.partnerId = params.id;
    });
    if (this.partnerId) {
      this.selectedIndex = 1;
      this.type = 2;
      this.memberTab = true;
      this.newRequestTab = false;
    }
    if (this.search) {
      this.searchBar = this.search;
      this.getDetails();
    }
  }

  onTabPanelClick(event, tab) {
    this.newRequestTab = event.index === 0 ? true : false;
    this.memberTab = event.index === 1 ? true : false;
    this.nonMemberTab = event.index === 2 ? true : false;
    this.type = event.index + 1;
  }

  pageChangeEvent(event) {
    this.searchContent(this.content, false);
  }

  getDetails() {
    this.dataSource1 = new MatTableDataSource<any>(this.memberList);
    this.dataSource1.sort = this.sort;
    this.fetching = false;
    this.cd.detectChanges();
  }

  searchContent(searchInfo, index?: any) {
    this.content = searchInfo;
    this.paginator.pageIndex = index ? 0 : this.paginator.pageIndex;
    this.fetching = true;
    let data = {
      applicationKey: "IBiz",
      token: this.authService.getUserId(),
      type: this.option,
      data: searchInfo.trim(),
      records: this.paginator
        ? (this.paginator.pageIndex + 1) * this.paginator.pageSize
        : 10,
      pageNumber: this.paginator
        ? this.paginator.pageIndex * this.paginator.pageSize + 1
        : 1,
    };
    this.partnerService
      .searchText(data)
      .then((res: any) => {
        this.memberList = res.partnerMembers;
        this.memberList.length ? "" : this.toast.error("No records founds");
        this.getDetails();
      })
      .catch((err: any) => {
        this.fetching = false;
        this.toast.error("Error fetching records");
      });
    this.info = this.searchText;
    this.searchText = "";
  }

  searchMembers() {
    this.memberList = [];
    this.fetching = true;

    let data = {
      applicationKey: "IBiz",
      token: this.partnerId ? this.partnerId : this.authService.getUserId(),
      orgId: this.authService.getOrganizationId(),
      status: this.type,
      searchKey: this.searchMember.trim(),
      pageNumber: 1,
      records: 10,
    };
    this.searchTextData = data;
    this.searchData.searchInfo(this.searchTextData, true);
    this.searchMember = "";
  }

  addToMember(index: any, contact: any) {
    let data = {
      token: this.authService.getUserId(),
      requestInfo: [
        {
          organizationId: this.id,
          memberId: contact.memberId,
        },
      ],
      applicationKey: "IBiz",
    };

    this.partnerService
      .getToValidateMember(data)
      .then((res) => {
        this.cd.detectChanges();
        this.toast.success("Successfully added as member");
      })
      .catch((err: any) => {
        this.toast.error("Error fetching records");
      });
  }
}
