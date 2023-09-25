import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { SuperadminService } from '../../../../../../provider/superadmin/superadmin.service';

@Component({
  selector: 'kt-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent implements OnInit {
  displayedColumns: any = ['#', 'name', 'email', 'phone', 'trxId', 'amount', 'comments', 'status'];
  dataSource: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort
  fetching: boolean;
  page: any;
  record: boolean;
  constructor(
    private superAdmin: SuperadminService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.page = {
      index: 1,
      pageSize: 10
    }
    this.setDataSource()
  }

  setDataSource() {
    this.fetching = true;
    this.superAdmin.reviseList(this.page)
      .then((res: any) => {
        this.dataSource = []
        this.dataSource = new MatTableDataSource<any>(res.cartList);
        // this.dataSource.paginator = this.paginator;
        this.record = res.cartList.length == 0 ? true : false;
        this.dataSource.sort = this.sort;
        this.dataSource.hasData = true;
        this.fetching = false;
        this.cd.detectChanges();
      })
  }

  getMail(element) {
    return "mailto:" + element.email
  }
  pageChangeEvent() {
    this.page.index = (this.paginator.pageIndex * this.paginator.pageSize) + 1;
    this.page.pageSize = ((this.paginator.pageIndex + 1) * this.paginator.pageSize)
    this.setDataSource();
  }

}
