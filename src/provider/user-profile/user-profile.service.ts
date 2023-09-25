import { Injectable } from '@angular/core';
import { BaseService } from '../base-service/base.service'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import * as _ from 'underscore';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UserProfileService extends BaseService {
  private options = { headers: new HttpHeaders().set('Content-Type', 'application/json'), responseType: 'text' };
  constructor(private _http: HttpClient) {
    super(_http)
  }

  getEntity() {
    const params = {
      applicationKey: 'IBiz',
    };
    return this.get('Register/GetEntity', params)
  }

  getOrganizationOwner(memberId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          token: memberId,
        };
        const result: any = await this.get('Register/GetMyOrganization', params)
        if (result && result.socialOrganizationInfo && result.socialOrganizationInfo.id) {
          resolve(result.socialOrganizationInfo);
          return false;
        }
        reject();
      } catch (e) {
        reject(e);
      }
    });
  }

  getAnnoucement(id?:any){
    let option={
      Token:'IBiz',
      pageNumber:1,
      Records:50,
      id:id?id:-1
    }
    return this.get('Profile/GetAnnouncements',option)
  }

  deleteAnnoucement(id?:any){
    let option={
      Token:'IBiz',
      AnnouncementId:id
    }
    return this.post('Profile/DeleteAnnouncements',option)
  }

  getProfile(userId) {
    return this.post('User/GetUserDetails', {}, {
      "ApplicationKey": "IBiz",
      "token": userId.toString()
    })
  }

  addAnnoucement(data){
    return this.post('Profile/AddOrUpdateAnnouncements', data, { "Token": "IBiz" });
  }

  updateDescription(data){
    return this.post('Register/UpdatePartnerDescription', data);

  }



  getMyEnquiries() {
    return this.post('SupplierEnquiry/GetMyEnquiries', {}, {
      "appId": "IBiz",
      "token": JSON.parse(localStorage.getItem('memberData')).token,
      pageNumber: 1,
      records: 50
    })
  }

  getArea(pincode) {
    const params = {
      ApplicationKey: 'IBiz',
      // token: JSON.parse(localStorage.getItem('memberData')).token,
      Pincode: pincode
    };
    return this.post('User/GetPincodeInfo', '', params)
  }

  //upload image
  uploadImage(file) {
    var fd: any = new FormData();
    fd.append('file', file);
    return this.post('Upload/UploadFile', fd)
  }

  uploadDoc(file) {
    var fd: any = new FormData();
    fd.append('file', file);
    return this.post('Upload/UploadVerifiedCompanyDoc', fd)
  }

  uploadPartnerLogo(file) {
    var fd = new FormData();
    fd.append('file', file);
    return this.post('Upload/UploadPartnerLogo', fd, {}, { responseType: 'text' })
  }

  uploadAnnoucementImage(file) {
    var fd = new FormData();
    fd.append('file', file);
    return this.post('Upload/UploadAnnouncementImage', fd, {}, { responseType: 'text' })
  }

  updatePartnerLogo(data: any) {
    this.post('Profile/UpdatePartnerLogo', data, { "token": "IBizzo" });
  }

  updatePartnerDetails(data: any) {
   return this.post('Profile/UpdatePartnerDetails', data, { "Token": "IBizzo" });
  }

  addPackages(data: any) {
    return this.post('Profile/AddDocumentForVerification', data, { "Token": "IBiz" });
  }
  

  updatePackages(data: any) {
    return this.post('Profile/UpdateDocForVerification', data, { "Token": "IBiz" });
   }


  uploadDocument(docFile) {
    var fd = new FormData();
    fd.append('docFile', docFile);
    return this.post('Upload/UploadCompanyDocumentation', fd)
  }

  uploadFlyerDocument(docFile) {
    var fd = new FormData();
    fd.append('docFile', docFile);
    return this.post('Upload/UploadFlyersDocs', fd)
  }

  updateProfile(request) {
    return this.post('User/UpdateUserDetails', request)
  }

  updateMemberProfile(request) {
    return this.post('Profile/UpdateMemberProfile', request);
  }

  addMemberProfile(request) {
    let params: any = {
      "Token": 'IBizzo'
    }
    return this.post('Profile/AddMemberProfile', request, params);
  }

  uploadFacilityImages(data: any) {
    return this.post('User/UpdateCompanyImages', {}, {
      'Token': data.Token,
      'CompanyId': data.CompanyId,
      'ImageNames': data.ImageNames
    });
  }

  updateMemberProfileImages(data, token, companyId) {
    let imageData = {
      token: token,
      companyId: companyId,
      ImageNames: data
    }
    return this.post('Profile/UpdateProfileImages', imageData, {
      'Token': 'IBizzo'
    });
  }

  uploadCompanyDocuments(data: any) {
    return this.post('User/UpdateCompanyDocuments', {}, {
      'Token': data.Token,
      'CompanyId': data.CompanyId,
      'DocNames': data.DocName
    });
  }

  updateMemberProfileDocuments(data, token, companyId) {
    let uploadDoc = {
      token: token,
      companyId: companyId,
      docNames: data
    }
    return this.post('Profile/UpdateProfileDocuments', uploadDoc, {
      'Token': 'IBizzo'
    });
  }

  uploadCompanyVideos(data: any) {
    return this.post('User/UpdateCompanyVideos', {}, {
      'Token': data.Token,
      'CompanyId': data.CompanyId,
      'Videos': data.Videos
    });
  }

  updateMemberProfileVideos(data, token, companyId) {
    let uploadVideos = {
      token: token,
      companyId: companyId,
      videos: data
    }

    return this.post('Profile/UpdateProfileVideos', uploadVideos, {
      'Token': 'IBizzo'
    });
  }

  getOffersDetails(id,offerId) {
    let options = {
      applicationKey: 'IBiz',
      MemberId: id,
      offerId: offerId
    }

    return this.get('Package/HasOffers',options)
  }

  downloadImage(file) { 
    return environment.API_URL + "Upload/GetDownload?filename=" + file;
  }

  downloadDoc(file) { 
    return environment.API_URL + "Upload/GetCompanyDocumentDownload?filename=" + file;
  }

  notifyMember(payload) {
    let param: any = {
      "Token": 'IBizzo'
    }
    return this.post('InviteMember/NotifyMember', payload, param);
  }

  getProfileDataOfMember(userId) {
    let payload: any = {
      "profileId": parseInt(userId)
    }

    let params: any = {
      "Token": "IBizzo"
    }

    return this.post('Profile/GetProfileData', payload, params);
  }
}
