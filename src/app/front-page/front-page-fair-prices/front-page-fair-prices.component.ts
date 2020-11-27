import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicControllerService } from 'src/api/api/publicController.service';
import { take } from 'rxjs/operators';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-front-page-fair-prices',
  templateUrl: './front-page-fair-prices.component.html',
  styleUrls: ['./front-page-fair-prices.component.scss']
})
export class FrontPageFairPricesComponent implements OnInit {

  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll(event) {
    this.pageYoffset = window.pageYOffset;
  }

  constructor(
    private route: ActivatedRoute,
    private publicController: PublicControllerService,
    private chainStockOrderController: StockOrderService,
    private scroll: ViewportScroller
  ) { }

  tab: string = null;
  title = $localize`:@@frontPage.fair-prices.title:Fair prices`;
  title2 = $localize`:@@frontPage.fair-prices.title2:Increase of farmers' income through Angelique's Finest`;
  uuid = this.route.snapshot.params.uuid;
  soid = this.route.snapshot.params.soid;
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

  numberOrder: string = "";

  chartsArePrepared: boolean = false;

  ngOnInit(): void {
    this.tab = this.route.snapshot.data.tab;
    this.initLabel();
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }

  async initLabel() {
    let res = await this.publicController.getPublicProductLabelValuesUsingGET(this.uuid).pipe(take(1)).toPromise();
    if (res && res.status === "OK") {
      this.pricesAndDescription(res.data.fields);
    }

    if (this.soid != 'EMPTY') {

      let res = await this.chainStockOrderController.getB2CDataForStockOrder(this.soid, true).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data && res.data.length >= 1) {
        this.numberOrder = res.data[0].orderId;
      }

    }

  }

  pricesAndDescription(data) {
    let prices = null;
    for (let item of data) {
      if (item.name === "comparisonOfPrice.prices") {
        prices = item.value;
      }
      if (item.name === "comparisonOfPrice.description") {
        this.desc = item.value;
      }
      if (item.name === "settings.incomeIncreaseDescription") {
        this.descPricing = item.value;
      }
      if (item.name === "settings.increaseOfCoffee") {
        this.increaseOfCoffee = Math.round(item.value);
      }
    }

    this.worldMarketPrice = Math.round(prices.worldMarket * prices.poundToKg * prices.containerSize).toString();
    this.fairTradePrice = Math.round(prices.fairTrade * prices.poundToKg * prices.containerSize).toString();
    if (prices.estimatedAdditionalPrice) this.angeliquePrice = Math.round(prices.estimatedAdditionalPrice * prices.EURtoUSD * prices.containerSize).toString(); //"120629"; //TODO
    else this.angeliquePrice = "120629"; //TODO
    //TODO (information from the order (from KK -> RW)
    //Angelique's Finest Price Paid to Cooperatives (get from order RW->PROD)
    //Angelique's Finest Women Premium to farmers (get from order RW->FARM)

    if (this.worldMarketPrice.length > 3) {
      this.worldMarketPrice = this.worldMarketPrice.substring(0, this.worldMarketPrice.length - 3) + '.' + this.worldMarketPrice.substring(this.worldMarketPrice.length - 3, this.worldMarketPrice.length);
    }
    if (this.fairTradePrice.length > 3) {
      this.fairTradePrice = this.fairTradePrice.substring(0, this.fairTradePrice.length - 3) + '.' + this.fairTradePrice.substring(this.fairTradePrice.length - 3, this.fairTradePrice.length);
    }
    if (this.angeliquePrice.length > 3) {
      this.angeliquePrice = this.angeliquePrice.substring(0, this.angeliquePrice.length - 3) + '.' + this.angeliquePrice.substring(this.angeliquePrice.length - 3, this.angeliquePrice.length);
    }
    this.worldMarketHeight = parseInt(this.worldMarketPrice.slice(0, -3));
    this.fairTradeHeight = parseInt(this.fairTradePrice.slice(0, -3));
    this.angeliqueHeight = parseInt(this.angeliquePrice.slice(0, -3));


  }

  label1 = $localize`:@@frontPage.fair-prices.barChart.label1:World market price for Arabica coffee`;
  label2 = $localize`:@@frontPage.fair-prices.barChart.label2:Fairtrade Price`;
  label3 = $localize`:@@frontPage.fair-prices.barChart.label3:Angelique’s Finest`;
  label2Farmers = $localize`:@@frontPage.fair-prices.barChart.label1Farmers:Price paid if sold as Angelique's Finest`;
  label1Farmers = $localize`:@@frontPage.fair-prices.barChart.label2Farmers:Average price paid if not sold as Angelique's Finest`;
  label0Farmers = $localize`:@@frontPage.fair-prices.barChart.label0Farmers:Increase in % per kg of coffee sold`;





}
