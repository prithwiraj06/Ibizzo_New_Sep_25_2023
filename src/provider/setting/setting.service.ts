import { Injectable } from "@angular/core";
import { BaseService } from "../base-service/base.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SettingService extends BaseService {
  constructor(private _http: HttpClient) {
    super(_http);
  }

  getGroupMember(param) {
    let parmas: any = {
      Token: "IBizzo",
      GroupId: param.groupId,
      pageNumber: param.pageNumber,
      records: param.records,
    };
    return this.get("Group/GetGroupsMemberList", parmas);
  }
  getGroupCommentsList(param) {
    let parmas: any = {
      Token: "IBizzo",
      pageNumber: param.pageNumber,
      records: param.records,
      GroupPostId: param.postId,
    };
    return this.get("Group/GetGroupCommentsList", parmas);
  }
  createGroupComments(payload) {
    let param: any = {
      Token: "IBizzo",
    };
    return this.post("Group/CreateGroupComments", payload, param);
  }
  createGroupPosts(payload) {
    let param: any = {
      Token: "IBizzo",
    };
    return this.post("Group/CreateGroupPosts", payload, param);
  }
  getNonAdminGroupList(param) {
    let parmas: any = {
      Token: "IBizzo",
      GroupId: param.groupId,
      pageNumber: param.pageNumber,
      records: param.records,
    };
    return this.get("Group/GetNonAdminGroupList", parmas);
  }
  validateGroupMembership(param) {
    let parmas: any = {
      Token: "IBizzo",
      MemberId: param.memberId,
      GroupId: parseInt(param.groupId),
      isMember: param.isMember,
    };
    return this.patch("Group/ValidateGroupMembership", null, parmas);
  }
  getGroupPostsList(param) {
    let params: any = {
      Token: "IBizzo",
      GroupId: param.id,
      pageNumber: param.pageNumber,
      records: param.records,
    };
    return this.get("Group/GetGroupPostsList", params);
  }
  groupMemberInvite(payload) {
    let params = {
      Token: "IBizzo",
    };
    return this.post("InviteMember/GroupMemberInvite", payload, params);
  }
  getGroupProductList(param) {
    let parmas: any = {
      Token: "IBizzo",
      GroupId: param.groupId,
      pageNumber: param.pageNumber,
      records: param.records,
    };
    return this.get("Group/GetGroupProducts", parmas);
  }
  getGroupPublicStats(param) {
    let parmas: any = {
      Token: "IBizzo",
      GroupId: param.groupId,
    };
    return this.get("Group/GetGroupPublicStats", parmas);
  }

  getGroupMemberList(param) {
    let params: any = {
      Token: "IBizzo",
      GroupId: param.groupId,
      pageNumber: param.pageNumber,
      records: param.records,
    };

    return this.get("Group/GetGroupsMemberList", params);
  }
  getGroupMemberDetails(param) {
    let params: any = {
      Token: "IBizzo",
      GroupId: param.groupId,
      MemberId: param.memberId,
      pageNumber: param.pageNumber,
      records: param.records,
    };
    return this.get("Group/GetGroupMemberDetails", params);
  }
}
