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
import { CollectorDetailModalComponent } from './collector-detail-modal/collector-detail-modal.component';
import { CompanyCardComponent } from './company-card/company-card.component';
import { CustomerDetailModalComponent } from './customer-detail-modal/customer-detail-modal.component';
import { ProducersItemComponent } from './producers-item/producers-item.component';
import { ProductLabelStakeholdersCollectorsComponent } from './product-label-stakeholders-collectors/product-label-stakeholders-collectors.component';
import { ProductLabelStakeholdersCustomersComponent } from './product-label-stakeholders-customers/product-label-stakeholders-customers.component';
import { ProductLabelStakeholdersComponent } from './product-label-stakeholders/product-label-stakeholders.component';
import { StakeholdersCollectorsComponent } from './product-label-stakeholders/stakeholders-collectors/stakeholders-collectors.component';
import { StakeholdersCustomersComponent } from './product-label-stakeholders/stakeholders-customers/stakeholders-customers.component';
import { StakeholdersFarmersComponent } from './product-label-stakeholders/stakeholders-farmers/stakeholders-farmers.component';
import { StakeholdersValueChainComponent } from './product-label-stakeholders/stakeholders-value-chain/stakeholders-value-chain.component';
import { ProductStakeholdersRoutingModule } from './product-stakeholders-routing.module';

@NgModule({
  declarations: [
    CollectorDetailModalComponent,
    CompanyCardComponent,
    CustomerDetailModalComponent,
    ProductLabelStakeholdersComponent,
    ProductLabelStakeholdersCollectorsComponent,
    ProductLabelStakeholdersCustomersComponent,
    ProducersItemComponent,
    StakeholdersCollectorsComponent,
    StakeholdersCustomersComponent,
    StakeholdersFarmersComponent,
    StakeholdersValueChainComponent
  ],
  imports: [
    CommonModule,
    ProductStakeholdersRoutingModule,
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
export class ProductStakeholdersModule { }
