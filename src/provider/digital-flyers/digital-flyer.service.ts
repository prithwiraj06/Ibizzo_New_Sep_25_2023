import { Injectable } from "@angular/core";
import { BaseService } from "../base-service/base.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "../../app/views/pages/auth/auth.service";
import * as _ from "underscore";

@Injectable({
  providedIn: "root",
})
export class DigitalFlyerService extends BaseService {
  LOCATION: any = [];

  constructor(private _http: HttpClient, private authService: AuthService) {
    super(_http);
    this._init();
  }

  async _init() {
    this.LOCATION = this.locationInfo();
  }

  addMemberCartSnapshot(params: any) {
    return this.post("Cart/AddMemberCartSnapshot", "", params);
  }

  getFlyerNotifications() {
    const currentUser: any = this.authService.getCurrentUser();

    let params = {
      Token: "IBizzo",
      MemberCompanyId: currentUser.companyId,
      MemberId: currentUser.id,
      page: 1,
      recs: 10,
    };
    return this.post("Flyers/GetAllMyFlyers", "", params);
  }

  unsubscribeNewsletter(param: any) {
    let params = {
      PartnerId: param.partnerId,
      MemberId: param.memberId,
    };

    return this.post("Flyers/Unsubscribe", "", params);
  }

  getNumOfMember(params) {
    const param = {
      Token: "IBizzo",
    };
    return this.post("Flyers/QueryMembers", params, param);
  }

  postDigitalFlyer(params) {
    const param = {
      Token: "IBizzo",
    };
    return this.post("Flyers/ProcessDigitalFlyers", params, param);
  }

  locationInfo() {
    const param = {
      Token: "IBizzo",
    };
    return this.post("Flyers/PopulateLOVs", "", param);
  }

  getCachedLocationSearch(param) {
    let data = [];
    _.each(this.LOCATION.__zone_symbol__value.locations, (item) => {
      if (item != null && param) {
        if (
          item.includes(param) ||
          item.includes(param.toLowerCase()) ||
          item.includes(param.toUpperCase())
        ) {
          data.push(item);
        }
      }
    });
    if (data.length != 0) {
      return data;
    } else {
      return this.LOCATION.__zone_symbol__value.locations;
    }
  }

  updateFlyers(params) {
    return this.post("Flyers/UpdateFlyers", "", params);
  }
  getFlyersById(params) {
    let param = {
      Token: "IBizzo",
      MemberCompanyId: params.memberCompanyId,
      MemberId: params.memberId,
      FlyerId: params.flyerId,
      FlyerType: params.flyerType,
    };
    return this.post("Flyers/GetFlyersById", "", param);
  }

  sentMailToMember(id){
    let param = {
      Token: "IBiz",
      MemberId:id
    };
    return this.post("cart/SendProformaInvoice", "", param);
  }
}
