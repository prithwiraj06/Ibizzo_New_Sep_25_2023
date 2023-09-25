import { Injectable } from "@angular/core";
import { BaseService } from "../base-service/base.service";
import { HttpClient } from "@angular/common/http";
import * as _ from "underscore";

@Injectable({
  providedIn: "root",
})
export class EnquiryService extends BaseService {
  private enquiryType: string;
  constructor(private _http: HttpClient) {
    super(_http);
  }

  init(enquiryType: string) {
    this.enquiryType = enquiryType;
  }

  getAction(action: string) {
    return this.enquiryType + "/" + action;
  }

  findAll(token: string, companyId: number) {
    let params: any = {
      appId: "IBiz",
      pageNumber: 1,
      records: 50,
      token: token,
    };

    return new Promise(async (resolve) => {
      var enquiries: any = await this.post(
          this.getAction("GetMyEnquiries"),
        {},
        params
      );
      const entityType: string =
        this.enquiryType == "SupplierEnquiry"
          ? "supplierEnquiryData"
          : "purchaserEnquiryData";

      if (enquiries && enquiries[entityType] != null) {
        _.each(enquiries[entityType], (item: any) => {
          var images = [];
          if (item && item.productImage && item.productImage.length) {
            _.each(item.productImage.split(","), (image: string) => {
              images.push(this.getImageUrl(image));
            });
          }
          item.productLink = `/home/request-for-quote?compId=${companyId}&productId=${item.productId}`;
          item.productImages = images.splice(0, 2);
        });
        resolve(enquiries[entityType]);
      } else {
        resolve([]);
      }
    });
  }

  findMessages(token: string, enquiryId: number) {
    let params: any = {
      appId: "IBiz",
      pageNumber: 1,
      records: 50,
      token: token,
      EnquiryId: enquiryId,
    };

    return new Promise(async (resolve) => {
      var result: any = await this.post(
        this.getAction("GetEnquiryMessage"),
        {},
        params
      );

      // if all good
      if (result && result.enquiryMessages != null) {
        _.each(result.enquiryMessages, (item: any) => {
          if (item && item.documentName && item.documentName != null) {
            item.documentName = this.getImageUrl(
              item.documentName,
              "GetQuoteDownload"
            );
          }
        });
      }
      resolve(result);
    });
  }

  sendMessage(data: any) {
    data.applicationKey = "IBiz";
    return this.post(this.getAction("AddEnquiryMessage"), data);
  }

  uploadImage(file: any) {
    var fd = new FormData();
    fd.append("file", file);
    return this.post("Upload/UploadQuoteDocumentation", fd);
  }

  getUserCredits(userId: number) {
    let params = {
      Token: userId,
      ApplicationKey: "IBiz",
    };
    return this.post("User/GetMemberCredits", "", params);
  }
  getTradePostsLists(params: any) {
    let param = {
      appId: "IBiz",
      searchText: params.search ? params.search : "",
      pageNumber: params.pageNumber,
      records: params.records,
    };
    return this.get("PurchaserEnquiry/GetTradePostsList", param);
  }

  addEnquiryForMember(data) {
    return this.post("PurchaserEnquiry/AddEnquiryForMember", data);
  }
}
