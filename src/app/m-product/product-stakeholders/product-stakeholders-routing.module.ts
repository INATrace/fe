import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectorDetailModalComponent } from './collector-detail-modal/collector-detail-modal.component';
import { CustomerDetailModalComponent } from './customer-detail-modal/customer-detail-modal.component';
import { StakeholdersCollectorsComponent } from './product-label-stakeholders/stakeholders-collectors/stakeholders-collectors.component';
import { StakeholdersCustomersComponent } from './product-label-stakeholders/stakeholders-customers/stakeholders-customers.component';
import { StakeholdersFarmersComponent } from './product-label-stakeholders/stakeholders-farmers/stakeholders-farmers.component';
import { StakeholdersValueChainComponent } from './product-label-stakeholders/stakeholders-value-chain/stakeholders-value-chain.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'value-chain'
  },
  {
    path: 'value-chain',
    component: StakeholdersValueChainComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null,
      tab: 'value-chain'
    }
  },
  {
    path: 'collectors',
    pathMatch: 'full',
    redirectTo: '/my-collectors'
  },
  {
    path: 'farmers',
    pathMatch: 'full',
    redirectTo: '/my-farmers'
  },
  {
    path: 'customers',
    pathMatch: 'full',
    redirectTo: '/my-collectors'
  },
  {
    path: 'customers/organization/:organizationId/new/:customerId',
    component: CustomerDetailModalComponent,
    pathMatch: 'full',
    data: {
      action: 'new',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.customers.stakeholders:Stakeholders` + " / " + $localize`:@@breadCrumb.customers.customer:Customer`,
        route: "product-labels/:id/stakeholders/customers"
      }
    }
  },
  {
    path: 'customers/update/:companyCustomerId',
    component: CustomerDetailModalComponent,
    pathMatch: 'full',
    data: {
      action: 'update',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.customers.stakeholders:Stakeholders` + " / " + $localize`:@@breadCrumb.customers.customer:Customer`,
        route: "product-labels/:id/stakeholders/customers"
      }
    }
  },
  {
    path: ':type/organization/:organizationId/new',
    component: CollectorDetailModalComponent,
    pathMatch: 'full',
    data: {
      action: 'new',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.collectors.stakeholders:Stakeholders` + " / ",
        route: "product-labels/:id/stakeholders/:type",
        collectorFarmerType: true
      }
    }
  },
  {
    path: ':type/update/:userCustomerId',
    component: CollectorDetailModalComponent,
    pathMatch: 'full',
    data: {
      action: 'update',
      drobtinice: {
        title: " / " + $localize`:@@breadCrumb.collectors.stakeholders:Stakeholders` + " / ",
        route: "product-labels/:id/stakeholders/:type",
        collectorFarmerType: true
      }
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductStakeholdersRoutingModule { }
