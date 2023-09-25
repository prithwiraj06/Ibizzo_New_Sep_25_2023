import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (private router: Router) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (localStorage.getItem(environment.authTokenKey)) {
      return true;
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
