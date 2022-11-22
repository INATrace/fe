import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalEventManagerService} from '../core/global-event-manager.service';
import {BeycoOrderControllerService} from '../../api/api/beycoOrderController.service';
import {ApiResponseApiBeycoTokenResponse} from '../../api/model/apiResponseApiBeycoTokenResponse';

@Component({
  selector: 'app-beyco-oauth2',
  templateUrl: './beyco-oauth2.component.html',
  styleUrls: ['./beyco-oauth2.component.scss']
})
export class BeycoOauth2Component implements OnInit {

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private notificationService: GlobalEventManagerService,
      private beycoService: BeycoOrderControllerService
  ) { }

  // TODO: add translations
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const state = params['state']; // TODO: check state

      if (params['error']) {
        this.notificationService.push({
          action: 'error',
          notificationType: 'error',
          title: 'Error on Beyco authorization',
          message: this.getErrorMessage(params['error'])
        });
        this.router.navigate(['my-stock', 'orders', 'tab']);
      }

      else {
        this.beycoService.getTokenUsingGET(params['code']).subscribe((tokenResp: ApiResponseApiBeycoTokenResponse) => {
          sessionStorage.setItem('beycoToken', JSON.stringify(tokenResp.data));
          this.notificationService.push({
            action: 'success',
            notificationType: 'success',
            title: 'Beyco application authorized',
            message: 'You can now send Beyco orders!'
          });
        }, (err) => {
          this.notificationService.push({
            action: 'error',
            notificationType: 'error',
            title: 'Error on Beyco authorization',
            message: this.getErrorMessage(err['error'])
          });
        }, () => this.router.navigate(['my-stock', 'orders', 'tab']));
      }
    });
  }

  private getErrorMessage(errorField: string): string {
    switch (errorField) {
      case 'AccessDenied':
        return  'Access to Beyco was denied! Please, try again later!';
      default:
        return 'Error occurred while authorizing Beyco application. Please, try again later!';
    }
  }

}
