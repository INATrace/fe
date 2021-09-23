import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ProcessingActionService } from 'src/api-chain/api/processingAction.service';
import { ProcessingOrderService } from 'src/api-chain/api/processingOrder.service';
import { ApiResponsePaginatedListChainProcessingOrder } from 'src/api-chain/model/apiResponsePaginatedListChainProcessingOrder';
import { ChainProcessingOrder } from 'src/api-chain/model/chainProcessingOrder';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { ChainUserCustomer } from 'src/api-chain/model/chainUserCustomer';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { environment } from 'src/environments/environment';
import { dbKey, formatDateWithDots } from 'src/shared/utils';

@Component({
  selector: 'app-product-label-stock-processing-order-list',
  templateUrl: './product-label-stock-processing-order-list.component.html',
  styleUrls: ['./product-label-stock-processing-order-list.component.scss']
})
export class ProductLabelStockProcessingOrderListComponent implements OnInit {

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false);
  @Input()
  facilityId$ = new BehaviorSubject<string>("");;

  allOrders: number = 0;
  showedOrders: number = 0;

  clickSubscription: Subscription;

  @Input()
  selectedOrders: ChainProcessingOrder[];

  cbCheckedAll = new FormControl(false);

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  @Output()
  selectedIdsChanged = new EventEmitter<ChainProcessingOrder[]>();

  productId = this.route.snapshot.params.id;
  pagingParams$ = new BehaviorSubject({})
  sortingParams$ = new BehaviorSubject({ sortBy: 'name', sort: 'ASC' })
  paging$ = new BehaviorSubject<number>(1);
  page: number = 0;
  pageSize = 10;
  currentData;
  allSelected: boolean = false;

  constructor(
    private chainProcessingOrderService: ProcessingOrderService,
    private chainProcessingActionService: ProcessingActionService,
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  onPageChange(event) {
    this.paging$.next(event);
    this.clearCBs();
  }

  reloadPage() {
    setTimeout(() => this.reloadPingList$.next(true), environment.reloadDelay)
    this.clearCBs();
  }

  changeSort(event) {
    if (event.key === "cb") {
      this.selectAll(event.checked);
      return;
    }
    this.sortingParams$.next({ sortBy: event.key, sort: event.sortOrder })
    this.clearCBs();
  }

  sortOptions;

  ngOnInit(): void {
    this.initializeObservable();
    // this.clickSubscription = this.clickAddPaymentsPing$.subscribe(val => {
    //   if (val) this.addPayments();
    // });
    this.sortOptions = [
      // {
      //   key: 'cb',
      //   selectAllCheckbox: ["PURCHASE_ORDERS"].indexOf(this.pageListingMode) >= 0,
      //   hide: ["COMPANY_ADMIN", "ADMIN"].indexOf(this.pageListingMode) >= 0,
      // },
      {
        key: 'lastChange',
        name: $localize`:@@productLabelProcessingOrder.sortOptions.date.name:Date`,
        // defaultSortOrder: 'DESC',
        // inactive: true
      },
      // {
      //   key: 'facility',
      //   name: $localize`:@@productLabelProcessingOrder.sortOptions.facility.name:Facility`,
      //   inactive: true
      // },
      {
        key: 'processingAction',
        name: $localize`:@@productLabelProcessingOrder.sortOptions.procesingAction.name:Processing action`,
        inactive: true
      },
      {
        key: 'actions',
        name: $localize`:@@productLabelProcessingOrder.sortOptions.actions.name:Actions`,
        inactive: true
      }

    ]

  }

  ngOnDestroy() {
    if (this.clickSubscription) this.clickSubscription.unsubscribe();
  }


  orders$

  initializeObservable() {
    this.orders$ = combineLatest(this.reloadPingList$, this.paging$, this.sortingParams$,
      (ping: boolean, page: number, sorting: any) => {
        // console.log("SRT:", sorting)
        return {
          ...sorting,
          offset: (page - 1) * this.pageSize,
          limit: this.pageSize,
          // facilityId: facilityId,
        }
      }).pipe(
        tap(val => this.globalEventsManager.showLoading(true)),
        switchMap(params => {
          return this.loadEntityList(params)
        }),
        map((resp: ApiResponsePaginatedListChainProcessingOrder) => {
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
    // console.log("EMITING:", params)

    return this.chainProcessingOrderService.listProcessingOrdersByMap({ ...params })
  }

  async edit(order: ChainProcessingOrder) {
    let targets = order.targetStockOrderIds
    if (!targets || targets.length === 0) return
    let action = await this.chainProcessingActionService.getProcessingAction(order.processingActionId).pipe(take(1)).toPromise()
    if (action.data.type === 'PROCESSING') {
      this.router.navigate(['product-labels', this.productId, 'stock', 'processing', 'update', 'processing-order', targets[0]]);
    }
    if (action.data.type === 'TRANSFER') {
      this.router.navigate(['product-labels', this.productId, 'stock', 'processing', 'update', 'transfer-order', targets[0]]);
    }
    // if (this.pageListingMode === 'PURCHASE_ORDERS') {
    //   this.router.navigate(['product-labels', this.productId, 'stock', 'purchases', 'update', dbKey(order)]);
    // } else {
    //   this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'update', dbKey(order)]);
    // }
  }

  payment(order) {
    this.router.navigate(['product-labels', this.productId, 'stock', 'payments', 'purchase-order', dbKey(order), 'new']);
  }

  removeEntity(entity) {
    delete entity.targetStockOrders
    return this.chainProcessingOrderService.deleteProcessingOrder(entity);
  }

  async delete(entity: ChainProcessingOrder) {
    // console.log("DEL:", entity)
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelProcessingOrder.delete.error.message:Are you sure you want to delete the processing order?`,
      options: { centered: true }
    });
    if (result != "ok") return
    try {
      this.globalEventsManager.showLoading(true)
      let res = await this.removeEntity(entity).pipe(take(1)).toPromise();
      if (res && res.status == 'OK') {
        setTimeout(() => this.reloadPage(), environment.reloadDelay)
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
      return farmer.name + " " + farmer.surname + " (" + farmer.userCustomerId + ")";
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
  }

  addPayments() {
    let poIds = [];
    for (let item of this.selectedOrders) poIds.push(dbKey(item));
    this.router.navigate(['product-labels', this.productId, 'stock', 'payments', 'purchases', 'bulk-payment', poIds.toString(), 'new']);
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
        if (item.balance > 0)
          this.selectedOrders.push(item);
      }
      this.currentData.map(item => { if (item.balance > 0) { item.selected = true; return item; } })
      this.allSelected = true;
      this.selectedIdsChanged.emit(this.selectedOrders);
    } else {
      this.selectedOrders = [];
      this.allSelected = false;
      this.currentData.map(item => { item.selected = false; return item; })
      this.selectedIdsChanged.emit(this.selectedOrders);
    }
  }

  processingOrderToShow: ChainProcessingOrder;

  view(order: ChainProcessingOrder) {
    if (this.processingOrderToShow == order) {
      this.processingOrderToShow = null
      return
    }
    this.processingOrderToShow = order;
  }

}

