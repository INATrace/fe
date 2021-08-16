import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { CodebookTranslations } from './codebook-translations';
import { ApiProcessingEvidenceType } from '../../api/model/apiProcessingEvidenceType';
import {
  GetProcessingEvidenceTypeListUsingGET,
  ProcessingEvidenceTypeControllerService
} from '../../api/api/processingEvidenceTypeController.service';
import { ApiPaginatedResponseApiProcessingEvidenceType } from '../../api/model/apiPaginatedResponseApiProcessingEvidenceType';

@Injectable({
  providedIn: 'root'
})
export class ProcessingEvidenceTypeService extends GeneralSifrantService<ApiProcessingEvidenceType> {

  constructor(
    private chainCodebookService: ProcessingEvidenceTypeControllerService,
    protected codebookTranslations: CodebookTranslations,
    private type: string
  ) {
    super();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetProcessingEvidenceTypeListUsingGET.PartialParamMap;

  public identifier(el: ApiProcessingEvidenceType) {
    return el.id;
  }

  public textRepresentation(el: ApiProcessingEvidenceType) {
    return this.codebookTranslations.translate(el, 'label');
  }

  public makeQuery(key: string, params?: any, productId?: string): Observable<PagedSearchResults<ApiProcessingEvidenceType>> {
    const limit = params && params.limit ? params.limit : this.limit();
    const reqPars = {
      productId,
      ...this.requestParams
    };

    const lkey = key ? key.toLocaleLowerCase() : null;
    return this.chainCodebookService.getProcessingEvidenceTypeListUsingGETByMap(reqPars).pipe(
        map((res: ApiPaginatedResponseApiProcessingEvidenceType) => {
          let results = res.data.items;
          if (this.type) {
            results = res.data.items.filter(c => c.type === this.type);
          }

          return {
            results: results.filter((x: ApiProcessingEvidenceType) => lkey == null || x.label.toLocaleLowerCase().indexOf(lkey) >= 0),
            offset: 0,
            limit,
            totalCount: results.length,
          };
        })
    );
  }

  public placeholder(): string {
    return $localize`:@@processingEvidenceType.input.placehoder:Select document type`;
  }

}
