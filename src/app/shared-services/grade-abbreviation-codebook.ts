import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { ChainProcessingAction } from 'src/api-chain/model/chainProcessingAction';
import { ProcessingActionService, ListProcessingActionsForProductAndOrganization } from 'src/api-chain/api/processingAction.service';
import { ApiResponsePaginatedListChainProcessingAction } from 'src/api-chain/model/apiResponsePaginatedListChainProcessingAction';
import { ChainGradeAbbreviation } from 'src/api-chain/model/chainGradeAbbreviation';
import { ApiResponsePaginatedListChainGradeAbbreviation } from 'src/api-chain/model/apiResponsePaginatedListChainGradeAbbreviation';
import { CodebookService } from 'src/api-chain/api/codebook.service';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from './codebook-translations';

export class GradeAbbreviationCodebook extends GeneralSifrantService<ChainGradeAbbreviation> {

  constructor(
    private chainCodebookService: CodebookService,
    protected codebookTranslations: CodebookTranslations
  ) {
    super();
  }

  public identifier(el: ChainGradeAbbreviation) {
    return dbKey(el);
  }

  public textRepresentation(el: ChainGradeAbbreviation) {
    return this.codebookTranslations.translate(el, 'label')
    // return `${el.label}`
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListProcessingActionsForProductAndOrganization.PartialParamMap

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ChainGradeAbbreviation>> {
    let limit = params && params.limit ? params.limit : this.limit()
    let reqPars = {
      ...this.requestParams
    }
    let tmp = this.chainCodebookService.getGradeAbbreviationListByMap(reqPars).pipe(
      map((res: ApiResponsePaginatedListChainGradeAbbreviation) => {
        return {
          results: res.data.items,
          offset: 0,
          limit: limit,
          totalCount: res.data.count,
        }
      })
    )
    return tmp;
  }

  public placeholder(): string {
    let placeholder = $localize`:@@gradeAbbreviation codebook.input.placehoder:Select grade`;
    return placeholder;
  }

}

