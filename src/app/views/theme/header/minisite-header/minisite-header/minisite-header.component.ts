// Angular
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
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
} from "../../../../../core/_base/layout";
import { HtmlClassService } from "../../../html-class.service";
import { MinisiteService } from "../../../../../../provider/minisite/minisite.service";
import { BaseUrlPipe } from "../../../../../core/_base/layout/pipes/base-url";
import { MatDialog } from "@angular/material";
import { ListDocumentsComponent } from "../../../list-documents/list-documents.component";
import { CdkAccordion } from "@angular/cdk/accordion";

declare var window: any;

@Component({
  selector: "kt-minisite-header",
  templateUrl: "./minisite-header.component.html",
  styleUrls: ["./minisite-header.component.scss"],
})
export class MinisiteHeaderComponent implements OnInit, AfterViewInit {
  menuHeaderDisplay: boolean;
  fluid: boolean;

  @ViewChild("ktHeader", { static: true }) ktHeader: ElementRef;
  userInfo: any;
  userId: any;
  queryParam: string;

  /**
   * Component constructor
   *
   * @param router: Router
   * @param layoutRefService: LayoutRefService
   * @param layoutConfigService: LayoutConfigService
   * @param loader: LoadingBarService
   * @param htmlClassService: HtmlClassService
   */
  constructor(
    private router: Router,
    private layoutRefService: LayoutRefService,
    private layoutConfigService: LayoutConfigService,
    public loader: LoadingBarService,
    public htmlClassService: HtmlClassService,
    public service: MinisiteService,
    private baseUrlPipe: BaseUrlPipe,
    public dialog: MatDialog,
    private cd:ChangeDetectorRef
  ) {
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
    this.service.onEvent("MINISITE_RENDER").subscribe((data: any) => {
      data.accentColor = data.accentColor || "#ee5522";
      data.alternateColor = data.alternateColor || "#f7882b";
      let nativeElement: any = window.jQuery(this.ktHeader.nativeElement);
      let links: any = nativeElement.find("span.kt-menu__link-text");
      links.css({ color: data.accentColor + " !important;" });

      // set header image
      let ktheader: any = nativeElement.find(".kt-header__bottom");
      let backgroundColor: string = `linear-gradient(to right, ${data.accentColor} 0%, #8f0222 81%, #6d0019 100%)`;
      ktheader.css({
        background: backgroundColor,
        backgroundColor: data.accentColor,
      });

      // set topbar
      nativeElement.parent().css({ borderTopColor: data.accentColor });

      // border for mini-site-logo
      // nativeElement.find('img.mini-site-logo').css({ 'borderColor': data.accentColor });

      // set button-colors
      window.jQuery(document).find(".minisite-bg-color").css({
        borderColor: data.accentColor,
        backgroundColor: data.accentColor,
        color: data.alternateColor,
      });

      // set text/link-colors
      window
        .jQuery(document)
        .find(".minisite-font-color")
        .css({ color: data.accentColor });
    });
  }

  ngOnInit() {
    const config = this.layoutConfigService.getConfig();

    // get menu header display option
    this.menuHeaderDisplay = objectPath.get(config, "header.menu.self.display");
    this.cd.detectChanges();

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

    let url = window.location.href.split("/");
    let minisiteInfo = url[url.length - 1];
    let arrInfo = minisiteInfo.split("-");
    this.userId = arrInfo[arrInfo.length - 1].split(".")[0];
    this.getUserDetails(this.userId);
    console.log("windol", window.location.href);
    this.cd.detectChanges();
  }
  async getUserDetails(id) {
    try {
      console.log("id", id);
      let res: any = await this.service.getUserDetailsByCompanyId(id);
      if (res.userDetails) {
        console.log("id", this.userInfo);
        this.userInfo = res.userDetails;
        this.queryParam =
          this.userInfo.companyName
            .replace(/[^a-zA-Z0-9_ ]/g, "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-") +
          "-" +
          this.userInfo.id +
          ".html" +
          "#contact";
      }
    } catch (err) {
      console.log("error", err);
    }
  }
  ngAfterViewInit(): void {
    // keep header element in the service
    this.layoutRefService.addElement("header", this.ktHeader.nativeElement);
  }
  gotoContact() {
    // if (window.screen.width <= 540) {
      this.router.navigate(
        [this.baseUrlPipe.transform(["/m/h/" + this.queryParam])],
        { fragment: "contact" }
      );
    // }
  }

  isVerfied() {
    if (this.userInfo && this.userInfo.isVerified && this.userInfo.isVerified == 'Verified') {
      return true
    }
    else {
      return false
    }
  }

  showTitle() {
    if (this.userInfo && this.userInfo.isVerified != null && this.userInfo.isVerified == 'Verified') {
      const dialogRef = this.dialog.open(ListDocumentsComponent, {
        data: this.userInfo,
        width:"300px"
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (!result) {
            return;
          }
        });
   }
   
  }

  checkForMinisite() {
    const hasMiniSite: boolean = window.location.href.includes("dashboard");
    return hasMiniSite ? true : false;
  }
}
