import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiBusinessToCustomerSettings } from '../../../api/model/apiBusinessToCustomerSettings';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-b2c-tabs',
  templateUrl: './b2c-tabs.component.html',
  styleUrls: ['./b2c-tabs.component.scss']
})
export class B2cTabsComponent implements OnInit {

  constructor(
      private router: Router
  ) {
    this.appBaseUrl = environment.appBaseUrl;
  }

  appBaseUrl: string;

  tabEnum = B2CTab;

  @Input()
  // tab: 'journey' | 'fair-prices' | 'producers' | 'quality' | 'feedback';
  tab: B2CTab;

  @Input()
  productName: string;

  @Input()
  uuid: string;

  @Input()
  qrTag: string;

  @Input()
  b2cSettings: ApiBusinessToCustomerSettings;

  ngOnInit(): void {
  }

  goTo(target: B2CTab) {
    this.router.navigate(['/', 'p-cd', this.uuid, this.qrTag, target]);
  }

  get headerBackgroundImage() {
    if (this.b2cSettings.headerBackgroundImage) {
      return this.appBaseUrl + '/api/public/document/' + this.b2cSettings.headerBackgroundImage.storageKey;
    }
    return undefined;
  }

}

export enum B2CTab {
  NONE = 'none',
  JOURNEY = 'journey',
  FAIR_PRICES = 'fair-prices',
  PRODUCERS = 'producers',
  QUALITY = 'quality',
  FEEDBACK = 'feedback'
}
