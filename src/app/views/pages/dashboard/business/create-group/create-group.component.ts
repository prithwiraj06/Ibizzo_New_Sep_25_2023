import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MainSiteService } from '../../../../../../provider/main-site/main-site.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kt-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: [ './create-group.component.scss' ]
})
export class CreateGroupComponent implements OnInit {

  partnerRegister: FormGroup;
  finalOrgUrl: any;
  groupName: any;
  noOfPeople: any;
  memberId: any;
  toRegister: boolean = true;
  loading: boolean = false;

  constructor (
    private fb: FormBuilder,
    private mainSiteService: MainSiteService,
    private http: HttpClient,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
  ) {
    this.finalOrgUrl = JSON.parse(localStorage.getItem('memberData'));
    this.memberId = this.finalOrgUrl.memberUserInfo.id
  }

  ngOnInit() {
    this.initpartnerRegister();
  }

  initpartnerRegister() {
    this.partnerRegister = this.fb.group({
      groupName: [ this.groupName, Validators.compose([
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9]+[ ]?[a-zA-Z0-9]+)+$')
      ])
      ],
      noOfPeople: [
        this.noOfPeople, Validators.compose([
          Validators.required,
        ])
      ]
    });
  }

  onPartnerSubmit() {
    const controls = this.partnerRegister.controls;
    /** check form */
    if (this.partnerRegister.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[ controlName ].markAsTouched()
      );
      return;
    }
    this.loading = true;
    let data = {
      "memberId": this.memberId,
      "groupName": this.partnerRegister.controls[ 'groupName' ].value,
      "numberOfConnections": this.partnerRegister.controls[ 'noOfPeople' ].value,
      "applicationKey": "IBiz"
    }
    this.mainSiteService.postPartnerUser(data)
      .then((partnerRequest: any) => {
        if (partnerRequest.isRequestSent == true) {
          this.toastr.success('Partner request have been sent successfully');
          this.toRegister = false;
          this.loading = false;
          this.cd.detectChanges();
        }
        else if (partnerRequest.isRequestSent == false) {
          if (partnerRequest.message=='Duplicate') {
            this.toastr.success('Partner/Group request is Already Existed!');
            this.loading = false;
            this.cd.detectChanges();
          }
          else {
            this.toastr.error('Partner request have not been sent.');
            this.loading = false;
            this.cd.detectChanges();
          }
        }

      })
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.partnerRegister.controls[ controlName ];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    if (result) {
    }
    return result;
  }

}
