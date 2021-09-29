import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { DeliveryDates } from '../stock-core-tab/stock-core-tab.component';
import { SortOption } from '../../../../shared/result-sorter/result-sorter-types';
import { FormControl } from '@angular/forms';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { StockOrderControllerService } from '../../../../../api/api/stockOrderController.service';
import { ApiPaginatedResponseApiStockOrder } from '../../../../../api/model/apiPaginatedResponseApiStockOrder';
import { StockOrderListingPageMode } from '../../../../m-product/product-stock/stock-core/stock-tab-core/stock-tab-core.component';
import { ApiPaginatedListApiStockOrder } from '../../../../../api/model/apiPaginatedListApiStockOrder';
import { formatDateWithDots } from '../../../../../shared/utils';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { ApiUserCustomer } from '../../../../../api/model/apiUserCustomer';
import { StockOrderType } from '../../../../../shared/types';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDefaultResponse } from '../../../../../api/model/apiDefaultResponse';
import StatusEnum = ApiDefaultResponse.StatusEnum;

@Component({
  selector: 'app-stock-order-list',
  templateUrl: './stock-order-list.component.html',
  styleUrls: ['./stock-order-list.component.scss']
})
export class StockOrderListComponent implements OnInit {

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false);

  @Input()
  facilityId$ = new BehaviorSubject<number>(null);

  @Input()
  openBalanceOnly$ = new BehaviorSubject<boolean>(false);

  @Input()
  selectedOrders: ApiStockOrder[];

  @Input()
  clickAddPaymentsPing$ = new BehaviorSubject<boolean>(false);

  @Input()
  companyId: number = null;

  @Input()
  wayOfPaymentPing$ = new BehaviorSubject<string>('');

  @Input()
  womenOnlyPing$ = new BehaviorSubject<boolean>(null);

  @Input()
  deliveryDatesPing$ = new BehaviorSubject<DeliveryDates>({ from: null, to: null });

  @Input()
  searchFarmerNameSurnamePing$ = new BehaviorSubject<string>(null);

  @Input()
  clickClearCheckboxesPing$ = new BehaviorSubject<boolean>(false);

  @Input()
  mode: 'PURCHASE' | 'GENERAL' = 'PURCHASE';

  @Input()
  pageListingMode: StockOrderListingPageMode = 'PURCHASE_ORDERS';

  @Output()
  countAll = new EventEmitter<number>();

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  selectedIdsChanged = new EventEmitter<ApiStockOrder[]>();

  sortOptions: SortOption[];
  private sortingParams$ = new BehaviorSubject(null);

  private allOrders = 0;
  private showedOrders = 0;
  page = 0;
  pageSize = 10;
  private paging$ = new BehaviorSubject<number>(1);

  cbCheckedAll = new FormControl(false);
  private allSelected = false;
  currentData: ApiStockOrder[];

  orders$: Observable<ApiPaginatedListApiStockOrder>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalEventsManager: GlobalEventManagerService,
    private stockOrderControllerService: StockOrderControllerService
  ) { }

  ngOnInit(): void {

    this.initSortOrders();

    this.orders$ = combineLatest([
      this.reloadPingList$,
      this.paging$,
      this.sortingParams$,
      this.facilityId$,
      this.openBalanceOnly$,
      this.wayOfPaymentPing$,
      this.womenOnlyPing$,
      this.deliveryDatesPing$,
      this.searchFarmerNameSurnamePing$
    ]).pipe(
      map(([ping, page, sorting, facilityId, isOpenBalanceOnly, wayOfPayment, isWomenShare, deliveryDates, query]) => {
        return {
          offset: (page - 1) * this.pageSize,
          limit: this.pageSize,
          ...sorting,
          facilityId,
          isOpenBalanceOnly,
          wayOfPayment,
          isWomenShare,
          productionDateStart: deliveryDates.from ? new Date(deliveryDates.from) : null,
          productionDateEnd: deliveryDates.to ? new Date(deliveryDates.to) : null,
          query: query ? query : null
        };
      }),
      tap(() => this.globalEventsManager.showLoading(true)),
      switchMap(params => {
        return this.loadStockOrders(params);
      }),
      map(response => {

        if (response && response.data) {
          this.currentData = response.data.items;
          return response.data;
        } else {
          return null;
        }

      }),
      tap(() => this.globalEventsManager.showLoading(false))
    );
  }

  private initSortOrders() {

    this.sortOptions = [
      {
        key: 'cb',
        name: '',
        selectAllCheckbox: ['PURCHASE_ORDERS'].indexOf(this.pageListingMode) >= 0,
        hide: false,
        inactive: true
      },
      {
        key: 'date',
        name: ['PURCHASE_ORDERS'].indexOf(this.pageListingMode) >= 0
          ? $localize`:@@productLabelPurchaseOrder.sortOptions.deliveryDate.name:Delivery date`
          : $localize`:@@productLabelPurchaseOrder.sortOptions.production.name:Production date`,
      },
      {
        key: 'identifier',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.identifier.name:Type`,
        inactive: true,
        hide: ['PURCHASE_ORDERS'].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'orderType',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.orderType.name:Type`,
        inactive: true,
        hide: ['PURCHASE_ORDERS'].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'farmer',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.farmer.name:Farmer`,
        inactive: true,
        hide: ['COMPANY_ADMIN', 'ADMIN'].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'semiProduct',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.semiProduct.name:Semi-product`,
        inactive: true,
        hide: ['PURCHASE_ORDERS'].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'quantity',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.quantity.name:Quantity (kg)`,
        inactive: true,
        hide: ['COMPANY_ADMIN', 'ADMIN'].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'quantity',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.quantityFiledAvailable.name:Quantity / Filled / Available`,
        inactive: true,
        hide: ['PURCHASE_ORDERS'].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'unit',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.unit.name:Unit`,
        inactive: true,
        hide: ['PURCHASE_ORDERS'].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'payable',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.payable.name:Payable / Balance`,
        inactive: true,
        hide: ['COMPANY_ADMIN', 'ADMIN'].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'deliveryTime',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.deliveryTime.name:Delivery date`,
        hide: ['PURCHASE_ORDERS'].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'lastChange',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.lastChange.name:Date of last change`,
        defaultSortOrder: 'DESC',
        hide: ['PURCHASE_ORDERS'].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'isAvailable',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.status.name:Status`,
        inactive: true,
        hide: ['PURCHASE_ORDERS'].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'wayOfPayment',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.wayOfPayment.name:Way of payment`,
        inactive: true,
        hide: ['COMPANY_ADMIN', 'ADMIN'].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'actions',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.actions.name:Actions`,
        inactive: true
      }
    ];
  }

  private loadStockOrders(params): Observable<ApiPaginatedResponseApiStockOrder> {

    if (!params.isOpenBalanceOnly) {
      delete params.isOpenBalanceOnly;
    }

    const facilityId = params.facilityId;
    delete params.facilityId;

    if (this.mode === 'PURCHASE') {
      if (!facilityId) {
        return this.stockOrderControllerService.getStockOrderListByCompanyIdUsingGETByMap({...params, companyId: this.companyId});
      }
      return this.stockOrderControllerService.getStockOrderListByFacilityIdUsingGETByMap({ ...params, facilityId });
    }

    if (this.mode === 'GENERAL') {
      if (!params.facilityId) {
        return of({
          data: {
            count: 0,
            items: []
          },
          status: StatusEnum.OK
        });
      }
      return this.stockOrderControllerService.getStockOrderListByFacilityIdUsingGETByMap({ ...params, facilityId });
    }
  }

  edit(order: ApiStockOrder) {

    if (this.pageListingMode === 'PURCHASE_ORDERS') {

      console.log('ID: ', order.id);
      this.router.navigate(['my-stock', 'purchases', 'update', order.id]).then();

    } else {

      switch (order.orderType as StockOrderType) {
        case 'PURCHASE_ORDER':
          // this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'purchase-order', 'update', dbKey(order)]);
          return;
        case 'GENERAL_ORDER':
          // this.router.navigate(['product-labels', this.productId, 'stock', 'processing', 'update', 'shipment-order', dbKey(order)]);
          return;
        case 'PROCESSING_ORDER':
          // this.router.navigate(['product-labels', this.productId, 'stock', 'processing', 'update', 'processing-order', dbKey(order)]);
          return;
        case 'SALES_ORDER':
          // this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'sales-order', 'update', dbKey(order)]);
          return;
        case 'TRANSFER_ORDER':
          // this.router.navigate(['product-labels', this.productId, 'stock', 'processing', 'update', 'transfer-order', dbKey(order)]);
          return;

        default:
          // this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'purchase-order', 'update', dbKey(order)]);
          break;
      }
    }
  }

  history(item: ApiStockOrder) {
    this.router.navigate(['stock-orders', 'stock-order', item.id, 'view'],
      { relativeTo: this.route.parent.parent, queryParams: { returnUrl: this.router.routerState.snapshot.url }}).then();
  }

  payment(order: ApiStockOrder) {
    this.router.navigate(['my-stock', 'payments', 'purchase-order', order.id, 'new']).then();
  }

  farmerProfile(id) {
    this.router.navigate(['my-farmers', 'update', id],
      { queryParams: {returnUrl: this.router.routerState.snapshot.url }}).then();
  }

  canDelete(order: ApiStockOrder) {
    if (order.orderType === 'PROCESSING_ORDER') { return true; }
    if (order.orderType === 'TRANSFER_ORDER') { return true; }
    if (order.orderType === 'GENERAL_ORDER') { return Math.abs(order.fulfilledQuantity - order.availableQuantity) < 0.0000000001; }
    return true;
  }

  async delete(order: ApiStockOrder) {

    let confirmResult;
    if (order.orderType === 'PROCESSING_ORDER' || order.orderType === 'TRANSFER_ORDER') {
      confirmResult = await this.globalEventsManager.openMessageModal({
        type: 'warning',
        message: $localize`:@@productLabelPurchaseOrder.deleteProcessingOrder.error.message:Are you sure you want to delete the order? This will delete processing transaction and possibly all orders generated from it.`,
        options: { centered: true }
      });
    } else {
      confirmResult = await this.globalEventsManager.openMessageModal({
        type: 'warning',
        message: $localize`:@@productLabelPurchaseOrder.delete.error.message:Are you sure you want to delete the order?`,
        options: { centered: true }
      });
    }

    // If user confirms, the modal result is 'ok'
    if (confirmResult !== 'ok') {
      return;
    }

    try {

      this.globalEventsManager.showLoading(true);

      if (order.orderType === 'PROCESSING_ORDER' || order.orderType === 'TRANSFER_ORDER' || order.orderType === 'GENERAL_ORDER') {
        // TODO: implement remove for other types of orders
        return;
      }

      // Remove purchase order
      const response = await this.stockOrderControllerService.deleteStockOrderUsingDELETE(order.id).pipe(take(1)).toPromise();
      if (response && response.status === StatusEnum.OK) {
        this.reloadPingList$.next(true);
      }

    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

  changeSort(event) {
    if (event.key === 'cb') {
      this.selectAll(event.checked);
      return;
    }
    this.sortingParams$.next({ sortBy: event.key, sort: event.sortOrder });
  }

  private selectAll(checked) {
    if (checked) {
      this.selectedOrders = [];
      for (const item of this.currentData) {
        this.selectedOrders.push(item);
      }
      this.currentData.map(item => { (item as any).selected = true; return item; });
      this.allSelected = true;
      this.selectedIdsChanged.emit(this.selectedOrders);
    } else {
      this.selectedOrders = [];
      this.allSelected = false;
      this.currentData.map(item => { (item as any).selected = false; return item; });
      this.selectedIdsChanged.emit(this.selectedOrders);
    }
  }

  showPagination() {
    return ((this.showedOrders - this.pageSize) === 0 && this.allOrders >= this.pageSize) || this.page > 1;
  }

  onPageChange(event) {
    this.paging$.next(event);
  }

  cbSelected(order: ApiStockOrder, index: number) {
    if (this.allSelected) {
      this.allSelected = false;
      this.cbCheckedAll.setValue(false);
    }

    (this.currentData[index] as any).selected = !(this.currentData[index] as any).selected;

    const selectedIndex = this.selectedOrders.indexOf(order);

    if (selectedIndex !== -1) {
      this.selectedOrders.splice(selectedIndex, 1);
    } else {
      this.selectedOrders.push(order);
    }
    this.selectedIdsChanged.emit(this.selectedOrders);
  }

  formatDate(productionDate) {
    if (productionDate) {
      return formatDateWithDots(productionDate);
    }
    return '';
  }

  orderIdentifier(order: ApiStockOrder) {
    // TODO: fix this when available on the API
    // return order && (order.identifier || order.internalLotNumber);
    return order && order.identifier;
  }

  farmerName(farmer: ApiUserCustomer) {
    // TODO: complete this when available on the API
    // if (farmer) {
    //   const cell = farmer.location ? (farmer.location.cell ? farmer.location.cell.substring(0, 2).toLocaleUpperCase() : '--') : '--';
    //   const village = farmer.location ? (farmer.location.village ? farmer.location.village.substring(0, 2).toLocaleUpperCase() : '--') : '--';
    //   return farmer.name + ' ' + farmer.surname + ' (' + farmer.id + ', ' + village + '-' + cell + ')';
    // }
    if (farmer) {
      return farmer.name + ' ' + farmer.surname;
    }
    return '';
  }

}
