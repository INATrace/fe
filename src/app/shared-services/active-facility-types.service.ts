import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CodebookService, GetFacilityTypeList } from 'src/api-chain/api/codebook.service';
import { ApiResponsePaginatedListChainFacilityType } from 'src/api-chain/model/apiResponsePaginatedListChainFacilityType';
import { ChainFacilityType } from 'src/api-chain/model/chainFacilityType';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { CodebookTranslations } from './codebook-translations';
import { GeneralSifrantService } from './general-sifrant.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveFacilityTypeService extends GeneralSifrantService<ChainFacilityType> {

  constructor(
    private chainCodebookService: CodebookService,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
  }

  public identifier(el: ChainFacilityType) {
    return el.id;
  }

  public textRepresentation(el: ChainFacilityType) {
    return this.codebookTranslations.translate(el, 'label')
    // return `${el.label}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetFacilityTypeList.PartialParamMap

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainFacilityType>> {
    let limit = params && params.limit ? params.limit : this.limit()

    let reqPars = {
      ...this.requestParams
    }
    let tmp = this.chainCodebookService.getFacilityTypeListByMap(reqPars).pipe(
      map((res: ApiResponsePaginatedListChainFacilityType) => {
        return {
          results: res.data.items,
          offset: 0,
          limit: limit,
          totalCount: res.data.count
        }
      })
    )
    return tmp;
  }

  public placeholder(): string {
    let placeholder = $localize`:@@activeFacilityTypes.input.placehoder:Select facility type`;
    return placeholder;
  }

}

