import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeycoOrderListComponent } from './beyco-order-list/beyco-order-list.component';
import {BeycoOrderRoutingModule} from './beyco-order-routing.module';
import {LayoutModule} from '../../../layout/layout.module';
import {CompanyCommonModule} from '../../company-common/company-common.module';
import {SharedModule} from '../../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {BeycoTokenInterceptor} from '../../../core/beyco-token.interceptor';

@NgModule({
  declarations: [
      BeycoOrderListComponent
  ],
  imports: [
    CommonModule,
    BeycoOrderRoutingModule,
    LayoutModule,
    CompanyCommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BeycoTokenInterceptor,
      multi: true
    },
  ]
})
export class BeycoOrderModule { }
