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
import {BeycoTokenService} from '../shared-services/beyco-token.service';

@Injectable()
export class BeycoTokenInterceptor implements HttpInterceptor {

  constructor(
      private beycoService: BeycoOrderControllerService,
      private beycoTokenService: BeycoTokenService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
        catchError((err: any) => {
          if (
              err instanceof HttpErrorResponse &&
              err.status === 401 &&
              err.url.includes('beyco-order/order')
          ) {
              return this.beycoTokenService.refreshToken()
                  .pipe(
                      switchMap((resp) => {
                          const newRequest = request.clone({
                              params: request.params.set('token', this.beycoTokenService.beycoToken.accessToken)
                          });
                          return next.handle(newRequest);
                      }),
                      catchError((refreshErr) => {
                          return of(refreshErr);
                      })
                  );
          }

          return of(err);
        })
    );

  }
}
