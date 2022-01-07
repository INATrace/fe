import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicControllerService } from 'src/api/api/publicController.service';
import { take } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-front-page-fair-prices',
  templateUrl: './front-page-fair-prices.component.html',
  styleUrls: ['./front-page-fair-prices.component.scss']
})
export class FrontPageFairPricesComponent implements OnInit {

  tab: string = null;
  title = $localize`:@@frontPage.fair-prices.title:Fair prices`;
  title2 = $localize`:@@frontPage.fair-prices.title2:Increase of farmers' income through Angelique's Finest`;

  uuid = this.route.snapshot.params.uuid;
  qrTag = this.route.snapshot.params.qrTag;

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
  label3 = $localize`:@@frontPage.fair-prices.barChart.label3:Angelique’s Finest`;
  label2Farmers = $localize`:@@frontPage.fair-prices.barChart.label1Farmers:Price paid if sold as Angelique's Finest`;
  label1Farmers = $localize`:@@frontPage.fair-prices.barChart.label2Farmers:Average price paid if not sold as Angelique's Finest`;
  label0Farmers = $localize`:@@frontPage.fair-prices.barChart.label0Farmers:Increase in % per kg of coffee sold`;

  pageYOffset = 0;

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.pageYOffset = window.pageYOffset;
  }

  constructor(
    private route: ActivatedRoute,
    private publicController: PublicControllerService,
    private scroll: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.tab = this.route.snapshot.data.tab;
    this.initLabel().then();
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }

  async initLabel() {

    const respProdLabel = await this.publicController.getPublicProductLabelValuesUsingGET(this.uuid).pipe(take(1)).toPromise();
    if (respProdLabel && respProdLabel.status === 'OK') {
      this.pricesAndDescription(respProdLabel.data.fields);
    }

    if (this.qrTag !== 'EMPTY') {
      const respPubStockOrder = await this.publicController.getQRTagPublicDataUsingGET(this.qrTag).pipe(take(1)).toPromise();
      if (respPubStockOrder && respPubStockOrder.status === 'OK' && respPubStockOrder.data) {
        this.orderId = respPubStockOrder.data.orderId;
      }
    }
  }

  pricesAndDescription(data) {

    let prices = null;

    for (const item of data) {
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
