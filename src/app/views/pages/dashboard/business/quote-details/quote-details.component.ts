import { Component, OnInit, ChangeDetectorRef, Inject } from "@angular/core";
import { CartService } from "../../../../../../provider/cart/cart.service";
import { AuthService } from "../../../../../views/pages/auth/auth.service";
import { PaymentjsService } from "paymentjs";
import { Router } from "@angular/router";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { environment } from "../../../../../../environments/environment";
import * as _ from "underscore";
import { DigitalFlyerService } from "../../../../../../provider/digital-flyers/digital-flyer.service";

@Component({
  selector: "kt-quote-details",
  templateUrl: "./quote-details.component.html",
  styleUrls: ["./quote-details.component.scss"],
})
export class QuoteDetailsComponent implements OnInit {
  totalValue: number = 60;
  count: any = 1;
  disAmt:any=0;
  packageDetails: any = {
    organizationName: "",
    packageTypeId: undefined,
    token: undefined,
    price: 10,
    name: "",
    durationType: undefined,
  };
  processingPayment: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private payment: PaymentjsService,
    private authService: AuthService,
    private service: CartService,
    public dialogRef: MatDialogRef<QuoteDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = false,
    private route: Router,
    private digital: DigitalFlyerService
  ) {}

  async ngOnInit() {
    await this.getCartPackages();
    this.packageDetails.organizationName = JSON.parse(
      localStorage.getItem("organizationName")
    );
    this.packageDetails.receiptNumber = `Receipt#${
      Math.floor(Math.random() * 5123 * 43) + 10
    }`;
    let res: any = JSON.parse(localStorage.getItem("memberData"));
    if (res.token) {
      this.packageDetails.token = res.token;
    }
  }

  //get cart packages
  async getCartPackages() {
    try {
      let res: any = await this.service.getCartPackagesById(2);
      if (res.packageDetails) {
        if (res.packageDetails[0].name == "QUOTES") {
          this.packageDetails = res.packageDetails[0];
          this.totalValue = this.packageDetails.price;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  //value increment
  incrementValue() {
    this.count++;
    this.updateCart();
  }

  //value decrement
  decrementValue() {
    if (this.count > 0) {
      this.count--;
      this.updateCart();
    }
  }

  valueChangedByType(value) {
    this.count = value;
    this.updateCart();
  }

  updateCart() {
    let disc=0
    if (this.count <= 10) {
      this.totalValue = this.count * this.packageDetails.price;
    } else if (this.count > 10 && this.count <= 20) {
      disc=(this.packageDetails.price * 0.9)
      this.totalValue = this.count * (this.packageDetails.price * 0.9);
    } else if (this.count > 20 && this.count <= 30) {
      disc=(this.packageDetails.price * 0.8)
      this.totalValue = this.count * (this.packageDetails.price * 0.8);
    } else {
      disc=(this.packageDetails.price * 0.7)
      this.totalValue = this.count * (this.packageDetails.price * 0.7);
    }
    this.totalValue=parseFloat(this.totalValue.toFixed(2))
    this.disAmt=disc

  }

  async proceedToPay() {
    if (this.packageDetails.receiptNumber) {
      localStorage.setItem(
        "receiptNum",
        JSON.stringify(this.packageDetails.receiptNumber)
      );
      localStorage.setItem("totalInvoice", JSON.stringify(this.totalValue));

      const currentUser: any = this.authService.getCurrentUser();
      this.processingPayment = true;

      let orderDetails: any = {
        email: currentUser.email,
        phonenumber: currentUser.phoneNumber,
        amount: this.totalValue,
        currency: "INR",
        payment_capture: 1,
        username: environment.RAZORPAY_PUBLIC_KEY,
      };

      let addCardSnap = {
        secretKey: environment.CARTSNAP_SECRET_KEY,
        applicationKey: "IBiz",
        memberId: this.authService.getUserId(),
        Type: 2,
        // ReferenceId: this.receiptNumber
      };
      try {
        let res: any = await this.digital.addMemberCartSnapshot(addCardSnap);
        if (res) {
          orderDetails.description = res.referenceId + "#~#LEADS" || "";
          event.preventDefault();
          const response: any = await this.payment.checkout({
            paymentInstrument: "payment_razorpay",
            params: orderDetails,
          });
          this.paymentResponseHander(response);
        }
      } catch (e) {
        this.processingPayment = false;
        this.cd.detectChanges();
      }
    }
  }

  //add packge to member
  async paymentResponseHander(response) {
    try {
      if (response.trxn_id) {
        let paymentData = this.returnPaymentData(response);
        let res = await this.service.addMemberPackageDetails(paymentData);
        if (_.has(this.data, "value")) {
          this.dialogRef.close(true);
        } else {
          this.route.navigateByUrl(
            "/IBizzo/dashboard/business/payment/success"
          );
        }
      }
    } catch (e) {
      console.log(e);
      if (_.has(this.data, "value")) {
        this.dialogRef.close(false);
      } else {
        this.route.navigateByUrl("/IBizzo/dashboard/business/payment/error");
      }
    }
  }

  returnPaymentData(response) {
    let selectedPackages: any = [];
    selectedPackages.push({
      packageDetailId: this.packageDetails.packageTypeId,
      packageDetailName: this.packageDetails.name,
      appSecretKeyPassed: environment.APP_SECRET_KEY,
      price: this.totalValue,
      totalAmountPayable: this.totalValue,
      discountAmt:parseFloat(this.disAmt.toFixed(2)),
      quantity: parseInt(this.count),
      durationType: this.packageDetails.durationType,
    });

    return {
      token: this.packageDetails.token,
      packageId: this.packageDetails.packageTypeId,
      offerId: 0,
      appSecretKeyPassed: environment.APP_SECRET_KEY,
      referenceId: this.packageDetails.receiptNumber,
      transationDetails: {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.trxn_id,
        razorpay_signature: response.razorpay_signature,
        amountPaid: this.totalValue,
        taxAmount: 0,
      },
      packageDetails: selectedPackages,
      applicationKey: "IBiz",
      secretKey: environment.APP_SECRET_KEY,
    };
  }

  close() {
    if (_.has(this.data, "value")) {
      this.dialogRef.close(false);
    } else {
      this.route.navigateByUrl("/IBizzo/dashboard/business/home");
    }
  }
}
