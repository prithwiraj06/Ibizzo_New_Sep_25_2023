import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  LayoutConfigService,
  MenuHorizontalService,
} from "../../../core/_base/layout";
import { Router } from "@angular/router";
import { PartnerService } from "../../../../provider/partner/partner.service";

import * as objectPath from "object-path";
import { MinisiteService } from "../../../../provider/minisite/minisite.service";
import { AuthService } from "../../pages/auth/auth.service";
import { EmailComponent } from "../../pages/auth//login-page/email/email.component";
import { MatDialog } from "@angular/material";

@Component({
  selector: "kt-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  today: number = Date.now();
  fluid: boolean;
  isMinisite: boolean = false;
  userDetails: any;
  isOne:boolean;
  isNotOne:boolean;
  isCreateGroupAllowed: boolean;
  constructor(
    private layoutConfigService: LayoutConfigService,
    public router: Router,
    public menuHorService: MenuHorizontalService,
    public partnerService: PartnerService,
    public service: MinisiteService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    this.service.onEvent("HEADER").subscribe(() => {
      console.log("Footer");
      this.isMinisite = true;
    });
  }

  ngOnInit(): void {
    if(this.authService.getUserId()){
      if(this.partnerService.getCurrentPartnerId()==1){
        this.isOne=true
      }
      else if(this.partnerService.getCurrentPartnerId()!=1){
        this.isNotOne=true
      }
    }
    const config = this.layoutConfigService.getConfig();
    this.fluid = objectPath.get(config, "footer.self.width") === "fluid";
    if (!this.authService.hasRole("Partner") && this.authService.getUserId()) {
      this.isCreateGroupAllowed = true;
    }
    this.checkForMinisite();
  }

  goTo(fragment: any) {
    this.router.navigate(["/"], { fragment: fragment });
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
}
