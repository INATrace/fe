import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyLeftPanelComponent } from './company-left-panel/company-left-panel.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StockUnitListComponent } from '../company-stock/stock-core/stock-unit-list/stock-unit-list.component';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StockPaymentsListComponent } from '../company-stock/stock-payments/stock-payments-list/stock-payments-list.component';
import { ComponentsModule } from '../../components/components.module';
import { ProducersItemComponent } from './producers-item/producers-item.component';
import { CompanySelectModalComponent } from './company-select-modal/company-select-modal.component';
import { PlotsItemComponent } from './plots-item/plots-item.component';
import { PlotsFormComponent } from './plots-form/plots-form.component';
import { FormatFarmerImportValidationErrorPipe } from "./pipes/format-farmer-import-validation-error.pipe";

@NgModule({
  declarations: [
    CompanyLeftPanelComponent,
    CompanySelectModalComponent,
    StockUnitListComponent,
    StockPaymentsListComponent,
    ProducersItemComponent,
    PlotsItemComponent,
    PlotsFormComponent,
    FormatFarmerImportValidationErrorPipe
  ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        ComponentsModule,
        FontAwesomeModule,
        NgbPaginationModule,
        NgbTooltipModule
    ],
  exports: [
    CompanyLeftPanelComponent,
    CompanySelectModalComponent,
    StockUnitListComponent,
    StockPaymentsListComponent,
    ProducersItemComponent,
    PlotsItemComponent,
    PlotsFormComponent,
    FormatFarmerImportValidationErrorPipe
  ]
})
export class CompanyCommonModule { }
