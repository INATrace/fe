import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockPurchasesRoutingModule } from './stock-purchases-routing.module';
import { StockPurchasesTabComponent } from './stock-purchases-tab/stock-purchases-tab.component';
import { CoreModule } from '../../../core/core.module';
import { ComponentsModule } from '../../../components/components.module';
import { LayoutModule } from '../../../layout/layout.module';
import { SharedModule } from '../../../shared/shared.module';
import { CompanyCommonModule } from '../../company-common/company-common.module';
import { StockCoreModule } from '../stock-core/stock-core.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [StockPurchasesTabComponent],
  imports: [
    CommonModule,
    StockPurchasesRoutingModule,
    CoreModule,
    ComponentsModule,
    LayoutModule,
    SharedModule,
    CompanyCommonModule,
    StockCoreModule,
    NgbDropdownModule,
    FontAwesomeModule
  ]
})
export class StockPurchasesModule { }
