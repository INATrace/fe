import { Injectable } from '@angular/core';
import {BeycoOrderControllerService} from '../../api/api/beycoOrderController.service';
import {ApiBeycoTokenResponse} from '../../api/model/apiBeycoTokenResponse';
import {tap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../environments/environment';
import {uuidv4} from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class BeycoTokenService {

  private intervalId: number | null = null;
  public beycoToken: ApiBeycoTokenResponse;
  public tokenAvailable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
      private beycoService: BeycoOrderControllerService
  ) { }

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

  public requestToken(authCode: string) {
    return this.beycoService.getTokenUsingGET(authCode).pipe(
        tap((tokenResp) => {
          this.tokenAvailable$.next(true);
          this.beycoToken = tokenResp.data;
          // Refresh after 2/3 of token alive time
          this.intervalId = window.setInterval(this.refreshToken, (this.beycoToken.expiresIn / 3) * 2);
          console.log(this.beycoToken);
        })
    );
  }

  public refreshToken() {
    return this.beycoService.refreshTokenUsingGET(this.beycoToken.refreshToken).pipe(
        tap((resp) => {
          this.beycoToken = resp.data;
        })
    );
  }

  public removeToken() {
      this.beycoToken = null;
      if (this.intervalId) {
          window.clearInterval(this.intervalId);
          this.intervalId = null;
      }
      this.tokenAvailable$.next(false);
  }

}
