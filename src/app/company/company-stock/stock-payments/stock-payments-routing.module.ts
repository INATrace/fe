import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockPaymentsTabComponent } from './stock-payments-tab/stock-payments-tab.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'tab'
  },
  {
    path: 'tab',
    component: StockPaymentsTabComponent,
    data: {
      tab: 'payments',
      drobtinice: null
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockPaymentsRoutingModule { }
