import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatPaginator, MatTableDataSource, MatSort } from "@angular/material";
import { MembersService } from "../../../../../../provider/members/members.service";
import { environment } from "../../../../../../environments/environment";
import { BaseService } from "../../../../../../provider/base-service/base.service";
import { BaseUrlPipe } from "../../../../../core/_base/layout/pipes/base-url";

@Component({
  selector: "kt-members-list",
  templateUrl: "./members-list.component.html",
  styleUrls: ["./members-list.component.scss"],
})
export class MembersListComponent implements OnInit {
  displayedColumns: any = ["brands", "companies", "salesCatalogue"];
  pageNumber = 1;
  records = 5;
  APIPath: string;
  isUserAuthenticated: boolean = true;
  dataSource: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("sort1", { static: true }) sort: MatSort;
  searchKey: any;
  token: any;
  fetching: boolean;
  hasItems: boolean;
  orgId: any;
  membersList: any = [];
  memberinfo: any;
  loading: boolean;
  constructor(
    private memberListService: MembersService,
    private service: BaseService,
    private cd: ChangeDetectorRef,
    private baseUrlPipe: BaseUrlPipe
  ) {}

  ngOnInit() {
    let tokenData: any = JSON.parse(localStorage.getItem("memberData"));
    this.token = tokenData.token;
    this.orgId = tokenData.memberUserInfo.organizationId;
    this.isUserAuthenticated = tokenData.isAuthenticated;
    this.memberinfo = tokenData.memberUserInfo;
    this.getMembersList();
  }

  async getMembersList() {
    this.fetching = true;
    try {
      if (this.isUserAuthenticated == true) {
        this.membersList = await this.memberListService.getMemberList(
          this.pageNumber,
          this.token,
          this.records
        );
        this.settingDataSourceTable();
        this.fetching = false;
        this.hasItems = false;
        this.cd.detectChanges();
      }
    } catch (e) {
      console.log("Failed to fetch the data");
    }
  }

  async applyFilter() {
    this.loading = true;
    this.membersList = await this.memberListService.searchMemberList(
      1,
      this.token,
      10,
      this.searchKey.trim()
    );
    this.loading = false;
    this.settingDataSourceTable();
    this.searchKey = "";
  }

  async pageChangeEvent(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.records = event.pageSize;
    this.memberListService
      .getMemberList(this.pageNumber, this.token, this.records)
      .then((res: any) => {
        this.membersList = res;
        this.settingDataSourceTable();
        this.cd.detectChanges();
      });
  }

  settingDataSourceTable() {
    if (this.membersList.companyProducts) {
      this.dataSource = new MatTableDataSource<any>(
        this.membersList.companyProducts
      );
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.hasData =
        this.membersList.companyProducts.length > 0 ? true : false;
      this.cd.detectChanges();
    }
  }

  getUrl(element, option?: any) {
    let query =
      element.companyName
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      element.memberId +
      ".html";
    if (option == "sales-catalogue") {
      // window.open(this.baseUrlPipe.transform(["/m/s/" + query]), "_blank");
      window.open(environment.SEO_URL+'/sales-catelogue/'+query, "_blank");

    } else {
      // window.open(this.baseUrlPipe.transform(["/m/h/" + query]), "_blank");
      window.open(environment.SEO_URL+'/minisite/'+query, "_blank");

      
    }
  }

  getQueryParams(element: any) {
    return {
      companyName: this.memberListService.removeSpaces(element.companyName),
      sellerId: element.memberId,
    };
  }
  getImage(image) {
    let splitImage = image.split(",");
    return this.service.getImageUrl(splitImage[0], "GetDownload");
  }
}
