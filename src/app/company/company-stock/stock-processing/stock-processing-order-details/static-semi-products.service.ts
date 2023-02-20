import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from '../../../../shared-services/general-sifrant.service';
import { ApiSemiProduct } from '../../../../../api/model/apiSemiProduct';

@Injectable({
  providedIn: 'root'
})
export class StaticSemiProductsService extends GeneralSifrantService<ApiSemiProduct> {

  constructor(
    private semiProducts: ApiSemiProduct[]
  ) {
    super();
  }

  public identifier(el: ApiSemiProduct) {
    return el.id;
  }

  public textRepresentation(el: ApiSemiProduct) {
    return `${el.name}`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiSemiProduct>> {

    return of({
      results: this.semiProducts,
      offset: 0,
      limit: 100,
      totalCount: this.semiProducts.length
    });
  }

  public placeholder(): string {
    return $localize`:@@activeSemiProduct.input.placehoder:Select Semi-product`;
  }

}

