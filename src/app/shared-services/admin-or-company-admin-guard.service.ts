import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { take } from 'rxjs/operators';
import { ApiUserGet } from '../../api/model/apiUserGet';

/**
 * Guard that checks if the current user is either Company admin or a System admin.
 */
@Injectable({
    providedIn: 'root'
})
export class AdminOrCompanyAdminGuardService implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {

        const companyId = Number(route.params.id);

        const userProfile = await this.authService.userProfile$.pipe(take(1)).toPromise();
        if (userProfile && (userProfile.role === ApiUserGet.RoleEnum.ADMIN || userProfile.companyIdsAdmin.includes(companyId))) {
            return true;
        }

        return this.router.createUrlTree(['/', 'home']);
    }

}
