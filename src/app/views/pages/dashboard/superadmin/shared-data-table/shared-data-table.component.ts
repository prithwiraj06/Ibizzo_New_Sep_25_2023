import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatDialog,
  MatSort,
} from "@angular/material";
import { ProductService } from "../../../../../../provider/product-service/product-service.service";
import * as _ from "underscore";
import { HsnListComponent } from "../hsn-list/hsn-list.component";
import { UnspscCodesListComponent } from "../unspsc-codes-list/unspsc-codes-list.component";
import { ProductCategoryListComponent } from "../product-category-list/product-category-list.component";
import { CustomProductCategoryListComponent } from "../custom-product-category-list/custom-product-category-list.component";
import { SuperadminService } from "../../../../../../provider/superadmin/superadmin.service";
import { ToastrService } from "ngx-toastr";
import { ProductCatagoryTableComponent } from "../../../shared-component/product-catagory-table/product-catagory-table.component";

@Component({
  selector: "kt-shared-data-table",
  templateUrl: "./shared-data-table.component.html",
  styleUrls: ["./shared-data-table.component.scss"],
})
export class SharedDataTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("sort1", { static: true }) sort: MatSort;
  displayedColumns: any = [];
  @Input() columns: any;
  @Input() component: any;
  dataSource: any = [];
  systemProductList: any = [];
  systemItem: any = [];
  loading: boolean;
  params: any = {
    searchText: "",
    sortKey: "",
    sortOrder: "",
    pageNumber: 0,
    records: 10,
    showOnlyDuplicates: false,
  };

  updateList: any = {
    id: "",
    type: "",
    value: "",
  };
  noRecords: boolean;
  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private productList: SuperadminService,
    private cd: ChangeDetectorRef,
    private toasr: ToastrService
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.displayedColumns = this.columns;

    if (!(this.component == "unspsc")) {
      this.userList();
    } else {
      this.listProducts();
    }
  }

  handleDuplicate(element, event) {
    console.log(element, event);
    this.params.showOnlyDuplicates = event.checked;
    this.userList();
  }

  async userList() {
    this.dataSource = [];
    this.loading = true;
    this.cd.detectChanges();
    let res: any = await this.productList.getUserProductList(this.params);
    this.noRecords = res.customProductList.length == 0 ? true : false;
    this.setDatasource(res.customProductList);
  }

  pageChangeEvent() {
    this.loading = true;
    this.cd.detectChanges();

    if (this.component == "unspsc") {
      this.params.pageNumber = this.paginator.pageIndex + 1;
      this.params.records = this.paginator.pageSize;
      this.listProducts();
    } else if (this.component == "user") {
      this.params.pageNumber =
        this.paginator.pageIndex * this.paginator.pageSize + 1;
      this.params.records =
        (this.paginator.pageIndex + 1) * this.paginator.pageSize;
      this.userList();
    }
  }

  async listProducts() {
    this.dataSource = [];
    this.loading = true;
    this.cd.detectChanges();
    let res: any = await this.productList.getUnspscProductList(this.params);
    console.log(res);
    this.setDatasource(res.unspcList);
  }

  sortData(event) {
    console.log(event);
    this.params.sortKey = event.active;
    this.params.sortOrder = event.direction ? event.direction : "";
    this.loading = true;
    if (!event.direction) {
      return;
    }
    if (this.component == "unspsc") {
      this.listProducts();
    } else if (this.component == "user") {
      this.userList();
    }
  }

  searchContent(key, type) {
    this.cd.detectChanges();
    if (type == "unspsc") {
      this.params.searchText = key;
      this.paginator.pageIndex = 0;
      this.params.pageNumber = 0;
      this.params.records = 10;
      this.listProducts();
    } else if (type == "user") {
      this.params.searchText = key;
      this.paginator.pageIndex = 0;
      this.params.pageNumber = 0;
      this.params.records = 10;
      this.userList();
    }
  }

  setDatasource(res) {
    this.dataSource = new MatTableDataSource<any>(res);
    this.dataSource.sort = this.sort;
    this.loading = false;
    this.cd.detectChanges();
  }

  getProCatalogue(event, index) {
    return event.categoriesList.split(";;")[index].length != 0;
  }

  getCatagory(event, index) {
    return event.categoriesList.split(";;")[index];
  }

  async updateUserTaxonomy() {
    this.systemProductList = [];
    let res: any = await this.productList.updateTaxonomy(this.updateList);
    console.log(res);
    if (res.message == "Update successfull") {
      this.toasr.success("Updated successfully");
      if (!(this.component == "unspsc")) {
        this.userList();
      } else {
        this.listProducts();
      }
    } else {
      this.toasr.error("Failed to update");
    }
  }

  async selectHSN(event) {
    console.log("hsn", event);
    const dialogRef = this.dialog.open(HsnListComponent, {
      data: { isComponent: "hsn", hsnCode: event.hsnCode },
    });
    dialogRef.afterClosed().subscribe(async (res) => {
      if (!res) {
        return;
      }
      if (this.component == "unspsc") {
        console.log(event._source.product_unspsc_code);
        console.log(res.hsnCode);
        let option = {
          unspscId: event._source.product_unspsc_code,
          hsnCode: res.hsnCode,
        };
        if (option) {
          let res: any = await this.productList.updateHSNUNSPSC(option);
          if (res.message == "Updated successfully") {
            this.dataSource = [];
            this.loading = true;
            this.cd.detectChanges();
            this.toasr.success("Updated successfully");
            this.listProducts();
          } else {
            this.toasr.error(res.message);
          }
        }
      } else {
        this.updateList.id = event.productIdList;
        this.updateList.type = "HSNSAC";
        this.updateList.value = res.hsnCode;
        this.updateUserTaxonomy();
      }
    });
  }

  selectUNSPSC(event) {
    console.log("event", event);
    const dialogRef = this.dialog.open(UnspscCodesListComponent, {
      data: {
        isComponent: "unspsc",
        unspcCode: event.unspcCode != 0 ? event.unspcCode : "",
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      console.log(res);
      this.updateList.id = event.productIdList;
      this.updateList.type = "UNSBSCProductCode";
      this.updateList.value = res._source.product_unspsc_code;
      this.updateUserTaxonomy();
    });
  }

  selectProductCatalogue(event) {
    console.log("event", event);
    const dialogRef = this.dialog.open(ProductCategoryListComponent, {
      data: {
        isComponent: "product",
        systemCategory: event.systemCategoryName,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      console.log(res);
      let product = "";
      if (this.systemProductList.length != 0) {
        _.each(this.systemProductList, (item, i) => {
          if (this.systemProductList.length - 1 != i) {
            product += item.productIdList + ",";
          } else {
            product += item.productIdList;
          }
        });
      }
      this.updateList.id = product ? product : event.productIdList;
      this.updateList.type = "SystemCategoryId";
      this.updateList.value = res.categoryId;
      this.updateUserTaxonomy();
    });
  }

  selectCustomProductCatalogue(ids) {
    const dialogRef = this.dialog.open(ProductCatagoryTableComponent, {
      data: ids,
      width: "500px",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      console.log(res);
      this.updateList.id;
    });
  }

  //Checkbox
  handleInviteMember(element, event) {
    console.log(element, event);
    if (event.checked) {
      this.systemProductList.push(element);
    } else {
      let index = _.findIndex(this.systemProductList, {
        productIdList: element.productIdList,
      });
      this.systemProductList.splice(index, 1);
    }
    console.log(this.systemProductList);
  }
  getProductName(element) {
    console.log("element", element);
    return element.productName || element.productName == ""
      ? element.productName
      : element._source.product_unspsc_name;
  }
}
