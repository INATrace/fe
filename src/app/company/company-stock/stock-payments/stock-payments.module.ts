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
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { StockPaymentsListComponent } from './stock-payments-list/stock-payments-list.component';
import {NgbDropdownModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
      StockPaymentsTabComponent,
      StockPaymentsListComponent
  ],
    imports: [
        CommonModule,
        StockPaymentsRoutingModule,
        CoreModule,
        ComponentsModule,
        LayoutModule,
        SharedModule,
        CompanyCommonModule,
        StockCoreModule,
        FontAwesomeModule,
        NgbPaginationModule,
        NgbDropdownModule
    ]
})
export class StockPaymentsModule { }
