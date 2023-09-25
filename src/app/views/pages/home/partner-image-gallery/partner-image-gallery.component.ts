import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { PartnerService } from '../../../../../provider/partner/partner.service'
import { BaseUrlPipe } from '../../../../core/_base/layout/pipes/base-url';
import { RfqWithoutIdComponent } from '../../shared-component/rfq-without-id/rfq-without-id.component';

import { MatDialog } from '@angular/material';
import * as _ from 'underscore';
import Swiper from 'swiper';

@Component({
  selector: 'kt-partner-image-gallery',
  templateUrl: './partner-image-gallery.component.html',
  styleUrls: ['./partner-image-gallery.component.scss']
})
export class PartnerImageGalleryComponent implements OnInit {
  private defaultImages: any = [
    {
      imageName: '/assets/media/marketing/700x272/1.png',
      url: '/registration',
      description: ''
    },
    {
      imageName: '/assets/media/marketing/700x272/2.png',
      url: '/registration',
      description: ''
    },
    {
      imageName: '/assets/media/marketing/700x272/3.png',
      url: '/registration',
      description: ''
    },
    {
      imageName: '/assets/media/marketing/245x135/1.png',
      url: '/registration',
      description: ''
    },
    {
      imageName: '/assets/media/marketing/245x135/2.png',
      url: '/registration',
      description: ''
    },
    {
      imageName: '/assets/media/marketing/245x135/1.png',
      url: '/registration',
      description: ''
    },
    {
      imageName: '/assets/media/marketing/245x135/2.png',
      url: '/registration',
      description: ''
    },
    {
      imageName: '/assets/media/marketing/245x135/3.png',
      url: '/registration',
      description: ''
    },
    {
      imageName: '/assets/media/marketing/245x135/4.png',
      url: '/registration',
      description: ''
    }
  ]
  public imageGallery: any = [];
  public promotionGallery: any = [];
  constructor(
    private partnerService: PartnerService,
    private cd: ChangeDetectorRef,
    public el: ElementRef,
    private baseUrlPipe: BaseUrlPipe,
    public dialog: MatDialog,
  ) { }

  async ngOnInit() {
    let result: any = await this.partnerService.getPartnerImagesByToken(this.partnerService.getCurrentPartnerId());
    if (result && result.imageDetails) {
      _.each(this.defaultImages, (item: any, index: number) => {
        if (result.imageDetails[index]) {
          this.defaultImages[index] = result.imageDetails[index];
          this.defaultImages[index].imageName = this.partnerService.getImageUrl(this.defaultImages[index].imageName);
        } else {
          this.defaultImages[index].url = this.baseUrlPipe.transform(this.defaultImages[index].url);
        }
      })
      this.imageGallery = this.defaultImages.splice(0, 5);
      this.promotionGallery = this.defaultImages;

      this.cd.detectChanges();

      setTimeout(() => {
        new Swiper('.image-gallery-swiper-container', {
          slidesPerView: 1,
          spaceBetween: 10,
          slidesOffsetBefore: 0,
          centeredSlides: true,
          freeMode: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }
        });
        this.cd.detectChanges();
      }, 100)
    }
  }

  getSlideStyle(imageName: string) {
    return {
      'backgroundImage': `url('${imageName}')`
    };
  }

  requestForQuote() {
    const dialogRef = this.dialog.open(RfqWithoutIdComponent, {
      data: 'NoId',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }
    });
  }

}
