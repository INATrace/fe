import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { CodebookTranslations } from './codebook-translations';
import { GetGradeAbbreviationListUsingGET, GradeAbbreviationControllerService } from '../../api/api/gradeAbbreviationController.service';
import { ApiGradeAbbreviation } from '../../api/model/apiGradeAbbreviation';
import { ApiPaginatedResponseApiGradeAbbreviation } from '../../api/model/apiPaginatedResponseApiGradeAbbreviation';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GradeAbbreviationCodebook extends GeneralSifrantService<ApiGradeAbbreviation> {

  constructor(
    private chainCodebookService: GradeAbbreviationControllerService,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetGradeAbbreviationListUsingGET.PartialParamMap;

  public identifier(el: ApiGradeAbbreviation) {
    return el.id;
  }

  public textRepresentation(el: ApiGradeAbbreviation) {
    return this.codebookTranslations.translate(el, 'label');
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiGradeAbbreviation>> {
    const limit = params && params.limit ? params.limit : this.limit();

    const reqPars = {
      ...this.requestParams
    };

    return this.chainCodebookService.getGradeAbbreviationListUsingGETByMap(reqPars).pipe(
        map((res: ApiPaginatedResponseApiGradeAbbreviation) => {
          return {
            results: res.data.items,
            offset: 0,
            limit,
            totalCount: res.data.count,
          };
        })
    );
  }

  public placeholder(): string {
    return $localize`:@@gradeAbbreviation codebook.input.placehoder:Select grade`;
  }

}

