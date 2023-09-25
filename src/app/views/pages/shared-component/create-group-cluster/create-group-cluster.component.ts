import { Component, OnInit, Input, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { SuggestedClustersService } from '../../../../../provider/suggested-cluster/suggested-clusters.service';
import { AuthService } from '../../auth/auth.service';
import { UserProfileService } from '../../../../../provider/user-profile/user-profile.service';
import { BusinessCategoryLookupComponent } from '../../../../components/business-category-lookup/business-category-lookup.component';
import * as _ from 'underscore'
import { Router } from '@angular/router';
import { BaseUrlPipe } from '../../../../core/_base/layout/pipes/base-url';

@Component({
  selector: 'kt-create-group-cluster',
  templateUrl: './create-group-cluster.component.html',
  styleUrls: ['./create-group-cluster.component.scss']
})
export class CreateGroupClusterComponent implements OnInit {
  form: FormGroup;
  fileLoading: boolean;
  @Input() update: any;
  @Input() isPartner: any = false;
  business: any = [];
  isCategory: boolean;
  description: any = "";
  fileName: any = "";
  businessCategory: any = []
  list: boolean = true;
  no_image: any = '../../../../../assets/images/No_image.png';
  keyWordsList: FormArray;


  @ViewChild('businessCategoryCom', { static: false }) public businessCategoryCom: BusinessCategoryLookupComponent
  logo: string = '';
  locations: any;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateGroupClusterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cluster: SuggestedClustersService,
    private authService: AuthService,
    private userProfile: UserProfileService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private baseUrlPipe: BaseUrlPipe,

  ) { }

  ngOnInit() {
    console.log(this.data);
    this.initForm();
    this.getLocation();
    if (this.data && this.data.group) {
      if (this.data.isCheck) {
        this.isPartner = true;
      }
      this.getGroupDetails();
    }
  }

  async getLocation() {
    this.locations = await this.cluster.getLocations();
  }
  async getGroupDetails() {
    let res: any = await this.cluster.getGroupDetails(this.data.id);
    console.log(res);
    this.form.patchValue(res);
    if (res && res.keywords) {
    this.handleFormArray('keyWordsList',res.keywords)
    }
    this.description = res.description;
    if (res && res.icon) {
      this.logo = this.userProfile.downloadImage(res.icon);
    }
    this.fileName = res.icon;
    let option = {
      name: res.businessCategoryName,
      categoryId: res.businessCategoryName
    }
    this.businessCategoryCom.setCategory(option);
    this.cd.detectChanges();
  }

  initForm() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      businessCategoryName: [],
      type: [null, Validators.required],
      location: [null],
      primaryColor: '#CC0011',
      secondaryColor: '#FFFFFF',
      choseFile: [],
      description: '',
      keyWordsList: this.fb.array([this.createForm1()]),
    });
  }

  formObjectToArray(list) {
    let array: any = [];
    if (list) {
      list.forEach((key) => {
        if (key.value) {
          array.push(key.value);
        }
      });
    }
    return array;
  }

  hasControl(controlName: string) {
    return this.form.controls[controlName];
  }

    //for incresing fields of keyword and description
  handleFormArray(key, list) {
    let keyWords=list.split(',')
      let formArray = this.form.controls[key] as FormArray;
  
      formArray.removeAt(0);
      _.each(keyWords, (key) => {
        if (key) {
          formArray.push(this.createForm1(key));
        }
      });
    }

    //handle description and keyword case
    addCell(key) {
      let feildName = this.form.get(key) as FormArray;
      feildName.push(this.createForm1());
      this.keyWordsList = feildName;
    }
  
    //dynamic create form
    createForm1(value?: any) {
      return this.fb.group({
        value: value || "",
      });
    }

  onColorChange(color, event) {
    if (color == 'secondaryColor') {
      this.form.controls.secondaryColor.setValue(event.color);
    }
    else {
      this.form.controls.primaryColor.setValue(event.color);
    }
    console.log(color, event);
  }

  onBusinessCategoryChange(event) {
    this.form.patchValue({
      businessCategoryName: event[0].name
    })
    // this.businessCategory = []
    // _.each(event, (item) => {
    //   this.businessCategory.push(item.name)
    // })

    this.isCategory = false;
    console.log(event);
  }

  getImage(logo) {
    if (logo == "") {
      return true;
    }
    else {
      return false;
    }
  }

  invertColor(hex: string) {
    if (hex) {
      if (hex.indexOf("#") === 0) {
        hex = hex.slice(1);
      }
      // convert 3-digit hex to 6-digits.
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length !== 6) {
        return "#000000";
        // throw new Error('Invalid HEX color.');
      }
      // invert color components
      var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
      // pad each with zeros and return
      return "#" + this.padZero(r) + this.padZero(g) + this.padZero(b);
    }
  }

  padZero(str: string, len?: number) {
    len = len || 2;
    var zeros = new Array(len).join("0");
    return (zeros + str).slice(-len);
  }

  async submitCluster() {
    console.log(this.description);

    const controls = this.form.controls;
    /** check form */
    if (!this.form.controls.businessCategoryName.value) {
      this.isCategory = true
    }
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    let param
    if (this.data.isCheck) {
      param = {
        "name": this.form.controls.name.value,
        "businessCategoryName": this.form.controls.businessCategoryName.value,
        "type": this.form.controls.type.value,
        "location": this.form.controls.location.value ? this.form.controls.location.value : "India",
        "description": this.description,
        "primaryColor": this.form.controls.primaryColor.value,
        "secondaryColor": this.form.controls.secondaryColor.value,
        icon: this.fileName,
        keywords:this.formObjectToArray(this.form.value.keyWordsList)
      }
    }
    else {
      param = {
        "name": this.form.controls.name.value,
        "businessCategoryName": this.form.controls.businessCategoryName.value,
        "type": this.form.controls.type.value,
        "location": this.form.controls.location.value ? this.form.controls.location.value : "India",
        partnerId: this.isPartner ? this.authService.getPartnerOrganizationId() : 0,
        "ownerId": this.authService.getUserId(),
        "description": this.description,
        "primaryColor": this.form.controls.primaryColor.value,
        "secondaryColor": this.form.controls.secondaryColor.value,
        "token": "IBizzo",
        icon: this.fileName,
        keywords:this.formObjectToArray(this.form.value.keyWordsList)
      }
    }


    if (this.data && this.data.group) {
      let update: any = await this.cluster.updateGroup(this.data.id, param);
      console.log(update);
      if (update.message == 'Groups updated Successfuly') {
        this.toastr.success('Group is updated sucessfully');
        this.dialogRef.close();
      }
      else {
        this.toastr.error(update.message)
      }
    }
    else {
      let res: any = await this.cluster.createClustersGroup(param);
      console.log(res);
      if (res.message == 'Groups Were Added Successfuly') {
        this.toastr.success('Group created successfully');
        if (this.isPartner && this.isPartner.length > 0) {
          this.router.navigate([this.baseUrlPipe.transform(['/dashboard/partner/home'])]);
        }
        else {
          this.dialogRef.close(res);
        }
      }
      else {
        this.toastr.error('Group creation is failed')
      }
    }

  }

  async onFileChange(event: any) {
    this.fileLoading = true;
    let docFiles = event.target.files;
    for (let docFile of docFiles) {
      if (docFile.size < 5000000) {
        try {
          let res = await this.userProfile.uploadImage(docFile);
          if (res) {
            this.logo = this.userProfile.downloadImage(res);
            // this.form.controls.choseFile.setValue(res);
            this.fileName = res;
            this.fileLoading = false;
            this.cd.detectChanges();
          }
        }
        catch (err) {
          this.fileLoading = false;
          this.cd.detectChanges();
          console.log(err);

          this.toastr.error("Image is not Uploaded")
        }

      }
      else {
        this.fileLoading = false;
        this.toastr.error("Please Upload image Size less than 5 MB")
        break;
      }
    }

  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  getTitle() {
    if (this.isPartner && !this.data.isCheck) {
      return 'Submit'
    }
    else {
      return (this.data && this.data.group) ? 'Update' : 'Submit';
    }
  }

  getGroupTitle() {
    if (this.isPartner && !this.data.isCheck) {
      return "Create a new Group";
    }
    else {
      return (this.data && this.data.group) ? 'Updated the Group' : 'Create a new Group';
    }
  }


  close() {
    this.logo = "";
    this.fileName = "";
    this.form.controls.choseFile.reset();
    this.cd.detectChanges();
  }

}
