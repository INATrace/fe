import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {BeycoOrderControllerService} from '../../api/api/beycoOrderController.service';

@Injectable()
export class BeycoTokenInterceptor implements HttpInterceptor {

  constructor(
      private beycoService: BeycoOrderControllerService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
        catchError((err: any) => {
          if (
              err instanceof HttpErrorResponse &&
              err.status === 401 &&
              err.url.includes('beyco-order/order')
          ) {
              return this.beycoService.refreshTokenUsingGET(
                  JSON.parse(sessionStorage.getItem('beycoToken')).refreshToken
              ).pipe(
                  switchMap((tokenResp) => {
                      sessionStorage.setItem('beycoToken', JSON.stringify(tokenResp.data));
                      // TODO: change token in body
                      return next.handle(request);
                  })
              );
          }

          return of(err);
        })
    );
  }
}
