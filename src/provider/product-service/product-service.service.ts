import { Injectable } from "@angular/core";
import { BaseService } from "../base-service/base.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { AuthService } from "../../app/views/pages/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class ProductService extends BaseService {
  constructor(private _http: HttpClient, private auth: AuthService) {
    super(_http);
  }

  ProductQuantityType: any = [
    { id: 1, Type: "Pieces" },
    { id: 2, Type: "Kilograms" },
    { id: 3, Type: "Tonnes" },
    { id: 4, Type: "Meters" },
    { id: 5, Type: "Litres" },
    { id: 6, Type: "Feet" },
    { id: 7, Type: "Inches" },
    { id: 8, Type: "Grams" },
    { id: 9, Type: "Milligrams" },
    { id: 10, Type: "Gallon" },
    { id: 11, Type: "Hour" },
    { id: 12, Type: "Minutes" },
    { id: 13, Type: "Dozen" },
    { id: 14, Type: "Sq Feet" },
  ];

  //search the product and services
  search(searchType: any, text: string) {
    const params: any = {
      searchType: searchType,
      searchText: text,
      appKey: "IBiz",
      pageNumber: 1,
      records: 50,
    };
    return this.get("Dashboard/GetESProductService", params);
  }

  //search the product and services
  searchProducts() {
    const params: any = {
      token: this.auth.getUserId(),
      searchText: "a",
      appKey: "IBiz",
    };
    return this.get("UserProduct/GetProductCategory", params);
  }

  //search the supplier Dashboard/GetESSupplier
  searchSupplier(searchType: any, text: string) {
    const params: any = {
      // searchType: searchType,
      searchText: text,
      appKey: "IBiz",
      pageNumber: 1,
      records: 50,
    };
    return this.get("Dashboard/GetESSupplier", params);
  }

  postSuppler(options) {
    return this.post("PurchaserEnquiry/SendEnquiryToSelectedProduct", options);
  }

  getProduct(compId: any, proId: any) {
    const params: any = {
      CompanyId: compId,
      productId: proId,
      applicationKey: "IBiz",
    };
    return this.get("Dashboard/GetCompanyProductById", params);
  }

  sendEnquiry(data) {
    return this.post("PurchaserEnquiry/SendProductEnquiry", data);
  }

  getProductDetails(searchText) {
    const params: any = {
      searchText: searchText,
      appKey: "IBiz",
    };
    return this.get("UserProduct/GetAutoSuggestCategory", params);
  }

  getUserProductsByToken(token, pageNumber, records, productId?: any) {
    let params: any = {
      token: token,
      pageNumber: pageNumber,
      records: records,
    };
    if (productId) {
      params.productId = productId;
    }
    return this.get("UserProduct/GetProduct", params);
  }

  getMemberProductsByToken(token, productId?: any, records?: number) {
    let params: any = {
      token: token,
      pageNumber: 1,
      records: records ? records : 50,
      mode: "SuperAdmin",
    };
    if (productId) {
      params.productId = productId;
    }
    return this.get("UserProduct/GetProduct", params);
  }

  getUserPurchaseProductsByToken(token, pageNumber: number, records: number) {
    let params: any = {
      appId: "IBiz",
      token: token,
      pageNumber: pageNumber || 10,
      records: records || 1000,
    };
    return this.getItemsByParams(
      "PurchaserEnquiry/GetMyEnquiredProduct",
      params
    );
  }

  getMemberPurchaseProductsByToken(token) {
    let params: any = {
      Mode: "SuperAdmin",
      appId: "IBiz",
      token: token,
      pageNumber: 1,
      records: 50,
    };
    return this.getItemsByParams(
      "PurchaserEnquiry/GetMyEnquiredProduct",
      params
    );
  }

  getUserPurchaseProductForUpdate(token, productId) {
    let params: any = {
      appId: "IBiz",
      token: token,
      pageNumber: 1,
      records: 1,
      productId: productId,
    };
    return this.getItemsByParams(
      "PurchaserEnquiry/GetMyEnquiredProduct",
      params
    );
  }

  deleteProduct(token, productId, categoryId) {
    let params: any = {
      applicationKey: "IBiz",
      token: token,
      productId: productId,
      categoryId: categoryId,
    };
    return this.post("UserProduct/RemoveProduct", params);
  }

  //product category
  getProductCategoryByToken(search) {
    let params: any = {
      token: this.auth.getUserId(),
      searchText: search,
      appKey: "IBiz",
    };
    return this.get("UserProduct/GetProductCategory", params);
  }

  AddProduct(body) {
    return this.post("UserProduct/AddProduct", body);
  }

  updateProduct(body) {
    return this.post("UserProduct/UpdateProduct", body);
  }

  postPurchaseProduct(body) {
    body.applicationKey = "IBiz";
    return this.post("PurchaserEnquiry/AddPurchaserEnquiryProduct", body);
  }

  updatePurchaseProduct(body) {
    body.applicationKey = "IBiz";
    return this.post("PurchaserEnquiry/UpdatePurchaserEnquiryProduct", body);
  }

  postRfqForProduct(body) {
    let data = {
      applicationKey: "IBiz",
      data: body,
    };
    return this.post("PurchaserEnquiry/SendProductHSNEnquiry", data);
  }

  uploadImage(file) {
    var fd = new FormData();
    fd.append("file", file);
    return this.post("Upload/UploadQuoteDocumentation", fd);
  }

  uploadProductImages(file) {
    var fd = new FormData();
    fd.append("file", file);
    return this.post("Upload/UploadFile", fd);
  }

  getHsnProduct(token, hsn) {
    let param = {
      token: token,
      HSNCode: hsn,
      pageNumber: 1,
      records: 50,
    };
    return this.get("UserProduct/GetHSNProduct", param);
  }

  addProductImages(id, name, token, images) {
    let url =
      "UserProduct/AddProductImage?Token=" +
      token +
      "&ProductId=" +
      id +
      "&ProductName=" +
      name +
      "&ImageNames=" +
      images;
    return this.post(url, "");
  }

  GetProductImageAndVideo(productId) {
    let params = `productId=${productId}&token=${
      JSON.parse(localStorage.getItem("memberData")).token
    }`;
    return this.post("UserProduct/GetProductImageAndVideo?" + params, "");
  }

  getCartPackages(packId) {
    const params = {
      secretKey: environment.PACKAGE_SECRET_KEY,
      applicationKey: "IBiz",
      packageId: packId,
    };
    return this.get("Package/GetPackageDetail", params);
  }

  GetMemberCart(memberId?: any) {
    return this.post(
      "Cart/GetMemberCart",
      {},
      {
        secretKey: "B39961BD-818A-4C3F-B20C-9835B6A8E44A",
        applicationKey: "IBiz",
        token: memberId
          ? memberId
          : JSON.parse(localStorage.getItem("memberData")).token,
      }
    );
  }

  getMemberPackageDetails() {
    const params = {
      applicationKey: "IBiz",
      Token: JSON.parse(localStorage.getItem("memberData")).token,
    };
    return this.get("Package/GetMemberPackageDetail", params);
  }

  addMemberPackageDetail(data: any) {
    return this.post("Package/AddMemberPackageDetail", data);
  }

  getPackages() {
    const params = {
      secretKey: environment.PACKAGE_SECRET_KEY,
      applicationKey: "IBiz",
      packageId: 1,
    };
    return this.get("Package/GetPackageDetail", params);
  }

  get WindowRef() {
    return window;
  }

  getAutoSuggestDBProductBYText(text) {
    let query = {
      searchText: text,
      appKey: "IBiz",
    };
    return this.get("UserProduct/GetAutoSuggestDBProduct", query);
  }

  getAutoSuggestProductByText(text) {
    let query = {
      searchText: text,
      appKey: "IBiz",
    };
    return this.get("UserProduct/GetAutoSuggestProduct", query);
  }

  getAutoSuggestHsnSac(text) {
    let query = {
      searchText: text,
      appKey: "IBiz",
    };
    return this.get("UserProduct/GetAutoSuggestHsnSac", query);
  }

  getAutoSuggestDescription(text) {
    let query = {
      hsnCode: text,
      appKey: "IBiz",
    };
    return this.get("UserProduct/GetAutoSuggestDescription", query);
  }

  getUserPincodeInfo(pincode) {
    let params = {
      ApplicationKey: "IBiz",
      Token: this.auth.getUserId(),
      Pincode: pincode,
    };
    return this.post("User/GetPincodeInfo", {}, params);
  }

  searchByCategory(categoryId: any) {
    let params = {
      reportType: "DashBoard",
      memberId: "",
      categoryId: categoryId,
      orgId: 0,
      pageNumber: 1,
      records: 25,
      reportMode: "string",
    };
    return this.post("DashBoard/GetAllCategoryProducts", params, undefined);
  }

  getPendingEnquiries(token) {
    let params: any = {
      appId: "IBiz",
      token: token,
    };
    return this.get("SupplierEnquiry/GetMyEnquiryStats", params);
  }
  checkImagePaid(item) {
    console.log("pad", item);
    let params: any = {
      ProductId: item.productId,
      MemberId:this.auth.getUserId()
    };
    return this.post("UserProduct/CheckIfPaidImageExists", "", params);
  }
  getRfqHistory(productId, pageNumber, records) {
    let params: any = {
      appId: "IBiz",
      ProductId: productId,
      PageNumber: pageNumber,
      records: records?records:10,
    };
    return this.get("PurchaserEnquiry/GetRfqHistory", params);
  }
}
