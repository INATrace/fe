import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { take } from 'rxjs/operators';
import { ApiUserGet } from '../../api/model/apiUserGet';

@Injectable({
  providedIn: 'root'
})
export class ActivatedUserGuardService implements CanActivate{

  constructor(
      private router: Router,
      private authService: AuthService
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const res = await this.authService.userProfile$.pipe(take(1)).toPromise();

    if (res && res.status === ApiUserGet.StatusEnum.ACTIVE) {
      return true;
    }

    return this.router.createUrlTree(['/', 'home']);
  }
}
