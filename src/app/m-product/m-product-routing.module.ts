import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeactivateGuardService } from '../shared-services/deactivate-guard.service';
import { BatchDetailPageComponent } from './batch-detail-page/batch-detail-page.component';
import { BatchesListComponent } from './batches-list/batches-list.component';
import { ProductLabelFeedbackPageComponent } from './product-label-feedback-page/product-label-feedback-page.component';
import { ProductLabelStatisticsPageComponent } from './product-label-statistics-page/product-label-statistics-page.component';
import { LabelRedirectToProductPageComponent } from './product-label/label-redirect-to-product-page/label-redirect-to-product-page.component';
import { ProductLabelComponent } from './product-label/product-label.component';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  },
  {
    path: 'new/:companyId/:valueChainId',
    component: ProductLabelComponent,
    pathMatch: 'full',
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: ':id',
    component: ProductLabelComponent,
    pathMatch: 'full',
    canDeactivate: [DeactivateGuardService],
    data: {
      action: 'labels',
      drobtinice: null
    }
  },
  {
    path: ':id/product',
    component: ProductLabelComponent,
    pathMatch: 'full',
    canDeactivate: [DeactivateGuardService],
    data: {
      action: 'product',
      drobtinice: null
    }
  },
  { path: ':id/knowledge-blog', loadChildren: () => import('./knowledge-blog/knowledge-block.module').then(m => m.KnowledgeBlockModule) },
  { path: ':id/stakeholders', loadChildren: () => import('./product-stakeholders/product-stakeholders.module').then(m => m.ProductStakeholdersModule)},
  { path: ':id/final-products', loadChildren: () => import('./product-final-product/product-final-product.module').then(m => m.ProductFinalProductModule)},
  {
    path: ':id/labels/:labelId',
    component: LabelRedirectToProductPageComponent   // NO
  },
  {
    path: ':id/labels/:labelId/batches',
    component: BatchesListComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  },
  {
    path: ':id/labels/:labelId/batches/new',
    component: BatchDetailPageComponent,
    pathMatch: 'full',
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: ':id/labels/:labelId/batches/:batchId',
    component: BatchDetailPageComponent,
    pathMatch: 'full',
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: ':id/labels/:labelId/feedback',
    component: ProductLabelFeedbackPageComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  },
  {
    path: ':id/labels/:labelId/statistics',
    component: ProductLabelStatisticsPageComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MProductRoutingModule { }
