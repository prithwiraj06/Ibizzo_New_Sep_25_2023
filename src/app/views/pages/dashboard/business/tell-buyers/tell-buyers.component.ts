import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  ViewEncapsulation,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { BuyerDetailsComponent } from "../buyer-details/buyer-details.component";
import { AuthService } from "../../../../../views/pages/auth/auth.service";
import { NotificationService } from "../../../../../../provider/notification/notification.service";
import { environment } from "../../../../../../environments/environment";
import { UserProfileService } from "../../../../../../provider/user-profile/user-profile.service";
import { PaymentjsService } from "paymentjs";
import { ToastrService } from "ngx-toastr";
import { SellerNotificationComponent } from "../../../shared-component/seller-notification/seller-notification.component";

@Component({
  selector: "kt-tell-buyers",
  templateUrl: "./tell-buyers.component.html",
  styleUrls: ["./tell-buyers.component.scss"],
})
export class TellBuyersComponent implements OnInit {
  loading: boolean = false;
  count: any = 0;
  currentUser: any = {};
  message: string = "";
  packageDetails: any = {};
  targetBuyers: any;
  totalValue: any = 0;

  constructor(
    public dialogRef: MatDialogRef<TellBuyersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private authService: AuthService,
    private service: NotificationService,
    private cd: ChangeDetectorRef,
    private payment: PaymentjsService,
    private userProfile: UserProfileService,
    private toastr: ToastrService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.targetBuyers = this.data.noOfBuyers || this.data.noOfSellers || 0;
    this.count = this.targetBuyers;
    this.getPackageDetails();
  }

  //package
  async getPackageDetails() {
    try {
      let res: any = await this.service.getBuyerPackage();
      if (res.packageDetails.length > 0) {
        this.packageDetails = res.packageDetails[0];
        this.getTotalValue();
      }
    } catch (e) {}
  }

  //value increment
  incrementValue() {
    if (this.count < this.targetBuyers) {
      this.count++;
      this.getTotalValue();
    } else {
      let text = "Please select the buyers less than " + this.targetBuyers;
      this.toastr.error(text);
      return;
    }
  }

  //value decrement
  decrementValue() {
    if (this.count > 0) {
      this.count--;
      this.getTotalValue();
    }
  }

  //when value change by type
  valueChangedByType(value) {
    this.count = value;
    this.getTotalValue();
  }

  getTotalValue() {
    this.totalValue = this.count * this.packageDetails.price || 0;
  }

  diasbleBtn() {
    if (this.totalValue > 0 && this.count <= this.targetBuyers) return false;
    else return true;
  }
  async previewFlyer() {
    let text = "Please select the buyers less than " + this.targetBuyers;
    if (this.count > this.targetBuyers) {
      this.toastr.error(text);
      return;
    }
    this.userProfile
      .getProfile(this.authService.getUserId())
      .then((res: any) => {
        console.log("member", res);
        let item: any = {
          compaignName: null,
          compnayImage:(res.userDetails.companyImages&&res.userDetails.companyImages.length!=0)? res.userDetails.companyImages[0].imageName:'',
          email: res.userDetails.email,
          fileName: null,
          id: res.userDetails.id,
          location: res.userDetails.location,
          logo: res.userDetails.logo,
          message: this.message,
          phoneNumber: res.userDetails.phoneNumber,
          productId: this.data.productId,
          productName: this.data.productName,
          senderCompany: res.userDetails.companyName,
          senderCompanyId: res.userDetails.companyId,
          senderId: res.userDetails.id,
          senderName: res.userDetails.name,
          isPreview: true,
          flyerType: "productFlyers",
        };
        const dialogRef = this.dialog.open(SellerNotificationComponent, {
          data: item,
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(async (result) => {
          console.log("result");
          if (!result) {
            return;
          }
        });
      });
  }

  //payment
  async proceedToPay() {
    let res: any = null;

    //check number of input buyers is less than than defualt buyers
    let text = "Please select the buyers less than " + this.targetBuyers;
    if (this.count > this.targetBuyers) {
      this.toastr.error(text);
      return;
    }

    this.loading = true;
    let orderDetails = {
      email: this.currentUser.email,
      phonenumber: this.currentUser.phoneNumber,
      amount: this.totalValue,
      currency: "INR",
      payment_capture: 1,
      username: environment.RAZORPAY_PUBLIC_KEY,
    };

    event.preventDefault();
    try {
      //payment_razorpay
      // const response: any = await this.payment.checkout({
      //   paymentInstrument: "payment_razorpay",
      //   params: orderDetails,
      // });

      //request
      let paymentData: any = this.request();

      //post flyers
      if (this.data.type == 1) {
        paymentData.productName = this.data.productName;
        paymentData.productId = this.data.productId;
        res = await this.service.postProcessProductFlyers(paymentData);
      } else {
        paymentData.purchaseEnquiryName = this.data.productName;
        paymentData.purchaseProductId = this.data.productId;
        res = await this.service.postProcessPurchaseFlyers(paymentData);
      }
      if (res) {
        this.dialogRef.close();
        this.openBuyersDetails(res.productFlyersId || res.purchaseFlyersId);
      }

      if (res.statusCode == 10000) {
        this.loadingFalse("Flyers Processed Successfully", false);
      } else {
        this.toastr.error(res.message);
      }
    } catch (e) {
      this.loadingFalse("Payment Failed", true);
    }
  }

  //handle loading and Error case
  loadingFalse(text, error) {
    if (error) {
      this.toastr.error(text);
    } else {
      this.toastr.success(text);
    }
    this.loading = false;
    this.cd.detectChanges();
  }

  //final request for post product flyers
  request() {
    return {
      flyersTemplateId: 0,
      memberCompanyId: parseInt(this.currentUser.companyId),
      memberId: this.currentUser.id,
      targetedBuyers: parseInt(this.count),
      message: this.message,
      // paymentInfo: {
      //   razorpay_order_id: response.trxn_id,
      //   razorpay_payment_id: response.trxn_id,
      //   razorpay_signature: response.trxn_id,
      //   amountPaid: this.totalValue,
      //   taxAmount: 0,
      // },
      // packageDetails: {
      //   id: this.packageDetails.id,
      // packageDetailId: parseInt(this.packageDetails.packageTypeId),
      // packageDetailName: this.packageDetails.name,
      // appSecretKeyPassed: environment.APP_SECRET_KEY,
      // price: this.packageDetails.price,
      // quantity: this.packageDetails.quantity,
      // durationType: this.packageDetails.durationType,
      // prdId: this.packageDetails.prdId,
      // prdName: this.packageDetails.prdName,
      // totalAmountPaid: this.packageDetails.totalAmountPaid,
      // totalAmountPayable: this.packageDetails.totalAmountPaid,
      // },
      token: "",
      code: "",
    };
  }

  //buyer-details(history)
  openBuyersDetails(id) {
    let data: any = {
      id: id,
      type: this.data.type,
      productName: this.data.productName,
    };
    const dialogRef = this.dialog.open(BuyerDetailsComponent, {
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
    });
  }
}
