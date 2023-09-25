import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "kt-social-share",
  templateUrl: "./social-share.component.html",
  styleUrls: ["./social-share.component.scss"],
})
export class SocialShareComponent implements AfterViewInit {
  shareFb: any;
  shareWhats: string;
  shareMail: string;
  constructor(private authService: AuthService) {}

  ngAfterViewInit() {
    console.log("usr", this.authService.getUserId());
    this.shareFb =
      "https://www.facebook.com/IBIZZOB2B?u=" +window.location.href;
      //  window.location.href;
    //   "?memberId=" +
    //   this.authService.getUserId();
    // ("&t=ibizzo");
    this.shareWhats =
      "https://api.whatsapp.com/send?text=" + window.location.href;
    // "?memberId=" +
    // this.authService.getUserId();
    this.shareMail = "mailto:?subject=[SUBJECT]&body=" + window.location.href;
    // "?memberId=" +
    // this.authService.getUserId();
    console.log("share", this.shareFb);
  }
}
