import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeycoOrderListComponent } from './beyco-order-list/beyco-order-list.component';
import {BeycoOrderRoutingModule} from './beyco-order-routing.module';
import {LayoutModule} from '../../../layout/layout.module';
import {CompanyCommonModule} from '../../company-common/company-common.module';
import {SharedModule} from '../../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import { WholeNumberDirective } from './whole-number.directive';

@NgModule({
  declarations: [
      BeycoOrderListComponent,
      WholeNumberDirective
  ],
  imports: [
    CommonModule,
    BeycoOrderRoutingModule,
    LayoutModule,
    CompanyCommonModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class BeycoOrderModule { }
