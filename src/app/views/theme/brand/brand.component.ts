import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ToggleOptions } from "../../../core/_base/layout";
import { HtmlClassService } from "../html-class.service";
import { MinisiteService } from "../../../../provider/minisite/minisite.service";
import { ActivatedRoute } from "@angular/router";
import { PartnerService } from "../../../../provider/partner/partner.service";
import * as _ from "underscore";
import { AuthService } from "../../pages/auth/auth.service";
import {environment} from '../../../../environments/environment'

@Component({
  selector: "kt-brand",
  templateUrl: "./brand.component.html",
  styleUrls: ["./brand.component.scss"],
})
export class BrandComponent implements OnInit {
  public currentPartner: any;
  userInfo: any = [];
  isLogoDisplay: boolean = false;
  isWebsiteLink: boolean = false;
  toggleOptions: ToggleOptions = {
    target: "body",
    targetState: "kt-aside--minimize",
    togglerState: "kt-aside__brand-aside-toggler--active",
  };
  isLogo: boolean;
  isCheckMinisite: boolean = true;

  constructor(
    private auth: AuthService,
    public htmlClassService: HtmlClassService,
    private service: MinisiteService,
    private activatedRoute: ActivatedRoute,
    private partnerService: PartnerService,
    private cd: ChangeDetectorRef
  ) {
    service.onEvent("HEADER").subscribe(() => {
      console.log("Brand");
      this.isCheckMinisite = false;
    });
  }

  async ngOnInit() {
    let userId;
    let id = this.auth.getUserId();
    this.currentPartner = this.partnerService.getCurrentPartner();
    console.log("Brand==>=============>",this.currentPartner);

    if (!this.isCheckMinisite) {
      let url = window.location.href.split("/");
      let minisiteInfo = url[url.length - 1];
      console.log("brancd", minisiteInfo);
      let arrInfo = minisiteInfo.split("-");
      let sellId = "-" + arrInfo[arrInfo.length - 1];
      userId = arrInfo[arrInfo.length - 1].split(".")[0];
      let src = arrInfo[0] == "ss" ? true : false;
      if (userId) {
        if (id == userId) {
          this.isLogoDisplay = true;
          this.isLogo = true;
        }

        if (src && id) {
          this.isLogoDisplay = true;
          this.isLogo = true;
        }

        this.getMemberPackageDetails(userId);
        let res: any = await this.service.getUserDetailsByCompanyId(userId);
        this.userInfo = res.userDetails;
        console.log(this.userInfo);
        this.cd.detectChanges();
      }
    } else {
      this.activatedRoute.queryParams.subscribe(async (param) => {
        if (param.sellerId) {
          if (id == userId) {
            this.isLogoDisplay = true;
            this.isLogo = true;
          }
          this.getMemberPackageDetails(param.sellerId);
          let res: any = await this.service.getUserDetailsByCompanyId(
            param.sellerId
          );
          userId = param.sellerId;
          this.userInfo = res.userDetails;
          console.log(this.userInfo);
          this.cd.detectChanges();
        }
      });
    }
  }

  getRouterUrl(item){
    if(item.urlName=='main'){
      window.open(environment.SEO_URL)
    }
    else{
      window.open(environment.SEO_URL+"/"+item.urlName+'/pages/home')
    }
  }

  getImage(image) {
    if (image == null) {
      return "/assets/media/placeholder/product.jpg";
    }
    return this.service.getImageUrl(image, "GetDownload");
  }

  async getMemberPackageDetails(id) {
    try {
      let res: any = await this.service.getPackageDetailsById(id);
      let packageDetails = res.myPackages || [];
      if (packageDetails.length > 0) {
        packageDetails.forEach((key: any) => {
          //CHECK: Company Logo
          if (key.packageDetailName === "UPLOAD_LOGO") {
            this.isLogoDisplay = true;
            this.isLogo = false;
            this.cd.detectChanges();
          }

          //CHECK: Company website
          if (key.packageDetailName === "LINK_TO_WEBSITE") {
            this.isWebsiteLink = true;
            this.cd.detectChanges();
          }
        });
      }
    } catch (e) {}
  }
}
