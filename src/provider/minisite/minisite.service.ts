import { Injectable } from '@angular/core';
import { BaseService } from '../base-service/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MinisiteService extends BaseService {

  constructor(
    private _http: HttpClient
  ) {
    super(_http);
  }

  //get user details
  getUserDetailsByCompanyId(companyId: string) {
    let params: any = {
      'ApplicationKey': 'IBiz',
      'token': companyId
    };
    return this.post('User/GetUserDetails', {}, params);
  }

  getPackageDetailsById(companyId: string) {
    let params: any = {
      'ApplicationKey': 'IBiz',
      'pkgId': 1,
      'token': companyId
    };
    return this.get('Package/GetMemberPackageDetails', params);
  }

  getCompanyProductImages(companyId) {
    let params: any = {
      'ApplicationKey': 'IBiz',
      'pageNumber': 0,
      'records': 1000,
      'CompanyId': companyId
    };
    return this.get('Dashboard/GetAllCompanyProducts', params);
  }

  sendEmailToUser(data) {
    let params: any = {
      'ApplicationKey': 'IBiz',
    };
    return this.post('User/SendMailToUser',data, params);
  }
}
