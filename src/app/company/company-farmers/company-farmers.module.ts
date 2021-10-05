import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyFarmersListComponent } from './company-farmers-list/company-farmers-list.component';
import { LayoutModule } from '../../layout/layout.module';
import { CompanyCommonModule } from '../company-common/company-common.module';
import { CompanyFarmersRoutingModule } from './company-farmers-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [CompanyFarmersListComponent],
    imports: [
        CommonModule,
        LayoutModule,
        CompanyCommonModule,
        CompanyFarmersRoutingModule,
        SharedModule,
        NgbPaginationModule
    ]
})
export class CompanyFarmersModule { }
