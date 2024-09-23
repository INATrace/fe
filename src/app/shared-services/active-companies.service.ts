import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyControllerService, ListCompanies } from 'src/api/api/companyController.service';
import { ApiPaginatedResponseApiCompanyListResponse } from 'src/api/model/apiPaginatedResponseApiCompanyListResponse';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ApiCompanyListResponse } from 'src/api/model/apiCompanyListResponse';

@Injectable({
  providedIn: 'root'
})
export class ActiveCompaniesService extends GeneralSifrantService<ApiCompanyListResponse> {

    requestParams = {
        statuses: null,
        requestType: 'FETCH',
        limit: 1000,
        offset: 0,
        status: 'ACTIVE'
    } as ListCompanies.PartialParamMap;

    constructor(
        private companyController: CompanyControllerService
    ) {
        super();
    }

    public identifier(el: ApiCompanyListResponse) {
        return el.id;
    }

    public textRepresentation(el: ApiCompanyListResponse) {
        return `${el.name}`;
    }

    public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiCompanyListResponse>> {

        const limit = params && params.limit ? params.limit : this.limit();

        const reqPars = {
            ...this.requestParams,
            name: key
        };

        return this.companyController.listCompaniesByMap(reqPars).pipe(
          map((res: ApiPaginatedResponseApiCompanyListResponse) => {
              return {
                  results: res.data.items,
                  offset: 0,
                  limit,
                  totalCount: res.data.count
              };
          })
        );
    }

    public placeholder(): string {
        return $localize`:@@activeCompanies.input.placehoder:Type company name ...`;
    }

}

