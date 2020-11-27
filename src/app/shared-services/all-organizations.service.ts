import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { GetFacilityTypeList } from 'src/api-chain/api/codebook.service';
import { UserCustomerService } from 'src/api-chain/api/userCustomer.service';
import { ChainUserCustomer } from 'src/api-chain/model/chainUserCustomer';
import { ApiResponsePaginatedListChainUserCustomer } from 'src/api-chain/model/apiResponsePaginatedListChainUserCustomer';
import { ChainOrganization } from 'src/api-chain/model/chainOrganization';
import { OrganizationService, ListOrganizations } from 'src/api-chain/api/organization.service';
import { ApiResponsePaginatedListChainOrganization } from 'src/api-chain/model/apiResponsePaginatedListChainOrganization';
import { dbKey } from 'src/shared/utils';

export class AllOrganizationService extends GeneralSifrantService<ChainOrganization> {

  constructor(
    private chainOrganizationService: OrganizationService,
  ) {
    super();
  }

  public identifier(el: ChainOrganization) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainOrganization) {
    return `${el.name}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListOrganizations.PartialParamMap

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainOrganization>> {
    let limit = params && params.limit ? params.limit : this.limit()
    let reqPars = {
      // query: key,
      ...this.requestParams
    }
    let tmp = this.chainOrganizationService.listOrganizationsByMap(reqPars).pipe(
      map((res: ApiResponsePaginatedListChainOrganization) => {
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
    let placeholder = $localize`:@@allOrganization.input.placehoder:Select ...`;
    return placeholder;
  }

}

