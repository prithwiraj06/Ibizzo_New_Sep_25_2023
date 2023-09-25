import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { CommentsService } from '../../../../../../provider/comments/comments.service'
import moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'underscore';

@Component({
  selector: 'kt-see-history',
  templateUrl: './see-history.component.html',
  styleUrls: ['./see-history.component.scss']
})
export class SeeHistoryComponent implements OnInit {
  comment: string = '';
  listComments: any = [];
  dateToFormate: string = '';
  inviteDate: string = '';
  reInviteDate: string = '';
  constructor(private commentService: CommentsService,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<SeeHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.getInviteHistory();
  }

  getMessageClass(message: any) {
    let className: string = 'kt-chat__message';
    className += ' kt-chat__message--right';
    return className;
  }

  async addComment() {
    let exp = RegExp(/^[^-\s][a-zA-Z0-9_\s-]+$/);
    let data1 = exp.test(this.comment.trim());

    if (data1) {
      let data = {
        'token': "IBizzo",
        'comments': this.comment.trim(),
        'tmpMemberId': this.data.id
      }
      await this.commentService.addComments(data);
      this.getInviteHistory();
      this.comment = "";
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      //  scroll to bottom
      let container: HTMLElement = document.getElementById("inviteHistoryContainer");
      container.scrollTop = container.scrollHeight;
    }, 1000);
  }

  async getInviteHistory() {
    let data = {
      'token': "IBizzo",
      'memberId': this.data.id
    }
    try {
      let res: any = await this.commentService.getInvitedHistory(data);
      this.listComments = res.comments;
      this.scrollToBottom();
      this.cd.detectChanges();
    }
    catch (e) {
      console.log(e)
    }
  }

}
