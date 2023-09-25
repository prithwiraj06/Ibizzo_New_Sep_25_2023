import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../auth/auth.service";
import { UserProfileService } from "../../../../../../provider/user-profile/user-profile.service";
import { BaseUrlPipe } from "../../../../../core/_base/layout/pipes/base-url";
import { NgbPopoverConfig } from "@ng-bootstrap/ng-bootstrap";
import { ProductService } from "../../../../../../provider/product-service/product-service.service";
import { ToastrService } from "ngx-toastr";
import { LayoutUtilsService } from "../../../../../core/_base/crud";
import * as _ from "underscore";
import { SellerNotificationComponent } from "../../../shared-component/seller-notification/seller-notification.component";
import { DigitalFlyerService } from "../../../../../../provider/digital-flyers/digital-flyer.service";
import { MatDialog } from "@angular/material";
import { SettingService } from "../../../../../../provider/setting/setting.service";
import { PartnerService } from "../../../../../../provider/partner/partner.service";
import { EnquiryService } from "../../../../../../provider/enquiry/enquiry.service";
import { MinisiteService } from "../../../../../../provider/minisite/minisite.service";
import {environment} from '../../../../../../environments/environment'

declare var window;
@Component({
  selector: "kt-widget",
  templateUrl: "widget.component.html",
  styleUrls: ["widget.component.scss"],
})
export class DashboardWidgetComponent implements OnInit {
  pendingEnq: number = 0;
  memberDetails: any;
  profile: any;
  websiteLink: any = "";
  companyName: any;
  companyId: any;
  sellerId: string;
  orgId: any;
  token: any;
  productDetails: any;
  myHsn: string = "";
  memberData: any;
  notification: any = [];
  fetching: boolean = true;
  total: any;
  queryParam: any;
  fragment: string;
  loading: boolean;
  freeCredits: any = 0;

  constructor(
    public router: Router,
    private product: ProductService,
    private toastr: ToastrService,
    private layoutUtilsService: LayoutUtilsService,
    public authService: AuthService,
    private userProfile: UserProfileService,
    private baseUrlPipe: BaseUrlPipe,
    config: NgbPopoverConfig,
    private digital: DigitalFlyerService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private setting: SettingService,
    private partner: PartnerService,
    private enquiryService: EnquiryService,

    private cd: ChangeDetectorRef,
    private service: MinisiteService,
  ) {
    // customize default values of popovers used by this component tree
    config.placement = "right";
    config.triggers = "hover";
    this.service.broadcastEvent("SEARCH", null);

  }

