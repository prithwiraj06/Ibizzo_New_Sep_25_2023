import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MinisiteService } from "../../../../../provider/minisite/minisite.service";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import * as _ from "underscore";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { Router } from "@angular/router";
import { productData } from "../../shared-component/sales/product-data";
import { AuthService } from "../../auth/auth.service";
import { LeadsPromotesDeskComponent } from "../leads-promotes-desk/leads-promotes-desk.component";
import { MatDialog } from "@angular/material";

@Component({
  selector: "kt-minisite-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class MinisiteHomeComponent implements OnInit {
  companyInfo: any = {};
  userInfo: any = {
    aboutYourCompany: "",
  };
  companyRelatedImages: any = [];
  companyRelatedDocuments: any = [];
  companyRelatedVideos: any = [];
  productImages: any = [];
  videos: any = [];
  annualTurnOverList = productData.AnnualTurnOverList;

  //display data based on packages
  myPackages: any = {
    isLogoDisplay: false,
    isWebsiteLink: false,
    images: [false, false, false],
    videos: [false, false],
    document: [false, false],
    isPaidImage: [false, false, false],
    isPaidDoc: [false, false],
    isVideoPaid: [false, false],
  };

  //handle multiple loadings
  loading: any = {
    videoLoading: true,
    documentLoading: true,
    imageLoading: true,
    startingCheck: true,
    productImagesLoading: true,
    fragment: "company-info",
  };

  minisiteColors = {
    accentColor: "#CC0011",
    alternateColor: "#FFFFF",
  };

  heroCards: any = {
    firstVedio: "",
    firstImage: "",
  };
  source: any;
  isPaid: boolean;
  isPaidDoc: any;
  count: number = 0;
  isDocCount: any = 0;
  isVideoCount: number = 0;
  isPaidVideo: boolean;
  urlId: any;
  isSrc: boolean;
  queryParam: string;
  innerWidth: number;

  constructor(
    private service: MinisiteService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private route: Router,
    private baseUrlPipe: BaseUrlPipe,
    private auth: AuthService,
    private dialog: MatDialog
  ) {
    this.service.broadcastEvent("HEADER", null);
  }

  async ngOnInit() {
    this.service.broadcastEvent("HEADER", null);

    //fetching hash value to display respective sections
    this.activatedRoute.fragment.subscribe((fragment: string) => {
      this.loading.fragment = fragment;
      this.loading.startingCheck = true;
    });
    let currentUser = this.auth.getUserId();
    let minisiteInfo = this.activatedRoute.snapshot.params.id;

    if (minisiteInfo) {
      this.urlId = minisiteInfo;
      let arrInfo = minisiteInfo.split("-");
      let sellId = "-" + arrInfo[arrInfo.length - 1];
      this.companyInfo.sellerId = arrInfo[arrInfo.length - 1].split(".")[0];
      this.companyInfo.name = minisiteInfo.split(sellId)[0];
      this.isSrc = arrInfo[0] == "ss" ? true : false;
      this.source = currentUser == this.companyInfo.sellerId ? true : false;
      if (this.source || this.isSrc) {
        this.setElements();
      }
      await this.getDetails(this.companyInfo.sellerId);
      await this.getProductImageGallery();
    } else {
      this.activatedRoute.queryParams.subscribe(async (param) => {
        if (param) {
          this.companyInfo.name = param.companyName;
          this.companyInfo.sellerId = param.sellerId;
          this.companyInfo.orgId = param.orgId;
          this.source = currentUser == this.companyInfo.sellerId ? true : false;
          if (this.source) {
            this.setElements();
          }
          await this.getDetails(this.companyInfo.sellerId);
          await this.getProductImageGallery();
        }
      });
    }
    let memberData = this.auth.getCurrentUser();
    this.innerWidth = window.innerWidth;
    if (!memberData&&this.innerWidth>425) {
      setTimeout(() => {
        this.openDialog()
      }, 5000);
    }
    this.service.broadcastEvent("HEADER", null);
    this.service.broadcastEvent("HEADER", null);
    this.service.broadcastEvent("HEADER", null);

    this.cd.detectChanges();
  }

  setElements() {
    let currentUser = this.auth.getUserId();
    if (currentUser) {
      this.source = true;
      this.myPackages.images[0] = true;
      this.myPackages.images[1] = true;
      this.myPackages.images[2] = true;
      this.myPackages.document[0] = true;
      this.myPackages.document[1] = true;
      this.myPackages.videos[0] = true;
      this.myPackages.videos[1] = true;

      this.isPaid = true;
      this.isPaidVideo = true;
      this.myPackages.isLogoDisplay = true;
      this.myPackages.isPaidImage[0] = true;
      this.myPackages.isPaidImage[1] = true;
      this.myPackages.isPaidImage[2] = true;
      this.myPackages.isPaidDoc[0] = true;
      this.myPackages.isPaidDoc[1] = true;
      this.myPackages.isVideoPaid[0] = true;
      this.myPackages.isVideoPaid[1] = true;
      this.cd.detectChanges();
    }
  }

  openDialog() {
    this.dialog.open(LeadsPromotesDeskComponent, {
      width: "400px",
      disableClose: true,
    });
  }

  //goto respective sections
  ngAfterViewChecked() {
    if (this.loading.startingCheck) {
      var ele = document.getElementById(this.loading.fragment);
      if (ele) {
        ele.scrollIntoView({ behavior: "smooth" });
        let time = setInterval(() => {
          this.loading.startingCheck = false;
          clearInterval(time);
        }, 500);
      }
    }
  }
  gotoContactUs() {
    this.route.navigate(
      [this.baseUrlPipe.transform(["/m/h/" + this.queryParam])],
      { fragment: "Contact-Us" }
    );
  }
  async getDetails(id) {
    if (id) {
      try {
        //get user details
        let res: any = await this.service.getUserDetailsByCompanyId(id);
        if (res.userDetails) {
          this.userInfo = res.userDetails;
          this.queryParam =
            this.userInfo.companyName
              .replace(/[^a-zA-Z0-9_ ]/g, "")
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "-") +
            "-" +
            this.userInfo.id +
            ".html";
          console.log(
            "data",
            this.userInfo.accentColor,
            this.userInfo.alternateColor
          );
          if (
            this.userInfo &&
            this.userInfo.accentColor &&
            this.userInfo.accentColor != null &&
            this.userInfo.accentColor != "#FFFFFF"
          ) {
            this.minisiteColors.accentColor = this.userInfo.accentColor;
          }

          if (
            this.userInfo &&
            this.userInfo.alternateColor &&
            this.userInfo.alternateColor != null &&
            this.userInfo.alternateColor != "#FFFFFF"
          ) {
            this.minisiteColors.alternateColor = this.userInfo.alternateColor;
          }
          console.log(
            "It default setting #FFFFFF so we are setting to default color red",
            this.minisiteColors
          );
          localStorage.setItem(
            "MINISITE_COLORS_" + id,
            JSON.stringify(this.minisiteColors)
          );
          console.log("color", this.minisiteColors);
          this.service.broadcastEvent("MINISITE_RENDER", this.minisiteColors);

          //get array of company related images;
          if (
            this.userInfo.companyImages.length > 0 &&
            this.userInfo.companyImages[0].imageName
          ) {
            this.companyRelatedImages = this.getArrayOfItems(
              this.userInfo.companyImages[0].imageName
            );
            this.heroCards.firstImage = this.companyRelatedImages[0];
          }

          //get array of company related vedioes;
          if (
            this.userInfo.companyVideos.length > 0 &&
            this.userInfo.companyVideos[0].videoUrl
          ) {
            this.companyRelatedVideos = this.getArrayOfItems(
              this.userInfo.companyVideos[0].videoUrl
            );
            await this.getVedioesLink();
          }

          //get array of company related documents;
          if (
            this.userInfo.companyDocuments.length > 0 &&
            this.userInfo.companyDocuments[0].documentName != null
          ) {
            let doc = this.userInfo.companyDocuments[0].documentName.split(",");
            if (doc.length > 1) {
              _.each(doc, (item) => {
                this.companyRelatedDocuments.push(encodeURIComponent(item));
              });
            } else {
              this.companyRelatedDocuments.push(encodeURIComponent(doc[0]));
            }
          }

          //get member package details
          await this.getMemberPackageDetails(id);

          this.loadingFalse();
        } else {
          this.loadingFalse();
        }
      } catch (e) {
        this.loadingFalse();
      }
    }
  }

  async getMemberPackageDetails(id) {
    try {
      let res: any = await this.service.getPackageDetailsById(id);
      let packageDetails = res.myPackages || [];
      if (packageDetails.length > 0) {
        packageDetails.forEach((key: any) => {
          //CHECK: Website link
          if (key.packageDetailName === "LINK_TO_WEBSITE") {
            this.myPackages.isWebsiteLink = true;
          }

          //CHECK: Company Logo
          if (key.packageDetailName === "UPLOAD_LOGO") {
            this.myPackages.isLogoDisplay = true;
          }

          //CHECK: Company images
          if (key.packageDetailName === "UPLOAD_IMAGES") {
            //case 1: while upload images one by one;

            if (key.quantity == 1) {
              if (this.myPackages.images[0]) {
                this.myPackages.images[1] = true;
              } else {
                this.myPackages.images[0] = true;
              }

              if (this.myPackages.images[1]) {
                this.myPackages.images[2] = true;
              }
              this.isPaid = false;
              if (this.count == 0) {
                this.myPackages.isPaidImage[0] = false;
              } else {
                this.myPackages.isPaidImage[this.count] = false;
              }
              this.count = this.count + 1;
              this.cd.detectChanges();
            }

            //case 2: Upload images Two at a time
            if (key.quantity == 2) {
              //case 1: if quantity is 2 then check for first image if its already payment then true for secound and third image
              if (this.myPackages.images[0]) {
                this.myPackages.images[1] = true;
                this.myPackages.images[2] = true;
              }

              //case 1: case 1 failes: then true for first and secound image
              else {
                this.myPackages.images[0] = true;
                this.myPackages.images[1] = true;
              }
              this.isPaid = false;
              if (this.count == 0) {
                this.myPackages.isPaidImage[0] = false;
                this.myPackages.isPaidImage[1] = false;
              } else {
                this.myPackages.isPaidImage[1] = false;
                this.myPackages.isPaidImage[2] = false;
              }
              this.cd.detectChanges();
            }

            //case 3: Uplaod Three images at a time
            if (key.quantity >= 3) {
              this.isPaid = false;
              this.myPackages.images[0] = true;
              this.myPackages.images[1] = true;
              this.myPackages.images[2] = true;
              this.myPackages.isPaidImage[0] = false;
              this.myPackages.isPaidImage[1] = false;
              this.myPackages.isPaidImage[2] = false;
              this.cd.detectChanges();
            }
            console.log("pImages", this.myPackages.isPaidImage);
            this.cd.detectChanges();
          }

          //CHECK: Company Videos
          if (key.packageDetailName === "LINK_TO_VIDEOS") {
            //case 1: Upload video one at a time
            if (key.quantity == 1) {
              if (this.myPackages.videos[0]) {
                this.myPackages.videos[1] = true;
              } else {
                this.myPackages.videos[0] = true;
              }
              this.isPaidVideo = false;
              if (this.isVideoCount == 0) {
                this.myPackages.isVideoPaid[this.isVideoCount] = false;
              } else {
                this.myPackages.isVideoPaid[this.isVideoCount] = false;
              }
              this.isVideoCount = this.isVideoCount + 1;
            }

            //case 1: Upload video Two at a time
            if (key.quantity >= 2) {
              this.myPackages.videos[0] = true;
              this.myPackages.videos[1] = true;
              this.isPaidVideo = false;
              this.myPackages.isVideoPaid[0] = false;
              this.myPackages.isVideoPaid[1] = false;
            }
          }

          //CHECK: Company Documents
          if (key.packageDetailName === "UPLOAD_DOCS") {
            //case 1: Upload document One at a time
            if (key.quantity == 1) {
              this.myPackages.document[0] = true;
              if (this.isDocCount == 0) {
                this.myPackages.isPaidDoc[this.isDocCount] = false;
              } else {
                this.myPackages.isPaidDoc[this.isDocCount] = false;
              }
              this.isDocCount = this.isDocCount + 1;
            }

            //case 1: Upload document Two at a time
            if (key.quantity >= 2) {
              this.myPackages.document[0] = true;
              this.myPackages.document[1] = true;
              this.myPackages.isPaidDoc[0] = false;
              this.myPackages.isPaidDoc[1] = false;
            }
          }
        });
      }
    } catch (e) {}
  }

  //Display documents,images and viedo based on packages
  checkPaymentIsDone(key, i) {
    if (this.myPackages[key][i]) {
      return true;
    }
    return false;
  }

  //Checking First Payment is done later items
  displayNoItemCard(array, key) {
    if (this.myPackages[key][0]) {
      if (array.length > 0) {
        return true;
      }
      return false;
    }
    return false;
  }

  async getProductImageGallery() {
    if (this.userInfo && this.userInfo.companyId) {
      try {
        //get images
        let res: any = await this.service.getCompanyProductImages(
          this.userInfo.companyId
        );
        if (res.userProducts) {
          this.productImages = res.userProducts;
          this.cd.detectChanges();
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  loadingFalse() {
    this.loading.documentLoading = false;
    this.loading.imageLoading = false;
    this.loading.videoLoading = false;
    this.loading.productImagesLoading = false;
    this.cd.detectChanges();
  }

  getArrayOfItems(images) {
    if (images) {
      return images.split(",");
    }
  }

  getVedioById(video) {
    let str = video.split("?")[1] || "";
    let data = str.split("=");
    let index = data.indexOf("v");
    return index > -1 ? data[index + 1] : undefined;
  }

  //fetching vedioes
  getVedioesLink() {
    this.companyRelatedVideos.forEach((key) => {
      if (key) {
        let id = this.getVedioById(key);
        let video = this.sanitizer.bypassSecurityTrustResourceUrl(
          "https://www.youtube.com/embed/" + id + "?showinfo=0&rel=0"
        );
        this.videos.push({ video: video, id: id });
      }
    });

    if (this.videos.length > 0 && this.videos[0].video) {
      this.heroCards.firstVedio = this.videos && this.videos[0].video;
    }
  }

  //dynamic display hero card
  fetchHeroCard(item, key, i?: any) {
    if (item) {
      this.heroCards[key] = item;
      if ("firstVedio" == key) {
        this.isPaidVideo = this.myPackages.isVideoPaid[i];
      } else {
        this.isPaid = this.myPackages.isPaidImage[i];
      }
    }
  }

  getAnnualRevenue() {
    let index = _.findIndex(this.annualTurnOverList, {
      value: this.userInfo.annualTurnover,
    });
    if (index > -1) {
      return this.annualTurnOverList[index].text;
    }
  }

  getDocName(doc: any) {
    let file = doc.includes("%23~%23") ? doc.split("%23~%23")[1] : doc;
    return file.includes("%20") ? file.replace(/%20/g, " ") : file;
  }

  viewImage(image) {
    let url = this.service.getImageUrl(image, "GetDownload");
    window.open(url, "blank");
  }

  downloadDoc(file) {
    return this.service.getImageUrl(file, "GetCompanyDocumentDownload");
  }

  getImage(image) {
    return this.service.getImageUrl(image, "GetDownload");
  }

  gotoSalesCatalogue() {
    this.route.navigate([this.baseUrlPipe.transform(["/m/s/" + this.urlId])]);
  }
}
