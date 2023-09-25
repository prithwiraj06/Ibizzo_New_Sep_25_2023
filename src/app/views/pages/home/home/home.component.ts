import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { PartnerService } from "../../../../../provider/partner/partner.service";
import { LeadsPromotesDeskComponent } from "../leads-promotes-desk/leads-promotes-desk.component";
import { AuthService } from "../../../../views/pages/auth/auth.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import jwt_decode from "jwt-decode";
import { UserProfileService } from "../../../../../provider/user-profile/user-profile.service";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../core/reducers";
import { Login } from "../../../../core/auth";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "../../../../../environments/environment";
import { MinisiteService } from "../../../../../provider/minisite/minisite.service";
@Component({
  selector: "kt-home",
  templateUrl: "./home.component.html",
  styleUrls: ["home.component.scss"],
})
export class HomeComponent implements OnInit {
  listener: any;
  public partner: string = "main";
  product: boolean = true;
  discussion: boolean;
  selectedIndex: number = 0;
  decodedData: any;
  minisiteColors = {
    accentColor: "#CC0011",
    alternateColor: "#FFFFF",
  };
  currentPartner: any;
  partnerId: any;
  jwtToken: any;
  isEnquery: any = false;
  isProfile: any = false;
  parmaValue: any;
  urlSafe: any;
  url: string = environment.SEO_URL + "/dashboard/";

  constructor(
    private partnerService: PartnerService,
    private dialog: MatDialog,
    private authService: AuthService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private userProfile: UserProfileService,
    private store: Store<AppState>,
    public sanitizer: DomSanitizer,
    private service: MinisiteService
  ) {
    this.currentPartner = this.partnerService.getCurrentPartner();
    this.minisiteColors = {
      accentColor: this.currentPartner.accentColor,
      alternateColor: this.currentPartner.alternateColor,
    };
    this.service.broadcastEvent("SEARCH", null);
  }

  async ngOnInit(): Promise<void> {
  
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.activatedRoute.params.subscribe((res) => {
      console.log("=====>param", res);

      if (res.id) {
        this.jwtToken = res.id;
        this.decodedData = jwt_decode(this.jwtToken);
        localStorage.removeItem("Dashboard");
      }
      if (window.location.href.includes("?param=")) {
        let data = window.location.href.split("?param=")[1];
        let content = JSON.parse(decodeURI(data));
        if (content && content.enquiryId) {
          localStorage.setItem("liveRfq", JSON.stringify(content));
          this.isEnquery = true;
        } else {
          let data = window.location.href.split("?param=")[1];
          let content = JSON.parse(decodeURI(data));
          this.parmaValue = content;
          this.isProfile = true;
        }
      }
    });
    if (this.decodedData && this.decodedData.UserId) {
      await this.getUserDetails(this.decodedData.UserId);
    }
    this.partnerId = this.partnerService.getCurrentPartnerId();
    let memberData = this.authService.getCurrentUser();
    let roles = this.authService.getRole();
    let partnerPageUrl = "";
    if (roles == "Partner") {
      partnerPageUrl =
        "/" +
        this.removeSpace(memberData.partnerInfo.name) +
        "/pages/home";
    }

    let role = localStorage.getItem("Dashboard");
    // this.partner = this.partnerId == 1 ? "main" : "other";
    if ((this.partnerId && role == "business") || this.partnerId == 1) {
      if (!this.decodedData) {
        let isLogin = localStorage.getItem("isRegistered") || false;
        if (isLogin) {
          let token: any = JSON.parse(localStorage.getItem("memberData"));
          localStorage.removeItem("isRegistered");
          window.location.href =
            environment.SEO_URL + "/dashboard/" + token.jwtToken;
        } else {
          window.location.href = memberData
            ? environment.SEO_URL + "/dashboard"
            : environment.SEO_URL + "/logout";
        }
      }
      this.partner = "main";
    } else {
      if (partnerPageUrl) {
        window.location.href = memberData
          ? environment.SEO_URL + partnerPageUrl
          : environment.SEO_URL + "/logout";
        this.partner = "main";
      } else {
        if (memberData) {
          this.partner = "other";
        } else {
          window.location.href = memberData
            ? environment.SEO_URL + partnerPageUrl
            : environment.SEO_URL + "/logout";
          this.partner = "main";
        }
      }
    }
    if (!memberData) {
      setTimeout(() => {
        this.openDialog();
      }, 5000);
    }
  }
  onTabPanelClick(event) {
    this.product = event.index === 0 ? true : false;
    this.discussion = event.index === 1 ? true : false;
  }

