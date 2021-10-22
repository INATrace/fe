import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinalProductComponent } from './final-product/final-product.component';

const routes: Routes = [
  {
    path: '',
    component: FinalProductComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductFinalProductRoutingModule { }
