import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { StockOrderService, ListStockForFacility } from 'src/api-chain/api/stockOrder.service';
import { dbKey } from 'src/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class StockOrdersForFacilitiesService extends GeneralSifrantService<ChainStockOrder> {

  constructor(
    private chainStockOrderService: StockOrderService,
    private facilityId: string,
    private balance,
    private isPurchaseOrder
  ) {
    super();
    this.initializeCodebook()
  }

  public identifier(el: ChainStockOrder) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainStockOrder) {
    return `${el.identifier}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListStockForFacility.PartialParamMap

  public placeholder(): string {
    let placeholder = $localize`:@@stockOrderForFacilities.input.placehoder:Select purchase`;
    return placeholder;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainStockOrder>> {
    let lkey = key ? key.toLocaleLowerCase() : null
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ChainStockOrder>) => {
        return {
          results: allChoices.results.filter((x: ChainStockOrder) => lkey == null || "ORDER".toLocaleLowerCase().indexOf(lkey) >= 0),
          offset: allChoices.offset,
          limit: allChoices.limit,
          totalCount: allChoices.totalCount
        }
      })
    )
  }

  public initializeCodebook() {
    this.sifrant$ = this.sifrant$ || this.chainStockOrderService.listStockForFacilityByMap({ ...this.requestParams, facilityId: this.facilityId, showPurchaseOrderOpenBalanceOnly: this.balance, purchaseOrderOnly: this.isPurchaseOrder}).pipe(
      map(x => this.pack(x.data.items))
    )
  }

}

