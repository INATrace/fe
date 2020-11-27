import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalOrderEditComponent } from './global-order-edit/global-order-edit.component';
import { ProductLabelOrdersAllOrdersComponent } from './product-label-orders/orders-all-orders/orders-all-orders.component';
import { OrdersCustomerOrdersComponent } from './product-label-orders/orders-customer-orders/orders-customer-orders.component';
import { ProductLabelOrdersDashboardComponent } from './product-label-orders/orders-dashboard/orders-dashboard.component';


const routes: Routes = [
  {path: '', redirectTo: 'dashboard'},
  {
    path: 'dashboard',
    component: ProductLabelOrdersDashboardComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'all-orders',
    component: ProductLabelOrdersAllOrdersComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'customer-orders',
    component: OrdersCustomerOrdersComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'global-order/create',
    component: GlobalOrderEditComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      action: 'new',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.purchasesOrders.myStock:Orders` + " / " + $localize`:@@breadCrumb.orders.globalOrder:Order`,
        route: "product-labels/:id/orders/customer-orders"
      }
    }
  },
  {
    path: 'global-order/create',
    component: GlobalOrderEditComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      action: 'update',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.purchasesOrders.myStock:Orders` + " / " + $localize`:@@breadCrumb.orders.globalOrder:Order`,
        route: "product-labels/:id/orders/customer-orders"
      }
    }
  },
  { path: ':orderId/order-explore', loadChildren: () => import('./customer-order-explore/customer-order-explore.module').then(m => m.CustomerOrderExploreModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductOrdersRoutingModule { }
