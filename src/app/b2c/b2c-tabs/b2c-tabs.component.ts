import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiBusinessToCustomerSettings } from '../../../api/model/apiBusinessToCustomerSettings';

@Component({
  selector: 'app-b2c-tabs',
  templateUrl: './b2c-tabs.component.html',
  styleUrls: ['./b2c-tabs.component.scss']
})
export class B2cTabsComponent implements OnInit {

  constructor(
      private router: Router
  ) { }

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
    this.router.navigate(['/', 'b2c', this.uuid, this.qrTag, target]);
  }

}

export enum B2CTab {
  JOURNEY = 'journey',
  FAIR_PRICES = 'fair-prices',
  PRODUCERS = 'producers',
  QUALITY = 'quality',
  FEEDBACK = 'feedback'
}
