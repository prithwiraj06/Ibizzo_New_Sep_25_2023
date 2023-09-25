import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ProductService } from '../../../../../../../provider/product-service/product-service.service'

@Component({
  selector: 'kt-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: [ './purchase-list.component.scss' ]
})
export class PurchaseListComponent implements OnInit {

  token: string = '';
  constructor (
  ) { }

  ngOnInit() {
    let res: any = JSON.parse(localStorage.getItem('memberData'));
    if (res.token) {
      this.token = res.token;
    }
  }
}
