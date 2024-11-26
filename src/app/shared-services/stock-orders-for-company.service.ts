import { Injectable } from '@angular/core';
import { GeneralSifrantService } from './general-sifrant.service';
import { ApiStockOrder } from '../../api/model/apiStockOrder';
import { formatDateWithDots } from '../../shared/utils';
import { Observable } from 'rxjs';
import { PagedSearchResults } from '../../interfaces/CodebookHelperService';
import { map } from 'rxjs/operators';
import {
  GetStockOrderListByCompanyId,
  StockOrderControllerService
} from '../../api/api/stockOrderController.service';
import { ApiPaginatedResponseApiStockOrder } from '../../api/model/apiPaginatedResponseApiStockOrder';
import { ApiPayment } from '../../api/model/apiPayment';
import PreferredWayOfPaymentEnum = ApiPayment.PreferredWayOfPaymentEnum;
import OrderTypeEnum = ApiStockOrder.OrderTypeEnum;

@Injectable({
  providedIn: 'root'
})
export class StockOrdersForCompanyService extends GeneralSifrantService<ApiStockOrder>{

  constructor(
      private stockOrderControllerService: StockOrderControllerService,
      private companyId: number,
      private farmerId: number,
      private isOpenBalanceOnly: boolean,
      private isWomenShare: boolean,
      private wayOfPayment: PreferredWayOfPaymentEnum,
      private orderType: OrderTypeEnum,
      private productionDateStart: string,
      private productionDateEnd: string,
      private producerUserCustomerName: string,
  ) {
    super();
  }

  requestParams = {
    limit: 1000,
    offset: 0,
  } as GetStockOrderListByCompanyId.PartialParamMap;

  public setWomenShare(isWomenShare: boolean) {
    this.isWomenShare = isWomenShare;
  }

  public identifier(el: ApiStockOrder) {
    return el.id;
  }

  public textRepresentation(el: ApiStockOrder) {
    return `${this.formatDate(el.productionDate)}`;
  }

  public placeholder(): string {
    return $localize`:@@stockOrdersForOrganization.input.placehoder:Select purchase`;
  }

  public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiStockOrder>> {

    const reqParams = {
      ...this.requestParams,
      companyId: this.companyId,
      farmerId: this.farmerId,
      isOpenBalanceOnly: this.isOpenBalanceOnly,
      isWomenShare: this.isWomenShare,
      wayOfPayment: this.wayOfPayment,
      orderType: this.orderType,
      productionDateStart: this.productionDateStart,
      productionDateEnd: this.productionDateEnd,
      query: this.producerUserCustomerName
    };

    return this.stockOrderControllerService.getStockOrderListByCompanyIdByMap(reqParams).pipe(
        map((res: ApiPaginatedResponseApiStockOrder) => {
          return {
            results: res.data.items,
            totalCount: res.data.items.length,
            offset: 0,
            limit: undefined
          };
        })
    );

  }

  formatDate(productionDate) {
    return productionDate ? formatDateWithDots(productionDate) : null;
  }

}
