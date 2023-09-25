import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from '../../../../../../provider/user-profile/user-profile.service'
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { ReInviteComponent } from '../../../shared-component/re-invite/re-invite.component';
import { AuthService } from '../../../auth/auth.service'
import { ProductService } from '../../../../../../provider/product-service/product-service.service';
import { UserCartDetailsComponent } from '../../../shared-component/user-cart-details/user-cart-details.component';
import { BaseUrlPipe } from '../../../../../core/_base/layout/pipes/base-url';
import {environment} from '../../../../../../environments/environment'

@Component({
  selector: 'kt-base',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss'],
})
export class MemberProfileComponent implements OnInit {

  contact: any;
  token: any;
  loading: boolean = false;
  tabIndex: any = 0;
  contactLoading: boolean = false;
  isMember: boolean = false;
  addMemberApi: boolean = false;
  userDetails: any;
  iconType: any = './assets/media/icons/svg/Shopping/Cart1.svg';
  cartCount: any = 0;

  constructor(
    private route: ActivatedRoute,
    private service: UserProfileService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private auth: AuthService,
    private router: Router,
    private partner: ProductService,
    private baseUrlPipe: BaseUrlPipe,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.token = param.id;

      //checking to add member api
      let memberAddedCondition = localStorage.getItem('MEMBER_PROFILE_' + this.token);
      if (memberAddedCondition) {
        this.addMemberApi = true;
      }
      this.getCartCount();
      //check: for member
      this.route.queryParams.subscribe(param => {
        let data = param.isMember || "true";
        if (data === "false") {
          this.isMember = false;
          this.getProfile();
          this.contactLoading = true;
          this.cd.detectChanges();
        } else {
          this.isMember = true;
          this.getUserDetails(this.token);
        }
      })
    })
    this.partner
      .onEvent('CART_UPDATED')
      .subscribe(() => {
        this.getCartCount();
      })
  }

  async getCartCount() {
    try {
      let res: any = await this.partner.GetMemberCart(this.token);
      console.log(res);
      this.cartCount = (res.offersInCart&&res.offersInCart.length!=0)?res.offersInCart.length:res.cartDetail.length;
    }
    catch{

    }
  }

  cartDetails() {
    const dialogRef = this.dialog.open(UserCartDetailsComponent, {
      width: "600px",
      data: {
        isEnable: false,
        token: this.token,
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        this.loading = false;
        this.cd.detectChanges();
        return;
      }
    })
  }

  //member event fuction --> return to add memberprofile API in 3 cases
  memberEvent(event: any) {
    this.addMemberApi = event.memberAdded;
    this.contact = event.profile;
  }

  getUserDetails(id) {
    if (id) {
      this.service.getProfileDataOfMember(id)
        .then((res: any) => {
          this.contact = res.userDetails;
          this.contactLoading = true;
          this.cd.detectChanges();
        })
        .catch(e => {
          this.contactLoading = true;
          this.cd.detectChanges();
        })
    }
  }

  //Notify member ---> email sent
  async sendMail() {
    if (this.contact) {
      console.log("contact", this.contact)
      this.loading = true;
      let data = {
        "memberCompanyID": this.auth.getCompanyId(),
        "email": this.contact.email,
        "name": this.contact.name,
        "companyName": this.contact.companyName || '',
        "phone": this.contact.phoneNumber,
        "pinCode": this.contact.pinCode || this.contact.location || '',
        "website": this.contact.website || '',
        "token": "IBizzo",
        "code": this.contact.code || ''
      }

      const dialogRef = this.dialog.open(ReInviteComponent);

      dialogRef.afterClosed().subscribe(async result => {
        if (!result) {
          this.loading = false;
          this.cd.detectChanges();
          return;
        }
        try {
          let res = await this.service.notifyMember(data);
          if (res) {
            this.toastr.success('Member Notified successfuly');
            localStorage.removeItem('MEMBER_PROFILE_' + this.token);
            setInterval(() => {
              window.close();
            }, 4000);
            this.loading = false;
            this.cd.detectChanges();
          }
        }
        catch (e) {
          this.toastr.error('Something went wrong please try again later.');
          this.loading = false;
          this.cd.detectChanges();
        }
      })
    }
    else {
      this.toastr.error('Member dont have a details');
    }
  }

  openMiniSite() {
    let queryParam = "ss-" + this.contact.companyName.replace(/[^a-zA-Z0-9_ ]/g, "").toLowerCase().trim().replace(/\s+/g, '-') + "-" + this.contact.id + ".html"
    // const url = this.baseUrlPipe.transform(['/m/h/' + queryParam]);
    const url =environment.SEO_URL+'/minisite/'+queryParam
    window.open(url, '_blank');
  }

  async getProfile() {
    this.service.getProfile(this.token)
      .then((res: any) => {
        if (res.userDetails) {
          this.contact = res.userDetails;
        }
      })
  }
}
