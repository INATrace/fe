import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { CodebookTranslations } from './codebook-translations';
import { GeneralSifrantService } from './general-sifrant.service';
import { ApiFacility } from '../../api/model/apiFacility';
import { FacilityControllerService, GetFacilityListUsingGET } from '../../api/api/facilityController.service';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesCodebookService extends GeneralSifrantService<ApiFacility> {

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetFacilityListUsingGET.PartialParamMap;

  constructor(
    private facilityController: FacilityControllerService,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
    this.initializeCodebook();
  }

  public identifier(el: ApiFacility) {
    return el.id;
  }

  public textRepresentation(el: ApiFacility) {
    return this.codebookTranslations.translate(el, 'name');
  }

  public placeholder(): string {
    return $localize`:@@activeFacility.input.placehoder:Select facility`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiFacility>> {
    const lkey = key ? key.toLocaleLowerCase() : null;
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ApiFacility>) => {
        return {
          results: allChoices.results.filter((x: ApiFacility) => lkey == null || x.name.toLocaleLowerCase().indexOf(lkey) >= 0),
          offset: allChoices.offset,
          limit: allChoices.limit,
          totalCount: allChoices.totalCount
        };
      })
    );
  }

  public initializeCodebook() {
    this.sifrant$ = this.sifrant$ || this.facilityController.getFacilityListUsingGETByMap({...this.requestParams}).pipe(
      map(x => this.pack(x.data.items))
    );
  }

}
