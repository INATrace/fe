import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { FrontPageFirstComponent } from './front-page-first/front-page-first.component';
import { FrontPageJourneyComponent } from './front-page-journey/front-page-journey.component';
import { FrontPageFairPricesComponent } from './front-page-fair-prices/front-page-fair-prices.component';
import { FrontPageProducersComponent } from './front-page-producers/front-page-producers.component';
import { FrontPageQualityComponent } from './front-page-quality/front-page-quality.component';
import { FrontPageFeedbackComponent } from './front-page-feedback/front-page-feedback.component';
import { FrontPageRoutingModule } from './front-page-routing.module';
import { FrontPageSlidingComponent } from './front-page-sliding/front-page-sliding.component';
import { FrontPageCarouselComponent } from './front-page-carousel/front-page-carousel.component';
import { FrontPageCommonModule } from '../front-page-common/front-page-common.module';

@NgModule({
    declarations: [
        FrontPageFirstComponent,
        FrontPageJourneyComponent,
        FrontPageFairPricesComponent,
        FrontPageProducersComponent,
        FrontPageQualityComponent,
        FrontPageFeedbackComponent,
        FrontPageSlidingComponent,
        FrontPageCarouselComponent
    ],
    exports: [
        FrontPageCarouselComponent
    ],
    imports: [
        FrontPageRoutingModule,
        FrontPageCommonModule,
        CommonModule,
        CoreModule,
        ComponentsModule,
        SharedModule,
        GoogleMapsModule
    ]
})
export class FrontPageModule { }
