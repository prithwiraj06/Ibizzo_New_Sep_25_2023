import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductService } from '../../../../../../provider/product-service/product-service.service';
import { environment } from '../../../../../../environments/environment';

import * as _ from 'underscore'
@Component({
  selector: 'kt-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  // Public properties

  // Set icon class name
  @Input() icon = 'flaticon2-shopping-cart-1';
  @Input() iconType: '' | 'brand';

  // Set true to icon as SVG or false as icon class
  @Input() useSVG: boolean;

  // Set bg image path
  @Input() bgImage: string;

  finalOrgUrl; selectedPackageForm: FormGroup; userList; packageList; totalNumberOfPhotoGraphs = []; totalNumberOfDocs = [];
  totalNumberOfVideos = []; SlNo: number = 0; logoSerNo: number = 0; imageSerNo1: number = 0;
  imageSerNo2: number = 0; imageSerNo3: number = 0; imageSerNo4: number = 0; docSerNo: number = 0;
  videoSerNo: number = 0; websiteSerNo: number = 0; cost: number = 60; costPerLinkToWebsite: number; costPerLinkToVideos: number;
  costPerToUploadLogo: number; costPerToUploadFaciImage: number; costPerToUploadDoc: number; totalPriceOfPhoto: number;
  totalPriceOfDocs: number; totalPriceOfVideos: number; totalPriceOfWebsite: number; totalPriceOfLogo: number;
  websiteDefined; logoUploaded; totalOfAllProducts; CGST: number; SGST: number; totalWithGST: number; public photograph;
  public photoDescription; public fileOrDoc; public docDescription; public linkToVid; public videoDescription;
  public linkToWeb; public websiteDescription; public logoTitle; public logoDescription; public receiptNumber;
  processingPayment: boolean; payableAmount = 0; WindowRef: any; paymentResponse: any = {}; orderId; token; response;
  razorpayResponse; showModal = false; public isDiaPopupOpened = false; PopUpMsg = ""; PopUpTitle = ''; isPaymentUnpaid: boolean = true;
  isPaymentPaid: boolean = false; totalpriceOfImages; totalPriceOfVideoLink; uploadedImages; uploadedVideoLink;
  Image1; isImageUploaded; isImageLinked: boolean = false; isVideoLinkProvided; isVideoLinked: boolean = false; Image2; Image3; Image4; Image5; totalPriceOfPhoto1; totalPriceOfPhoto2; totalPriceOfPhoto3; //totalPriceOfPhoto4;
  Doc1; Doc2; totalPriceOfDoc1: number; subLoading: boolean;
  subLoading1: boolean;
  offersList: any;
  ; totalPriceOfDoc2: number; docSerNo1; docSerNo2;
  Utube1; Utube2; productId; totalPriceOfVideos1; totalPriceOfVideos2; videoSerNo1; videoSerNo2; pckgId = 3;
  costPerImageSlot; imageService; imageServiceDescription; imageServiceId; promolst;
  cartItemsList;
  totalAmountPayable: number = 0;
  notificationNum: number = 0

  uploadedImage: any = [{
    type: 'UPLOAD_IMAGES',
    source: '/assets/media/files/jpg.svg'
  },
  {
    type: 'UPLOAD_LOGO',
    source: '/assets/media/icons/exchange.svg'
  },
  {
    type: 'UPLOAD_DOCS',
    source: '/assets/media/files/doc.svg'
  }
  ]

  public currentUser: any = null;
  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private product: ProductService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {

    this.initCart();

    this.product
      .onEvent('CART_UPDATED')
      .subscribe(() => {
        this.initCart();
      })

    this.route.queryParams.subscribe(params => {
      this.productId = params.productId;
    });

    this.selectedPackageForm = this.formBuilder.group({
    });

    this.WindowRef = this.product.WindowRef;
  }

  initCart() {
    this.currentUser = localStorage.getItem('memberData');
    if (this.currentUser != null) {
      this.token = JSON.parse(localStorage.getItem('memberData')).token;
      this.finalOrgUrl = JSON.parse(localStorage.getItem('organizationName')) || 'dashboard/business';


      this.getCartPackages();
      this.getMemberPackageDetails();
      this.getMemberCart();
    }
  }


  logoNotUploaded;
  getUserSelectedPackage() {
    this.product.GetProductImageAndVideo(this.productId)
      .then((getAll: any) => {

        this.promolst = getAll.imagesAndVideo;
        // console.log(this.packageList);
        this.uploadedImages = this.promolst.images;
        this.uploadedVideoLink = this.promolst.videoLink;

        if (this.uploadedImages > 0 && this.uploadedVideoLink > 0) {
          this.totalpriceOfImages = this.packageList[0].price * this.uploadedImages;
          //this.totalOfAllProducts =  this.totalpriceOfImages+ this.totalProceOfVideoLink;
          this.totalPriceOfVideoLink = this.packageList[1].price;
          this.isImageUploaded = 1;
          this.isImageLinked = false;
          this.isVideoLinkProvided = 1;
          this.isVideoLinked = false;
          this.selectedPackages.push({
            "packageDetailId": this.packageList[0].packageTypeId,
            "packageDetailName": this.packageList[0].name,
            "appSecretKeyPassed": environment.APP_SECRET_KEY,
            // "transationId": this.receiptNumber,
            "price": this.packageList[0].price,
            "quantity": this.uploadedImages,
            "durationType": this.packageList[0].durationType
          });
          this.selectedPackages.push({
            "packageDetailId": this.packageList[1].packageTypeId,
            "packageDetailName": this.packageList[1].name,
            "appSecretKeyPassed": environment.APP_SECRET_KEY,
            // "transationId": this.receiptNumber,
            "price": this.packageList[1].price,
            "quantity": 1,
            "durationType": this.packageList[1].durationType
          });
        } else if (this.uploadedImages > 0) {
          this.totalpriceOfImages = this.packageList[0] * this.uploadedImages;
          this.selectedPackages.push({
            "packageDetailId": this.packageList[0].packageTypeId,
            "packageDetailName": this.packageList[0].name,
            "appSecretKeyPassed": environment.APP_SECRET_KEY,
            // "transationId": this.receiptNumber,
            "price": this.packageList[0].price,
            "quantity": this.uploadedImages,
            "durationType": this.packageList[0].durationType
          });
        } else if (this.uploadedVideoLink > 0) {
          this.totalPriceOfVideoLink = this.packageList[1].price;
          this.selectedPackages.push({
            "packageDetailId": this.packageList[1].packageTypeId,
            "packageDetailName": this.packageList[1].name,
            "appSecretKeyPassed": environment.APP_SECRET_KEY,
            // "transationId": this.receiptNumber,
            "price": this.packageList[1].price,
            "quantity": 1,
            "durationType": this.packageList[1].durationType
          });
        }



        //console.log('logo '+this.totalPriceOfLogo +'2 '+ this.totalPriceOfPhoto1 + '3 '+ this.totalPriceOfPhoto2 + '4 '+this.totalPriceOfPhoto3 + '6 ' + this.totalPriceOfDoc1 +'7 '+ this.totalPriceOfDoc2 +'8 ' +this.totalPriceOfVideos1 + '9 ' +this.totalPriceOfVideos2 +'10 ' + this.totalPriceOfWebsite)
        this.totalOfAllProducts = this.totalpriceOfImages + this.totalPriceOfVideoLink;
        this.CGST = (this.totalOfAllProducts * 0) / 100;
        this.SGST = (this.totalOfAllProducts * 0) / 100;
        this.totalWithGST = this.totalOfAllProducts + this.CGST + this.SGST;
        // console.log(this.totalWithGST);
      });
  }

  getImagesServices(packageDetailName: string, fileName: string) {

    if (fileName && (['UPLOAD_IMAGES', 'UPLOAD_LOGO', 'PRODUCT_IMAGE_SLOT1', 'PRODUCT_IMAGE_SLOT2', 'PRODUCT_IMAGE_SLOT3', 'PRODUCT_IMAGE_SLOT4'].indexOf(packageDetailName) > -1)) {
      return this.product.getImageUrl(fileName);
    }

    let index = _.findIndex(this.uploadedImage, { type: packageDetailName })
    if (index > -1) {
      return this.uploadedImage[index].source;
    }
    else {
      return '/assets/media/client-logos/logo1.png'
    }

  }

  LinkToWebId;
  logoId;
  selectedPackages = [];
  packageTypeId;
  getCartPackages() {
    this.product.getCartPackages(this.pckgId)
      .then((getPackageResponse: any) => {
        //Baz Temporary Changes for Package details
        this.packageList = getPackageResponse.packageDetails;
        // console.log(this.packageList);
        this.receiptNumber = `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;

        this.packageTypeId = this.packageList[1].packageTypeId;

        if (this.packageList[0].name === 'PRODUCT_IMAGE') {
          this.costPerImageSlot = this.packageList[0].price;

          this.imageService = this.packageList[0].name;
          this.imageServiceDescription = this.packageList[0].description
          this.imageServiceId = this.packageList[0].id;
        }

        if (this.packageList[1].name === 'PRODUCT_VIDEO') {
          this.costPerLinkToVideos = this.packageList[1].price;

          this.linkToVid = this.packageList[1].name;
          this.videoDescription = this.packageList[1].description;
        }


      });
  }

  getMemberCart() {
    this.product.GetMemberCart()
      .then((getAll: any) => {
        this.cartItemsList = (getAll.cartDetail&&getAll.cartDetail.length!=0)?getAll.cartDetail:[];
        this.offersList= (getAll.offersInCart&&getAll.offersInCart.length!=0)?getAll.offersInCart:[];;
        this.notificationNum = this.offersList.length==0?this.cartItemsList.length:this.offersList.length;
        this.totalAmountPayable = getAll.grandTotalPayable;
        this.cd.detectChanges();
      }
      )
  };

  onClickRemoveCartItem(val, index) {
    // console.log(val);
  }
  returnPaymentData(response) {
    let data = {
      "token": this.token,
      "packageId": this.packageTypeId,
      "appSecretKeyPassed": environment.APP_SECRET_KEY,
      "referenceId": this.receiptNumber,
      "transationDetails": {
        "razorpay_order_id": response.razorpay_order_id,
        "razorpay_payment_id": response.razorpay_payment_id,
        "razorpay_signature": response.razorpay_signature,
        "amountPaid": this.totalAmountPayable,
        "taxAmount": 0
      },
      "packageDetails": this.cartItemsList,
      "applicationKey": "IBiz",
      "secretKey": environment.APP_SECRET_KEY
    }

    return data;
  }

  purchasepackagesLength;
  purchasedPackages;
  isLogoPaid: boolean = false;
  isVideoLinkPaid: boolean = false; isVideoLinkPaid1: boolean = false;
  isWebsiteLinkPaid: boolean = false;
  isImagesPaid: boolean = false; isImagesPaid1: boolean = false; isImagesPaid2: boolean = false;
  isImagesPaid3: boolean = false;
  isDocPaid: boolean = false; isDocPaid1: boolean = false;
  isImagesPaid0Arry: boolean = false; isImagesPaid0Arry1: boolean = false; imgQty;
  getMemberPackageDetails() {
    this.product.getMemberPackageDetails().then(
      (Response: any) => {
        this.purchasepackagesLength = Response.myPackages.length;
        this.purchasedPackages = Response.myPackages;
        // console.log(this.purchasedPackages);

        try {
          let imagetoweb = this.purchasedPackages.uploaD_IMAGES;
          this.imgQty = imagetoweb[0].quantity;
          if (imagetoweb[0] && imagetoweb[0].packageDetailName === 'UPLOAD_IMAGES' && this.imgQty === 1) {
            this.isImagesPaid = true;
          } else {
            this.isImagesPaid = false;
          }
        } catch (exp) {
          this.isImagesPaid = false;
        }
        try {
          let imagetoweb = this.purchasedPackages.uploaD_IMAGES;
          if (imagetoweb[0] && imagetoweb[0].packageDetailName === 'UPLOAD_IMAGES' && this.imgQty === 2) {
            this.isImagesPaid0Arry = true;
          } else {
            this.isImagesPaid0Arry = false;
          }
        } catch (exp) { this.isImagesPaid0Arry = false; }


        // if(imagetoweb[0] && imagetoweb[0].packageDetailName === 'UPLOAD_IMAGES' && this.imgQty === 3) {
        //   this.isImagesPaid0Arry1 = true;
        // } else {
        //   this.isImagesPaid0Arry1 = false;
        // }

        // if(imagetoweb[1] && imagetoweb[1].packageDetailName === 'UPLOAD_IMAGES') {
        //   this.isImagesPaid1 = true;
        // } else {
        //   this.isImagesPaid1 = false;
        // }

        // if(imagetoweb[2] && imagetoweb[2].packageDetailName === 'UPLOAD_IMAGES') {
        //   this.isImagesPaid2 = true;
        // } else {
        //   this.isImagesPaid2 = false;
        // }

        // if(imagetoweb[3] && imagetoweb[3].packageDetailName === 'UPLOAD_IMAGES') {
        //   this.isImagesPaid3 = true;
        // } else {
        //   this.isImagesPaid3 = false;
        // }

        try {
          let linktoweb = this.purchasedPackages.linK_TO_WEBSITE;
          if (linktoweb[0] && linktoweb[0].packageDetailName === 'LINK_TO_WEBSITE') {
            this.isWebsiteLinkPaid = true;
          } else {
            this.isWebsiteLinkPaid = false;
          }
        } catch (exp) { this.isWebsiteLinkPaid = false; }
        try {
          let linktovideos = this.purchasedPackages.linK_TO_VIDEOS;
          if (linktovideos[0] && linktovideos[0].packageDetailName === 'LINK_TO_VIDEOS') {
            this.isVideoLinkPaid = true;
          } else {
            this.isVideoLinkPaid = false;
          }

          if (linktovideos[1] && linktovideos[1].packageDetailName === 'LINK_TO_VIDEOS') {
            this.isVideoLinkPaid1 = true;
          } else {
            this.isVideoLinkPaid1 = false;
          }
        } catch (exp) { this.isVideoLinkPaid1 = false; }
        try {
          let linktologo = this.purchasedPackages.uploaD_LOGO;
          if (linktologo[0] && linktologo[0].packageDetailName === 'UPLOAD_LOGO') {
            this.isLogoPaid = true;
          } else {
            this.isLogoPaid = false;
          }

          let linktodoc = this.purchasedPackages.uploaD_DOC;
          // console.log(linktodoc);
          if (linktodoc[0] && linktodoc[0].packageDetailName === 'UPLOAD_DOC') {
            this.isDocPaid = true;
          } else {
            this.isDocPaid = false;
          }

          if ((linktodoc[0] || linktodoc[1]) && (linktodoc[0].packageDetailName === 'UPLOAD_DOC' || linktodoc[1].packageDetailName === 'UPLOAD_DOC')) {
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
