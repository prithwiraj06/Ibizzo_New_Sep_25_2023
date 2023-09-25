import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";

import {
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from "@angular/router";
import * as objectPath from "object-path";
import { LoadingBarService } from "@ngx-loading-bar/core";
import {
  LayoutConfigService,
  LayoutRefService,
} from "../../../core/_base/layout";
import { HtmlClassService } from "../html-class.service";
import { ActivatedRoute } from "@angular/router";
import { PartnerService } from "../../../../provider/partner/partner.service";
import { MinisiteService } from "../../../../provider/minisite/minisite.service";
import { AuthService } from "../../../views/pages/auth/auth.service";
import { SettingService } from "../../../../provider/setting/setting.service";

declare var window: any;
@Component({
  selector: "kt-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild("ktHeader", { static: true }) ktHeader: ElementRef;

  menuHeaderDisplay: boolean;
  fluid: boolean;
  notMinisite: boolean;
  isloading: any = {
    fragment: "header-link",
  };
  groupUser: any;
  currentPartner: any;
  memberData: any;
  minisite: boolean;
  groupId: any;
  isTest:boolean;
  isDashboard:boolean;

  constructor(
    private router: Router,
    private activedRouter: ActivatedRoute,
    private layoutRefService: LayoutRefService,
    private layoutConfigService: LayoutConfigService,
    private authService: AuthService,
    public loader: LoadingBarService,
    public htmlClassService: HtmlClassService,
    private activatedRoute: ActivatedRoute,
    private partnerService: PartnerService,
    private minisiteService: MinisiteService,
    private settingService: SettingService,
    private cd: ChangeDetectorRef
  ) {
    minisiteService.onEvent("HEADER").subscribe(() => {
      console.log("Header");
      this.minisite = true;
    });

    minisiteService.onEvent("SEARCH").subscribe(() => {
      console.log("SEARCH");
      let isHide=window.location.href.includes('/main/pages/home')
      this.isDashboard=window.location.href.includes('/IBizzo/dashboard/business/home')
      this.isTest=isHide;
    });

    this.currentPartner = this.partnerService.getCurrentPartner();

    // page progress bar percentage
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // set page progress bar loading to start on NavigationStart event router
        this.loader.start();
      }
      if (event instanceof RouteConfigLoadStart) {
        this.loader.increment(35);
      }
      if (event instanceof RouteConfigLoadEnd) {
        this.loader.increment(75);
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        // set page progress bar loading to end on NavigationEnd event router
        this.loader.complete();
      }
    });
  }

  ngOnInit(): void {
    this.memberData=this.authService.getCurrentUser()
    let isHide=window.location.href.includes('/main/pages/home')
    this.isDashboard=window.location.href.includes('/IBizzo/dashboard/business/home')
    this.isTest=isHide;
    this.activatedRoute.fragment.subscribe((fragment: string) => {
      this.isloading.fragment = fragment;
    });
    const config = this.layoutConfigService.getConfig();
    // get menu header display option
    this.menuHeaderDisplay = objectPath.get(config, "header.menu.self.display");

    // header width fluid
    this.fluid = objectPath.get(config, "header.self.width") === "fluid";

    // animate the header minimize the height on scroll down
    if (
      objectPath.get(config, "header.self.fixed.desktop.enabled") ||
      objectPath.get(config, "header.self.fixed.desktop")
    ) {
      // header minimize on scroll down
      this.ktHeader.nativeElement.setAttribute("data-ktheader-minimize", "1");

    }
    this.cd.detectChanges();

  }

  ngAfterViewInit(): void {
    if (window.location.href.includes("p/g/")) {
      this.checkForGroup();
    } else {
      // keep header element in the service
      if(this.isTest||this.isDashboard){
        this.layoutRefService.addElement("header", this.ktHeader.nativeElement);
        let nativeElement: any = window.jQuery(this.ktHeader.nativeElement);
        let ktheader: any = nativeElement.find(".kt-header__bottom");
        let backgroundColor: string = `#2F2F2F`;
        ktheader.css({
          background: backgroundColor,
          // backgroundColor: this.currentPartner.accentColor,
        });
  
        let borderColor = "5px " + this.currentPartner.accentColor + " solid";
        // color for partner name
        window
          .jQuery(document)
          .find(".partner-font-color")
          .css({ color: this.currentPartner.accentColor });
        // color for top bar
        nativeElement.parent().css({ borderTop: borderColor });
      }
      else{
        this.layoutRefService.addElement("header", this.ktHeader.nativeElement);
        let nativeElement: any = window.jQuery(this.ktHeader.nativeElement);
        let ktheader: any = nativeElement.find(".kt-header__bottom");
        let backgroundColor: string = `linear-gradient(to right, ${this.currentPartner.accentColor} 0%, #8f0222 81%, #6d0019 100%)`;
        ktheader.css({
          background: backgroundColor,
          backgroundColor: this.currentPartner.accentColor,
        });
  
        let borderColor = "5px " + this.currentPartner.accentColor + " solid";
        // color for partner name
        window
          .jQuery(document)
          .find(".partner-font-color")
          .css({ color: this.currentPartner.accentColor });
        // color for top bar
        nativeElement.parent().css({ borderTop: borderColor });
      }
     
    }
  }

  checkForMinisite() {
    return window.location.href.includes("dashboard")
      ? true
      : window.location.href.includes("pages")
      ? true
      : this.checkUrl();
  }

  checkUrl() {
    let arr = window.location.href.split("/");
    let list = arr[arr.length - 1].split("-");
    list[list.length - 1].includes("p");
    return list[list.length - 1].includes("p");
  }

  async checkForGroup() {
    if (window.location.href.includes("p/g/")) {
      let url = window.location.href.split("/");
      let groupInfo = url[url.length - 1];
      let arrInfo = groupInfo.split("-");
      this.groupId = arrInfo[arrInfo.length - 1].split(".")[0];
      await this.getGroupStats();
    }

    // keep header element in the service
    this.layoutRefService.addElement("header", this.ktHeader.nativeElement);
    let nativeElement: any = window.jQuery(this.ktHeader.nativeElement);
    let ktheader: any = nativeElement.find(".kt-header__bottom");
    let backgroundColor: string = `linear-gradient(to right, ${this.groupUser.primaryColor} 0%, #8f0222 81%, #6d0019 100%)`;
    ktheader.css({
      background: backgroundColor,
      backgroundColor: this.groupUser.primaryColor,
    });

    let borderColor = "5px " + this.groupUser.primaryColor + " solid";
    // color for top bar
    nativeElement.parent().css({ borderTop: borderColor });
  }
  async getGroupStats() {
    try {
      console.log("group", this.groupId);
      if (this.groupId) {
        let data = {
          groupId: this.groupId,
        };
        this.groupUser = await this.settingService.getGroupPublicStats(data);
        this.cd.detectChanges();
      }
    } catch (err) {
      console.log(err);
    }
  }
}
