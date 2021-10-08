import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyCustomersListComponent } from './company-customers-list/company-customers-list.component';
import { CompanyCustomersDetailsComponent } from './company-customers-details/company-customers-details.component';
import { CompanyCustomersRoutingModule } from './company-customers-routing.module';
import { LayoutModule } from '../../layout/layout.module';
import { CompanyCommonModule } from '../company-common/company-common.module';
import { SharedModule } from '../../shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [CompanyCustomersListComponent, CompanyCustomersDetailsComponent],
  imports: [
    CommonModule,
    CompanyCustomersRoutingModule,
    LayoutModule,
    CompanyCommonModule,
    SharedModule,
    NgbPaginationModule
  ]
})
export class CompanyCustomersModule { }
