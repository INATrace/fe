import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeycoOfferListComponent } from './beyco-offer-list/beyco-offer-list.component';
import {BeycoOfferRoutingModule} from './beyco-offer-routing.module';
import {LayoutModule} from '../../../layout/layout.module';
import {CompanyCommonModule} from '../../company-common/company-common.module';
import {SharedModule} from '../../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import { WholeNumberDirective } from './whole-number.directive';

@NgModule({
  declarations: [
      BeycoOfferListComponent,
      WholeNumberDirective
  ],
  imports: [
    CommonModule,
    BeycoOfferRoutingModule,
    LayoutModule,
    CompanyCommonModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class BeycoOfferModule { }
