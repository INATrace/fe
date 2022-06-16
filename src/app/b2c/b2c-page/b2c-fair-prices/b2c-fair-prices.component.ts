import { Component, Inject, OnInit } from '@angular/core';
import { B2cPageComponent } from '../b2c-page.component';
import { ApiBusinessToCustomerSettings } from '../../../../api/model/apiBusinessToCustomerSettings';
import GraphicPriceToProducerEnum = ApiBusinessToCustomerSettings.GraphicPriceToProducerEnum;
import { DecimalPipe } from '@angular/common';

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

  worldMarketPrice: number = null;
  fairTradePrice: number = null;
  angeliquePrice: number = null;
  increaseOfCoffee: string = null;

  farmGateAveragePrice: number;
  farmGateProductPrice: number;

  worldMarketHeight: number = null;
  fairTradeHeight: number = null;
  angeliqueHeight: number = null;

  orderId = '';

  chartsArePrepared = false;

  label1 = $localize`:@@frontPage.fair-prices.barChart.label1:World market price for Arabica coffee`;
  label2 = $localize`:@@frontPage.fair-prices.barChart.label2:Fairtrade Price`;

  label0Farmers = $localize`:@@frontPage.fair-prices.barChart.label0Farmers:Increase in % per kg of coffee sold`;

  productName = '';
  
  producerPriceGraphic: boolean;
  producerPriceGraphicUnit: string;
  producerPriceGraphicText: string;

  farmerPriceGraphic: boolean;

  producerUnitEnum = GraphicPriceToProducerEnum;

  constructor(
      @Inject(B2cPageComponent) private b2cPage: B2cPageComponent,
      private decimalPipe: DecimalPipe
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

    switch (this.b2cSettings.graphicPriceToProducer) {
      case ApiBusinessToCustomerSettings.GraphicPriceToProducerEnum.DISABLED:
        this.producerPriceGraphic = false;
        break;
      case ApiBusinessToCustomerSettings.GraphicPriceToProducerEnum.PERCONTAINER:
        this.producerPriceGraphic = true;
        this.producerPriceGraphicUnit = $localize`:@@productLabel.b2c.price.unit.container:per container`;
        break;
      case ApiBusinessToCustomerSettings.GraphicPriceToProducerEnum.PERKG:
        this.producerPriceGraphic = true;
        this.producerPriceGraphicUnit = $localize`:@@productLabel.b2c.price.unit.kg:per kg`;
        break;
      case ApiBusinessToCustomerSettings.GraphicPriceToProducerEnum.PERCENTVALUE:
        this.producerPriceGraphic = true;
        this.producerPriceGraphicUnit = $localize`:@@productLabel.b2c.price.unit.percentValue:% value`;
        break;
    }

    this.producerPriceGraphicText = $localize`:@@front-page.fair-prices.paragraph1:${this.orderId}:INTERPOLATION:${this.producerPriceGraphicUnit}:UNIT:`;

    switch (this.b2cSettings.graphicFarmGatePrice) {
      case ApiBusinessToCustomerSettings.GraphicFarmGatePriceEnum.DISABLED:
        this.farmerPriceGraphic = false;
        break;
      default:
        this.farmerPriceGraphic = true;
        break;
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
      // if (item.name === 'settings.increaseOfCoffee') {
      //   this.increaseOfCoffee = Math.round(item.value);
      // }
    }

    const producerPrice = this.b2cPage.qrProductLabel.priceToProducer ? this.b2cPage.qrProductLabel.priceToProducer : this.b2cSettings.manualProducerPrice;
    switch (this.b2cSettings.graphicPriceToProducer) {
      case ApiBusinessToCustomerSettings.GraphicPriceToProducerEnum.PERCONTAINER:
        this.worldMarketPrice = prices.worldMarket * prices.poundToKg * prices.containerSize;
        this.fairTradePrice = prices.fairTrade * prices.poundToKg * prices.containerSize;
        this.angeliquePrice = producerPrice * prices.containerSize;
        break;
      case ApiBusinessToCustomerSettings.GraphicPriceToProducerEnum.PERKG:
        this.worldMarketPrice = prices.worldMarket * prices.poundToKg;
        this.fairTradePrice = prices.fairTrade * prices.poundToKg;
        this.angeliquePrice = producerPrice;
        break;
      case GraphicPriceToProducerEnum.PERCENTVALUE:
        this.worldMarketPrice = 100;
        this.fairTradePrice = prices.fairTrade / prices.worldMarket * 100;
        this.angeliquePrice = producerPrice / prices.worldMarket * 100;
        break;
    }

    const farmGatePrice = this.b2cPage.qrProductLabel.priceToFarmer ? this.b2cPage.qrProductLabel.priceToFarmer : this.b2cSettings.manualFarmGatePrice;
    switch (this.b2cSettings.graphicFarmGatePrice) {
      case ApiBusinessToCustomerSettings.GraphicFarmGatePriceEnum.PERCONTAINER:
        this.farmGateAveragePrice = prices.averageRegionFarmGatePrice * prices.poundToKg * prices.containerSize;
        this.farmGateProductPrice = farmGatePrice * prices.containerSize;
        this.increaseOfCoffee = '$' + this.decimalPipe.transform(this.farmGateProductPrice, '1.0-3');
        break;
      case ApiBusinessToCustomerSettings.GraphicFarmGatePriceEnum.PERKG:
        this.farmGateAveragePrice = prices.averageRegionFarmGatePrice * prices.poundToKg;
        this.farmGateProductPrice = farmGatePrice;
        this.increaseOfCoffee = '$' + this.decimalPipe.transform(this.farmGateProductPrice, '1.0-3');
        break;
      case ApiBusinessToCustomerSettings.GraphicFarmGatePriceEnum.PERCENTVALUE:
        this.farmGateAveragePrice = prices.averageRegionFarmGatePrice * prices.poundToKg;
        this.farmGateProductPrice = farmGatePrice / this.farmGateAveragePrice * 100 - 100;
        this.increaseOfCoffee = '+' + this.decimalPipe.transform(this.farmGateProductPrice, '1.0-0') + '%';
        break;
    }
  }

}