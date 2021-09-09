import {Injectable} from '@angular/core';
import {GeneralSifrantService} from './general-sifrant.service';
import {ValueChainControllerService} from '../../api/api/valueChainController.service';
import {ListCompaniesUsingGET} from '../../api/api/companyController.service';
import {ApiCompanyListResponse} from '../../api/model/apiCompanyListResponse';
import {Observable} from 'rxjs';
import {PagedSearchResults} from '../../interfaces/CodebookHelperService';
import {map} from 'rxjs/operators';
import {ApiPaginatedResponseApiValueChain} from '../../api/model/apiPaginatedResponseApiValueChain';


@Injectable({
    providedIn: 'root'
})

export class ActiveValueChainService extends GeneralSifrantService<any> {

  requestParams = {
    limit: 1000,
    requestType: 'FETCH',
    valueChainStatus: 'ENABLED'
  } as ListCompaniesUsingGET.PartialParamMap;

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

    const tmp = this.valueChainController.getValueChainListUsingGETByMap(reqPars).pipe(
        map((res: ApiPaginatedResponseApiValueChain) => {
          return {
            results: res.data.items,
            offset: 0,
            limit: limit,
            totalCount: res.data.count
          };
        })
    );
    return tmp;
  }

  public placeholder(): string {
    return $localize`:@@activeValueChain.input.placehoder:Type value chain name ...`;
  }

}
