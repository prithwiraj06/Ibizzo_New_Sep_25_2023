import {
  Component, OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  MatDialog,
} from '@angular/material';
import { BaseService } from '../../../../../../provider/base-service/base.service'
import { SignUpService } from '../../../../../../../src/provider/sign-up/sign-up.service'
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordComponent } from '../change-password/change-password.component'
@Component({
  selector: 'kt-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  emailForm: FormGroup;
  email: any;
  fetching: boolean = false
  emailPattern: RegExp;
  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private fb: FormBuilder,
    private signUpService: SignUpService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private base: BaseService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.emailPattern = this.base.emailPattern
    this.initEmailForm();
  }

  initEmailForm() {

    this.emailForm = this.fb.group({
      email: [this.email, Validators.compose([
        Validators.required,
        Validators.pattern(this.emailPattern),
      ])
      ],
    });

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

    let userInfo = {
      emailId: this.email,
      phoneNumber: this.email,
      applicationKey: 'IBiz',
    };
    this.signUpService.addUsername(userInfo).then((res: any) => {
      this.fetching = false;
      if (res.isAuthenticated == true) {
        this.fetching = true
        let data = {
          "email": this.email,
          "appId": "IBiz"
        }

        this.signUpService.forgotPassword(data)
          .then((OTP: any) => {
            this.fetching = false;
            if (OTP.isEmailSent == true) {
              this.toastr.success('OTP has been sent to you email')
              this.dialogRef.close();
              const dialogRef = this.dialog.open(ChangePasswordComponent, {
                width: "450px",
                data: {
                  email: this.email, info: OTP
                }
              })
              dialogRef.afterClosed().subscribe(res => {
                if (!res) {
                  return;
                }
              });
            }
            else {
              this.toastr.error('OTP has not been sent to you email,please try again.')
            }

          })
      } else {
        this.toastr.error('This email is not Registered, please Register!');
        this.cd.detectChanges();
        return
      }
    });



    // this.dialogRef.close('submit');
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
