import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorisedLayoutComponent } from 'src/app/layout/authorised/authorised-layout/authorised-layout.component';
import { StockTransactionTabComponent } from './stock-transaction-tab/stock-transaction-tab.component';


const routes: Routes = [
  {path: '', redirectTo: 'tab'},
  {
    path: 'tab',
    component: StockTransactionTabComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      tab: 'transactions',
      mode: "COMPANY_ADMIN",
      drobtinice: null
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockTransactionsRoutingModule { }
