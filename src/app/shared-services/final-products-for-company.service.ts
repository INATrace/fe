import { GeneralSifrantService } from './general-sifrant.service';
import { ApiFinalProduct } from '../../api/model/apiFinalProduct';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';
import { FinalProductControllerService, GetFinalProductsForCompany } from '../../api/api/finalProductController.service';
import { map } from 'rxjs/operators';
import { ApiPaginatedResponseApiFinalProduct } from '../../api/model/apiPaginatedResponseApiFinalProduct';

export class FinalProductsForCompanyService extends GeneralSifrantService<ApiFinalProduct> {

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetFinalProductsForCompany.PartialParamMap;

  constructor(
    private finalProductController: FinalProductControllerService,
    private companyId: number
  ) {
    super();
  }

  public identifier(el: ApiFinalProduct) {
    return el.id;
  }

  public textRepresentation(el: ApiFinalProduct) {
    return `${el.name} (${el.product.name})`;
  }

  public placeholder(): string {
    return $localize`:@@finalProduct.input.placeholder:Select final product`;
  }

  makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiFinalProduct>> {

    const limit = params && params.limit ? params.limit : this.limit();
    const reqParams: GetFinalProductsForCompany.PartialParamMap = {
      companyId: this.companyId,
      ...this.requestParams
    };

    return this.finalProductController.getFinalProductsForCompanyByMap(reqParams)
      .pipe(
        map((res: ApiPaginatedResponseApiFinalProduct) => {
          return {
            results: res.data.items,
            offset: 0,
            limit,
            totalCount: res.data.count
          };
        })
      );
  }

}
