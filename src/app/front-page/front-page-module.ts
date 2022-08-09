import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { FrontPageSlidingComponent } from './front-page-sliding/front-page-sliding.component';
import { FrontPageCarouselComponent } from './front-page-carousel/front-page-carousel.component';
import { FrontPageCommonModule } from '../front-page-common/front-page-common.module';

@NgModule({
    declarations: [
        FrontPageSlidingComponent,
        FrontPageCarouselComponent
    ],
    exports: [
        FrontPageCarouselComponent
    ],
    imports: [
        FrontPageCommonModule,
        CommonModule,
        CoreModule,
        ComponentsModule,
        SharedModule,
        GoogleMapsModule
    ]
})
export class FrontPageModule { }
