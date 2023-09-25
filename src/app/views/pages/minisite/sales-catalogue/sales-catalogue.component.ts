import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import * as _ from "underscore";
import { MinisiteService } from "../../../../../provider/minisite/minisite.service";
import { AuthService } from "../../auth/auth.service";
import { LeadsPromotesDeskComponent } from "../leads-promotes-desk/leads-promotes-desk.component";

@Component({
  selector: "kt-sales-catalogue",
  templateUrl: "./sales-catalogue.component.html",
  styleUrls: ["./sales-catalogue.component.scss"],
})
export class SalesCatalogueComponent implements OnInit {
  heroCard: any;
  newArrivals: any = [];
  remainingProducts: any = [];

  companyInfo: any = {};
  userInfo: any = {};

  minisiteColors = {
    accentColor: "#CC0011",
    alternateColor: "#FFFFF",
  };
  search: any;
  innerWidth: number;

  constructor(
    private service: MinisiteService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private auth: AuthService,
    private dialog: MatDialog,

  ) {
    this.service.broadcastEvent("HEADER", null);
  }

  async ngOnInit() {
    let currentUser = this.auth.getUserId();
    let minisiteInfo = this.activatedRoute.snapshot.params.id;

    if (minisiteInfo) {
      // this.urlId = minisiteInfo;
      let arrInfo = minisiteInfo.split("-");
      let sellId = "-" + arrInfo[arrInfo.length - 1];
      this.companyInfo.sellerId = arrInfo[arrInfo.length - 1].split(".")[0];
      this.companyInfo.name = minisiteInfo.split(sellId)[0];
      console.log(this.companyInfo);
      this.getUserDetails(this.companyInfo.sellerId);
    } else {
      this.activatedRoute.queryParams.subscribe(async (param) => {
        if (param) {
          this.companyInfo.name = param.companyName;
          this.companyInfo.sellerId = param.sellerId;
          this.search = param.source ? param.source : "";
          this.getUserDetails(this.companyInfo.sellerId);
        }
      });
    }
    this.search = currentUser==this.companyInfo.sellerId ? true : this.search ? true : false;
    let memberData = this.auth.getCurrentUser();
    this.innerWidth = window.innerWidth;
    if (!memberData&&this.innerWidth>425) {
      setTimeout(() => {
        this.openDialog()
      }, 5000);
    }
  }
  async getUserDetails(id) {
    if (id) {
      try {
        let res: any = await this.service.getUserDetailsByCompanyId(id);
        if (res.userDetails) {
          this.userInfo = res.userDetails;
          await this.getCompanyDetails(res.userDetails.companyId);
          await this.getCompanyProducts(res.userDetails.companyId);
          this.cd.detectChanges();
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  getCompanyDetails(companyId) {
    return new Promise(async (resolve, reject) => {
      this.minisiteColors = {
        accentColor: this.userInfo.accentColor,
        alternateColor: this.userInfo.alternateColor,
      };

      localStorage.setItem(
        "MINISITE_COLORS_" + companyId,
        JSON.stringify(this.minisiteColors)
      );

      this.service.broadcastEvent("MINISITE_RENDER", this.minisiteColors);
      resolve(true);
    });
  }

  openDialog() {
    this.dialog.open(LeadsPromotesDeskComponent, {
      width: "400px",
      disableClose: true
    });
  }
  getCompanyProducts(companyId) {
    return new Promise(async (resolve, reject) => {
      try {
        this.service.getCompanyProductImages(companyId).then((res: any) => {
          this.heroCard = res.userProducts.splice(0, 1)[0];
          this.newArrivals = res.userProducts.splice(0, 3);
          this.remainingProducts = res.userProducts;
          console.log("============>",this.companyInfo);
          
          this.cd.detectChanges();
          resolve(true);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
