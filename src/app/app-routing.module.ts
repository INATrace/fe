import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ClearCookieConsentComponent } from './cookies/clear-cookie-consent/clear-cookie-consent.component';
import { CookiesPageComponent } from './cookies/cookies-page/cookies-page.component';
import { PrivacyPageComponent } from './cookies/privacy-page/privacy-page.component';
import { TermsAndConditionsPageComponent } from './cookies/terms-and-conditions-page/terms-and-conditions-page.component';
import { GetStartedPageComponent } from './get-started-page/get-started-page.component';
import { KnowledgeBlogFrontComponent } from './knowledge-blog-front/knowledge-blog-front.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { GuestLayoutComponent } from './layout/guest/guest-layout/guest-layout.component';
import { LandingPageLayoutComponent } from './layout/landing-page/landing-page-layout/landing-page-layout.component';
import { ProductLabelFrontLayoutComponent } from './layout/product-label-front/product-label-front-layout/product-label-front-layout.component';
import { LoginComponent } from './login/login.component';
import { ProductLabelFrontPageComponent } from './product-label-front-page/product-label-front-page.component';
import { QrCodeRedirectComponent } from './product-label-front-page/qr-code-redirect/qr-code-redirect.component';
import { RegisterActivationComponent } from './register-activation/register-activation.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordRequestComponent } from './reset-password-request/reset-password-request.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SettingsAdditionalComponent } from './settings/settings-additional/settings-additional.component';
import { SettingsTypesComponent } from './settings/settings-types/settings-types.component';
import { AuthGuardService } from './shared-services/auth-guard.service';
import { DeactivateGuardService } from './shared-services/deactivate-guard.service';
import { VersionComponent } from './shared/version/version.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserListComponent } from './user-list/user-list.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { FrontPagePrivacyComponent } from './front-page/front-page-privacy/front-page-privacy.component';
import { FrontPageTermsComponent } from './front-page/front-page-terms/front-page-terms.component';
import { CompanyDetailTranslateComponent } from './company-detail/company-detail-translate/company-detail-translate.component';
import { ValueChainListComponent } from './value-chain-list/value-chain-list.component';
import { ValueChainDetailComponent } from './value-chain-detail/value-chain-detail.component';

export function loginMatcher(url) {
  if (url.length > 0 && url[0].path === 'login') {
    return {
      consumed: url
    };
  }
  return null;
}

