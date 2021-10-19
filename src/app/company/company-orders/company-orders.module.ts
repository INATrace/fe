import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyOrdersRoutingModule } from './company-orders-routing.module';
import { OrdersTabComponent } from './orders-tab/orders-tab.component';
import { OrdersDashboardComponent } from './orders-dashboard/orders-dashboard.component';
import { OrdersAllOrdersComponent } from './orders-all-orders/orders-all-orders.component';
import { OrdersCustomerOrdersComponent } from './orders-customer-orders/orders-customer-orders.component';
import { LayoutModule } from '../../layout/layout.module';
import { CompanyCommonModule } from '../company-common/company-common.module';


@NgModule({
  declarations: [OrdersTabComponent, OrdersDashboardComponent, OrdersAllOrdersComponent, OrdersCustomerOrdersComponent],
  imports: [
    CommonModule,
    CompanyOrdersRoutingModule,
    LayoutModule,
    CompanyCommonModule
  ]
})
export class CompanyOrdersModule { }
