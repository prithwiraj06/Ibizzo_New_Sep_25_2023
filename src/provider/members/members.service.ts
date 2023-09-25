import { Injectable } from '@angular/core';
import { BaseService } from '../base-service/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MembersService extends BaseService {

  constructor(
    private _http: HttpClient
  ) {
    super(_http);
  }


  getMemberList(pageNumber, token, records) {
    let params: any = {
      'applicationKey': 'IBiz',
      'pageNumber': pageNumber,
      'records': records,
      'token': token
    }
    return this.get('Dashboard/GetCompanyProducts', params)
  }

  getPartnerMembers(params: any) {
    return this.post('PartnerUser/GetPartnerMembersByOrgId', params)
  }

  searchMemberList(pageNumber, token, records, key) {
    let params: any = {
      'applicationKey': 'IBiz',
      'pageNumber': pageNumber,
      'records': records,
      'token': token,
      searchKey: key
    }
    return this.get('Dashboard/GetCompanyProducts', params)
  }



}