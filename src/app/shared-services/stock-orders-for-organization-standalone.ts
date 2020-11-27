import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { ApiResponsePaginatedListChainStockOrder } from 'src/api-chain/model/apiResponsePaginatedListChainStockOrder';
import { dbKey, formatDateWithDots } from 'src/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class StockOrdersForOrganizationStandalone extends GeneralSifrantService<ChainStockOrder> {

  constructor(
    private chainStockOrderService: StockOrderService,
    private isPurchaseOrder,
    private showPurchaseOrderOpenBalanceOnly,
    private organizationId,
    private farmerId,
    private womenShare
  ) {
    super();
  }

  public setWomenShare(womenShare: number) {
    this.womenShare = womenShare
  }

  public identifier(el: ChainStockOrder) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainStockOrder) {
    return `${this.formatDate(el.productionDate)}`
  }

  public placeholder(): string {
    let placeholder = $localize`:@@stockOrdersForOrganization.input.placehoder:Select purchase`;
    return placeholder;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainStockOrder>> {

    let tmp = this.chainStockOrderService.listStockOrdersForOrganizationByMap({ organizationId: this.organizationId, purchaseOrderOnly: this.isPurchaseOrder, showPurchaseOrderOpenBalanceOnly: this.showPurchaseOrderOpenBalanceOnly, farmerId: this.farmerId}).pipe(
      map((res: ApiResponsePaginatedListChainStockOrder) => {
        let items = res.data.items
        if (items && this.womenShare == 0) {
          items = items.filter(i => i.womenShare == 0)
        }
        if (items && this.womenShare == 1) {
          items = items.filter(i => i.womenShare == 1)
        }
        return {
          results: items,
          totalCount: items.length,
          offset: 0,
          limit: undefined
        }
      })
    )
    return tmp;

  }

  formatDate(productionDate) {
    if (productionDate) return formatDateWithDots(productionDate);
    return "";
  }

}