const routes: Routes = [
  {
    matcher: loginMatcher,
    component: GuestLayoutComponent,
    children: [
      { path: '', component: LoginComponent, pathMatch: 'full' },
    ]
  },
  {
    path: 'app-version',
    component: VersionComponent
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LandingPageLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent, pathMatch: 'full' },
    ]
  },
  {
    path: 'products/new',
    component: LandingPageLayoutComponent,
    children: [
      { path: '', component: GetStartedPageComponent, pathMatch: 'full' },
    ]
  },
  {
    path: 'register',
    component: GuestLayoutComponent,
    children: [
      { path: '', component: RegisterComponent, pathMatch: 'full' },
    ]
  },
  {
    path: 'confirm-email/:token',
    component: GuestLayoutComponent,
    children: [
      { path: '', component: ConfirmEmailComponent, pathMatch: 'full' },
    ]
  },
  {
    path: 'home',
    component: UserHomeComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  },
  {
    path: 'user-profile',
    component: UserDetailComponent,
    pathMatch: 'full',
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'settings',
    redirectTo: 'settings/additional'
  },
  {
    path: 'settings/additional',
    component: SettingsAdditionalComponent,
    pathMatch: 'full',
    canActivate: [AuthGuardService],
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'settings/types',
    component: SettingsTypesComponent,
    pathMatch: 'full',
    canActivate: [AuthGuardService],
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'value-chains',
    component: ValueChainListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'value-chains/new',
    component: ValueChainDetailComponent,
    pathMatch: 'full',
    canActivate: [AuthGuardService],
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'value-chains/:id',
    redirectTo: 'value-chains/:id/value-chain'
  },
  {
    path: 'value-chains/:id/value-chain',
    component: ValueChainDetailComponent,
    pathMatch: 'full',
    canActivate: [AuthGuardService],
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'users',
    component: UserListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'users/:id',
    component: UserDetailComponent,
    pathMatch: 'full',
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'companies',
    component: CompanyListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'companies/new',
    component: CompanyDetailComponent,
    pathMatch: 'full',
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'companies/:id',
    redirectTo: 'companies/:id/company'
  },
  {
    path: 'companies/:id/company',
    component: CompanyDetailComponent,
    pathMatch: 'full',
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: 'companies/:id/translate',
    component: CompanyDetailTranslateComponent,
    pathMatch: 'full',
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  ///////////////////////
  ///////////////////////
  ///////////////////////
  ///////////////////////
  ///////////////////////
  {
    path: 'product-labels',
    loadChildren: () => import('./m-product/m-product.module').then(m => m.MProductModule)
  },
  {
    path: 'account-activation',
    component: GuestLayoutComponent,
    children: [
      { path: '', component: RegisterActivationComponent, pathMatch: 'full' },
    ]
  },
  {
    path: 'reset-password',
    component: GuestLayoutComponent,
    children: [
      { path: '', component: ResetPasswordRequestComponent, pathMatch: 'full' },
    ]
  },
  {
    path: 'reset-password/:token',
    component: GuestLayoutComponent,
    children: [
      { path: '', component: ResetPasswordComponent, pathMatch: 'full' },
    ]
  },
  {
    path: 's/cookies',
    component: ProductLabelFrontLayoutComponent,
    children: [
      { path: '', component: CookiesPageComponent, pathMatch: 'full' },
    ],
    data: {
      drobtinice: [
        {
          title: $localize`:@@breadCrumb.cookiesPage.home:Home`,
          route: '/'
        },
        {
          title: $localize`:@@breadCrumb.cookiesPage.cookiePolicy:Cookie policy`,
          route: null
        }
      ]
    }
  },
  {
    path: 's/clear-cookies/:type/:value',
    component: ProductLabelFrontLayoutComponent,
    children: [
      { path: '', component: ClearCookieConsentComponent, pathMatch: 'full' },
    ],
  },
  {
    path: 's/privacy',
    component: ProductLabelFrontLayoutComponent,
    children: [
      { path: '', component: PrivacyPageComponent, pathMatch: 'full' },
    ],
    data: {
      drobtinice: [
        {
          title: $localize`:@@breadCrumb.privacyPage.home:Home`,
          route: '/'
        },
        {
          title: $localize`:@@breadCrumb.privacyPage.privacyPolicy:Privacy policy`,
          route: null
        }
      ]
    }
  },
  {
    path: 's/terms-and-conditions',
    component: ProductLabelFrontLayoutComponent,
    children: [
      { path: '', component: TermsAndConditionsPageComponent, pathMatch: 'full' },
    ],
    data: {
      drobtinice: [
        {
          title: $localize`:@@breadCrumb.termsAndConditionsPage.home:Home`,
          route: '/'
        },
        {
          title: $localize`:@@breadCrumb.termsAndConditionsPage.termsAndConditions:Terms and conditions`,
          route: null
        }
      ]
    }
  },
  {
    path: 'p/:uuid',
    component: ProductLabelFrontLayoutComponent,
    children: [
      { path: '', component: ProductLabelFrontPageComponent, pathMatch: 'full' },
    ]
  },
  {
    path: 'p-cd/:uuid/:soid',
    loadChildren: () => import('./front-page/front-page-routing.module').then(m => m.FrontPageRoutingModule)
  },
  {
    path: 's/:uuid/:soid/privacy-policy',
    component: FrontPagePrivacyComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  },
  {
    path: 's/privacy-policy',
    component: FrontPagePrivacyComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null,
      action: 'privacy_only'
    }
  },
  {
    path: 's/:uuid/:soid/terms-of-use',
    component: FrontPageTermsComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  },
  {
    path: 'p-cd',
    component: FrontPageComponent,
    pathMatch: 'full'
  },
  {
    path: 'blog/:productId/:type/:knowledgeBlogId',
    component: ProductLabelFrontLayoutComponent,
    children: [
      { path: '', component: KnowledgeBlogFrontComponent, pathMatch: 'full' },
    ],
    data: {
      drobtinice: [
        {
          title: $localize`:@@breadCrumb.KnowledgeBlogFrontComponent.home:Home`,
          route: '/'
        },
        {
          title: $localize`:@@breadCrumb.KnowledgeBlogFrontComponent.knowledgeBlog:Blog`,
          route: null
        }
      ]
    }
  },
  {
    path: 'q/:uuid',
    component: QrCodeRedirectComponent,
    pathMatch: 'full'
  },
  {
    path: 'q-cd/:uuid/:soid',
    component: QrCodeRedirectComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
