import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ProductService } from "../../../../../provider/product-service/product-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "underscore";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material";
import { EmailComponent } from "../../auth/login-page/email/email.component";
import { DomSanitizer } from "@angular/platform-browser";
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { AuthService } from "../../../../views/pages/auth/auth.service";
import { SimilarSupplierComponent } from "../../shared-component/similar-supplier/similar-supplier.component";

@Component({
  selector: "kt-request-for-quote",
  templateUrl: "./rfq.component.html",
  styleUrls: ["./rfq.component.scss"],
})
export class RfqComponent implements OnInit {
  productDetails: any;
  unitList: any;
  option: number = 0;
  checked: number = 1;
  images: any;
  imageContent: any = [];
  imageSource: any = [];
  salescatlogForm: FormGroup;
  form: any;
  invalidInput: boolean;
  unitInvalid: boolean;
  loading: boolean;
  authenticate: string = "";
  videoUrl: boolean;
  myHsn: string = "";
  videoLink: any;
  memberData: any;
  type: any;
  loadingData: boolean;
  contactSupplier: boolean = false;
  source: any;
  enquiryId: any;
  constructor(
    private product: ProductService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer //use in video bypassSecurityTrustResourceUrl
  ) {}

  ngOnInit() {
    let compId;
    let productId;
    this.loadingData = true;
    this.cd.detectChanges();
    this.memberData = this.authService.getCurrentUser();
    this.createForm();
    this.unitList = this.product.ProductQuantityType;
    let urlInfo = this.route.snapshot.params;
    console.log(urlInfo);
    if (urlInfo) {
      let arrId1 = urlInfo.id1.split("-");
      let arrId2 = urlInfo.id2.split("-");
      this.type = arrId1[0] == "t1" ? 1 : 2;
      compId = arrId1[1].split("c")[1];
      this.source = arrId1.length == 3 ? true : false;
      productId = arrId2[arrId2.length - 1].split(".")[0];
      console.log(productId);
    } else {
      this.route.queryParams.subscribe((params) => {
        this.type = params.type;
        this.source = params.source ? params.source : "";
        compId = params.compId;
        productId = params.productId;
      });
    }

    this.product
      .getProduct(compId, productId)
      .then((res: any) => {
        this.productDetails = res.userProduct || "";
        this.myHsn = this.productDetails.hsn;
        if (
          this.productDetails.priceMin == 0.0 &&
          this.productDetails.priceMax == 0.0
        ) {
          this.contactSupplier = true;
        }
        if (this.productDetails.productType == 2) {
          this.salescatlogForm.patchValue({
            quantity: 1,
            unit: 1,
          });
        }

        if (this.productDetails && !this.source) {
          if (
            this.productDetails.productImages &&
            this.productDetails.productImages[0] &&
            this.productDetails.imageSlotsPaid.length != 0
          ) {
            let paidImageLength = this.productDetails.imageSlotsPaid.length;
            this.images = this.getImages(
              this.productDetails.productImages[0].imageName.split(",")[0]
            );
            this.imageContent = this.productDetails.productImages[0].imageName.split(
              ","
            );
            _.each(this.imageContent, (item: any, i: any) => {
              if (paidImageLength > i) {
                let data = this.getImages(item);
                this.imageSource.push(data);
              } else {
                let data =
                  "../../../../../../../assets/images/Product-Detail-No-Image.png";
                this.imageSource.push(data);
              }
            });

            if (
              this.productDetails.videoLink &&
              this.productDetails.videoLink.length != 0
            ) {
              let image = "https://img.youtube.com/vi//0.jpg?";
              this.imageSource.push(image);
            }
            this.cd.detectChanges();
          }
        } else if (this.productDetails && this.source) {
          if (
            this.productDetails.productImages &&
            this.productDetails.productImages[0]
          ) {
            this.images = this.getImages(
              this.productDetails.productImages[0].imageName.split(",")[0]
            );
            this.imageContent = this.productDetails.productImages[0].imageName.split(
              ","
            );
            _.each(this.imageContent, (item: any, i: any) => {
              let data = this.getImages(item);
              this.imageSource.push(data);
            });

            if (
              this.productDetails.videoLink &&
              this.productDetails.videoLink.length != 0
            ) {
              let image = "https://img.youtube.com/vi//0.jpg?";
              this.imageSource.push(image);
            }
            this.cd.detectChanges();
          }
        } else {
          this.images =
            "../../../../../../../assets/images/Product-Detail-No-Image.png";
        }
        this.loadingData = false;
        this.cd.detectChanges();
      })
      .catch(() => {
        this.loadingData = false;
        this.toastr.error("Fetching records is failed");
      });

    if (this.type == 2) {
      this.salescatlogForm.controls.unit.setValue(1);
      this.salescatlogForm.controls.quantity.setValue(1);
    }
  }

