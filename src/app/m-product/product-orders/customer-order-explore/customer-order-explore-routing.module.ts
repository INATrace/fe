import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerOrderDetailsComponent } from './customer-order-view/customer-order-details/customer-order-details.component';
import { CustomerOrderHistoryComponent } from './customer-order-view/customer-order-history/customer-order-history.component';


const routes: Routes = [
  {
    path: 'details',
    component: CustomerOrderDetailsComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'history',
    component: CustomerOrderHistoryComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerOrderExploreRoutingModule { }
