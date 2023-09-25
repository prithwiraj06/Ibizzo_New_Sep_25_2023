import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MainSiteService } from "../../../../../provider/main-site/main-site.service";
import { AuthService } from "../../../../views/pages/auth/auth.service";
import { PartnerService } from "../../../../../provider/partner/partner.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { MatDialogRef } from "@angular/material";
import { PartnerMembersComponent } from "../partner-members/partner-members.component";
import { UserProfileService } from "../../../../../provider/user-profile/user-profile.service";
@Component({
  selector: "kt-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.scss"],
})
export class StatisticsComponent implements OnInit {
  ProductsCount: number;
  MarketPlacesCount: number;
  Suppliers: number;
  Buyers: number;
  CategoriesCount: number;
  currentPartnerId: number;
  activity: number;
  totolActivities: number;
  partnerInfo: any = {
    noOfMembers: 0,
    noOfSellers: 0,
    noOfProducts: 0,
    noOfEnquiries: 0,
    noOfServices: 0,
  };
  currentPartner: any;
  currentPartnerName: any;
  constructor(
    private userProfile: UserProfileService,
    public mainSiteService: MainSiteService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private baseUrlPipe: BaseUrlPipe,
    private partnerService: PartnerService,
    public dialogRef: MatDialogRef<StatisticsComponent>
  ) {}

  async ngOnInit() {
    this.currentPartnerId = this.partnerService.getCurrentPartnerId();
    this.currentPartner = this.partnerService.getCurrentPartner();
    this.currentPartnerName = this.userProfile.removeSpaces(
      this.currentPartner.name
    );
    // for iBizzo
    if (this.currentPartnerId == 1) {
      // this.mainSiteService.getAllOrgStatistics(1).then((res: any) => {
      //   this.MarketPlacesCount = res.data.organizations;
      //   this.ProductsCount = res.data.products;
      //   this.cd.detectChanges();
      // });

      this.mainSiteService
        .getAllOrgSaleSatatistics(this.currentPartnerId)
        .then((res: any) => {
          this.Suppliers = res.data.registeredBusiness;
          this.CategoriesCount = res.data.registeredBusiness;
          this.Buyers = res.data.totalEnquires;
          this.cd.detectChanges();
        });
      this.mainSiteService
        .getStatistics(this.currentPartnerId)
        .then((result: any) => {
          if (result && result.orgStats && result.orgStats) {
            this.totolActivities = result.orgStats.totalNoOfActivities;
            this.MarketPlacesCount = result.orgStats.organizations;
            this.ProductsCount = result.orgStats.noOfProducts;
            this.Buyers = result.orgStats.noOfEnquiries;
            this.cd.detectChanges();
          }
        });
    } else {
      this.mainSiteService.getStatistics(1).then((result: any) => {
        if (result) {
          this.totolActivities = result.orgStats.totalNoOfActivities;
        }
      });
      this.mainSiteService
        .getStatistics(this.currentPartnerId)
        .then((result: any) => {
          if (result && result.orgStats && result.orgStats) {
            this.partnerInfo = result.orgStats;
            this.cd.detectChanges();
          }
        });
    }
  }

  requestForQuote() {
    if (this.authService.getUserId() != null) {
      this.router.navigate([
        this.baseUrlPipe.transform(["/dashboard/business/quote"]),
      ]);
      return false;
    }
    this.mainSiteService.broadcastEvent("SHOW_LOGIN_WINDOW", {});
  }
}
