import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../auth/auth.service";
import { UserProfileService } from "../../../../../../provider/user-profile/user-profile.service";
import { PartnerLogoComponent } from "../partner-logo/partner-logo.component";
import { MatDialog } from "@angular/material";
import { SelectNewsletterComponent } from "../select-newsletter/select-newsletter.component";
declare var window;
@Component({
  selector: "kt-widget",
  templateUrl: "widget.component.html",
  styleUrls: ["widget.component.scss"],
})
export class DashboardWidgetComponent implements OnInit {
  memberDetails: any;
  profile: any;
  partnerPageUrl: string;
  websiteLink: any = "";
  companyName: any;
  companyId: any;
  orgId: any;
  token: any;

  constructor(
    public router: Router,
    public authService: AuthService,
    private userProfile: UserProfileService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.token = JSON.parse(localStorage.getItem("memberData")).token;
    this.memberDetails = this.authService.getCurrentUser();
    this.partnerPageUrl =
      "/" +
      this.userProfile.removeSpaces(this.memberDetails.partnerInfo.name) +
      "/pages/home";
    this.companyName = this.memberDetails.companyName;
    this.companyId = this.memberDetails.id;
    this.orgId = this.memberDetails.organizationId;

    this.userProfile.getProfile(this.token).then((res: any) => {
      this.profile = res.userDetails;
      this.websiteLink = res.userDetails.website;
      console.log(this.websiteLink);
    });
    this.getDashboard();
  }

  goToLink() {
    window.open(this.websiteLink);
  }

  uploadPartnerLogo() {
    const dialogRef = this.dialog.open(PartnerLogoComponent, {
      width: "500px",
      data: {},
    });
  }

  gotoNewsletter() {
    const dialogRef = this.dialog.open(SelectNewsletterComponent, {
      height: "300px",
      width: "auto",
      disableClose: true,
      data: "",
    });
    dialogRef.afterClosed().subscribe((res: any) => {});
  }

  openCluster() {
    const dialogRef = this.dialog.open(SelectNewsletterComponent, {
      height: "300px",
      width: "auto",
      data: "isCluster",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res: any) => {});
  }
  getDashboard() {
    let title: any = localStorage.getItem("Dashboard");
    if (title == "admin" || "business") {
      localStorage.removeItem("Dashboard");
      localStorage.setItem("Dashboard", "partner");
    }
  }
}
