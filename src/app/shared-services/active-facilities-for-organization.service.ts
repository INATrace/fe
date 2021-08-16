import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { ApiResponsePaginatedListChainFacility } from 'src/api-chain/model/apiResponsePaginatedListChainFacility';
import { FacilityService, ListFacilitiesForOrganization } from 'src/api-chain/api/facility.service';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from './codebook-translations';

@Injectable({
  providedIn: 'root'
})
export class ActiveFacilitiesForOrganizationService extends GeneralSifrantService<ChainFacility> {

  constructor(
    private chainFacilityService: FacilityService,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListFacilitiesForOrganization.PartialParamMap;

  public identifier(el: ChainFacility) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainFacility) {
    return this.codebookTranslations.translate(el, 'name');
  }

  public makeQuery(key: string, params?: any, organizationId?: string): Observable<PagedSearchResults<ChainFacility>> {
    const limit = params && params.limit ? params.limit : this.limit();
    const reqPars = {
      organizationId,
      ...this.requestParams
    };

    return this.chainFacilityService.listFacilitiesForOrganizationByMap(reqPars).pipe(
        map((res: ApiResponsePaginatedListChainFacility) => {
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
    return $localize`:@@activeFacility.input.placehoder:Select facility`;
  }

}

