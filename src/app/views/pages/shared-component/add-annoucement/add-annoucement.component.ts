import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from "../../../../../provider/user-profile/user-profile.service";

@Component({
  selector: 'kt-add-annoucement',
  templateUrl: './add-annoucement.component.html',
  styleUrls: ['./add-annoucement.component.scss']
})
export class AddAnnoucementComponent implements OnInit {
  loading: boolean;
  file: any;
  response: any='';
  form: FormGroup;
  @Input() ids:any=0;
  isUpdate:boolean;
  isRfq:any

  constructor(private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private service:UserProfileService,
    private router:Router
  ) { }

  ngOnInit() {
    this.initForm()
    if(this.ids!=0){
    this.isUpdate=true;
    this.patchValues()
    }
  }

  getImage() {
    if (this.response) {
      return this.service.getImageUrl(this.form.value.image, "GetAnnouncementDownload");
    } else {
      return "https://www.gumtree.com/static/1/resources/assets/rwd/images/orphans/a37b37d99e7cef805f354d47.noimage_thumbnail.png";
    }
  }

  initForm() {
    this.form = this.fb.group({
      "title": ['', Validators.required],
      "description": ['', Validators.required],
      "linkToPage": ['',Validators.pattern("https?://.+")],
      "announcementId": [0],
      "image": [''],
    });
  }

  async patchValues(){
    let res:any=await this.service.getAnnoucement(this.ids);
    console.log(res);
    this.cd.detectChanges();
    this.response=res[0].image;
    this.form.patchValue(res[0]);
    this.cd.detectChanges();
  }


  deleteImage() {
    this.response = undefined;
  }

  async fileUpload(event) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        if (file.size < 1200000) {
          this.loading = true;
          reader.onload = (e: any) => { };
          reader.readAsDataURL(file);
          try {
            this.file = file;
            this.response = await this.service.uploadAnnoucementImage(file);
            this.form.controls.image.setValue(this.response.replace(
              /['"]+/g,
              ""
            ));
            this.loading = false;
            this.cd.detectChanges();
          } catch (e) {
            this.loading = false;
            this.cd.detectChanges();
            console.log(e);
          }
        } else {
          this.toastr.error("Please Upload image Size less than 1 MB.");
        }
      }
    }
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
      let res:any=await this.service.addAnnoucement(this.form.value);
      console.log(res);
      if(res&&res.message&&res.message=="Success"){
        this.toastr.success(this.isUpdate?"Successfully Annoucement Updated":'Successfully Added Annoucement')   
          this.router.navigate(['/main/dashboard/admin/annoucement-list'])
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
