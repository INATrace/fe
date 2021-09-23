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
import { StockCoreModule } from '../stock-core/stock-core.module';
import { ProductLabelStockBulkPaymentDetailComponent } from './product-label-stock-bulk-payment-detail/product-label-stock-bulk-payment-detail.component';
import { ProductLabelStockBulkPaymentListComponent } from './product-label-stock-bulk-payment-list/product-label-stock-bulk-payment-list.component';
import { ProductLabelStockPaymentDetailComponent } from './product-label-stock-payment-detail/product-label-stock-payment-detail.component';
import { ProductLabelStockPaymentListComponent } from './product-label-stock-payment-list/product-label-stock-payment-list.component';
import { StockPaymentsRoutingModule } from './stock-payments-routing.module';
import { StockPaymentsTabComponent } from './stock-payments-tab/stock-payments-tab.component';

@NgModule({
  declarations: [
    StockPaymentsTabComponent,
    ProductLabelStockBulkPaymentDetailComponent,
    ProductLabelStockBulkPaymentListComponent,
    ProductLabelStockPaymentDetailComponent,
    ProductLabelStockPaymentListComponent,
  ],
  imports: [
    CommonModule,
    StockPaymentsRoutingModule,
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
    StockCoreModule

  ]
})
export class StockPaymentsModule { }
