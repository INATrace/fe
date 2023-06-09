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
import { CompanyOrdersListComponent } from './company-orders-list/company-orders-list.component';
import { AddCustomerOrderComponent } from './placed-orders/add-customer-order/add-customer-order.component';
import { ComponentsModule } from '../../components/components.module';
import { CustomerOrderItemComponent } from './placed-orders/add-customer-order/customer-order-item/customer-order-item.component';
import { ApproveRejectTransactionModalComponent } from './approve-reject-transaction-modal/approve-reject-transaction-modal.component';
import { PlaceQuoteOrderModalComponent } from './placed-orders/place-quote-order-modal/place-quote-order-modal.component';


@NgModule({
  declarations: [
    OrdersTabComponent,
    ReceivedOrdersComponent,
    PlacedOrdersComponent,
    CompanyOrdersListComponent,
    AddCustomerOrderComponent,
    CustomerOrderItemComponent,
    ApproveRejectTransactionModalComponent,
    PlaceQuoteOrderModalComponent
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
