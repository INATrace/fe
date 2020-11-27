import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { ApiResponsePaginatedListChainFacility } from 'src/api-chain/model/apiResponsePaginatedListChainFacility';
import { GetFacilityTypeList } from 'src/api-chain/api/codebook.service';
import { FacilityService } from 'src/api-chain/api/facility.service';
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

  public identifier(el: ChainFacility) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainFacility) {
    return this.codebookTranslations.translate(el, 'name')
    // return `${el.name}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetFacilityTypeList.PartialParamMap

  public makeQuery(key: string, params?: any, organizationId?:string): Observable<PagedSearchResults<ChainFacility>> {
    let limit = params && params.limit ? params.limit : this.limit()
    let reqPars = {
      organizationId,
      ...this.requestParams
    }
    let tmp = this.chainFacilityService.listFacilitiesForOrganizationByMap(reqPars).pipe(
      map((res: ApiResponsePaginatedListChainFacility) => {
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
    let placeholder = $localize`:@@activeFacility.input.placehoder:Select facility`;
    return placeholder;
  }

}

