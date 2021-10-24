import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyLeftPanelComponent } from './company-left-panel/company-left-panel.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StockOrderListComponent } from '../company-stock/stock-core/stock-order-list/stock-order-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { StockPaymentsListComponent } from '../company-stock/stock-payments/stock-payments-list/stock-payments-list.component';
import { ComponentsModule } from '../../components/components.module';
import { ProducersItemComponent } from './producers-item/producers-item.component';

@NgModule({
  declarations: [
    CompanyLeftPanelComponent,
    StockOrderListComponent,
    StockPaymentsListComponent,
    ProducersItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ComponentsModule,
    FontAwesomeModule,
    NgbPaginationModule
  ],
  exports: [
    CompanyLeftPanelComponent,
    StockOrderListComponent,
    StockPaymentsListComponent,
    ProducersItemComponent
  ]
})
export class CompanyCommonModule { }
