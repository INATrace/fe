import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockAllStockRoutingModule } from './stock-all-stock-routing.module';
import { StockAllStockTabComponent } from './stock-all-stock-tab/stock-all-stock-tab.component';
import { StockCoreModule } from '../stock-core/stock-core.module';
import { LayoutModule } from '../../../layout/layout.module';
import { CompanyCommonModule } from '../../company-common/company-common.module';
import { SharedModule } from '../../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [StockAllStockTabComponent],
    imports: [
        CommonModule,
        StockCoreModule,
        StockAllStockRoutingModule,
        LayoutModule,
        CompanyCommonModule,
        SharedModule,
        FontAwesomeModule,
        NgbDropdownModule,
        StockCoreModule,
        ReactiveFormsModule,
        NgbTooltipModule
    ]
})
export class StockAllStockModule { }
