import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockPaymentsTabComponent } from './stock-payments-tab/stock-payments-tab.component';
import { StockPaymentsDetailComponent } from './stock-payments-detail/stock-payments-detail.component';
import { StockPaymentsBulkDetailComponent } from './stock-payments-bulk-detail/stock-payments-bulk-detail.component';


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
  {
    path: 'bulk-payment/update/:bulkPaymentId',
    component: StockPaymentsBulkDetailComponent,
    pathMatch: 'full',
    data: {
      action: 'update',
      drobtinice: {
        title: ' / ' + $localize`:@@breadCrumb.bulkPayment.myStock:My stock` + ' / ' + $localize`:@@breadCrumb.bulkPayment.bulkPayment:Bulk payment`,
        route: 'product-labels/:id/stock/payments'
      }
    }
  },
  {
    path: 'purchases/bulk-payment/:purchaseOrderIds/new/:bulkType',
    component: StockPaymentsBulkDetailComponent,
    pathMatch: 'full',
    data: {
      action: 'new',
      drobtinice: {
        title: ' / ' + $localize`:@@breadCrumb.bulkPayment.myStock:My stock` + ' / ' + $localize`:@@breadCrumb.bulkPayment.bulkPayment:Bulk payment`,
        route: 'product-labels/:id/stock/purchases'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockPaymentsRoutingModule { }
