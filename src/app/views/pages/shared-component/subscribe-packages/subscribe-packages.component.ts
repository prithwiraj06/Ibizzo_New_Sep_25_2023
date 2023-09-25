import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import * as _ from "underscore";
import { PaymentjsService } from "paymentjs";
import { environment } from "../../../../../environments/environment";
import { SubscriptionService } from "../../../../../provider/subscription/subscription.service";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { EmailComponent } from "../../auth/login-page/email/email.component";
import { MatDialog } from "@angular/material";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import Swiper from "swiper";
import { ProductService } from "../../../../../provider/product-service/product-service.service";
declare var window: any;

@Component({
  selector: "kt-subscribe-packages",
  templateUrl: "./subscribe-packages.component.html",
  styleUrls: ["./subscribe-packages.component.scss"],
})
export class SubscribePackagesComponent implements OnInit, AfterViewInit {
  @ViewChild("iframe", { static: true }) iframe: ElementRef;
  reciept: any;
  queryParam: string;
  url: string = environment.SEO_URL + "/iframe/menu-packages";
  urlSafe: SafeResourceUrl;
  mySwiper: Swiper;
  arrData: any = [];
  bundleOffers: any = [];
  currentUser: any;
  allPackages: any = [];
  totalDis: any = 0;
  totalValue: any = 0;
  isAlreadyTaken: boolean;
  @Input() cartNo: any;
  @Input() isMember: any;
  @Input() memberId: any;

  offerList: any = [
    "Promote Your Bussiness",
    "Digital Flyers",
    "Contact Facility",
    "Verified Document",
    "Video Facility",
  ];

  checkBox = [];
  constructor(
    private cd: ChangeDetectorRef,
    private payment: PaymentjsService,
    private authService: AuthService,
    private subscribe: SubscriptionService,
    private baseUrlPipe: BaseUrlPipe,
    private router: Router,
    private toast: ToastrService,
    public dialog: MatDialog,
    public sanitizer: DomSanitizer,
    private product: ProductService
  ) {}

