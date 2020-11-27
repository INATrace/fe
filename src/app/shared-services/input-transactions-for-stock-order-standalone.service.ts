import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { StockOrderService, ListStockForFacility } from 'src/api-chain/api/stockOrder.service';
import { dbKey } from 'src/shared/utils';
import { ChainTransaction } from 'src/api-chain/model/chainTransaction';
import { TransactionService } from 'src/api-chain/api/transaction.service';

@Injectable({
  providedIn: 'root'
})
export class InputTransactionsForStockOrderStandalone extends GeneralSifrantService<ChainTransaction> {

  constructor(
    private chainTransactionService: TransactionService,
    private stockOrderId: string
  ) {
    super();
    this.initializeCodebook()
  }

  public identifier(el: ChainTransaction) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainTransaction) {
    return `${el.inputQuantity}` + " " + `${el.inputMeasureUnitType?.label}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListStockForFacility.PartialParamMap

  public placeholder(): string {
    let placeholder = $localize`:@@inputTransactionsForStockOrder.input.placehoder:Select transaction`;
    return placeholder;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainTransaction>> {
    let lkey = key ? key.toLocaleLowerCase() : null
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ChainTransaction>) => {
        return {
          results: allChoices.results.filter((x: ChainTransaction) => x.status != 'CANCELED'),
          offset: allChoices.offset,
          limit: allChoices.limit,
          totalCount: allChoices.totalCount
        }
      })
    )
  }

  public initializeCodebook() {
    this.sifrant$ = this.sifrant$ || this.chainTransactionService.listInputTransactionsForProductUnitIdByMap({ ...this.requestParams, stockOrderId: this.stockOrderId }).pipe(
      map(x => this.pack(x.data.items))
    )
  }

}

