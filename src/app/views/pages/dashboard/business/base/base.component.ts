import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { AlternativePaymentComponent } from "../alternative-payment/alternative-payment.component";
import { UpdateUserDetailsComponent } from "../update-user-details/update-user-details.component";

@Component({
  selector: "kt-base",
  templateUrl: "base.component.html",
  styleUrls: ["base.component.scss"],
})
export class BaseComponent implements OnInit {
  contact: any = {};

  constructor(private dialog: MatDialog,
    ) {
  }

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

  editContent(event, details) {
    let dataInfo = {
      event: event,
      user: details,
    };

    const dialogRef = this.dialog.open(UpdateUserDetailsComponent, {
      data: dataInfo,
      width: "300px",
      hasBackdrop: true,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      window.location.reload();
    });
  }

  alterNativePayment(){
    const dialogRef = this.dialog.open(AlternativePaymentComponent, {
      width: "400px",
      hasBackdrop: true,
      disableClose: true,
    });
  }
}
