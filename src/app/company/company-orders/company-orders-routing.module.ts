import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersDashboardComponent } from './orders-dashboard/orders-dashboard.component';
import { OrdersOrdersForMeComponent } from './orders-orders-for-me/orders-orders-for-me.component';
import { OrdersMyOrdersComponent } from './orders-my-orders/orders-my-orders.component';
import { GlobalOrderDetailsComponent } from './orders-my-orders/global-order-details/global-order-details.component';

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
    component: OrdersOrdersForMeComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  },
  {
    path: 'customer-orders',
    component: OrdersMyOrdersComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  },
  {
    path: 'global-order/create',
    component: GlobalOrderDetailsComponent,
    pathMatch: 'full',
    data: {
      drobtinice: {
        title: ' / ' + $localize`:@@breadCrumb.purchasesOrders.myStock:Orders` + ' / ' + $localize`:@@breadCrumb.orders.globalOrder:Order`,
        route: 'my-orders/customer-orders'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyOrdersRoutingModule { }
