import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyFarmersListComponent } from './company-farmers-list/company-farmers-list.component';
import { LayoutModule } from '../../layout/layout.module';
import { CompanyCommonModule } from '../company-common/company-common.module';
import { CompanyFarmersRoutingModule } from './company-farmers-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyFarmersDetailsComponent } from './company-farmers-details/company-farmers-details.component';
import { QRCodeModule } from 'angular2-qrcode';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProductStakeholdersModule } from '../../m-product/product-stakeholders/product-stakeholders.module';



@NgModule({
  declarations: [CompanyFarmersListComponent, CompanyFarmersDetailsComponent],
    imports: [
        CommonModule,
        LayoutModule,
        CompanyCommonModule,
        CompanyFarmersRoutingModule,
        SharedModule,
        NgbPaginationModule,
        QRCodeModule,
        DragDropModule,
        ProductStakeholdersModule
    ]
})
export class CompanyFarmersModule { }
