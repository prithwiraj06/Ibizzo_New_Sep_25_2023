import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { UserProfileService } from "../../../../../../provider/user-profile/user-profile.service";
import { PartnerService } from "../../../../../../provider/partner/partner.service";
import { AuthService } from "../../../../../views/pages/auth/auth.service";
import _ from "lodash";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
@Component({
  selector: "kt-partner-logo",
  templateUrl: "./partner-logo.component.html",
  styleUrls: ["./partner-logo.component.scss"],
})
export class PartnerLogoComponent implements OnInit {
  response: any;
  loading: boolean = false;
  file: any;
  accentColor: any = "";
  alternateColor: any = "";
  isChk: boolean = false;
  partnerInfo: any;
  partnerData: any[];
  form: FormGroup;
  keyWordsList: FormArray;

  constructor(
    public dialogRef: MatDialogRef<PartnerLogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private service: UserProfileService,
    private cd: ChangeDetectorRef,
    private partnerService: PartnerService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {}

  async ngOnInit() {
    this.initForm()
    this.partnerInfo = this.authService.getCurrentUser();
    this.partnerService.getPartners()
    .then((res: any) => {
      let self = this;
      this.partnerData = _.filter(res.socialOrganizationInfo, function (item) {
        return item.id == self.partnerInfo.partnerInfo.id;
      });
      this.alternateColor = this.partnerData[0].alternateColor;
      this.accentColor = this.partnerData[0].accentColor;
      this.isChk = this.partnerData[0].showCompanyName == 1 ? true : false;
      this.response = this.partnerData[0].logo;
      if (this.partnerData[0] && this.partnerData[0].keywords) {
      this.handleFormArray('keyWordsList',this.partnerData[0].keywords)
      }
      console.log(this.response);
    })
    .catch((err)=>{
      console.log("============>",err);

      
    })

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

  initForm() {
    this.form = this.fb.group({
      keyWordsList: this.fb.array([this.createForm1()]),
    });
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

  async fileUpload(event) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        if (file.size < 1200000) {
          this.loading = true;
          reader.onload = (e: any) => {};
          reader.readAsDataURL(file);
          try {
            this.file = file;
            this.response = await this.service.uploadPartnerLogo(file);
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

  getImage() {
    if (this.response) {
      return this.service.getImageUrl(this.response, "GetDownloadPartnerLogo");
    } else {
      return "https://www.gumtree.com/static/1/resources/assets/rwd/images/orphans/a37b37d99e7cef805f354d47.noimage_thumbnail.png";
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

  public onColorChange(event: string, data: any): void {    
    if (event == "alternateColor") {
      this.alternateColor = data.color;
    } else {
      this.accentColor = data.color;
    }
  }

  padZero(str: string, len?: number) {
    len = len || 2;
    var zeros = new Array(len).join("0");
    return (zeros + str).slice(-len);
  }

  async submit() {
    this.loading = true;
    try {
      let owner: any = await this.service.getOrganizationOwner(
        this.authService.getUserId()
      );
      console.log(this.response);
     let res:any= await this.service.updatePartnerDetails({
        logo: this.response,
        accentColor: this.accentColor,
        alternateColor: this.alternateColor,
        showCompanyName: this.isChk ? 1 : 0,
        orgId: this.authService.getPartnerOrganizationId(),
        partnerId: this.authService.getUserId(),
       message: "string",
       keywords:this.formObjectToArray(this.form.value.keyWordsList)
     });
      if (res && res.message) {
        this.toastr.success("partner details updated successfully");
        this.dialogRef.close();
        this.loading = false;
        this.cd.detectChanges();
        window.location.reload();
      }
      else {
        this.toastr.success("Failed to Update partner details");
        this.loading = false;
        this.cd.detectChanges();
      }
    
    } catch (e) {
      this.toastr.error("partner details Failed");
      this.loading = false;
      this.cd.detectChanges();
    }
  }

  deleteImage() {
    this.response = undefined;
  }
}
