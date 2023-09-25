import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Inject,
} from "@angular/core";
import { Router, ActivatedRoute, Data } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ProductService } from "../../../../../provider/product-service/product-service.service";
import { AuthService } from "../../auth/auth.service";
import * as _ from "underscore";
import { PaymentjsService } from "paymentjs";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { environment } from "../../../../../environments/environment";
import { DigitalFlyerService } from "../../../../../provider/digital-flyers/digital-flyer.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { SubscriptionService } from "../../../../../provider/subscription/subscription.service";

@Component({
  selector: "kt-user-cart-details",
  templateUrl: "./user-cart-details.component.html",
  styleUrls: ["./user-cart-details.component.scss"],
})
export class UserCartDetailsComponent implements OnInit {
  finalOrgUrl;
  selectedPackageForm: FormGroup;
  userList;
  packageList;
  totalNumberOfPhotoGraphs = [];
  totalNumberOfDocs = [];
  totalNumberOfVideos = [];
  SlNo: number = 0;
  logoSerNo: number = 0;
  imageSerNo1: number = 0;
  imageSerNo2: number = 0;
  imageSerNo3: number = 0;
  imageSerNo4: number = 0;
  docSerNo: number = 0;
  videoSerNo: number = 0;
  websiteSerNo: number = 0;
  cost: number = 60;
  costPerLinkToWebsite: number;
  costPerLinkToVideos: number;
  costPerToUploadLogo: number;
  costPerToUploadFaciImage: number;
  costPerToUploadDoc: number;
  totalPriceOfPhoto: number;
  totalPriceOfDocs: number;
  totalPriceOfVideos: number;
  totalPriceOfWebsite: number;
  totalPriceOfLogo: number;
  websiteDefined;
  logoUploaded;
  totalOfAllProducts;
  CGST: number;
  SGST: number;
  totalWithGST: number;
  public photograph;
  public photoDescription;
  public fileOrDoc;
  public docDescription;
  public linkToVid;
  public videoDescription;
  public linkToWeb;
  public websiteDescription;
  public logoTitle;
  public logoDescription;
  public receiptNumber;
  processingPayment: boolean = false;
  payableAmount = 0;
  WindowRef: any;
  paymentResponse: any = {};
  orderId;
  token;
  response;
  razorpayResponse;
  showModal = false;
  public isDiaPopupOpened = false;
  PopUpMsg = "";
  PopUpTitle = "";
  isPaymentUnpaid: boolean = true;
  isPaymentPaid: boolean = false;
  totalpriceOfImages;
  totalPriceOfVideoLink;
  uploadedImages;
  uploadedVideoLink;
  Image1;
  isImageUploaded;
  isImageLinked: boolean = false;
  isVideoLinkProvided;
  isVideoLinked: boolean = false;
  Image2;
  Image3;
  Image4;
  Image5;
  totalPriceOfPhoto1;
  totalPriceOfPhoto2;
  totalPriceOfPhoto3; //totalPriceOfPhoto4;
  Doc1;
  Doc2;
  totalPriceOfDoc1: number;
  subLoading: boolean;
  subLoading1: boolean;
  totalPriceOfDoc2: number;
  docSerNo1;
  docSerNo2;
  Utube1;
  Utube2;
  productId;
  totalPriceOfVideos1;
  totalPriceOfVideos2;
  videoSerNo1;
  videoSerNo2;
  pckgId = 3;
  costPerImageSlot;
  imageService;
  imageServiceDescription;
  imageServiceId;
  promolst;
  cartItemsList;
  totalAmountPayable;
  allDetails:any;
  bundleOffers:any=[]

