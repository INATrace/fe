import { Injectable } from '@angular/core';
import {ApiResponseApiBeycoTokenResponse} from '../../api/model/apiResponseApiBeycoTokenResponse';
import {BeycoOrderControllerService} from '../../api/api/beycoOrderController.service';
import {ApiBeycoTokenResponse} from '../../api/model/apiBeycoTokenResponse';

@Injectable({
  providedIn: 'root'
})
export class BeycoTokenService {

  public beycoToken: ApiBeycoTokenResponse;

  constructor(
      private beycoService: BeycoOrderControllerService
  ) { }

  public requestToken(authCode: string) {
    return new Promise((resolve, reject) => {
      this.beycoService.getTokenUsingGET(authCode).subscribe((tokenResp: ApiResponseApiBeycoTokenResponse) => {
        this.beycoToken = tokenResp.data;
        resolve();
      }, (err) => reject(err));
    });
  }

  public refreshToken() {
    return new Promise((resolve, reject) => {
      this.beycoService.refreshTokenUsingGET(this.beycoToken.refreshToken).subscribe((tokenResp: ApiResponseApiBeycoTokenResponse) => {
        this.beycoToken = tokenResp.data;
        resolve();
      }, (err) => reject(err));
    });
  }

}
