import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ApiCompanyCustomer } from '../../api/model/apiCompanyCustomer';
import { CompanyControllerService, GetCompanyCustomersList } from '../../api/api/companyController.service';
import { ApiPaginatedResponseApiCompanyCustomer } from '../../api/model/apiPaginatedResponseApiCompanyCustomer';

export class CompanyCustomersService extends GeneralSifrantService<ApiCompanyCustomer> {

  constructor(
    private companyCustomerController: CompanyControllerService,
    private companyId: number
  ) {
    super();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetCompanyCustomersList.PartialParamMap;

  public identifier(el: ApiCompanyCustomer) {
    return el.id;
  }

  public textRepresentation(el: ApiCompanyCustomer) {
    return `${el.name}`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiCompanyCustomer>> {
    const limit = params && params.limit ? params.limit : this.limit();
    const reqPars = {
      companyId: this.companyId,
      query: key,
      ...this.requestParams
    };

    return this.companyCustomerController.getCompanyCustomersListByMap(reqPars).pipe(
      map((res: ApiPaginatedResponseApiCompanyCustomer) => {
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
    return $localize`:@@activeCompanyCustomersByOrganization.input.placehoder:Select ...`;
  }

}
