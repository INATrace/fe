import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockOrdersRoutingModule } from './stock-orders-routing.module';
import { StockOrdersTabComponent } from './stock-orders-tab/stock-orders-tab.component';
import { StockCoreModule } from '../stock-core/stock-core.module';
import { LayoutModule } from '../../../layout/layout.module';
import { CompanyCommonModule } from '../../company-common/company-common.module';
import { SharedModule } from '../../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [StockOrdersTabComponent],
    imports: [
        CommonModule,
        StockCoreModule,
        StockOrdersRoutingModule,
        LayoutModule,
        CompanyCommonModule,
        SharedModule,
        FontAwesomeModule,
        NgbDropdownModule,
        StockCoreModule,
        ReactiveFormsModule
    ]
})
export class StockOrdersModule { }
