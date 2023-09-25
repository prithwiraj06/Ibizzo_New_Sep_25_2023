import { Injectable } from '@angular/core';
import { BaseService } from '../base-service/base.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService extends BaseService {

  constructor(private _http: HttpClient) {
    super(_http)
  }

  getCartPackagesById(packageId) {
    let params: any = {
      "secretKey": environment.PACKAGE_SECRET_KEY,
      "applicationKey": "IBiz",
      "packageId": packageId
    }
    return this.get('Package/GetPackageDetail', params);
  }

  addMemberPackageDetails(data) {
    return this.post('Package/AddMemberPackageDetail', data);
  }
}
