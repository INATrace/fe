import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from './codebook-translations';
import { GeneralSifrantService } from './general-sifrant.service';
import { FacilityControllerService } from '../../api/api/facilityController.service';
import { ApiFacility } from '../../api/model/apiFacility';

export class FacilitySemiProductsCodebookService extends GeneralSifrantService<ApiFacility> {

  constructor(
    private facilityController: FacilityControllerService,
    private facilityId: number,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
    this.initializeCodebook();
  }

  public identifier(el: ApiFacility) {
    return dbKey(el);
  }

  public textRepresentation(el: ApiFacility) {
    return this.codebookTranslations.translate(el, 'name');
  }

  public placeholder(): string {
    return $localize`:@@semiProductInFacility.input.placehoder:Select SKU`;
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
    this.sifrant$ = this.sifrant$ || this.facilityController.getFacility(this.facilityId).pipe(
      map(x => this.pack(x.data.facilitySemiProductList))
    );
  }

}

