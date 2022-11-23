import { Injectable } from '@angular/core';
import {BeycoOrderControllerService} from '../../api/api/beycoOrderController.service';
import {ApiBeycoTokenResponse} from '../../api/model/apiBeycoTokenResponse';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BeycoTokenService {

  public beycoToken: ApiBeycoTokenResponse;

  constructor(
      private beycoService: BeycoOrderControllerService
  ) { }

  public requestToken(authCode: string) {
    return this.beycoService.getTokenUsingGET(authCode).pipe(
        tap((tokenResp) => {
          this.beycoToken = tokenResp.data;
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

}
