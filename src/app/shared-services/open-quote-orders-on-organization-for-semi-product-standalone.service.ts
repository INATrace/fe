import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListQuoteOrders, StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from './codebook-translations';
import { GeneralSifrantService } from './general-sifrant.service';

export class OpenQuoteOrdersOnOrganizationForSemiProductStandaloneService extends GeneralSifrantService<ChainStockOrder> {

  constructor(
    private chainStockOrderService: StockOrderService,
    private organizationId: string,
    private semiProductId: string,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
    this.initializeCodebook()
  }

  public identifier(el: ChainStockOrder) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainStockOrder) {
    // return this.codebookTranslations.translate(el, 'name')
    return el.internalLotNumber || dbKey(el)
    // return `${el.name}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListQuoteOrders.PartialParamMap

  // public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainStockOrder>> {
  //   let limit = params && params.limit ? params.limit : this.limit()
  //   let reqPars = {
  //     organizationId: this.organizationId,
  //     ...this.requestParams
  //   }
  //   let tmp = this.chainFacilityService.listFacilitiesForOrganizationByMap(reqPars).pipe(
  //     map((res: ApiResponsePaginatedListChainFacility) => {
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
    let placeholder = $localize`:@@activeFacility.input.placehoder:Select facility`;
    return placeholder;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainStockOrder>> {
    let lkey = key ? key.toLocaleLowerCase() : null
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ChainStockOrder>) => {
        return {
          results: allChoices.results.filter((x: ChainStockOrder) => lkey == null || this.textRepresentation(x).toLocaleLowerCase().indexOf(lkey) >= 0),
          offset: allChoices.offset,
          limit: allChoices.limit,
          totalCount: allChoices.totalCount
        }
      })
    )
  }

  public initializeCodebook() {
    this.sifrant$ = this.sifrant$ || this.chainStockOrderService.listQuoteOrdersByMap({
      ...this.requestParams,
      facilityOrOrganizationId: this.organizationId,
      mode: 'organization',
      semiProductId: this.semiProductId,
      openOnly: true
    }).pipe(
      map(x => this.pack(x.data.items))
    )
  }

}

