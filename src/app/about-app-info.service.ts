import { Injectable } from '@angular/core';
import { GlobalEventManagerService } from './core/global-event-manager.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AboutAppInfoService {

  constructor(
    private globalEventsManager: GlobalEventManagerService
  ) { }

  get version() {
    return environment.version;
  }
    openAboutApp() {
      const buttonOkText = $localize`:@@aboutApp.info.button.ok:OK`;
      this.globalEventsManager.openMessageModal({
        type: 'general',
        title: $localize`:@@aboutApp.info.title:About app`,
        message: $localize`:@@aboutApp.info.message:App version: ${ this.version }`,
        options: {centered: true},
        dismissable: false,
        buttons: ['ok'],
        buttonTitles: {ok: buttonOkText}
      }).then();
    }
}
