import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { SuperadminService } from "../../../../../../provider/superadmin/superadmin.service";
@Component({
  selector: "kt-listing-rfq",
  templateUrl: "./listing-rfq.component.html",
  styleUrls: ["./listing-rfq.component.scss"],
})
export class ListingRfqComponent implements OnInit {
  displayedColumns: any = ["#", "product", "hsn", "location", "email", "phno"];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("sort1", { static: true }) sort: MatSort;
  pageNumber = 1;
  records = 10;
  fetching: boolean;
  length: number = 1000;
  token: string = "";
  searchText: string = "";
  dataSource: any = [];
  rfqList: any = [];
  constructor(
    private service: SuperadminService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getRfqLeads();
  }

  async getRfqLeads() {
    try {
      this.fetching = true;
      let params = {
        pageNumber: this.pageNumber,
        records: this.records,
        searchText: this.searchText,
      };
      let res: any = await this.service.getRfqForSuperAdmin(params);
      this.rfqList = res.purchaserEnquiryData;
      this.settingTableData(this.rfqList);
      this.fetching = false;

      console.log("result", res);
    } catch (err) {
      console.log("error", err);
      this.fetching = false;
    }
  }
  settingTableData(data: any) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.sort = this.sort;
    this.dataSource.hasData = data.length > 0 ? true : false;
    this.cd.detectChanges();
  }
  async pageChangeEvent(event) {
    this.pageNumber = this.paginator.pageIndex * this.paginator.pageSize + 1;
    this.records = (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    let params = {
      pageNumber: this.pageNumber,
      records: this.records,
      searchText: this.searchText,
    };
    let res: any = await this.service.getRfqForSuperAdmin(params);
    this.rfqList = res.purchaserEnquiryData;
    this.settingTableData(this.rfqList);
  }
  async search() {
    this.getRfqLeads();
  }
}
