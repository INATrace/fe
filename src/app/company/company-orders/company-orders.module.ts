import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyOrdersRoutingModule } from './company-orders-routing.module';
import { OrdersTabComponent } from './orders-tab/orders-tab.component';
import { OrdersDashboardComponent } from './orders-dashboard/orders-dashboard.component';
import { OrdersOrdersForMeComponent } from './orders-orders-for-me/orders-orders-for-me.component';
import { OrdersMyOrdersComponent } from './orders-my-orders/orders-my-orders.component';
import { LayoutModule } from '../../layout/layout.module';
import { CompanyCommonModule } from '../company-common/company-common.module';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { QuoteOrderListComponent } from './quote-order-list/quote-order-list.component';
import { GlobalOrderDetailsComponent } from './orders-my-orders/global-order-details/global-order-details.component';
import { ComponentsModule } from '../../components/components.module';
import { ProductOrderItemComponent } from './orders-my-orders/global-order-details/product-order-item/product-order-item.component';
import { ApproveRejectTransactionModalComponent } from './approve-reject-transaction-modal/approve-reject-transaction-modal.component';


@NgModule({
  declarations: [
    OrdersTabComponent,
    OrdersDashboardComponent,
    OrdersOrdersForMeComponent,
    OrdersMyOrdersComponent,
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
