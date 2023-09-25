import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../../../environments/environment'
import { SuperadminService } from '../../../../../../provider/superadmin/superadmin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kt-helper-dialog',
  templateUrl: './helper-dialog.component.html',
  styleUrls: ['./helper-dialog.component.scss']
})
export class HelperDialogComponent implements OnInit {
  comments: any
  loading: boolean;
  constructor(
    public dialogRef: MatDialogRef<HelperDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private superAdmin: SuperadminService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }


  async addRegistration() {
    this.loading = true;
    this.cd.detectChanges();
    let info = {
      secretKey: environment.CARTSNAP_SECRET_KEY,
      ReferenceId: this.data.info.description.includes('#~#') ? this.data.info.description.split('#~#')[0] : this.data.info.description,
      Email: this.data.info.email,
      Comments: this.comments.trim(),
      Actions: this.data.id == 1 ? 'Approve' : 'Reject',
      PaymentId: this.data.info.id,
      Amount: this.data.info.amount,
      Type: this.data.type
    }
    console.log(info);
    let res: any = await this.superAdmin.approvedCart(info);
    if (res.message == 'Success') {
      this.toastr.success(this.data.id == 1 ? "Payment is successfuly Approved" : 'Payment is successfuly Rejected')
      this.dialogRef.close(true);
      this.loading = true;
      this.cd.detectChanges();
    }


  }

}
