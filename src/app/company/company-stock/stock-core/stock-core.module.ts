import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../core/core.module';
import { ComponentsModule } from '../../../components/components.module';
import { LayoutModule } from '../../../layout/layout.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockCoreTabComponent } from './stock-core-tab/stock-core-tab.component';
import { StockDeliveryDetailsComponent } from './stock-delivery-details/stock-delivery-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AdditionalProofItemComponent } from './additional-proof-item/additional-proof-item.component';
import { StockBulkDeliveryDetailsComponent } from './stock-bulk-delivery-details/stock-bulk-delivery-details.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { QRCodeModule } from 'angular2-qrcode';
import { GroupStockOrderListComponent } from './group-stock-order-list/group-stock-order-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    StockCoreTabComponent,
    StockDeliveryDetailsComponent,
    StockBulkDeliveryDetailsComponent,
    AdditionalProofItemComponent,
    OrderHistoryComponent,
    GroupStockOrderListComponent
  ],
    imports: [
        CommonModule,
        CoreModule,
        ComponentsModule,
        LayoutModule,
        FontAwesomeModule,
        SharedModule,
        QRCodeModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        DragDropModule,
        NgbPaginationModule
    ],
    exports: [
        StockDeliveryDetailsComponent,
        StockBulkDeliveryDetailsComponent,
        AdditionalProofItemComponent,
        GroupStockOrderListComponent
    ]
})
export class StockCoreModule { }
