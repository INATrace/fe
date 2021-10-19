import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyOrdersRoutingModule } from './company-orders-routing.module';
import { OrdersTabComponent } from './orders-tab/orders-tab.component';
import { OrdersDashboardComponent } from './orders-dashboard/orders-dashboard.component';
import { OrdersAllOrdersComponent } from './orders-all-orders/orders-all-orders.component';
import { OrdersCustomerOrdersComponent } from './orders-customer-orders/orders-customer-orders.component';
import { LayoutModule } from '../../layout/layout.module';
import { CompanyCommonModule } from '../company-common/company-common.module';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { QuoteOrderListComponent } from './quote-order-list/quote-order-list.component';


@NgModule({
  declarations: [OrdersTabComponent, OrdersDashboardComponent, OrdersAllOrdersComponent, OrdersCustomerOrdersComponent, QuoteOrderListComponent],
  imports: [
    CommonModule,
    CompanyOrdersRoutingModule,
    LayoutModule,
    CompanyCommonModule,
    SharedModule,
    FontAwesomeModule,
    NgbDropdownModule
  ]
})
export class CompanyOrdersModule { }
