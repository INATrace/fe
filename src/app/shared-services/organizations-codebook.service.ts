import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ListOrganizations, OrganizationService } from 'src/api-chain/api/organization.service';
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
    this.initializeCodebook();
  }

  requestParams = {
    limit: 1000,
    offset: 0
  } as ListOrganizations.PartialParamMap;

  public identifier(el: ChainOrganization) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainOrganization) {
    return `${el.name}`;
  }

  public placeholder(): string {
    return $localize`:@@organization.input.placehoder:Select organization`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainOrganization>> {
    const lkey = key ? key.toLocaleLowerCase() : null;
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ChainOrganization>) => {
        return {
          results: allChoices.results.filter((x: ChainOrganization) => lkey == null || x.name.toLocaleLowerCase().indexOf(lkey) >= 0),
          offset: allChoices.offset,
          limit: allChoices.limit,
          totalCount: allChoices.totalCount
        };
      })
    );
  }

  public initializeCodebook() {
    this.sifrant$ = this.sifrant$ || this.chainOrganizationService.listOrganizationsByMap(this.requestParams).pipe(
      map(x => this.pack(x.data.items))
    );
  }
}

