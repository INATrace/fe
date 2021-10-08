import { RouterModule, Routes } from '@angular/router';
import { CompanyCustomersListComponent } from './company-customers-list/company-customers-list.component';
import { NgModule } from '@angular/core';


const routes: Routes = [
    {
        path: '',
        component: CompanyCustomersListComponent,
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyCustomersRoutingModule {}
