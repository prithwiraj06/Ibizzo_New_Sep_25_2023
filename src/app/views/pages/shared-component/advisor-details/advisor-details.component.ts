import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from '@angular/material';
import { SubscriptionService } from '../../../../../provider/subscription/subscription.service';
import { BaseService } from '../../../../../provider/base-service/base.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kt-advisor-details',
  templateUrl: './advisor-details.component.html',
  styleUrls: ['./advisor-details.component.scss']
})
export class AdvisorDetailsComponent implements OnInit {
  public userForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<AdvisorDetailsComponent>,
    private base: BaseService,
    private service: SubscriptionService,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
    this.creteForm();
    setTimeout(() => {
      this.dialogRef.close()
    }, 20000)
  }

  creteForm() {
    this.userForm = this.fb.group({
      email: ["", Validators.pattern(this.base.emailPattern)],
      name: [""],
      phoneNumber: ["", Validators.required],
      source: ['wibsite']
    })
  }

  isCheckControls(name: any, type: any) {
    const control = this.userForm.controls[name];
    const result = control.hasError(type) && (control.dirty || control.touched);
    return result;
  }

  async submit() {
    console.log(this.userForm.value)
    let res: any = await this.service.visterDetails(this.userForm.value);
    console.log(res);
    if (res.message == 'Successfully created') {
      this.toaster.success("Your Request Is Sented Successfully")
      this.dialogRef.close(res)
    }
    else {
      this.toaster.error("Request is Failed, Please try again!");
    }

  }

}
