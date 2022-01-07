import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListSemiProductsForProduct, SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { ChainSemiProduct } from 'src/api-chain/model/chainSemiProduct';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from './codebook-translations';
import { GeneralSifrantService } from './general-sifrant.service';

export class ActiveSemiProductsForProductServiceStandalone extends GeneralSifrantService<ChainSemiProduct> {

  constructor(
    private chainSemiProductService: SemiProductService,
    private productId: string,
    private codebookTranslations: CodebookTranslations
  ) {
    super();
    this.initializeCodebook()
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

  // public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainSemiProduct>> {
  //   let limit = params && params.limit ? params.limit : this.limit()
  //   let reqPars = {
  //     productId: this.productId,
  //     ...this.requestParams
  //   }
  //   let tmp = this.chainSemiProductService.listSemiProductsForProductByMap(reqPars).pipe(
  //     map((res: ApiResponsePaginatedListChainSemiProduct) => {
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
    let placeholder = $localize`:@@activeSemiProduct.input.placehoder:Select Semi-product`;
    return placeholder;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainSemiProduct>> {
    let lkey = key ? key.toLocaleLowerCase() : null
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ChainSemiProduct>) => {
        return {
          results: allChoices.results.filter((x: ChainSemiProduct) => lkey == null || x.name.toLocaleLowerCase().indexOf(lkey) >= 0),
          offset: allChoices.offset,
          limit: allChoices.limit,
          totalCount: allChoices.totalCount
        }
      })
    )
  }

  public initializeCodebook() {
    this.sifrant$ = this.sifrant$ || this.chainSemiProductService.listSemiProductsForProductByMap({...this.requestParams, productId: this.productId}).pipe(
      map(x => this.pack(x.data.items))
    )
  }
}

