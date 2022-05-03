import { Component, Inject, OnInit } from '@angular/core';
import { B2cPageComponent } from '../b2c-page.component';
import { ApiBusinessToCustomerSettings } from '../../../../api/model/apiBusinessToCustomerSettings';
import { take } from 'rxjs/operators';
import { PublicControllerService } from '../../../../api/api/publicController.service';

@Component({
  selector: 'app-b2c-quality',
  templateUrl: './b2c-quality.component.html',
  styleUrls: ['./b2c-quality.component.scss']
})
export class B2cQualityComponent implements OnInit {

  b2cSettings: ApiBusinessToCustomerSettings;

  title = $localize`:@@frontPage.quality.title:Quality and Certificates`;
  subtitle = $localize`:@@frontPage.quality.subtitle:Flavor profile`;
  chartsArePrepared = false;

  rwCerts = [];
  coopCerts = [];
  kfCerts = [];

  lang = 'EN';

  grade = 80;
  gradeHeight = 160;
  flavour = '';

  label1 = $localize`:@@frontPage.quality.chart.label1:80 points = specialty coffee`;
  label2 = '';

  productName = '';

  constructor(
      @Inject(B2cPageComponent) private b2cPage: B2cPageComponent,
      private publicController: PublicControllerService
  ) {
    this.b2cSettings = b2cPage.b2cSettings;
  }

  ngOnInit(): void {
  }

  async prepareCertificatesDataAndCharts() {
    // Rwashoscco 2
    // KaffeeKoop 4
    // Musasa 3
    // Koakaka 1

    for (const item of this.b2cPage.publicProductLabel.fields) {
      if (item.name === 'name') {
        this.productName = item.value;
      }
      if (item.name === 'settings.language') {
        this.lang = item.value;
      }
    }
  }

  async downloadCert(data) {

    const res = await this.publicController.getPublicDocumentUsingGET(data.storageKey).pipe(take(1)).toPromise();
    if (res) {
      const a = document.createElement('a');
      const blobURL = URL.createObjectURL(res);
      a.download = data.name;
      a.href = blobURL;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

}
