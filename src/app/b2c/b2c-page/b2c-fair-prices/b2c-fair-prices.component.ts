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

  title = $localize`:@@frontPage.fair-prices.title:Fair prices`;
  title2 = $localize`:@@frontPage.fair-prices.title2:Increase of farmers' income through`;

  prices: string = null;
  desc: string = null;
  descPricing: string = null;

  worldMarketPrice: string = null;
  fairTradePrice: string = null;
  angeliquePrice: string = null;
  increaseOfCoffee: number = null;

  worldMarketHeight: number = null;
  fairTradeHeight: number = null;
  angeliqueHeight: number = null;

  orderId = '';

  chartsArePrepared = false;

  label1 = $localize`:@@frontPage.fair-prices.barChart.label1:World market price for Arabica coffee`;
  label2 = $localize`:@@frontPage.fair-prices.barChart.label2:Fairtrade Price`;

  label0Farmers = $localize`:@@frontPage.fair-prices.barChart.label0Farmers:Increase in % per kg of coffee sold`;

  productName = '';

  constructor(
      @Inject(B2cPageComponent) private b2cPage: B2cPageComponent
  ) {
    this.b2cSettings = b2cPage.b2cSettings;
  }

  ngOnInit(): void {
    this.initLabel().then();
  }

  async initLabel() {
    this.pricesAndDescription(this.b2cPage.publicProductLabel.fields);

    if (this.b2cPage.qrTag !== 'EMPTY') {
      this.orderId = this.b2cPage.qrProductLabel.orderId;
    }
  }

  pricesAndDescription(data) {

    let prices = null;

    for (const item of data) {
      if (item.name === 'name') {
        this.productName = item.value;
      }
      if (item.name === 'comparisonOfPrice.prices') {
        prices = item.value;
      }
      if (item.name === 'comparisonOfPrice.description') {
        this.desc = item.value;
      }
      if (item.name === 'settings.incomeIncreaseDescription') {
        this.descPricing = item.value;
      }
      if (item.name === 'settings.increaseOfCoffee') {
        this.increaseOfCoffee = Math.round(item.value);
      }
    }

    this.worldMarketPrice = Math.round(prices.worldMarket * prices.poundToKg * prices.containerSize).toString();
    this.fairTradePrice = Math.round(prices.fairTrade * prices.poundToKg * prices.containerSize).toString();

    if (prices.estimatedAdditionalPrice) {
      this.angeliquePrice = Math.round(prices.estimatedAdditionalPrice * prices.EURtoUSD * prices.containerSize).toString();
    }
    else {
      this.angeliquePrice = '120629'; // TODO: In future change this with the price from the stock order
    }

    if (this.worldMarketPrice.length > 3) {
      this.worldMarketPrice =
          this.worldMarketPrice.substring(0, this.worldMarketPrice.length - 3) + '.' +
          this.worldMarketPrice.substring(this.worldMarketPrice.length - 3, this.worldMarketPrice.length);
    }

    if (this.fairTradePrice.length > 3) {
      this.fairTradePrice =
          this.fairTradePrice.substring(0, this.fairTradePrice.length - 3) + '.' +
          this.fairTradePrice.substring(this.fairTradePrice.length - 3, this.fairTradePrice.length);
    }

    if (this.angeliquePrice.length > 3) {
      this.angeliquePrice =
          this.angeliquePrice.substring(0, this.angeliquePrice.length - 3) + '.' +
          this.angeliquePrice.substring(this.angeliquePrice.length - 3, this.angeliquePrice.length);
    }

    this.worldMarketHeight = Number(this.worldMarketPrice.slice(0, -3));
    this.fairTradeHeight = Number(this.fairTradePrice.slice(0, -3));
    this.angeliqueHeight = Number(this.angeliquePrice.slice(0, -3));
  }

}
