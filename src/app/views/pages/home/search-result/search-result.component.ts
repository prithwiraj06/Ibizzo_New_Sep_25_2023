import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../../../../provider/product-service/product-service.service";
import { environment } from "../../../../../environments/environment";
import { ToastrService } from "ngx-toastr";
import * as _ from "underscore";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "kt-search-result",
  templateUrl: "./search-result.component.html",
  styleUrls: ["./search-result.component.scss"],
})
export class SearchResultComponent implements OnInit {
  searchItem: any = {
    text: '',
    type: ''
  };
  organizations: any = [];
  products: any = [];
  product: boolean;
  btnName: any;
  buttonLabel: any;
  urlSafe:any
  items: boolean = false;
  url: string = environment.SEO_URL+"/search-item/";

  constructor(
    private route: ActivatedRoute,
    private itemSearch: ProductService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    public sanitizer: DomSanitizer

  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let url = this.route.snapshot.params.id;
      if (url) {
        let arr = url.split("-");
        this.searchItem.type = arr[0].split("t")[1];
        this.searchItem.text = arr[arr.length - 1].split(".")[0];
        this.products = [];
        // this.getData();
        
        this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url+this.searchItem.text+'.html');
        this.cd.detectChanges();
      }
    });
  }

  getData() {
    this.items = true;
    if (this.searchItem.type == "3") {
      this.items = true;
      this.buttonLabel = "View Profile";
      this.getSupplierData();
    } else {
      this.itemSearch
        .search(this.searchItem.type, this.searchItem.text)
        .then((res: any) => {
          this.buttonLabel = "Request for Quote";
          this.items = true;
          this.organizations = res.data;

          this.product = true;
          // if (this.organizations.length != 0) {
          //   _.each(this.organizations, (item) => {
          //     let price = item.priceMin ? item.priceMin + " - " + item.priceMax : 0;
          //     let image = item.productImage ? item.productImage.split(",")[0] : '';
          //     let obj = {
          //       'title': item.productName,
          //       'price': price,
          //       'seller': item.supplierName,
          //       companyId: item.supplierId,
          //       productId: item.productId,
          //       rating: item.rating,
          //       image: image,
          //       type: this.searchItem.type
          //     }
          //     this.products.push(obj);
          //   })
          //   this.toastr.success("Listing the search results");
          //   this.items = false;

          // }
          // else {
          //   this.toastr.error("No records for search", null, {
          //     timeOut: 5000
          //   });
          //   this.items = false;

          // }
          this.items = false;
          this.cd.detectChanges();
        })
        .catch((err: any) => {
          if (this.organizations.length == 0 && err) {
            this.toastr.error("Fail to fetching recods! try again..", null, {
              timeOut: 5000,
            });
          }
          this.items = false;
        });
    }
  }

  getSupplierData() {
    this.itemSearch
      .searchSupplier(this.searchItem.type, this.searchItem.text)
      .then((res: any) => {
        this.items = true;
        this.organizations = res.data;
        this.product = false;

        if (this.organizations.length != 0) {
          _.each(this.organizations, (item) => {
            let price = item.priceMin
              ? item.priceMin + " - " + item.priceMax
              : 0;
            let image = item.productImage
              ? item.productImage.split(",")[0]
              : "";
            let obj = {
              supplierName: item.supplierName,
              location: item.location,
              category: item.category,
              companyId: item.supplierId,
              companyName: item.supplierName,
              rating: item.rating,
              image: item.image,
            };
            this.products.push(obj);
          });
          this.toastr.success("Listing the search results");
          this.items = false;
        } else {
          this.toastr.error("No records for search", null, {
            timeOut: 5000,
          });
          this.items = false;
        }
        this.cd.detectChanges();
      })
      .catch((err: any) => {
        if (this.organizations.length == 0 && err) {
          this.toastr.error("Fail to fetching recods! try again..", null, {
            timeOut: 5000,
          });
        }
        this.items = false;
      });
  }

  getImage(image: any) {
    return (
      environment.API_URL +
      "Upload/GetDownload?filename=" +
      image.split(",")[0]
    );
  }
}