  bgImage = "./assets/media/misc/bg-1.jpg";
  uploadedImage: any = [
    {
      type: "UPLOAD_IMAGES",
      source: "/assets/media/files/jpg.svg",
    },
    {
      type: "UPLOAD_LOGO",
      source: "/assets/media/icons/exchange.svg",
    },
    {
      type: "UPLOAD_DOCS",
      source: "/assets/media/files/doc.svg",
    },
  ];
  isEnable: any = true;
  offerListCart: any=[];
  arrData: any;
  allPackages: any;
  totalDis: any;
  totalValue: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private product: ProductService,
    private cd: ChangeDetectorRef,
    public payment: PaymentjsService,
    private authService: AuthService,
    private baseUrlPipe: BaseUrlPipe,
    private digital: DigitalFlyerService,
    private toastr:ToastrService,
    private subscribe: SubscriptionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UserCartDetailsComponent>
  ) {
    this.token = this.data.token
      ? this.data.token
      : JSON.parse(localStorage.getItem("memberData")).token;
    this.finalOrgUrl =
      JSON.parse(localStorage.getItem("organizationName")) || "dashboard";
    this.getCartPackages();
    this.getMemberPackageDetails();
    this.getMemberCart();
  
  }

  async ngOnInit() {
    this.finalOrgUrl =
      JSON.parse(localStorage.getItem("organizationName")) ||
      "/dashboard/business";
    this.route.queryParams.subscribe((params) => {
      this.productId = params.productId;
    });
    this.selectedPackageForm = this.formBuilder.group({});
    this.WindowRef = this.product.WindowRef;
    this.isEnable = this.data.isEnable == false ? false : true;

    let packages:any=await this.subscribe.getPackage();
    this.allPackages=packages.packages;
    this.cd.detectChanges();
    let data:any=await this.subscribe.getBundleDetails();
    if(data&&data.packages&&data.packages.length!=0){
      let info= data.packages.sort(function (a, b) {
         return parseInt(a.offerCount) - parseInt(b.offerCount);
       });
       this.bundleOffers=info;
     }
  }

 async sentMail(){
    let res:any=await this.digital.sentMailToMember(this.token);
    console.log(res);
    if(res&&res.updated==1){
      this.toastr.success("Mail sent Successfully")
    }
    
  }

  getBundle() {
    let count = this.arrData.length;
    let index = _.findIndex(this.bundleOffers, { offerCount: count.toString() });
    console.log(index);
    let id = 0
    if (index != -1) {
      id = this.bundleOffers[index].id
    }
    return id;

  }

  getPercentage() {
    let count = this.arrData.length;
    let index = _.findIndex(this.bundleOffers, { offerCount: count.toString() });
    console.log(index);
    let total = 0;
    this.arrData.map((item) => {
        total += parseInt(this.getAmount(item.id))
    })
    if (index != -1) {
      let dis = parseInt(this.bundleOffers[index].offerDiscount);
      let discount = ((total * dis) / 100)
      this.totalDis=discount.toFixed(0)
      this.totalValue=total;
  
      let total1 = dis == 0 ? ((total)) : ((total) - ((total * dis) / 100));
      return total1.toFixed(0) 
    }
    else{
      this.totalDis=0
      this.totalValue=total;
      if(count==0){
        return total
      }
      else{

       return total
      }
    }

  }

  getAmount(id) {
    if (this.allPackages && this.allPackages.length != 0) {
      let index1 = _.findIndex(this.allPackages, { id: id });
      if (index1 != -1) {
        return this.allPackages[index1].amount
      }
    }
  }
  

  logoNotUploaded;
  getUserSelectedPackage() {
    this.product.GetProductImageAndVideo(this.productId).then((getAll: any) => {
      this.promolst = getAll.imagesAndVideo;
      this.uploadedImages = this.promolst.images;
      this.uploadedVideoLink = this.promolst.videoLink;

      if (this.uploadedImages > 0 && this.uploadedVideoLink > 0) {
        this.totalpriceOfImages =
          this.packageList[0].price * this.uploadedImages;
        this.totalPriceOfVideoLink = this.packageList[1].price;
        this.isImageUploaded = 1;
        this.isImageLinked = false;
        this.isVideoLinkProvided = 1;
        this.isVideoLinked = false;
        this.selectedPackages.push({
          packageDetailId: this.packageList[0].packageTypeId,
          packageDetailName: this.packageList[0].name,
          appSecretKeyPassed: environment.APP_SECRET_KEY,
          // "transationId": this.receiptNumber,
          price: this.packageList[0].price,
          quantity: this.uploadedImages,
          durationType: this.packageList[0].durationType,
        });
        this.selectedPackages.push({
          packageDetailId: this.packageList[1].packageTypeId,
          packageDetailName: this.packageList[1].name,
          appSecretKeyPassed: environment.APP_SECRET_KEY,
          // "transationId": this.receiptNumber,
          price: this.packageList[1].price,
          quantity: 1,
          durationType: this.packageList[1].durationType,
        });
      } else if (this.uploadedImages > 0) {
        this.totalpriceOfImages = this.packageList[0] * this.uploadedImages;
        this.selectedPackages.push({
          packageDetailId: this.packageList[0].packageTypeId,
          packageDetailName: this.packageList[0].name,
          appSecretKeyPassed: environment.APP_SECRET_KEY,
          // "transationId": this.receiptNumber,
          price: this.packageList[0].price,
          quantity: this.uploadedImages,
          durationType: this.packageList[0].durationType,
        });
      } else if (this.uploadedVideoLink > 0) {
        this.totalPriceOfVideoLink = this.packageList[1].price;
        this.selectedPackages.push({
          packageDetailId: this.packageList[1].packageTypeId,
          packageDetailName: this.packageList[1].name,
          appSecretKeyPassed: environment.APP_SECRET_KEY,
          // "transationId": this.receiptNumber,
          price: this.packageList[1].price,
          quantity: 1,
          durationType: this.packageList[1].durationType,
        });
      }

      this.totalOfAllProducts =
        this.totalpriceOfImages + this.totalPriceOfVideoLink;
      this.CGST = (this.totalOfAllProducts * 0) / 100;
      this.SGST = (this.totalOfAllProducts * 0) / 100;
      this.totalWithGST = this.totalOfAllProducts + this.CGST + this.SGST;
    });
  }

  getImagesServices(packageDetailName: string, fileName: string) {
    if (
      fileName &&
      [
        "UPLOAD_IMAGES",
        "UPLOAD_LOGO",
        "PRODUCT_IMAGE_SLOT1",
        "PRODUCT_IMAGE_SLOT2",
        "PRODUCT_IMAGE_SLOT3",
        "PRODUCT_IMAGE_SLOT4",
      ].indexOf(packageDetailName) > -1
    ) {
      return this.product.getImageUrl(fileName);
    }

    let index = _.findIndex(this.uploadedImage, { type: packageDetailName });
    if (index > -1) {
      return this.uploadedImage[index].source;
    } else {
      return "/assets/media/client-logos/logo1.png";
    }
  }

  LinkToWebId;
  logoId;
  selectedPackages = [];
  packageTypeId;
  getCartPackages() {
    this.product
      .getCartPackages(this.pckgId)
      .then((getPackageResponse: any) => {
        //Baz Temporary Changes for Package details
        this.packageList = getPackageResponse.packageDetails;
        this.receiptNumber = `Receipt#${
          Math.floor(Math.random() * 5123 * 43) + 10
        }`;

        this.packageTypeId = this.packageList[1].packageTypeId;

        if (this.packageList[0].name === "PRODUCT_IMAGE") {
          this.costPerImageSlot = this.packageList[0].price;

          this.imageService = this.packageList[0].name;
          this.imageServiceDescription = this.packageList[0].description;
          this.imageServiceId = this.packageList[0].id;
        }

        if (this.packageList[1].name === "PRODUCT_VIDEO") {
          this.costPerLinkToVideos = this.packageList[1].price;

          this.linkToVid = this.packageList[1].name;
          this.videoDescription = this.packageList[1].description;
        }
      });
  }

  async removeFromCart(id){
    try{
      console.log(id);
      let index=_.findIndex(this.arrData,{id:id});
      let data=""
      if(index!=-1){
        this.arrData.splice(index,1)
        this.arrData.map((item,index)=>{
           if(this.arrData.length-1 ==index){
             data+=item.id
           }
           else{
            data+=item.id+","
           }
        })
        console.log("===>",data);
      }
    
      let ids=this.getBundle()
      let options={
        "offerIds": data,
        "bundledOfferId": ids==0?'':ids.toString(),
        "amount":this.getPercentage(),
        "createdByAdmin":!this.isEnable?false: true,
        "memberId":this.token
      }
      let res: any = await this.subscribe.hasAddToCart(options);
      console.log(res);
      if(res.updated==1){
        this.product.broadcastEvent("CART_UPDATED", null);
        this.toastr.success("Package Add to cart successfully");
        this.getMemberCart()
      }
  
      console.log(options);
    }
    catch(err){
      console.log(err);
      
    }
    
    
  }

  getMemberCart() {
    this.product.GetMemberCart(this.token).then((getAll: any) => {
      this.cartItemsList = (getAll.cartDetail&&getAll.cartDetail.length!=0)?getAll.cartDetail:[];
      this.offerListCart=(getAll.offersInCart&&getAll.offersInCart.length!=0)?getAll.offersInCart:[];
      this.arrData=(getAll.offersInCart&&getAll.offersInCart.length!=0)?getAll.offersInCart:[];
      this.totalAmountPayable = getAll.grandTotalPayable;
      this.allDetails=getAll
      this.cd.detectChanges();
    });
  }

  editCartItem(item: any) {
    // /dashboard/business/sales/catalogue/?productId='+cd.prdId
  }

  async proceedToPay() {
    if (this.processingPayment) {
      return false;
    }
    const currentUser: any = this.authService.getCurrentUser();
    this.processingPayment = true;
    localStorage.setItem("receiptNum", JSON.stringify(this.receiptNumber));
    localStorage.setItem("totalInvoice", JSON.stringify(this.totalWithGST));

    let orderDetails: any = {
      email: currentUser.email,
      phonenumber: currentUser.phoneNumber,
      amount: this.totalAmountPayable,
      receipt: this.receiptNumber,
      currency: "INR",
      payment_capture: 1,
      username: environment.RAZORPAY_PUBLIC_KEY,
    };

    let addCardSnap = {
      secretKey: environment.CARTSNAP_SECRET_KEY,
      applicationKey: "IBiz",
      memberId: this.authService.getUserId(),
      Type: 1,
      // ReferenceId: this.receiptNumber
    };
    try {
      let res: any = await this.digital.addMemberCartSnapshot(addCardSnap);
      if (res) {
        orderDetails.description = res.referenceId + "#~#CART" || "";
        event.preventDefault();
        const response: any = await this.payment.checkout({
          paymentInstrument: "payment_razorpay",
          params: orderDetails,
        });
        this.paymentResponseHander(response);
      }
      this.processingPayment = false;
    } catch (e) {
      this.processingPayment = false;
      this.cd.detectChanges();
    }
  }

  paymentAdded;
  paymentResponseHander(response) {
    try {
      if (response.trxn_id) {
        debugger;
        let x = this.returnPaymentData(response);
        this.product.addMemberPackageDetail(x).then((Response) => {
          this.paymentAdded = Response;
          if (response.trxn_id != null) {
            this.isPaymentUnpaid = false;
            this.isPaymentPaid = true;
            this.subLoading = false;
            this.product.broadcastEvent("CART_UPDATED", { cart_size: 2 });
            this.router.navigate([
              this.baseUrlPipe.transform([
                "/dashboard/business/payment/success",
              ]),
            ]);
          }
        });
      } else {
        this.isPaymentUnpaid = true;
        this.isPaymentPaid = false;
        this.subLoading = false;
        this.subLoading1 = false;
        this.router.navigate([
          this.baseUrlPipe.transform(["/dashboard/business/payment/error"]),
        ]);
      }
    } catch (Exp) {
      this.subLoading = false;
      this.subLoading1 = false;
      this.router.navigate([
        this.baseUrlPipe.transform(["/dashboard/business/payment/error"]),
      ]);
    }
  }

  returnPaymentData(response) {
    let data = {
      token: this.token,
      packageId:this.offerListCart.length!=0?0: this.packageTypeId,
      offerId:this.offerListCart.length!=0?0: 1,
      appSecretKeyPassed: environment.APP_SECRET_KEY,
      referenceId: this.receiptNumber,
      transationDetails: {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.trxn_id,
        razorpay_signature: response.razorpay_signature,
        amountPaid: this.totalAmountPayable,
        taxAmount: 0,
      },
      packageDetails: this.cartItemsList,
      applicationKey: "IBiz",
      secretKey: environment.APP_SECRET_KEY,
    };

    return data;
  }

  purchasepackagesLength;
  purchasedPackages;
  isLogoPaid: boolean = false;
  isVideoLinkPaid: boolean = false;
  isVideoLinkPaid1: boolean = false;
  isWebsiteLinkPaid: boolean = false;
  isImagesPaid: boolean = false;
  isImagesPaid1: boolean = false;
  isImagesPaid2: boolean = false;
  isImagesPaid3: boolean = false;
  isDocPaid: boolean = false;
  isDocPaid1: boolean = false;
  isImagesPaid0Arry: boolean = false;
  isImagesPaid0Arry1: boolean = false;
  imgQty;
  getMemberPackageDetails() {
    this.product.getMemberPackageDetails().then((Response: any) => {
      this.purchasepackagesLength = Response.myPackages.length;
      this.purchasedPackages = Response.myPackages;

      try {
        let imagetoweb = this.purchasedPackages.uploaD_IMAGES;
        this.imgQty = imagetoweb[0].quantity;
        if (
          imagetoweb[0] &&
          imagetoweb[0].packageDetailName === "UPLOAD_IMAGES" &&
          this.imgQty === 1
        ) {
          this.isImagesPaid = true;
        } else {
          this.isImagesPaid = false;
        }
      } catch (exp) {
        this.isImagesPaid = false;
      }
      try {
        let imagetoweb = this.purchasedPackages.uploaD_IMAGES;
        if (
          imagetoweb[0] &&
          imagetoweb[0].packageDetailName === "UPLOAD_IMAGES" &&
          this.imgQty === 2
        ) {
          this.isImagesPaid0Arry = true;
        } else {
          this.isImagesPaid0Arry = false;
        }
      } catch (exp) {
        this.isImagesPaid0Arry = false;
      }

      try {
        let linktoweb = this.purchasedPackages.linK_TO_WEBSITE;
        if (
          linktoweb[0] &&
          linktoweb[0].packageDetailName === "LINK_TO_WEBSITE"
        ) {
          this.isWebsiteLinkPaid = true;
        } else {
          this.isWebsiteLinkPaid = false;
        }
      } catch (exp) {
        this.isWebsiteLinkPaid = false;
      }
      try {
        let linktovideos = this.purchasedPackages.linK_TO_VIDEOS;
        if (
          linktovideos[0] &&
          linktovideos[0].packageDetailName === "LINK_TO_VIDEOS"
        ) {
          this.isVideoLinkPaid = true;
        } else {
          this.isVideoLinkPaid = false;
        }

        if (
          linktovideos[1] &&
          linktovideos[1].packageDetailName === "LINK_TO_VIDEOS"
        ) {
          this.isVideoLinkPaid1 = true;
        } else {
          this.isVideoLinkPaid1 = false;
        }
      } catch (exp) {
        this.isVideoLinkPaid1 = false;
      }
      try {
        let linktologo = this.purchasedPackages.uploaD_LOGO;
        if (
          linktologo[0] &&
          linktologo[0].packageDetailName === "UPLOAD_LOGO"
        ) {
          this.isLogoPaid = true;
        } else {
          this.isLogoPaid = false;
        }

        let linktodoc = this.purchasedPackages.uploaD_DOC;
        if (linktodoc[0] && linktodoc[0].packageDetailName === "UPLOAD_DOC") {
          this.isDocPaid = true;
        } else {
          this.isDocPaid = false;
        }

        if (
          (linktodoc[0] || linktodoc[1]) &&
          (linktodoc[0].packageDetailName === "UPLOAD_DOC" ||
            linktodoc[1].packageDetailName === "UPLOAD_DOC")
        ) {
          this.isDocPaid1 = true;
        } else {
          this.isDocPaid1 = false;
        }
      } catch (exp) {
        this.isLogoPaid = false;
      }
      // this.getUserSelectedPackage();
    });
  }
}
