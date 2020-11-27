import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorisedLayoutComponent } from 'src/app/layout/authorised/authorised-layout/authorised-layout.component';
import { ProductLabelStockProcessingOrderDetailComponent } from './product-label-stock-processing-order-detail/product-label-stock-processing-order-detail.component';
import { StockProcessingTabComponent } from './stock-processing-tab/stock-processing-tab.component';


const routes: Routes = [
  {path: '', redirectTo: 'tab'},
  {
    path: 'tab',
    component: StockProcessingTabComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      tab: 'processing',
      drobtinice: null
    }
  },
  {
    path: ':actionId/facility/:inputFacilityId/new',
    component: ProductLabelStockProcessingOrderDetailComponent, pathMatch: 'full',
    data: {
      action: 'new',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.processing.myStock:My stock` + " / " + $localize`:@@breadCrumb.processing.order:Processing order`,
        route: "product-labels/:id/stock/processing",
        goBack: true
      }
    }
  },
  {
    path: 'update/shipment-order/:orderId',
    component: ProductLabelStockProcessingOrderDetailComponent, pathMatch: 'full',
    data: {
      action: 'update',
      type: 'SHIPMENT',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.processing.myStock:My stock` + " / " + $localize`:@@breadCrumb.processing.order:Processing order`,
        route: "product-labels/:id/stock/processing",
        goBack: true
      }
    }
  },
  {
    path: 'update/processing-order/:orderId',
    component: ProductLabelStockProcessingOrderDetailComponent, pathMatch: 'full',
    data: {
      action: 'update',
      type: 'PROCESSING',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.processing.myStock:My stock` + " / " + $localize`:@@breadCrumb.processing.order:Processing order`,
        route: "product-labels/:id/stock/processing",
        goBack: true
      }
    }
  },
  {
    path: 'update/transfer-order/:orderId',
    component: ProductLabelStockProcessingOrderDetailComponent, pathMatch: 'full',
    data: {
      action: 'update',
      type: 'TRANSFER',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.processing.myStock:My stock` + " / " + $localize`:@@breadCrumb.processing.order:Processing order`,
        route: "product-labels/:id/stock/processing",
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
