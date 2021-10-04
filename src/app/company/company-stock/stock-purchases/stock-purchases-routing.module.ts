import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockPurchasesTabComponent } from './stock-purchases-tab/stock-purchases-tab.component';
import { StockPurchaseOrderDetailsComponent } from '../stock-core/stock-purchase-order-details/stock-purchase-order-details.component';

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
  },
  {
    path: 'facility/:facilityId/:fromTabType/new',
    component: StockPurchaseOrderDetailsComponent,
    pathMatch: 'full',
    data: {
      action: 'new',
      mode: 'PURCHASE_ORDER',
      drobtinice: {
        title: ' / ' + $localize`:@@breadCrumb.purchasesOrders.myStock:My stock` + ' / ' + $localize`:@@breadCrumb.purchaseOrders.purchase:Purchase`,
        route: 'my-stock/:fromTabType'
      }
    }
  },
  {
    path: 'update/:purchaseOrderId',
    component: StockPurchaseOrderDetailsComponent,
    pathMatch: 'full',
    data: {
      action: 'update',
      mode: 'PURCHASE_ORDER',
      drobtinice: {
        title: ' / ' + $localize`:@@breadCrumb.purchasesOrders.myStock:My stock` + ' / ' + $localize`:@@breadCrumb.purchaseOrders.purchase:Purchase`,
        route: 'my-stock/purchases'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockPurchasesRoutingModule { }
