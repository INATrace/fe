import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerOrderExploreRoutingModule } from './customer-order-explore-routing.module';
import { CustomerOrderDetailsComponent } from './customer-order-view/customer-order-details/customer-order-details.component';
import { CustomerOrderViewComponent } from './customer-order-view/customer-order-view.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { EllipsisModule } from 'ngx-ellipsis';
import { ComponentsModule } from 'src/app/components/components.module';
import { ContentsModule } from 'src/app/contents/contents.module';
import { LayoutModule } from 'src/app/layout/layout.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { OrderLeftPanelContentComponent } from './customer-order-view/order-left-panel-content/order-left-panel-content.component';
import { CustomerOrderHistoryComponent } from './customer-order-view/customer-order-history/customer-order-history.component';
import { StockCoreModule } from '../../product-stock/stock-core/stock-core.module';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    CustomerOrderViewComponent,
    CustomerOrderDetailsComponent,
    OrderLeftPanelContentComponent,
    CustomerOrderHistoryComponent,
  ],
  imports: [
    CommonModule,
    CustomerOrderExploreRoutingModule,
    CoreModule,
    ComponentsModule,
    LayoutModule,
    FontAwesomeModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ContentsModule,
    EllipsisModule,
    NgbDropdownModule,
    NgbPaginationModule,
    DragDropModule,
    StockCoreModule,
    QRCodeModule
  ]
})
export class CustomerOrderExploreModule { }
