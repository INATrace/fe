import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyCustomerService, ListCompanyCustomersForOrganization } from 'src/api-chain/api/companyCustomer.service';
import { ApiResponsePaginatedListChainCompanyCustomer } from 'src/api-chain/model/apiResponsePaginatedListChainCompanyCustomer';
import { ChainCompanyCustomer } from 'src/api-chain/model/chainCompanyCustomer';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { dbKey } from 'src/shared/utils';
import { GeneralSifrantService } from './general-sifrant.service';

export class ActiveCompanyCustomersByOrganizationService extends GeneralSifrantService<ChainCompanyCustomer> {

  constructor(
    private chainCompanyCustomerService: CompanyCustomerService,
    private organizationId: string,
  ) {
    super();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListCompanyCustomersForOrganization.PartialParamMap;

  public identifier(el: ChainCompanyCustomer) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainCompanyCustomer) {
    return `${el.name}`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainCompanyCustomer>> {
    const limit = params && params.limit ? params.limit : this.limit();
    const reqPars = {
      organizationId: this.organizationId,
      query: key,
      ...this.requestParams
    };

    return this.chainCompanyCustomerService.listCompanyCustomersForOrganizationByMap(reqPars).pipe(
        map((res: ApiResponsePaginatedListChainCompanyCustomer) => {
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
    return $localize`:@@activeCompanyCustomersByOrganization.input.placehoder:Select ...`;
  }

}
