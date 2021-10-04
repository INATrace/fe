import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyLeftPanelComponent } from './company-left-panel/company-left-panel.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CompanyLeftPanelComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  exports: [
    CompanyLeftPanelComponent
  ]
})
export class CompanyCommonModule { }
