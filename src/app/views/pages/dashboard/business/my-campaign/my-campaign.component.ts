import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import {
  MatPaginator,
  MatTableDataSource,
  MatSort,
  MatDialogRef,
  MatDialog,
} from "@angular/material";
import { NotificationService } from "../../../../../../provider/notification/notification.service";
import { AuthService } from "../../../auth/auth.service";
import { Router, ActivatedRoute } from "@angular/router";

import moment from "moment";
import { ProductFlyersComponent } from "../product-flyers/product-flyers.component";
@Component({
  selector: "kt-my-campaign",
  templateUrl: "./my-campaign.component.html",
  styleUrls: ["./my-campaign.component.scss"],
})
export class MyCampaignComponent implements OnInit {
  displayedColumns: any = [
    "siNo",
    "name",
    "sentDate",
    "sentTo",
    "seenBy",
    "view",
  ];
  dataSource: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("sort1", { static: true }) sort: MatSort;
  flyersHistory: any;
  memberInformation: any;
  loading: boolean;
  page: any = {};
  count: any = 1000;
  constructor(
    private notification: NotificationService,
    private auth: AuthService,
    public router: Router,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<MyCampaignComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading = true;
    this.memberInformation = this.auth.getUserId();
    this.page.index = 1;
    this.page.records = 10;
    this.getHistory();
  }

  async getHistory() {
    try {
      this.flyersHistory = await this.notification.getFlyersHistory(
        this.memberInformation,
        0,
        3,
        this.page
      );
      this.settingDataSourceTable();
    } catch {
      console.log("Failed to fetching records");
    }
  }

  pageChangeEvent() {
    this.page.index = this.paginator.pageIndex * this.paginator.pageSize + 1;
    this.page.records = (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    this.getHistory();
  }

  settingDataSourceTable() {
    if (this.flyersHistory) {
      this.dataSource = new MatTableDataSource<any>(this.flyersHistory);
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.hasData = this.flyersHistory.length != 0 ? true : false;
      this.loading = false;
      this.cd.detectChanges();
    }
  }

  getDateFormate(date) {
    return moment(date).format("L");
  }

  openProductHistory(item) {
    let data: any = {
      id: item.flyersId,
      type: "myCompaign",
    };
    const dialogRef = this.dialog.open(ProductFlyersComponent, {
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
    });
  }
  openFlyer(item: any) {
    let flyerType = "digitalFlyers";
    const url = `/main/dashboard/business/flyer/${flyerType}-${item.flyersId}`;
    this.router.navigateByUrl(url);
  }
}
