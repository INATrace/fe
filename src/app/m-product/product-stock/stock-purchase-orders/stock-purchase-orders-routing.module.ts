import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockPurchaseOrderEditComponent } from '../stock-core/stock-purchase-order-edit/stock-purchase-order-edit.component';
import { StockPurchaseOrderTab } from './stock-purchase-orders-tab/stock-purchase-orders-tab.component';


const routes: Routes = [
  {path: '', redirectTo: 'tab'},
  {
    path: 'tab',
    component: StockPurchaseOrderTab,
    pathMatch: 'full',
     //canDeactivate: [DeactivateGuardService],
    data: {
      tab: 'purchases',
      drobtinice: null
    }
  },
  {
    path: 'facility/:facilityId/:fromTabType/new',
    component: StockPurchaseOrderEditComponent, pathMatch: 'full',
    data: {
      action: 'new',
      mode: 'PURCHASE_ORDER',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.purchasesOrders.myStock:My stock` + " / " + $localize`:@@breadCrumb.purchaseOrders.purchase:Purchase`,
        route: "product-labels/:id/stock/:fromTabType"
      }
    }
  },
  {
    path: 'update/:purchaseOrderId',
    component: StockPurchaseOrderEditComponent, pathMatch: 'full',
    data: {
      action: 'update',
      mode: 'PURCHASE_ORDER',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.purchasesOrders.myStock:My stock` + " / " + $localize`:@@breadCrumb.purchaseOrders.purchase:Purchase`,
        route: "product-labels/:id/stock/purchases"
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockPurchaseOrdersRoutingModule { }
