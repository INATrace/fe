import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFinalProductRoutingModule } from './product-final-product-routing.module';
import { FinalProductListComponent } from './final-product-list/final-product-list.component';
import { FinalProductComponent } from './final-product/final-product.component';
import { LayoutModule } from '../../layout/layout.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { FinalProductDetailModalComponent } from './final-product-detail-modal/final-product-detail-modal.component';
import { ProductCommonModule } from '../product-common/product-common.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [
      FinalProductListComponent,
      FinalProductComponent,
      FinalProductDetailModalComponent
    ],
  imports: [
    CommonModule,
    ProductCommonModule,
    ProductFinalProductRoutingModule,
    LayoutModule,
    NgbPaginationModule,
    SharedModule,
    FontAwesomeModule
  ]
})
export class ProductFinalProductModule { }
