import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyControllerService, ListCompaniesUsingGET } from 'src/api/api/companyController.service';
import { ApiPaginatedResponseApiCompanyListResponse } from 'src/api/model/apiPaginatedResponseApiCompanyListResponse';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ApiCompanyListResponse } from 'src/api/model/apiCompanyListResponse';

@Injectable({
  providedIn: 'root'
})
export class ActiveCompaniesService extends GeneralSifrantService<ApiCompanyListResponse> {

    constructor(
        private companyController: CompanyControllerService,
    ) {
        super();
    }

    public identifier(el: ApiCompanyListResponse) {
        return el.id;
    }

    public textRepresentation(el: ApiCompanyListResponse) {
        return `${el.name}`
    }

    requestParams = {
        statuses: null,
        requestType: 'FETCH',
        limit: 1000,
        offset: 0,
        status: 'ACTIVE',
        // sortBy: 'SURNAME',
        // sort: 'ASC',
        // queryString: null,
        // status: 'ACTIVE'
    } as ListCompaniesUsingGET.PartialParamMap

    public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiCompanyListResponse>> {
      // console.log("MAKE Q")
        let limit = params && params.limit ? params.limit : this.limit()
        // let offset = params && params.offset ? params.offset : 0
        // if (!key || key.length < 1) return new BehaviorSubject<PagedSearchResults<ApiCompanyListResponse>>({
        //     results: [],
        //     offset: 0,
        //     limit: limit,
        //     totalCount: 0
        // })

        let reqPars = {
            ...this.requestParams,
            name: key
        }
        let tmp = this.companyController.listCompaniesUsingGETByMap(reqPars).pipe(
            map((res: ApiPaginatedResponseApiCompanyListResponse) => {
                return {
                    results: res.data.items,
                    offset: 0,
                    limit: limit,
                    totalCount: res.data.count
                }
            })
        )
        return tmp;
    }

    public placeholder(): string {
      let placeholder = $localize`:@@activeCompanies.input.placehoder:Type company name ...`
      return placeholder
    }

}

