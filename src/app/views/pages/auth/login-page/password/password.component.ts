import { Component, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
@Component({
  selector: 'kt-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  passwordForm: FormGroup;
  password: any;
  constructor(
    public dialogRef: MatDialogRef<PasswordComponent>,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.initPasswordForm();
  }

  initPasswordForm() {
    this.passwordForm = this.fb.group({
      password: [this.password, Validators.compose([
        Validators.required,
        // Validators.pattern("^[0-9a-zA-Z]{6,}$"),
      ])
      ],
    });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.passwordForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    if (result) {
    }
    return result;
  }

  onSubmit() {
    const controls = this.passwordForm.controls;
    /** check form */
    if (this.passwordForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.dialogRef.close('close');
  }

  onClose() {
    this.dialogRef.close();
  }

  forgotPassword() {
    this.dialogRef.close('forgotPassword');
  }
}
