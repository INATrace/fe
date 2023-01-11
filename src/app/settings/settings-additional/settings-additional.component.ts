import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { CommonControllerService } from 'src/api/api/commonController.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { NgbModalImproved } from 'src/app/core/ngb-modal-improved/ngb-modal-improved.service';
import { SettingsComponent } from '../settings.component';

@Component({
  selector: 'app-settings-additional',
  templateUrl: './settings-additional.component.html',
  styleUrls: ['../settings.component.scss']
})
export class SettingsAdditionalComponent extends SettingsComponent{

  rootTab = 0;

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    protected commonController: CommonControllerService,
    protected modalService: NgbModalImproved,
    protected router: Router
  ) {
    super(globalEventsManager, commonController, modalService, router);
  }

}
