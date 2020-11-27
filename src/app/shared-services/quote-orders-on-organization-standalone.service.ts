import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListQuoteOrders, StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { dbKey } from 'src/shared/utils';
import { GeneralSifrantService } from './general-sifrant.service';

export class QuoteOrdersOnOrganizationStandaloneService extends GeneralSifrantService<ChainStockOrder> {

  constructor(
    private chainStockOrderService: StockOrderService,
    private organizationId: string,
    private productionDateStart: string,
    private productionDateEnd: string
  ) {
    super();
    this.initializeCodebook()
  }

  public identifier(el: ChainStockOrder) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainStockOrder) {
    return el.internalLotNumber || dbKey(el)
  }

  requestParams = {
    limit: 1000,
    offset: 0,
    facilityOrOrganizationId: this.organizationId,
    mode: 'organization',
    openOnly: false,
    productionDateStart: this.productionDateStart,
    productionDateEnd: this.productionDateEnd,
    sortBy: 'productionDate'
  } as ListQuoteOrders.PartialParamMap

  public placeholder(): string {
    let placeholder = $localize`:@@quoteOrdersOnOrganization.input.placehoder:Select order`;
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
    this.sifrant$ = this.sifrant$ || this.chainStockOrderService.listQuoteOrdersByMap({ ...this.requestParams }).pipe(
      map(x => this.pack(x.data.items))
    )
  }


}

