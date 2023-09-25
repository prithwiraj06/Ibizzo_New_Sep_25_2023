import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SuperadminService } from '../../../../../../provider/superadmin/superadmin.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-addnewpackage',
  templateUrl: './addnewpackage.component.html',
  styleUrls: ['./addnewpackage.component.scss']
})
export class AddNewPackageComponent implements OnInit {
  form: FormGroup;
  f: any;
  loading: boolean = false;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private supperAdminservice: SuperadminService,
    public dialogRef: MatDialogRef<AddNewPackageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
    this.initform();
    this.getPackageInfo();
  }

  initform() {
    this.form = this.fb.group({
      packageName: ['', Validators.required],
      packageType: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')
      ]],
      description: ['', Validators.required],
      duration: ['', Validators.required]
    });

  }
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
  async submit() {
    let validate: boolean = false;
    this.loading = true;
    this.f = this.form.controls
    if (this.form.invalid) {
      validate = true;
      this.toastr.error('Please fill the required field');
      return;
    }
    if (Object.keys(this.data).length > 0) {
      let data = {
        'Description': this.f.description.value,
        'DurationType': this.f.duration.value,
        'Name': this.f.packageName.value,
        'PackageTypeId': this.f.packageType.value,
        'price': this.f.price.value,
        'applicationKey': "IBiz"
      }
  let res= await this.supperAdminservice.getUpdatePackage(data)

      this.loading = false;

      this.dialogRef.close(res);
      this.toastr.success('New package is added successfully')
    }
    else {
      let data = {
        'Description': this.f.description.value,
        'DurationType': this.f.duration.value,
        'Name': this.f.packageName.value,
        'PackageTypeId': this.f.packageType.value,
        'price': this.f.price.value,
        'applicationKey': "IBiz"
      }
      this.supperAdminservice.getAddPackage(data);
      this.loading = false;

      this.dialogRef.close();
      this.toastr.success('Package saved successfully')
    }

  }

  getPackageInfo() {
    if (Object.keys(this.data).length > 0) {
      let packageDetails = {
        description: this.data.description,
        packageName: this.data.name,
        packageType: this.data.packageTypeId,
        duration: this.data.durationType,
        price: this.data.price
      }
      this.form.patchValue(packageDetails);
      this.form.controls.packageName.disable();
    }

  }
  cancel() {
    this.dialogRef.close();
  }
}
