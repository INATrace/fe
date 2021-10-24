import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyLeftPanelComponent } from './company-left-panel/company-left-panel.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProducersItemComponent } from './producers-item/producers-item.component';

@NgModule({
  declarations: [
    CompanyLeftPanelComponent,
    ProducersItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [
    CompanyLeftPanelComponent,
    ProducersItemComponent
  ]
})
export class CompanyCommonModule { }
