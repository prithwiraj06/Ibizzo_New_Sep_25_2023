import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { SuperadminService } from "../../../../../../provider/superadmin/superadmin.service";
import { UpdateDiscountComponent } from '../update-discount/update-discount.component';
@Component({
  selector: 'kt-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.scss']
})
export class AddDiscountComponent implements OnInit {
  displayedColumns: any = ["#", "name", "discount", "offers", "price","action"];
  dataSource: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("sort1", { static: true }) sort: MatSort;

  fetching:boolean
  constructor(
    private service: SuperadminService,
    private dialog:MatDialog
  ) { }

  ngOnInit() {
    this.getList();
  }

  async getList() {
    try {
      this.fetching = true;
     
      let res: any = await this.service.discountList();
      let rfqList = res.packages;
      this.settingTableData(rfqList);
      this.fetching = false;

      console.log("result", res);
    } catch (err) {
      console.log("error", err);
      this.fetching = false;
    }
  }
  settingTableData(data: any) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  updateDiscount(ele){
    const dialogRef = this.dialog.open(UpdateDiscountComponent, {
      width: "450px",
      disableClose: true,
      data:ele
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.getList();
    });
  }

}
