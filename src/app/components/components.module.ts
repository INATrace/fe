import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule, NgbPaginationModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { QRCodeModule } from 'angular2-qrcode';
import { EllipsisModule } from 'ngx-ellipsis';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ContentsModule } from '../contents/contents.module';
import { SharedModule } from '../shared/shared.module';
import { SystemModule } from '../system/system.module';
import { BottomButtonsComponent } from './bottom-buttons/bottom-buttons.component';
import { CardComponent } from './card/card.component';
import { DocumentCardComponent } from './document-card/document-card.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FormDetailsLeftPanelComponent } from './form-details-left-panel/form-details-left-panel.component';
import { FormPositionBoxComponent } from './form-position-box/form-position-box.component';
import { LastSeenTagComponent } from './last-seen-tag/last-seen-tag.component';
import { OrderCardComponent } from './order-card/order-card.component';
import { FormatAvailabilityPipe } from './pipes/format-availability.pipe';
import { FormatProcesingActionTypePipe } from './pipes/format-processing-action-type.pipe';
import { FormatProcessingEvidenceTypeTypePipe } from './pipes/format-processing-evidence-type-type.pipe';
import { FormatStockOrderTypePipe } from './pipes/format-stock-order-type.pipe';
import { FormatTransactionStatusPipe } from './pipes/format-transaction-status.pipe';
import { FormatTransactionTypePipe } from './pipes/format-transaction-type.pipe';
import { ProductLabelLeftPanelContentComponent } from './product-label-left-panel-content/product-label-left-panel-content.component';
import { RedirectClearCacheComponent } from './redirect-clear-cache/redirect-clear-cache.component';
import { FormatWayOfPaymentPipe } from './pipes/format-way-of-payment.pipe';
import { TranslateCodebookPipe } from './pipes/translate-codebook';
import { FormatCompanyCertsPipe } from './pipes/format-company-certs.pipe';
import { GenerateQRCodeModalComponent } from './generate-qr-code-modal/generate-qr-code-modal.component';
import { FormatPaymentPurposeTypePipe } from './pipes/format-payment-purpose-type';



@NgModule({
  declarations: [
    BottomButtonsComponent,
    DropdownComponent,
    FormDetailsLeftPanelComponent,
    FormPositionBoxComponent,
    LastSeenTagComponent,
    OrderCardComponent,
    FormatAvailabilityPipe,
    FormatStockOrderTypePipe,
    ProductLabelLeftPanelContentComponent,
    RedirectClearCacheComponent,
    CardComponent,
    DocumentCardComponent,
    FormatTransactionTypePipe,
    FormatTransactionStatusPipe,
    FormatProcesingActionTypePipe,
    FormatProcessingEvidenceTypeTypePipe,
    FormatWayOfPaymentPipe,
    TranslateCodebookPipe,
    FormatCompanyCertsPipe,
    GenerateQRCodeModalComponent,
    FormatPaymentPurposeTypePipe
  ],
  imports: [
    CommonModule,
    // Clean up unnecessary
    RouterModule,
    SystemModule,
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
    GoogleMapsModule,
    DragDropModule,

  ],
  exports: [
    BottomButtonsComponent,
    DropdownComponent,
    FormDetailsLeftPanelComponent,
    FormPositionBoxComponent,
    LastSeenTagComponent,
    OrderCardComponent,
    FormatAvailabilityPipe,
    FormatStockOrderTypePipe,
    ProductLabelLeftPanelContentComponent,
    RedirectClearCacheComponent,
    ProductLabelLeftPanelContentComponent,
    RedirectClearCacheComponent,
    FormatTransactionTypePipe,
    FormatTransactionStatusPipe,
    FormatProcesingActionTypePipe,
    FormatProcessingEvidenceTypeTypePipe,
    FormatWayOfPaymentPipe,
    TranslateCodebookPipe,
    FormatCompanyCertsPipe,
    GenerateQRCodeModalComponent,
    DocumentCardComponent,
    FormatPaymentPurposeTypePipe
  ],
  providers: [
    FormatPaymentPurposeTypePipe
  ]
})
export class ComponentsModule { }
