import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../core/core.module';
import { ComponentsModule } from '../../../components/components.module';
import { LayoutModule } from '../../../layout/layout.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockCoreTabComponent } from './stock-core-tab/stock-core-tab.component';
import { StockOrderListComponent } from './stock-order-list/stock-order-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { StockPurchaseOrderDetailsComponent } from './stock-purchase-order-details/stock-purchase-order-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AdditionalProofItemComponent } from './additional-proof-item/additional-proof-item.component';
import { StockPurchaseOrderDetailsBulkComponent } from './stock-purchase-order-details-bulk/stock-purchase-order-details-bulk.component';
import { OrderHistoryComponent } from './order-history/order-history.component';

@NgModule({
  declarations: [
    StockCoreTabComponent,
    StockPurchaseOrderDetailsComponent,
    StockPurchaseOrderDetailsBulkComponent,
    AdditionalProofItemComponent,
    OrderHistoryComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    ComponentsModule,
    LayoutModule,
    FontAwesomeModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DragDropModule
  ],
  exports: [
    StockPurchaseOrderDetailsComponent,
    StockPurchaseOrderDetailsBulkComponent,
    AdditionalProofItemComponent
  ]
})
export class StockCoreModule { }
