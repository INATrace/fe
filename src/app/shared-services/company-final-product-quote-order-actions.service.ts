import { GeneralSifrantService } from './general-sifrant.service';
import { ApiProcessingAction } from '../../api/model/apiProcessingAction';
import {
  ListProcessingActionsByCompany,
  ProcessingActionControllerService
} from '../../api/api/processingActionController.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';
import { ApiFacility } from '../../api/model/apiFacility';

export class CompanyFinalProductQuoteOrderActionsService extends GeneralSifrantService<ApiProcessingAction> {

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListProcessingActionsByCompany.PartialParamMap;

  constructor(
    private processingActionController: ProcessingActionControllerService,
    private companyId: number,
    private facility: ApiFacility
  ) {
    super();
    this.initializeCodebook();
  }

  public identifier(el: ApiProcessingAction) {
    return el.id;
  }

  public textRepresentation(el: ApiProcessingAction) {
    return el.inputFinalProduct.name + ` (${el.name})`;
  }

  public placeholder(): string {
    return $localize`:@@orderProcessingActionsForProductAndOrganization.input.placehoder:Select SKU`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiProcessingAction>> {
    const lkey = key ? key.toLocaleLowerCase() : null;
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ApiProcessingAction>) => {
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
    this.sifrant$ = this.sifrant$ || this.processingActionController
      .listProcessingActionsByCompanyByMap({ ...this.requestParams, id: this.companyId, actionType: 'SHIPMENT', onlyFinalProducts: true })
      .pipe(
        map(resp => resp.data.items.filter(procAction => this.facility.facilityFinalProducts.some(ffp => ffp.id === procAction.inputFinalProduct?.id))),
        map(filteredProcActions => this.pack(filteredProcActions))
      );
  }

}
