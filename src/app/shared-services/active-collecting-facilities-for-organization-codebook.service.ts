import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetFacilityTypeList } from 'src/api-chain/api/codebook.service';
import { FacilityService, ListFacilitiesForOrganization } from 'src/api-chain/api/facility.service';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { dbKey } from 'src/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ActiveCollectingFacilitiesForOrganizationCodebookService extends GeneralSifrantService<ChainFacility> {

  constructor(
    private chainFacilityService: FacilityService,
    private organizationId: string
  ) {
    super();
    this.initializeCodebook()
  }

  public identifier(el: ChainFacility) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainFacility) {
    return `${el.name}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListFacilitiesForOrganization.PartialParamMap

  public placeholder(): string {
    let placeholder = $localize`:@@activeCollectingFacility.input.placehoder:Select facility`;
    return placeholder;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainFacility>> {
    let lkey = key ? key.toLocaleLowerCase() : null
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ChainFacility>) => {
        return {
          results: allChoices.results.filter((x: ChainFacility) => lkey == null || x.name.toLocaleLowerCase().indexOf(lkey) >= 0),
          offset: allChoices.offset,
          limit: allChoices.limit,
          totalCount: allChoices.totalCount
        }
      })
    )
  }

  public initializeCodebook() {
    this.sifrant$ = this.sifrant$ || this.chainFacilityService.listOfCollectingFacilitiesForOrganizationByMap({...this.requestParams, organizationId: this.organizationId}).pipe(
      map(x => this.pack(x.data.items))
    )
  }

}

