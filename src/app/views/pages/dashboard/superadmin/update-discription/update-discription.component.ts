import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from "../../../../../../provider/user-profile/user-profile.service";

@Component({
  selector: 'kt-update-discription',
  templateUrl: './update-discription.component.html',
  styleUrls: ['./update-discription.component.scss']
})
export class UpdateDiscriptionComponent implements OnInit {
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
    private service:UserProfileService,
    private router:Router,
    public dialogRef:MatDialogRef<UpdateDiscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit() {
    console.log(this.data);
    
    this.initForm()
  }

  initForm() {
    this.form = this.fb.group({
      "longDescription": [""],
      "shortDescription": [''],
      "partnerRequestId": [0],
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
      this.form.controls.partnerRequestId.patchValue(this.data.requestId)
      let res:any=await this.service.updateDescription(this.form.value);
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
