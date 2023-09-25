import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { ProductService } from "../../../../../../provider/product-service/product-service.service";

@Component({
  selector: "kt-purchase-product-list",
  templateUrl: "./purchase-list.component.html",
  styleUrls: ["./purchase-list.component.scss"],
})
export class PurchaseListComponent implements OnInit {
  editProduct: any = undefined;
  productCategoryList: any = [];
  @Input() token: string = "";
  @Input() isMember: boolean = false;
  @Input() isPending: boolean;
  @Input() addUserMemberProfile: boolean;
  purchaseProducts: any = [];
  @Input() addMemberApi: boolean = false;
  @Output() isAddMemberApi = new EventEmitter<any>();
  @Input() partner: boolean = false;

  action: any = {
    viewRequiremts: true,
    addNewRequiremts: false,
    edit: false,
  };

  constructor(private service: ProductService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    //product details
    this.getProductCategory();
  }

  addNewRequiremts() {
    this.action.addNewRequiremts = true;
    this.action.viewRequiremts = false;
    this.action.edit = false;
  }

  refreshElement(event) {
    if (event.refresh) {
      // this.getAllPurchaseProducts();
    }
    this.viewRequiremts();
  }

  memberEventHandle(event) {
    this.isAddMemberApi.emit({
      addMemberApi: event.memberAdded,
      profile: event.profile,
    });
  }

  viewRequiremts() {
    this.action.addNewRequiremts = false;
    this.action.viewRequiremts = true;
    this.action.edit = false;
  }

  editElement(event) {
    this.editProduct = event;
    this.action.addNewRequiremts = false;
    this.action.viewRequiremts = false;
    this.action.edit = true;
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
}
