import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { DeliveryDates } from '../stock-core-tab/stock-core-tab.component';
import { SortOption } from '../../../../shared/result-sorter/result-sorter-types';
import { FormControl } from '@angular/forms';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { StockOrderControllerService } from '../../../../../api/api/stockOrderController.service';
import { ApiPaginatedListApiStockOrder } from '../../../../../api/model/apiPaginatedListApiStockOrder';
import { formatDateWithDots } from '../../../../../shared/utils';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { StockOrderType } from '../../../../../shared/types';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDefaultResponse } from '../../../../../api/model/apiDefaultResponse';
import StatusEnum = ApiDefaultResponse.StatusEnum;
import { ProcessingOrderControllerService } from '../../../../../api/api/processingOrderController.service';
import {GroupStockOrderControllerService} from '../../../../../api/api/groupStockOrderController.service';
import {ApiPaginatedResponseApiGroupStockOrder} from '../../../../../api/model/apiPaginatedResponseApiGroupStockOrder';
import {ApiPaginatedListApiGroupStockOrder} from '../../../../../api/model/apiPaginatedListApiGroupStockOrder';
import {ApiGroupStockOrder} from '../../../../../api/model/apiGroupStockOrder';
import {AggregatedStockItem} from '../stock-order-list/models';

