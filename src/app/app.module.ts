import { DragDropModule } from '@angular/cdk/drag-drop';
import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeRw from '@angular/common/locales/rw';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule, NgbPaginationModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { QRCodeModule } from 'angular2-qrcode';
import { Angulartics2Module } from 'angulartics2';
import { EllipsisModule } from 'ngx-ellipsis';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ToastrModule } from 'ngx-toastr';
import { ApiModule } from 'src/api/api.module';
import { Configuration } from 'src/api/configuration';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompanyDetailComponent } from './company/company-detail/company-detail.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { CompanySelectModalComponent } from './company/company-list/company-select-modal/company-select-modal.component';
import { ComponentsModule } from './components/components.module';
import { ConfirmEmailComponent } from './user/confirm-email/confirm-email.component';
import { ContentsModule } from './contents/contents.module';
import { ClearCookieConsentComponent } from './cookies/clear-cookie-consent/clear-cookie-consent.component';
import { CookieBannerComponent } from './cookies/cookie-banner/cookie-banner.component';
import { CookieManagementModalComponent } from './cookies/cookie-management-modal/cookie-management-modal.component';
import { CookiesPageComponent } from './cookies/cookies-page/cookies-page.component';
import { PrivacyPageComponent } from './cookies/privacy-page/privacy-page.component';
import { TermsAndConditionsPageComponent } from './cookies/terms-and-conditions-page/terms-and-conditions-page.component';
import { KnowledgeBlogFrontComponent } from './knowledge-blog-front/knowledge-blog-front.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LanguageCodeHelper } from './language-code-helper';
import { LayoutModule } from './layout/layout.module';
import { LoginComponent } from './user/login/login.component';
import { ProductLabelFrontFeedbackComponent } from './product-label-front-page/product-label-front-feedback/product-label-front-feedback.component';
import { CheckBatchNumberModalComponent } from './product-label-front-page/check-batch-number-modal/check-batch-number-modal.component';
import { CheckBatchNumberResponseModalComponent } from './product-label-front-page/check-batch-number-response-modal/check-batch-number-response-modal.component';
import { ProductLabelFrontPageComponent } from './product-label-front-page/product-label-front-page.component';
import { QrCodeRedirectComponent } from './product-label-front-page/qr-code-redirect/qr-code-redirect.component';
import { SectionContentPieceComponent } from './product-label-front-page/section-content-piece/section-content-piece.component';
import { SectionTitleComponent } from './product-label-front-page/section-title/section-title.component';
import { RegisterActivationComponent } from './user/register-activation/register-activation.component';
import { RegisterComponent } from './user/register/register.component';
import { ResetPasswordRequestComponent } from './user/reset-password-request/reset-password-request.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { SelectedUserCompanyModalComponent } from './user/selected-user-company-modal/selected-user-company-modal.component';
import { SettingsAdditionalComponent } from './settings/settings-additional/settings-additional.component';
import { SettingsTypesComponent } from './settings/settings-types/settings-types.component';
import { SettingsComponent } from './settings/settings.component';
import { SharedModule } from './shared/shared.module';
import { SystemLeftPanelComponent } from './system-left-panel/system-left-panel.component';
import { CoreModule } from './core/core.module';
import { TokenInterceptor } from './core/token.interceptor';
import { TypeDetailModalComponent } from './settings/type-detail-modal/type-detail-modal.component';
import { TypeListComponent } from './settings/type-list/type-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { UserHomeComponent } from './user/user-home/user-home.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { WelcomeScreenUnconfirmedComponent } from './welcome-screen-unconfirmed/welcome-screen-unconfirmed.component';
import { FrontPageFirstComponent } from './front-page/front-page-first/front-page-first.component';
import { FrontPageJourneyComponent } from './front-page/front-page-journey/front-page-journey.component';
import { FrontPageFairPricesComponent } from './front-page/front-page-fair-prices/front-page-fair-prices.component';
import { FrontPageProducersComponent } from './front-page/front-page-producers/front-page-producers.component';
import { FrontPageQualityComponent } from './front-page/front-page-quality/front-page-quality.component';
import { FrontPageFeedbackComponent } from './front-page/front-page-feedback/front-page-feedback.component';
import { FrontPageHeaderComponent } from './front-page/front-page-header/front-page-header.component';
import { FrontPageFooterComponent } from './front-page/front-page-footer/front-page-footer.component';
import * as Hammer from 'hammerjs';
import { ChartsModule } from 'ng2-charts';
import { FrontPagePrivacyComponent } from './front-page/front-page-privacy/front-page-privacy.component';
import { FrontPageTermsComponent } from './front-page/front-page-terms/front-page-terms.component';
import { CompanyDetailTranslateComponent } from './company/company-detail/company-detail-translate/company-detail-translate.component';
import { CompanyDetailTabManagerComponent } from './company/company-detail/company-detail-tab-manager/company-detail-tab-manager.component';
import { CompanyUserRoleComponent } from './company/company-user-role/company-user-role.component';
import { ValueChainListComponent } from './value-chain/value-chain-list/value-chain-list.component';
import { ValueChainDetailComponent } from './value-chain/value-chain-detail/value-chain-detail.component';
import { ValueChainConfigItemComponent } from './value-chain/value-chain-detail/value-chain-config-item/value-chain-config-item.component';
import { CompanyDetailUsersComponent } from './company/company-detail/company-detail-users/company-detail-users.component';
import { CompanyDetailFacilitiesComponent } from './company/company-detail/company-detail-facilities/company-detail-facilities.component';
import { CompanyDetailFacilityAddComponent } from './company/company-detail/company-detail-facility-add/company-detail-facility-add.component';
import { CompanyAndValueChainSelectModalComponent } from './company/company-list/company-and-value-chain-select-modal/company-and-value-chain-select-modal.component';
import { CompanyDetailProcessingActionsDetailComponent } from './company/company-detail/company-processing-actions/company-detail-processing-actions-detail/company-detail-processing-actions-detail.component';
import { CompanyProcessingActionsComponent } from './company/company-detail/company-processing-actions/company-processing-actions.component';
import { CompanyDetailProcessingActionsListComponent } from './company/company-detail/company-processing-actions/company-detail-processing-actions-list/company-detail-processing-actions-list.component';
import { CurrencyListComponent } from './currency-list/currency-list.component';
import { LanguageInterceptor } from './core/language.interceptor';

