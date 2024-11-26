import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ApiProductType } from '../../api/model/apiProductType';
import { ApiPaginatedResponseApiProductType } from '../../api/model/apiPaginatedResponseApiProductType';
import { GetProductTypes, ProductTypeControllerService } from '../../api/api/productTypeController.service';

@Injectable({
  providedIn: 'root'
})
export class ProductTypesService extends GeneralSifrantService<ApiProductType> {

  constructor(
    private codebookService: ProductTypeControllerService
  ) {
    super();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetProductTypes.PartialParamMap;

  public identifier(el: ApiProductType) {
    return el.id;
  }

  public textRepresentation(el: ApiProductType) {
    return `${el.name}`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiProductType>> {
    const limit = params && params.limit ? params.limit : this.limit();

    return this.codebookService.getProductTypesByMap(this.requestParams).pipe(
      map((res: ApiPaginatedResponseApiProductType) => {
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
    return $localize`:@@productTypes.input.placehoder:Select product types`;
  }

}

