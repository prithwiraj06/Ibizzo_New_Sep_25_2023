import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { PartnerService } from "../../../../../provider/partner/partner.service";

@Component({
  selector: "kt-partner-products",
  templateUrl: "./partner-products.component.html",
  styleUrls: ["./partner-products.component.scss"],
})
export class PartnerProductsComponent implements OnInit {
  loadingProduct: boolean;
  listOfProduct: any = [];
  finalArrayProduct: any = [];
  firstArrayProduct: any = [];
  secondArrayProduct: any = [];
  thirdArrayProduct: any = [];
  fourthArrayProduct: any = [];
  indexValue: any = 1;
  pageSize: any = 12;
  productLinkUrl: string[];

  constructor(private partner: PartnerService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.getPartnerProduct(this.indexValue, this.pageSize);
  }
  async getPartnerProduct(indexValue, pageSize) {
    this.loadingProduct = true;
    try {
      let data = {
        partnerId: this.partner.getCurrentPartnerId(),
        pageNumber: indexValue,
        records: pageSize,
      };
      let res: any = await this.partner.getPartnerProductList(data);
      this.loadingProduct = false;
      this.cd.detectChanges();
      if (res.userProducts) {
        res.userProducts.forEach((element) => {
          this.listOfProduct.push(element);
        });

        this.finalArrayProduct = await this.splitArray(this.listOfProduct);
        this.firstArrayProduct = this.finalArrayProduct[0];
        this.secondArrayProduct = this.finalArrayProduct[1];
        this.thirdArrayProduct = this.finalArrayProduct[2];
        this.fourthArrayProduct = this.finalArrayProduct[3];
      } else if (res.message == "Error in Processing the Report") {
        this.loadingProduct = false;
        this.cd.detectChanges();
      }
    } catch (err) {
      this.loadingProduct = false;
      console.log(err);
    }
  }
  splitArray(items) {
    let n: any,
      result = [],
      wordsPerLine: any;

    n = 4;
    result = [[], [], [], []];
    wordsPerLine = Math.ceil(items.length / 4);

    for (let line = 0; line < n; line++) {
      for (let i = 0; i < wordsPerLine; i++) {
        const value = items[i + line * wordsPerLine];
        if (!value) continue; //avoid adding "undefined" values
        result[line].push(value);
      }
    }
    return result;
  }
  scrollDown(event, type) {
    console.log("Starting", event);
    if (event) {
      this.indexValue = this.indexValue + 12;
      this.pageSize = this.pageSize + 12;
      this.getPartnerProduct(this.indexValue, this.pageSize);
      this.cd.detectChanges();
    }
    console.log("End", this.indexValue, this.pageSize);
  }
  viewImage(item) {
    if (item.productImages.length > 0) {
      let splitImage = item.productImages[0].imageName.split(",");
      return this.partner.getImageUrl(splitImage[0], "GetDownload");
    } else {
      return "/assets/media/placeholder/product.jpg";
    }
  }
  getUrl(product) {
    if (product.productId) {
      let id = product.supplierid ? product.supplierid : product.companyId;
      let tId = product.productType;
      let url = "t" + tId + "-c" + id;
      let name = product.productName?product.productName
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-"):'';

      let url1 = url + "/" + name;
      url1 = url1 + "-" + product.productId + ".html";
      this.productLinkUrl = ["/m/p/r/" + url1];
      return this.productLinkUrl;
    } else {
      let url =
        product.supplierName
          .replace(/[^a-zA-Z0-9_ ]/g, "")
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-") +
        "-" +
        product.supplierId +
        ".html";
      this.productLinkUrl = ["/main/m/s/" + url];
    }
  }
}
