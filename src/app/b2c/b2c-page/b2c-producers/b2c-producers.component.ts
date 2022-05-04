import { Component, Inject, OnInit } from '@angular/core';
import { B2cPageComponent } from '../b2c-page.component';
import { ApiBusinessToCustomerSettings } from '../../../../api/model/apiBusinessToCustomerSettings';

@Component({
  selector: 'app-b2c-producers',
  templateUrl: './b2c-producers.component.html',
  styleUrls: ['./b2c-producers.component.scss']
})
export class B2cProducersComponent implements OnInit {

  b2cSettings: ApiBusinessToCustomerSettings;

  titleFarmers = $localize`:@@frontPage.producers.title.meetFarmers:Meet the farmers`;
  titleCooperative = $localize`:@@frontPage.producers.title.meetCooperative:Meet the cooperative`;

  videoRWurl = null;
  videoMeetTheFarmers = null;
  picsMeetTheFarmers: any[] = [];
  picsProduction: any[] = [];

  companyName: string = null;
  companyLogo = null;
  companyHeadquarters = null;
  companyAbout: string = null;
  companyEmail: string = null;
  companyNumber: string = null;
  companyPage: string = null;

  coopAbout: string = null;

  email = $localize`:@@frontPage.producers.title.email:Contact E-mail`;
  phone = $localize`:@@frontPage.producers.title.phone:Contact phone number`;
  webPage = $localize`:@@frontPage.producers.title.webPage:Company webpage URL`;
  headquarters = $localize`:@@frontPage.producers.title.headquarters:Company headquarters`;

  companyNameCooperative: string = null;

  lang = 'EN';

  productName = '';

  constructor(
      @Inject(B2cPageComponent) private b2cPage: B2cPageComponent
  ) {
    this.b2cSettings = b2cPage.b2cSettings;
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    for (const item of this.b2cPage.publicProductLabel.fields) {
      if (item.name === 'name') {
        this.productName = item.value;
      }
      if (item.name === 'settings.language') {
        this.lang = item.value;
      }
    }
  }

}
