import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockProcessingRoutingModule } from './stock-processing-routing.module';
import { StockProcessingTabComponent } from './stock-processing-tab/stock-processing-tab.component';
import { CoreModule } from '../../../core/core.module';
import { ComponentsModule } from '../../../components/components.module';
import { LayoutModule } from '../../../layout/layout.module';
import { SharedModule } from '../../../shared/shared.module';
import { CompanyCommonModule } from '../../company-common/company-common.module';
import { StockCoreModule } from '../stock-core/stock-core.module';
import { StockProcessingOrderDetailsComponent } from './stock-processing-order-details/stock-processing-order-details.component';
import { StockProcessingFacilityListComponent } from './stock-processing-facility-list/stock-processing-facility-list.component';
import { FacilityCardComponent } from './stock-processing-facility-list/facility-card/facility-card.component';

@NgModule({
  declarations: [
    StockProcessingTabComponent,
    StockProcessingOrderDetailsComponent,
    StockProcessingFacilityListComponent,
    FacilityCardComponent
  ],
  imports: [
    CommonModule,
    StockProcessingRoutingModule,
    CoreModule,
    ComponentsModule,
    LayoutModule,
    SharedModule,
    CompanyCommonModule,
    StockCoreModule
  ]
})
export class StockProcessingModule { }
