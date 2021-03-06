import { Component } from '@angular/core';
import { GlobalEventManagerService } from './system/global-event-manager.service';
import { environment } from 'src/environments/environment';
import { CookieManagementService } from './shared/directives/cookie-management.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = environment.appName;

  constructor(
    public globalEventsManager: GlobalEventManagerService,
    private cookieManagementService: CookieManagementService
    ){}

  ngOnInit() {
    this.loadGoogleMaps();
    this.cookieManagementService.loadConsentedCookies()
  }

  loadGoogleMaps():void {
    window['initMap'] = () => {
      this.globalEventsManager.loadedGoogleMaps(true);
    }
    let gmScript = document.createElement('script');
    gmScript.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&callback=initMap`;
    gmScript.defer = true;
    gmScript.async = true;

    document.head.appendChild(gmScript);

  }



  hasDefinedConsentToAllCookies() {
    return this.cookieManagementService.hasDefinedConsentToAllActiveCookies()
  }

  consentToAllCookies() {
    this.cookieManagementService.consentToAllCookies()
  }

  get cookieInfoUrl() {
    return this.cookieManagementService.cookieInfoUrl
  }


}
