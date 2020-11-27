import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { tap, catchError } from 'rxjs/operators';
import { GlobalEventManagerService } from './global-event-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { LocalizationService } from '../directives/localization.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    public auth: AuthService,
    public toasterService: ToastrService,
    public globalEventsManager: GlobalEventManagerService,
    public route: ActivatedRoute,
    private router: Router
    // private localizationService: LocalizationService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log(request, next);
    // let language = this.localizationService.currentLanguage()
    // request = request.clone({
    //   setHeaders: {
    //     'X-AUTH-TOKEN' : `${this.auth.getToken()}`
    //   },
    //   setParams: {
    //       'language' : `${language}`
    //   }
    // });

    // console.log("LANG: ", request.params.get('language'))
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          try {
              // console.log(err)
            if (err.status == 401) {
              // console.log(err)
              // console.log(this.route, window.location.pathname)
              if(err.url.endsWith('/login')) {
                let message = $localize`:@@tokenInterceptor.login.message:Wrong username or password`
                let title = $localize`:@@tokenInterceptor.login.title:Error`
                this.toasterService.error(message, title);
              } else if(err.url.endsWith('/logout')) {
                // nothing to do
              } else if (err.url.endsWith('/user/profile') && this.pathsToIgnore()) {
                // landing or get started page, ignore
              } else {
                this.auth.logout()
                let message = $localize`:@@tokenInterceptor.logout.message:Your session has expired`
                let title = $localize`:@@tokenInterceptor.logout.title:Error`
                this.toasterService.error(message, title);
              }
            } else if (err.status === 403) {
              let message = $localize`:@@tokenInterceptor.403.message:Unauthorized access`
              let title = $localize`:@@tokenInterceptor.403.title:Error`
              this.toasterService.error(message, title);
              // } else if(err.error) {
              //     if(err.error.errorDetails && err.error.errorDetails.fieldErrors) {
              //       let errorList = err.error.errorDetails.fieldErrors
              //       let fullMessage = ""
              //       for(let key in errorList) {
              //         fullMessage += key + " " + errorList[key] + "<br>"
              //       }
              //       this.toasterService.error(fullMessage, "Nepravilno izpolnjena polja", {enableHtml: true});
              //     } else {
              //       let message = (err.error && err.error.errorMessage) || null
              //       if(message) {
              //         this.toasterService.error(message, "Napaka");
              //       } else {
              //         this.toasterService.error("Napaka pri komunikaciji s strežnikom (" + err.status + ")", "Napaka");
              //       }
              //     }
            } else if(err.status === 400) {
              if ((window.location.pathname.includes('/p/') || window.location.pathname.includes('/p-cd/'))&& err.url.includes('/api/public/product/label/')) {
                let uuid = window.location.pathname.split('/').pop();
                this.globalEventsManager.productLabelIsUnpublished(uuid);
              } else if (err.url.includes('/chain-api/data/user/external/')) {

              }  else {
                // let message = $localize`:@@tokenInterceptor.400.message:Please reload the page.`
                let message = err.error.errorMessage;
                let title = $localize`:@@tokenInterceptor.400.title:Communication error!`
                this.toasterService.error(message, title);
              }
            } else {
              let message = $localize`:@@tokenInterceptor.other.message:Please reload the page.`
              let title = $localize`:@@tokenInterceptor.other.title:Communication error!`
              this.toasterService.error(message, title);
            }
          } catch (e) {
            let message = $localize`:@@tokenInterceptor.catch.message:Please reload the page.`
            let title = $localize`:@@tokenInterceptor.catch.title:Communication error!`
            this.toasterService.error(message, title);
          } finally {
            this.globalEventsManager.showLoading(false);
          }
          //log error
        }
        return of(err);
      })
    );
  }

  pathsToIgnore(){
    let landingUrlTempl = '/([a-z]{2})/';
    let getStartedUrlTempl = '/([a-z]{2})/products/new';
    return (Array.isArray(window.location.pathname.match(landingUrlTempl)) && this.router.url === '/') ||
    (Array.isArray(window.location.pathname.match(getStartedUrlTempl)) && this.router.url == '/products/new');
  }

}