  removeSpace(name){
    return name.replace(/\-/g, " ").replace(/ /g, "-");
  }

  openDialog() {
    this.dialog.open(LeadsPromotesDeskComponent, {
      width: "400px",
      disableClose: true,
    });
  }
  async getUserDetails(id) {
    debugger;
    try {
      let res: any = await this.userProfile.getProfile(id);
      console.log("res", res.userDetails);
      let memberData: any = {
        isAuthenticated: true,
        jwtToken: this.jwtToken,
        memberUserInfo: {
          companyId: res.userDetails.companyId,
          companyName: res.userDetails.companyName,
          email: res.userDetails.email,
          id: res.userDetails.id,
          isAgreedForTandC: res.userDetails.isAgreedForTandC,
          location: res.userDetails.location,
          locationType: res.userDetails.locationType,
          name: res.userDetails.name,
          organizationId: res.userDetails.organizationId,
          organizationName: res.userDetails.organizationName,
          paymentEnabled: true,
          phoneNumber: res.userDetails.phoneNumber,
          uniqueId: res.userDetails.uniqueId,
          roles:
            this.decodedData.role == "Partner"
              ? [
                  {
                    roleName: this.decodedData.role,
                  },
                ]
              : this.decodedData.role.includes("SuperAdmin")
              ? [
                  {
                    roleId: 1,
                    roleName: this.decodedData.role.split(",")[0],
                  },
                  {
                    roleId: 2,
                    roleName: this.decodedData.role.split(",")[1],
                  },
                ]
              : [],
        },

        token: this.decodedData.UserId,
      };
      if (
        this.decodedData.role == "Partner" ||
        this.decodedData.role.includes("SuperAdmin")
      ) {
        memberData.memberUserInfo.partnerInfo =
          await this.userProfile.getOrganizationOwner(id);
      }

      console.log("result", memberData);
      this.store.dispatch(new Login({ authToken: id }));
      localStorage.setItem("memberData", JSON.stringify(memberData));
      console.log("role", this.authService.getDefaultDashboardUrl());
      if (this.isEnquery) {
        window.location.href = this.authService.getSaleCatelogEnqiry();
      } else if (this.isProfile) {
        if (
          this.parmaValue == "join-group" &&
          this.decodedData.role != "Partner" &&
          !this.decodedData.role.includes("SuperAdmin")
        ) {
          window.location.href = this.authService.seoUrl(this.parmaValue);
        } else if (
          (this.parmaValue == "join-group" &&
            this.decodedData.role == "Partner") ||
          this.decodedData.role.includes("SuperAdmin")
        ) {
          if (res.userDetails.isAgreedForTandC) {
            window.location.href = this.authService.getDefaultDashboardUrl();
          }
        } else {
          window.location.href = this.authService.seoUrl(this.parmaValue);
        }
      } else if (
        this.decodedData.role == "Partner" ||
        this.decodedData.role.includes("SuperAdmin")
      ) {
        if (res.userDetails.isAgreedForTandC) {
          window.location.href = this.authService.getDefaultDashboardUrl();
        } else {
          window.location.href = this.authService.getDefaultDashboardUrl();
        }
      } else {
        window.location.href = this.authService.getDefaultDashboardUrl();
      }
    } catch (err) {
      console.log("error", err);
    }
  }
}
