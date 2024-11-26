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

export class CompanyQuoteProcActionsForFacilityService extends GeneralSifrantService<ApiProcessingAction> {

  private requestParams = {
    limit: 1000,
    offset: 0,
    id: this.companyId,
    actionType: 'SHIPMENT'
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
    return `${el.name}`;
  }

  public placeholder(): string {
    return $localize`:@@company.orders.placedOrders.placeQuoteOrderModal.field.orderTemplate.placeholder:Select quote order template`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiProcessingAction>> {
    const queryString = key ? key.toLocaleLowerCase() : null;
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ApiProcessingAction>) => {
        return {
          results: allChoices.results.filter((x: ApiProcessingAction) => queryString == null || x.name.toLocaleLowerCase().indexOf(queryString) >= 0),
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
          map(x => {

            let actions = x.data?.items ?? [];

            // Filter the quote order proc. actions that are supported for the selected facility and semi or final product
            actions = actions.filter(procAction => {

              if (procAction.supportedFacilities?.length > 0 && procAction.supportedFacilities.findIndex(sf => sf.id === this.facility.id) === -1) {
                return false;
              }

              return !!this.facility.facilitySemiProductList.find(fsp => fsp.id === procAction.inputSemiProduct?.id);
            });

            return this.pack(actions);
          })
        );
  }

}
