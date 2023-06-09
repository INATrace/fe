import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyOrdersRoutingModule } from './company-orders-routing.module';
import { OrdersTabComponent } from './orders-tab/orders-tab.component';
import { ReceivedOrdersComponent } from './received-orders/received-orders.component';
import { PlacedOrdersComponent } from './placed-orders/placed-orders.component';
import { LayoutModule } from '../../layout/layout.module';
import { CompanyCommonModule } from '../company-common/company-common.module';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { QuoteOrderListComponent } from './quote-order-list/quote-order-list.component';
import { GlobalOrderDetailsComponent } from './placed-orders/global-order-details/global-order-details.component';
import { ComponentsModule } from '../../components/components.module';
import { ProductOrderItemComponent } from './placed-orders/global-order-details/product-order-item/product-order-item.component';
import { ApproveRejectTransactionModalComponent } from './approve-reject-transaction-modal/approve-reject-transaction-modal.component';


@NgModule({
  declarations: [
    OrdersTabComponent,
    ReceivedOrdersComponent,
    PlacedOrdersComponent,
    QuoteOrderListComponent,
    GlobalOrderDetailsComponent,
    ProductOrderItemComponent,
    ApproveRejectTransactionModalComponent
  ],
  imports: [
    CommonModule,
    CompanyOrdersRoutingModule,
    LayoutModule,
    CompanyCommonModule,
    SharedModule,
    FontAwesomeModule,
    NgbDropdownModule,
    NgbPaginationModule,
    ComponentsModule
  ]
})
export class CompanyOrdersModule { }
