import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductLabelLeftPanelContentComponent } from './product-label-left-panel-content/product-label-left-panel-content.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    ProductLabelLeftPanelContentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [
    ProductLabelLeftPanelContentComponent
  ]
})
export class ProductCommonModule { }