  async ngOnInit() {
    
    this.activatedRoute.fragment.subscribe((fragment: string) => {
      this.scrollToAnchor(fragment);
    });

    this.memberData = this.authService.getCurrentUser();
    this.token = JSON.parse(localStorage.getItem("memberData")).token;
    this.getPendingEnquiries(this.token);
    let rfqData = JSON.parse(localStorage.getItem("previousRfq"));
    this.memberDetails = this.authService.getCurrentUser();
    this.companyName = this.userProfile.removeSpaces(
      this.memberDetails.companyName
    );
    this.companyId = this.memberDetails.companyId;
    this.sellerId = this.memberDetails.id;
    this.orgId = this.memberDetails.organizationId;
    this.queryParam =
      this.companyName
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      this.sellerId +
      ".html";
    if (rfqData != null) {
      this.product
        .getProduct(this.companyId, rfqData.productId)
        .then((res: any) => {
          this.productDetails = res.userProduct || "";
          this.myHsn = this.productDetails.hsn;
        });
      let _data = {
        applicationKey: "IBiz",
        data: {
          memberId: JSON.parse(localStorage.getItem("memberData"))
            .memberUserInfo.id,
          productId: rfqData.productId,
          quantity: rfqData.quantity,
          quantityType: rfqData.quantityType,
          purchaserQuery: rfqData.purchaserQuery,
          getQuoteFromAll: rfqData.getQuoteFromAll,
          shareContact: false,
        },
      };
      this.product.sendEnquiry(_data).then((res: any) => {
        this.toastr.success("Successfuly sent the RFQ request");
        localStorage.removeItem("previousRfq");
        const _title: string = "Success";
        const _description: string = "Your Request has been posted.";
        const _cancelText: string = "Similar Products";
        const submit: string = "Cancel";
        const textOne: string = "Get Quotes For Similar Products";
        const textTwo: string = "Click on similar products to view the list.";
        const dialogRef = this.layoutUtilsService.ActionElement(
          _title,
          _description,
          _cancelText,
          submit,
          textOne
          // textTwo
        );
        dialogRef.afterClosed().subscribe(async (res) => {
          if ((res || {}).searchHsn) {
            this.hsnProductSearch();
          }
        });
      });
      localStorage.removeItem("previousRfq");
      this.createPost();
    }
    this.userProfile.getProfile(this.memberData.id).then((res: any) => {
      this.profile = res.userDetails;
      this.websiteLink = res.userDetails.website;
    });

    let flyers: any = await this.digital.getFlyerNotifications();
    console.log("flyers",flyers);
    // this.notification=flyers.flyers;
    let totalLength = flyers.digitalFlyers.length + flyers.productFlyers.length;
    for (let i = 0; i < totalLength; i++) {
      if (flyers.digitalFlyers.length > i) {
        // flyers.digitalFlyers[i].flyer = "digitalFlyers";
        flyers.digitalFlyers[i].type = "digitalFlyers";
        this.notification.push(flyers.digitalFlyers[i]);
      }
      if (flyers.productFlyers.length > i) {
        // flyers.productFlyers[i].flyer = "productFlyers";
        flyers.productFlyers[i].type = "productFlyers";
        this.notification.push(flyers.productFlyers[i]);
      }
    }
    console.log("this.notification===========>",this.notification);
    

    this.fetching = false;
    this.getDashboard();
    this.createPost();
    this.getCreditsDetails();
    this.cd.detectChanges();
  }
  getCreditsDetails() {
    return new Promise(async (resolve) => {
      this.enquiryService
        .getUserCredits(this.authService.getUserId())
        .then((res: any) => {
          this.freeCredits = res.userDetails.flyerCredits;
          this.cd.detectChanges();
          resolve(true);
        });
      this.cd.detectChanges();
    });
  }
  sellerNotification(item: any) {
    console.log("item", item);
    let flyerType: any;
    let params = {
      Token: "IBizzo",
      type: item.type == "productFlyers" ? 1 : 3,
      flyersId: item.flyersMasterId,
      MemberId: this.authService.getUserId(),
    };
    this.digital.updateFlyers(params);
    flyerType =
      item.type == "productFlyers" ? "productFlyers" : "digitalFlyers";
    const url = `/main/dashboard/business/flyer/${flyerType}-${item.flyersMasterId}`;
    this.router.navigateByUrl(url);

    // const dialogRef = this.dialog.open(SellerNotificationComponent, {
    //   data: item,
    //   width: "1000px",
    //   height: "598px",
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (!result) {
    //     return;
    //   }
    // });
  }

  goToLink() {
    window.open(this.websiteLink);
  }

  goToProfile(fragment: any) {
    this.router.navigate(
      [this.baseUrlPipe.transform(["/dashboard/business/profile"])],
      {
        queryParams: {
          companyName: this.companyName,
          companyId: this.companyId,
          orgId: this.orgId,
        },
        fragment: fragment,
      }
    );
  }
  async hsnProductSearch() {
    try {
      let response: any = await this.product.getHsnProduct(
        this.memberData.id,
        this.myHsn
      );
      if (response.userProducts.length == 0) {
        const _title: string = "Success";
        const _description: string = "Similar Suppliers";
        const _cancelText: string = "Cancel";
        const submit: string = "";
        const textOne: string = "Sorry there is no match found";
        const textTwo: string =
          "Are you looking for any other Products? Please click on RFQ.";
        const dialogRef = this.layoutUtilsService.ActionElement(
          _title,
          _description,
          _cancelText,
          submit,
          textOne
          // textTwo
        );
        dialogRef.afterClosed().subscribe(async (res) => {});
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getPendingEnquiries(token) {
    if (token) {
      try {
        let res: any = await this.product.getPendingEnquiries(this.token);
        if (res.data) {
          this.pendingEnq = res.data.totalCount - res.data.totalRead;
          this.total = res.data.totalCount;
          this.cd.detectChanges();
        }
      } catch (e) {}
    }
  }
  getDashboard() {
    let title: any = localStorage.getItem("Dashboard");
    if (title == "partner" || "admin") {
      localStorage.removeItem("Dashboard");
      localStorage.setItem("Dashboard", "business");
    }
  }

  scrollToAnchor(location: string, wait = 0): void {
    const element = document.getElementById(location);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, wait);
    }
  }
  createPost() {
    let postData = JSON.parse(localStorage.getItem("previousPost"));
    if (postData && postData.partnerId) {
      let data: any = {
        partnerId: postData.partnerId,
        postMemberId: JSON.parse(localStorage.getItem("memberData"))
          .memberUserInfo.id,
        webLink: postData.webLink ? postData.webLink : "",
        contentLink: postData.contentLink ? postData.contentLink : "",
        contentType: postData.contentType,
        isApproved: true,
        articleContent: postData.articleContent ? postData.articleContent : "",
        token: "IBizzo",
      };
      this.partner.createPartnerPosts(data).then(async (res: any) => {
        if (res.message == "This member cannot create discussion") {
          this.toastr.warning(res.message);
          this.fetching = false;
        } else {
          this.toastr.success(res.message);
          this.fetching = false;
          localStorage.removeItem("previousPost");
        }
      });
    } else if (postData && postData.groupId) {
      let data: any = {
        groupId: postData.groupId,
        postMemberId: JSON.parse(localStorage.getItem("memberData"))
          .memberUserInfo.id,
        webLink: postData.webLink ? postData.webLink : "",
        contentLink: postData.contentLink ? postData.contentLink : "",
        contentType: postData.contentType,
        isApproved: true,
        articleContent: postData.articleContent ? postData.articleContent : "",
        token: "IBizzo",
      };
      this.setting.createGroupPosts(data).then(async (res: any) => {
        if (res.message == "This member cannot create discussion") {
          this.toastr.warning(res.message);
          this.fetching = false;
        } else {
          this.toastr.success(res.message);
          this.fetching = false;
          localStorage.removeItem("previousPost");
        }
      });
    }
  }

  getMinisiteUrl(){
   return environment.SEO_URL+'/minisite/'+this.queryParam
  }
}
