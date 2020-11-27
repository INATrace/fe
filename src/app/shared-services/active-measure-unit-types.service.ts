import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ChainMeasureUnitType } from 'src/api-chain/model/chainMeasureUnitType';
import { ApiResponsePaginatedListChainMeasureUnitType } from 'src/api-chain/model/apiResponsePaginatedListChainMeasureUnitType';
import { GetMeasureUnitTypeList, CodebookService } from 'src/api-chain/api/codebook.service';
import { CodebookTranslations } from './codebook-translations';

@Injectable({
  providedIn: 'root'
})
export class ActiveMeasureUnitTypeService extends GeneralSifrantService<ChainMeasureUnitType> {

  constructor(
    private chainCodebookService: CodebookService,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
  }

  public identifier(el: ChainMeasureUnitType) {
    return el.id;
  }

  public textRepresentation(el: ChainMeasureUnitType) {
    return this.codebookTranslations.translate(el, 'label')
    // return `${el.label}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetMeasureUnitTypeList.PartialParamMap

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainMeasureUnitType>> {
    let limit = params && params.limit ? params.limit : this.limit()

    let reqPars = {
      ...this.requestParams
    }
    let tmp = this.chainCodebookService.getMeasureUnitTypeListByMap(reqPars).pipe(
      map((res: ApiResponsePaginatedListChainMeasureUnitType) => {
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
    let placeholder = $localize`:@@activeMeasureUnitTypes.input.placehoder:Select measure unit type`;
    return placeholder;
  }

}

