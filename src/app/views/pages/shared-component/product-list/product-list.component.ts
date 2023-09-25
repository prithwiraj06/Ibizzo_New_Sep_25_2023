import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { MatTableDataSource, MatPaginator, MatDialog } from "@angular/material";
import { LayoutUtilsService } from "../../../../core/_base/crud";
import { ProductService } from "../../../../../provider/product-service/product-service.service";
import { ToastrService } from "ngx-toastr";
import * as _ from "underscore";
import { Router, ActivatedRoute } from "@angular/router";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { TellBuyersComponent } from "../../dashboard/business/tell-buyers/tell-buyers.component";
import { ProductHistoryComponent } from "../../dashboard/business/product-history/product-history.component";
import { PurchseHistoryComponent } from "../../shared-component/purchse-history/purchse-history.component";

import Swal from "sweetalert2";

@Component({
  selector: "kt-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  //properties
  @Input() title: string = "";
  @Input() data: any = [];
  @Input() token: string = "";
  @Input() isPending: boolean;
  @Input() addMemberApi: boolean = false;
  @Output() product = new EventEmitter<boolean>();
  @Input() partner: boolean = false;
  pageNumber: number = 1;
  records: number = 8;
  dataSource: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: any = ["#", "products"];
  @Input() isMember: boolean = false;
  fetching: boolean = true;

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router,
    private baseUrlPipe: BaseUrlPipe,
    private dialog: MatDialog,
    private activateRouter: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.title == "sales") {
      if (this.partner) {
        this.displayedColumns.push("supplyDetails", "description", "action");
      } else {
        this.displayedColumns.push(
          "supplyDetails",
          "description",
          "history",
          "buyers",
          "action"
        );
      }
      this.getAllProducts(this.pageNumber, this.records);
    } else {
      if (this.partner) {
        this.displayedColumns.push("action");
      } else {
        this.displayedColumns.push("seller", "history", "action");
      }
      this.getAllPurchaseProducts(this.pageNumber, this.records);
    }
    console.log("ispending", this.isPending);
  }

  //set table
  setTable(data) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.hasData = data.length > 0 ? true : false;
    this.fetching = false;
    this.cd.detectChanges();
  }

  async getAllProducts(pageNumber, records) {
    try {
      if (
        (this.isMember || this.isPending) &&
        !window.location.href.includes("business/profile")
      ) {
        let res: any = await this.productService.getMemberProductsByToken(
          this.token
        );
        this.setTable(res.userProducts);
      } else {
        let res: any = await this.productService.getUserProductsByToken(
          this.token,
          pageNumber,
          records
        );
        this.setTable(res.userProducts);
      }
    } catch (e) {
      console.log(e);
      this.fetching = false;
      this.cd.detectChanges();
    }
  }

  async getAllPurchaseProducts(pageNumber, records) {
    try {
      if (
        (this.isMember || this.isPending) &&
        !window.location.href.includes("business/profile")
      ) {
        let res: any = await this.productService.getMemberPurchaseProductsByToken(
          this.token
        );
        if (res.purchaserEnquiryData) {
          this.setTable(res.purchaserEnquiryData);
          this.cd.detectChanges();
        }
      } else {
        let res: any = await this.productService.getUserPurchaseProductsByToken(
          this.token,
          pageNumber,
          records
        );
        if (res.purchaserEnquiryData) {
          this.setTable(res.purchaserEnquiryData);
        }
      }
    } catch (e) {
      console.log(e);
      this.fetching = false;
      this.cd.detectChanges();
    }
  }

  pageChangeEvent(event) {
    this.fetching = true;
    if (event.pageSize == 8) {
      this.pageNumber = event.pageIndex * 8 + 1;
    } else if (event.pageSize == 16) {
      this.pageNumber = event.pageIndex * 16 + 1;
    } else if (event.pageSize == 24) {
      this.pageNumber = event.pageIndex * 24 + 1;
    }
    this.records = (event.pageIndex + 1) * event.pageSize;

    if (this.title == "sales") {
      this.getAllProducts(this.pageNumber, this.records);
    } else {
      this.getAllPurchaseProducts(this.pageNumber, this.records);
    }
  }

  //delete for sale product
  delete(item) {
    const _waitDesciption: string = "Deleting...";
    const _title: string = "Confirm";
    const _description: string = "Are you sure you want to delete the product.";
    const dialogRef = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDesciption
    );
    dialogRef.afterClosed().subscribe(async (res) => {
      if (!res) {
        return;
      }
      this.fetching = true;
      try {
        let res: any = await this.productService.deleteProduct(
          this.token,
          item.productId,
          item.categoryId
        );
        if (res.isRemoveProduct) {
          this.toastr.success("Product is deleted successfully");
          this.getAllProducts(this.pageNumber, this.records);
        } else {
          this.toastr.error("Product delete failed");
        }
      } catch (e) {
        this.toastr.error("Something went wrong Please try again later");
      }
    });
  }

  deleteSuceessModal() {
    const _title: string = "Success";
    const _description: string = "Product is Deleted.";
    const _cancelText: string = "Ok";
    const _submitText: string = "Pay Now/Cart";

    const dialogRef = this.layoutUtilsService.ActionElement(
      _title,
      _description,
      _cancelText,
      _submitText
    );
    dialogRef.afterClosed().subscribe(async (res) => {
      if (!res) {
        return;
      }
      this.router.navigateByUrl("dashboard/subscriptions");
    });
  }

  emitFunc(element) {
    this.product.emit(element);
  }

  navigateToRfq(item) {
    localStorage.setItem("RFQ_PRODUCT_" + item.productId, JSON.stringify(item));
    this.router.navigate(
      [this.baseUrlPipe.transform(["dashboard/business/quote"])],
      { queryParams: { id: item.productId } }
    );
  }

  //tell buyers about product
  async tellBuyersOrSeller(item, type) {
    let paid: any;
    if (item.noOfBuyers == 0 || item.noOfSellers == 0) {
      this.toastr.error("This product dont have potential buyers");
      return;
    }
    paid = await this.productService.checkImagePaid(item);
    if (paid == 1) {
      item.type = type;
      const dialogRef = this.dialog.open(TellBuyersComponent, {
        width: "550",
        data: item,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (!result) {
          return;
        }
      });
    } else if (paid == 0) {
      this.sweetAlert();
    }
  }

  //history
  openProductFlyers(item) {
    if (this.title == "sales") {
      item.type = 1;
    } else {
      item.type = 2;
    }
    item.title = this.title;
    console.log("title", this.title);
    if (this.title == "sales") {
      const dialogRef = this.dialog.open(ProductHistoryComponent, {
        data: item,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (!result) {
          return;
        }
      });
    } else {
      this.openPurchseHistory(item);
    }
  }
  openPurchseHistory(item) {
    const dialogRef = this.dialog.open(PurchseHistoryComponent, {
      data: item,
      width: "550px",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
    });
  }

  sweetAlert() {
    Swal.fire({
      title: "Pay for Product/Service images to send offers",
      icon: "warning",
    }).then(() => {});
  }
}
