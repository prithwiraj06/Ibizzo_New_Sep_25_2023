import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User, isLoggedIn } from '../../../../../core/auth';
import { EmailComponent } from '../../../../pages/auth//login-page/email/email.component';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../../../../views/pages/auth/auth.service';
import { MainSiteService } from '../../../../../../provider/main-site/main-site.service';
import { Router } from '@angular/router';
import { ProductService } from '../../../../../../provider/product-service/product-service.service';
import {environment} from '../../../../../../environments/environment'

@Component({
  selector: 'kt-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  isLoggedIn$: boolean = false;

  @Input() avatar = true;
  @Input() greeting = true;
  @Input() badge: boolean;
  @Input() icon: boolean;
  userDetails: any;
  allowedDashboards: any = [];

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private mainSiteService: MainSiteService,
    private product: ProductService,
  ) { }

  ngOnInit(): void {
    this.mainSiteService.onEvent('SHOW_LOGIN_WINDOW').subscribe(() => {
      this.login();
    });
    this.product
      .onEvent('UPDATED_INFO')
      .subscribe(() => {
        this.userProfile();
      })


    this.userProfile();
    this.user$ = this.store.pipe(select(currentUser));
    this.allowedDashboards = this.authService.allowedDashboards();
    this.isAuthorized();
  }

  ngOnDestroy() {
    this.mainSiteService.unsubscribe();
  }

  logout() {
    debugger
    // this.store.dispatch(new Logout());
    // localStorage.removeItem('memberData');
    // localStorage.removeItem('previousRfq');
    // this.userDetails = '';
    // window.location.reload();
    // this.cd.detectChanges();
    this.store.dispatch(new Logout());
    localStorage.removeItem("memberData");
    localStorage.removeItem("previousRfq");
    this.userDetails = "";
    let url=environment.SEO_URL+'/logout';
    window.location.href=url

    this.cd.detectChanges();
  }

  isAuthorized() {
    try {
      this.store
        .pipe(
          select(isLoggedIn),
          take(1),
          map((loggedIn) => {
            this.cd.detectChanges();
            return loggedIn;
          }),
        )
        .subscribe(async (res: boolean) => {
          this.isLoggedIn$ = res;
        });
    } catch (e) {
      console.log('isAuthorized', e);
    }
  }

  login() {
    const dialogRef = this.dialog.open(EmailComponent, {
      width: '450px',
      data: ''
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.userProfile();
    });
  }

  userProfile() {
    if (JSON.parse(localStorage.getItem('memberData'))) {
      this.userDetails = JSON.parse(
        localStorage.getItem('memberData'),
      ).memberUserInfo;
      this.cd.detectChanges();
    }
  }

  goToDashboard() {
    this.router.navigateByUrl('/dashboard/business');
  }

  isAllowed(dashboard: string) {
    return this.allowedDashboards.indexOf(dashboard) > -1;
  }

  isAuthenticate(): boolean {
    if (JSON.parse(localStorage.getItem('memberData')) && !this.userDetails) {
      this.allowedDashboards = this.authService.allowedDashboards();

      this.userDetails = JSON.parse(
        localStorage.getItem('memberData'),
      ).memberUserInfo;
      this.cd.detectChanges();
    }
    return JSON.parse(localStorage.getItem('memberData')) ? false : true;
  }
}