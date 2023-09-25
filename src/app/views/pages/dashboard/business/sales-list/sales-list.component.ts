import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../../../../../provider/product-service/product-service.service'

@Component({
  selector: 'kt-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: [ './sales-list.scss' ]
})
export class SalesListComponent implements OnInit {

  token: string = '';
  constructor (
  ) { }

  async ngOnInit() {
    let res: any = JSON.parse(localStorage.getItem('memberData'));
    if (res.token) {
      this.token = res.token;
    }
  }
}
