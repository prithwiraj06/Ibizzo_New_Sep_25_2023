import { Injectable } from "@angular/core";
import { BaseService } from "../base-service/base.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as _ from "underscore";

@Injectable({
  providedIn: "root",
})
export class PartnerService extends BaseService {
  private options = {
    headers: new HttpHeaders().set(
      "Content-Type",
      "application/json-patch+json"
    ),
    responseType: "text",
  };
  public PARTNER_KEY: string;
  public ALL_PARTNERS: any = [];
  public ALL_PARTNERS_BY_ID_LOOKUP: any = {};
  private DEFAULT_PARTNER_LOGO = "/assets/media/logos/default-partner-logo.png";

  public init = function () {
    return this._init();
  };

  constructor(private _http: HttpClient) {
    super(_http);
  }

  _init() {
    return new Promise(async (resolve, reject) => {
      try {
        let currentPartnerName: string = this.getCurrentPartnerUrlName();
        let partners: any = await this.getPartners();
        let partnerInfo: any = {
          id: 1,
          name: "IBizzo",
          urlId: "main",
          urlName: "main",
          showLogoText: false,
          logo: "/assets/media/logos/ibizzo-logo.png",
        };

        if (
          partners &&
          partners.socialOrganizationInfo &&
          partners.socialOrganizationInfo.length
        ) {
          partners = partners.socialOrganizationInfo;
          _.each(partners, (item: any, index: number) => {
            partners[index].id = parseInt(partners[index].id);
            partners[index].urlId = this.removeSpaces(item.name, true);
            partners[index].urlName = this.removeSpaces(item.name, false);

            if (item.logo !== null) {
              partners[index].logo = this.getImageUrl(
                item.logo,
                "GetDownloadPartnerLogo"
              );
            } else {
              partners[index].logo = this.DEFAULT_PARTNER_LOGO;
            }
            partners[index].showLogoText = true;

            if (partners[index].urlId == currentPartnerName) {
              partnerInfo = partners[index];

              // if the selected Partner is iBizzo
              // override the path
              if (partnerInfo.id == 1) {
                partnerInfo.urlId = "main";
                partnerInfo.urlName = "main";
                partnerInfo.showLogoText = false;
              }
            }

            // add entry to lookup
            this.ALL_PARTNERS_BY_ID_LOOKUP[partners[index].id] =
              partners[index];
          });
        }
        this.ALL_PARTNERS = partners;
        this.setCurrentPartner(partnerInfo);
        resolve(true);
      } catch {
        reject();
      }
    });
  }

  getCachedPartners() {
    return this.ALL_PARTNERS;
  }

  getCachedPartnersSearch(param) {
    let data = [];
    _.each(this.ALL_PARTNERS, (item) => {
      if (param != null) {
        if (
          item.name.includes(param) ||
          item.name.includes(param.toLowerCase()) ||
          item.name.includes(param.toUpperCase())
        ) {
          data.push(item);
        }
      }
    });
    if (data.length != 0) {
      return data;
    } else {
      return this.ALL_PARTNERS;
    }
  }

  getCurrentPartnerUrlName() {
    let currentPartner: string = "IBizzo";
    const path: any = document.location.pathname.split("/");
    if (path[0] == "" && path[1] != undefined) {
      currentPartner = path[1].replace(/ /g, "-");
    }
    return currentPartner.toLowerCase();
  }

  setCurrentPartner(partnerInfo: any) {
    const key: string = partnerInfo.urlId.replace(/\-/g, "");
    this.PARTNER_KEY = key;
    return localStorage.setItem(
      `partner_info_${key}`,
      JSON.stringify(partnerInfo)
    );
  }

  getCurrentPartner() {
    let key: string;
    if (this.PARTNER_KEY) {
      key = this.PARTNER_KEY;
    } else {
      key = this.getCurrentPartnerUrlName().replace(/\-/g, "");
    }
    return JSON.parse(localStorage.getItem(`partner_info_${key}`));
  }

  getPartnerInfoById(id: any) {
    return this.ALL_PARTNERS_BY_ID_LOOKUP[id];
  }

  getParnerLogo() {
    const currentPartner: any = this.getCurrentPartner();
    if (currentPartner == null || !currentPartner.logo) {
      return 1;
    }
    return currentPartner.logo;
  }

  getCurrentPartnerId() {
    const currentPartner: any = this.getCurrentPartner();
    if (currentPartner == null || !currentPartner.id) {
      return 1;
    }
    return currentPartner.id;
  }

  getPartners() {
    return this.get("Register/GetOrganization", {
      applicationKey: "IBiz",
    });
  }

  getMembership(status: any, token, sort: any = {}, page, records?: any) {
    let data = {
      applicationKey: "IBiz",
      token: token,
      orgId: JSON.parse(localStorage.getItem("memberData")).memberUserInfo
        .organizationId,
      pageNumber: page,
      records: records,
      status: status,
      sortOrder: sort.sortOrder || "ASC",
      sortKey: sort.sortKey || "name",
    };
    return this.post("PartnerUser/GetPartnerMembers", data);
  }

  getMemberStats(
    pageNumber,
    records,
    status,
    searchKey?: string,
    sortKey?: string,
    sortOrder?: string
  ) {
    let params: any = {
      pageNumber: pageNumber,
      records: records,
      status: status,
    };
    if (searchKey) {
      params.searchKey = searchKey;
    }
    if (sortKey) {
      params.sortKey = sortKey;
    }
    if (sortOrder) {
      params.sortOrder = sortOrder;
    }
    return this.post("PartnerUser/GetPartnerMemberStats", {}, params);
  }

  sortPendingList(status: any, sort: any = {}, page) {
    let str = _.isEmpty(sort) ? "" : sort.sortKey[0];
    let subStr = _.isEmpty(sort) ? "" : sort.sortKey.slice(1);
    let addStr = str.toUpperCase() + subStr;
    let data = {
      token: JSON.parse(localStorage.getItem("memberData")).token,
      companyID: parseInt(
        JSON.parse(localStorage.getItem("memberData")).memberUserInfo.companyId
      ),
      pageNo: page.index,
      noOfRecs: page.page,
      inviteStaus: status,
      sortOrder: sort.sortOrder || "ASC",
      sortKey: addStr || "Name",
      srchVal: "",
      SrchKey: addStr || "Name",
    };
    return this.post("InviteMember/SearchInvitedMembers?Token=IBizzo", data);
  }

  getToValidateMember(data) {
    return this.post("PartnerUser/ValidatePartnerMember", data);
  }

  rejectMember(data) {
    return this.post("PartnerUser/RejectPartnerMember", data);
  }

  searchText(data) {
    return this.post("PartnerUser/SearchAllPartnerRequest?", data);
  }

  searchMember(data) {
    return this.post("PartnerUser/GetPartnerMembers?", data);
  }

  individualInviteSettings(params: any) {
    return this.post("InviteMember/MemberInvite", params);
  }
  uploadFile(theFile: any, compId: any, fileName) {
    const params = {
      Token: "IBizzo",
      FileName: fileName,
      MemberCompanyID: compId,
    };

    return this.post(
      "InviteMember/MemberInviteBulk",
      JSON.stringify(theFile),
      params,
      this.options
    );
  }

  sendInviteSettings(data) {
    return this.post("InviteMember/EmailSettings", data, "", this.options);
  }

  getMyTemplate(compId) {
    const params = {
      MemberCompanyID: compId,
      Token: "IBizzo",
    };
    return this.get("InviteMember/GetEmailSettings", params);
  }

  uploadPartnerImages(payload) {
    let param: any = {
      Token: "IBizzo",
    };
    return this.post("Profile/UpdatePartnerImage", payload, param);
  }

  getPartnerImagesByToken(orgId) {
    let params: any = {
      Token: "IBizzo",
      OrgId: parseInt(orgId),
    };
    return this.post("Profile/GetPartnerImages", undefined, params);
  }

  agreeTandC(data: any) {
    let params: any = {
      token: data,
      ApplicationKey: "IBiz",
    };
    return this.post("User/AgreeToTandC", undefined, params);
  }
  createPartnerPosts(payload) {
    let param: any = {
      Token: "IBizzo",
    };
    return this.post("Group/CreatePartnerPosts", payload, param);
  }
  getPartnerPosts(param) {
    let params: any = {
      Token: "IBizzo",
      partnerId: param.id,
      pageNumber: param.pageNumber,
      records: param.records,
    };
    return this.get("Group/GetPartnerPostsList", params);
  }
  getPartnerCommentsList(param) {
    let parmas: any = {
      Token: "IBizzo",
      pageNumber: param.pageNumber,
      records: param.records,
      PartnerPostId: param.postId,
    };
    return this.get("Group/GetPartnerCommentsList", parmas);
  }
  createPartnerComments(payload) {
    let param: any = {
      Token: "IBizzo",
    };
    return this.post("Group/CreatePartnerComments", payload, param);
  }
  getPartnerDetail(param) {
    let params: any = {
      Token: "IBizzo",
      MemberId: param.memberId,
    };
    return this.get("Group/GetMemberDetails", params);
  }

  getPartnerProductList(param) {
    let parmas: any = {
      PartnerId: param.partnerId,
      pageNumber: param.pageNumber,
      records: param.records,
    };
    return this.get("DashBoard/GetNewArrivalPrdsList", parmas);
  }
}
