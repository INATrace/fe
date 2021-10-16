import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockOrdersRoutingModule } from './stock-orders-routing.module';
import { StockOrdersTabComponent } from './stock-orders-tab/stock-orders-tab.component';
import { StockCoreModule } from '../stock-core/stock-core.module';
import { LayoutModule } from '../../../layout/layout.module';
import { CompanyCommonModule } from '../../company-common/company-common.module';


@NgModule({
  declarations: [StockOrdersTabComponent],
  imports: [
    CommonModule,
    StockCoreModule,
    StockOrdersRoutingModule,
    LayoutModule,
    CompanyCommonModule
  ]
})
export class StockOrdersModule { }
