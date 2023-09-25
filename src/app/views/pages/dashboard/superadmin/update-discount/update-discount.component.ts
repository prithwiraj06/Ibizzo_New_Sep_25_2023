import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SuperadminService } from "../../../../../../provider/superadmin/superadmin.service";



@Component({
  selector: 'kt-update-discount',
  templateUrl: './update-discount.component.html',
  styleUrls: ['./update-discount.component.scss']
})
export class UpdateDiscountComponent implements OnInit {
  loading: boolean;
  file: any;
  response: any='';
  form: FormGroup;
  @Input() ids:any=0;
  isUpdate:boolean;
  isRfq:any;

  constructor(private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private service:SuperadminService,
    private router:Router,
    public dialogRef:MatDialogRef<UpdateDiscountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit() {
    this.initForm()
    console.log(this.data);
    this.form.patchValue(this.data)
  }

  initForm() {
    this.form = this.fb.group({
      "offerName": [""],
      "offerPrice": [0],
      "offerDiscount": [0,Validators.required],
    });
  }
 

  isCheckControls(name: any, type: any) {
    const control = this.form.controls[name];
    const result = control.hasError(type) && (control.dirty || control.touched);
    return result;
  }

  async submit(){
    let controls = this.form.controls;
    if (this.form.invalid) {
      Object.keys(controls).forEach((key) => {
        controls[key].markAllAsTouched();
      });
      return;
    }

    try{
      let res:any=await this.service.updateDiscount(this.form.value,this.data.id);
      console.log(res);
      if(res&&res.message&&res.message=="success"){
        this.toastr.success(this.isUpdate?"Successfully Annoucement Updated":'Successfully Added')   
          this.dialogRef.close(res)
      }
      else{
        this.toastr.error(res.message)        
      }
    }
    catch(err){
      console.log(err);
      
    }



  }

}
