import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { PartnerLogoComponent } from "../partner-logo/partner-logo.component";

@Component({
  selector: "kt-base",
  templateUrl: "base.component.html",
  styleUrls: ["base.component.scss"],
})
export class BaseComponent implements OnInit {
  contact: any = {};

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getContactDetails();
  }

  getContactDetails() {
    let user: any = JSON.parse(localStorage.getItem("memberData"));
    if (user) {
      this.contact = user.memberUserInfo;
      this.contact.shortName = (
        this.contact.name[0] + this.contact.name[1]
      ).toUpperCase();
    }
  }

  uploadPartnerLogo() {
    const dialogRef = this.dialog.open(PartnerLogoComponent, {
      width: "500px",
      data: {},
    });
    dialogRef.afterClosed().subscribe((res) => {});
  }
}
