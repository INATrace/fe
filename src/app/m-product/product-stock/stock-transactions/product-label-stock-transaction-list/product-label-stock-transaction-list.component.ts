import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { TransactionService } from 'src/api-chain/api/transaction.service';
import { ApiResponsePaginatedListChainTransaction } from 'src/api-chain/model/apiResponsePaginatedListChainTransaction';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { ChainTransaction } from 'src/api-chain/model/chainTransaction';
import { ChainUserCustomer } from 'src/api-chain/model/chainUserCustomer';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { environment } from 'src/environments/environment';
import { dbKey, formatDateWithDots } from 'src/shared/utils';

@Component({
  selector: 'app-product-label-stock-transaction-list',
  templateUrl: './product-label-stock-transaction-list.component.html',
  styleUrls: ['./product-label-stock-transaction-list.component.scss']
})
export class ProductLabelTransactionListComponent implements OnInit {

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false);

  @Input()
  sourceFacilityId$ = new BehaviorSubject<string>("");
  @Input()
  targetFacilityId$ = new BehaviorSubject<string>("");
  @Input()
  semiProductId$ = new BehaviorSubject<string>("");
  @Input()
  startDate$ = new BehaviorSubject<string>("");
  @Input()
  endDate$ = new BehaviorSubject<string>("");


  allOrders: number = 0;
  showedOrders: number = 0;

  clickSubscription: Subscription;

  @Input()
  selectedTransactions: ChainTransaction[];

  cbCheckedAll = new FormControl(false);

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  @Output()
  selectedIdsChanged = new EventEmitter<ChainTransaction[]>();

  productId = this.route.snapshot.params.id;
  pagingParams$ = new BehaviorSubject({})
  sortingParams$ = new BehaviorSubject({ sortBy: 'name', sort: 'ASC' })
  paging$ = new BehaviorSubject<number>(1);
  page: number = 0;
  pageSize = 10;
  currentData;
  allSelected: boolean = false;

  reloadDelayMs = 500;

  constructor(
    // private chainStockOrderService: StockOrderService,
    private chainTransactionService: TransactionService,
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  onPageChange(event) {
    this.paging$.next(event);
    this.clearCBs();
  }

  reloadPage() {
    setTimeout(() => {
      this.reloadPingList$.next(true)
      this.clearCBs();
    }, environment.reloadDelay)
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
    this.sortOptions = [
      {
        key: 'cb',
        selectAllCheckbox: false,
        hide: false
      },
      {
        key: 'lastChanged',
        name: $localize`:@@productLabelTransactions.sortOptions.lastChanged.name:Date`,
        defaultSortOrder: 'DESC',
        inactive: true,
      },
      {
        key: 'type',
        name: $localize`:@@productLabelTransactions.sortOptions.transactionType.name:Type`,
        inactive: true,
      },
      {
        key: 'status',
        name: $localize`:@@productLabelTransactions.sortOptions.status.name:Status`,
        inactive: true,
      },
      {
        key: 'inputQuantity',
        name: $localize`:@@productLabelTransactions.sortOptions.inputQuantity.name:Input quantity`,
        inactive: true,
      },
      // {
      //   key: 'outputQuantity',
      //   name: $localize`:@@productLabelTransactions.sortOptions.outputQuantity.name:Output quantity`,
      //   inactive: true,
      // },
      {
        key: 'semiProduct',
        name: $localize`:@@productLabelTransactions.sortOptions.outputQuantity.name:Semi product`,
        inactive: true,
      },
      {
        key: 'sourceFacility',
        name: $localize`:@@productLabelTransactions.sortOptions.sourceFacility.name:From`,
        inactive: true,
      },
      {
        key: 'targetFacility',
        name: $localize`:@@productLabelTransactions.sortOptions.targetFacility.name:To`,
        inactive: true,
      },
      {
        key: 'actions',
        name: $localize`:@@productLabelTransactions.sortOptions.actions.name:Actions`,
        inactive: true
      },
    ]

  }

  ngOnDestroy() {
    if (this.clickSubscription) this.clickSubscription.unsubscribe();
  }


  orders$

  initializeObservable() {
    this.orders$ = combineLatest(this.reloadPingList$, this.paging$, this.sortingParams$, this.sourceFacilityId$, this.targetFacilityId$, this.semiProductId$, this.startDate$, this.endDate$,
      (ping: boolean, page: number, sorting: any, sourceFacilityId: string, targetFacilityId: string, semiProductId: string, startDate: string, endDate: string) => {
        return {
          ...sorting,
          offset: (page - 1) * this.pageSize,
          limit: this.pageSize,
          sourceFacilityId,
          targetFacilityId,
          semiProductId,
          startDate,
          endDate
        }
      }).pipe(
        // tap(val => console.log("XXX:", val)),
        tap(val => this.globalEventsManager.showLoading(true)),
        switchMap(params => {
          return this.loadEntityList(params)
        }),
        map((resp: ApiResponsePaginatedListChainTransaction) => {
          if (resp) {
            this.clearCBs();
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
    return this.chainTransactionService.listTransactionQueryByMap({ ...params })
  }

  edit(order) {
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
    // migration purpose
    delete entity.sourceStockOrderIds
    delete entity.targetStockOrderIds
    delete entity.internalLotNumber
    delete entity.processingEvidence
    delete entity.comments
    delete entity.lotNumber
    return this.chainTransactionService.deleteTransaction(entity);
  }

  async delete(entity) {
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelTransactions.delete.error.message:Are you sure you want to delete the transaction?`,
      options: { centered: true }
    });
    if (result != "ok") return
    delete entity.selected
    try {
      this.globalEventsManager.showLoading(true)
      let res = await this.removeEntity(entity).pipe(take(1)).toPromise();
      if (res && res.status == 'OK') {
        setTimeout(() => this.reloadPage(), this.reloadDelayMs)
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

  cbSelected(order: ChainTransaction, index: number) {
    if (this.allSelected) {
      this.allSelected = false;
      this.cbCheckedAll.setValue(false);
    }
    this.currentData[index].selected = !this.currentData[index].selected;
    this.select(order);
  }


  clearCBs() {
    this.selectedTransactions = [];
    this.allSelected = false;
    this.cbCheckedAll.setValue(false);
    this.selectedIdsChanged.emit(this.selectedTransactions);
  }

  // addPayments() {
  //   let poIds = [];
  //   for (let item of this.selectedTransactions) poIds.push(dbKey(item));
  //   this.router.navigate(['product-labels', this.productId, 'stock', 'payments', 'purchases', 'bulk-payment', poIds.toString(), 'new']);
  // }

  select(order) {
    const index = this.selectedTransactions.indexOf(order);

    if (index !== -1) {
      this.selectedTransactions.splice(index, 1);
    } else {
      this.selectedTransactions.push(order);
    }
    // console.log("SEL:", this.selectedTransactions)
    this.selectedIdsChanged.emit(this.selectedTransactions);
  }

  selectAll(checked) {
    if (checked) {
      this.selectedTransactions = [];
      for (let item of this.currentData) {
        if (item.balance > 0)
          this.selectedTransactions.push(item);
      }
      this.currentData.map(item => { if (item.balance > 0) { item.selected = true; return item; } })
      this.allSelected = true;
      this.selectedIdsChanged.emit(this.selectedTransactions);
    } else {
      this.selectedTransactions = [];
      this.allSelected = false;
      this.currentData.map(item => { item.selected = false; return item; })
      this.selectedIdsChanged.emit(this.selectedTransactions);
    }
  }

  transactionToShow: ChainTransaction;

  view(transaction: ChainTransaction) {
    if (this.transactionToShow == transaction) {
      this.transactionToShow = null
      return
    }
    this.transactionToShow = transaction;
  }

  showInput(transaction: ChainTransaction) {
    console.log("SHOW INPUT")
  }

  showOutput(transaction: ChainTransaction) {
    console.log("SHOW INPUT")
  }

  async changeTransactionStatus(transaction: ChainTransaction, newStatus: string) {
    if (['EXECUTED', 'CANCELED'].indexOf(newStatus) < 0) return
    transaction.status = newStatus
    if (newStatus === 'CANCELED') {
      transaction.inputQuantity = 0
      transaction.outputQuantity = 0
    }
    try {
      this.globalEventsManager.showLoading(true)
      let res = await this.chainTransactionService.postTransaction(transaction).pipe(take(1)).toPromise()
      if (res && res.status === 'OK') {
        setTimeout(() => this.reloadPage(), environment.reloadDelay)
      }
    } finally {
      this.globalEventsManager.showLoading(false)
    }
  }

  canDelete(tx: ChainTransaction) {
    return !tx.isProcessing
  }
}

