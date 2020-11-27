import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductLabelFPQExplorerComponent } from './product-label-f-p-q-explorer/product-label-f-p-q-explorer.component';


const routes: Routes = [
  {
    path: '',
    component: ProductLabelFPQExplorerComponent,
    pathMatch: 'full',
    //canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FPQExplorerRoutingModule { }
