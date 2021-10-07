import { RouterModule, Routes } from '@angular/router';
import { CompanyCollectorsListComponent } from './company-collectors-list/company-collectors-list.component';
import { CompanyCollectorsDetailsComponent } from './company-collectors-details/company-collectors-details.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: CompanyCollectorsListComponent,
        pathMatch: 'full'
    },
    {
        path: 'add',
        component: CompanyCollectorsDetailsComponent,
        pathMatch: 'full',
        data: {
            action: 'new',
            drobtinice: {
                title: 'Add collector',
                route: 'my-collectors'
            }
        }
    },
    {
        path: 'edit/:id',
        component: CompanyCollectorsDetailsComponent,
        pathMatch: 'full',
        data: {
            action: 'update',
            drobtinice: {
                title: 'Edit collector',
                route: 'my-collectors'
            }
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyCollectorsRoutingModule {}
