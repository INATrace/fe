import { Injectable } from '@angular/core';
import { GeneralSifrantService } from './general-sifrant.service';
import { Observable } from 'rxjs';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { map } from 'rxjs/operators';
import { ActionTypeControllerService, GetActionTypeList } from '../../api/api/actionTypeController.service';
import { ApiActionType } from '../../api/model/apiActionType';

@Injectable({
  providedIn: 'root'
})
export class ActionTypesService extends GeneralSifrantService<ApiActionType> {

  constructor(
    private codebookService: ActionTypeControllerService,
  ) {
    super();
    this.initializeCodebook();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetActionTypeList.PartialParamMap;

  public identifier(el: ApiActionType) {
    return el.id;
  }

  public textRepresentation(el: ApiActionType) {
    return `${el.label}`;
  }

  public placeholder(): string {
    return $localize`:@@actionTypesService.input.placehoder:Select transaction type`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiActionType>> {
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ApiActionType>) => {
        return {
          results: allChoices.results,
          offset: allChoices.offset,
          limit: allChoices.limit,
          totalCount: allChoices.totalCount
        };
      })
    );
  }

  public initializeCodebook() {
    this.sifrant$ = this.sifrant$ || this.codebookService.getActionTypeListByMap({ ...this.requestParams }).pipe(
      map(x => this.pack(x.data.items))
    );
  }

}
