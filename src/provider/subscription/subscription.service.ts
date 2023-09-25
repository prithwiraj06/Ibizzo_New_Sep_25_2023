import { Injectable } from "@angular/core";
import { BaseService } from "../base-service/base.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SubscriptionService extends BaseService {
  constructor(private _http: HttpClient) {
    super(_http);
  }

  //get member subscriptions
  getMemberSubscriptionByAccessToken(accessToken) {
    let params: any = {
      applicationKey: "IBiz",
      token: accessToken,
    };
    return this.get("Package/GetMemberSubscriptions", params);
  }

  addPurchangeOffers(offers) {
    let params: any = {
      applicationKey: "IBiz",
    };
    return this.post("Package/PurchaseOffers", offers, params);
  }

  addPurchangeURL(url,offers) {
    let params: any = {
      applicationKey: "IBiz",
    };
    return this.post(url, offers, params);
  }
  purchaseContactPackage(offers) {
    let params: any = {
      applicationKey: "IBiz",
    };
    return this.post("User/PurchaseContactPackage", offers, params);
  }

  hasAddToCart(offers){
    let params: any = {
      applicationKey: "IBiz",
    };
    return this.post('Cart/AddOffersToCart',offers,params)
  }

  visterDetails(offers) {
    let params: any = {
      applicationKey: "IBiz",
    };
    return this.post("User/AddVisitor/", offers, params);
  }

  visterHasDetails(id,offerId) {
    let params: any = {
      applicationKey: "IBiz",
      MemberId: id,
      offerId:offerId
    };
    return this.get("Package/HasOffers/", params);
  }

  getBundleDetails(){
    let params: any = {
      applicationKey: "IBiz",
      PageNumber: 1,
      Records:10
    };
    return this.get("Package/GetBundledOffers", params);
  }


  getPackage(){
    let params: any = {
      applicationKey: "IBiz",
    };
    return this.get("Package/GetPackages", params);
  }

  hasBundleOffers(id,param){
    param.applicationKey="IBiz"
    param.MemberId=id
    return this.get("Package/HasBundledOffers", param);
  }

  hasPurchaseBundleOffers(id,offers){
    return this.get(`Package/HasBundledOffers?applicationKey=IBiz&MemberId=${id}&${offers}`,null);
  }

  postBundle(options){
    let params: any = {
      applicationKey: "IBiz"
    };
    return this.post("Package/PurchaseBundledPackages",options, params);
  }

  
}
