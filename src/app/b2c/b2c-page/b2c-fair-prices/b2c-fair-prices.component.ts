import { Component, Inject, OnInit } from '@angular/core';
import { B2cPageComponent } from '../b2c-page.component';
import { ApiBusinessToCustomerSettings } from '../../../../api/model/apiBusinessToCustomerSettings';

@Component({
  selector: 'app-b2c-fair-prices',
  templateUrl: './b2c-fair-prices.component.html',
  styleUrls: ['./b2c-fair-prices.component.scss']
})
export class B2cFairPricesComponent implements OnInit {

  b2cSettings: ApiBusinessToCustomerSettings;

  constructor(
      @Inject(B2cPageComponent) private b2cPage: B2cPageComponent
  ) {
    this.b2cSettings = b2cPage.b2cSettings;
  }

  ngOnInit(): void {
  }

}
