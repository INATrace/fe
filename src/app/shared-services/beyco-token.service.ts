import { Injectable } from '@angular/core';
import { BeycoOrderControllerService } from '../../api/api/beycoOrderController.service';
import { ApiBeycoTokenResponse } from '../../api/model/apiBeycoTokenResponse';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { uuidv4 } from '../../shared/utils';
import { GlobalEventManagerService } from '../core/global-event-manager.service';
import { SelectedUserCompanyService } from '../core/selected-user-company.service';
import { AuthService } from '../core/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BeycoTokenService {

  private companyId: number | null = null;

  private timeoutId: number | null = null;
  public beycoToken: ApiBeycoTokenResponse;
  public tokenAvailable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
      private beycoService: BeycoOrderControllerService,
      private globalEventManager: GlobalEventManagerService,
      private authService: AuthService,
      private selUserCompanyService: SelectedUserCompanyService
  ) {

    this.authService.userProfile$.subscribe(up => {
      if (!up) {
        this.removeToken();
      }
    });

    this.selUserCompanyService.selectedCompanyProfile$.subscribe(cp => {
      if (cp) {
        this.companyId = cp.id;
      }
    });
  }

  public redirectToBeycoAuthorization(redirectPath: string) {
      const redirectUri = window.location.origin + redirectPath;
      const clientId = environment.beycoClientId;
      const state = uuidv4();
      sessionStorage.setItem('beyco-auth-state', state);

      const params = [
          'responseType=code',
          'clientId=' + clientId,
          'redirectUri=' + redirectUri,
          'scope=' + encodeURIComponent('Offer:Create'),
          'state=' + state
      ];
      window.location.href = environment.beycoAuthURL + '?' + params.join('&');
  }

  public getTokenWithAuthenticationCode(params: any) {
      const savedState = sessionStorage.getItem('beyco-auth-state');
      if (!savedState || params['state'] !== savedState) {
          this.globalEventManager.push({
              action: 'error',
              notificationType: 'error',
              title: 'Error on Beyco authorization',
              message: this.getErrorMessage('UnknownState')
          });
          return;
      }
      sessionStorage.removeItem('beyco-auth-state');

      if (params['error']) {
          this.globalEventManager.push({
              action: 'error',
              notificationType: 'error',
              title: 'Error on Beyco authorization',
              message: this.getErrorMessage(params['error'])
          });
          return;
      }

      this.requestToken(params['code']).subscribe(
          () => {
              this.globalEventManager.push({
                  action: 'success',
                  notificationType: 'success',
                  title: $localize`:@@beycoToken.notification.login.success.title:Beyco application authorized`,
                  message: $localize`:@@beycoToken.notification.login.success.message:You can now send Beyco orders!`
              });
          },
          (err) => {
              this.globalEventManager.push({
                  action: 'error',
                  notificationType: 'error',
                  title: $localize`:@@beycoToken.notification.login.error.title:Error on Beyco authorization`,
                  message: this.getErrorMessage(err.error)
              });
          }
      );
  }

  private requestToken(authCode: string) {

    return this.beycoService.getToken(authCode, this.companyId).pipe(
        tap((tokenResp) => {
          this.tokenAvailable$.next(true);
          this.beycoToken = tokenResp.data;
          // Refresh after 2/3 of token alive time
          this.timeoutId = window.setTimeout(this.refreshToken, (this.beycoToken.expiresIn / 3) * 2);
        })
    );
  }

  private refreshToken() {

    return this.beycoService.refreshToken(this.beycoToken.refreshToken, this.companyId).pipe(
        tap((resp) => {
          this.beycoToken = resp.data;
          this.timeoutId = window.setTimeout(this.refreshToken, (this.beycoToken.expiresIn / 3) * 2);
        })
    );
  }

  public removeToken() {
      this.beycoToken = null;
      if (this.timeoutId) {
          window.clearTimeout(this.timeoutId);
          this.timeoutId = null;
      }
      this.tokenAvailable$.next(false);
  }

  private getErrorMessage(errorField: string): string {
    switch (errorField) {
      case 'AccessDenied':
        return  $localize`:@@beycoToken.notification.login.error.AccessDenied.message:Access to Beyco was denied! Please, try again later!`;
      case 'UnknownState':
        return 'Beyco authorization was returned with unknown state! Token is ignored!';
      default:
        return $localize`:@@beycoToken.notification.login.error.default.message:Error occurred while authorizing Beyco application. Please, try again later!`;
    }
  }

}
