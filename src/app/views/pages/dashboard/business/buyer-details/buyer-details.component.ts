import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { NotificationService } from '../../../../../../provider/notification/notification.service';
import { AuthService } from '../../../../../views/pages/auth/auth.service';

@Component({
  selector: 'kt-buyer-details',
  templateUrl: './buyer-details.component.html',
  styleUrls: ['./buyer-details.component.scss']
})
export class BuyerDetailsComponent implements OnInit {

  dataSource: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: any = ['#', 'name', 'companyName', 'location'];
  currentUser: any;
  numberBuyers: number = 0;
  fetching: boolean = true;

  constructor (
    public dialogRef: MatDialogRef<BuyerDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: NotificationService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.getHistory();
  }

  async getHistory() {
    let res: any = null;
    try {
      if (this.data.type == 1) {
        res = await this.service.getFlyersHistoryProducts(this.currentUser.id, this.data.id)
      } else {
        res = await this.service.getFlyersHistoryPurchaseProducts(this.currentUser.id, this.data.id)
      }
      if (res.flyersSentList) {
        this.numberBuyers = res.flyersSentTo;
        this.setTable(res.flyersSentList);
      }
    } catch (e) { }
    this.fetching = false;
    this.cd.detectChanges();
  }

  //set table
  setTable(data) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.hasData = (data.length > 0) ? true : false;
  }
}
