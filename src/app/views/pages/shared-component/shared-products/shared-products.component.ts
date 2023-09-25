import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment'
import { BaseService } from '../../../../../provider/base-service/base.service'

@Component({
  selector: 'kt-shared-cards',
  templateUrl: './shared-products.component.html',
  styleUrls: ['./shared-products.component.scss']
})
export class SharedCardsComponent implements OnInit {
  buttonName: any;
  member: any;
  orgId:any;
  
  constructor(private base: BaseService) { }
  @Input() items: any;
  @Input() btnName: any;
  @Input() rating: any;
  @Input() product:any;

  ngOnInit() {
      this.member = JSON.parse(localStorage.getItem('memberData'));
      this.orgId = this.member.memberUserInfo.organizationId
      this.buttonName = this.btnName ? this.btnName : 'More Details'
  }

  getImages(image) {
    let content = this.base.getImageUrl(image)
    if (content) {
      return content
    }
    else {
      return '../../../../assets/media/placeholder/product.jpg'
    }
  }

}
