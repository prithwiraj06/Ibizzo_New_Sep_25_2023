import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatPaginator,
  MatTableDataSource,
  MatDialog,
} from "@angular/material";
import { NotificationService } from "../../../../../../provider/notification/notification.service";
import { AuthService } from "../../../auth/auth.service";
import { BuyerDetailsComponent } from "../buyer-details/buyer-details.component";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "kt-product-flyers",
  templateUrl: "./product-flyers.component.html",
  styleUrls: ["./product-flyers.component.scss"],
})
export class ProductFlyersComponent implements OnInit {
  dataSource: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: any = [];
  currentUser: any;
  numberBuyers: number = 0;
  fetching: boolean = true;
  params: any = {
    index: 1,
    page: 5,
  };
  constructor(
    public router: Router,
    public dialogRef: MatDialogRef<BuyerDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: NotificationService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.data.type == "myCompaign") {
      this.displayedColumns = ["#", "companyName", "seen"];
      this.getDigitalFlyers();
    } else {
      this.displayedColumns = ["#", "companyName", "product", "seen", "view"];
      this.getHistory();
    }
  }

  async getHistory() {
    let res: any = null;
    try {
      if (this.data.type == 1) {
        res = await this.service.getFlyersHistoryProducts(
          this.currentUser.id,
          this.data.id
        );
      } else {
        res = await this.service.getFlyersHistoryPurchaseProducts(
          this.currentUser.id,
          this.data.id
        );
      }
      if (res.flyersSentList) {
        this.numberBuyers = res.flyersSentTo;
        this.setTable(res.flyersSentList);
      }
    } catch (e) {}
    this.fetching = false;
    this.cd.detectChanges();
  }

  async getDigitalFlyers() {
    let res: any = await this.service.getDigitalFlyers(
      this.currentUser.id,
      this.data.id,
      this.params
    );
    this.setTable(res.flyersSentList);
  }

  pageChangeEvent() {
    this.fetching = true;
    this.params.index = this.paginator.pageIndex * this.paginator.pageSize + 1;
    this.params.page = (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    this.getDigitalFlyers();
  }

  //set table
  setTable(data) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.data.type == "myCompaign"
      ? ""
      : (this.dataSource.paginator = this.paginator);
    this.dataSource.hasData = data.length > 0 ? true : false;
    this.fetching = false;
  }

  getStatus(element) {
    if (element.isSeen == "True") {
      return '<span class="kt-font-bold kt-font-primary ml-2"> Yes </span>';
    } else {
      return '<span class="kt-font-bold kt-font-success ml-2"> No </span>';
    }
  }
  openFlyer(item: any) {
    let flyerType = "productFlyers";
    const url = `/main/dashboard/business/flyer/${flyerType}-${item.flyersMasterId}`;
    this.router.navigateByUrl(url);
    this.dialogRef.close();
  }
}
