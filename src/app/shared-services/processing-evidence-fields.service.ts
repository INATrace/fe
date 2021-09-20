import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';
import { map } from 'rxjs/operators';
import { GeneralSifrantService } from './general-sifrant.service';
import { CodebookTranslations } from './codebook-translations';
import {
  GetProcessingEvidenceFieldListUsingGET,
  ProcessingEvidenceFieldControllerService
} from '../../api/api/processingEvidenceFieldController.service';
import { ApiPaginatedResponseApiProcessingEvidenceField } from '../../api/model/apiPaginatedResponseApiProcessingEvidenceField';
import { ApiProcessingEvidenceField } from '../../api/model/apiProcessingEvidenceField';

@Injectable({
  providedIn: 'root'
})
export class ProcessingEvidenceFieldsService extends GeneralSifrantService<ApiProcessingEvidenceField>{

  constructor(
      private codebookService: ProcessingEvidenceFieldControllerService,
      protected codebookTranslations: CodebookTranslations,
      private type: string
  ) {
    super();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetProcessingEvidenceFieldListUsingGET.PartialParamMap;

  public identifier(el: ApiProcessingEvidenceField) {
    return el.id;
  }

  public textRepresentation(el: ApiProcessingEvidenceField) {
    return this.codebookTranslations.translate(el, 'label');
  }

  public makeQuery(key: string, params?: any, productId?: string): Observable<PagedSearchResults<ApiProcessingEvidenceField>> {
    const limit = params && params.limit ? params.limit : this.limit();
    const reqPars = {
      productId,
      ...this.requestParams
    };

    const lkey = key ? key.toLocaleLowerCase() : null;
    return this.codebookService.getProcessingEvidenceFieldListUsingGETByMap(reqPars).pipe(
        map((res: ApiPaginatedResponseApiProcessingEvidenceField) => {
          let results = res.data.items;
          if (this.type) {
            results = res.data.items.filter(c => c.type === this.type);
          }

          return {
            results: results.filter((x: ApiProcessingEvidenceField) => lkey == null || x.label.toLocaleLowerCase().indexOf(lkey) >= 0),
            offset: 0,
            limit,
            totalCount: results.length,
          };
        })
    );
  }

  public placeholder(): string {
    return $localize`:@@processingEvidenceField.input.placeholder:Select evidence field`;
  }
}

