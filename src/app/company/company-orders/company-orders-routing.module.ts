import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersDashboardComponent } from './orders-dashboard/orders-dashboard.component';
import { OrdersAllOrdersComponent } from './orders-all-orders/orders-all-orders.component';
import { OrdersCustomerOrdersComponent } from './orders-customer-orders/orders-customer-orders.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: OrdersDashboardComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  },
  {
    path: 'all-orders',
    component: OrdersAllOrdersComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  },
  {
    path: 'customer-orders',
    component: OrdersCustomerOrdersComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyOrdersRoutingModule { }
