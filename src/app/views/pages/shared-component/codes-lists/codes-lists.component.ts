import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ChangeDetectorRef,
  Inject,
} from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { ProductService } from "../../../../../provider/product-service/product-service.service";
import Swal from "sweetalert2";
import { SuperadminService } from "../../../../../provider/superadmin/superadmin.service";

import {
  MatTableDataSource,
  MatPaginator,
  MatDialogRef,
  MatSort,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material";
import { ToastrService } from "ngx-toastr";
import _ from "lodash";
import { SystemBusinessCategoryListComponent } from "../system-business-category-list/system-business-category-list.component";

@Component({
  selector: "kt-codes-lists",
  templateUrl: "./codes-lists.component.html",
  styleUrls: ["./codes-lists.component.scss"],
})
export class CodesListsComponent implements OnInit {
  serachList: boolean;
  option: any;
  token: any;
  searchText: any;
  sortContent = {
    sortKey: "",
    sortOrder: "",
  };
  pageNumber: number = 0;
  records: number = 10;
  fetching: boolean = true;
  isDefault: boolean = true;
  @Input() type: string;
  @Input() searchData: string;
  @Input() unspcCode: any;
  @Input() systemCategory: any;
  dataSource: any = [];
  displayedColumns: any = ["#"];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("sort1", { static: true }) sort: MatSort;
  constructor(
    private authService: AuthService,
    private service: ProductService,
    private cd: ChangeDetectorRef,
    private superAdmin: SuperadminService,
    public dialogRef: MatDialogRef<CodesListsComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    console.log("unspsc", this.unspcCode, "sys", this.systemCategory);

    this.token = 171268;
    if (this.type == "unspsc") {
      this.displayedColumns.push("name", "unspsc", "action");
      this.getUnspscList(this.pageNumber, this.records, {});
    } else if (this.type == "hsn") {
      this.displayedColumns.push("hsnDescription", "hsnCode", "actionHsn");
      await this.getHsnList(this.pageNumber, this.records);
    } else if (this.type == "custom-business") {
      this.displayedColumns.push("name", "usedBy", "actionCustom");
      this.getCustomBusinessCategoryList(this.pageNumber, this.records, {});
    } else if (this.type == "existing-business") {
      if (this.data.isComponent == "system-business") {
        this.displayedColumns.push(
          "category_unspsc_name",
          "isActive",
          "actionExisting1"
        );
      } else {
        this.displayedColumns.push("category_unspsc_name", "isActive");
      }
      this.getExistingBusinessCategoryList(this.pageNumber, this.records);
    } else if (this.type == "custom-product") {
      this.displayedColumns.push("name", "usedBy", "actionCustomProduct");
      this.getCustomProductCatgoryList(this.pageNumber, this.records);
    } else {
      if (this.data.isComponent == "product") {
        this.displayedColumns.push("name", "isActive", "action2");
      } else {
        this.displayedColumns.push("name", "isActive");
      }
      this.getCategoryList(this.pageNumber, this.records);
    }
    if (this.searchData) {
      this.searchText = this.searchData;
      this.search(this.isDefault);
      this.cd.detectChanges();
    } else if (this.unspcCode) {
      this.searchText = this.unspcCode;
      console.log("searc", this.searchText);

      this.search(this.isDefault);
      this.cd.detectChanges();
    } else if (this.systemCategory) {
      let temp: any = await this.superAdmin.getProductCategoryDetails(
        this.systemCategory
      );
      this.searchText = temp.productCategoryList[0].name;
      this.search(this.isDefault);
      this.cd.detectChanges();
    }
  }
  async getUnspscList(pageNumber, records, sarchType?: any) {
    try {
      let param = {
        searchText: this.searchText || "",
        sortKey: (sarchType && sarchType.sortKey) || "",
        sortOrder: (sarchType && sarchType.sortOrder) || "",
        pageNumber: pageNumber,
        records: records,
      };
      let data: any = await this.superAdmin.getUnspscProductList(param);
      this.setDataTable(data.unspcList);
      this.cd.detectChanges();
    } catch (e) {
      console.log("Failed to fetch the data", e);
      this.fetching = false;
    }
  }
  async getHsnList(pageNumber, records, sarchType?: any) {
    try {
      let data: any = await this.superAdmin.getHsnList(
        pageNumber,
        records,
        this.searchText || ""
      );
      this.cd.detectChanges();
      this.setDataTable(data.hsnListDetails);
      console.log("res", data);
    } catch (e) {
      console.log("Failed to fetch the data", e);
      this.fetching = false;
    }
  }
  async getCategoryList(pageNumber, records) {
    try {
      let data: any = await this.superAdmin.getProductCategoryList(
        pageNumber,
        records
      );
      this.cd.detectChanges();
      this.setDataTable(data.productCategorys);
      console.log("data", data);
    } catch (e) {
      console.log("Failed to fetch the data");
      this.fetching = false;
    }
  }
  async getCustomBusinessCategoryList(pageNumber, records, param?: any) {
    try {
      let details = {
        pageNumber: pageNumber,
        records: records,
        searchText: param.searchText || "",
        sortKey: param.sortKey || "",
        sortOrder: param.sortOrder || "",
      };
      let data: any = await this.superAdmin.getCustomBussinessCatagory(details);
      this.cd.detectChanges();
      this.setDataTable(data.businessProductList);
    } catch (e) {
      console.log("Failed to fetch the data");
      this.fetching = false;
    }
  }
  async getExistingBusinessCategoryList(pageNumber, records) {
    try {
      let data: any = await this.superAdmin.getExistingBussinessCatagory(
        pageNumber,
        records
      );
      this.cd.detectChanges();
      this.setDataTable(data.bussinessCategoryList);
    } catch (e) {
      console.log("Failed to fetch the data");
      this.fetching = false;
    }
  }
  async getCustomProductCatgoryList(pageNumber, records) {
    try {
      let data: any = await this.superAdmin.getCustomProductCategoryList(
        pageNumber,
        records
      );
      this.cd.detectChanges();
      console.log("data", data);
      this.setDataTable(data.customProductList);
    } catch (e) {
      console.log("Failed to fetch the data");
      this.fetching = false;
    }
  }
  getDescriptionTitle() {
    if (this.type == "unspsc") {
      return "UNSPSC Description";
    } else if (this.type == "hsn") {
      return "Product/Service description";
    } else {
      return "Product/Service description";
    }
  }
  setDataTable(data) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.hasData = data.length > 0 ? true : false;
    this.fetching = false;
    this.cd.detectChanges();
  }
  pageChangeEvent(event) {
    this.fetching = true;
    this.pageNumber = this.paginator.pageIndex * this.paginator.pageSize + 1;
    this.records = (this.paginator.pageIndex + 1) * this.paginator.pageSize;

    if (this.sortContent.sortKey) {
      this.sortData(this.pageNumber, this.records);
      this.cd.detectChanges();
    } else {
      if (this.type == "unspsc") {
        this.getUnspscList(this.pageNumber, this.records);
      } else if (this.type == "hsn") {
        this.getHsnList(this.pageNumber, this.records);
      } else if (this.type == "custom-product") {
        this.getCustomProductCatgoryList(this.pageNumber, this.records);
      } else if (this.type == "existing-business") {
        this.pageNumber =
          this.paginator.pageIndex * this.paginator.pageSize + 1;
        this.records = this.paginator.pageSize;
        this.getExistingBusinessCategoryList(this.pageNumber, this.records);
      } else if (this.type == "custom-business") {
        this.getCustomBusinessCategoryList(this.pageNumber, this.records, {});
      } else {
        this.getCategoryList(this.pageNumber, this.records);
      }
    }
  }

  enableAndDisable(element: any) {
    console.log(element);
  }
  async search(isDefault?: any) {
    if (this.type == "hsn") {
      this.paginator.pageIndex = 0;
      let res: any = await this.superAdmin.getHsnList(
        0,
        isDefault ? 10 : this.paginator.pageSize,
        this.searchText
      );
      if (res) {
        console.log("res", res);
        this.setDataTable(res.hsnListDetails);
        this.cd.detectChanges();
      }
    } else if (this.type == "existing-product-category") {
      this.paginator.pageIndex = 0;
      let res: any = await this.superAdmin.getProductCategoryList(
        0,
        isDefault ? 10 : this.paginator.pageSize,
        this.searchText
      );
      if (res) {
        this.setDataTable(res.productCategorys);
        this.cd.detectChanges();
      }
    } else if (this.type == "custom-product") {
      this.paginator.pageIndex = 0;
      let res: any = await this.superAdmin.getCustomProductCategoryList(
        0,
        this.paginator.pageSize,
        this.searchText
      );
      if (res) {
        this.setDataTable(res.customProductList);
      }
    } else if (this.type == "unspsc") {
      let search = {
        searchText: this.searchText,
      };
      this.getUnspscList(0, isDefault ? 10 : this.paginator.pageSize, search);
    } else if (this.type == "existing-business") {
      this.paginator.pageIndex = 0;
      let res: any = await this.superAdmin.getExistingBussinessCatagory(
        0,
        isDefault ? 10 : this.paginator.pageSize,
        this.searchText
      );
      if (res) {
        this.setDataTable(res.bussinessCategoryList);
      }
    } else if (this.type == "custom-business") {
      let search = {
        searchText: this.searchText,
      };
      this.getCustomBusinessCategoryList(0, this.paginator.pageSize, search);
    }
  }

  getTitle() {
    if (this.type == "unspsc") {
      return "UNSPSC LIST";
    } else if (this.type == "hsn") {
      return "HSN LIST";
    } else if (this.type == "custom-business") {
      return "Custom Business Category List";
    } else if (this.type == "existing-business") {
      return "System Business Category List";
    } else if (this.type == "custom-product") {
      return "Custom Product Category List";
    } else {
      return "System Product Category List";
    }
  }

  async AddCustomProduct(element) {
    let param = {
      category_unspsc_code: "string",
      category_unspsc_name: element.name,
      type: "string",
      suggest: {
        input: ["string"],
        contexts: {
          parent_category: "string",
        },
      },
    };
    let res: any = await this.superAdmin.addCustomProductCatagory(param);
    console.log(res);
    if (res.result == "created") {
      this.toastr.success("Custom Catagory is add");
      this.search();
    } else {
      this.toastr.error("Custom Catagory is not added");
    }
  }

  selectUnspsc(event) {
    console.log(event);
    this.dialogRef.close(event);
  }

  selectedHSN(event) {
    console.log(event);
    this.dialogRef.close(event);
  }

  selectProductCatagory(event) {
    this.dialogRef.close(event);
  }
  async sortData(pageNumber, records, event?) {
    console.log("data", event);
    try {
      if (event) {
        this.sortContent.sortOrder = event.direction.toUpperCase();
        this.sortContent.sortKey = event.active;
      }
      if (this.type == "hsn") {
        try {
          let res: any = await this.superAdmin.getHsnList(
            pageNumber,
            records,
            "",
            this.sortContent.sortKey,
            this.sortContent.sortOrder
          );
          this.setDataTable(res.hsnListDetails);
        } catch {}
      } else if (this.type == "unspsc") {
        try {
          let search = {
            sortOrder: this.sortContent.sortOrder,
            sortKey: this.sortContent.sortKey,
          };
          let res: any = await this.getUnspscList(pageNumber, records, search);
          this.setDataTable(res.hsnListDetails);
        } catch {}
      } else if (this.type == "existing-product-category") {
        try {
          let res: any = await this.superAdmin.getProductCategoryList(
            pageNumber,
            records,
            "",
            this.sortContent.sortKey,
            this.sortContent.sortOrder
          );
          this.setDataTable(res.productCategorys);
        } catch {}
      } else if (this.type == "custom-product") {
        try {
          let res: any = await this.superAdmin.getCustomProductCategoryList(
            pageNumber,
            records,
            "",
            this.sortContent.sortKey,
            this.sortContent.sortOrder
          );
          this.setDataTable(res.customProductList);
        } catch {}
      } else if (this.type == "existing-business") {
        let data: any = await this.superAdmin.getExistingBussinessCatagory(
          pageNumber,
          records,
          "",
          this.sortContent.sortKey,
          this.sortContent.sortOrder.toLowerCase()
        );
        this.cd.detectChanges();
        this.setDataTable(data.bussinessCategoryList);
      } else if (this.type == "custom-business") {
        let search = {
          sortOrder: this.sortContent.sortOrder,
          sortKey: this.sortContent.sortKey,
        };
        let index = this.paginator.pageIndex * this.paginator.pageSize + 1;
        this.getCustomBusinessCategoryList(
          index,
          this.paginator.pageSize,
          search
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  async updateSytemProductAndUpdateSytemBusiness(element) {
    console.log("element", element);
    if (element.categoryId) {
      let option = {
        name: encodeURIComponent(element.name),
        isEnabled: element.isActive == 0 ? true : false,
      };

      let res: any = await this.superAdmin.updateSystemPC(
        option,
        "EnableDisableProductCategory"
      );
      if (res.message == "Update successfull") {
        this.toastr.success("Successfully Updated");
        this.getCategoryList(this.pageNumber, this.records);
      } else {
        this.toastr.error("Failed to Update List");
        this.getCategoryList(this.pageNumber, this.records);
      }
    } else {
      console.log("element", element);

      let option = {
        name: encodeURIComponent(element._source.category_unspsc_name),
        isEnabled: element._source.isActive == 0 ? true : false,
      };

      let res: any = await this.superAdmin.updateSystemPC(
        option,
        "EnableDisableBusinessCategory"
      );
      if (res.updated == 1) {
        this.toastr.success("Successfully Updated");
        this.getExistingBusinessCategoryList(this.pageNumber, this.records);
      } else {
        this.toastr.error("Failed to Update List");
        this.getExistingBusinessCategoryList(this.pageNumber, this.records);
      }
    }
  }

  // async updateSytemBusiness(element) {
  //   let option = {
  //     name: encodeURIComponent(element._source.category_unspsc_name),
  //     isEnabled: element._source.isActive == 0 ? true : false,
  //   };

  //   let res: any = await this.superAdmin.updateSystemPC(
  //     option,
  //     "EnableDisableBusinessCategory"
  //   );
  //   if (res.updated == 1) {
  //     this.toastr.success("Successfully Updated");
  //     this.getExistingBusinessCategoryList(this.pageNumber, this.records, );
  //   } else {
  //     this.toastr.error("Failed to Update List");
  //     this.getExistingBusinessCategoryList(this.pageNumber, this.records, );
  //   }
  // }

  getStyle(element) {
    if (element && element._source) {
      return element._source.isActive == 0 ? "bg-dark" : "bg-white";
    } else {
      return element.isActive == 0 ? "bg-dark" : "bg-white";
    }
  }

  async addCustomBC(event) {
    let res: any = await this.superAdmin.addCustomBC(event.name);
    if (res.message == "Created Successfully") {
      this.toastr.success(res.message);
      this.getCustomProductCatgoryList(this.pageNumber, this.records);
    } else {
      this.toastr.error(res.message);
    }
  }

  async selectProductCatalogue(event) {
    const dialogRef = this.dialog.open(SystemBusinessCategoryListComponent, {
      data: { isComponent: "system-business" },
    });
    dialogRef.afterClosed().subscribe(async (res) => {
      if (!res) {
        return;
      }
      let param = {
        categoryName: event.name,
        systemLinkName: res._source.category_unspsc_name,
      };
      let result: any = await this.superAdmin.updateLinkedSystemCategoryNameIntoMemberCategory(
        param
      );
      if (result.message == "Updated Successfully") {
        this.toastr.success(result.message);
      } else {
        this.toastr.error(result.message);
      }
    });
  }
}
