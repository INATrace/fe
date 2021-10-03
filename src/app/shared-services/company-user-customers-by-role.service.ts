import { GeneralSifrantService } from './general-sifrant.service';
import { ApiUserCustomer } from '../../api/model/apiUserCustomer';
import { GetUserCustomerListForCompanyAndTypeUsingGET, ProductControllerService } from '../../api/api/productController.service';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';
import { map } from 'rxjs/operators';
import { ApiPaginatedResponseApiUserCustomer } from '../../api/model/apiPaginatedResponseApiUserCustomer';

export class CompanyUserCustomersByRoleService extends GeneralSifrantService<ApiUserCustomer> {

  constructor(
    private productControllerService: ProductControllerService,
    private companyId: number,
    private role: string
  ) {
    super();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetUserCustomerListForCompanyAndTypeUsingGET.PartialParamMap;

  identifier(el: ApiUserCustomer) {
    return el.id;
  }

  textRepresentation(el: ApiUserCustomer): string {
    return `${el.name} ${el.surname}`;
  }

  makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiUserCustomer>> {

    const limit = params && params.limit ? params.limit : this.limit();
    const reqParams: GetUserCustomerListForCompanyAndTypeUsingGET.PartialParamMap = {
      companyId: this.companyId,
      type: this.role,
      ...this.requestParams
    };

    return this.productControllerService.getUserCustomerListForCompanyAndTypeUsingGETByMap(reqParams)
      .pipe(
        map((res: ApiPaginatedResponseApiUserCustomer) => {
          return {
            results: res.data.items,
            offset: 0,
            limit,
            totalCount: res.data.count
          };
        })
      );
  }

  public placeholder(): string {
    return $localize`:@@activeUserCustomersByOrganizationAndRole.input.placehoder:Select ...`;
  }

}
