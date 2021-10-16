import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockOrdersTabComponent } from './stock-orders-tab/stock-orders-tab.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'tab'
  },
  {
    path: 'tab',
    component: StockOrdersTabComponent,
    data: {
      tab: 'stock-orders',
      mode: 'COMPANY_ADMIN',
      drobtinice: null
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockOrdersRoutingModule { }
