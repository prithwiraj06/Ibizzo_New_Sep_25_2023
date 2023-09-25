import { Component, OnInit } from "@angular/core";

@Component({
  selector: "kt-base",
  templateUrl: "base.component.html",
  styleUrls: ["base.component.scss"],
})
export class BaseComponent implements OnInit {
  contact: any = {};

  constructor() {}

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
}
