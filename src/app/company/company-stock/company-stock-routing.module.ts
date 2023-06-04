import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'deliveries'
  },
  {
    path: 'deliveries',
    loadChildren: () => import('./stock-deliveries/stock-deliveries.module').then(m => m.StockDeliveriesModule)
  },
  {
    path: 'processing',
    loadChildren: () => import('./stock-processing/stock-processing.module').then(m => m.StockProcessingModule)
  },
  {
    path: 'payments',
    loadChildren: () => import('./stock-payments/stock-payments.module').then(m => m.StockPaymentsModule)
  },
  {
    path: 'orders', loadChildren: () => import('./stock-orders/stock-orders.module').then(m => m.StockOrdersModule)
  },
  {
    path: 'beyco',
    loadChildren: () => import('./beyco-order/beyco-order.module').then(m => m.BeycoOrderModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyStockRoutingModule { }
