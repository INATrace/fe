import { GeneralSifrantService } from './general-sifrant.service';
import { ApiProcessingAction } from '../../api/model/apiProcessingAction';
import {
  ListProcessingActionsByCompany,
  ProcessingActionControllerService
} from '../../api/api/processingActionController.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';
import {ProcessingActionType} from '../../shared/types';

export class CompanyProcessingActionsByStatusService extends GeneralSifrantService<ApiProcessingAction> {

  private requestParams = {
    limit: 1000,
    offset: 0,
    id: this.companyId
  } as ListProcessingActionsByCompany.PartialParamMap;

  constructor(
    private processingActionController: ProcessingActionControllerService,
    private companyId: number,
    private types: ProcessingActionType[]
  ) {
    super();
    this.initializeCodebook();
  }

  public identifier(el: ApiProcessingAction) {
    return el.id;
  }

  public textRepresentation(el: ApiProcessingAction) {
    return `${el.name}`;
  }

  public placeholder(): string {
    return $localize`:@@activeProcessingAction.input.placehoder:Select processing action`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiProcessingAction>> {
    const lkey = key ? key.toLocaleLowerCase() : null;
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ApiProcessingAction>) => {
        allChoices.results.filter((pa: ApiProcessingAction) => this.types.some(type => type === pa.type));
        return {
          results: allChoices.results.filter((x: ApiProcessingAction) => lkey == null || x.name.toLocaleLowerCase().indexOf(lkey) >= 0),
          offset: allChoices.offset,
          limit: allChoices.limit,
          totalCount: allChoices.totalCount
        };
      })
    );
  }

  public initializeCodebook() {
    this.sifrant$ = this.sifrant$ ||
      this.processingActionController.listProcessingActionsByCompanyByMap({ ...this.requestParams })
        .pipe(
          map(results => results.data.items.filter(pa => this.types.some(type => type === pa.type))),
          map(filteredItems => this.pack(filteredItems))
        );
  }

}
