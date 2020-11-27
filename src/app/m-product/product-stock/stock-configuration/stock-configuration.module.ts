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
import { SystemModule } from 'src/app/system/system.module';
import { StockCoreModule } from '../stock-core/stock-core.module';
import { ProductLabelStockFacilityListComponent } from './product-label-stock-facility-list/product-label-stock-facility-list.component';
import { ProductLabelStockFacilityModalComponent } from './product-label-stock-facility-modal/product-label-stock-facility-modal.component';
import { ProductLabelStockProcessingActionDetailComponent } from './product-label-stock-processing-action-detail/product-label-stock-processing-action-detail.component';
import { ProductLabelStockProcessingActionListComponent } from './product-label-stock-processing-action-list/product-label-stock-processing-action-list.component';
import { SemiProductDetailModalComponent } from './semi-product-detail-modal/semi-product-detail-modal.component';
import { SemiProductListingComponent } from './semi-product-listing/semi-product-listing.component';
import { StockConfigurationRoutingModule } from './stock-configuration-routing.module';
import { StockConfigurationTabComponent } from './stock-configuration-tab/stock-configuration-tab.component';



@NgModule({
  declarations: [
    StockConfigurationTabComponent,
    ProductLabelStockFacilityListComponent,
    ProductLabelStockFacilityModalComponent,
    SemiProductDetailModalComponent,
    SemiProductListingComponent,
    ProductLabelStockProcessingActionDetailComponent,
    ProductLabelStockProcessingActionListComponent,
  ],
  imports: [
    CommonModule,
    StockConfigurationRoutingModule,
    // Clean up unnecessary
    SystemModule,
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
    StockCoreModule
  ]
})
export class StockConfigurationModule { }
