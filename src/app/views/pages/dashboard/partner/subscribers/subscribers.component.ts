import { Component, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatPaginator,
  MatSort,
  MatTableDataSource
} from '@angular/material';
import { NewsletterService } from '../../../../../../provider/newsletter/newsletter.service';
import { AuthService } from '../../../auth/auth.service';

export interface DisplayMembers {
  Name: string;
  Email: string;
  Company: string;
}

@Component({
  selector: 'kt-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss']
})

export class SubscribersComponent implements OnInit {

  displayedColumns: string[] = ['SI No', 'Name', 'Email', 'Company', 'Ph no'];
  dataSource: any;
  fetching : boolean;
  list: any = [];
  title: any = 'Unsubscribed members'
  memberData: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  paginationInfo: any = {
    length: 13,
    pageIndex: 0,
    pageSize: 1,
    previousPageIndex: 0,
  };
  count: any = 0;

  constructor(
    private newsletterService: NewsletterService,
    private authService: AuthService,
    private cd : ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.memberData = this.authService.getCurrentUser()    
    this.getUnsubscribersList();
  }

  getUnsubscribersList() {
    this.fetching = true;
    let data: any = {
      'Token': 'IBizzo',
      'OrgId': parseInt(this.memberData.organizationId),
      'Page': 1,
      'NoOfRecs': 100,
    }
    this.newsletterService.getNonSubscribers(data)
      .then((res: any) => {
        this.fetching = false;
        this.list = res.mebmbers
        if(this.list.length>0){
          this.count = res.mebmbers[0].cnt;
        }        
        this.setData();
      })
  }

  setData() {
    this.dataSource = new MatTableDataSource<DisplayMembers>(this.list);
    this.dataSource.paginator = this.paginator;
  }

  pageChangeEvent(event: any) {
    this.paginationInfo = event;    
  }

}
