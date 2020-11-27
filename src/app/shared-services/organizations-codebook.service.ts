import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { ApiResponsePaginatedListChainFacility } from 'src/api-chain/model/apiResponsePaginatedListChainFacility';
import { GetFacilityTypeList } from 'src/api-chain/api/codebook.service';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { OrganizationService, ListOrganizations } from 'src/api-chain/api/organization.service';
import { ApiResponsePaginatedListChainOrganization } from 'src/api-chain/model/apiResponsePaginatedListChainOrganization';
import { ChainOrganization } from 'src/api-chain/model/chainOrganization';
import { dbKey } from 'src/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsCodebookService extends GeneralSifrantService<ChainOrganization> {

  constructor(
    private chainOrganizationService: OrganizationService
  ) {
    super();
    this.initializeCodebook()
  }

  public identifier(el: ChainOrganization) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainOrganization) {
    return `${el.name}`
  }

  requestParams = {
    limit: 1000,
    offset: 0
  } as ListOrganizations.PartialParamMap

  public placeholder(): string {
    let placeholder = $localize`:@@organization.input.placehoder:Select organization`;
    return placeholder;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainOrganization>> {
    let lkey = key ? key.toLocaleLowerCase() : null
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ChainOrganization>) => {
        return {
          results: allChoices.results.filter((x: ChainOrganization) => lkey == null || x.name.toLocaleLowerCase().indexOf(lkey) >= 0),
          offset: allChoices.offset,
          limit: allChoices.limit,
          totalCount: allChoices.totalCount
        }
      })
    )
  }

  public initializeCodebook() {
    this.sifrant$ = this.sifrant$ || this.chainOrganizationService.listOrganizationsByMap(this.requestParams).pipe(
      map(x => this.pack(x.data.items))
    )
  }
}

