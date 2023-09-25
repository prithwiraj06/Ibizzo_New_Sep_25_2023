import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionService } from '../../../../../../../provider/subscription/subscription.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'kt-subscription-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class SubscriptionListComponent implements OnInit {

  //properties
  displayedColumns: any = ['number', 'name', 'noOfItems', 'amountPaid', 'status'];
  token: string = '';
  dataSource: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;

  constructor(
    private service: SubscriptionService
  ) { }

  ngOnInit() {
    let res: any = JSON.parse(localStorage.getItem('memberData'));
    if (res.token) {
      this.token = res.token;
    }
    this.getMemberSubscriptions()
  }

  async getMemberSubscriptions() {
    try {
      let res: any = await this.service.getMemberSubscriptionByAccessToken(this.token);

      if (res.myPackages) {
        this.dataSource = new MatTableDataSource<any>(res.myPackages);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.hasData = (res.myPackages.length > 0) ? true : false;
      }
    }
    catch (e) {
      console.log(e);
    }
  }

}
