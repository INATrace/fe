import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorisedLayoutComponent } from 'src/app/layout/authorised/authorised-layout/authorised-layout.component';
import { ProductLabelStockBulkPaymentDetailComponent } from './product-label-stock-bulk-payment-detail/product-label-stock-bulk-payment-detail.component';
import { ProductLabelStockPaymentDetailComponent } from './product-label-stock-payment-detail/product-label-stock-payment-detail.component';
import { StockPaymentsTabComponent } from './stock-payments-tab/stock-payments-tab.component';


const routes: Routes = [
  {path: '', redirectTo: 'tab'},
  {
    path: 'tab',
    component: StockPaymentsTabComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      tab: 'payments',
      drobtinice: null
    }
  },
  {
    path: 'bulk-payment/update/:bulkPaymentId',
    component: ProductLabelStockBulkPaymentDetailComponent,
    pathMatch: 'full',
    data: {
      action: 'update',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.bulkPayment.myStock:My stock` + " / " + $localize`:@@breadCrumb.bulkPayment.bulkPayment:Bulk payment`,
        route: "product-labels/:id/stock/payments"
      }
    }
  },
  // {
  //   path: 'update/:paymentId',
  //   component: AuthorisedLayoutComponent,
  //   children: [
  //     {
  //       path: '', component: ProductLabelStockProcessingOrderDetailComponent, pathMatch: 'full',
  //       data: {
  //         action: 'update'
  //       }
  //     },
  //   ],
  //   data: {
  //     drobtinice: {
  //       title: " / " + $localize`:@@breadCrumb.payments.myStock:My stock` + " / " + $localize`:@@breadCrumb.payments.payment:Payment`,
  //       route: "product-labels/:id/stock/payments"
  //     }
  //   }
  // },
  {
    path: 'purchase-order/:purchaseOrderId/new',
    component: ProductLabelStockPaymentDetailComponent,
    pathMatch: 'full',
    data: {
      action: 'new',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.payments.myStock:My stock` + " / " + $localize`:@@breadCrumb.payments.payment:Balance payment`,
        route: "product-labels/:id/stock/payments",
        goBack: true
      }
    }
  },
  {
    path: 'update/:paymentId/:type',
    component: ProductLabelStockPaymentDetailComponent,
    pathMatch: 'full',
    data: {
      action: 'update',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.payments.myStock:My stock` + " / " + $localize`:@@breadCrumb.payments.payment:Balance payment`,
        route: "product-labels/:id/stock/payments",
        goBack: true
      }
    }
  },
  {
    path: 'purchases/bulk-payment/:purchaseOrderIds/new/:bulkType',
    component: ProductLabelStockBulkPaymentDetailComponent,
    pathMatch: 'full',
    data: {
      action: 'new',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.bulkPayment.myStock:My stock` + " / " + $localize`:@@breadCrumb.bulkPayment.bulkPayment:Bulk payment`,
        route: "product-labels/:id/stock/purchases"
      }
    }
  },

  {
    path: 'customer-order/:customerOrderId/new',
    component: ProductLabelStockPaymentDetailComponent,
    pathMatch: 'full',
    data: {
      action: 'new',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.payments.myStock:My stock` + " / " + $localize`:@@breadCrumb.payments.payment:Balance payment`,
        route: "product-labels/:id/stock/payments",
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
