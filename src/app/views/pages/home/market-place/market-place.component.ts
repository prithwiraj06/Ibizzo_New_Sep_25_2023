import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PartnerService } from '../../../../../provider/partner/partner.service'
import Swiper from 'swiper';
declare var window: any;

@Component({
  selector: 'kt-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.scss']
})
export class MarketPlaceComponent implements OnInit {
  data: any = [];
  mySwiper: Swiper;

  constructor(
    private partnerService: PartnerService,
    private cd: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.data = this.partnerService.getCachedPartners();
    if(this.data && this.data.length){
      setTimeout(() => {
        this.mySwiper = new Swiper('.marketplace-swiper-container', {
          paginationClickable: true,
          nextButton: '.marketplace-swiper-button-next',
          prevButton: '.marketplace-swiper-button-prev',
          slidesPerView: window.KTUtil.isMobileDevice()? 1 : 3,
          spaceBetween: 0,
          freeMode: true,
          pagination: {
            el: '.marketplace-swiper-pagination',
            type: 'fraction',
          },
        });
        this.cd.detectChanges();
      }, 500)
    }
  }

  getUrl(partner: any, path: string){
    const location: any = document.location;
    const partnerName = this.partnerService.removeSpaces(partner.name);
    return `/${partnerName}/${path}`;
  }

  goPrev() {
    this.mySwiper.slidePrev();
  }

  goNext() {
    this.mySwiper.slideNext();
  }
}
