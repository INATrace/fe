import { GeneralCodesService } from './general-codes.service';
import { ApiCurrencyType } from '../../api/model/apiCurrencyType';
import { CurrencyTypeControllerService } from '../../api/api/currencyTypeController.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';

@Injectable({
    providedIn: 'root'
})
export class CurrenciesService extends GeneralCodesService<ApiCurrencyType> {
    
    constructor(private currencyService: CurrencyTypeControllerService) {
        super();
        this.initializeCodebook();
    }
    
    public identifier(el: ApiCurrencyType) {
        return el.id;
    }

    public textRepresentation(el: ApiCurrencyType): string {
        return el.code;
    }

    public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiCurrencyType>> {
        return this.sifrant$.pipe(
            map((allChoices: PagedSearchResults<ApiCurrencyType>) => {
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
        this.sifrant$ = this.sifrant$ || this.currencyService.getEnabledCurrencyTypes(null).pipe(map(c => this.pack(c.data.items)));
    }

}
