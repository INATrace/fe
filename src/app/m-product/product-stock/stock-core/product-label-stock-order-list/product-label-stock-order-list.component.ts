import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { parseMessage } from '@angular/localize/src/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, of, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ProcessingOrderService } from 'src/api-chain/api/processingOrder.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ApiResponsePaginatedListChainStockOrder } from 'src/api-chain/model/apiResponsePaginatedListChainStockOrder';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { ChainUserCustomer } from 'src/api-chain/model/chainUserCustomer';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { StockOrderType } from 'src/shared/types';
import { dbKey, formatDateWithDots } from 'src/shared/utils';
import { DeliveryDates, StockOrderListingPageMode } from '../stock-tab-core/stock-tab-core.component';

@Component({
  selector: 'app-product-label-stock-order-list',
  templateUrl: './product-label-stock-order-list.component.html',
  styleUrls: ['./product-label-stock-order-list.component.scss']
})
export class ProductLabelStockOrderListComponent implements OnInit {

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false);
  @Input()
  facilityId$ = new BehaviorSubject<string>("");;
  @Input()
  openBalanceOnly$ = new BehaviorSubject<boolean>(false);
  @Input()
  purchaseOrderOnly$ = new BehaviorSubject<boolean>(true)
  @Input()
  availableOnly$ = new BehaviorSubject<boolean>(true)
  @Input()
  semiProductId$ = new BehaviorSubject<string>(null)
  @Input()
  wayOfPaymentPing$ = new BehaviorSubject<string>("");
  @Input()
  womenOnlyPing$ = new BehaviorSubject<boolean>(null);
  @Input()
  deliveryDatesPing$ = new BehaviorSubject<DeliveryDates>({ from: null, to: null });
  @Input()
  queryFarmerNameSurnamePing$ = new BehaviorSubject<string>(null);

  @Input()
  clickAddPaymentsPing$ = new BehaviorSubject<boolean>(false);
  @Input()
  clickClearCheckboxesPing$ = new BehaviorSubject<boolean>(false);
  @Input()
  pageListingMode: StockOrderListingPageMode = 'PURCHASE_ORDERS'
  @Input()
  organizationId: string = null

  allOrders: number = 0;
  showedOrders: number = 0;

  clickSubscription: Subscription;
  clearCheckboxesSubscription: Subscription;

  @Input()
  selectedOrders: ChainStockOrder[];

  cbCheckedAll = new FormControl(false);

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  @Output()
  selectedIdsChanged = new EventEmitter<ChainStockOrder[]>();

  @Input()
  mode: 'PURCHASE' | 'GENERAL' = 'PURCHASE'

  productId = this.route.snapshot.params.id;
  pagingParams$ = new BehaviorSubject({})
  sortingParams$ = new BehaviorSubject(null)
  // sortingParams$ = new BehaviorSubject({ sortBy: 'name', sort: 'ASC' })
  // sortingParams$ = new BehaviorSubject({ sortBy: 'date', sort: 'DESC' })
  paging$ = new BehaviorSubject<number>(1);
  page: number = 0;
  pageSize = 10;
  currentData;
  allSelected: boolean = false;

  constructor(
    private chainStockOrderService: StockOrderService,
    private chainProcessingOrderService: ProcessingOrderService,
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  onPageChange(event) {
    this.paging$.next(event);
    // this.clearCBs();
  }

  reloadPage() {
    this.reloadPingList$.next(true)
    this.clearCBs();
  }

  changeSort(event) {
    if (event.key === "cb") {
      this.selectAll(event.checked);
      return;
    }
    this.sortingParams$.next({ sortBy: event.key, sort: event.sortOrder })
    // this.clearCBs();
  }

  sortOptions;

  ngOnInit(): void {
    this.initializeObservable();
    this.clickSubscription = this.clickAddPaymentsPing$.subscribe(val => {
      if (val) this.addPayments();
    });
    this.clearCheckboxesSubscription = this.clickClearCheckboxesPing$.subscribe(val => {
      if (val) this.clearCBs();
    });
    this.sortOptions = [
      {
        key: 'cb',
        selectAllCheckbox: ["PURCHASE_ORDERS"].indexOf(this.pageListingMode) >= 0,
        hide: false,
        inactive: true
      },
      {
        key: 'date',
        name: ["PURCHASE_ORDERS"].indexOf(this.pageListingMode) >= 0
          ? $localize`:@@productLabelPurchaseOrder.sortOptions.deliveryDate.name:Delivery date`
          : $localize`:@@productLabelPurchaseOrder.sortOptions.production.name:Production date`,
        // defaultSortOrder: 'ASC',
        // inactive: ["PURCHASE_ORDERS"].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'identifier',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.identifier.name:Type`,
        // defaultSortOrder: 'DESC',
        inactive: true,
        hide: ["PURCHASE_ORDERS"].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'orderType',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.orderType.name:Type`,
        // defaultSortOrder: 'DESC',
        inactive: true,
        hide: ["PURCHASE_ORDERS"].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'farmer',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.farmer.name:Farmer`,
        inactive: true,
        hide: ["COMPANY_ADMIN", "ADMIN"].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'semiProduct',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.semiProduct.name:Semi-product`,
        inactive: true,
        hide: ["PURCHASE_ORDERS"].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'quantity',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.quantity.name:Quantity (kg)`,
        inactive: true,
        hide: ["COMPANY_ADMIN", "ADMIN"].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'quantity',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.quantityFiledAvailable.name:Quantity / Filled / Available`,
        inactive: true,
        hide: ["PURCHASE_ORDERS"].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'unit',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.unit.name:Unit`,
        inactive: true,
        hide: ["PURCHASE_ORDERS"].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'payable',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.payable.name:Payable / Balance`,
        inactive: true,
        hide: ["COMPANY_ADMIN", "ADMIN"].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'deliveryTime',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.deliveryTime.name:Delivery date`,
        // inactive: true,
        hide: ["PURCHASE_ORDERS"].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'lastChange',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.lastChange.name:Date of last change`,
        // inactive: true,
        defaultSortOrder: 'DESC',
        hide: ["PURCHASE_ORDERS"].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'isAvailable',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.status.name:Status`,
        inactive: true,
        hide: ["PURCHASE_ORDERS"].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'wayOfPayment',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.wayOfPayment.name:Way of payment`,
        inactive: true,
        hide: ["COMPANY_ADMIN", "ADMIN"].indexOf(this.pageListingMode) >= 0,
      },
      {
        key: 'actions',
        name: $localize`:@@productLabelPurchaseOrder.sortOptions.actions.name:Actions`,
        inactive: true
      }
    ]
    if (this.mode === 'PURCHASE') {
      this.sortingParams$.next({ sortBy: 'date', sort: 'DESC' })
    }
    if (this.mode === 'GENERAL') {
      this.sortingParams$.next({ sortBy: 'lastChange', sort: 'DESC' })
    }
  }

  ngOnDestroy() {
    if (this.clickSubscription) this.clickSubscription.unsubscribe();
    if (this.clearCheckboxesSubscription) this.clearCheckboxesSubscription.unsubscribe();
  }


  orders$

  initializeObservable() {
    this.orders$ = combineLatest(this.reloadPingList$, this.paging$, this.sortingParams$, this.openBalanceOnly$, this.facilityId$, this.purchaseOrderOnly$, this.availableOnly$, this.semiProductId$, this.wayOfPaymentPing$, this.womenOnlyPing$, this.deliveryDatesPing$, this.queryFarmerNameSurnamePing$,
      (ping: boolean, page: number, sorting: any, openBalance: boolean, facilityId: string, purchaseOrderOnly: boolean, availableOnly: boolean, semiProductId: string, wayOfPayment: string, womensCoffee: boolean, deliveryDates: DeliveryDates, query: string) => {
        return {
          ...sorting,
          offset: (page - 1) * this.pageSize,
          limit: this.pageSize,
          openBalance: openBalance,
          facilityId: facilityId,
          wayOfPayment: wayOfPayment,
          purchaseOrderOnly,
          availableOnly,
          semiProductId,
          womensCoffee: womensCoffee,
          productionDateStart: deliveryDates.from,
          productionDateEnd: deliveryDates.to,
          query: query
        }
      }).pipe(
        tap(val => this.globalEventsManager.showLoading(true)),
        switchMap(params => {
          // console.log(params)
          let openBalance = params.openBalance;
          let facilityId = params.facilityId;
          let wayOfPayment = params.wayOfPayment;
          let query = params.query
          delete params.openBalance;
          delete params.facilityId;
          delete params.wayOfPayment;
          delete params.query;
          return this.loadEntityList(params, openBalance, facilityId, wayOfPayment, query)
        }),
        map((resp: ApiResponsePaginatedListChainStockOrder) => {
          if (resp) {
            // this.clearCBs();
            this.showedOrders = 0;
            if (resp.data && resp.data.count && (this.pageSize - resp.data.count > 0)) this.showedOrders = resp.data.count;
            else if (resp.data && resp.data.count && (this.pageSize - resp.data.count <= 0)) {
              let temp = resp.data.count - (this.pageSize * (this.page - 1));
              this.showedOrders = temp >= this.pageSize ? this.pageSize : temp;
            }
            this.showing.emit(this.showedOrders);
            if (resp.data) {
              this.currentData = resp.data.items;
              this.addCheckboxesIfNeeded();
            }
            return resp.data
          } else {
            return null
          }
        }),
        tap(val => {
          if (val) {
            this.allOrders = val.count
            this.countAll.emit(this.allOrders);
          } else {
            this.allOrders = 0;
            this.countAll.emit(0)
          }
        }),
        tap(val => this.globalEventsManager.showLoading(false)),
        shareReplay(1)
      )
  }

  addCheckboxesIfNeeded() {
    for (let item of this.selectedOrders) {
      for (let data of this.currentData) {
        if (item._id === data._id) {
          data.selected = true;
        }
      }
    }
  }

  loadEntityList(params: any, openBalanceOnly: boolean, facilityId: string, wayOfPayment: string, query: string) {
    if (query && query === "") query = null;
    // if (!facilityId) {
    //   if (!wayOfPayment) return this.chainStockOrderService.listStockOrdersForOrganizationByMap({ ...params, organizationId: this.organizationId, showPurchaseOrderOpenBalanceOnly: openBalanceOnly })
    //   else return this.chainStockOrderService.listStockOrdersForOrganizationByMap({ ...params, organizationId: this.organizationId, showPurchaseOrderOpenBalanceOnly: openBalanceOnly, wayOfPayment: wayOfPayment })

    // console.log("params:", params, this.mode)

    if (this.mode === 'PURCHASE') {
      // console.log("PURCHASE!!!")
      if (!facilityId) {
        if (!wayOfPayment) return this.chainStockOrderService.listStockOrdersForOrganizationByMap({ ...params, organizationId: this.organizationId, showPurchaseOrderOpenBalanceOnly: openBalanceOnly, query: query })
        else return this.chainStockOrderService.listStockOrdersForOrganizationByMap({ ...params, organizationId: this.organizationId, showPurchaseOrderOpenBalanceOnly: openBalanceOnly, wayOfPayment: wayOfPayment, query: query })
      }
      if (!wayOfPayment) return this.chainStockOrderService.listStockForFacilityByMap({ ...params, facilityId: facilityId, showPurchaseOrderOpenBalanceOnly: openBalanceOnly, query: query })
      else return this.chainStockOrderService.listStockForFacilityByMap({ ...params, facilityId: facilityId, showPurchaseOrderOpenBalanceOnly: openBalanceOnly, wayOfPayment: wayOfPayment, query: query })
    }
    if (this.mode === 'GENERAL') {
      if (!facilityId) return of(
        {
          data: {
            count: 0,
            items: []
          },
          status: 'OK'
        }
      )
      return this.chainStockOrderService.listStockForFacilityByMap({ ...params, facilityId: facilityId })

    }
  }

  edit(order: ChainStockOrder) {
    if (this.pageListingMode === 'PURCHASE_ORDERS') {
      this.router.navigate(['product-labels', this.productId, 'stock', 'purchases', 'update', dbKey(order)]);
    } else {
      switch (order.orderType as StockOrderType) {
        case 'PURCHASE_ORDER':
          this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'purchase-order', 'update', dbKey(order)]);
          return;
        case 'GENERAL_ORDER':
          this.router.navigate(['product-labels', this.productId, 'stock', 'processing', 'update', 'shipment-order', dbKey(order)]);
          return;
        case 'PROCESSING_ORDER':
          this.router.navigate(['product-labels', this.productId, 'stock', 'processing', 'update', 'processing-order', dbKey(order)]);
          return;
        case 'SALES_ORDER':
          this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'sales-order', 'update', dbKey(order)]);
          return;
        case 'TRANSFER_ORDER':
          this.router.navigate(['product-labels', this.productId, 'stock', 'processing', 'update', 'transfer-order', dbKey(order)]);
          return;

        default:
          this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'purchase-order', 'update', dbKey(order)]);
          break;
      }
      // this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'update', dbKey(order)]);
    }
  }

  canDelete(order: ChainStockOrder) {
    if (order.orderType === 'PROCESSING_ORDER') return true
    if (order.orderType === 'TRANSFER_ORDER') return true
    if (order.orderType === 'GENERAL_ORDER') return Math.abs(order.fullfilledQuantity - order.availableQuantity) < 0.0000000001
    return true
  }

  payment(order) {
    this.router.navigate(['product-labels', this.productId, 'stock', 'payments', 'purchase-order', dbKey(order), 'new']);
  }

  farmerProfile(id) {
    this.router.navigate(['product-labels', this.productId, 'stakeholders', 'farmers', 'update', id], { queryParams: { returnUrl: this.router.routerState.snapshot.url } });
  }

  async removeEntity(entity: ChainStockOrder) {
    if (entity.orderType === 'PROCESSING_ORDER' || entity.orderType === 'TRANSFER_ORDER' || entity.orderType === 'GENERAL_ORDER') {
      let res = await this.chainProcessingOrderService.getProcessingOrder(entity.processingOrderId).pipe(take(1)).toPromise()
      if (res && res.status === 'OK') {
        // console.log("DELETING")
        return this.chainProcessingOrderService.deleteProcessingOrder(res.data).pipe(take(1)).toPromise()
      }
      throw Error($localize`:@@productLabelPurchaseOrder.deleteProcessingOrder.gettingProcessingOrder.error.message: Error occured while deleting.`)
    }
    return this.chainStockOrderService.deleteStockOrder(entity).pipe(take(1)).toPromise()
  }

  async delete(entity) {
    let result;
    if (entity.orderType === 'PROCESSING_ORDER' || entity.orderType === 'TRANSFER_ORDER') {
      result = await this.globalEventsManager.openMessageModal({
        type: 'warning',
        message: $localize`:@@productLabelPurchaseOrder.deleteProcessingOrder.error.message:Are you sure you want to delete the order? This will delete processing transaction and possibly all orders generated from it.`,
        options: { centered: true }
      });
    } else {
      result = await this.globalEventsManager.openMessageModal({
        type: 'warning',
        message: $localize`:@@productLabelPurchaseOrder.delete.error.message:Are you sure you want to delete the order?`,
        options: { centered: true }
      });
    }
    if (result != "ok") return
    delete entity.selected
    try {
      this.globalEventsManager.showLoading(true)
      let res = await this.removeEntity(entity)
      if (res && res.status == 'OK') {
        this.reloadPage()
      }
    } finally {
      this.globalEventsManager.showLoading(false)
    }
  }

  showPagination() {
    if (((this.showedOrders - this.pageSize) == 0 && this.allOrders >= this.pageSize) || this.page > 1) return true;
    else return false
  }


  farmerName(farmer: ChainUserCustomer) {
    if (farmer) {
      const cell = farmer.location ? (farmer.location.cell ? farmer.location.cell.substring(0, 2).toLocaleUpperCase() : "--") : "--";
      const village = farmer.location ? (farmer.location.village ? farmer.location.village.substring(0, 2).toLocaleUpperCase() : "--") : "--";
      return farmer.name + " " + farmer.surname + " (" + farmer.userCustomerId + ", " + village + "-" + cell + ")";
    }
    return "";
  }

  formatDate(productionDate) {
    if (productionDate) return formatDateWithDots(productionDate);
    return "";
  }

  cbSelected(order: ChainStockOrder, index: number) {
    if (this.allSelected) {
      this.allSelected = false;
      this.cbCheckedAll.setValue(false);
    }
    this.currentData[index].selected = !this.currentData[index].selected;
    this.select(order);
  }


  clearCBs() {
    this.selectedOrders = [];
    this.allSelected = false;
    this.cbCheckedAll.setValue(false);
    this.selectedIdsChanged.emit(this.selectedOrders);
    for (let item of this.currentData) {
      if (item.selected) item.selected = false;
    }
  }

  addPayments() {
    let poIds = [];
    for (let item of this.selectedOrders) poIds.push(dbKey(item));
    this.router.navigate(['product-labels', this.productId, 'stock', 'payments', 'purchases', 'bulk-payment', poIds.toString(), 'new', 'PO']);
  }

  select(order) {
    const index = this.selectedOrders.indexOf(order);

    if (index !== -1) {
      this.selectedOrders.splice(index, 1);
    } else {
      this.selectedOrders.push(order);
    }
    this.selectedIdsChanged.emit(this.selectedOrders);
  }

  selectAll(checked) {
    if (checked) {
      this.selectedOrders = [];
      for (let item of this.currentData) {
        // if (item.balance > 0)
        this.selectedOrders.push(item);
      }
      this.currentData.map(item => { item.selected = true; return item; })
      this.allSelected = true;
      this.selectedIdsChanged.emit(this.selectedOrders);
    } else {
      this.selectedOrders = [];
      this.allSelected = false;
      this.currentData.map(item => { item.selected = false; return item; })
      this.selectedIdsChanged.emit(this.selectedOrders);
    }
  }

  itemToShow: ChainStockOrder;

  view(item: ChainStockOrder) {
    this.itemToShow = item;
  }

  history(item: ChainStockOrder) {
    this.router.navigate(['stock-orders', 'stock-order', dbKey(item), 'view'], { relativeTo: this.route.parent.parent, queryParams: { returnUrl: this.router.routerState.snapshot.url } })
    // let hist = await this.chainStockOrderService.getHistoryForStockOrder(dbKey(item)).pipe(take(1)).toPromise()
    // if(hist && hist.status === 'OK') {
    //   this.itemToShow = hist.data
    // }
    // let hist = await this.chainStockOrderService.getAggregateArrayForField(dbKey(item), 'GRADE').pipe(take(1)).toPromise()

    // let hist = await this.chainStockOrderService.getAggregatesForStockOrder(dbKey(item)).pipe(take(1)).toPromise()
    // if(hist && hist.status === 'OK') {
    //   this.itemToShow = hist.data
    // }

  }

  orderIdentifier(order: ChainStockOrder) {
    return order && (order.identifier || order.internalLotNumber)
  }
}

