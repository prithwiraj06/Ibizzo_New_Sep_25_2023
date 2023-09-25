import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { CommentsService } from '../../../../../../provider/comments/comments.service'
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-add-comments',
  templateUrl: './add-comments.component.html',
  styleUrls: ['./add-comments.component.scss']
})
export class AddCommentsComponent implements OnInit {
  comment: string = '';
  listComments: any = [];

  constructor(private commentService: CommentsService,
    private cd: ChangeDetectorRef,
    private toast: ToastrService,
    public dialogRef: MatDialogRef<AddCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
  }
  async addComment() {
    if (this.comment) {
      let data = {
        'token': "IBizzo",
        'comments': this.comment,
        'tmpMemberId': this.data.id
      }
      this.commentService.addComments(data)
      this.toast.success("Your comment is successfully added")
      this.comment = "";
      this.dialogRef.close();

    }
    else {
      this.toast.error("Please enter your comment")
    }

  }

}
