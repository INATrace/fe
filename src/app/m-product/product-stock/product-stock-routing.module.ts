import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectClearCacheComponent } from 'src/app/components/redirect-clear-cache/redirect-clear-cache.component';

const routes: Routes = [
  {
    path: '',
    component: RedirectClearCacheComponent
  },
  { path: 'purchases', loadChildren: () => import('./stock-purchase-orders/stock-purchase-orders.module').then(m => m.StockPurchaseOrdersModule)},
  { path: 'processing', loadChildren: () => import('./stock-processing/stock-processing.module').then(m => m.StockProcessingModule)},
  { path: 'payments', loadChildren: () => import('./stock-payments/stock-payments.module').then(m => m.StockPaymentsModule)},
  { path: 'stock-orders', loadChildren: () => import('./stock-stock-orders/stock-stock-orders.module').then(m => m.StockStockOrdersModule)},
  { path: 'transactions', loadChildren: () => import('./stock-transactions/stock-transactions.module').then(m => m.StockTransactionsModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductStockRoutingModule { }
