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
import { ProductService } from "../../../../../provider/product-service/product-service.service";
@Component({
  selector: "kt-purchse-history",
  templateUrl: "./purchse-history.component.html",
  styleUrls: ["./purchse-history.component.scss"],
})
export class PurchseHistoryComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  fetching: boolean = true;
  pageNumber = 0;
  records: 50;
  history: any = [];
  constructor(
    public dialogRef: MatDialogRef<PurchseHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService
  ) {}

  ngOnInit() {
    console.log("data", this.data);
    if (this.data && this.data.productId) {
      this.getRfqHistory();
    }
  }
  async getRfqHistory() {
    try {
      let res: any = await this.productService.getRfqHistory(
        this.data.productId,
        this.pageNumber,
        this.records
      );
      this.history = res.rfqHistory;
      console.log("result", res);
    } catch (err) {
      console.log("error", err);
    }
  }
}
