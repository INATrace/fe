import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { take } from 'rxjs/operators';
import { ApiUserGet } from '../../api/model/apiUserGet';

@Injectable({
    providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        const companyId = Number(route.params.id);

        const res = await this.authService.userProfile$.pipe(take(1)).toPromise();
        if (res && (res.role === ApiUserGet.RoleEnum.ADMIN || res.companyIdsAdmin.includes(companyId))) {
            return true;
        }

        return this.router.createUrlTree(['/', 'home']);
    }

}
