import { Injectable } from '@angular/core';
import { BaseService } from '../base-service/base.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CommentsService extends BaseService {

  constructor(
    private _http: HttpClient
  ) {
    super(_http);
  }
  getAllComments(data) {
    return this.get("InviteMember/GetAllComments", data)

  }
  addComments(data) {
    return this.post("InviteMember/AddComments", undefined, data)
  }
  getInvitedHistory(data) {
    return this.get("InviteMember/GetInviteHistory", data)
  }
}
