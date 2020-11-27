import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontPageFirstComponent } from './front-page-first/front-page-first.component';
import { FrontPageJourneyComponent } from './front-page-journey/front-page-journey.component';
import { FrontPageFairPricesComponent } from './front-page-fair-prices/front-page-fair-prices.component';
import { FrontPageProducersComponent } from './front-page-producers/front-page-producers.component';
import { FrontPageQualityComponent } from './front-page-quality/front-page-quality.component';
import { FrontPageFeedbackComponent } from './front-page-feedback/front-page-feedback.component';


const routes: Routes = [
  {
    path: '',
    component: FrontPageFirstComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null,
    }
  },
  {
    path: 'journey',
    component: FrontPageJourneyComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null,
      tab: 'journey'
    }
  },
  {
    path: 'fair-prices',
    component: FrontPageFairPricesComponent,
    pathMatch: 'full',
    data: {
      tab: 'fair-prices',
      drobtinice: null
    }
  },
  {
    path: 'producers',
    component: FrontPageProducersComponent,
    pathMatch: 'full',
    data: {
      tab: 'producers',
      drobtinice: null
    }
  },
  {
    path: 'quality',
    component: FrontPageQualityComponent,
    pathMatch: 'full',
    data: {
      tab: 'quality',
      drobtinice: null
    }
  },
  {
    path: 'feedback',
    component: FrontPageFeedbackComponent,
    pathMatch: 'full',
    data: {
      tab: 'feedback',
      drobtinice: null
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontPageRoutingModule { }
