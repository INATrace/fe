import { GeneralSifrantService } from './general-sifrant.service';
import { ApiFacility } from '../../api/model/apiFacility';
import { FacilityControllerService, ListFacilitiesByCompany } from '../../api/api/facilityController.service';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';
import { map } from 'rxjs/operators';
import { ApiPaginatedResponseApiFacility } from '../../api/model/apiPaginatedResponseApiFacility';

export class CompanyFacilitiesForStockUnitProductService extends GeneralSifrantService<ApiFacility> {

  requestParams = {
    limit: 1000,
    offset: 0,
  } as ListFacilitiesByCompany.PartialParamMap;

  constructor(
    private facilityControllerService: FacilityControllerService,
    private companyId: number,
    private semiProductId?: number,
    private finalProductId?: number,
    private facilityIds?: number[]
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
    const reqParams: ListFacilitiesByCompany.PartialParamMap = {
      id: this.companyId,
      semiProductId: this.semiProductId,
      finalProductId: this.finalProductId,
      ...this.requestParams
    };

    return this.facilityControllerService.listFacilitiesByCompanyByMap(reqParams)
      .pipe(
        map((res: ApiPaginatedResponseApiFacility) => {
            if (this.facilityIds && this.facilityIds.length > 0) {
                const filteredItems: ApiFacility[] = res.data.items.filter(facility => this.facilityIds.findIndex(sfId => sfId === facility.id) >= 0);
                return {
                    results: filteredItems,
                    offset: 0,
                    limit,
                    totalCount: filteredItems.length
                };
            }

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
