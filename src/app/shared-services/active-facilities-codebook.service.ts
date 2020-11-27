import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FacilityService, ListFacilitiesForOrganization } from 'src/api-chain/api/facility.service';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from './codebook-translations';
import { GeneralSifrantService } from './general-sifrant.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveFacilitiesCodebookService extends GeneralSifrantService<ChainFacility> {

  constructor(
    private chainFacilityService: FacilityService,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
    this.initializeCodebook()
  }

  public identifier(el: ChainFacility) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainFacility) {
    return this.codebookTranslations.translate(el, 'name')
    // return `${el.name}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListFacilitiesForOrganization.PartialParamMap

  public placeholder(): string {
    let placeholder = $localize`:@@activeFacility.input.placehoder:Select facility`;
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
    this.sifrant$ = this.sifrant$ || this.chainFacilityService.listFacilitiesByMap({...this.requestParams}).pipe(
      map(x => this.pack(x.data.items))
    )
  }

}

