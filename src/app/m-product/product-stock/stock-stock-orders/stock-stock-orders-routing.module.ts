import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderHistoryViewComponent } from '../stock-core/order-history-view/order-history-view.component';
import { StockPurchaseOrderEditComponent } from '../stock-core/stock-purchase-order-edit/stock-purchase-order-edit.component';
import { StockStockOrdersTabComponent } from './stock-orders-tab/stock-orders-tab.component';


const routes: Routes = [
  {path: '', redirectTo: 'tab'},
  {
    path: 'tab',
    component: StockStockOrdersTabComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      tab: 'stock-orders',
      mode: "COMPANY_ADMIN",
      drobtinice: null
    }
  },
  // PURCHASE
  {
    path: 'purchase-order/update/:purchaseOrderId',
    component: StockPurchaseOrderEditComponent,
    pathMatch: 'full',
    data: {
      action: 'update',
      mode: 'PURCHASE_ORDER',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.purchasesOrders.myStock:My stock` + " / " + $localize`:@@breadCrumb.stockOrders.stockOrders:Stock Orders`,
        route: "product-labels/:id/stock/stock-orders"
      }
    }
  },

  {
    path: 'purchase-order/facility/:facilityId/new',
    component: StockPurchaseOrderEditComponent,
    pathMatch: 'full',
    data: {
      action: 'new',
      mode: 'PURCHASE_ORDER',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.purchasesOrders.myStock:My stock` + " / " + $localize`:@@breadCrumb.stockOrders.stockOrders:Stock orders`,
        route: "product-labels/:id/stock/stock-orders"
      }
    }
  },
  {
    path: 'stock-order/:stockOrderId/view',
    component: OrderHistoryViewComponent,
    pathMatch: 'full',
    data: {
      action: 'new',
      mode: 'PURCHASE_ORDER',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.purchasesOrders.myStock:My stock` + " / " + $localize`:@@breadCrumb.stockOrders.stockOrderView:Stock order details`,
        route: "product-labels/:id/stock/stock-orders"
      }
    }
  },

  // {
  //   path: 'sales/facility/:facilityId/:fromTabType/new',
  //   component: AuthorisedLayoutComponent,
  //   children: [
  //     {
  //       path: '', component: ProductLabelStockPurchaseOrderModalComponent, pathMatch: 'full',
  //       data: {
  //         action: 'new',
  //         mode: 'SALES_ORDER'
  //       }
  //     },
  //   ],
  //   data: {
  //     drobtinice: {
  //       title: " / " + $localize`:@@breadCrumb.purchasesOrders.myStock:My stock` + " / " + $localize`:@@breadCrumb.stockOrders.stockOrders:Stock orders`,
  //       route: "product-labels/:id/stock/:fromTabType"
  //     }
  //   }
  // },
  // {
  //   path: 'general/facility/:facilityId/:fromTabType/new',
  //   component: AuthorisedLayoutComponent,
  //   children: [
  //     {
  //       path: '', component: ProductLabelStockPurchaseOrderModalComponent, pathMatch: 'full',
  //       data: {
  //         action: 'new',
  //         mode: 'GENERAL_ORDER'
  //       }
  //     },
  //   ],
  //   data: {
  //     drobtinice: {
  //       title: " / " + $localize`:@@breadCrumb.purchasesOrders.myStock:My stock` + " / " + $localize`:@@breadCrumb.stockOrders.stockOrders:Stock orders`,
  //       route: "product-labels/:id/stock/:fromTabType"
  //     }
  //   }
  // },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockStockOrdersRoutingModule { }
