import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { NewsletterService } from '../../../../../provider/newsletter/newsletter.service';

@Component({
  selector: 'kt-my-newsletter-view',
  templateUrl: './my-newsletter-view.component.html',
  styleUrls: ['./my-newsletter-view.component.scss']
})
export class MyNewsletterViewComponent implements OnInit {
  templateName: any;
  subjectLine: any;

  constructor(
    public dialogRef: MatDialogRef<MyNewsletterViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auth: AuthService,
    private newsletterService: NewsletterService
  ) { }

  ngOnInit() {
    this.templateName = this.data.templateName;
    this.subjectLine = this.data.subjectLine;
  }
}
