// Angular
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  Input,
} from "@angular/core";
import { NavigationEnd, Router, ActivatedRoute } from "@angular/router";
// RxJS
import { filter } from "rxjs/operators";
// Object-Path
import * as objectPath from "object-path";
// Layout
import {
  LayoutConfigService,
  MenuConfigService,
  MenuHorizontalService,
  MenuOptions,
  OffcanvasOptions,
} from "../../../../core/_base/layout";
// HTML Class
import { HtmlClassService } from "../../html-class.service";
import { MatDialog } from "@angular/material";
import { EmailComponent } from "../../../pages/auth//login-page/email/email.component";
import { AuthService } from "../../../pages/auth/auth.service";
import { MinisiteService } from "../../../../../provider/minisite/minisite.service";
import { ToastrService } from "ngx-toastr";
import {environment} from '../../../../../environments/environment'

declare var $: any;
@Component({
  selector: "kt-menu-horizontal",
  templateUrl: "./menu-horizontal.component.html",
  styleUrls: ["./menu-horizontal.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuHorizontalComponent implements OnInit {
  @Input() showRightToolbar: boolean = true;
  minisiteParams: any = {};
  currentRouteUrl: any = "";
  userDetails: any;
  rootArrowEnabled: boolean;
  notMinisite: boolean;
  title: string;
  isCreateGroupAllowed: boolean = false;
  isDisplay: any = true;

  menuOptions: MenuOptions = {
    submenu: {
      desktop: "dropdown",
      tablet: "accordion",
      mobile: "accordion",
    },
    accordion: {
      slideSpeed: 200, // accordion toggle slide speed in milliseconds
      expandAll: false, // allow having multiple expanded accordions in the menu
    },
    dropdown: {
      timeout: 50,
    },
  };

  offcanvasOptions: OffcanvasOptions = {
    overlay: true,
    baseClass: "kt-header-menu-wrapper",
    closeBy: "kt_header_menu_mobile_close_btn",
    toggleBy: {
      target: "kt_header_mobile_toggler",
      state: "kt-header-mobile__toolbar-toggler--active",
    },
  };
  registerLink: string;
  shareMail: string;
  shareWhats: string;
  isMember: boolean = false;

  constructor(
    private el: ElementRef,
    public htmlClassService: HtmlClassService,
    public menuHorService: MenuHorizontalService,
    private menuConfigService: MenuConfigService,
    private layoutConfigService: LayoutConfigService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private render: Renderer2,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private toast: ToastrService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private service: MinisiteService
  ) {
    service.onEvent("HEADER").subscribe(() => {
      console.log("menu-horizontal");
      this.isCreateGroupAllowed = false;
      this.isDisplay = false;
    });
  }

  ngOnInit(): void {
    this.registerLink = environment.SEO_URL+ '/registration/'+this.authService.getUserId();
    this.shareMail = "mailto:?subject=[SUBJECT]&body=" + this.registerLink;
    this.shareWhats = "https://api.whatsapp.com/send?text=" + this.registerLink;
    this.title = localStorage.getItem("Dashboard");
    this.rootArrowEnabled = this.layoutConfigService.getConfig(
      "header.menu.self.root-arrow"
    );
    let url = window.location.href.split("/");
    let minisiteInfo = url[url.length - 1];
    // let url = this.activatedRoute.snapshot.params.id;
    if (minisiteInfo) {
      this.minisiteParams = minisiteInfo;
    } else {
      this.activatedRoute.queryParams.subscribe(async (param) => {
        this.minisiteParams = param;
      });
    }

    this.currentRouteUrl = this.router.url;
    console.log("current router url", this.currentRouteUrl);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRouteUrl = this.router.url;
        console.log("current router url one", this.currentRouteUrl);

        this.cdr.markForCheck();
      });

    if (!this.authService.hasRole("Partner") && this.authService.getUserId()) {
      this.isCreateGroupAllowed = true;
    }
    this.checkForMinisite();
    if (this.authService.getUserId()) {
      this.isMember = true;
    }
    this.menuDropDown();
  }

  checkForMinisite() {
    if (
      window.location.href.includes("dashboard") ||
      window.location.href.includes("pages")
    ) {
      // this.isCreateGroupAllowed = true
    } else {
      this.isCreateGroupAllowed = false;
    }
  }

  createGroup() {
    this.userProfile();
    if (this.userDetails) {
      this.router.navigateByUrl("/IBizzo/dashboard/business/create-group");
    } else {
      this.login();
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
      this.userProfile();
    });
  }

  userProfile() {
    if (JSON.parse(localStorage.getItem("memberData"))) {
      this.userDetails = JSON.parse(
        localStorage.getItem("memberData")
      ).memberUserInfo;
      this.cd.detectChanges();
    }
  }

  /**
   * Return Css Class Name
   * @param item: any
   */
  getItemCssClasses(item) {
    let classes = "kt-menu__item";

    if (objectPath.get(item, "submenu")) {
      classes += " kt-menu__item--submenu";
    }

    if (!item.submenu && this.isMenuItemIsActive(item)) {
      classes += " kt-menu__item--active kt-menu__item--here";
    }

    if (item.submenu && this.isMenuItemIsActive(item)) {
      classes += " kt-menu__item--open kt-menu__item--here";
    }

    if (objectPath.get(item, "resizer")) {
      classes += " kt-menu__item--resize";
    }

    const menuType = objectPath.get(item, "submenu.type") || "classic";
    if (
      (objectPath.get(item, "root") && menuType === "classic") ||
      parseInt(objectPath.get(item, "submenu.width"), 10) > 0
    ) {
      classes += " kt-menu__item--rel";
    }

    const customClass = objectPath.get(item, "custom-class");
    if (customClass) {
      classes += " " + customClass;
    }

    if (objectPath.get(item, "icon-only")) {
      classes += " kt-menu__item--icon-only";
    }

    return classes;
  }

  /**
   * Returns Attribute SubMenu Toggle
   * @param item: any
   */
  getItemAttrSubmenuToggle(item) {
    let toggle = "hover";
    if (objectPath.get(item, "toggle") === "click") {
      toggle = "click";
    } else if (objectPath.get(item, "submenu.type") === "tabs") {
      toggle = "tabs";
    } else {
      // submenu toggle default to 'hover'
    }

    return toggle;
  }

  /**
   * Returns Submenu CSS Class Name
   * @param item: any
   */
  getItemMenuSubmenuClass(item) {
    let classes = "";

    const alignment = objectPath.get(item, "alignment") || "right";

    if (alignment) {
      classes += " kt-menu__submenu--" + alignment;
    }

    const type = objectPath.get(item, "type") || "classic";
    if (type === "classic") {
      classes += " kt-menu__submenu--classic";
    }
    if (type === "tabs") {
      classes += " kt-menu__submenu--tabs";
    }
    if (type === "mega") {
      if (objectPath.get(item, "width")) {
        classes += " kt-menu__submenu--fixed";
      }
    }

    if (objectPath.get(item, "pull")) {
      classes += " kt-menu__submenu--pull";
    }

    return classes;
  }

  /**
   * Check Menu is active
   * @param item: any
   */
  isMenuItemIsActive(item): boolean {
    if (item.submenu) {
      return this.isMenuRootItemIsActive(item);
    }

    if (!item.page) {
      return false;
    }

    return this.currentRouteUrl.indexOf(item.page) !== -1;
  }

  /**
   * Check Menu Root Item is active
   * @param item: any
   */
  isMenuRootItemIsActive(item): boolean {
    if (item.submenu.items) {
      for (const subItem of item.submenu.items) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (item.submenu.columns) {
      for (const subItem of item.submenu.columns) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (typeof item.submenu[Symbol.iterator] === "function") {
      for (const subItem of item.submenu) {
        const active = this.isMenuItemIsActive(subItem);
        if (active) {
          return true;
        }
      }
    }
    return false;
  }
  checkForBusiness() {
    this.title = localStorage.getItem("Dashboard");
    console.log("dashboard", this.title);
    return this.title == "business" ? true : false;
  }
  checkForPartner() {
    this.title = localStorage.getItem("Dashboard");

    return this.title == "partner" ? true : false;
  }
  checkForAdmin() {
    this.title = localStorage.getItem("Dashboard");
    return this.title == "admin" ? true : false;
  }
  isBusiness() {
    return window.location.href.includes("business") ? true : false;
  }
  menuDropDown() {
    $(".navigation li").hover(function () {
      var isHovered = $(this).is(":hover");
      if (isHovered) {
        $(this).children("ul").stop().slideDown(300);
      } else {
        $(this).children("ul").stop().slideUp(300);
      }
    });
  }

  copy() {
    this.toast.success("Copied to clipboard.");
  }
}
