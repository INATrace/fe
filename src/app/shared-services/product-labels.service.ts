import { GeneralSifrantService } from './general-sifrant.service';
import { ApiProductLabelBase } from '../../api/model/apiProductLabelBase';
import { ProductControllerService } from '../../api/api/productController.service';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';
import { map } from 'rxjs/operators';
import { ApiResponseListApiProductLabelBase } from '../../api/model/apiResponseListApiProductLabelBase';

export default class ProductLabelsService extends GeneralSifrantService<ApiProductLabelBase> {

  constructor(
    private productController: ProductControllerService,
    private productId: number
  ) {
    super();
  }

  public identifier(el: ApiProductLabelBase) {
    return el.id;
  }

  public textRepresentation(el: ApiProductLabelBase) {
    return `${el.title}`;
  }

  makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiProductLabelBase>> {

    return this.productController.getProductLabelsUsingGET(this.productId)
      .pipe(
        map((res: ApiResponseListApiProductLabelBase) => {
          return {
            results: res.data,
            offset: 0,
            limit: this.limit(),
            totalCount: res.data.length
          };
        })
      );
  }
}
