import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorisedLayoutComponent } from 'src/app/layout/authorised/authorised-layout/authorised-layout.component';
import { ProductLabelStockFacilityModalComponent } from './product-label-stock-facility-modal/product-label-stock-facility-modal.component';
import { ProductLabelStockProcessingActionDetailComponent } from './product-label-stock-processing-action-detail/product-label-stock-processing-action-detail.component';
import { SemiProductDetailModalComponent } from './semi-product-detail-modal/semi-product-detail-modal.component';
import { SemiProductListingComponent } from './semi-product-listing/semi-product-listing.component';
import { StockConfigurationTabComponent } from './stock-configuration-tab/stock-configuration-tab.component';


const routes: Routes = [
  {path: '', redirectTo: 'tab'},
  {
    path: 'tab',
    component: StockConfigurationTabComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      tab: 'configuration',
      drobtinice: null
    }
  },
  {
    path: 'facilities/organization/:organizationId/new',
    component: ProductLabelStockFacilityModalComponent,
    pathMatch: 'full',
    data: {
      action: 'new',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.facility.myStock:My stock` + " / " + $localize`:@@breadCrumb.facility.facility:Facility`,
        route: "product-labels/:id/stock/configuration"
      }
    }
  },
  {
    path: 'facilities/update/:facilityId',
    component: ProductLabelStockFacilityModalComponent,
    pathMatch: 'full',
    data: {
      action: 'update',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.facility.myStock:My stock` + " / " + $localize`:@@breadCrumb.facility.facility:Facility`,
        route: "product-labels/:id/stock/configuration"
      }
    }
  },
  // {
  //   path: 'semi-products',
  //   component: SemiProductListingComponent,
  //   pathMatch: 'full',
  //   data: {
  //     drobtinice: null
  //   }
  // },
  {
    path: 'semi-products/update/:semiProductId',
    component: SemiProductDetailModalComponent,
    pathMatch: 'full',
    data: {
      action: 'update',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.semiProduct.myStock:My stock` + " / " + $localize`:@@breadCrumb.semiProduct.semiProduct:Semi-product`,
        route: "product-labels/:id/stock/configuration"
      }
    }
  },
  {
    path: 'semi-products/new',
    component: SemiProductDetailModalComponent,
    pathMatch: 'full',
    data: {
      action: 'new',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.semiProduct.myStock:My stock` + " / " + $localize`:@@breadCrumb.semiProduct.semiProduct:Semi-product`,
        route: "product-labels/:id/stock/configuration"
      }
    }
  },
  {
    path: 'processing-transaction/update/:processingTransactionId',
    component: ProductLabelStockProcessingActionDetailComponent,
    pathMatch: 'full',
    data: {
      action: 'update',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.processingAction.myStock:My stock` + " / " + $localize`:@@breadCrumb.processingAction.processingAction:Processing action`,
        route: "product-labels/:id/stock/configuration"
      }
    }
  },
  {
    path: 'processing-transaction/new',
    component: ProductLabelStockProcessingActionDetailComponent,
    pathMatch: 'full',
    data: {
      action: 'new',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.processingAction.myStock:My stock` + " / " + $localize`:@@breadCrumb.processingAction.processingAction:Processing action`,
        route: "product-labels/:id/stock/configuration"
      }
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockConfigurationRoutingModule { }
