import { Injectable } from "@angular/core";
import { BaseService } from "../base-service/base.service";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../app/views/pages/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class SuggestedClustersService extends BaseService {
  constructor(private _http: HttpClient, private auth: AuthService) {
    super(_http);
  }

  createClustersGroup(param) {
    return this.post("Group/CreateGroup?Token=IBizzo", param);
  }

  groupList() {
    let param = {
      pageNumber: 0,
      records: 50,
    };
    return this.get("Group/GetGroupList", param);
  }

  getMyGroups() {
    let param = {
      Token: "IBizzo",
      MemberId: this.auth.getUserId(),
      pageNumber: 0,
      records: 50,
    };
    return this.get("Group/GetMyGroups", param);
  }
  getMyGroupsWithPartners() {
    let param = {
      Token: "IBizzo",
      MemberId: this.auth.getUserId(),
      pageNumber: 0,
      records: 50,
    };
    return this.get("Group/GetMyGroupsWithPartner", param);
  }

  joinGroup(groupId) {
    let param = {
      Token: "IBizzo",
      MemberId: this.auth.getUserId(),
      GroupId: groupId,
    };
    return this.get("Group/RegisterToGroup", param);
  }

  partnerGrouproupList() {
    let param = {
      Token: "IBizzo",
      PartnerId: this.auth.getPartnerOrganizationId(),
      pageNumber: 0,
      records: 1000,
    };
    return this.get("Group/GetGroupsForPartner", param);
  }

  assignMemberAsAdmin(param) {
    let options = {
      Token: "IBizzo",
      MemberId: param.memberId,
      GroupId: param.groupId,
      PartnerId: this.auth.getPartnerOrganizationId(),
    };
    return this.patch("Group/AssignGroupAdmin", undefined, options);
  }

  addMemberToGroup(param) {
    let options = {
      Token: "IBizzo",
      PartnerId: this.auth.getPartnerOrganizationId(),
      GroupId: param.groupId,
      MemberIdList: param.list,
    };
    return this.patch("Group/AddMembersToPartnerGroup", undefined, options);
  }

  getGroupDetails(id) {
    let options = {
      Token: "IBizzo",
      GroupId: id,
    };
    return this.get("Group/GetGroupDetails", options);
  }

  updateGroup(id, param) {
    let option = {
      Token: "IBizzo",
      Id: id,
    };
    return this.patch("Group/UpdateGroup", param, option);
  }

  getLocations() {
    return this.get("Group/GetAllStates", { Token: "IBizzo" });
  }
}
