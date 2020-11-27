import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetFacilityTypeList } from 'src/api-chain/api/codebook.service';
import { FacilityService, ListFacilitiesForOrganization } from 'src/api-chain/api/facility.service';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from './codebook-translations';

@Injectable({
  providedIn: 'root'
})
export class ActiveFacilitiesForOrganizationCodebookService extends GeneralSifrantService<ChainFacility> {

  constructor(
    private chainFacilityService: FacilityService,
    private organizationId: string,
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

  // public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainFacility>> {
  //   let limit = params && params.limit ? params.limit : this.limit()
  //   let reqPars = {
  //     organizationId: this.organizationId,
  //     ...this.requestParams
  //   }
  //   let tmp = this.chainFacilityService.listFacilitiesForOrganizationByMap(reqPars).pipe(
  //     map((res: ApiResponsePaginatedListChainFacility) => {
  //       return {
  //         results: res.data.items,
  //         offset: 0,
  //         limit: limit,
  //         totalCount: res.data.count,
  //       }
  //     })
  //   )
  //   return tmp;
  // }

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
    this.sifrant$ = this.sifrant$ || this.chainFacilityService.listFacilitiesForOrganizationByMap({...this.requestParams, organizationId: this.organizationId}).pipe(
      map(x => this.pack(x.data.items))
    )
  }

}

