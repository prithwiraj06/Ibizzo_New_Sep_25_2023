import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { BaseUrlPipe } from '../../../../../core/_base/layout/pipes/base-url';
import { BaseService } from '../../../../../../provider/base-service/base.service';
import { AuthService } from '../../../../../views/pages/auth/auth.service';

@Component({
  selector: 'kt-seller-notifications',
  templateUrl: './seller-notification.component.html'
})
export class SellerNotificationComponent implements OnInit {

  currentUser: any = {};
  constructor(
    public dialogRef: MatDialogRef<SellerNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private baseUrlPipe: BaseUrlPipe,
    private route: Router,
    private baseService: BaseService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  openMinisite() {
    let options: any = {
      companyName: this.baseService.removeSpaces(this.data.companyName),
      companyId: this.data.companyId,
      sellerId: this.currentUser.id
    };
    this.route.navigate(
      [this.baseUrlPipe.transform(['/minisite/home'])],
      { queryParams: options },
    );
    this.dialogRef.close();
  }

}
