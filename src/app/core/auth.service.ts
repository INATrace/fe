import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ApiDefaultResponse } from 'src/api/model/apiDefaultResponse';
import { UserControllerService } from 'src/api/api/userController.service';
import { ApiResponseApiUserGet } from 'src/api/model/apiResponseApiUserGet';
import { ApiUserGet } from 'src/api/model/apiUserGet';
import { GlobalEventManagerService } from './global-event-manager.service';
import { LanguageCodeHelper } from '../language-code-helper';
import {BeycoTokenService} from '../shared-services/beyco-token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userController: UserControllerService,
        private globalEventManager: GlobalEventManagerService,
        private beycoTokenService: BeycoTokenService
    ) {
        this.refreshUserProfile();
    }

    loggedIn$ = new BehaviorSubject<boolean>(false);

    private updateUserProfile$ = new BehaviorSubject<boolean>(false);

    private _currentUserProfile: ApiUserGet = null;

  userProfile$ = this.updateUserProfile$.pipe(
    switchMap(ping => this.userController.getProfileForUserUsingGET().pipe(
      catchError(val => of(null))
    )),
    map((resp: ApiResponseApiUserGet) => {
      if (resp) {
        if (resp.data.language) { LanguageCodeHelper.setCurrentLocale(resp.data.language.toLowerCase()); }
        return resp.data;
      }
      return null;
    }),
    tap(val => { this._currentUserProfile = val; }),
    shareReplay(1)
  );

  isLoggedIn() {
    return this.loggedIn$.value;
  }

    get currentUserProfile() {
      return this._currentUserProfile;
    }

    refreshUserProfile() {
        this.updateUserProfile$.next(true);
    }

    login(username: string, password: string, redirect = null) {
        const subscription = this.userController.loginUsingPOST(
            {
                username,
                password
            }
        ).pipe(
            catchError(() => {
                return of(null);
            })
        ).subscribe((resp: any) => {
            this.loggedIn$.next(true);
            this.refreshUserProfile();
            subscription.unsubscribe();
            if (redirect !== null) {
                if (typeof redirect === 'string') {
                    this.router.navigate([redirect]);
                }
                if (Array.isArray(redirect)) {
                    this.router.navigate(redirect).then();
                }
            }
        });
    }

    async logout(redirect = '/login') {
        localStorage.removeItem('selectedUserCompany');
        this.globalEventManager.selectedUserCompany(null);
        await this.userController.logoutUsingPOST().pipe(take(1)).toPromise();
        this.beycoTokenService.removeToken();
        this._currentUserProfile = null;
        this.loggedIn$.next(false);
        if (redirect !== null) {
          this.router.navigate([redirect]).then();
        }
    }

    register(email, password, name, surname, redirect = null) {
        const subscription = this.userController.createUserUsingPOST(
            {
                email,
                name,
                password,
                surname
            }
        ).pipe(
            catchError(() => {
                return of(null);
            })
        ).subscribe((resp: ApiDefaultResponse) => {
            subscription.unsubscribe();
            if (redirect !== null) {
              this.router.navigate([redirect]);
            }
        });
    }

}
