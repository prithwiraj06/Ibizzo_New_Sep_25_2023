import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MainSiteService } from '../../../../../provider/main-site/main-site.service';
import { SwipeCardsComponent } from '../swipe-cards/swipe-cards.component'
import _ from 'lodash';
import { SuggestedClustersService } from '../../../../../provider/suggested-cluster/suggested-clusters.service';

@Component({
  selector: 'kt-new-arrivals',
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.scss'],
})
export class NewArrivalsComponent implements OnInit {
  newArrivals: any = [];
  products: any = [];
  slidesPerView: number = 4;
  spaceBetween: number = 30;
  servicesAndProducts: any = [];
  userServices: any = [];
  userProducts: any = [];
  loading: any = {
    newArrivals: false,
  };
  fetching: boolean;
  title: any;

  constructor(public service: MainSiteService,
    private cd: ChangeDetectorRef,
    private cluster: SuggestedClustersService) { }

  @Input() home: any;
  @ViewChild('newArrivalSwiperRef', { static: false })
  newArrivalSwiperRef: SwipeCardsComponent;
  @Input() colors: any;
  @Input() isPartner: boolean;
  @Input() isBotton: any = '';
  @Input() isShared: any

  async ngOnInit() {
    console.log("New Arrivals", this.isBotton);
    if (this.isBotton) {
      this.title = "Suggested Cluster"
    }
    else {
      this.title = "New Arrivals"
    }

    this.fetching = true;
    let orgId: any = 0;
    let memberInfo: any = JSON.parse(localStorage.getItem('memberData'))
    if (memberInfo) {
      orgId = memberInfo.memberUserInfo.organizationId;
    }
    let data: any;
    data = this.home == true ? {} : { orgId: parseInt(orgId) };
    this.slidesPerView = 4;
    this.spaceBetween = this.home == true ? 30 : 25;

    if (this.isBotton) {
      let res: any = await this.cluster.groupList();
      if (res) {
        _.each(res, (item) => {
          if (memberInfo.token != item.ownerId) {
            this.newArrivals.push(item)
          }
        })
      }
      this.cd.detectChanges();
    }
    else {
      this.service.getNewArrivals(data).subscribe((userProducts: any) => {
        try {
          if (this.newArrivals && !this.newArrivals.length) {
            this.newArrivals = userProducts;
            this.cd.detectChanges();
          }
        } catch (e) { }
      })
    }

    // let params: any = {};
    // this.service.productsAndServices(params).then((res: any) => {
    //   this.servicesAndProducts = res;
    //   this.setServicesAndProducts();
    // });
  }

  //set new arrivals
  // setData() {
  //   if (this.newArrivals.length > 0) {
  //     _.each(this.newArrivals, (item) => {
  //       let obj = {
  //         'companyName': item.companyName,
  //         'priceMin': item.priceMin,
  //         'priceMax': item.priceMax,
  //         'productName': item.productName,
  //         'productImages': item.productImages,
  //         'companyId': item.companyId,
  //         'productId': item.productId
  //       }
  //       this.products.push(obj);
  //     })
  //     this.loading.newArrivals = true;
  //     this.cd.detectChanges();
  //   }
  // }

  //set products and services
  setServicesAndProducts() {
    if (this.servicesAndProducts.userServices.length > 0) {
      _.each(this.servicesAndProducts.userProducts, (item) => {
        let obj = {
          companyName: item.companyName,
          priceMin: item.priceMin,
          priceMax: item.priceMax,
          productName: item.productName,
          productImages: item.productImages,
          companyId: item.companyId,
          productId: item.productId,
        };
        this.userProducts.push(obj);
      });
    }

    if (this.servicesAndProducts.userProducts.length > 0) {
      _.each(this.servicesAndProducts.userServices, (item) => {
        let obj = {
          companyName: item.companyName,
          priceMin: item.priceMin,
          priceMax: item.priceMax,
          productName: item.productName,
          productImages: item.productImages,
          companyId: item.companyId,
          productId: item.productId,
        };
        this.userServices.push(obj);
      });
    }
  }
}
