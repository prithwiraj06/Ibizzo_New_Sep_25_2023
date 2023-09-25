import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ChangeDetectorRef,
} from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { SuperadminService } from "../../../../../provider/superadmin/superadmin.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
@Component({
  selector: "kt-product-catagory-table",
  templateUrl: "./product-catagory-table.component.html",
  styleUrls: ["./product-catagory-table.component.scss"],
})
export class ProductCatagoryTableComponent implements OnInit {
  displayedColumns: any = ["id", "name"];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild("sort1", { static: false }) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  isRecord: boolean;
  loading: boolean;
  id: any;
  constructor(
    public admin: SuperadminService,
    public dialogRef: MatDialogRef<ProductCatagoryTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public cd: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      this.loading = true;
      let res: any = await this.admin.getProductCategoryDetails(this.data);
      this.dataSource = new MatTableDataSource<any>(res.productCategoryList);
      this.isRecord = res.productCategoryList.length > 0 ? true : false;
      this.loading = false;
      this.cd.detectChanges();
    } catch (e) {
      console.log(e);
    }
  }
 
}
