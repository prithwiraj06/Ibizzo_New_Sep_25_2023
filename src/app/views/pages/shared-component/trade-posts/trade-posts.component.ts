import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material";
import { EmailComponent } from "../../auth/login-page/email/email.component";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { Router } from "@angular/router";
import { EnquiryService } from "../../../../../provider/enquiry/enquiry.service";
import moment from "moment";
import { environment } from "../../../../../environments/environment";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "kt-trade-posts",
  templateUrl: "./trade-posts.component.html",
  styleUrls: ["./trade-posts.component.scss"],
})
export class TradePostsComponent implements OnInit {
  data: any = [];
  page = 0;
  size = 6;
  fetching: boolean = false;
  loading: boolean;
  searchText: any;
  urlSafe: SafeResourceUrl;
  url: string = environment.SEO_URL + "/iframe/hide-trade";

  constructor(
    private dialog: MatDialog,
    private baseUrlPipe: BaseUrlPipe,
    private router: Router,
    private enquiry: EnquiryService,
    private cd: ChangeDetectorRef,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getData(this.page, this.size);
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

    console.log("tradepost new");
    debugger;
    window.location.href = environment.SEO_URL + "/trade-post";
  }

  async getData(page, size, search?: any) {
    this.data = [];
    this.fetching = true;
    try {
      let param = {
        search: search ? search : "",
        pageNumber: page,
        records: size,
      };
      let res: any = await this.enquiry.getTradePostsLists(param);
      this.data = res.purchaserEnquiryData;
      this.fetching = false;
      this.loading = false;

      this.cd.detectChanges();
      console.log("result", this.data);
    } catch (err) {
      this.fetching = false;
      this.loading = false;

      console.log("error", err);
    }
  }
  async viewBuyers(item: any) {
    console.log("item", item);
    if (!JSON.parse(localStorage.getItem("memberData"))) {
      localStorage.setItem("liveRfq", JSON.stringify(item));

      await this.authentication();
    } else {
      localStorage.setItem("liveRfq", JSON.stringify(item));
      this.router.navigate([
        this.baseUrlPipe.transform(["/dashboard/business/sales/enquiry/"]),
      ]);
    }
  }

  getEmail(data) {
    let firstLetters = data.substr(0, 3);
    let lastLetters = data.substr(-4);
    return firstLetters + "******" + lastLetters;
  }

  getPhone(data) {
    let firstLetters = data.substr(0, 4);
    return firstLetters + "******";
  }

  authentication() {
    const dialogRef = this.dialog.open(EmailComponent, {
      width: "450px",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
    });
  }

  pageChangeEvent(event: any) {
    this.page = event.pageIndex * event.pageSize + 1;
    this.size = (event.pageIndex + 1) * event.pageSize;
    if (this.searchText) {
      this.getData(this.page, this.size, this.searchText);
    } else {
      this.getData(this.page, this.size);
    }
    this.cd.detectChanges();
  }
  search() {
    this.loading = true;
    this.getData(this.page, this.size, this.searchText.trim());
    this.cd.detectChanges();
  }
  getEmailAndPhone(item) {
    return item ? item.substring(0, 3) + "***" : "";
  }
  getDateFormat(date): string {
    return moment(date).format("MMM DD, YYYY  hh:mm a");
  }
  getImage(image) {
    return image != null
      ? this.enquiry.getImageUrl(image, "GetDownload")
      : "../../../../assets/media/placeholder/product.jpg";
  }
}
