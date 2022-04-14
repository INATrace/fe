import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { PublicControllerService } from '../../../api/api/publicController.service';
import { ActivatedRoute } from '@angular/router';
import { B2cJourneyComponent } from './b2c-journey/b2c-journey.component';
import { B2CTab } from '../b2c-tabs/b2c-tabs.component';
import { B2cFairPricesComponent } from './b2c-fair-prices/b2c-fair-prices.component';
import { B2cProducersComponent } from './b2c-producers/b2c-producers.component';
import { B2cQualityComponent } from './b2c-quality/b2c-quality.component';
import { B2cFeedbackComponent } from './b2c-feedback/b2c-feedback.component';

@Component({
  selector: 'app-b2c-page',
  templateUrl: './b2c-page.component.html',
  styleUrls: ['./b2c-page.component.scss']
})
export class B2cPageComponent implements OnInit {

  uuid = this.route.snapshot.params.uuid;
  qrTag = this.route.snapshot.params.qrTag;

  tab: B2CTab;

  constructor(
      private route: ActivatedRoute,
      private publicController: PublicControllerService
  ) {
    route.url.subscribe({
      next: () => {
        switch (route.snapshot.firstChild.component) {
          case B2cJourneyComponent:
            this.tab = B2CTab.JOURNEY;
            break;
          case B2cFairPricesComponent:
            this.tab = B2CTab.FAIR_PRICES;
            break;
          case B2cProducersComponent:
            this.tab = B2CTab.PRODUCERS;
            break;
          case B2cQualityComponent:
            this.tab = B2CTab.QUALITY;
            break;
          case B2cFeedbackComponent:
            this.tab = B2CTab.FEEDBACK;
            break;
          default:
            this.tab = undefined;
        }
      }
    });
  }

  loading = true;

  productName: string;

  headerColor: string;
  footerColor: string;

  ngOnInit(): void {
    this.publicController.getPublicProductLabelValuesUsingGET(this.uuid).pipe(take(1)).subscribe({
      next: (value) => {
        for (const field of value.data.fields) {
          if (field.name === 'name') {
            this.productName = field.value;
            break;
          }
        }
        this.headerColor = value.data.businessToCustomerSettings.headerColor;
        this.footerColor = value.data.businessToCustomerSettings.footerColor;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

}
