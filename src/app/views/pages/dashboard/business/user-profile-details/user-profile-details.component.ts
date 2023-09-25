import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserProfileUpdateComponent } from '../../../../pages/shared-component/user-profile-update/user-profile-update.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../views/pages/auth/auth.service';
import { BaseService } from '../../../../../../provider/base-service/base.service';
declare var window: any;
import {environment} from '../../../../../../environments/environment'

@Component({
  selector: 'kt-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrls: ['./user-profile-details.component.scss'],
})
export class UserProfileDetailsComponent implements OnInit {
  @ViewChild('userProfileUpdateRef', { static: false })
  userProfileUpdateRef: UserProfileUpdateComponent;
  private currentUser: any;
  token: any;
  loading: boolean;
  constructor(
    private router: Router,
    private authService: AuthService,
    private baseService: BaseService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.token = this.currentUser.id;
  }

  openMiniSite() {
    let queryParam = this.currentUser.companyName.replace(/[^a-zA-Z0-9_ ]/g, "").toLowerCase().trim().replace(/\s+/g, '-') + "-" + this.currentUser.id + ".html"
    // const url = this.router.serializeUrl(this.router.createUrlTree(['/IBizzo/m/h/' + queryParam]));
    const url =  environment.SEO_URL+'/minisite/'+queryParam
    window.open(url, '_blank');
  }
  async save() {
    this.loading = true;
    this.cd.detectChanges()
    let res = await this.userProfileUpdateRef.save();
    if (res) {
      this.loading = false;
      this.cd.detectChanges()
    }
  }
}
