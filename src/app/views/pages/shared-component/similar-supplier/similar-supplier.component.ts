import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import {
  MatTableDataSource,
  MatPaginator,
  MatDialog,
  MatSort,
} from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import * as _ from "underscore";
import { ToastrService } from "ngx-toastr";
import { ProductService } from "../../../../../provider/product-service/product-service.service";
import { AuthService } from "../../auth/auth.service";
import { Router } from "@angular/router";
import { BaseUrlPipe } from "../../../../../app/core/_base/layout/pipes/base-url";

@Component({
  selector: "kt-similar-supplier",
  templateUrl: "./similar-supplier.component.html",
  styleUrls: ["./similar-supplier.component.scss"],
})
export class SimilarSupplierComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("sort1", { static: true }) sort: MatSort;
  displayedColumns: any = ["id", "name", "checkbox", "action"];

  suppliers: any = [];
  dataSource: any = [];
  products: any = [];
  selection: any = [];
  loading: boolean;
  constructor(
    public dialogRef: MatDialogRef<SimilarSupplierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private product: ProductService,
    private auth: AuthService,
    private router: Router,
    private baseUrlPipe: BaseUrlPipe
  ) {}

  ngOnInit() {
    console.log(this.data.user);
    debugger;
    this.suppliers = this.data.user.userProducts;
    _.each(this.suppliers, (item) => {
      item = { checked: false };
    });
    this.dataSource = new MatTableDataSource<any>(this.suppliers);
    this.selection = new SelectionModel<any>(true, []);
    console.log("selec", this.selection);
  }

  supplerMembers(element, event, i) {
    if (event.checked) {
      this.products.push(element.productId);
      element.checked = !element.checked;
    } else {
      this.products.splice(i, 1);
      element.checked = !element.checked;
    }
    console.log(this.products);
  }

  selctedUser(element, i) {
    let index = -1;
    _.each(this.products, (item, i) => {
      if (item == element.productId) {
        index = i;
        return;
      }
    });
    if (index >= 0) {
      this.products.splice(index, 1);
    } else {
      this.products.push(element.productId);
    }
    console.log(this.products);
    this.selection.toggle(element);
  }
  highlight(element: any) {
    element.highlighted = !element.highlighted;
  }

  isAllSelected() {
    console.log("selection", this.selection);
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.clear() : this.select();
  }

  select() {
    this.products = [];
    this.dataSource.data.forEach((row) => this.selection.select(row));
    this.dataSource.data.forEach((row) => this.products.push(row.productId));
    console.log(this.products);
  }

  clear() {
    this.selection.clear();
    this.products = [];
    console.log(this.products);
  }

  async submit() {
    if (this.products.length != 0) {
      this.loading = true;
      let options = {
        memberId: this.auth.getUserId(),
        enquiryId: this.data.id,
        productIds: this.products,
        applicationKey: "IBiz",
        quantity: this.data.quantity,
        quantityType: this.data.quantityType,
      };
      try {
        let res: any = await this.product.postSuppler(options);
        console.log(res);
        if (res.isEnquirySent) {
          this.loading = false;
          this.toastr.success("Enquiries sent successfully");
          this.dialogRef.close();
          if (this.data && this.data.from) {
            this.router.navigate([
              this.baseUrlPipe.transform(["/dashboard/business/home"]),
            ]);
          } else {
            this.router.navigateByUrl("/main/pages/home");
          }
        } else {
          this.loading = false;
          this.toastr.error("Failed to sent Enquiry");
        }
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    } else {
      this.toastr.error("Select the Suppliers!");
    }
  }
}
