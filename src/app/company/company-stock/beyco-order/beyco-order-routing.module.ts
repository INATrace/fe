import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BeycoOrderListComponent} from './beyco-order-list/beyco-order-list.component';

const routes: Routes = [
    {
        path: 'list',
        component: BeycoOrderListComponent,
    },
    {
        path: '',
        redirectTo: '/my-stock/orders/tab'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BeycoOrderRoutingModule { }
