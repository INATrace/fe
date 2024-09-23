import { Injectable } from '@angular/core';
import { GeneralSifrantService } from './general-sifrant.service';
import { ApiCompanyListResponse } from '../../api/model/apiCompanyListResponse';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';
import { map } from 'rxjs/operators';
import { ApiPaginatedResponseApiValueChain } from '../../api/model/apiPaginatedResponseApiValueChain';
import { CompanyControllerService, GetCompanyValueChains } from '../../api/api/companyController.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyValueChainsService extends GeneralSifrantService<any> {

  requestParams = {
    limit: 1000,
    offset: 0,
  } as  GetCompanyValueChains.PartialParamMap;

  constructor(
    private companyControllerService: CompanyControllerService,
    private companyId: number,
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
      id: this.companyId
    };

    return this.companyControllerService.getCompanyValueChainsByMap(reqPars).pipe(
      map((res: ApiPaginatedResponseApiValueChain) => {
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
    return $localize`:@@valueChainInCompany.input.placehoder:Type value chain name ...`;
  }

}