@Component({
  selector: 'app-group-stock-order-list',
  templateUrl: './group-stock-order-list.component.html',
  styleUrls: ['./group-stock-order-list.component.scss']
})
export class GroupStockOrderListComponent implements OnInit, OnDestroy {

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false);

  @Input()
  facilityId$ = new BehaviorSubject<number>(null);

  @Input()
  openBalanceOnly$ = new BehaviorSubject<boolean>(false);

  @Input()
  purchaseOrderOnly$ = new BehaviorSubject<boolean>(true);

  @Input()
  availableOnly$ = new BehaviorSubject<boolean>(false);

  @Input()
  semiProductId$ = new BehaviorSubject<number>(null);

  @Input()
  companyId: number = null;

  @Input()
  farmerIdPing$ = new BehaviorSubject<number>(null);

  @Input()
  representativeOfProducerUserCustomerIdPing$ = new BehaviorSubject<number>(null);

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
  selectedOrders: ApiGroupStockOrder[];

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
  page = 1;
  pageSize = 10;
  private paging$ = new BehaviorSubject<number>(1);

  cbCheckedAll = new FormControl(false);
  private allSelected = false;
  currentData: ApiGroupStockOrder[];
  clearCheckboxesSubscription: Subscription;

  orders$: Observable<ApiPaginatedListApiGroupStockOrder>;
  aggregatedOrders: AggregatedStockItem[];

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private globalEventsManager: GlobalEventManagerService,
      private stockOrderControllerService: StockOrderControllerService,
      private groupStockOrderControllerService: GroupStockOrderControllerService,
      private processingOrderController: ProcessingOrderControllerService,
  ) { }

  ngOnInit(): void {

    this.clearCheckboxesSubscription = this.clickClearCheckboxesPing$.subscribe(val => {
      if (val) {
        this.clearCBs();
      }
    });

    this.initSortOptions();

    this.orders$ = combineLatest([
      this.reloadPingList$,
      this.paging$,
      this.sortingParams$,
      this.facilityId$,
      this.farmerIdPing$,
      this.representativeOfProducerUserCustomerIdPing$,
      this.openBalanceOnly$,
      this.purchaseOrderOnly$,
      this.availableOnly$,
      this.semiProductId$,
      this.wayOfPaymentPing$,
      this.womenOnlyPing$,
      this.deliveryDatesPing$,
      this.searchFarmerNameSurnamePing$
    ]).pipe(
        map(([
               ping,
               page,
               sorting,
               facilityId,
               farmerId,
               representativeOfProducerUserCustomerId,
               isOpenBalanceOnly,
               isPurchaseOrderOnly,
               availableOnly,
               semiProductId,
               wayOfPayment,
               isWomenShare,
               deliveryDates,
               query]) => {
          return {
            offset: (page - 1) * this.pageSize,
            limit: this.pageSize,
            ...sorting,
            facilityId,
            farmerId,
            representativeOfProducerUserCustomerId,
            isOpenBalanceOnly,
            isPurchaseOrderOnly,
            availableOnly,
            semiProductId,
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
            this.setCounts(response.data.count);
            return response.data;
          } else {
            return null;
          }
        }),
        tap((data: ApiPaginatedListApiStockOrder) => {
          if (data) {
            this.aggregatedOrders = this.aggregateOrderItems(data.items);
          }
        }),
        tap(() => this.refreshCBs()),
        tap(() => this.globalEventsManager.showLoading(false))
    );
  }

  ngOnDestroy(): void {
    if (this.clearCheckboxesSubscription) { this.clearCheckboxesSubscription.unsubscribe(); }
  }

  private initSortOptions() {
    this.sortOptions = [
      {
        key: 'cb',
        name: '',
        inactive: true,
        selectAllCheckbox: false
      },
      {
        key: 'date',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.production.name:Production date`,
        defaultSortOrder: 'DESC'
      },
      {
        key: 'identifier',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.identifier.name:Identifier`,
        inactive: true,
      },
      {
        key: 'sacNumber',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.sacNumber.name:No. of sacs`,
        inactive: true,
      },
      {
        key: 'orderType',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.orderType.name:Type`,
        inactive: true,
      },
      {
        key: 'semiProduct',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.semiProduct.name:Semi-product`,
        inactive: true
      },
      {
        key: 'quantity',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.quantityFiledAvailable.name:Quantity / Filled / Available`,
        inactive: true,
      },
      {
        key: 'unit',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.unit.name:Unit`,
        inactive: true,
      },
      {
        key: 'deliveryTime',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.deliveryTime.name:Delivery date`,
      },
      {
        key: 'updateTimestamp',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.lastChange.name:Date of last change`,
        defaultSortOrder: 'DESC',
      },
      {
        key: 'isAvailable',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.status.name:Status`,
        inactive: true,
      },
      {
        key: 'actions',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.actions.name:Actions`,
        inactive: true
      }
    ];

    this.sortingParams$.next({ sortBy: 'updateTimestamp', sort: 'DESC' });
  }

  private loadStockOrders(params): Observable<ApiPaginatedResponseApiGroupStockOrder> {
    if (!params.isOpenBalanceOnly) {
      delete params.isOpenBalanceOnly;
    }

    const facilityId = params.facilityId;
    delete params.facilityId;

    if (!facilityId) {
      return of({
        data: {
          count: 0,
          items: []
        },
        status: StatusEnum.OK
      });
    }
    return this.groupStockOrderControllerService.getGroupedStockOrderListUsingGETByMap({ ...params, facilityId });
  }

  private setCounts(allCount: number) {
    this.allOrders = allCount;

    if (this.pageSize > this.allOrders) {
      this.showedOrders = this.allOrders;
    } else {
      const temp = this.allOrders - (this.pageSize * (this.page - 1));
      this.showedOrders = temp >= this.pageSize ? this.pageSize : temp;
    }

    this.showing.emit(this.showedOrders);
    this.countAll.emit(this.allOrders);
  }

  edit(order: ApiGroupStockOrder) {
    switch (order.orderType as StockOrderType) {
      case 'PURCHASE_ORDER':
        this.router.navigate(['my-stock', 'purchases', 'update', order.id]).then();
        return;
      case 'GENERAL_ORDER':
        this.router.navigate(['my-stock', 'processing', 'update', 'shipment-order', order.id]).then();
        return;
      case 'PROCESSING_ORDER':
        this.router.navigate(['my-stock', 'processing', 'update', 'processing-order', order.id]).then();
        return;
      case 'TRANSFER_ORDER':
        this.router.navigate(['my-stock', 'processing', 'update', 'transfer-order', order.id]).then();
        return;

      default:
        throw new Error('Unsupported Stock order type');
    }
  }

  history(item: ApiGroupStockOrder) {
    this.router.navigate(['orders', 'stock-order', item.id, 'view'],
        { relativeTo: this.route.parent.parent, queryParams: { returnUrl: this.router.routerState.snapshot.url }}).then();
  }

  canDelete(order: ApiGroupStockOrder) {
    if (order.orderType === 'PROCESSING_ORDER') { return true; }
    if (order.orderType === 'TRANSFER_ORDER') { return true; }
    if (order.orderType === 'GENERAL_ORDER') { return Math.abs(order.fulfilledQuantity - order.availableQuantity) < 0.0000000001; }
    return true;
  }

  async delete(order: ApiGroupStockOrder) {
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

        const stockOrderResp = await this.stockOrderControllerService.getStockOrderUsingGET(order.id, true).pipe(take(1)).toPromise();
        if (stockOrderResp && stockOrderResp.status === 'OK' && stockOrderResp.data) {
          const procOrderResp = await this.processingOrderController.deleteProcessingOrderUsingDELETE(stockOrderResp.data.processingOrder.id).pipe(take(1)).toPromise();
          if (procOrderResp && procOrderResp.status === 'OK') {
            this.reloadPingList$.next(true);
          }
        }

        return;
      }

      // Remove purchase order
      const response = await this.stockOrderControllerService.deleteStockOrderUsingDELETE(order.id).pipe(take(1)).toPromise();
      if (response && response.status === StatusEnum.OK) {
        this.reloadPingList$.next(true);
        this.clearCBs();
      }

    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

  changeSort(event) {
    if (event.key === 'cb') {
      this.selectAllOnPage(event.checked);
      return;
    }
    this.sortingParams$.next({ sortBy: event.key, sort: event.sortOrder });
  }

  showPagination() {
    return ((this.showedOrders - this.pageSize) === 0 && this.allOrders >= this.pageSize) || this.page > 1;
  }

  onPageChange(event) {
    this.paging$.next(event);
  }

  cbSelected(order: ApiGroupStockOrder, index: number) {

    (this.currentData[index] as any).selected = !(this.currentData[index] as any).selected;

    const selectedIndex = this.selectedOrders.indexOf(order);

    if (selectedIndex !== -1) {
      this.selectedOrders.splice(selectedIndex, 1);
    } else {
      this.selectedOrders.push(order);
    }
    this.selectedIdsChanged.emit(this.selectedOrders);

    if (this.allSelected) {
      this.allSelected = false;
      this.cbCheckedAll.setValue(false);
    } else {
      this.refreshCBs();
    }
  }

  private refreshCBs(){

    if (!this.selectedOrders){
      return;
    }

    let selectedCount = 0;

    for (const item of this.currentData) {
      for (const order of this.selectedOrders) {

        if (item.groupedIds.filter(v => order.groupedIds.includes(v)).length) {

          (item as any).selected = true;
          selectedCount += 1;

          // Prevents having selected multiple same items
          const replaceIndex = this.selectedOrders.indexOf(order);
          if (replaceIndex !== -1) {
            this.selectedOrders.splice(replaceIndex, 1);
            this.selectedOrders.push(item);
          }
          break;
        }

      }
    }

    this.allSelected = selectedCount === this.showedOrders;
    this.cbCheckedAll.setValue(this.allSelected);
  }

  private selectAllOnPage(checked) {
    if (checked) {

      for (const item of this.currentData) {

        // Remove existing item (if exists)
        for (const order of this.selectedOrders) {
          if (order.id === item.id) {
            const replaceIndex = this.selectedOrders.indexOf(order);
            if (replaceIndex !== -1) {
              this.selectedOrders.splice(replaceIndex, 1);
            }
            break;
          }
        }

        // Select and add item
        (item as any).selected = true;
        this.selectedOrders.push(item);
      }

      this.allSelected = true;
      this.selectedIdsChanged.emit(this.selectedOrders);

    } else {

      // Unselect and remove items (from selectedOrders)
      for (const item of this.currentData) {
        for (const order of this.selectedOrders) {
          if (order.id === item.id) {
            (item as any).selected = false;
            const removeIndex = this.selectedOrders.indexOf(order);
            if (removeIndex !== -1) {
              this.selectedOrders.splice(removeIndex, 1);
            }
            break;
          }
        }
      }

      this.allSelected = false;
      this.selectedIdsChanged.emit(this.selectedOrders);
    }
  }

  private clearCBs() {
    this.selectedOrders = [];
    this.allSelected = false;
    this.cbCheckedAll.setValue(false);
    this.selectedIdsChanged.emit(this.selectedOrders);
    for (const item of this.currentData) {
      if ((item as any).selected) { (item as any).selected = false; }
    }
  }

  formatDate(productionDate) {
    if (productionDate) {
      return formatDateWithDots(productionDate);
    }
    return '';
  }

  aggregateOrderItems(items: ApiGroupStockOrder[]): AggregatedStockItem[] {

    // Aggregate semi-products
    const aggregatedSemiProductsMap: Map<string, AggregatedStockItem> = items
        .filter(stockOrder => stockOrder.semiProductName)
        .reduce((acc: Map<string, AggregatedStockItem>, item: ApiGroupStockOrder) => {

          const nextTotalQuantity = item.totalQuantity ? item.totalQuantity : 0;

          if (acc.has(item.semiProductName)) {
            const prevElem = acc.get(item.semiProductName);
            acc.set(item.semiProductName, {
              ...prevElem,
              amount: nextTotalQuantity + prevElem.amount
            });
          } else {
            acc.set(item.semiProductName, {
              amount: nextTotalQuantity,
              measureUnit: item.unitLabel,
              stockUnitName: item.semiProductName
            });
          }
          return acc;
        }, new Map<string, AggregatedStockItem>());

    // Aggregate final products
    const aggregatedFinalProducts: Map<string, AggregatedStockItem> = items
        .filter(stockOrder => stockOrder.finalProductName)
        .reduce((acc: Map<string, AggregatedStockItem>, item: ApiGroupStockOrder) => {

          const nextTotalQuantity = item.totalQuantity ? item.totalQuantity : 0;

          if (acc.has(item.finalProductName)) {
            const prevElem = acc.get(item.finalProductName);
            acc.set(item.finalProductName, {
              ...prevElem,
              amount: nextTotalQuantity + prevElem.amount
            });
          } else {
            acc.set(item.finalProductName, {
              amount: nextTotalQuantity,
              measureUnit: item.unitLabel,
              stockUnitName: item.finalProductName
            });
          }
          return acc;
        }, new Map<string, AggregatedStockItem>());

    return [...Array.from(aggregatedSemiProductsMap.values()), ...Array.from(aggregatedFinalProducts.values())];
  }

}