  async ngOnInit() {
    if(!this.isMember){
    window.location.href = environment.SEO_URL + "/packages";
    }
    this.currentUser = this.authService.getCurrentUser();
    this.hasPurchased(1);
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    try {
      let packages: any = await this.subscribe.getPackage();
      this.allPackages = packages.packages;
      this.cd.detectChanges();

      let data: any = await this.subscribe.getBundleDetails();
      if (data && data.packages && data.packages.length != 0) {
        let info = data.packages.sort(function (a, b) {
          return parseInt(a.offerCount) - parseInt(b.offerCount);
        });
        this.bundleOffers = info;
      }
    } catch (err) {
      console.log(err);
    }
    setTimeout(() => {
      this.mySwiper = new Swiper(".swiper-container", {
        paginationClickable: true,
        slidesPerView: window.KTUtil.isMobileDevice() ? 1 : this.cartNo ? 3 : 4,
        spaceBetween: 0,
        freeMode: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },

        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
      this.cd.detectChanges();
    }, 1000);
    this.cd.detectChanges();
    this.cd.reattach();
  }

  selcted(i) {
    if (!this.isAlreadyTaken && !this.getCheckArray() && i != 0) {
      this.toast.error(
        "Please Select the Minisite and Sales Catalogue Package"
      );
    }
    console.log(this.checkBox[i]);
    this.changeInList(i);
  }

  changeInList(i) {
    if (!this.isAlreadyTaken && !this.getCheckArray() && i != 0) {
      this.toast.error(
        "Please Select the Minisite and Sales Catalogue Package"
      );
    }
    if (this.checkBox[i]) {
      this.arrData.push(i);
    } else {
      let index = this.arrData.indexOf(i);
      if (index != -1) {
        this.arrData.splice(index, 1);
      }
    }

    console.log("Arr list", this.arrData);
  }

  getAmount(id) {
    if (this.allPackages && this.allPackages.length != 0) {
      let index1 = _.findIndex(this.allPackages, { id: id });
      if (index1 != -1) {
        return this.allPackages[index1].amount;
      }
    }
  }

  getName(i) {
    return "checkbox" + i;
  }

  ngAfterViewInit() {
    const self = this;
  }

  selectedChanges(i) {
    this.checkBox[i] = !this.checkBox[i];
    this.changeInList(i);
  }

  goPrev() {
    this.mySwiper.slidePrev();
  }

  goNext() {
    this.mySwiper.slideNext();
  }

  getBundle() {
    let count = this.arrData.length;
    let index = _.findIndex(this.bundleOffers, {
      offerCount: count.toString(),
    });
    console.log(index);
    let id = 0;
    if (index != -1) {
      id = this.bundleOffers[index].id;
    }
    return id;
  }

  getPercentage() {
    let count = this.arrData.length;
    let index = _.findIndex(this.bundleOffers, {
      offerCount: count.toString(),
    });
    console.log(index);
    let total = 0;
    this.arrData.map((item) => {
      if (item == 0) {
        total += parseInt(this.getAmount(1));
      } else {
        total += parseInt(this.getAmount(item));
      }
    });
    if (index != -1) {
      let dis = parseInt(this.bundleOffers[index].offerDiscount);
      let discount = (total * dis) / 100;
      this.totalDis = discount.toFixed(0);
      this.totalValue = total;

      let total1 = dis == 0 ? total : total - (total * dis) / 100;
      return total1.toFixed(0);
    } else {
      this.totalDis = 0;
      this.totalValue = total;
      if (count == 0) {
        return total;
      } else {
        return total;
      }
    }
  }

  login() {
    const dialogRef = this.dialog.open(EmailComponent, {
      width: "450px",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      window.location.reload();
    });
  }

  // userProfile() {
  //   if (JSON.parse(localStorage.getItem("memberData"))) {
  //     this.userDetails = JSON.parse(
  //       localStorage.getItem("memberData")
  //     ).memberUserInfo;
  //     this.cd.detectChanges();
  //   }
  // }

  verifyRoute() {
    const currentUser: any = this.authService.getCurrentUser();
    if (currentUser && currentUser.email) {
      this.router.navigate(["/main/dashboard/business/profile"], {
        fragment: "company-doc",
      });
    } else {
      this.toast.error("Please Login then go for Subscription");
      this.login();
    }
  }

  getOffers() {
    let index = this.arrData.indexOf(0);
    let info = this.arrData;
    if (index != -1) {
      let data = info;
      data[index] = 1;
      return data;
    } else {
      return this.arrData;
    }
  }

  getCheckArray() {
    debugger;
    if (this.arrData && this.arrData.length != 0) {
      let index = this.arrData.indexOf(0);
      if (index != -1) {
        return true;
      } else {
        return false;
      }
    }
  }

  async makeBundle() {
    if (this.arrData && this.arrData.length != 0 && !this.isAlreadyTaken) {
      if (!this.getCheckArray()) {
        this.toast.error(
          "Please Select the Minisite and Sales Catalogue Package"
        );
        return;
      }
    }
    if (this.arrData && this.arrData.length != 0) {
      if (this.arrData.length == 1) {
        if (this.arrData[0] == 0) {
          this.subScription(1);
        } else if (this.arrData[0] == 2) {
          this.subScription(2);
        } else if (this.arrData[0] == 3) {
          this.verifyRoute();
        } else if (this.arrData[0] == 4) {
          this.subScription(4);
        }
      } else {
        const currentUser: any = this.authService.getCurrentUser();
        // let data=this.getOffers();
        let str = "";

        this.arrData.map((item) => {
          let index = item == 0 ? 1 : item;
          str += "OfferIds=" + index + "&";
        });

        let url = `Package/HasBundledOffers?applicationKey=IBiz&MemberId=${
          this.isMember ? this.memberId : this.authService.getUserId()
        }&${str}`;
        let res: any = await this.subscribe.get(url, null);
        console.log("result", res);
        if (res && res.message && res.offerPurcahsed) {
          this.toast.error(res.message);
        } else {
          // this.reciept = `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;

          // let orderDetails: any = {
          //   email: currentUser.email,
          //   phonenumber: currentUser.phoneNumber,
          //   amount: this.getPercentage(),
          //   receipt: this.reciept,
          //   currency: "INR",
          //   payment_capture: 1,
          //   username: environment.RAZORPAY_PUBLIC_KEY,
          // };
          // console.log(orderDetails);

          try {
            // let res: any = await this.digital.addMemberCartSnapshot(addCardSnap);
            // if (res) {
            // orderDetails.description = "123" + "#~#CART" || "";
            // event.preventDefault();
            // const response: any = await this.payment.checkout({
            //   paymentInstrument: "payment_razorpay",
            //   params: orderDetails,
            // });
            // console.log("Respose", response);

            // this.paymentResponseHanderBundle(response);
            // }
            // this.processingPayment = false;
            let infoOffers = "";
            let offersIds = this.getOffers();
            if (offersIds && offersIds.length != 0) {
              offersIds.map((item, index) => {
                if (index == offersIds.length - 1) {
                  infoOffers += item;
                } else {
                  infoOffers += item + ",";
                }
              });
            }

            let id = this.getBundle();
            let options = {
              offerIds: infoOffers,
              bundledOfferId: id == 0 ? "" : id.toString(),
              amount: this.getPercentage(),
              createdByAdmin: this.isMember ? false : true,
              memberId: this.isMember ? this.memberId : currentUser.id,
            };
            let res: any = await this.subscribe.hasAddToCart(options);
            console.log(res);
            if (res.updated == 1) {
              this.product.broadcastEvent("CART_UPDATED", null);
              this.toast.success("Package Add to cart successfully");
            }
          } catch (e) {
            // this.processingPayment = false;
            this.cd.detectChanges();
          }
        }
      }
    } else {
      this.toast.error("Please Select the package");
    }
  }

  async paymentResponseHanderBundle(id) {
    let razId;
    if (id && id.raw_response && id.raw_response.razorpay_payment_id) {
      razId = id.raw_response.razorpay_payment_id;
    } else {
      razId = id;
    }

    let option = {
      memberId: parseInt(this.authService.getUserId()),
      bundledOfferId: this.getBundle(),
      offerIds: this.getOffers(),
      appSecretKeyPassed: environment.RAZORPAY_PUBLIC_KEY,
      referenceId: this.reciept,
      transationDetails: {
        razorpay_order_id: "",
        razorpay_payment_id: razId,
        razorpay_signature: "",
        amountPaid: this.getPercentage(),
        taxAmount: 0,
      },
      token: "IBiz",
      code: "",
    };

    console.log(option);
    let result: any = await this.subscribe.postBundle(option);
    if (result && result.message == "success") {
      this.toast.success("Successfully purchased");
      window.location.reload();
    } else {
      this.toast.success("Package is Failed to Purchase");
    }
  }

  flyers() {
    const currentUser: any = this.authService.getCurrentUser();
    if (currentUser && currentUser.email) {
      this.router.navigate([
        "/main/dashboard/business/digital-markting/digital-flyer",
      ]);
    } else {
      this.toast.error("Please Login then go for Subscription");
      this.login();
    }
  }

  async hasPurchased(offerId) {
    const currentUser: any = this.authService.getCurrentUser();
    if (currentUser && currentUser.email) {
      let hasTake: any = await this.subscribe.visterHasDetails(
        this.isMember ? this.memberId : currentUser.id,
        offerId
      );
      if (hasTake && hasTake.offerPurcahsed) {
        this.isAlreadyTaken = hasTake.offerPurcahsed;
      }
    }
  }

  getOffersInfo(type, isBasic) {
    console.log("type", type, isBasic);
    if (type == "BASIC") {
      return [1];
    }
    else {
      if (isBasic) {
        return [2, 3, 4];
      }
      else {
        return [2, 3, 4,5];
      }
    }
  }

  async subScription(type) {
    const currentUser: any = this.authService.getCurrentUser();
    if (currentUser && currentUser.email) {
      let hasTake: any = await this.subscribe.hasPurchaseBundleOffers(
        this.isMember ? this.memberId : currentUser.id,
        "OfferIds=" + 1
      );
      let offers = this.getOffersInfo(type, hasTake.offerPurcahsed);
      let str=""
      offers.map((item) => {
        str += "OfferIds=" + item + "&";
      });
      let isPurchased:any = await this.subscribe.hasPurchaseBundleOffers( this.isMember ? this.memberId : currentUser.id, str);
      if (isPurchased && isPurchased.offerPurcahsed) {
        this.toast.success("Offer has been already purchased");
        return;
      }

      // this.reciept = `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;

      // let orderDetails: any = {
      //   email: currentUser.email,
      //   phonenumber: currentUser.phoneNumber,
      //   amount:offerId==1?parseInt(this.getAmount(1)): parseInt(this.getAmount(offerId)),
      //   receipt: this.reciept,
      //   currency: "INR",
      //   payment_capture: 1,
      //   username: environment.RAZORPAY_PUBLIC_KEY,
      // };

      try {
        // let res: any = await this.digital.addMemberCartSnapshot(addCardSnap);
        // if (res) {
        // orderDetails.description = "123" + "#~#CART" || "";
        // event.preventDefault();
        // const response: any = await this.payment.checkout({
        //   paymentInstrument: "payment_razorpay",
        //   params: orderDetails,
        // });
        // console.log("Respose", response);

        // this.paymentResponseHander(response,offerId);
        // }
        // this.processingPayment = false;
        let id = this.getBundle();

        let options = {
          offerIds: offers.toString(),
          bundledOfferId: type == "BASIC"
          ? ""
          : type == "Advanced" && isPurchased.offerPurcahsed
            ? "2"
            : "5",
          amount: type == "BASIC"
          ? 2999
          : 4999,
          createdByAdmin: this.isMember ? false : true,
          memberId: this.isMember ? this.memberId : currentUser.id,
        };
        let res: any = await this.subscribe.hasAddToCart(options);
        console.log(res);
        if (res.updated == 1) {
          this.product.broadcastEvent("CART_UPDATED", null);
          this.toast.success("Package Add to cart successfully");
        }
      } catch (e) {
        // this.processingPayment = false;
        this.cd.detectChanges();
      }
    } else {
      this.toast.error("Please Login then go for Subscription");
      this.login();
    }
  }

  async paymentResponseHander(id, offerId) {
    const currentUser: any = this.authService.getCurrentUser();
    this.queryParam =
      currentUser.companyName
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      currentUser.id +
      ".html";
    console.log("razor pay", this.reciept);
    console.log("razaor pay ide", id);
    let razId = "";
    if (id && id.raw_response && id.raw_response.razorpay_payment_id) {
      razId = id.raw_response.razorpay_payment_id;
    } else {
      razId = id;
    }
    try {
      if (id) {
        let finalPackage: any = {
          memberId: currentUser.id,
          offerId: offerId,
          packageId: 0,
          appSecretKeyPassed: environment.RAZORPAY_PUBLIC_KEY,
          referenceId: this.reciept,
          transationDetails: {
            razorpay_payment_id: razId,
            amountPaid:
              offerId == 1
                ? parseInt(this.getAmount(1))
                : parseInt(this.getAmount(offerId)),
            taxAmount: 0,
          },
          token: "IBiz",
        };
        console.log("paymentdata", finalPackage);
        if (offerId == 2) {
          let res: any = await this.subscribe.purchaseContactPackage(
            finalPackage
          );
          console.log("add membepackge details no error============>", res);
          if (res && res.message == "success") {
            this.toast.success("Contact Offer Purchased Successfully");
            window.open(
              this.baseUrlPipe.transform(["/m/h/" + this.queryParam]),
              "_blank"
            );
          } else {
            if (res && res.message == "Offer has been already purchased") {
              this.toast.success("Offer has been already purchased");
            } else {
              this.toast.error("Package Purchasing is Failed");
            }
          }
        } else if (offerId == 1) {
          let res: any = await this.subscribe.addPurchangeOffers(finalPackage);
          console.log("add membepackge details no error============>", res);
          if (res && res.message == "success") {
            this.toast.success("Purchase offers successfully");
            window.open(
              this.baseUrlPipe.transform(["/m/h/" + this.queryParam]),
              "_blank"
            );
          } else {
            if (res && res.message == "Offer has been already purchased") {
              this.toast.success("Offer has been already purchased");
            } else {
              this.toast.error("Package Purchasing is Failed");
            }
          }
        } else if (offerId == 3) {
          // let res: any = await this.subscribe.addPurchangeURL("Profile/AddDocumentForVerification",finalPackage);
          // console.log("add membepackge details no error============>", res);
          // if (res && res.message == "success") {
          //   this.toast.success("Purchase offers successfully");

          // } else {
          //   if (res && res.message == "Offer has been already purchased") {
          //     this.toast.success("Offer has been already purchased");
          //   } else {
          //     this.toast.error("Package Purchasing is Failed");
          //   }
          // }
          this.router.navigate([
            "/main/dashboard/business/profile#company-doc",
          ]);
        } else if (offerId == 4) {
          let res: any = await this.subscribe.addPurchangeURL(
            "Package/PurchaseCorporateVideo",
            finalPackage
          );
          console.log("add membepackge details no error============>", res);
          if ((res && res.message == "Success") || res.message == "success") {
            this.toast.success("Purchase offers successfully");
            window.location.reload();
          } else {
            if (res && res.message == "Offer has been already purchased") {
              this.toast.success("Offer has been already purchased");
            } else {
              this.toast.error("Package Purchasing is Failed");
            }
          }
        }
      }
    } catch (error) {
      console.log("add membepackge details===========", error);
    }
  }
  openContactUs() {
    window.location.href = environment.SEO_URL + "/packages#footer";
  }
}
