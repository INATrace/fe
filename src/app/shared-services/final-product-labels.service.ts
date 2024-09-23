import { GeneralSifrantService } from './general-sifrant.service';
import { ApiProductLabelBase } from '../../api/model/apiProductLabelBase';
import { ProductControllerService } from '../../api/api/productController.service';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';
import { map } from 'rxjs/operators';
import { ApiResponseListApiProductLabelBase } from '../../api/model/apiResponseListApiProductLabelBase';

export class FinalProductLabelsService extends GeneralSifrantService<ApiProductLabelBase> {

  constructor(
    private productId: number,
    private finalProductId: number,
    private productController: ProductControllerService
  ) {
    super();
  }

  public identifier(el: ApiProductLabelBase) {
    return el.id;
  }

  public textRepresentation(el: ApiProductLabelBase) {
    return `${el.title}`;
  }

  public placeholder(): string {
    return $localize`:@@generateQrCodeModal.field.finalProductLabel.placeholder:Select final product label`;
  }

  makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiProductLabelBase>> {

    return this.productController.getFinalProductLabels(this.productId, this.finalProductId)
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
