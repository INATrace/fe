import { GeneralSifrantService } from './general-sifrant.service';
import { ApiFacility } from '../../api/model/apiFacility';
import { FacilityControllerService, ListCollectingFacilitiesByCompany } from '../../api/api/facilityController.service';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';
import { map } from 'rxjs/operators';
import { ApiPaginatedResponseApiFacility } from '../../api/model/apiPaginatedResponseApiFacility';

export class CompanyCollectingFacilitiesService extends GeneralSifrantService<ApiFacility> {

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListCollectingFacilitiesByCompany.PartialParamMap;

  constructor(
    private facilityControllerService: FacilityControllerService,
    private companyId: number
  ) {
    super();
  }

  textRepresentation(el: ApiFacility): string {
    return `${el.name}`;
  }

  identifier(el: ApiFacility) {
    return el.id;
  }

  placeholder(): string {
    return $localize`:@@activeCollectingFacility.input.placehoder:Select facility`;
  }

  makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiFacility>> {

    const limit = params && params.limit ? params.limit : this.limit();
    const reqParams = {
      id: this.companyId,
      ...this.requestParams
    };

    return this.facilityControllerService.listCollectingFacilitiesByCompanyByMap(reqParams)
      .pipe(
        map((res: ApiPaginatedResponseApiFacility) => {
          return {
            results: res.data.items,
            offset: 0,
            limit,
            totalCount: res.data.count
          };
        })
      );
  }

}
