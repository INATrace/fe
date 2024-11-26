import { Injectable } from '@angular/core';
import { GeneralSifrantService } from './general-sifrant.service';
import { GetValueChainList, ValueChainControllerService } from '../../api/api/valueChainController.service';
import { ApiCompanyListResponse } from '../../api/model/apiCompanyListResponse';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';
import { map } from 'rxjs/operators';
import { ApiPaginatedResponseApiValueChain } from '../../api/model/apiPaginatedResponseApiValueChain';

@Injectable({
    providedIn: 'root'
})
export class ActiveValueChainService extends GeneralSifrantService<any> {

  requestParams = {
    limit: 1000,
    requestType: 'FETCH',
    valueChainStatus: 'ENABLED'
  } as  GetValueChainList.PartialParamMap;

  constructor(
      private valueChainController: ValueChainControllerService,
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

    return this.valueChainController.getValueChainListByMap(reqPars).pipe(
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
    return $localize`:@@activeValueChain.input.placehoder:Type value chain name ...`;
  }

}
