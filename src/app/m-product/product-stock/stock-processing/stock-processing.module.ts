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
import { ProductLabelStockProcessingFaciltyListComponent } from './product-label-stock-processing-facilty-list/product-label-stock-processing-facilty-list.component';
import { ProductLabelStockProcessingOrderDetailComponent } from './product-label-stock-processing-order-detail/product-label-stock-processing-order-detail.component';
import { StockProcessingRoutingModule } from './stock-processing-routing.module';
import { StockProcessingTabComponent } from './stock-processing-tab/stock-processing-tab.component';
import { OrderFieldsComponent } from './product-label-stock-processing-order-detail/order-fields/order-fields.component';



@NgModule({
  declarations: [
    StockProcessingTabComponent,
    ProductLabelStockProcessingFaciltyListComponent,
    ProductLabelStockProcessingOrderDetailComponent,
    OrderFieldsComponent
  ],
  imports: [
    CommonModule,
    StockProcessingRoutingModule,
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
export class StockProcessingModule { }
