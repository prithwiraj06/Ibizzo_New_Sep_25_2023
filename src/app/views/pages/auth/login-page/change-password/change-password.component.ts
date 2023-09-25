import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { SignUpService } from '../../../../../../../src/provider/sign-up/sign-up.service'
import { ToastrService } from 'ngx-toastr';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { BaseService } from '../../../../../../provider/base-service/base.service'
@Component({
  selector: 'kt-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  emailForm: FormGroup;
  email: any;
  OTP: any;
  newPassword: any;
  confirmPassword: any;
  fetching: boolean = false;
  emailPattren: any;
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private fb: FormBuilder,
    private base: BaseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private signUpService: SignUpService,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.emailPattren = this.base.emailPattern;
    this.email = this.data.email;
    this.initEmailForm();
  }


  initEmailForm() {

    this.emailForm = this.fb.group({
      email: [this.email, Validators.compose([
        Validators.required,
        Validators.pattern(this.emailPattren),
      ])
      ],
      OTP: [this.OTP, Validators.compose([
        Validators.required
      ])
      ],
      newPassword: ['', Validators.compose([
        Validators.required, Validators.pattern('^[a-zA-Z0-9!@#$%^&*()_+=-]{7,}$')
      ])
      ],
      confirmPassword: ['', Validators.compose([
        Validators.required, Validators.pattern('^[a-zA-Z0-9!@#$%^&*()_+=-]{7,}$')
      ])
      ],
    },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      })

  }

  onSubmit() {
    const controls = this.emailForm.controls;
    /** check form */
    if (this.emailForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.fetching = true;
    let data = {
      "email": this.data.email,
      "token": this.data.info.token,
      "otp": this.emailForm.controls['OTP'].value,
      "newPassword": this.emailForm.controls['newPassword'].value,
      "confirmPassword": this.emailForm.controls['confirmPassword'].value,
      "appId": "IBiz"
    }
    this.signUpService.changePassword(data)
      .then((res: any) => {
        console.log("Result",res);
        if (res.message == 'Password updated') {
          this.fetching = false
          this.toastr.success('Password changed successfully')
          this.dialogRef.close();
        }
        else {
          this.fetching = false
          this.toastr.error('OTP is Mismatch')
        }
       
      })
  }

  onClose() {
    this.dialogRef.close();
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.emailForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    if (result) {
    }
    return result;
  }

}
