import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { B2cRoutingModule } from './b2c-routing.module';
import { B2cPageComponent } from './b2c-page/b2c-page.component';
import { B2cIntroComponent } from './b2c-page/b2c-intro/b2c-intro.component';
import { B2cJourneyComponent } from './b2c-page/b2c-journey/b2c-journey.component';
import { B2cTabsComponent } from './b2c-tabs/b2c-tabs.component';
import { B2cFairPricesComponent } from './b2c-page/b2c-fair-prices/b2c-fair-prices.component';
import { B2cProducersComponent } from './b2c-page/b2c-producers/b2c-producers.component';
import { B2cQualityComponent } from './b2c-page/b2c-quality/b2c-quality.component';
import { B2cFeedbackComponent } from './b2c-page/b2c-feedback/b2c-feedback.component';
import { B2cTermsComponent } from './b2c-page/b2c-terms/b2c-terms.component';
import { B2cPrivacyComponent } from './b2c-page/b2c-privacy/b2c-privacy.component';


@NgModule({
  declarations: [
    B2cPageComponent,
    B2cIntroComponent,
    B2cJourneyComponent,
    B2cTabsComponent,
    B2cFairPricesComponent,
    B2cProducersComponent,
    B2cQualityComponent,
    B2cFeedbackComponent,
    B2cTermsComponent,
    B2cPrivacyComponent],
  imports: [
    CommonModule,
    B2cRoutingModule
  ]
})
export class B2cModule { }
