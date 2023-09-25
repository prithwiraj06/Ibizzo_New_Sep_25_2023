import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { NewsletterService } from '../../../../../../provider/newsletter/newsletter.service';
import { AuthService } from '../../../auth/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BaseService } from '../../../../../../provider/base-service/base.service'
import Swal from 'sweetalert2'
import { NewsletterTemplateComponent } from '../../../shared-component/newsletter-template/newsletter-template.component';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../../../../../provider/user-profile/user-profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kt-create-newsletter',
  templateUrl: './create-newsletter.component.html',
  styleUrls: ['./create-newsletter.component.scss']
})
export class CreateNewsletterComponent implements OnInit {
  templateForm: FormGroup;
  createNew: boolean = false;
  templateList: any = [];
  memberData: any;
  emailPattern: RegExp;
  _editor: any;
  loading: boolean;
  count = 0;
  @ViewChild('newsletter', { static: false }) newsletter: NewsletterTemplateComponent
  partnerPageUrl: string;
  useTemplate: void;
  templateName: any = '';
  isCreate: any;
  subscibersCount: any;
  id: any;
  info: boolean = false
  sentMessage: any;
  loadingSave: boolean;
  isNewsLetter: any;
  constructor(
    private formBuilder: FormBuilder,
    private newsletterService: NewsletterService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private base: BaseService,
    private router: Router,
    private userProfile: UserProfileService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,


  ) { }

  ngOnInit() {
    this.memberData = this.authService.getCurrentUser()
    this.isCreate = JSON.parse(localStorage.getItem('template'))
    this.createForm()
    if (this.isCreate && this.isCreate.create == 'no') {
      this.useTemplate = this.isCreate
      this.templateName = this.isCreate.templateName;
    }
    let id = this.memberData.partnerInfo ? parseInt(this.memberData.partnerInfo.id) : 1;
    let data: any = {
      'Token': 'IBizzo',
      'OrgId': id,
      'Page': 1,
      'NoOfRecs': 100,
    }
    this.newsletterService.getSubscribers(data)
      .then((res: any) => {
        this.subscibersCount = res.mebmbers[0].cnt
      })

    this.activatedRoute.queryParams.subscribe((param: any) => {
      if (param && param.id) {
        let params = {
          Token: 'IBizzo',
          MemberId: this.authService.getUserId(),
          CompanyId: this.authService.getCompanyId()
        }
        this.newsletterService.getDraftNewsLetter(params)
          .then((res: any) => {
            this.isNewsLetter = res.templates[0];
            this.templateForm.patchValue(res.templates[0])
            this.cd.detectChanges();
          })
      }

    })
    this.cd.detectChanges();
  }


  getTemplateById() {
    if (this.isCreate && this.isCreate.create == 'no') {
      let data: any = {
        Token: 'IBizzo',
        memberId: this.memberData.id,
        TemplateId: this.isCreate.id
      }
      this.newsletterService.getNewsletterById(data)
        .then((res: any) => {
          this.useTemplate = res.templates[0]
          this.templateName = res.templates[0].templateName;
          this.info = true;
        })
    }
    else {
      this.info = true
    }
  }

  getTemplateId(event?: any) {
    this.id = event
  }

  async subscribe(event?: any) {
    const controls = this.templateForm.controls;
    if (this.templateForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched(),
      );
      return;
    }
    if (event == 'save') {
      this.loadingSave = true;
      Swal.fire({
        title: 'This Newsletter will be save to the Draft',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel'
      })
        .then(async (res: any) => {
          if (res.value && res) {
            let result
            try {
              result = await this.newsletter.send(this.templateForm.controls.templateName.value, this.templateForm.controls.subjectLine.value, this.isNewsLetter);
              if (!result.includes('Excepiton')) {
                this.loadingSave = false;
                this.toastr.success('NewsLetter successfully save to Draft')
                this.partnerPageUrl = '/' + this.userProfile.removeSpaces(this.memberData.partnerInfo.name) + '/dashboard/partner/list-newsletter';
                this.router.navigate([this.partnerPageUrl])
              }
              if (result.includes('Excepiton')) {
                this.toastr.error("Failed to create the newsletter")
                this.loadingSave = false;
                this.cd.detectChanges();
              }
            }
            catch (e) {
              this.loadingSave = false;
              console.log("Failed to create template", e);
              this.cd.detectChanges();
              return;
            }
          }
          else {
            this.loadingSave = false;
            this.cd.detectChanges();
          }
        })

    } else {
      this.loading = true;
      let self = this;

      Swal.fire({
        title: 'This newsletter will be sent to subscribers',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      })
        .then(async (res: any) => {
          if (res.value && res) {
            let result
            try {
              result = await this.newsletter.send(this.templateForm.controls.templateName.value, this.templateForm.controls.subjectLine.value, this.isNewsLetter);
            }
            catch (e) {
              this.loading = false;
              console.log("Failed to create template", e);
              this.cd.detectChanges();
              return;
            }
            if (!result.includes('Excepiton')) {
              let data: any = {
                Token: 'IBizzo',
                MemberId: this.memberData.id,
                CompanyId: parseInt(this.memberData.companyId),
                OrgId: parseInt(this.memberData.partnerInfo ? this.memberData.partnerInfo.id : 1),
                NoOfSubscribers: this.subscibersCount,
                templateId: this.isNewsLetter ? this.isNewsLetter.id : result
              }
              self.newsletterService.processNewsLetter(data)
                .then((res: any) => {
                  if (!res.includes("Exception")) {
                    this.loading = false;
                    this.sentMessage = res;
                    this.toastr.success('NewsLetter Sent' + res.split(":")[1] + ' successfully')
                    this.partnerPageUrl = '/' + this.userProfile.removeSpaces(this.memberData.partnerInfo.name) + '/dashboard/partner/my-newsletter';
                    this.router.navigate([this.partnerPageUrl])
                  }
                  else {
                    this.toastr.error("Failed to Process newsletter ")
                    this.loading = false;
                    this.cd.detectChanges();
                  }
                })
            }
            else {
              this.toastr.error("Failed to create the newsletter")
              this.loading = false;
              this.cd.detectChanges();
            }
          }
          else {
            this.toastr.error("Failed to create the newsletter")
            this.loading = false;
            this.cd.detectChanges();
          }

        })
    }
  }

  createForm() {
    this.templateForm = this.formBuilder.group({
      templateName: ['', Validators.required],
      subjectLine: ['', Validators.required]
    });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.templateForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

}
