import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ApiDefaultResponse } from 'src/api/model/apiDefaultResponse';
import { UserControllerService } from 'src/api/api/userController.service';
import { ApiResponseApiUserGet } from 'src/api/model/apiResponseApiUserGet';
import { ApiUserGet } from 'src/api/model/apiUserGet';
import { GlobalEventManagerService } from './global-event-manager.service';
import { UserService } from 'src/api-chain/api/user.service';
import { LanguageCodeHelper } from '../language-code-helper';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userController: UserControllerService,
        private globalEventManager: GlobalEventManagerService,
        private chainUserService: UserService
    ) {
        this.loggedIn$.subscribe(x => {
            // console.log("Login status: " + x)
        })  // subscription gets it running.
        // this.loggedIn$.next(true)
        this.refreshUserProfile()
    }

    // public getToken(): string {
    //     return localStorage.getItem('token');
    // }

    isLoggedIn() {
        return this.loggedIn$.value
    }

    loginSubscription: Subscription;

    loggedIn$ = new BehaviorSubject<boolean>(false)

    private updateUserProfile$ = new BehaviorSubject<boolean>(false);

    private _currentUserProfile: ApiUserGet = null;

    get currentUserProfile() {
      return this._currentUserProfile;
    }

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

    refreshUserProfile() {
        this.updateUserProfile$.next(true);
    }

    async postNewUserToCouchDB(user) {
      const postUser = user;
      const res = await this.chainUserService.getUserByAFId(user.id).pipe(take(1)).toPromise();
      // console.log(res);
      if (res && res.status === 'OK') {
        // console.log(Object.keys(res.data).length)
        if (Object.keys(res.data).length === 0) {
      // if (res && res.status == 'OK' && res.data) {
      //   if(res.data.count < user.id) {
          delete postUser['actions']
          delete postUser['companyIds']
          delete postUser['language']
          let resP = await this.chainUserService.postUser(postUser).pipe(take(1)).toPromise();
          console.log(resP)
        }
      }
    }
    // resetUserState() {
    //     localStorage.setItem("homeShowCovid", "false");
    //     localStorage.setItem("homeShowEvidence", "false");
    //     localStorage.setItem("homeShowERazpisi", "false");
    //     localStorage.setItem("homShowPregledMreze", "false");
    //     localStorage.setItem("homeShowUpravljanjeDogodkov", "false");
    //     localStorage.setItem("homeShowPorocanje", "false");
    //     localStorage.setItem("homePageOffset", "0")
    // }

    login(username: string, password: string, redirect = null) {
        let subscription = this.userController.loginUsingPOST(
            {
                username,
                password
            }
        ).pipe(
            catchError(val => {
                // console.log("LOGIN ERROR")
                // console.log(val)
                return of(null)
            })
        ).subscribe((resp: any) => {
            // localStorage.setItem('user', JSON.stringify(resp.data.userProfile))
            // localStorage.setItem('token', resp.data.token);
            // this.resetUserState()
            this.loggedIn$.next(true)
            this.refreshUserProfile()
            subscription.unsubscribe()
            if (redirect !== null) {
                if(typeof redirect === "string") {
                    this.router.navigate([redirect])
                }
                if(Array.isArray(redirect)) {
                    this.router.navigate(redirect)
                }
            }
        })
    }

    async logout(redirect = '/login') {
        // localStorage.removeItem('user')
        // localStorage.removeItem('token')
        // localStorage.removeItem('company')
        localStorage.removeItem("selectedUserCompany");
        this.globalEventManager.selectedUserCompany(null);
        let res = await this.userController.logoutUsingPOST().pipe(take(1)).toPromise()
        this._currentUserProfile = null;
        this.loggedIn$.next(false)
        if (redirect !== null) {
          // console.log("RED:", redirect)
          this.router.navigate([redirect])
        }

    }

    // loginWithAccountConfirmationToken(token, callback: (success: boolean) => void = null) {
    //     let subscription = this.userController.validateUserRegistration({ value: token }).pipe(
    //         catchError(val => {
    //             console.log("Token confirmation errror")
    //             console.log(val)
    //             if (callback) {
    //                 callback(false)
    //             }
    //             return of(null)
    //         })
    //     ).subscribe((resp: ApiResponseApiTemporaryLoginAuthData) => {
    //         // localStorage.setItem('user', JSON.stringify(resp.data.userProfile))
    //         localStorage.setItem('token', resp.data.token)
    //         this.loggedIn$.next(true)
    //         subscription.unsubscribe()
    //         if (callback) {
    //             callback(true)
    //         }
    //         // if (redirect !== null)
    //         //   this.router.navigate([redirect])
    //     })
    // }


    register(email, password, name, surname, redirect = null) {
        let subscription = this.userController.createUserUsingPOST(
            {
                email: email,
                name: name,
                password: password,
                surname: surname
            }
        ).pipe(
            catchError(val => {
                // console.log("REGISTER ERROR")
                // console.log(val)
                return of(null)
            })
        ).subscribe((resp: ApiDefaultResponse) => {
            subscription.unsubscribe()
            if (redirect !== null)
                this.router.navigate([redirect])
        })
    }

    // resetPasswordRequest(email: string, callback: (success: boolean) => void = null) {
    //     let subscription = this.userController.resetPasswordRequest({
    //         email: email
    //     }).pipe(
    //         catchError(val => {
    //             if (callback) {
    //                 callback(false)
    //             }
    //             return of(null)
    //         })
    //     ).subscribe((resp: ApiResponseApiTemporaryLoginAuthData) => {
    //         if (callback) {
    //             callback(true)
    //         }
    //     })
    // }

    // resetPassword(token: string, newPassword: string, callback: (success: boolean) => void = null) {
    //     let subscription = this.userController.resetPassword({
    //         password: newPassword,
    //         token: token
    //     }).pipe(
    //         catchError(val => {
    //             if (callback) {
    //                 callback(false)
    //             }
    //             return of(null)
    //         })
    //     ).subscribe((resp: ApiResponseApiTemporaryLoginAuthData) => {
    //         // localStorage.setItem('user', JSON.stringify(resp.data.userProfile))
    //         localStorage.setItem('token', resp.data.token)
    //         this.loggedIn$.next(true)
    //         subscription.unsubscribe()
    //         if (callback) {
    //             callback(true)
    //         }
    //     })
    // }


}
