import { Component, OnInit, Input } from '@angular/core';
import { DigitalFlyerService } from '../../../../../../provider/digital-flyers/digital-flyer.service'
import { MatDialog } from '@angular/material';
import * as _ from 'underscore'
import { _ACTIVE_RUNTIME_CHECKS } from '@ngrx/store/src/tokens';
import { AuthService } from '../../../../pages/auth/auth.service'

@Component({
  selector: 'kt-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notification: any = [];
  @Input() bgImage: any

  constructor(private digital: DigitalFlyerService,
    private dialog: MatDialog,
    private auth: AuthService
  ) { }

  async ngOnInit() {
    let flyers: any = await this.digital.getFlyerNotifications();
    _.each(flyers.productFlyers, (item) => {
      item.flyer = 'productFlyers';
      this.notification.push(item)
    })
    _.each(flyers.digitalFlyers, (item) => {
      item.flyer = 'digitalFlyers';
      this.notification.push(item)
    })

    console.log(this.notification);

  }
}
