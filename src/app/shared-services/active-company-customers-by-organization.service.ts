import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetFacilityTypeList } from 'src/api-chain/api/codebook.service';
import { CompanyCustomerService } from 'src/api-chain/api/companyCustomer.service';
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

  public identifier(el: ChainCompanyCustomer) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainCompanyCustomer) {
    return `${el.name}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetFacilityTypeList.PartialParamMap

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainCompanyCustomer>> {
    let limit = params && params.limit ? params.limit : this.limit()
    let reqPars = {
      organizationId: this.organizationId,
      query: key,
      ...this.requestParams
    }

    let tmp = this.chainCompanyCustomerService.listCompanyCustomersForOrganizationByMap(reqPars).pipe(
      map((res: ApiResponsePaginatedListChainCompanyCustomer) => {
        return {
          results: res.data.items,
          offset: 0,
          limit: limit,
          totalCount: res.data.count,
        }
      })
    )
    return tmp;
  }

  public placeholder(): string {
    let placeholder = $localize`:@@activeCompanyCustomersByOrganization.input.placehoder:Select ...`;
    return placeholder;
  }

}

