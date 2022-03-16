import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockProcessingTabComponent } from './stock-processing-tab/stock-processing-tab.component';
import { StockProcessingOrderDetailsComponent } from './stock-processing-order-details/stock-processing-order-details.component';

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
  },
  {
    path: ':actionId/facility/:inputFacilityId/new',
    component: StockProcessingOrderDetailsComponent, pathMatch: 'full',
    data: {
      action: 'new',
      drobtinice: {
        title: ' / ' + $localize`:@@breadCrumb.processing.myStock:My stock` + ' / ' + $localize`:@@breadCrumb.processing.order:Processing order`,
        route: 'my-stock/processing',
        goBack: true
      }
    }
  },
  {
    path: 'update/shipment-order/:orderId',
    component: StockProcessingOrderDetailsComponent, pathMatch: 'full',
    data: {
      action: 'update',
      type: 'SHIPMENT',
      drobtinice: {
        title: ' / ' + $localize`:@@breadCrumb.processing.myStock:My stock` + ' / ' + $localize`:@@breadCrumb.processing.order:Processing order`,
        route: 'my-stock/processing',
        goBack: true
      }
    }
  },
  {
    path: 'update/processing-order/:orderId',
    component: StockProcessingOrderDetailsComponent, pathMatch: 'full',
    data: {
      action: 'update',
      type: 'PROCESSING',
      drobtinice: {
        title: ' / ' + $localize`:@@breadCrumb.processing.myStock:My stock` + ' / ' + $localize`:@@breadCrumb.processing.order:Processing order`,
        route: 'my-stock/processing',
        goBack: true
      }
    }
  },
  {
    path: 'update/transfer-order/:orderId',
    component: StockProcessingOrderDetailsComponent, pathMatch: 'full',
    data: {
      action: 'update',
      type: 'TRANSFER',
      drobtinice: {
        title: ' / ' + $localize`:@@breadCrumb.processing.myStock:My stock` + ' / ' + $localize`:@@breadCrumb.processing.order:Processing order`,
        route: 'my-stock/processing',
        goBack: true
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockProcessingRoutingModule { }