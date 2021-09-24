import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule, NgbPaginationModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { QRCodeModule } from 'angular2-qrcode';
import { EllipsisModule } from 'ngx-ellipsis';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ComponentsModule } from 'src/app/components/components.module';
import { ContentsModule } from 'src/app/contents/contents.module';
import { LayoutModule } from 'src/app/layout/layout.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { ProductLabelStockSkuListComponent } from './product-label-stock-sku-list/product-label-stock-sku-list.component';
import { ProductLabelStockSkuModalComponent } from './product-label-stock-sku-modal/product-label-stock-sku-modal.component';
import { ProductStockRoutingModule } from './product-stock-routing.module';
import { StockCoreModule } from './stock-core/stock-core.module';
import { ProductCommonModule } from '../product-common/product-common.module';

@NgModule({
  declarations: [
    ProductLabelStockSkuListComponent,
    ProductLabelStockSkuModalComponent,
  ],
  imports: [
    CommonModule,
    ProductStockRoutingModule,
    ProductCommonModule,
    // Clean up unnecessary
    CoreModule,
    ComponentsModule,
    LayoutModule,
    FontAwesomeModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPageScrollModule,
    ContentsModule,
    EllipsisModule,
    QRCodeModule,
    NgbTimepickerModule,
    NgbDropdownModule,
    NgbPaginationModule,
    GoogleMapsModule,
    DragDropModule,
    StockCoreModule
  ]
})
export class ProductStockModule { }
