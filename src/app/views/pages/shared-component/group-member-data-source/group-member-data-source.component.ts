import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  Inject,
} from "@angular/core";
import { MatPaginator, MatTableDataSource, MatSort } from "@angular/material";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SettingService } from "../../../../../provider/setting/setting.service";

@Component({
  selector: "kt-group-member-data-source",
  templateUrl: "./group-member-data-source.component.html",
  styleUrls: ["./group-member-data-source.component.scss"],
})
export class GroupMemberDataSourceComponent implements OnInit {
  displayedColumns: any = ["brands", "companies", "salesCatalogue"];
  fetching: boolean;
  hasItems: boolean;
  pageNumber = 1;
  records = 10;
  token: any = 171065;
  partnerData: any;
  membersList: any = [];
  dataSource: any = [];
  searchKey: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("sort1", { static: true }) sort: MatSort;
  constructor(
    public dialogRef: MatDialogRef<GroupMemberDataSourceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private baseUrlPipe: BaseUrlPipe,
    private setting: SettingService
  ) {}

  ngOnInit() {
    this.getGroupMemberList(this.pageNumber, this.records);
  }
  async getGroupMemberList(pageNumber, records) {
    this.fetching = true;
    try {
      let params: any = {
        groupId: this.data,
        pageNumber: pageNumber,
        records: records,
      };
      let data: any = await this.setting.getGroupMemberList(params);
      console.log("members", data);
      this.settingDataSourceTable(data);
      this.fetching = false;
      this.cd.detectChanges();
    } catch (e) {
      console.log("Failed to fetch the data");
      this.fetching = false;
    }
  }
  getImage(image) {
    return this.setting.getImageUrl(image, "GetDownload");
  }
  settingDataSourceTable(data) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.hasData = data.length > 0 ? true : false;
    this.fetching = false;
    this.cd.detectChanges();
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
      window.open(this.baseUrlPipe.transform(["/m/s/" + query]), "_blank");
    } else {
      window.open(this.baseUrlPipe.transform(["/m/h/" + query]), "_blank");
    }
  }
  pageChangeEvent(event) {
    this.fetching = true;
    this.pageNumber = this.paginator.pageIndex * this.paginator.pageSize + 1;
    this.records = (this.paginator.pageIndex + 1) * this.paginator.pageSize;

    this.getGroupMemberList(this.pageNumber, this.records);
  }
}
