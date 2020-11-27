import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListFacilitiesForOrganization } from 'src/api-chain/api/facility.service';
import { ProcessingActionService } from 'src/api-chain/api/processingAction.service';
import { ChainProcessingAction } from 'src/api-chain/model/chainProcessingAction';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from './codebook-translations';
import { GeneralSifrantService } from './general-sifrant.service';

export class OrderProcessiongActionsForProductAndOrganizationStandaloneService extends GeneralSifrantService<ChainProcessingAction> {

  constructor(
    private processingActionService: ProcessingActionService,
    private productId: string,
    private organizationId: string,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
    this.initializeCodebook()
  }

  public identifier(el: ChainProcessingAction) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainProcessingAction) {
    return this.codebookTranslations.translate(el.inputSemiProduct, 'name') + ` (${this.codebookTranslations.translate(el, 'name')})`
    // return `${el.name}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListFacilitiesForOrganization.PartialParamMap


  public placeholder(): string {
    let placeholder = $localize`:@@orderProcessingActionsForProductAndOrganization.input.placehoder:Select SKU`;
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
    this.sifrant$ = this.sifrant$ || this.processingActionService.listProcessingActionsForProductAndOrganizationByMap({productId: this.productId, organizationId: this.organizationId, skuOnly: true}).pipe(
      map(x => this.pack(x.data.items))
    )
  }

}

