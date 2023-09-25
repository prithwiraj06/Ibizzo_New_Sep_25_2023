import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NewsletterService } from '../../../../../provider/newsletter/newsletter.service';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kt-shared-list-newsletter',
  templateUrl: './list-newsletter.component.html',
  styleUrls: ['./list-newsletter.component.scss']
})
export class SharedListNewsletterComponent implements OnInit {
  @Input() dashboard: string;
  newsLetter: any;
  public createTemplateUrl: any;
  constructor(
    private newsletterService: NewsletterService,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
    private toast: ToastrService

  ) { }

  ngOnInit() {
    this.initail();
    this.createTemplateUrl = ['/dashboard/' + this.dashboard + '/create-newsletter'];
  }

  initail() {
    let params = {
      Token: 'IBizzo',
      MemberId: this.auth.getUserId(),
      CompanyId: this.auth.getCompanyId()
    }
    this.newsletterService.getDraftNewsLetter(params)
      .then((res: any) => {
        console.log(res);
        this.newsLetter = res.templates[0];
        this.cd.detectChanges();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  deleteTemplate(id) {
    let params = {
      Token: 'IBizzo',
      MemberId: this.auth.getUserId(),
      TemplateId: id
    }
    console.log("deleted", id);
    this.newsletterService.deleleteTemplete(params)
      .then((res: any) => {
        if (res.status == 1) {
          this.toast.success("Succesfully Deleted the Draft Newsletter")
          this.initail();
        }
        else {
          this.toast.error("Failted to delete")
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
}
