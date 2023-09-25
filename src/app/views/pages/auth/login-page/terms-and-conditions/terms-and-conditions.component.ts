import { Component, OnInit, Inject, } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA} from '@angular/material';
import { PartnerService } from '../../../../../../provider/partner/partner.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kt-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  myOrganizationName:any;

  constructor(
    public dialogRef: MatDialogRef<TermsAndConditionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private partnerService: PartnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.myOrganizationName = this.data.partnerInfo
  }

  onAgree(){
    this.partnerService.agreeTandC(this.data.token)
    .then((res: any) => {
      if(res.isUdpated){
        this.dialogRef.close();
        this.toastr.success('updated successfully');
        this.dialogRef.close('updated')
      }
    })
  }

}
