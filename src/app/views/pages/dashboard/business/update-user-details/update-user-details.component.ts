import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BaseService } from '../../../../../../provider/base-service/base.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { InviteService } from '../../../../../../provider/invite/invite.service';
import { AuthService } from '../../../auth/auth.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Logout } from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import {environment} from '../../../../../../environments/environment'

@Component({
  selector: 'kt-update-user-details',
  templateUrl: './update-user-details.component.html',
  styleUrls: ['./update-user-details.component.scss']
})
export class UpdateUserDetailsComponent implements OnInit {
  public userForm: FormGroup;
  editEmail: any;
  editPhone: any;
  isCheck: boolean;
  otpNum: boolean;
  otp: any = ''
  isOtp: boolean;
  loading: boolean;
  result: any;
  constructor(
    private fb: FormBuilder,
    private base: BaseService,
    public dialogRef: MatDialogRef<UpdateUserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private invite: InviteService,
    private auth: AuthService,
    private store: Store<AppState>,

  ) { }

  ngOnInit() {
    if (this.data.event == 'email') {
      this.editEmail = true;
    }
    else {
      this.editPhone = true;
    }
    this.createForm();
  }

  createForm() {
    if (this.editEmail) {
      this.userForm = this.fb.group({
        currentEmail: [this.data.user],
        email: ['', [Validators.required,
        Validators.pattern(this.base.emailPattern)]],
        conformEmail: [''],
        check_User: [false],
        check_Commu: [true]
      })
    }
    else {
      this.userForm = this.fb.group({
        currentPhone: [this.data.user],
        phone: ['', [Validators.required, Validators.minLength(10)]],
        conformPhone: ['']
      })
    }

  }

  compare() {
    if (this.userForm.controls.conformPhone.value) {
      if (this.userForm.controls.phone.value != this.userForm.controls.conformPhone.value) {
        this.isCheck = true;
      }
      else {
        this.isCheck = false;
      }
    }
  }

  compareEmail() {
    if (this.userForm.controls.email.value != this.userForm.controls.conformEmail.value) {
      this.isCheck = true;
    }
    else {
      this.isCheck = false;
    }
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.userForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  async submit(event?: any) {
    this.otp = ''
    let controls = this.userForm.controls;

    if (this.userForm.invalid) {
      this.compareEmail();
      this.toastr.warning("Please fill all the required fields to continue");
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    if (event == 'email') {
      if (this.userForm.controls.email.value != this.userForm.controls.conformEmail.value) {
        this.isCheck = true;
        return;
      }
      else {
        let msg;
        this.loading = true;
        let params = {
          Token: "IBizzo",
          NewEmail: this.userForm.controls.email.value,
          OldEmail: this.userForm.controls.currentEmail.value,
          MemberId: this.auth.getUserId()
        }
        if (this.userForm.controls.check_User.value && this.userForm.controls.check_Commu.value) {
          msg = "User Id And Communication"
        }
        else if (this.userForm.controls.check_User.value) {
          msg = 'User Id'
        }
        else {
          this.userForm.controls.check_Commu.setValue(true);
          msg = "Communication"
        }
        Swal.fire({
          title: 'Are You Sure to Update Email for the ' + msg,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancel',
        }).then(async (result: any) => {
          if (result && result.value) {
            let res: any = await this.invite.updateDetails(params);
            this.result = res
            if (res && res.isEmailSent) {
              this.otpNum = true;
            }
            else {
              this.toastr.error("Email already exist")
            }
          }
          this.loading = false;
        })

      }
    }
    else {
      if (this.userForm.controls.phone.value != this.userForm.controls.conformPhone.value) {
        this.isCheck = true;
        return;
      }
      else {
        this.loading = true;
        let newNum = '%2B91' + this.userForm.controls.phone.value;
        let oldNum = this.userForm.controls.currentPhone.value.includes("+") ? encodeURIComponent(this.userForm.controls.currentPhone.value) : this.userForm.controls.currentPhone.value;
        let params = {
          Token: "IBizzo",
          NewPhoneNumber: newNum.toString(),
          OldPhoneNumber: oldNum,
          MemberId: this.auth.getUserId()
        }
        Swal.fire({
          title: 'Are You Sure to Update Phone Number',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancel',
        }).then(async (result: any) => {
          if (result && result.value) {
            let res: any = await this.invite.updatePhoneNumber(params);
            if (res && res.isSmsSent) {
              this.otpNum = true;
            }
            else {
              this.toastr.error("Phone number already exist")
            }
          }
          this.loading = false;
        })
      }
    }



  }

  async otpSubmit() {
    let param;
    if (!this.otp) {
      return
    }
    this.loading = true;
    let memberInfo = this.auth.getCurrentUser();
    if (this.editEmail) {
      param = {
        memberId: this.auth.getUserId(),
        email: this.userForm.controls.email.value,
        phoneNumber: '',
        otp: this.otp.toString(),
        isUserId: this.userForm.controls.check_User.value ? true : false,
        communicationEmail: this.userForm.controls.email.value,
        type: 1,
        token: this.result.token
      }
    }
    else {
      let newNum = '+91' + this.userForm.controls.phone.value

      param = {
        memberId: this.auth.getUserId(),
        email: '',
        phoneNumber: newNum,
        otp: this.otp.toString(),
        type: 2
      }

    }
    let res: any = await this.invite.updatedUserDetails(param)
    if (res && res.message == 'Invalid OTP') {
      this.loading = false;
      this.toastr.error("Invalid OTP");
    }
    else {
      this.toastr.success(this.editEmail ? "Email is successfully updated" : 'Phone number is changed successfully');
      this.loading = false;
      if ((this.editEmail && this.userForm.controls.check_User.value) || this.editPhone) {
        this.store.dispatch(new Logout());
        localStorage.removeItem('memberData');
        localStorage.removeItem('previousRfq');
        window.location.href = environment.SEO_URL+'/logout';
        this.dialogRef.close(true)
      }
      else {
        this.dialogRef.close()
      }

    }

  }


}
