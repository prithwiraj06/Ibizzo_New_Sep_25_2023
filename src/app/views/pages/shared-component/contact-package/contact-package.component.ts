import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import * as _ from "underscore";
import { PaymentjsService } from "paymentjs";
import { environment } from "../../../../../environments/environment";
import { SubscriptionService } from "../../../../../provider/subscription/subscription.service";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { EmailComponent } from "../../auth/login-page/email/email.component";
import { MatDialog } from "@angular/material";

@Component({
  selector: "kt-contact-package",
  templateUrl: "./contact-package.component.html",
  styleUrls: ["./contact-package.component.scss"],
})
export class ContactPackageComponent implements OnInit {
  reciept: any;
  queryParam: string;
  constructor(
    private cd: ChangeDetectorRef,
    private payment: PaymentjsService,
    private authService: AuthService,
    private subscribe: SubscriptionService,
    private baseUrlPipe: BaseUrlPipe,
    private router: Router,
    private toast: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}
  login() {
    const dialogRef = this.dialog.open(EmailComponent, {
      width: "450px",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      window.location.reload();
    });
  }
  async subScription() {
    const currentUser: any = this.authService.getCurrentUser();
    if (currentUser && currentUser.email) {
      let hasTake: any = await this.subscribe.visterHasDetails(currentUser.id,2);
      if (hasTake && hasTake.offerPurcahsed) {
        this.toast.success("Offer has been already purchased");

        return;
      }
      this.reciept = `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;

      let orderDetails: any = {
        email: currentUser.email,
        phonenumber: currentUser.phoneNumber,
        amount: 999,
        receipt: this.reciept,
        currency: "INR",
        payment_capture: 1,
        username: environment.RAZORPAY_PUBLIC_KEY,
      };

      try {
        // let res: any = await this.digital.addMemberCartSnapshot(addCardSnap);
        // if (res) {
        orderDetails.description = "123" + "#~#CART" || "";
        event.preventDefault();
        const response: any = await this.payment.checkout({
          paymentInstrument: "payment_razorpay",
          params: orderDetails,
        });
        console.log("Respose", response);

        this.paymentResponseHander(response);
        // }
        // this.processingPayment = false;
      } catch (e) {
        // this.processingPayment = false;
        this.cd.detectChanges();
      }
    } else {
      this.toast.error("Please Login then go for Subscription");
      this.login();
    }
  }
  async paymentResponseHander(id) {
    const currentUser: any = this.authService.getCurrentUser();
    this.queryParam =
      currentUser.companyName
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      currentUser.id +
      ".html";
    console.log("razor pay", this.reciept);
    console.log("razaor pay ide", id);
    let razId = "";
    if (id && id.raw_response && id.raw_response.razorpay_payment_id) {
      razId = id.raw_response.razorpay_payment_id;
    } else {
      razId = id;
    }
    try {
      if (id) {
        let finalPackage: any = {
          memberId: currentUser.id,
          offerId: 2,
          packageId: 0,
          appSecretKeyPassed: environment.RAZORPAY_PUBLIC_KEY,
          referenceId: this.reciept,
          transationDetails: {
            razorpay_payment_id: razId,
            amountPaid: 999,
            taxAmount: 0,
          },
          token: "IBizzo",
        };
        console.log("paymentdata", finalPackage);
        let res: any = await this.subscribe.purchaseContactPackage(
          finalPackage
        );
        console.log("add membepackge details no error============>", res);
        if (res && res.message == "success") {
          this.toast.success("Contact Offer Purchased Successfully");
          window.open(
            this.baseUrlPipe.transform(["/m/h/" + this.queryParam]),
            "_blank"
          );
        } else {
          if (res && res.message == "Offer has been already purchased") {
            this.toast.success("Offer has been already purchased");
          } else {
            this.toast.error("Transcations is Failed");
          }
        }
      }
    } catch (error) {
      console.log("add membepackge details===========", error);
    }
  }
}
