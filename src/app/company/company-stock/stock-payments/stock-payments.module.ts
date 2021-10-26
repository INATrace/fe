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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { StockPaymentsSelectorForNewPaymentModalComponent } from './stock-payments-selector-for-new-payment-modal/stock-payments-selector-for-new-payment-modal.component';
import { StockPaymentsDetailComponent } from './stock-payments-detail/stock-payments-detail.component';
import { StockPaymentsFormComponent } from './stock-payments-form/stock-payments-form.component';
import { StockPaymentsBulkDetailComponent } from './stock-payments-bulk-detail/stock-payments-bulk-detail.component';


@NgModule({
  declarations: [
      StockPaymentsTabComponent,
      StockPaymentsSelectorForNewPaymentModalComponent,
      StockPaymentsDetailComponent,
      StockPaymentsFormComponent,
      StockPaymentsBulkDetailComponent
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
