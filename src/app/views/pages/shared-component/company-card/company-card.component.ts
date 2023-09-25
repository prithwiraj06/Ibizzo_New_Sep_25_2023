import { Component, Input, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { BaseService } from '../../../../../provider/base-service/base.service';
import * as _ from 'underscore';
import Swiper from 'swiper';
declare var window: any;

@Component({
  selector: 'kt-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss'],
})
export class CompanyCardComponent implements OnInit {
  @Input() company: any;
  public queryParams: any;
  constructor(
    public baseService: BaseService,
    public el: ElementRef,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.queryParams = this.company.supplierName.replace(/[^a-zA-Z0-9_ ]/g, "").toLowerCase().trim().replace(/\s+/g, '-') + "-" + this.company.memberId + ".html"

    if (this.company && this.company.image) {
      this.company.image = this.company.image.split(',');
      _.each(this.company.image, (image: string, i: number) => {
        this.company.image[i] = this.baseService.getImageUrl(image);
      })

      const self: any = this;
      setTimeout(() => {
        const containerEle: HTMLElement = window.jQuery(self.el.nativeElement).find('.swiper-container');

        new Swiper(containerEle, {
          slidesPerView: 1,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }
        });
        this.cd.detectChanges();
      }, 100)
    }

  }
}
