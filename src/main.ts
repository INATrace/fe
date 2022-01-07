import './polyfills.ts';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { getTranslations, ParsedTranslationBundle } from '@locl/core';
import { environment } from './environments/environment';
import { loadTranslations } from '@angular/localize';
import { LanguageCodeHelper } from './app/language-code-helper';

const languageCode = LanguageCodeHelper.getCurrentLocale();

if (environment.production) {
  enableProdMode();
}
if (languageCode) {
  getTranslations(`./assets/locale/${languageCode}.json`).then(
    (data: ParsedTranslationBundle) => {
      loadTranslations(data.translations as any);
      import('./app/app.module').then(module => {
        platformBrowserDynamic()
          .bootstrapModule(module.AppModule)
          .catch(err => console.error(err));
      }).catch(err => console.error('first', err));
    }
  );
} else {
  import('./app/app.module').then(module => {
    platformBrowserDynamic().bootstrapModule(module.AppModule).then();
  }).catch(err => console.error(err));
}
