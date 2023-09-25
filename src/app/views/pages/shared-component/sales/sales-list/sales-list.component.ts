import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { ProductService } from "../../../../../../provider/product-service/product-service.service";
import { SalesEditComponent } from "../sales-edit/sales-edit.component";

@Component({
  selector: "kt-sales-product-list",
  templateUrl: "./sales-list.component.html",
  styleUrls: ["./sales-list.component.scss"],
})
export class SalesListComponent implements OnInit {
  editProduct: any = undefined;
  @Input() partner: boolean = false;
  @Input() token: string = "";
  @Input() isMember: boolean = false;
  @Input() isPending: boolean;
  @Input() addMemberApi: boolean = false;
  @Input() addUserMemberProfile: boolean;
  @Output() isAddMemberApi = new EventEmitter<any>();
  @ViewChild("addNewProductRef", { static: false })
  addNewProductRef: SalesEditComponent;
  products: any = [];
  action: any = {
    viewProducts: true,
    addNewProduct: false,
    edit: false,
  };
  productCategoryList: any = [];

  constructor(private service: ProductService, private cd: ChangeDetectorRef) {
    service.onEvent("SALES-LIST").subscribe(() => {
      console.log("Sales-list");
      this.viewProducts();
      this.getProductCategory();
    });
  }

  async ngOnInit() {
    console.log("initializ");
    await this.getProductCategory();
    // this.getAllProducts();
  }

  //get all sales product
  // async getAllProducts() {
  //   try {
  //     this.products.item = false;
  //     if (this.isMember) {
  //       let res: any = await this.service.getMemberProductsByToken(this.token);
  //       if (res.userProducts) {
  //         this.products = res.userProducts;
  //         this.cd.detectChanges();
  //       }
  //     } else {
  //       let res: any = await this.service.getUserProductsByToken(this.token);
  //       if (res.userProducts) {
  //         this.products = res.userProducts;
  //         this.cd.detectChanges();
  //       }
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   this.products.item = true;
  //   this.cd.detectChanges();
  // }

  viewProducts() {
    this.action.viewProducts = true;
    this.action.addNewProduct = false;
    this.action.edit = false;
    this.cd.detectChanges();
  }

  addNewProduct() {
    this.action.addNewProduct = true;
    this.action.viewProducts = false;
    this.action.edit = false;
  }

  editElement(event) {
    this.editProduct = event;
    this.action.addNewProduct = false;
    this.action.viewProducts = false;
    this.action.edit = true;
  }

  memberEventHandle(event) {
    this.isAddMemberApi.emit({
      addMemberApi: event.memberAdded,
      profile: event.profile,
    });
  }

  //product category
  async getProductCategory() {
    try {
      let res: any = await this.service.getProductCategoryByToken(this.token);
      if (res.productCategorys) {
        this.productCategoryList = res.productCategorys;
      }
    } catch (e) {
      console.log(e);
    }
  }

  refreshElement(event) {
    if (event.refresh) {
      // this.getAllProducts();
    }
    this.viewProducts();
  }

  submit() {
    this.addNewProductRef.submit();
  }
}
