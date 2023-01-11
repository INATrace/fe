import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

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
import { GoogleMapsModule } from '@angular/google-maps';
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';
import { B2cCarouselComponent } from './b2c-components/b2c-carousel/b2c-carousel.component';


@NgModule({
  declarations: [
    B2cCarouselComponent,
    B2cPageComponent,
    B2cIntroComponent,
    B2cJourneyComponent,
    B2cTabsComponent,
    B2cFairPricesComponent,
    B2cProducersComponent,
    B2cQualityComponent,
    B2cFeedbackComponent,
    B2cTermsComponent,
    B2cPrivacyComponent,
  ],
    imports: [
        CommonModule,
        B2cRoutingModule,
        GoogleMapsModule,
        ComponentsModule,
        SharedModule
    ],
    providers: [
        DecimalPipe
    ]
})
export class B2cModule { }
