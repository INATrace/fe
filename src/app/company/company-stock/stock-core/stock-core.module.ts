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

@NgModule({
  declarations: [
    StockCoreTabComponent,
    StockOrderListComponent,
    StockPurchaseOrderDetailsComponent
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
    NgbPaginationModule,
    NgSelectModule
  ],
  exports: [
    StockOrderListComponent,
    StockPurchaseOrderDetailsComponent
  ]
})
export class StockCoreModule { }
