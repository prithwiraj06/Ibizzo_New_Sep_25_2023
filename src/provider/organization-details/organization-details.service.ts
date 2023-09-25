import { Injectable } from '@angular/core';
import { BaseService } from '../base-service/base.service'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrganizationDetailsService extends BaseService{

  constructor(private _http: HttpClient) {
    super(_http);
  }

  //get the organization statistics
  getStatistics(orgId: any) {
    const params: any = {
      applicationKey: 'IBiz',
      'OganizationId': orgId
    };
    return this.get('Dashboard/GetOrgMemProdCount', params)
  };

  //get the organization sale statistics
  getSaleSatatistics(orgId: any) {
    const params: any = {
      applicationKey: 'IBiz',
      'OganizationId': orgId
    };
    return this.get('Dashboard/GetOrgCompSalePurchaseCount', params)
  }

  //get the oragnization Id
  getSocialOrganisation() {
    const params: any = {
      applicationKey: 'IBiz',
    };
    return this.get('Register/GetOrganization', params);
  };

  
}
