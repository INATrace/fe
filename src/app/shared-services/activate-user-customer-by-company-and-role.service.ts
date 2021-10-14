import { Injectable } from '@angular/core';
import { GeneralSifrantService } from './general-sifrant.service';
import { ApiUserCustomer } from '../../api/model/apiUserCustomer';
import {
  GetUserCustomerListForCompanyUsingGET,
  UserCustomerControllerService
} from '../../api/api/userCustomerController.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiPaginatedResponseApiUserCustomer } from '../../api/model/apiPaginatedResponseApiUserCustomer';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';

@Injectable({
  providedIn: 'root'
})
export class ActivateUserCustomerByCompanyAndRoleService extends GeneralSifrantService<ApiUserCustomer> {

  constructor(
      private userCustomerControllerService: UserCustomerControllerService,
      private companyId: string,
      private userCustomerType: string
  ) {
    super();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as any;

  public identifier(el: ApiUserCustomer) {
    return el.id;
  }

  public textRepresentation(el: ApiUserCustomer) {
    return `${el.name} ${el.surname}`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiUserCustomer>> {

    const limit = params && params.limit ? params.limit : this.limit();

    const reqPars = {
      ...this.requestParams,
      companyId: this.companyId,
      userCustomerType: this.userCustomerType
    };

    return this.userCustomerControllerService.getUserCustomerListForCompanyUsingGETByMap(reqPars).pipe(
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
