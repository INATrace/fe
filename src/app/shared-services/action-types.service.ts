import { Injectable } from '@angular/core';
import { GeneralSifrantService } from './general-sifrant.service';
import { Observable } from 'rxjs';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { map } from 'rxjs/operators';
import { CodebookService, GetActionTypeList } from 'src/api-chain/api/codebook.service';
import { ChainActionType } from 'src/api-chain/model/chainActionType';

@Injectable({
  providedIn: 'root'
})
export class ActionTypesService extends GeneralSifrantService<ChainActionType> {

  constructor(
    private chainCodebookService: CodebookService,
  ) {
    super();
    this.initializeCodebook();
  }

  public identifier(el: ChainActionType) {
    return el._id;
  }

  public textRepresentation(el: ChainActionType) {
    return `${el.label}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetActionTypeList.PartialParamMap

  public placeholder(): string {
    let placeholder = $localize`:@@actionTypesService.input.placehoder:Select transaction type`;
    return placeholder;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainActionType>> {
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ChainActionType>) => {
        return {
          results: allChoices.results,
          offset: allChoices.offset,
          limit: allChoices.limit,
          totalCount: allChoices.totalCount
        }
      })
    )

  }


  public initializeCodebook() {
    this.sifrant$ = this.sifrant$ || this.chainCodebookService.getActionTypeListByMap({ ...this.requestParams }).pipe(
      map(x => this.pack(x.data.items))
    )
  }

}
