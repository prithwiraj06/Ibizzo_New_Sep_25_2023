import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { BaseService } from "../../../../../provider/base-service/base.service";
import _ from "lodash";
import { AuthService } from "../../../pages/auth/auth.service";
import { MatDialog } from "@angular/material";
import { PartnerMemberComponent } from "../partner-member/partner-member.component";

@Component({
  selector: "kt-product-card",
  templateUrl: "./product-card.component.html",
  styleUrls: ["./product-card.component.scss"],
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;
  @Input() target: string = "_blank";
  @Input() buttonLabel: string = "More Details";
  @Input("shadow") className: string = "less";
  @Input() searchBtn: any;
  @Input() colors: any;
  @Input() type: any;
  @Input() disableImagePaidCheck: boolean = false;
  @Input() isMinisite: boolean;
  @Input() source: any = false;
  @Input() search: any;
  @Input() isCatalog: any;
  @Input() memId: any;
  @Input() isPartner: boolean;
  @Input() isNameEnable: boolean;
  @Input() isCluster: boolean;
  @Input() showImage: boolean;
  @Input() isParterMember:any=false

  buttonStyleColor: any;
  productLinkUrl: any = [];
  productLinkParams: any = {};
  paidImages: any = [];
  productImages: any = [];
  contactSupplier: boolean = false;
  memberId: any;
  companyId: number;
  isEnable: any;
  paid: any = true;
  isTrue: boolean;

  constructor(
    private base: BaseService,
    private cd: ChangeDetectorRef,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log("Product name 2", this.isNameEnable);

    this.memberId = this.auth.getUserId();
    this.companyId = this.auth.getCompanyId();
    if (!this.colors) {
      this.colors = {
        accentColor: "#CC0011",
        alternateColor: "#FFFFFF",
      };
    }

    if (this.product.priceMin == 0.0 && this.product.priceMax == 0.0) {
      this.contactSupplier = true;
    }

    this.buttonStyleColor = {
      backgroundColor: this.colors.accentColor,
      color: this.isMinisite
        ? this.invertColor(this.colors.accentColor)
        : this.colors.alternateColor,
    };
    this.className = "card " + this.className;
    // if (this.source) {
    //   this.paid = true;
    // }
    // else {
    //   if (this.product.imageSlotsPaid.length > 0) {
    //     this.paid = true;
    //   }
    //   else {
    //     this.paid = false;
    //   }
    // }
    if (this.source) {
      if (
        this.product.productImages &&
        this.product.productImages.length > 0 &&
        this.product.productImages[0].imageName
      ) {
        this.isTrue = true;
      }
    } else {
      if (
        this.product.productImages &&
        this.product.productImages.length > 0 &&
        this.product.productImages[0].imageName &&
        this.product.imageSlotsPaid.length > 0
      ) {
        this.isTrue = true;
      }
    }

    if (this.isTrue) {
      if (this.product.productImages[0].imageName.includes(",")) {
        let array = this.product.productImages[0].imageName.split(",");
        this.product.imageUrl = array[0] || null;
      } else {
        this.product.imageUrl = this.product.productImages[0].imageName;
      }
    } else if (this.product.productImage) {
      this.product.imageUrl = this.product.productImage.split(",")[0];
    } else {
      this.product.imageUrl = null;
    }

    debugger
    if (
      this.product.productImages &&
      this.product.productImages.length > 0 &&
      (this.isMinisite || this.isCatalog) &&
      (this.companyId==(this.product.supplierId
        ? this.product.supplierId
        : this.product.companyId))||this.isParterMember
    ) {
      this.product.imageSlotsPaid.length > 0
        ? (this.isEnable = false)
        : (this.isEnable = true);
    } else if (this.companyId==(this.product.supplierId
      ? this.product.supplierId
      : this.product.companyId) && this.product.productImage) {
      this.product.isSlotsPaid
        ? (this.isEnable = false)
        : (this.isEnable = true);
    }
    if (this.showImage) {
      this.isEnable = false;
    }
    this.cd.detectChanges();

    this.cd.detectChanges();
    if (this.product.productId) {
      let id = this.product.supplierId
        ? this.product.supplierId
        : this.product.companyId;
      let tId = this.type ? this.type : this.product.productType;
      let url = "t" + tId + "-c" + id;
      if (this.search) {
        url = url + "-ss";
      }
      let name = this.product.productName
        ? this.product.productName
            .replace(/[^a-zA-Z0-9_ ]/g, "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
        : this.product.category
            .replace(/[^a-zA-Z0-9_ ]/g, "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");
      let url1 = url + "/" + name;
      url1 = url1 + "-" + this.product.productId + ".html";
      this.productLinkUrl = ["/m/p/r/" + url1];
    } else {
      let url =
        this.product.supplierName
          .replace(/[^a-zA-Z0-9_ ]/g, "")
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-") +
        "-" +
        this.product.supplierId +
        ".html";
      this.productLinkUrl = ["/main/m/s/" + url];
    }
    this.cd.detectChanges();
  }

  viewImage(image) {
    if (image) {
      return this.base.getImageUrl(image, "GetDownload");
    } else {
      return "/assets/media/placeholder/product.jpg";
    }
  }

  notPaid() {}

  invertColor(hex) {
    return "#" + (Number(`0x1${hex}`) ^ 0xffffff).toString(16).toUpperCase();
  }

  openService() {
    const dialogRef = this.dialog.open(PartnerMemberComponent);
  }
}
