import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockDeliveriesRoutingModule } from './stock-deliveries-routing.module';
import { StockDeliveriesTabComponent } from './stock-deliveries-tab/stock-deliveries-tab.component';
import { CoreModule } from '../../../core/core.module';
import { ComponentsModule } from '../../../components/components.module';
import { LayoutModule } from '../../../layout/layout.module';
import { SharedModule } from '../../../shared/shared.module';
import { CompanyCommonModule } from '../../company-common/company-common.module';
import { StockCoreModule } from '../stock-core/stock-core.module';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [StockDeliveriesTabComponent],
    imports: [
        CommonModule,
        StockDeliveriesRoutingModule,
        CoreModule,
        ComponentsModule,
        LayoutModule,
        SharedModule,
        CompanyCommonModule,
        StockCoreModule,
        NgbDropdownModule,
        FontAwesomeModule,
        NgbTooltipModule
    ]
})
export class StockDeliveriesModule { }
