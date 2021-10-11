import { RouterModule, Routes } from '@angular/router';
import { CompanyCustomersListComponent } from './company-customers-list/company-customers-list.component';
import { CompanyCustomersDetailsComponent } from './company-customers-details/company-customers-details.component';
import { NgModule } from '@angular/core';


const routes: Routes = [
    {
        path: '',
        component: CompanyCustomersListComponent,
        pathMatch: 'full'
    },
    {
        path: 'add',
        component: CompanyCustomersDetailsComponent,
        pathMatch: 'full',
        data: {
            action: 'new',
            drobtinice: {
                title: 'Add customer',
                route: 'my-customers'
            }
        }
    },
    {
        path: 'edit/:id',
        component: CompanyCustomersDetailsComponent,
        pathMatch: 'full',
        data: {
            action: 'update',
            drobtinice: {
                title: 'Edit customer',
                route: 'my-customers'
            }
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyCustomersRoutingModule {}
