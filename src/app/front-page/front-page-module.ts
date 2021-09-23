import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule, NgbPaginationModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { QRCodeModule } from 'angular2-qrcode';
import { EllipsisModule } from 'ngx-ellipsis';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ComponentsModule } from 'src/app/components/components.module';
import { ContentsModule } from 'src/app/contents/contents.module';
import { LayoutModule } from 'src/app/layout/layout.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/system/core.module';
import { FrontPageFirstComponent } from './front-page-first/front-page-first.component';
import { FrontPageJourneyComponent } from './front-page-journey/front-page-journey.component';
import { FrontPageFairPricesComponent } from './front-page-fair-prices/front-page-fair-prices.component';
import { FrontPageProducersComponent } from './front-page-producers/front-page-producers.component';
import { FrontPageQualityComponent } from './front-page-quality/front-page-quality.component';
import { FrontPageFeedbackComponent } from './front-page-feedback/front-page-feedback.component';
import { FrontPageRoutingModule } from './front-page-routing.module';
import { FrontPageFooterComponent } from './front-page-footer/front-page-footer.component';
import { FrontPageHeaderComponent } from './front-page-header/front-page-header.component';

@NgModule({
  declarations: [
    FrontPageFirstComponent,
    FrontPageJourneyComponent,
    FrontPageFairPricesComponent,
    FrontPageProducersComponent,
    FrontPageQualityComponent,
    FrontPageFeedbackComponent,
    FrontPageHeaderComponent,
    FrontPageFooterComponent
  ],
  imports: [
    CommonModule,
    FrontPageRoutingModule,
    // Clean up unnecessary
    CoreModule,
    ComponentsModule,
    LayoutModule,
    FontAwesomeModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPageScrollModule,
    ContentsModule,
    EllipsisModule,
    QRCodeModule,
    NgbTimepickerModule,
    NgbDropdownModule,
    NgbPaginationModule,
    GoogleMapsModule,
    DragDropModule,
  ]
})
export class FrontPageModule { }
