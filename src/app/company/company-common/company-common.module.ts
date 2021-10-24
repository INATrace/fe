import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyLeftPanelComponent } from './company-left-panel/company-left-panel.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {StockOrderListComponent} from '../company-stock/stock-core/stock-order-list/stock-order-list.component';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    CompanyLeftPanelComponent,
    StockOrderListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FontAwesomeModule,
    NgbPaginationModule
  ],
  exports: [
    CompanyLeftPanelComponent,
    StockOrderListComponent
  ]
})
export class CompanyCommonModule { }
