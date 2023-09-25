import { Component, OnInit, ViewChild } from '@angular/core';
import { InviteSettingsComponent } from '../invite-settings/invite-settings.component';
import { MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'kt-re-invite',
  templateUrl: './re-invite.component.html',
  styleUrls: ['./re-invite.component.scss']
})
export class ReInviteComponent implements OnInit {
  @ViewChild('invitationComposer', { static: false })
  invitationComposer: InviteSettingsComponent;
  constructor(private dialogRef: MatDialogRef<ReInviteComponent>,
    private toast: ToastrService) { }

  ngOnInit() {
  }

  async sent() {
    try {
      let data = await this.invitationComposer.submit()
      if (data) {
        this.dialogRef.close(true)
      }
      else {
        this.toast.error("Error in save template")
        this.dialogRef.close();
      }
    }
    catch{
      this.toast.error("Error in save template")
      this.dialogRef.close()
    }
  }

  cancel(){
    this.dialogRef.close()
  }

}
