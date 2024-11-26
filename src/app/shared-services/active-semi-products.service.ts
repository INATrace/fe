import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { CodebookTranslations } from './codebook-translations';
import { GetSemiProductList, SemiProductControllerService } from '../../api/api/semiProductController.service';
import { ApiSemiProduct } from '../../api/model/apiSemiProduct';
import { ApiPaginatedResponseApiSemiProduct } from '../../api/model/apiPaginatedResponseApiSemiProduct';

@Injectable({
  providedIn: 'root'
})
export class ActiveSemiProductsService extends GeneralSifrantService<ApiSemiProduct> {

  constructor(
    private codebookService: SemiProductControllerService,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetSemiProductList.PartialParamMap;

  public identifier(el: ApiSemiProduct) {
    return el.id;
  }

  public textRepresentation(el: ApiSemiProduct) {
    return `${el.name} (${el.measurementUnitType?.label ?? '/'})`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiSemiProduct>> {
    const limit = params && params.limit ? params.limit : this.limit();
    return this.codebookService.getSemiProductListByMap(this.requestParams).pipe(
      map((res: ApiPaginatedResponseApiSemiProduct) => {
        return {
          results: res.data.items,
          offset: 0,
          limit,
          totalCount: res.data.count,
        };
      })
    );
  }

  public placeholder(): string {
    return $localize`:@@activeSemiProduct.input.placehoder:Select Semi-product`;
  }

}

