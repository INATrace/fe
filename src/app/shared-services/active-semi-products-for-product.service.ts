import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ChainSemiProduct } from 'src/api-chain/model/chainSemiProduct';
import { ApiResponsePaginatedListChainSemiProduct } from 'src/api-chain/model/apiResponsePaginatedListChainSemiProduct';
import { SemiProductService, ListSemiProductsForProduct } from 'src/api-chain/api/semiProduct.service';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from './codebook-translations';

@Injectable({
  providedIn: 'root'
})
export class ActiveSemiProductsForProductService extends GeneralSifrantService<ChainSemiProduct> {

  constructor(
    private chainSemiProductService: SemiProductService,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
  }

  public identifier(el: ChainSemiProduct) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainSemiProduct) {
    return this.codebookTranslations.translate(el, 'name')
    // return `${el.name}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListSemiProductsForProduct.PartialParamMap

  public makeQuery(key: string, params?: any, productId?:string): Observable<PagedSearchResults<ChainSemiProduct>> {
    let limit = params && params.limit ? params.limit : this.limit()
    let reqPars = {
      productId,
      ...this.requestParams
    }
    let tmp = this.chainSemiProductService.listSemiProductsForProductByMap(reqPars).pipe(
      map((res: ApiResponsePaginatedListChainSemiProduct) => {
        return {
          results: res.data.items,
          offset: 0,
          limit: limit,
          totalCount: res.data.count,
        }
      })
    )
    return tmp;
  }

  public placeholder(): string {
    let placeholder = $localize`:@@activeSemiProduct.input.placehoder:Select SemiProduct`;
    return placeholder;
  }

}

