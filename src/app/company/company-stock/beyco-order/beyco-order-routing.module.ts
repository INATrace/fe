import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BeycoOrderListComponent} from './beyco-order-list/beyco-order-list.component';

const routes: Routes = [
    {
        path: 'list',
        component: BeycoOrderListComponent,
        data: {
            drobtinice: {
                title: ' / ' + $localize`:@@breadCrumb.purchasesOrders.myStock:My stock` + ' / ' + $localize`:@@breadCrumb.stockOrders.stockOrderView:Stock order details` + ' / ' +
                $localize`:@@breadCrumb.stockOrders.beycoOrder: Export to Beyco`,
                route: 'my-stock/orders/tab'
            }
        }
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