export class HammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    return new Hammer(element, {
      touchAction: 'pan-y'
    });
  }
}

registerLocaleData(localeDe);
registerLocaleData(localeRw);
registerLocaleData(localeEs);

export function getConfiguration(): Configuration {
  return new Configuration({
    basePath: environment.basePath
  });
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserHomeComponent,
    ConfirmEmailComponent,
    UserListComponent,
    UserDetailComponent,
    CompanyListComponent,
    CompanyDetailComponent,
    RegisterActivationComponent,
    ResetPasswordComponent,
    ResetPasswordRequestComponent,
    LandingPageComponent,
    WelcomeScreenUnconfirmedComponent,
    CompanySelectModalComponent,
    CookieBannerComponent,
    ClearCookieConsentComponent,
    CookieManagementModalComponent,
    CookiesPageComponent,
    ProductLabelFrontPageComponent,
    SectionTitleComponent,
    SectionContentPieceComponent,
    CheckBatchNumberModalComponent,
    CheckBatchNumberResponseModalComponent,
    PrivacyPageComponent,
    TermsAndConditionsPageComponent,
    QrCodeRedirectComponent,
    SystemLeftPanelComponent,
    SettingsComponent,
    ProductLabelFrontFeedbackComponent,
    KnowledgeBlogFrontComponent,
    TypeDetailModalComponent,
    TypeListComponent,
    SelectedUserCompanyModalComponent,
    SettingsAdditionalComponent,
    SettingsTypesComponent,
    FrontPageFirstComponent,
    FrontPageJourneyComponent,
    FrontPageFairPricesComponent,
    FrontPageProducersComponent,
    FrontPageQualityComponent,
    FrontPageFeedbackComponent,
    FrontPageHeaderComponent,
    FrontPageFooterComponent,
    FrontPagePrivacyComponent,
    FrontPageTermsComponent,
    CompanyDetailTranslateComponent,
    CompanyDetailTabManagerComponent,
    CompanyUserRoleComponent,
    ValueChainListComponent,
    ValueChainDetailComponent,
    ValueChainConfigItemComponent,
    CompanyDetailUsersComponent,
    CompanyDetailFacilitiesComponent,
    CompanyDetailFacilityAddComponent,
    CompanyAndValueChainSelectModalComponent,
    CompanyDetailProcessingActionsDetailComponent,
    CompanyProcessingActionsComponent,
    CompanyDetailProcessingActionsListComponent,
    CurrencyListComponent
  ],
  entryComponents: [
    CompanySelectModalComponent
  ],
  imports: [
    ApiModule.forRoot(getConfiguration),
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      autoDismiss: true
    }),
    HttpClientModule,
    Angulartics2Module.forRoot({
      gst: {
        trackingIds: [environment.googleAnalyticsId]
      }
    }),
    //////////
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
    BrowserAnimationsModule,
    NgbTimepickerModule,
    NgbDropdownModule,
    NgbPaginationModule,
    GoogleMapsModule,
    DragDropModule,
    HammerModule,
    ChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LanguageInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      // see LanguageCodeHelper for source
      provide: APP_BASE_HREF, useFactory: () => {
        return `/${ LanguageCodeHelper.getCurrentLocale() }/`;
      }
    },
    {
      provide: LOCALE_ID, useFactory: () => LanguageCodeHelper.getCurrentLocale()
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    }
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
