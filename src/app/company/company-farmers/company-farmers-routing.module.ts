import { RouterModule, Routes } from '@angular/router';
import { CompanyFarmersListComponent } from './company-farmers-list/company-farmers-list.component';
import { NgModule } from '@angular/core';
import { CompanyFarmersDetailsComponent } from './company-farmers-details/company-farmers-details.component';
import { CompanyFarmersImportComponent } from './company-farmers-import/company-farmers-import.component';

const routes: Routes = [
    {
        path: '',
        component: CompanyFarmersListComponent,
        pathMatch: 'full'
    },
    {
        path: 'add',
        component: CompanyFarmersDetailsComponent,
        pathMatch: 'full',
        data: {
            action: 'new',
            drobtinice: {
                title: 'Add farmer',
                route: 'my-farmers',
            }
        }
    },
    {
        path: 'edit/:id',
        component: CompanyFarmersDetailsComponent,
        pathMatch: 'full',
        data: {
            action: 'update',
            drobtinice: {
                title: 'Edit farmer',
                route: 'my-farmers'
            }
        }
    },
    {
        path: 'import',
        component: CompanyFarmersImportComponent,
        pathMatch: 'full',
        data: {
            drobtinice: {
                title: 'Import farmers',
                route: 'my-farmers'
            }
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyFarmersRoutingModule {}
