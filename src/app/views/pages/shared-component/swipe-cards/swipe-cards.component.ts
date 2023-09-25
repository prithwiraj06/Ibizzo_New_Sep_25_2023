import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnChanges,
} from "@angular/core";
import { MinisiteService } from "../../../../../provider/minisite/minisite.service";
import _ from "lodash";
import Swiper from "swiper";
declare var window: any;

@Component({
  selector: "kt-swipe-cards",
  templateUrl: "./swipe-cards.component.html",
  styleUrls: ["./swipe-cards.component.scss"],
})
export class SwipeCardsComponent implements OnInit, OnChanges {
  mySwiper: Swiper;
  @Input() products: any;
  @Input() title: string = "";
  @Input() slidesPerView: number = 4;
  @Input() colors: any;
  @Input() isMinisite: boolean;
  @Input() source: boolean;
  @Input() isPartner: boolean;
  @Input() isButtonEnable: boolean;
  @Input() isCluster: boolean;
  @Input() isParterMember:any=false

  buttonStyleColor: any;
  backgroundColor: string;
  btnName: string;

  refresh() {
    this.mySwiper.refresh();
  }

  constructor(
    private service: MinisiteService,
    private cd: ChangeDetectorRef
  ) {}

  viewImage(image) {
    return this.service.getImageUrl(image, "GetDownload");
  }

  ngOnInit() {
    if (this.isButtonEnable) {
      this.btnName = "Join";
    } else {
      this.btnName = "More Details";
    }
    console.log("Swiper", this.isButtonEnable);

    if (!this.colors) {
      this.colors = {
        accentColor: "#CC0011",
        alternateColor: "#FFFFFF",
      };
    }

    this.buttonStyleColor = {
      backgroundColor: this.colors.accentColor,
      color: this.colors.alternateColor,
    };
    if (this.products && this.products.length) {
      setTimeout(() => {
        if (!this.isCluster) {
          this.mySwiper = new Swiper(".swiper-container", {
            paginationClickable: true,
            nextButton: ".swiper-button-next",
            prevButton: ".swiper-button-prev",
            slidesPerView: window.KTUtil.isMobileDevice()
              ? 1
              : this.slidesPerView,
            spaceBetween: 0,
            freeMode: true,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
          });
        } else {
          this.mySwiper = new Swiper(".swiper-container1", {
            paginationClickable: true,
            nextButton: ".swiper-button-next",
            prevButton: ".swiper-button-prev",
            slidesPerView: window.KTUtil.isMobileDevice()
              ? 1
              : this.slidesPerView,
            spaceBetween: 0,
            freeMode: true,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
          });
        }

        this.cd.detectChanges();
      }, 500);
    }
    this.cd.detectChanges();
  }

  getStyles() {
    return this.isCluster ? "swiper-container1" : "swiper-container";
  }

  ngOnChanges(e) {
    // this.mySwiper.refresh();
    this.cd.detectChanges();
  }

  goPrev() {
    this.mySwiper.slidePrev();
  }

  goNext() {
    this.mySwiper.slideNext();
  }

  lightenColor(percent: number) {
    var color = this.colors.accentColor;
    var num = parseInt(color.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      B = ((num >> 8) & 0x00ff) + amt,
      G = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
        (G < 255 ? (G < 1 ? 0 : G) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }
}
