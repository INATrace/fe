import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../core/core.module';
import { ComponentsModule } from '../../../components/components.module';
import { LayoutModule } from '../../../layout/layout.module';
import { SharedModule } from '../../../shared/shared.module';
import { CompanyCommonModule } from '../../company-common/company-common.module';
import { StockCoreModule } from '../stock-core/stock-core.module';
import { StockPaymentsTabComponent } from './stock-payments-tab/stock-payments-tab.component';
import { StockPaymentsRoutingModule } from './stock-payments-routing.module';

@NgModule({
  declarations: [
      StockPaymentsTabComponent
  ],
  imports: [
    CommonModule,
    StockPaymentsRoutingModule,
    CoreModule,
    ComponentsModule,
    LayoutModule,
    SharedModule,
    CompanyCommonModule,
    StockCoreModule
  ]
})
export class StockPaymentsModule { }
