import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { BaseService } from "../../../../../provider/base-service/base.service";
import { ProductService } from "../../../../../provider/product-service/product-service.service";
import { AuthService } from "../../auth/auth.service";
import { UserProfileService } from "../../../../../provider/user-profile/user-profile.service";
import { ActivatedRoute } from "@angular/router";
import { DigitalFlyerService } from "../../../../../provider/digital-flyers/digital-flyer.service";
import { MinisiteService } from "../../../../../provider/minisite/minisite.service";
import {environment} from '../../../../../environments/environment'
@Component({
  selector: "kt-seller-notification",
  templateUrl: "./seller-notification.component.html",
  styleUrls: ["./seller-notification.component.scss"],
})
export class SellerNotificationComponent implements OnInit {
  queryParam: string;
  productName: any;
  logo: any;
  memberInfo: any;
  userInfo: any;

  companyName: any;
  sellerId: any;
  flyerDetails: any;
  flyerType: any;
  isPublic: boolean;
  isData: boolean;
  userDetails: any;
  isLoading: boolean;

  constructor(
    public dialogRef: MatDialogRef<SellerNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private baseUrlPipe: BaseUrlPipe,
    private baseService: BaseService,
    private service: ProductService,
    private miniService: MinisiteService,
    private cd: ChangeDetectorRef,
    private auth: AuthService,
    private activedRouter: ActivatedRoute,
    private digital: DigitalFlyerService,
    private userProfile: UserProfileService
  ) { }

  async ngOnInit() {
    this.activedRouter.fragment.subscribe((param) => { });
    let param = this.activedRouter.snapshot.params.id;
    this.memberInfo = await this.auth.getCurrentUser();
    if (param) {
      this.getFlyerDetails(param);
      this.cd.detectChanges();
    } else {
      console.log("flu=yer details", this.data);
      this.flyerType = this.data.flyerType;
      this.flyerDetails = this.data;
    }

    if (this.data.productId) {
      this.getProductName();
    }
  }

  openWebsite(url) {
    window.open(url,'_blank')
  }

  async getProductName() {
    try {
      let res: any = await this.service.getProduct(
        this.data.senderCompanyId,
        this.data.productId
      );
      if (res.userProduct) {
        this.data.productName = res.userProduct.productName;
        this.cd.detectChanges();
      }
    } catch (e) { }
  }

  openMinisite() {
    let queryParam =
      this.flyerDetails.senderCompany
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      this.flyerDetails.senderId +
      ".html";
      // let url = this.baseUrlPipe.transform(["/m/h/" + queryParam]);
   let url =  environment.SEO_URL+'/minisite/'+queryParam
    window.open(url, "_blank");
  }

  salesCatalogs() {
    let queryParam =
      this.flyerDetails.senderCompany
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      this.flyerDetails.senderId +
      ".html";
    // let url = this.baseUrlPipe.transform(["/m/s/" + queryParam]);
   let url =  environment.SEO_URL+'/sales-catelogue/'+queryParam

    window.open(url, "_blank");
  }
  getUrl(document: any) {
    if (document) {
      window.location.href = this.baseService.getImageUrl(
        document,
        "FlyersDocDownload"
      );
      console.log(
        "url",
        this.baseService.getImageUrl(document, "FlyersDocDownload")
      );
    }
  }
  requestForQuote() {
    debugger
    console.log(this.flyerDetails);
    
    if (this.flyerDetails.productId!= 0) {
      let id = this.flyerDetails.senderCompanyId;
      let companyId = "t1" + "-c" + id;

      let name = this.flyerDetails.senderCompany
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
      let url1 = companyId + "/" + name;
      url1 = url1 + "-" + this.flyerDetails.productId + ".html";
      let url: any = "/m/p/r/" + url1;
      window.open(url, "_blank");
    }
  }

  getImage(image) {
    return this.baseService.getImageUrl(image, "GetDownload");
  }
  getUrlToShare() {
    let shareLink: any;
    shareLink = ["/m/p/n/" + this.queryParam];
    console.log("data", shareLink);
    return shareLink;
  }
  getClass() {
    if (window.location.href.includes("p/n")) {
      if (this.data.flyerType == 'digitalFlyers') {
        return "public-body overflow-body p-0 pl-3";
      }
      else {
        return "public-body";
      }
    } else {
      if (this.data.flyerType == 'digitalFlyers') {
        return "public-body overflow-body p-0 pl-3";
      }
      else {
        return "main-body";
      }
    }
  }
  getClassMsg() {
    if (window.location.href.includes("p/n")) {
      return "message-pub";
    } else {
      return "message";
    }
  }
  getClassMsgInfo() {
    if (window.location.href.includes("p/n")) {
      return "message-info-pub";
    } else {
      return "message-info";
    }
  }
  getClasslist() {
    if (window.location.href.includes("p/n")) {
      return "list-name-pub ";
    } else {
      return "list-name ";
    }
  }

  getColumn(){
    if (window.location.href.includes("p/n")) {
      return "col-xs-7 col-sm-7 col-lg-7";
    } else {
      return "col-xs-8 col-sm-8 col-lg-8";
    }
  }
  getMsgText() {
    if (window.location.href.includes("p/n")) {
      return "message-text-pub";
    } else {
      return "message-text";
    }
  }
  getClassfooter() {
    if (window.location.href.includes("p/n")) {
      return "footer-pub";
    } else {
      return "footer";
    }
  }
  getDownClass() {
    if (window.location.href.includes("p/n")) {
      return "attach-data-pub kt-font-primary kt-link";
    } else {
      return "kt-font-primary kt-link";
    }
  }
  getMobiId() {
    if (window.location.href.includes("p/n")) {
      return "mobi-list-pub";
    } else {
      return "mobi-list";
    }
  }
  async getFlyerDetails(item: any) {
    this.isLoading = true;
    let data: any;
    this.isData = true;
    try {
      if (window.location.href.includes("p/n")) {
        this.isPublic = true;
        let arrInfo = item.split("-");
        let res: any = await this.miniService.getUserDetailsByCompanyId(
          arrInfo[arrInfo.length - 1].split(".")[0]
        );
        this.userDetails = res.userDetails;
        this.flyerType = arrInfo[arrInfo.length - 3];

        this.queryParam =
          this.userDetails.companyName
            .replace(/[^a-zA-Z0-9_ ]/g, "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-") +
          "-" +
          arrInfo[arrInfo.length - 3] +
          "-" +
          arrInfo[arrInfo.length - 2] +
          "-" +
          arrInfo[arrInfo.length - 1];
        (".html");
        data = {
          memberCompanyId: "",
          memberId:
            arrInfo[arrInfo.length - 3] == "productFlyers"
              ? ""
              : this.userDetails.id,
          flyerId: arrInfo[arrInfo.length - 2],
          flyerType: arrInfo[arrInfo.length - 3],
        };
      } else {
        this.companyName = this.memberInfo.companyName;
        console.log("company nae", this.companyName);
        let params = item.split("-");
        this.flyerType = params[0];
        this.queryParam =
          this.companyName
            .replace(/[^a-zA-Z0-9_ ]/g, "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-") +
          "-" +
          params[0] +
          "-" +
          params[1] +
          "-" +
          this.auth.getUserId() +
          ".html";
        data = {
          memberCompanyId: "",
          memberId: params[0] == "productFlyers" ? "" : this.auth.getUserId(),
          flyerId: params[1],
          flyerType: params[0],
        };
      }
      this.flyerDetails = await this.digital.getFlyersById(data);
      this.isLoading = false;
      this.cd.detectChanges();
    } catch (err) {
      console.log(err);
    }
  }
}
