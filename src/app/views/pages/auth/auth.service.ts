import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { BaseUrlPipe } from '../../../core/_base/layout/pipes/base-url'
import { PartnerService } from '../../../../provider/partner/partner.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private baseUrlPipe: BaseUrlPipe,
    private partnerService: PartnerService
  ) { }

  isLoggedInUser() {
    return (this.getCurrentUser() !== null);
  }

  getCurrentUser() {
    const memberData: any = JSON.parse(localStorage.getItem('memberData'));
    if (memberData && (memberData != null) && memberData.memberUserInfo) {
      return memberData.memberUserInfo;
    }
  }
  getJwtToken() {
    const memberData: any = JSON.parse(localStorage.getItem("memberData"));
    if (memberData && memberData != null && memberData.memberUserInfo) {
      return memberData.jwtToken;
    }
  }
  getUserId() {
    const currentUser = this.getCurrentUser();
    return (currentUser == null) ? null : currentUser.id;
  }

  getCompanyId() {
    const currentUser = this.getCurrentUser();
    return (currentUser == null) ? null : parseInt(currentUser.companyId);
  }

  getOrganizationId() {
    const currentUser = this.getCurrentUser();
    return (currentUser == null) ? null : parseInt(currentUser.organizationId);
  }

  getPartnerOrganizationId() {
    const currentUser = this.getCurrentUser();
    if (currentUser == null) {
      return null;
    }

    if (currentUser && currentUser.partnerInfo && currentUser.partnerInfo.id) {
      return currentUser.partnerInfo.id;
    }
    else {
      return 1;
    }
  }

  hasRole(roleName: string) {
    if (!roleName) {
      return false;
    }

    const currentUser = this.getCurrentUser();
    if (currentUser == null) {
      return false;
    }
    let isAllowed: boolean = false;
    roleName = (roleName || '').toLowerCase();
    if (currentUser.roles && currentUser.roles.length) {
      _.each(currentUser.roles, (item: any) => {
        isAllowed = isAllowed || (item.roleName.toLowerCase() == roleName);
      })
    }
    return isAllowed;
  }

  getRole() {
    let roleName: string;

    const currentUser = this.getCurrentUser();
    if (currentUser == null) {
      return 'default';
    }
    if (currentUser.roles && currentUser.roles.length > 0) {
      _.each(currentUser.roles, (item: any) => {
        roleName = item.roleName;
      })
    }
    if (currentUser.roles && currentUser.roles.length == 0) {
      return 'default'
    }
    return roleName;
  }

  allowedDashboards() {
    const isAdmin: boolean = this.hasRole('SuperAdmin');
    const isPartner: boolean = this.hasRole('Partner');
    const isLoggedUser: boolean = (this.getUserId() !== null);

    if (!isLoggedUser) {
      return [];
    }

    if (isAdmin && isPartner) {
      return ['Admin', 'Partner'];
    }

    if (isAdmin) {
      return ['Admin'];
    }

    if (isPartner) {
      return ['Business', 'Partner'];
    }

    return ['Business'];
  }

  getSaleCatelogEnqiry(){
    let url=this.baseUrlPipe.transform(["/dashboard/business/sales/enquiry"])
    return url;
  }

  seoUrl(flow){
    if(flow=='minisite'){
      let url=this.baseUrlPipe.transform(["/dashboard/business/profile#minisite"])
    return url;
    }
    else if(flow=='digital-flyers'){
      let url=this.baseUrlPipe.transform(["/dashboard/business/digital-markting/digital-flyer"])
      return url;
    }
    else if(flow=='join-group'){
      let url=this.baseUrlPipe.transform(["/dashboard/business/create-group"])
      return url;
    }
    else if(flow=='bundle'){
      let url=this.baseUrlPipe.transform(["/pages/packages"])
      return url;
    }
  }

  getDefaultDashboardUrl() {
    const urls: any = {
      'default': this.baseUrlPipe.transform(['/dashboard/business/home']),
      'SuperAdmin': this.baseUrlPipe.transform(['/dashboard/admin/home']),
      'Partner': this.baseUrlPipe.transform(['/dashboard/partner/home']),
      'Business': this.baseUrlPipe.transform(['/dashboard/business/home'])
    };

    return urls[this.getRole()];
  }

  isAlowedPartnerSite(dashboardName: string) {
    return new Promise((resolve, reject) => {
      let currentSiteOrganizationId: number = this.partnerService.getCurrentPartnerId();
      let currentUserOrganizationId: number = this.getOrganizationId();

      if (dashboardName.toLowerCase() == 'partner') {
        currentUserOrganizationId = this.getPartnerOrganizationId();
      }

      if (currentUserOrganizationId == currentSiteOrganizationId) {
        resolve();
        return false;
      }

      const partnerInfo: any = this.partnerService.getPartnerInfoById(currentUserOrganizationId);
      let url: string = `\/${partnerInfo.urlName}/dashboard/${dashboardName}/home`;
      reject(url);
    })
  }
}
