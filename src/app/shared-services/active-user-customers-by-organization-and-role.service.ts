import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { GetFacilityTypeList } from 'src/api-chain/api/codebook.service';
import { UserCustomerService } from 'src/api-chain/api/userCustomer.service';
import { ChainUserCustomer } from 'src/api-chain/model/chainUserCustomer';
import { ApiResponsePaginatedListChainUserCustomer } from 'src/api-chain/model/apiResponsePaginatedListChainUserCustomer';
import { dbKey } from 'src/shared/utils';

export class ActiveUserCustomersByOrganizationAndRoleService extends GeneralSifrantService<ChainUserCustomer> {

  constructor(
    private chainUserCustomerService: UserCustomerService,
    private organizationId: string,
    private role: string
  ) {
    super();
  }

  public identifier(el: ChainUserCustomer) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainUserCustomer) {
    const cell = el.location ? (el.location.cell ? el.location.cell.substring(0,2).toLocaleUpperCase() : "--") : "--";
    const village = el.location ? (el.location.village ? el.location.village.substring(0,2).toLocaleUpperCase() : "--") : "--";
    return `${el.name} ${el.surname} (${el.userCustomerId}, ${village}-${cell})`;
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetFacilityTypeList.PartialParamMap

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainUserCustomer>> {
    let limit = params && params.limit ? params.limit : this.limit()
    let reqPars = {
      organizationId: this.organizationId,
      role: this.role,
      query: key,
      queryBy: 'ALL',
      ...this.requestParams
    }
    let tmp = this.chainUserCustomerService.listUserCustomersForOrganizationAndRoleByMap(reqPars).pipe(
      map((res: ApiResponsePaginatedListChainUserCustomer) => {
        return {
          results: res.data.items,
          offset: 0,
          limit: limit,
          totalCount: res.data.count,
        }
      })
    )
    return tmp;
  }

  public placeholder(): string {
    let placeholder = $localize`:@@activeUserCustomersByOrganizationAndRole.input.placehoder:Select ...`;
    return placeholder;
  }

}

