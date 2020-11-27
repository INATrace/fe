import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductLabelSuppliersComponent } from './product-label-suppliers/product-label-suppliers.component';


const routes: Routes = [
  {
    path: '',
    component: ProductLabelSuppliersComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductSupplyRoutingModule { }
