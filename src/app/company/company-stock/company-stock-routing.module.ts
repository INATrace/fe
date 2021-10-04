import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'purchases'
  },
  {
    path: 'purchases',
    loadChildren: () => import('./stock-purchases/stock-purchases.module').then(m => m.StockPurchasesModule)
  },
  {
    path: 'processing',
    loadChildren: () => import('./stock-processing/stock-processing.module').then(m => m.StockProcessingModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyStockRoutingModule { }
