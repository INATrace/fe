import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalEventManagerService} from '../core/global-event-manager.service';
import {BeycoTokenService} from '../shared-services/beyco-token.service';

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
      private beycoTokenService: BeycoTokenService
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
        this.beycoTokenService.requestToken(params['code'])
            .then(() => {
              this.notificationService.push({
                action: 'success',
                notificationType: 'success',
                title: 'Beyco application authorized',
                message: 'You can now send Beyco orders!'
              });
            })
            .catch((err) => {
              this.notificationService.push({
                action: 'error',
                notificationType: 'error',
                title: 'Error on Beyco authorization',
                message: this.getErrorMessage(err.error)
              });
            })
            .finally(() => this.router.navigate(['my-stock', 'orders', 'tab']));
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
