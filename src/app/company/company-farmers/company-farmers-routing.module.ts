import { RouterModule, Routes } from '@angular/router';
import { CompanyFarmersListComponent } from './company-farmers-list/company-farmers-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: CompanyFarmersListComponent,
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyFarmersRoutingModule {}
