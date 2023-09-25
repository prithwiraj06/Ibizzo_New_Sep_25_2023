import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { SuperadminService } from "../../../../../provider/superadmin/superadmin.service";
import { MatPaginator, MatTableDataSource, MatSort } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { PartnerService } from "../../../../../provider/partner/partner.service";

@Component({
  selector: 'kt-partner-member',
  templateUrl: './partner-member.component.html',
  styleUrls: ['./partner-member.component.scss']
})
export class PartnerMemberComponent implements OnInit {
  displayedColumns: any = ["number", "name", "members"];
  pageNumber = 1;
  records = 10;
  searchText: any;
  status: any = 2;

  dataSource: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("sort1", { static: true }) sort: MatSort;
  fetching: boolean;
  constructor(
    private partner: PartnerService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private baseUrlPipe: BaseUrlPipe
  ) { }

  ngOnInit() {
    this.getPartnerMemberStats(this.pageNumber, this.records, this.status);
  }

  async sortData(event) {
    if (event) {
      this.fetching = true;
      let sort = {
        sortOrder: event.direction.toUpperCase(),
        sortKey: event.active,
      };
      try {
        let res: any = await this.partner.getMemberStats(
          this.pageNumber,
          this.records,
          this.status,
          "",
          sort.sortKey,
          sort.sortOrder
        );
        this.setDataTable(res.partnerMemberList);
      } catch { }
    }
  }
  async getPartnerMemberStats(pageNumber, records, status) {
    try {
      let data: any = await this.partner.getMemberStats(
        pageNumber,
        records,
        status
      );
      this.setDataTable(data.partnerMemberList);
      console.log("data", data);
      this.cd.detectChanges();
    } catch (e) {
      console.log("Failed to fetch the data");
      this.fetching = false;
    }
  }
  setDataTable(data) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.hasData = data.length > 0 ? true : false;
    this.fetching = false;
    this.cd.detectChanges();
  }

  pageChangeEvent(event) {
    this.fetching = true;
    this.getPartnerMemberStats((this.paginator.pageIndex * this.paginator.pageSize + 1),((this.paginator.pageIndex + 1) * this.paginator.pageSize), this.status);
  }
  async search() {
    let res: any = await this.partner.getMemberStats(
      this.pageNumber,
      this.records,
      this.status,
      this.searchText
    );
    if (res) {
      this.setDataTable(res.partnerMemberList);
    }
  }


}
