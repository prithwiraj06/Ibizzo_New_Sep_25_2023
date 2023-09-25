import {Component, OnInit} from '@angular/core';
import {SelectNewsletterComponent} from '../select-newsletter/select-newsletter.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'kt-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class DashboardWidgetComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.getDashboard();
  }

  gotoNewsletter() {
    const dialogRef = this.dialog.open(SelectNewsletterComponent, {
      height: '300px',
      width: 'auto',
      disableClose: true,
      data: {},
    });
    dialogRef.afterClosed().subscribe((res: any) => {});
  }
  getDashboard() {
    let title: any = localStorage.getItem('Dashboard');
    if (title == 'business' || 'partner') {
      localStorage.removeItem('Dashboard');
      localStorage.setItem('Dashboard', 'admin');
    }
  }
}
