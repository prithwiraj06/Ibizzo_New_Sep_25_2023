import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../../../views/pages/auth/auth.service'

@Injectable({
  providedIn: 'root'
})
export class BusinessAuthGuard implements CanActivate {
  constructor (private router: Router, private authService: AuthService) { }

  async canActivate() {
    try {
      await this.isAuthorized();
      await this.authService.isAlowedPartnerSite('business');
      return true;
    } catch (url) {
      if(!url){
        this.router.navigateByUrl('/');
        return false;
      }
      document.location.href = url;
    }
  }

  isAuthorized(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if( (this.authService.getUserId() !== null) && !this.authService.hasRole('SuperAdmin')){
        resolve()
      } else {
        reject();
      }
    })
  }
}
