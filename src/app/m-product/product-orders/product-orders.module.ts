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
import { CoreModule } from 'src/app/system/core.module';
import { GlobalOrderEditComponent } from './global-order-edit/global-order-edit.component';
import { StockOrderItemComponent } from './global-order-edit/stock-order-item/stock-order-item.component';
import { ProductLabelOrdersAllOrdersComponent } from './product-label-orders/orders-all-orders/orders-all-orders.component';
import { OrdersCustomerOrdersComponent } from './product-label-orders/orders-customer-orders/orders-customer-orders.component';
import { CustomerOrderCardComponent } from './product-label-orders/orders-dashboard/customer-order-card/customer-order-card.component';
import { OrderCardListComponent } from './product-label-orders/orders-dashboard/order-card-list/order-card-list.component';
import { ProductLabelOrdersDashboardComponent } from './product-label-orders/orders-dashboard/orders-dashboard.component';
import { ProductLabelOrdersComponent } from './product-label-orders/product-label-orders.component';
import { ProductOrdersRoutingModule } from './product-orders-routing.module';
import { QuoteOrderListComponent } from './quote-stock-order-list/quote-stock-order-list.component';

@NgModule({
  declarations: [
    ProductLabelOrdersDashboardComponent,
    ProductLabelOrdersAllOrdersComponent,
    ProductLabelOrdersComponent,
    QuoteOrderListComponent,
    OrdersCustomerOrdersComponent,
    GlobalOrderEditComponent,
    StockOrderItemComponent,
    OrderCardListComponent,
    CustomerOrderCardComponent,
  ],
  imports: [
    CommonModule,
    ProductOrdersRoutingModule,
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
  ]
})
export class ProductOrdersModule { }
