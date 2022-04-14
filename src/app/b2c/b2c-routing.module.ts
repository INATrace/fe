import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { B2cPageComponent } from './b2c-page/b2c-page.component';
import { B2cIntroComponent } from './b2c-page/b2c-intro/b2c-intro.component';


const routes: Routes = [
  {
    path: ':uuid',
    component: B2cPageComponent,
    children: [
      {
        path: '',
        component: B2cIntroComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class B2cRoutingModule { }