  setImage(image: any, index?: any) {
    let data = image.includes("youtube");
    if (data) {
      this.videoUrl = true;
      let url = this.productDetails.videoLink.split("=")[1];
      this.images = url
        ? "https://www.youtube.com/embed/" + url
        : this.productDetails.videoLink;
      this.cd.detectChanges();
    } else {
      this.videoUrl = false;
      this.images = image;
      this.cd.detectChanges();
    }
  }

  createForm() {
    let form: any = {
      quantity: ["", Validators.compose([Validators.required])],
      unit: [0, Validators.compose([Validators.required])],
      enquiry: "",
      multiUser: true,
      imageId: "",
      supplierId: "",
    };
    this.salescatlogForm = this.fb.group(form);
  }

  async submit() {
    this.unitInvalid =
      this.salescatlogForm.controls.unit.value != 0 ? false : true;
    this.invalidInput = this.salescatlogForm.controls.quantity.value
      ? false
      : true;
    if (
      this.salescatlogForm.invalid ||
      !(this.salescatlogForm.controls.unit.value != 0)
    ) {
      return false;
    }
    let rfqData = {
      productId: this.productDetails.productId,
      quantity: this.salescatlogForm.controls.quantity.value.toString(),
      quantityType: this.salescatlogForm.controls.unit.value,
      purchaserQuery: this.salescatlogForm.controls.enquiry.value,
      getQuoteFromAll: this.salescatlogForm.controls.multiUser.value,
      shareContact: false,
    };
    localStorage.setItem("previousRfq", JSON.stringify(rfqData));
    this.loading = true;
    let check =
      this.type == 2
        ? true
        : this.salescatlogForm.controls.quantity.value >=
          parseInt(this.productDetails.moq);
    if (check) {
      if (!JSON.parse(localStorage.getItem("memberData"))) {
        try {
          this.authenticate =
            "rethis.salescatlogForm.controls.quantity.value >= parseInt(this.productDetails.moq)gistred";
          await this.authentication();
        } catch (err) {
          // this.toastr.error("Fail to send the RFQ request! try again");
          console.log(err);
          this.loading = false;
          this.cd.detectChanges();
          return;
        }
      }
      if (!JSON.parse(localStorage.getItem("memberData"))) {
        this.loading = false;
        this.cd.detectChanges();
        return false;
      }
      let _data = {
        applicationKey: "IBiz",
        data: {
          memberId: JSON.parse(localStorage.getItem("memberData"))
            .memberUserInfo.id,
          productId: this.productDetails.productId,
          quantity:
            this.type == 2
              ? 0
              : this.salescatlogForm.controls.quantity.value.toString(),
          quantityType:
            this.type == 2 ? 0 : this.salescatlogForm.controls.unit.value,
          purchaserQuery: this.salescatlogForm.controls.enquiry.value,
          getQuoteFromAll: this.salescatlogForm.controls.multiUser.value,
          searchName: JSON.parse(localStorage.getItem("searchText")),
          shareContact: false,
        },
      };

      this.product
        .sendEnquiry(_data)
        .then((res: any) => {
          this.toastr.success("Successfuly sent the RFQ request");
          localStorage.removeItem("previousRfq");
          const _title: string = "Success";
          const _description: string = "Your Request has been posted.";
          const _cancelText: string = "Similar Products";
          const submit: string = "Cancel";
          const textOne: string = "Get Quotes For Similar Products";
          const textTwo: string = "Click on similar products to view the list.";
          this.enquiryId = res.enquiryId;
          const dialogRef = this.layoutUtilsService.ActionElement(
            _title,
            _description,
            _cancelText,
            submit,
            textOne,
            textTwo
          );
          this.loading = false;
          this.cd.detectChanges();
          dialogRef.afterClosed().subscribe(async (res) => {
            if ((res || {}).searchHsn) {
              this.hsnProductSearch();
            } else {
              this.router.navigateByUrl("/main/pages/home");
            }
          });
          // this.salescatlogForm.controls.quantity.reset();
          // this.salescatlogForm.controls.unit.setValue(0);
          // this.salescatlogForm.controls.enquiry.reset();
          // // this.salescatlogForm.controls.multiUser.reset();
          // this.salescatlogForm.controls.supplierId.reset();
          // this.loading = false;
          // setTimeout(() => {
          //   this.authenticate ? window.location.reload() : ''
          // }, 3000)
        })
        .catch((err: any) => {
          this.toastr.error("Fail to send the RFQ request! try again");
          console.log(err);
          this.loading = false;
        });
    } else {
      this.toastr.error(
        "Quantity must be equal or greater than Minimum Order Quantity"
      );
      this.invalidInput = true;
      this.loading = false;
      this.cd.detectChanges();
      return false;
    }
  }

  changeUnit(unit?: any) {
    this.unitInvalid =
      this.salescatlogForm.controls.unit.value != 0 ? false : true;
  }

  changeQuantity(event) {
    this.invalidInput = parseInt(event.target.value) ? false : true;
  }

  getImages(item) {
    return this.product.getImageUrl(item);
  }

  authentication() {
    return new Promise((resolve, rejects) => {
      const dialogRef = this.dialog.open(EmailComponent, {
        width: "450px",
        data: "isRFQ",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          localStorage.removeItem("previousRfq");
          rejects();
          return;
        }
        resolve();
      });
    });
  }
  async hsnProductSearch() {
    try {
      let response: any = await this.product.getHsnProduct(
        this.authService.getUserId(),
        this.myHsn
      );
      if (response.userProducts.length == 0) {
        const _title: string = "Success";
        const _description: string = "Similar Suppliers";
        const _cancelText: string = "Cancel";
        const submit: string = "";
        const textOne: string = "Sorry there is no match found";
        const textTwo: string =
          "Are you looking for any other Products? Please click on RFQ.";
        const dialogRef = this.layoutUtilsService.ActionElement(
          _title,
          _description,
          _cancelText,
          submit,
          textOne,
          textTwo
        );
        dialogRef.afterClosed().subscribe(async (res) => {
          if ((res || {}).resetForm) {
            this.salescatlogForm.controls.quantity.reset();
            this.salescatlogForm.controls.unit.setValue(0);
            this.salescatlogForm.controls.enquiry.reset();
            // this.salescatlogForm.controls.multiUser.reset();
            this.salescatlogForm.controls.supplierId.reset();
          } else {
            this.router.navigateByUrl("/main/pages/home");
          }
        });
      } else {
        let supplers = {
          user: response,
          id: this.enquiryId,
          quantity:
            this.type == 2
              ? 0
              : this.salescatlogForm.controls.quantity.value.toString(),
          quantityType:
            this.type == 2 ? 0 : this.salescatlogForm.controls.unit.value,
        };
        const dialogRef = this.dialog.open(SimilarSupplierComponent, {
          disableClose: true,
          data: supplers,
        });
        dialogRef.afterClosed().subscribe((res) => {
          if (!res) {
            return;
          }
        });
      }
    } catch (e) {
      this.toastr.error("Sorry there is no match found");
      this.router.navigateByUrl("/main/pages/home");
      console.log(e);
    }
  }
}
