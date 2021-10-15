import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockPaymentsTabComponent } from './stock-payments-tab/stock-payments-tab.component';
import { StockPaymentsDetailComponent } from './stock-payments-detail/stock-payments-detail.component';
import {ProductLabelStockPaymentDetailComponent} from "../../../m-product/product-stock/stock-payments/product-label-stock-payment-detail/product-label-stock-payment-detail.component";


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
  },
  {
    path: 'purchase-order/:purchaseOrderId/new',
    component: StockPaymentsDetailComponent,
    pathMatch: 'full',
    data: {
      action: 'new',
      drobtinice: {
        title: ' / ' + $localize`:@@breadCrumb.payments.myStock:My stock`
            + ' / ' + $localize`:@@breadCrumb.payments.payment:Balance payment`,
        goBack: true
      }
    }
  },
  {
    path: ':paymentId/update/:type',
    component: StockPaymentsDetailComponent,
    pathMatch: 'full',
    data: {
      action: 'update',
      drobtinice: {
        title: ' / ' + $localize`:@@breadCrumb.payments.myStock:My stock`
            + ' / ' + $localize`:@@breadCrumb.payments.payment:Balance payment`,
        goBack: true
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockPaymentsRoutingModule { }
