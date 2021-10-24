import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockOrdersTabComponent } from './stock-orders-tab/stock-orders-tab.component';
import { OrderHistoryComponent } from '../stock-core/order-history/order-history.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tab'
  },
  {
    path: 'tab',
    component: StockOrdersTabComponent,
    data: {
      tab: 'orders',
      mode: 'COMPANY_ADMIN',
      drobtinice: null
    }
  },
  {
    path: 'stock-order/:stockOrderId/view',
    component: OrderHistoryComponent,
    pathMatch: 'full',
    data: {
      drobtinice: {
        title: ' / ' + $localize`:@@breadCrumb.purchasesOrders.myStock:My stock` + ' / ' + $localize`:@@breadCrumb.stockOrders.stockOrderView:Stock order details`,
        route: 'my-stock/orders'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockOrdersRoutingModule { }
