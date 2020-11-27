import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FacilityService, ListFacilitiesForOrganizationAndSemiProduct } from 'src/api-chain/api/facility.service';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ApiResponsePaginatedListChainFacility } from 'src/api-chain/model/apiResponsePaginatedListChainFacility';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from './codebook-translations';

@Injectable({
  providedIn: 'root'
})
export class ActiveSellingFacilitiesForOrganizationAndSemiProductIdStandaloneService extends GeneralSifrantService<ChainFacility> {

  constructor(
    private chainFacilityService: FacilityService,
    private organizationId: string,
    private semiProductId: string,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
    this.initializeCodebook();
  }

  public identifier(el: ChainFacility) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainFacility) {
    // console.log("EEL:", el)
    return this.codebookTranslations.translate(el, 'name') + ` (${el.organization.name})`
    // return `${el.name}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
    organizationId: this.organizationId,
    semiProductId: this.semiProductId
  } as ListFacilitiesForOrganizationAndSemiProduct.PartialParamMap

  public placeholder(): string {
    let placeholder = $localize`:@@activeFacilityForOrganizationAndSemiProduct.input.placehoder:Select facility`;
    return placeholder;
  }

  // public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainFacility>> {
  //   return this.sifrant$.pipe(
  //     map((allChoices: PagedSearchResults<ChainFacility>) => {
  //       return {
  //         results: allChoices.results,
  //         offset: allChoices.offset,
  //         limit: allChoices.limit,
  //         totalCount: allChoices.totalCount
  //       }
  //     })
  //   )

  // }

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
    this.sifrant$ = this.sifrant$ || this.chainFacilityService.listSellingFacilitiesForOrganizationAndSemiProductByMap({ ...this.requestParams }).pipe(
      map(x => this.pack(x.data.items))
    )
  }

}

