import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityStockOrderSelectorForNewPaymentModalComponent } from './facility-stock-order-selector-for-new-payment-modal/facility-stock-order-selector-for-new-payment-modal.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTimepickerModule, NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { QRCodeModule } from 'angular2-qrcode';
import { EllipsisModule } from 'ngx-ellipsis';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ComponentsModule } from 'src/app/components/components.module';
import { ContentsModule } from 'src/app/contents/contents.module';
import { LayoutModule } from 'src/app/layout/layout.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { ProcessingEvidenceItemComponent } from './processing-evidence-item/processing-evidence-item.component';
import { FacilityCardComponent } from './facility-card/facility-card.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { PaymentItemComponent } from './payment-item/payment-item.component';
import { StockTabCoreComponent } from './stock-tab-core/stock-tab-core.component';
import { ProductLabelStockOrderListComponent } from './product-label-stock-order-list/product-label-stock-order-list.component';
import { StockPurchaseOrderEditComponent } from './stock-purchase-order-edit/stock-purchase-order-edit.component';
import { ProductLabelStockProcessingOrderListComponent } from './product-label-stock-processing-order-list/product-label-stock-processing-order-list.component';
import { OrderHistoryViewComponent } from './order-history-view/order-history-view.component';
import { FieldOrDocInfoComponent } from './field-or-doc-info/field-or-doc-info.component';
import { RejectTransactionModalComponent } from './reject-transaction-modal/reject-transaction-modal.component';
import { ProductCommonModule } from '../../product-common/product-common.module';

@NgModule({
  declarations: [
    FacilityStockOrderSelectorForNewPaymentModalComponent,
    ProcessingEvidenceItemComponent,
    FacilityCardComponent,
    PaymentFormComponent,
    PaymentItemComponent,
    StockTabCoreComponent,
    ProductLabelStockOrderListComponent,
    StockPurchaseOrderEditComponent,
    ProductLabelStockProcessingOrderListComponent,
    OrderHistoryViewComponent,
    FieldOrDocInfoComponent,
    RejectTransactionModalComponent
  ],
  imports: [
    CommonModule,
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
    // BrowserAnimationsModule,
    NgbTimepickerModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgSelectModule,
    GoogleMapsModule,
    DragDropModule,
    ProductCommonModule
  ],
  exports: [
    FacilityStockOrderSelectorForNewPaymentModalComponent,
    ProcessingEvidenceItemComponent,
    FacilityCardComponent,
    PaymentFormComponent,
    PaymentItemComponent,
    StockTabCoreComponent,
    ProductLabelStockOrderListComponent,
    StockPurchaseOrderEditComponent,
    ProductLabelStockProcessingOrderListComponent,
    OrderHistoryViewComponent,
    FieldOrDocInfoComponent,
    ProductCommonModule
  ]
})
export class StockCoreModule { }
