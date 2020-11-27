import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { ChainSemiProduct } from 'src/api-chain/model/chainSemiProduct';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from './codebook-translations';
import { GeneralSifrantService } from './general-sifrant.service';

export class SemiProductInFacilityCodebookServiceStandalone extends GeneralSifrantService<ChainSemiProduct> {

  constructor(
    protected chainFacilityService: FacilityService,
    private facility: ChainFacility,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
    this.initializeCodebook()
  }

  public identifier(el: ChainSemiProduct) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainSemiProduct) {
    return this.codebookTranslations.translate(el, 'name')
    // return `${el.name}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  }

  public placeholder(): string {
    let placeholder = $localize`:@@semiProductInFacility.input.placehoder:Select SKU`;
    return placeholder;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainSemiProduct>> {
    let lkey = key ? key.toLocaleLowerCase() : null
    return this.sifrant$.pipe(
      map((allChoices: PagedSearchResults<ChainSemiProduct>) => {
        return {
          results: allChoices.results.filter((x: ChainSemiProduct) => lkey == null || x.name.toLocaleLowerCase().indexOf(lkey) >= 0),
          offset: allChoices.offset,
          limit: allChoices.limit,
          totalCount: allChoices.totalCount
        }
      })
    )
  }

  public initializeCodebook() {
    this.sifrant$ = this.sifrant$ || this.chainFacilityService.getFacilityById(dbKey(this.facility)).pipe(
      tap(x => console.log(x.data.semiProducts)),
      map(x => this.pack(x.data.semiProducts))
    )
  }

}

