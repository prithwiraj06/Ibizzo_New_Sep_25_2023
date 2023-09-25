import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { HelperDialogComponent } from '../helper-dialog/helper-dialog.component';
import { SuperadminService } from '../../../../../../provider/superadmin/superadmin.service';
import { FormControl } from '@angular/forms';
import * as  moment from 'moment'
import { CartDetailsInfoComponent } from '../cart-details-info/cart-details-info.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kt-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {
  dataSource: any = [];
  displayedColumns: any = ['#', 'amount', 'trxId', 'email', 'contact', 'action'];
  orderSnapShot = [{
    name: "Order",
    trxId: "100",
    description: 'Approved'
  }]
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort
  date = new FormControl(new Date(moment().subtract(1, 'months').format()));
  date1 = new FormControl(new Date());
  fromDate: any;
  toDate: any;
  dateInfo: any;
  fetching: boolean;
  count: number = 1000;
  constructor(
    private dialog: MatDialog,
    private superAdmin: SuperadminService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.fromDate = this.date.value;
    this.toDate = this.date1.value;
    this.dateInfo = {
      from: moment().subtract(1, 'months').format("YYYY-MM-DD"),
      to: moment().add(1, 'day').format("YYYY-MM-DD"),
      PageNo: 1,
      NoOfRecs: 10,
      Filter: 1
    }
    console.log(this.dateInfo);
    this.setDataSourceTable(this.dateInfo);
  }

  setDataSourceTable(source) {
    this.fetching = true;
    this.cd.detectChanges();
    this.superAdmin.getAllPayments(source)
      .then((res: any) => {
        console.log("result", res);
        if (res) {
          this.dataSource = [];
          this.dataSource = new MatTableDataSource<any>(res);
          // this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.hasData = true;
          this.fetching = false;
          this.cd.detectChanges();
        }
        else {
          this.dataSource = [];
          this.fetching = false;
          this.dataSource.hasData = false;
          this.cd.detectChanges();
        }
      })
      .catch((err) => {
        console.log(err);
        this.fetching = false;
        this.cd.detectChanges();
      })
  }

  pageChangeEvent() {
    this.dateInfo.PageNo = (this.paginator.pageSize * this.paginator.pageIndex) + 1;
    this.dateInfo.NoOfRecs = ((this.paginator.pageIndex + 1) * this.paginator.pageSize);
    this.setDataSourceTable(this.dateInfo);
  }

  formDateFormat() {
    this.dateInfo.from = moment(this.fromDate).format("YYYY-MM-DD");
    this.setDataSourceTable(this.dateInfo);
  }

  toDateFormat() {
    this.dateInfo.to = moment(this.toDate).add(1, 'day').format("YYYY-MM-DD")
    this.setDataSourceTable(this.dateInfo);
  }

  async approvedTransaction(event: any, helpId: any) {
    let id = await this.getWhichType(event);
    console.log(id);

    if (id) {
      const dialogRef = this.dialog.open(HelperDialogComponent, {
        width: "500px",
        height: "300px",
        data: {
          info: event,
          type: id,
          id: helpId
        }
      })
      dialogRef.afterClosed().subscribe((result) => {
        if (!result) {
          return
        }
        this.paginator.pageIndex = 0;
        this.pageChangeEvent();
      })
    }
    else {
      this.toastr.error("Type is missing")
    }

  }
  async viewCartTransaction(event) {
    let res: any = await this.superAdmin.viewCart(event.description.split('#~#')[0] || event.description)
    if (res.cartDetail.length > 0) {
      const dialogRef = this.dialog.open(CartDetailsInfoComponent, {
        data: {
          result: res,
          info: event
        }
      })
      dialogRef.afterClosed().subscribe((result) => {
        debugger
        if (!result) {
          return
        }
        if (result == 'Approved') {
          this.approvedTransaction(event, 1)
        }
        this.cd.detectChanges();
      })
    }
    else {
      this.toastr.error("No Cart details");
    }

  }

  checkView(element, reject?: any) {
    return element.description.split('#~#')[1] == 'CART' ? false : reject == 3 ? false : true;
  }

  async getWhichType(event) {
    let info = event.description.split('#~#')[1];
    if (info == 'CART') {
      return 1;
    }
    else if (info == 'LEADS') {
      return 2;
    }
    else {
      return 3;
    }


    // return new Promise(async (resolve, reject) => {
    //   let res: any = await this.superAdmin.viewCart()
    //   if (res) {
    //     let id = res.cartDetail[0].packageDetailId;
    //     if (id == 2) {
    //       resolve(2)
    //     }
    //     else if (id == 4) {
    //       resolve(3)
    //     }
    //     else {
    //       resolve(1)
    //     }
    //   }
    // })

  }

}
