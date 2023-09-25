import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NewsletterService } from '../../../../../provider/newsletter/newsletter.service';
import { AuthService } from '../../auth/auth.service';
import { MatDialog } from '@angular/material';
import { MyNewsletterViewComponent } from '../my-newsletter-view/my-newsletter-view.component';

@Component({
  selector: 'kt-shared-my-newsletter',
  templateUrl: './my-newsletter.component.html',
  styleUrls: ['./my-newsletter.component.scss']
})
export class SharedMyNewsletterComponent implements OnInit {

  statistics: any;
  memberData: any;
  noData: boolean = false;
  list: any;
  loading: boolean = false;

  constructor(
    private newsletterService: NewsletterService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.memberData = this.authService.getCurrentUser()
    let data: any = {
      Token: 'IBizzo',
      MemberId: this.memberData.id,
      CompanyId: this.memberData.companyId,
      page: 1,
      noOfRecs: 10
    }
    this.newsletterService.getNewsletterHistory(data)
      .then((res: any) => {
        console.log(res);

        this.loading = false
        this.statistics = res.newsLettersHistory
        if (this.statistics.length == 0) {
          this.noData = true
        }
        this.cd.detectChanges();
      })
  }

  myNewsletters(data) {
    const dialogRef = this.dialog.open(MyNewsletterViewComponent, {
      data: data,
      disableClose: true,
      width: '1000px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
    });
  }

}
