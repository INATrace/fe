import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ChainOrganization } from 'src/api-chain/model/chainOrganization';
import { ListOrganizations, OrganizationService } from 'src/api-chain/api/organization.service';
import { ApiResponsePaginatedListChainOrganization } from 'src/api-chain/model/apiResponsePaginatedListChainOrganization';
import { dbKey } from 'src/shared/utils';

export class AllOrganizationService extends GeneralSifrantService<ChainOrganization> {

  constructor(
    private chainOrganizationService: OrganizationService,
  ) {
    super();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListOrganizations.PartialParamMap;

  public identifier(el: ChainOrganization) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainOrganization) {
    return `${el.name}`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainOrganization>> {
    const limit = params && params.limit ? params.limit : this.limit();
    const reqPars = {
      // query: key,
      ...this.requestParams
    };

    return this.chainOrganizationService.listOrganizationsByMap(reqPars).pipe(
        map((res: ApiResponsePaginatedListChainOrganization) => {
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
    return $localize`:@@allOrganization.input.placehoder:Select ...`;
  }

}
