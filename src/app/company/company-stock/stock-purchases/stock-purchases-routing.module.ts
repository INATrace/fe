import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockPurchasesTabComponent } from './stock-purchases-tab/stock-purchases-tab.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tab'
  },
  {
    path: 'tab',
    component: StockPurchasesTabComponent,
    pathMatch: 'full',
    data: {
      tab: 'purchases',
      drobtinice: null
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockPurchasesRoutingModule { }
