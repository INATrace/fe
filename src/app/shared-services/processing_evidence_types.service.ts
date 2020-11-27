import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ChainProcessingEvidenceType } from 'src/api-chain/model/chainProcessingEvidenceType';
import { CodebookService, GetProcessingEvidenceTypeList } from 'src/api-chain/api/codebook.service';
import { ApiResponsePaginatedListChainProcessingEvidenceType } from 'src/api-chain/model/apiResponsePaginatedListChainProcessingEvidenceType';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from './codebook-translations';

@Injectable({
  providedIn: 'root'
})
export class ProcessingEvidenceTypeaService extends GeneralSifrantService<ChainProcessingEvidenceType> {

  constructor(
    private chainCodebookService: CodebookService,
    protected codebookTranslations: CodebookTranslations,
    private type: string
  ) {
    super();
  }

  public identifier(el: ChainProcessingEvidenceType) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainProcessingEvidenceType) {
    return this.codebookTranslations.translate(el, 'label')
    // return `${el.label}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetProcessingEvidenceTypeList.PartialParamMap

  public makeQuery(key: string, params?: any, productId?: string): Observable<PagedSearchResults<ChainProcessingEvidenceType>> {
    let limit = params && params.limit ? params.limit : this.limit()
    let reqPars = {
      productId,
      ...this.requestParams
    }
    let lkey = key ? key.toLocaleLowerCase() : null
    let tmp = this.chainCodebookService.getProcessingEvidenceTypeListByMap(reqPars).pipe(
      map((res: ApiResponsePaginatedListChainProcessingEvidenceType) => {
        let results = res.data.items;
        if (this.type) results = res.data.items.filter(c => c.type == this.type)
        return {
          results: results.filter((x: ChainProcessingEvidenceType) => lkey == null || x.label.toLocaleLowerCase().indexOf(lkey) >= 0),
          offset: 0,
          limit: limit,
          totalCount: results.length,
        }
      })
    )
    return tmp;
  }



  // public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainProcessingAction>> {
  //   let lkey = key ? key.toLocaleLowerCase() : null
  //   return this.sifrant$.pipe(
  //     map((allChoices: PagedSearchResults<ChainProcessingAction>) => {
  //       return {
  //         results: allChoices.results.filter((x: ChainProcessingAction) => lkey == null || x.name.toLocaleLowerCase().indexOf(lkey) >= 0),
  //         offset: allChoices.offset,
  //         limit: allChoices.limit,
  //         totalCount: allChoices.totalCount
  //       }
  //     })
  //   )
  // }

  // public initializeCodebook() {
  //   this.sifrant$ = this.sifrant$ || this.chainProcessingActionService.listProcessingActionsForProductAndOrganizationByMap({ ...this.requestParams }).pipe(
  //     map(x => this.pack(x.data.items))
  //   )
  // }


  public placeholder(): string {
    let placeholder = $localize`:@@processingEvidenceType.input.placehoder:Select document type`;
    return placeholder;
  }

}

