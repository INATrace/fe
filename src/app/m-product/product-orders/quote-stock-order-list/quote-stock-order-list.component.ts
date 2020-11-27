import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ProcessingOrderService } from 'src/api-chain/api/processingOrder.service';
import { ListQuoteOrders, StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ApiResponsePaginatedListChainStockOrder } from 'src/api-chain/model/apiResponsePaginatedListChainStockOrder';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { GenerateQRCodeModalComponent } from 'src/app/components/generate-qr-code-modal/generate-qr-code-modal.component';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { dbKey, formatDateWithDots } from 'src/shared/utils';
import { RejectTransactionModalComponent } from '../../product-stock/stock-core/reject-transaction-modal/reject-transaction-modal.component';

@Component({
  selector: 'app-quote-stock-order-list',
  templateUrl: './quote-stock-order-list.component.html',
  styleUrls: ['./quote-stock-order-list.component.scss']
})
export class QuoteOrderListComponent implements OnInit {

  @Input()
  mode: 'INPUT' | 'CUSTOMER' = 'INPUT'

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false);
  @Input()
  facilityId$ = new BehaviorSubject<string>("");;
  @Input()
  semiProductId$ = new BehaviorSubject<string>(null)
  @Input()
  companyCustomerId$ = new BehaviorSubject<string>(null)

  @Input()
  openOnly$ = new BehaviorSubject<boolean>(false);

  @Input()
  organizationId: string = null

  allOrders: number = 0;
  showedOrders: number = 0;

  clickSubscription: Subscription;

  @Input()
  selectedOrders: ChainStockOrder[];

  cbCheckedAll = new FormControl(false);

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  @Output()
  selectedIdsChanged = new EventEmitter<ChainStockOrder[]>();

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
    private modalService: NgbModalImproved,
    private router: Router
  ) { }

  onPageChange(event) {
    this.paging$.next(event);
    // this.clearCBs();
  }

  reloadPage() {
    this.reloadPingList$.next(true)
    // this.clearCBs();
  }

  changeSort(event) {
    if (event.key === "cb") {
      // this.selectAll(event.checked);
      return;
    }
    this.sortingParams$.next({ sortBy: event.key, sort: event.sortOrder })
    // this.clearCBs();
  }

  sortOptions;

  ngOnInit(): void {
    this.initializeObservable();
    this.sortOptions = [
      {
        key: 'deliveryTime',
        name: $localize`:@@orderList.sortOptions.dateOfDelivery.name:Date of delivery`,
      },
      {
        key: 'semiProduct',
        name: $localize`:@@orderList.sortOptions.semiProduct.name:SKU`,
        inactive: true,
      },
      {
        key: 'client',
        name: $localize`:@@orderList.sortOptions.client.name:Client`,
        inactive: true,
        hide: this.mode === 'CUSTOMER'
      },
      {
        key: 'customer',
        name: $localize`:@@orderList.sortOptions.customer.name:Customer`,
        inactive: true,
        hide: this.mode === 'INPUT'
      },
      {
        key: 'orderId',
        name: $localize`:@@orderList.sortOptions.orderId.name:Order ID`,
        inactive: true,
        // hide: this.mode === 'INPUT'
      },
      {
        key: 'toFacility',
        name: $localize`:@@orderList.sortOptions.toFacility.name:To facility`,
        inactive: true,
        hide: this.mode === 'CUSTOMER'
      },
      {
        key: 'orderedTo',
        name: $localize`:@@orderList.sortOptions.orderedTo.name:Ordered to`,
        inactive: true,
        hide: this.mode === 'INPUT'
      },
      {
        key: 'fullfilled',
        name: $localize`:@@orderList.sortOptions.quantityFulfilled.name:Quantity / Fulfilled`,
        inactive: true,
      },
      {
        key: 'unit',
        name: $localize`:@@orderList.sortOptions.unit.name:Unit`,
        inactive: true,
      },
      {
        key: 'kilos',
        name: $localize`:@@orderList.sortOptions.kgs.name:kgs`,
        inactive: true,
      },
      {
        key: 'lastChange',
        name: $localize`:@@orderList.sortOptions.lastChange.name:Time of last change`,
        defaultSortOrder: 'DESC',
      },
      {
        key: 'actions',
        name: $localize`:@@orderList.sortOptions.actions.name:Actions`,
        inactive: true
      }
    ]
    this.sortingParams$.next({ sortBy: 'lastChange', sort: 'DESC' })
  }

  ngOnDestroy() {
    if (this.clickSubscription) this.clickSubscription.unsubscribe();
  }


  orders$

  initializeObservable() {
    // this.semiProductId$.subscribe(val => console.log("SP:", val))
    // console.log("INITIALIZE", this.organizationId)
    this.orders$ = combineLatest(this.reloadPingList$, this.paging$, this.sortingParams$, this.facilityId$, this.semiProductId$, this.openOnly$, this.companyCustomerId$,
      (ping: boolean, page: number, sorting: any, facilityId: string, semiProductId: string, openOnly: boolean, companyCustomerId: string) => {
        return {
          ...sorting,
          offset: (page - 1) * this.pageSize,
          limit: this.pageSize,
          // facilityId,
          facilityOrOrganizationId: facilityId ? facilityId : this.organizationId,
          mode: facilityId ? 'facility' : 'organization',
          semiProductId,
          openOnly,
          companyCustomerId
        } as ListQuoteOrders.PartialParamMap
      }).pipe(
        filter(val => {
          // console.log(val)
          return !!val.facilityOrOrganizationId
        }),
        tap(val => this.globalEventsManager.showLoading(true)),
        switchMap(params => {
          return this.loadEntityList(params)
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
            this.currentData = resp.data.items;
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

  loadEntityList(params: any) {
    let openOnly = params.openOnly;
    if (this.mode === 'INPUT') {
      let pars = { ...params }
      return this.chainStockOrderService.listQuoteOrdersByMap(pars)
      // delete pars.openOnly
      // if (!openOnly) {
      //   return this.chainStockOrderService.listAllQuoteOrdersByMap(pars)
      // } else {
      //   return this.chainStockOrderService.listOpenQuoteOrdersByMap(pars)
      // }
    } else if (this.mode == 'CUSTOMER') {
      // let pars = { ...params, facilityId: params.facilityOrOrganizationId }
      let pars = { ...params }
      delete pars.semiProductId
      // if(pars.mode === 'organization') {
      //   delete pars.mode
      //   delete pars.facilityOrOrganizationId
      // }
      // console.log("PARXX:", pars)
      return this.chainStockOrderService.listStockInFacilityForCustomersByMap(pars)
    }
    throw Error("Wrong mode: " + this.mode)
  }

  edit(order: ChainStockOrder) {
    this.router.navigate(['product-labels', this.productId, 'stock', 'processing', 'update', 'shipment-order', dbKey(order)]);
  }

  canDelete(order: ChainStockOrder) {
    if (order.orderType === 'PROCESSING_ORDER') return true
    if (order.orderType === 'TRANSFER_ORDER') return true
    if (order.orderType === 'GENERAL_ORDER') return this.mode != 'INPUT' && Math.abs(order.fullfilledQuantity - order.availableQuantity) < 0.0000000001
    return true
  }

  // payment(order) {
  //   this.router.navigate(['product-labels', this.productId, 'stock', 'payments', 'purchase-order', dbKey(order), 'new']);
  // }

  async removeEntity(entity: ChainStockOrder) {
    // if (entity.orderType === 'PROCESSING_ORDER' || entity.orderType === 'TRANSFER_ORDER') {
    let res = await this.chainProcessingOrderService.getProcessingOrder(entity.processingOrderId).pipe(take(1)).toPromise()
    if (res && res.status === 'OK') {
      return this.chainProcessingOrderService.deleteProcessingOrder(res.data).pipe(take(1)).toPromise()
    }
    throw Error($localize`:@@orderList.deleteProcessingOrder.gettingProcessingOrder.error.message: Error occured while deleting.`)
    // }
    // return this.chainStockOrderService.deleteStockOrder(entity).pipe(take(1)).toPromise()
  }

  async delete(entity) {
    let result;
    if (entity.orderType === 'PROCESSING_ORDER' || entity.orderType === 'TRANSFER_ORDER') {
      result = await this.globalEventsManager.openMessageModal({
        type: 'warning',
        message: $localize`:@@orderList.deleteProcessingOrder.error.message:Are you sure you want to delete the order? This will delete processing transaction and possibly all orders generated from it.`,
        options: { centered: true }
      });
    } else {
      result = await this.globalEventsManager.openMessageModal({
        type: 'warning',
        message: $localize`:@@orderList.delete.error.message:Are you sure you want to delete the order?`,
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


  // farmerName(farmer: ChainUserCustomer) {
  //   if (farmer) {
  //     return farmer.name + " " + farmer.surname + " (" + farmer.userCustomerId + ")";
  //   }
  //   return "";
  // }

  formatDate(productionDate) {
    if (productionDate) return formatDateWithDots(productionDate);
    return "";
  }

  // cbSelected(order: ChainStockOrder, index: number) {
  //   if (this.allSelected) {
  //     this.allSelected = false;
  //     this.cbCheckedAll.setValue(false);
  //   }
  //   this.currentData[index].selected = !this.currentData[index].selected;
  //   this.select(order);
  // }


  // clearCBs() {
  //   this.selectedOrders = [];
  //   this.allSelected = false;
  //   this.cbCheckedAll.setValue(false);
  //   this.selectedIdsChanged.emit(this.selectedOrders);
  // }

  // addPayments() {
  //   let poIds = [];
  //   for (let item of this.selectedOrders) poIds.push(dbKey(item));
  //   this.router.navigate(['product-labels', this.productId, 'stock', 'payments', 'purchases', 'bulk-payment', poIds.toString(), 'new']);
  // }

  // select(order) {
  //   const index = this.selectedOrders.indexOf(order);

  //   if (index !== -1) {
  //     this.selectedOrders.splice(index, 1);
  //   } else {
  //     this.selectedOrders.push(order);
  //   }
  //   this.selectedIdsChanged.emit(this.selectedOrders);
  // }

  // selectAll(checked) {
  //   if (checked) {
  //     this.selectedOrders = [];
  //     for (let item of this.currentData) {
  //       if (item.balance > 0)
  //         this.selectedOrders.push(item);
  //     }
  //     this.currentData.map(item => { if (item.balance > 0) { item.selected = true; return item; } })
  //     this.allSelected = true;
  //     this.selectedIdsChanged.emit(this.selectedOrders);
  //   } else {
  //     this.selectedOrders = [];
  //     this.allSelected = false;
  //     this.currentData.map(item => { item.selected = false; return item; })
  //     this.selectedIdsChanged.emit(this.selectedOrders);
  //   }
  // }

  itemToShow: ChainStockOrder;

  view(item: ChainStockOrder) {
    this.itemToShow = item;
  }

  history(item: ChainStockOrder) {
    this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'stock-order', dbKey(item), 'view'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } });

    // product-labels/1/stock/stock-orders/stock-order/28ef492e-0685-4abe-834b-f246dbbdf6bd/view
    // this.router.navigate(['stock-orders', 'stock-order', dbKey(item), 'view'], { relativeTo: this.route.parent.parent })
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

  async approveReject(item: ChainStockOrder) {
    const modalRef = this.modalService.open(RejectTransactionModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@orderHistoryView.rejectTransaction.modal.title:Approve / reject transactions`,
      instructionsHtml: $localize`:@@orderHistoryView.rejectTransaction.modal.instructionsHtml:Comment`,
      stockOrderId: item._id
    })
  }

  kgsOf(order: ChainStockOrder) {
    if (order.measurementUnitType.weight) {
      return order.measurementUnitType.weight * order.totalQuantity
    }
    return '-'
  }

  generateQRCodes(stockOrder: ChainStockOrder) {
    const modalRef = this.modalService.open(GenerateQRCodeModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
    Object.assign(modalRef.componentInstance, {
      stockOrderId: dbKey(stockOrder),
      productId: this.productId
    })
    // let company = await modalRef.result;

  }


  payment(order) {
    this.router.navigate(['product-labels', this.productId, 'stock', 'payments', 'customer-order', dbKey(order), 'new'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } });
  }

}

