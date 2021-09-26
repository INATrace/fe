import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockProcessingTabComponent } from './stock-processing-tab/stock-processing-tab.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tab'
  },
  {
    path: 'tab',
    component: StockProcessingTabComponent,
    data: {
      tab: 'processing',
      drobtinice: null
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockProcessingRoutingModule { }
