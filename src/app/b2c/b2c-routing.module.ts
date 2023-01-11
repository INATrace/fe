import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { B2cPageComponent } from './b2c-page/b2c-page.component';
import { B2cIntroComponent } from './b2c-page/b2c-intro/b2c-intro.component';
import { B2cJourneyComponent } from './b2c-page/b2c-journey/b2c-journey.component';
import { B2cFairPricesComponent } from './b2c-page/b2c-fair-prices/b2c-fair-prices.component';
import { B2cProducersComponent } from './b2c-page/b2c-producers/b2c-producers.component';
import { B2cQualityComponent } from './b2c-page/b2c-quality/b2c-quality.component';
import { B2cFeedbackComponent } from './b2c-page/b2c-feedback/b2c-feedback.component';
import { B2cTermsComponent } from './b2c-page/b2c-terms/b2c-terms.component';
import { B2cPrivacyComponent } from './b2c-page/b2c-privacy/b2c-privacy.component';

const routes: Routes = [
  {
    path: ':uuid/:qrTag',
    component: B2cPageComponent,
    children: [
      {
        path: '',
        component: B2cIntroComponent
      },
      {
        path: 'journey',
        component: B2cJourneyComponent
      },
      {
        path: 'fair-prices',
        component: B2cFairPricesComponent
      },
      {
        path: 'producers',
        component: B2cProducersComponent
      },
      {
        path: 'quality',
        component: B2cQualityComponent
      },
      {
        path: 'feedback',
        component: B2cFeedbackComponent
      },
      {
        path: 'terms-of-use',
        component: B2cTermsComponent
      },
      {
        path: 'privacy-policy',
        component: B2cPrivacyComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class B2cRoutingModule { }
