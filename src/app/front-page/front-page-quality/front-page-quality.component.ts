import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Label, Color } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { take } from 'rxjs/operators';
import { PublicControllerService } from 'src/api/api/publicController.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-front-page-quality',
  templateUrl: './front-page-quality.component.html',
  styleUrls: ['./front-page-quality.component.scss']
})
export class FrontPageQualityComponent implements OnInit {

  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll(event) {
    this.pageYoffset = window.pageYOffset;
  }

  constructor(
    private route: ActivatedRoute,
    private publicController: PublicControllerService,
    private chainStockOrderController: StockOrderService,
    private chainOrganizationController: OrganizationService,
    private scroll: ViewportScroller
  ) { }

  tab: string = null;

  title = $localize`:@@frontPage.quality.title:Quality and Certificates`;
  subtitle = $localize`:@@frontPage.quality.subtitle:Flavor profile`;
  chartsArePrepared: boolean = false;

  rwCerts = [];
  coopCerts = [];
  kfCerts = [];

  lang: string = 'EN';
  soid = this.route.snapshot.params.soid;
  uuid = this.route.snapshot.params.uuid;

  grade: number = 80;
  gradeHeight: number = 160;
  flavour: string = "";

  ngOnInit(): void {
    this.tab = this.route.snapshot.data.tab;
    this.prepareCertificatesDataAndCharts();
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }

  label1 = $localize`:@@frontPage.quality.chart.label1:80 points = specialty coffee`;
  label2 = "";

  async prepareCertificatesDataAndCharts() {
    //Rwashoscco 2
    //KaffeeKoop 4
    //Musasa 3
    //Koakaka 1

    let res = await this.publicController.getPublicProductLabelValuesUsingGET(this.uuid).pipe(take(1)).toPromise();
    if (res && res.status === "OK" && res.data) {
      for (let item of res.data.fields) {
        if (item.name === 'settings.language') this.lang = item.value;
      }

      if (this.soid != 'EMPTY') {

        let resRW = await this.publicController.getPublicCompanyUsingGET(2, this.lang).pipe(take(1)).toPromise();
        if (resRW && resRW.status === "OK" && resRW.data && resRW.data.certifications) {
          for (let data of resRW.data.certifications) {
            this.rwCerts.push(data);
          }
        }

        let resKF = await this.publicController.getPublicCompanyUsingGET(4, this.lang).pipe(take(1)).toPromise();
        if (resKF && resKF.status === "OK" && resKF.data && resKF.data.certifications) {
          for (let data of resKF.data.certifications) {
            this.kfCerts.push(data);
          }
        }

        let res = await this.chainStockOrderController.getB2CDataForStockOrder(this.soid, false, true, true).pipe(take(1)).toPromise();
        if (res && res.status === "OK" && res.data && res.data.length >= 1) {

          if (res.data.length >= 2) {
            this.grade = parseFloat(res.data[1].grade);
            this.gradeHeight = 2 * this.grade;
          }
          if (res.data.length >= 3) {
            this.flavour = res.data[2].flavour;
          }

          let resCOOP = await this.publicController.getPublicCompanyUsingGET(res.data[0].cooperativeAFId, this.lang).pipe(take(1)).toPromise();
          if (resCOOP && resCOOP.status === "OK" && resCOOP.data && resCOOP.data.certifications) {
            for (let data of resCOOP.data.certifications) {
              this.coopCerts.push(data);
            }
          }



          this.label2 = $localize`:@@frontPage.quality.chart.label2:${this.grade} points`;
        }

      }
    }

  }

  async downloadCert(data) {
    let res = await this.publicController.getPublicDocumentUsingGET(data.storageKey).pipe(take(1)).toPromise();

    if (res) {
      let a = document.createElement("a");
      let blobURL = URL.createObjectURL(res);
      a.download = data.name;
      a.href = blobURL;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

  }



}

