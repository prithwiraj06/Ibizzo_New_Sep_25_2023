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
import { ProductFlyersComponent } from "../product-flyers/product-flyers.component";

import moment from "moment";

@Component({
  selector: "kt-product-history",
  templateUrl: "./product-history.component.html",
  styleUrls: ["./product-history.component.scss"],
})
export class ProductHistoryComponent implements OnInit {
  dataSource: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: any = ["#", "sentOn", "recievedBy", "view"];
  currentUser: any = {};
  fetching: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ProductHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: NotificationService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.getHistory();
  }

  async getHistory() {
    try {
      let res: any = await this.service.getFlyersHistory(
        this.currentUser.id,
        this.data.productId,
        this.data.type,
        {index:1,records:1000}
      );
      if (res) {
        this.setTable(res);
      }
    } catch (e) {}
    this.fetching = false;
    this.cd.detectChanges();
  }

  //set table
  setTable(data) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.hasData = data.length > 0 ? true : false;
  }

  //buyer-details(history)
  openProductHistory(item) {
    let data: any = {
      id: item.flyersId,
      type: this.data.type,
      productName: this.data.productName,
    };
    const dialogRef = this.dialog.open(ProductFlyersComponent, {
      data: data,
    });
    this.dialogRef.close();
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
    });
  }

  getDate(item) {
    return moment(item).format("MMMM Do YYYY");
  }
}
