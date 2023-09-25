import { Injectable } from "@angular/core";
import { BaseService } from "../base-service/base.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class InviteService extends BaseService {
  private options = {
    headers: new HttpHeaders().set("Content-Type", "application/json"),
    responseType: "text",
  };
  constructor(private _http: HttpClient) {
    super(_http);
  }

  checkUserAlreadyInvitedByEmail(params: any) {
    console.log("nsdjajsd", params);
    let param: any = {
      Token: "IBizzo",
      emailId: params.email,
      MemberId: params.memberId,
    };
    return this.post("InviteMember/IsRegOrInvited", undefined, param);
  }

  getPendingCount(option) {
    return this.post("InviteMember/PendingRegistrationCount", "", option);
  }

  memberInvite(partnerUserId, payload) {
    let params = {
      Token: partnerUserId,
    };
    return this.post(
      "InviteMember/MemberInvite",
      payload,
      params,
      this.options
    );
  }

  nonMemberEnquiry(params) {
    return this.post(
      "PurchaserEnquiry/PurchaserEnquiryForNonMember",
      params
    );
  }

  nonHSNMemberEnquiry(params) {
    return this.post(
      "PurchaserEnquiry/SendProductHSNEnquiryForNonMember",
      params
    );
  }

  getAllInviteMembersByToken(status: any, page) {
    let param: any = {
      MemberCompanyID: parseInt(
        JSON.parse(localStorage.getItem("memberData")).memberUserInfo.companyId
      ),
      Token: "IBizzo",
      InviteStatus: status,
      PageNo: page.index,
      NoOfRecs: page.page,
    };
    return this.get("InviteMember/InvitedMembers", param);
  }

  postBulkInvite(payload) {
    let params: any = {
      Token: "IBizzo",
    };
    return this.post("InviteMember/ReInviteMembers", payload, params);
  }

  blockMember(payload) {
    let params: any = {
      Token: "IBizzo",
    };
    payload.token = "IBizzo";
    return this.post("InviteMember/BlockMember", payload, params, this.options);
  }
  unblockMember(payload) {
    let params: any = {
      Token: "IBizzo",
    };
    payload.token = "IBizzo";
    return this.post(
      "InviteMember/UnBlockMember",
      payload,
      params,
      this.options
    );
  }

  searchInviteMember(searchText, status, type, page) {
    let params = {
      srchKey: "Email",
      srchVal: searchText,
      companyID: parseInt(
        JSON.parse(localStorage.getItem("memberData")).memberUserInfo.companyId
      ),
      pageNo: page.index,
      noOfRecs: page.page,
      inviteStaus: status,
      token: "",
      code: "string",
    };
    return this.post("InviteMember/SearchInvitedMembers?Token=IBizzo", params);
  }

  updateDetails(params) {
    return this.post("User/SendEmailOtp", "", params);
  }

  updatePhoneNumber(params) {
    return this.post("User/SendSMSOtp", "", params);
  }

  updatedUserDetails(request) {
    return this.post("User/ChangeMemberContactDetails", request);
  }
  unsubscribeMemberInvite(param: any) {
    let params = {
      Token: "IBizzo",
      Id: param.id,
      MemberCompanyID: param.memberCompanyId,
    };

    return this.get("InviteMember/Unsubscribe", params);
  }
}
