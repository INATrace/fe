import { GeneralCodesService } from './general-codes.service';
import { CurrencyTypeControllerService } from '../../api/api/currencyTypeController.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';

@Injectable({
    providedIn: 'root'
})
export class CurrencyCodesService extends GeneralCodesService<string> {
    
    constructor(private currencyService: CurrencyTypeControllerService) {
        super();
        this.initializeCodebook();
    }
    
    public identifier(el: string) {
        return el;
    }

    public textRepresentation(el: string): string {
        return el;
    }

    public makeQuery(key: string, params?: any): Observable<PagedSearchResults<string>> {
        return this.sifrant$.pipe(
            map((allChoices: PagedSearchResults<string>) => {
                return {
                    results: allChoices.results,
                    offset: allChoices.offset,
                    limit: allChoices.limit,
                    totalCount: allChoices.totalCount
                };
            })
        );
    }

    public initializeCodebook() {
        this.sifrant$ = this.sifrant$ || this.currencyService.getEnabledCurrencyTypes()
          .pipe(
            map(resp => resp.data.items.map(currency => currency.code)),
            map(currencyCodes => this.pack(currencyCodes))
          );
    }

}
