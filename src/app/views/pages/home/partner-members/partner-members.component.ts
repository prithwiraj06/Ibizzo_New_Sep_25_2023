import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatPaginator, MatTableDataSource, MatSort } from "@angular/material";
import { BaseService } from "../../../../../provider/base-service/base.service";
import { MembersService } from "../../../../../provider/members/members.service";
import { MatDialogRef } from "@angular/material";
import { PartnerService } from "../../../../../provider/partner/partner.service";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { environment } from "../../../../../environments/environment";

export interface DisplayRoles {
  brands: any;
  companies: string;
  salesCatalogue: string;
}
@Component({
  selector: "kt-partner-members",
  templateUrl: "./partner-members.component.html",
  styleUrls: ["./partner-members.component.scss"],
})
export class PartnerMembersComponent implements OnInit {
  displayedColumns: any = ["brands", "companies", "salesCatalogue"];
  fetching: boolean;
  hasItems: boolean;
  pageNumber = 1;
  records = 10;
  token: any = 171065;
  partnerData: any;
  membersList: any = [];
  dataSource: any = [];
  loading: boolean;
  searchKey: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("sort1", { static: true }) sort: MatSort;
  content: any;
  constructor(
    public dialogRef: MatDialogRef<PartnerMembersComponent>,
    private memberListService: MembersService,
    private service: BaseService,
    private cd: ChangeDetectorRef,
    private partnerService: PartnerService,
    private baseUrlPipe: BaseUrlPipe
  ) {}

  ngOnInit() {
    this.partnerData = this.partnerService.getCurrentPartner();
    this.getMembersList(this.pageNumber, this.records);
  }

  async getMembersList(pageNumber: any, records: any) {
    this.pageNumber = pageNumber;
    this.fetching = true;
    this.records = records;
    try {
      let params: any = {
        applicationKey: "IBiz",
        orgId: this.partnerData.id,
        pageNumber: this.pageNumber,
        records: this.records,
        sortOrder: "ASC",
        sortKey: "name",
      };
      this.membersList = await this.memberListService.getPartnerMembers(params);
      this.settingDataSourceTable();
      this.fetching = false;
      this.hasItems = false;
      this.cd.detectChanges();
    } catch (e) {
      console.log(e);
    }
  }
  getQueryParams(element: any) {
    return {
      companyName: this.memberListService.removeSpaces(
        element.memberCompanyName
      ),
      sellerId: element.memberId,
    };
  }
  settingDataSourceTable() {
    this.dataSource = new MatTableDataSource<any>(
      this.membersList.partnerMemberList
    );
    this.dataSource.sort = this.sort;
    this.dataSource.hasData =
      this.membersList.partnerMemberList.length > 0 ? true : false;
    this.cd.detectChanges();
  }
  onClose() {
    this.dialogRef.close();
  }
  getImage(image) {
    return this.service.getImageUrl(image, "GetDownload");
  }
  pageChangeEvent(event) {
    this.fetching = true;
    // if (event.pageSize == 10) {
    //   this.pageNumber = parseInt(event.pageIndex + "1");
    // } else if (event.pageSize == 20) {
    //   this.pageNumber = parseInt(event.pageIndex * 2 + "1");
    // } else if (event.pageSize == 30) {
    //   this.pageNumber = parseInt(event.pageIndex * 3 + "1");
    // }
    // this.records = (event.pageIndex + 1) * event.pageSize;
    this.applyFilter(this.content, false);
  }
  async applyFilter(searchInfo?: any, index?: any) {
    this.content = searchInfo;
    this.loading = true;
    this.paginator.pageIndex = index ? 0 : this.paginator.pageIndex;
    try {
      let params: any = {
        applicationKey: "IBiz",
        orgId: this.partnerData.id,
        pageNumber: this.paginator
          ? this.paginator.pageIndex * this.paginator.pageSize + 1
          : 1,
        records: this.paginator
          ? (this.paginator.pageIndex + 1) * this.paginator.pageSize
          : 10,
        sortOrder: "ASC",
        sortKey: "name",
        searchKey: searchInfo ? searchInfo.trim() : "",
      };
      this.membersList = await this.memberListService.getPartnerMembers(params);
      this.settingDataSourceTable();
      this.fetching = false;
      this.loading = false;
      this.searchKey = "";
    } catch (e) {
      console.log(e);
    }
  }

  getUrl(element, option?: any) {
    let query =
      element.memberCompanyName
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
}
