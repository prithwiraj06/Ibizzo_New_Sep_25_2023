import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import {
  LayoutConfigService,
  ToggleOptions,
} from "../../../../core/_base/layout";
import { PartnerService } from "../../../../../provider/partner/partner.service";
import { MinisiteService } from "../../../../../provider/minisite/minisite.service";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../pages/auth/auth.service";
import { HtmlClassService } from "../../html-class.service";

@Component({
  selector: "kt-header-mobile",
  templateUrl: "./header-mobile.component.html",
  styleUrls: ["./header-mobile.component.scss"],
})
export class HeaderMobileComponent implements OnInit {
  asideDisplay: boolean;
  public currentPartner: any;

  toggleOptions: ToggleOptions = {
    target: "body",
    targetState: "kt-header__topbar--mobile-on",
    togglerState: "kt-header-mobile__toolbar-topbar-toggler--active",
  };
  isMinisite: boolean = false;
  isLogoDisplay: boolean;
  isLogo: boolean;
  isWebsiteLink: boolean;
  isCheckMinisite: any;
  userInfo: any;
  @ViewChild("ktHeader", { static: true }) ktHeader: ElementRef;

  constructor(
    private auth: AuthService,
    private layoutConfigService: LayoutConfigService,
    private partnerService: PartnerService,
    private service: MinisiteService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    public htmlClassService: HtmlClassService,

  ) {
    this.service.onEvent("HEADER").subscribe(() => {
      console.log("Header mobile");
      this.isMinisite = true;
      this.isCheckMinisite = false;
    });
  }

  async ngOnInit() {
    this.currentPartner = this.partnerService.getCurrentPartner();
    this.asideDisplay = this.layoutConfigService.getConfig(
      "aside.self.display"
    );
    let userId;
    let id = this.auth.getUserId();
    this.currentPartner = this.partnerService.getCurrentPartner();
    if (!this.isCheckMinisite) {
      let url = window.location.href.split("/");
      let minisiteInfo = url[url.length - 1];
      console.log("brancd", minisiteInfo);
      let arrInfo = minisiteInfo.split("-");
      let sellId = "-" + arrInfo[arrInfo.length - 1];
      userId = arrInfo[arrInfo.length - 1].split(".")[0];
      let src = arrInfo[0] == "ss" ? true : false;
      if (userId) {
        if (id == userId || src) {
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
    } catch (e) { }
  }
}
