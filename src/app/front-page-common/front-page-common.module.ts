import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontPageTermsComponent } from './front-page-terms/front-page-terms.component';
import { FrontPagePrivacyComponent } from './front-page-privacy/front-page-privacy.component';
import { FrontPageHeaderComponent } from './front-page-header/front-page-header.component';
import { FrontPageFooterComponent } from './front-page-footer/front-page-footer.component';

@NgModule({
  declarations: [
    FrontPageHeaderComponent,
    FrontPageFooterComponent,
    FrontPageTermsComponent,
    FrontPagePrivacyComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FrontPageHeaderComponent,
    FrontPageFooterComponent,
    FrontPageTermsComponent,
    FrontPagePrivacyComponent
  ]
})
export class FrontPageCommonModule { }
