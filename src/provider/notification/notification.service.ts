import { Injectable } from '@angular/core';
import { BaseService } from '../base-service/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {

  constructor(private _http: HttpClient) {
    super(_http);
  }

  getBuyerPackage() {
    let params: any = {
      secretKey: 'C37DA9CA-265D-45FF-91CE-B1A626BEEEF6',
      applicationKey: 'IBiz',
      packageId: 4
    }
    return this.get('Package/GetPackageDetail', params)
  }

  getFlyersHistoryProducts(memberId, id) {
    let params: any = {
      Token: 'IBizzo',
      MemberId: memberId,
      FlyersId: id,
      page: 1,
      recs: 100
    }
    return this.post('Flyers/GetFlyersHistoryProductDetails', undefined, params);
  }

  getDigitalFlyers(memberId, id, param) {
    let params: any = {
      Token: 'IBizzo',
      MemberId: memberId,
      FlyersId: id,
      page: param.index,
      recs: param.page
    }
    return this.post('Flyers/GetFlyersHistoryDigitalDetails', undefined, params);
  }

  getFlyersHistoryPurchaseProducts(memberId, id) {
    let params: any = {
      Token: 'IBizzo',
      MemberId: memberId,
      FlyersId: id,
      page: 1,
      recs: 100
    }
    return this.post('Flyers/GetFlyersHistoryPurchaserDetails', undefined, params);
  }

  getFlyersHistory(memberId, productId, type, page) {
    let params: any = {
      Token: 'IBizzo',
      productId: productId,
      memberId: memberId,
      page: page.index,
      noOfRecs: page.records,
      type: type
    }
    return this.post('Flyers/GetFlyersHistory', undefined, params);
  }

  postProcessProductFlyers(payload) {
    let param: any = {
      Token: 'IBizzo'
    }
    return this.post('Flyers/ProcessProductFlyers', payload, param);
  }

  postProcessPurchaseFlyers(payload) {
    let param: any = {
      Token: 'IBizzo'
    }
    return this.post('Flyers/ProcessPurchaserFlyers', payload, param);
  }
}
