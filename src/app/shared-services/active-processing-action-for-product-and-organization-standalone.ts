import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ChainProcessingAction } from 'src/api-chain/model/chainProcessingAction';
import { ProcessingActionService, ListProcessingActionsForProductAndOrganization } from 'src/api-chain/api/processingAction.service';
import { ApiResponsePaginatedListChainProcessingAction } from 'src/api-chain/model/apiResponsePaginatedListChainProcessingAction';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from './codebook-translations';

export class ActiveProcessingActionForProductAndOrganizationStandalone extends GeneralSifrantService<ChainProcessingAction> {

  constructor(
    private chainProcessingActionService: ProcessingActionService,
    private productId: string,
    private organizationId: string,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
    this.initializeCodebook();
  }

  public identifier(el: ChainProcessingAction) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainProcessingAction) {
    return this.codebookTranslations.translate(el, 'name')
    // return `${el.name}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
    productId: this.productId,
    organizationId: this.organizationId
  } as ListProcessingActionsForProductAndOrganization.PartialParamMap

  // public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainProcessingAction>> {
  //   let limit = params && params.limit ? params.limit : this.limit()
  //   let reqPars = {
  //     ...this.requestParams
  //   }
  //   let tmp = this.chainProcessingActionService.listProcessingActionsForProductAndOrganizationByMap(reqPars).pipe(
  //     map((res: ApiResponsePaginatedListChainProcessingAction) => {
  //       return {
  //         results: res.data.items,
  //         offset: 0,
  //         limit: limit,
  //         totalCount: res.data.count,
  //       }
  //     })
  //   )
  //   return tmp;
  // }

  public placeholder(): string {
    let placeholder = $localize`:@@activeProcessingAction.input.placehoder:Select processing action`;
    return placeholder;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainProcessingAction>> {
    let lkey = key ? key.toLocaleLowerCase() : null
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ChainProcessingAction>) => {
        return {
          results: allChoices.results.filter((x: ChainProcessingAction) => lkey == null || x.name.toLocaleLowerCase().indexOf(lkey) >= 0),
          offset: allChoices.offset,
          limit: allChoices.limit,
          totalCount: allChoices.totalCount
        }
      })
    )
  }

  public initializeCodebook() {
    this.sifrant$ = this.sifrant$ || this.chainProcessingActionService.listProcessingActionsForProductAndOrganizationByMap({ ...this.requestParams }).pipe(
      map(x => this.pack(x.data.items))
    )
  }

}

