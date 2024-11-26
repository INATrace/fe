import { GeneralSifrantService } from './general-sifrant.service';
import { ApiCompanyListResponse } from '../../api/model/apiCompanyListResponse';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';
import { map } from 'rxjs/operators';
import { CompanyControllerService } from '../../api/api/companyController.service';

export class ConnectedCompaniesForCompanyService extends GeneralSifrantService<ApiCompanyListResponse> {

  constructor(
    private companyController: CompanyControllerService,
    private companyId: number
  ) {
    super();
  }

  public identifier(el: ApiCompanyListResponse) {
    return el.id;
  }

  public textRepresentation(el: ApiCompanyListResponse) {
    return `${el.name}`;
  }

  public placeholder(): string {
    return $localize`:@@associatedCompaniesService.input.placehoder:Select client`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiCompanyListResponse>> {

    const limit = params && params.limit ? params.limit : this.limit();
    return this.companyController.getConnectedCompanies(this.companyId).pipe(
      map(resp => {
        return {
          results: resp.data.items,
          offset: 0,
          limit,
          totalCount: resp.data.items.length
        };
      })
    );
  }

}
