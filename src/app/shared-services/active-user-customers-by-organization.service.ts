import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ListUserCustomersForOrganization, UserCustomerService } from 'src/api-chain/api/userCustomer.service';
import { ChainUserCustomer } from 'src/api-chain/model/chainUserCustomer';
import { ApiResponsePaginatedListChainUserCustomer } from 'src/api-chain/model/apiResponsePaginatedListChainUserCustomer';
import { dbKey } from 'src/shared/utils';

export class ActiveUserCustomersByOrganizationService extends GeneralSifrantService<ChainUserCustomer> {

  constructor(
    private chainUserCustomerService: UserCustomerService,
    private organizationId: string,
  ) {
    super();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListUserCustomersForOrganization.PartialParamMap;

  public identifier(el: ChainUserCustomer) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainUserCustomer) {
    const cell = el.location ? (el.location.cell ? el.location.cell.substring(0, 2).toLocaleUpperCase() : '--') : '--';
    const village = el.location ? (el.location.village ? el.location.village.substring(0, 2).toLocaleUpperCase() : '--') : '--';
    return `${el.name} ${el.surname} (${el.userCustomerId}, ${village}-${cell})`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainUserCustomer>> {
    const limit = params && params.limit ? params.limit : this.limit();
    const reqPars = {
      organizationId: this.organizationId,
      query: key,
      ...this.requestParams
    };

    return this.chainUserCustomerService.listUserCustomersForOrganizationByMap(reqPars).pipe(
        map((res: ApiResponsePaginatedListChainUserCustomer) => {
          return {
            results: res.data.items,
            offset: 0,
            limit,
            totalCount: res.data.count,
          };
        })
    );
  }

  public placeholder(): string {
    return $localize`:@@activeUserCustomersByOrganization.input.placehoder:Select ...`;
  }

}

