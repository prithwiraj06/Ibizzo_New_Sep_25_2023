import { Injectable } from "@angular/core";
import { BaseService } from "../base-service/base.service";
import { HttpClient } from "@angular/common/http";
import { ReturnStatement } from "@angular/compiler";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SuperadminService extends BaseService {
  constructor(private _http: HttpClient) {
    super(_http);
  }
  getAllPartnerRequest(pageNumber, records, token) {
    let params: any = {
      applicationKey: "IBiz",
      pageNumber: pageNumber,
      records: records,
      token: token,
    };
    return this.post("PartnerUser/GetAllPartnerRequest", params);
  }
  approvedCart(param) {
    return this.post("Cart/CartSnapShotAction", "", param);
  }

  reviseList(page) {
    let params = {
      secretKey: environment.CARTSNAP_SECRET_KEY,
      applicationKey: "IBiz",
      Page: page.index,
      NoOfRecs: page.pageSize,
    };
    return this.post("Cart/GetUpdatedPaymentList", "", params);
  }

  getUploadedDocByMem(id) {
    let param = {
      applicationKey:'IBiz',
      MemberId: id,
    };
    return this.get("Package/GetAllVerifyDocForUser", param);
  }

  verifyDocBySup(id) {
    let param = {
      applicationKey:'IBiz',
      MemberId: id,
      status:true
    };
    return this.get("Package/UpdateVerifyStatus", param);
  }


  getProductCategoryDetails(id) {
    let param = {
      ids: id,
    };
    return this.get("UserProduct/GetProductCategoryDetails", param);
  }

  updateTaxonomy(param) {
    let params = {
      productIdList: param.id,
      updateItem: param.type,
      updateValue: param.value,
    };
    return this.get("UserProduct/UpdateMemberProduct", params);
  }


  getAllDocumentUploader(page,record) {
    let params = {
      applicationKey: "IBiz",
      PageNumber: page,
      NoOfRecords: record,
    };
    return this.get("Package/GetAllVerifyDocList", params);
  }

  viewCart(param) {
    let params = {
      secretKey: environment.CARTSNAP_SECRET_KEY,
      applicationKey: "IBizzo",
      ReferenceId: param,
    };
    return this.post("Cart/GetMemberCartSnapshot", "", params);
  }

  getToValidateRequest(data) {
    return this.post("PartnerUser/ValidatePartnerUserRequest", data);
  }

  deletePackage(id) {
    let option={
      applicationKey:'IBiz',
      Id:id
    }
    return this.get("Package/DeletePackageDetails", option);
  }

  getToRejectRequest(data) {
    return this.post("PartnerUser/RejectPartnerUserRequest", data);
  }

  getPaymentStatus(data) {
    return this.post("PartnerUser/UpdatePaymentStatus", data);
  }

  convertGroupToPartner(id) {
    let param = {
      Token: "IBizzo",
      GroupId: parseInt(id),
    };
    return this.post("Group/ConvertGroupToPartner", null, param);
  }

  canUpdate(id) {
    let param = {
      Token: "IBizzo",
      GroupId: parseInt(id),
    };
    return this.get("Group/CanUpgarde", param);
  }

  getAllPackageDetails(pageNumber, records, token) {
    return this.post(
      "Package/GetAllPackageDetails",
      {},
      {
        secretKey: environment.PACKAGE_SECRET_KEY,
        ApplicationKey: "IBiz",
        pageNumber: pageNumber,
        records: records,
        token: token,
      }
    );
  }

  getHsnList(
    pageNumber,
    records,
    searchKey?: string,
    sortKey?: string,
    sortOrder?: string
  ) {
    let params: any = {
      pageNumber: pageNumber,
      records: records,
    };
    if (searchKey) {
      params.searchKey = searchKey;
    }
    if (sortKey) {
      params.sortKey = sortKey;
    }
    if (sortOrder) {
      params.sortOrder = sortOrder;
    }
    return this.get("UserProduct/GetHSNList", params);
  }

  getExistingBussinessCatagory(
    pageNumber,
    records,
    searchKey?: string,
    sortKey?: string,
    sortOrder?: string
  ) {
    let paramsList: any = {
      pageNumber: pageNumber,
      records: records,
      appKey: "IBiz",
    };
    if (searchKey) {
      paramsList.searchKey = searchKey;
    }
    if (sortKey) {
      paramsList.sortKey = sortKey;
    }
    if (sortOrder) {
      paramsList.sortOrder = sortOrder;
    }
    return this.get("UserProduct/GetSystemBusinessCategory", paramsList);
  }

  getCustomBussinessCatagory(param) {
    let paramsList = {
      pageNumber: param.pageNumber,
      records: param.records,
      searchText: param.searchText || "",
      sortKey: param.sortKey,
      sortOrder: param.sortOrder || "",
    };
    return this.get("UserProduct/GetCustomBusinessCategoryList", paramsList);
  }

  addCustomProductCatagory(param) {
    return this.post("UserProduct/CreateCategoryProduct", param);
  }
  getProductCategoryList(
    pageNumber,
    records,
    searchKey?: string,
    sortKey?: string,
    sortOrder?: string
  ) {
    let params: any = {
      pageNumber: pageNumber,
      records: records,
    };
    if (searchKey) {
      params.searchKey = searchKey;
    }
    if (sortKey) {
      params.sortKey = sortKey;
    }
    if (sortOrder) {
      params.sortOrder = sortOrder;
    }
    return this.get("UserProduct/GetProductCategoryList", params);
  }
  getCustomProductCategoryList(
    pageNumber,
    records,
    searchKey?: string,
    sortKey?: string,
    sortOrder?: string
  ) {
    let params: any = {
      pageNumber: pageNumber,
      records: records,
    };
    if (searchKey) {
      params.searchText = searchKey;
    }
    if (sortKey) {
      params.sortKey = sortKey;
    }
    if (sortOrder) {
      params.sortOrder = sortOrder;
    }
    return this.get("UserProduct/GetCustomProductCategoryList", params);
  }
  getAddPackage(data) {
    return this.post("Package/AddPackage", data);
  }

  getUpdatePackage(data) {
    return this.post("Package/UpdatePackage", data);
  }

  getAllPayments(params) {
    return this.post("Cart/GetAllPayments", "", params);
  }

  getUnspscProductList(params) {
    let option = {
      searchText: params.searchText || "",
      sortKey: params.sortKey || "",
      sortOrder: params.sortOrder || "",
      pageNumber: params.pageNumber,
      records: params.records,
      appKey: "IBiz",
    };
    return this.get("UserProduct/GetUNSPSCProductList", option);
  }

  getUserProductList(params) {
    let option = {
      searchText: params.searchText,
      sortKey: params.sortKey,
      sortOrder: params.sortOrder,
      pageNumber: params.pageNumber,
      records: params.records,
      showOnlyDuplicates: params.showOnlyDuplicates,
    };
    return this.get("UserProduct/GetMemberProductList", option);
  }

  updateHSNUNSPSC(params) {
    let options = {
      UNSPCId: params.unspscId,
      HSNCode: params.hsnCode,
      appKey: "IBiz",
    };
    return this.get("UserProduct/UpdateHSNCCodeByUNSPCCode", options);
  }
  getListOfContentValidation(
    pageNumber,
    records,
    search?: String,
    sortKey?: String,
    sortOrder?: String
  ) {
    let params: any = {
      applicationKey: "IBiz",
      pageNumber: pageNumber,
      records: records,
    };
    if (search) {
      params.searchForCompanyName = search;
    }
    if (sortKey) {
      params.sortKey = sortKey;
    }
    if (sortOrder) {
      params.sortOrder = sortOrder;
    }
    return this.get("MemberContentValidation/ListNewUploadsByCompany", params);
  }
  markContentVerified(memberId) {
    let params: any = {
      applicationKey: "IBiz",
      MemberId: memberId,
    };
    return this.get("MemberContentValidation/MarkContentVerified", params);
  }
  getValidationContent(memberId) {
    let params: any = {
      applicationKey: "IBiz",
      MemberId: memberId,
    };
    return this.get(
      "MemberContentValidation/ListContentsForValidation",
      params
    );
  }

  blockContent(data) {
    return this.post("MemberContentValidation/BlockContent", data);
  }

  updateSystemPC(param, url) {
    let option = {
      productName: param.name,
      isEnabled: param.isEnabled,
    };
    return this.get("UserProduct/" + url, option);
  }

  addCustomBC(param) {
    return this.post(
      "UserProduct/AddCustomProductCategoryToSystem",
      undefined,
      { CustomProductCategoryName: param }
    );
  }

  updateLinkedSystemCategoryNameIntoMemberCategory(param) {
    let option = {
      MemberCategoryName: param.categoryName,
      LinkedSystemCategoryName: param.sytemLinkName,
    };
    return this.get(
      "UserProduct/UpdateLinkedSystemCategoryNameIntoMemberCategory",
      option
    );
  }
  visiblePartner(param) {
    let params = {
      Token: param.token,
      isView: param.isView,
      RequestId: param.requestId,
    };
    return this.post("PartnerUser/UpdateIsView", "", params);
  }
  updateCreditsForPartners(credits: any, id: any) {
    let params = {
      Token: "IBiz",
      Credits: credits,
      PartnerMemberId: id,
    };
    return this.post("PartnerUser/UpdateCreditsForPartnerMember", "", params);
  }
  getRfqForSuperAdmin(params) {
    let query = {
      appId: "IBiz",
      searchText: params.searchText,
      pageNumber: params.pageNumber,
      records: params.records,
    };
    return this.get("PurchaserEnquiry/GetRfqForSuperAdmin", query);
  }

  discountList() {
    let query = {
      applicationKey: "IBiz",
      PageNumber: 1,
      Records: 10,
    };
    return this.get("Package/GetBundledOffers", query);
  }


  updateDiscount(params,id) {
    let query = {
      applicationKey: "IBiz",
      Discount: params.offerDiscount,
      BundledOfferId:id,
      Price:params.offerPrice
    };
    return this.get("Package/UpdateBundledDiscount", query);
  }

  uploadImage(file: any) {
    var fd = new FormData();
    fd.append("file", file);
    return this.post("Upload/UploadLeadsImage", fd);
  }
}
