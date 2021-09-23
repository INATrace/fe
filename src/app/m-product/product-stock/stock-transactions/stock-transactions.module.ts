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
import { ProductLabelTransactionListComponent } from './product-label-stock-transaction-list/product-label-stock-transaction-list.component';
import { StockTransactionTabComponent } from './stock-transaction-tab/stock-transaction-tab.component';
import { StockTransactionsRoutingModule } from './stock-transactions-routing.module';

@NgModule({
  declarations: [
    StockTransactionTabComponent,
    ProductLabelTransactionListComponent
  ],
  imports: [
    CommonModule,
    StockTransactionsRoutingModule,
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
export class StockTransactionsModule { }
