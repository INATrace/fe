import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyCollectorsListComponent } from './company-collectors-list/company-collectors-list.component';
import { CompanyCollectorsDetailsComponent } from './company-collectors-details/company-collectors-details.component';
import { LayoutModule } from '../../layout/layout.module';
import { CompanyCommonModule } from '../company-common/company-common.module';
import { CompanyCollectorsRoutingModule } from './company-collectors-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { QRCodeModule } from 'angular2-qrcode';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProductStakeholdersModule } from '../../m-product/product-stakeholders/product-stakeholders.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [CompanyCollectorsListComponent, CompanyCollectorsDetailsComponent],
  imports: [
    CommonModule,
    LayoutModule,
    CompanyCommonModule,
    CompanyCollectorsRoutingModule,
    SharedModule,
    NgbPaginationModule,
    QRCodeModule,
    DragDropModule,
    ProductStakeholdersModule,
    FontAwesomeModule
  ]
})
export class CompanyCollectorsModule { }
