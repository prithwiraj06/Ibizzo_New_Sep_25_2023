import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import Swiper from 'swiper';
declare var window: any;

@Component({
  selector: 'kt-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.scss']
})
export class HeroBannerComponent implements OnInit {
  videos: any = [
    { path: '/assets/media/marketing/video-1.mp4' },
    { path: '/assets/media/marketing/video-2.mp4' },
    { path: '/assets/media/marketing/video-3.mp4' },
  ];
  mySwiper: Swiper;
  
  constructor(
    private cd: ChangeDetectorRef,
    public el: ElementRef
  ) {}
  
  ngOnInit() {
    setTimeout(() => {
      let currentIndex: number = 0;
      let mySwiper: any = new Swiper('.herobanner-swiper-container', {
        slidesPerView: 1,
        spaceBetween: 0,
        freeMode: true,
        navigation: {
          nextEl: '.herobanner.swiper-button-next',
          prevEl: '.herobanner.swiper-button-prev',
        },
        on: {
          init: function (e) {
          },
          slideChange: function (e) {
            window.jQuery('video#video-'+currentIndex)[0].pause();
            currentIndex = mySwiper.activeIndex
            window.jQuery('video#video-'+currentIndex)[0].play();
          },
        }
      });
      this.cd.detectChanges();
    }, 500)
  }
}