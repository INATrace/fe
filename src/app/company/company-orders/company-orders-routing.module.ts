import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReceivedOrdersComponent } from './received-orders/received-orders.component';
import { PlacedOrdersComponent } from './placed-orders/placed-orders.component';
import { GlobalOrderDetailsComponent } from './placed-orders/global-order-details/global-order-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'received-orders'
  },
  {
    path: 'received-orders',
    component: ReceivedOrdersComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  },
  {
    path: 'placed-orders',
    component: PlacedOrdersComponent,
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
