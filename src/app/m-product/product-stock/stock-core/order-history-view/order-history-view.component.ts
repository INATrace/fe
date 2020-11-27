import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCheckCircle, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ProcessingOrderService } from 'src/api-chain/api/processingOrder.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { TransactionService } from 'src/api-chain/api/transaction.service';
import { ChainProcessingOrder } from 'src/api-chain/model/chainProcessingOrder';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { ChainTransaction } from 'src/api-chain/model/chainTransaction';
// import { KeyAggregates } from 'src/api-chain/model/keyAggregates';
import { ProcessingOrderHistory } from 'src/api-chain/model/processingOrderHistory';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { dbKey } from 'src/shared/utils';
import { RejectTransactionModalComponent } from '../reject-transaction-modal/reject-transaction-modal.component';


// interface KeyAggregatesForStockOrder {
//   stockOrderId?: string;
//   identifier?: string;
//   quantity?: number;
//   measurementUnit?: string;
// }

@Component({
  selector: 'app-order-history-view',
  templateUrl: './order-history-view.component.html',
  styleUrls: ['./order-history-view.component.scss']
})
export class OrderHistoryViewComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chainStockOrderService: StockOrderService,
    private chainProcessinOrderService: ProcessingOrderService,
    private modalService: NgbModalImproved,
    private globalEventsManager: GlobalEventManagerService,
    private chainTransactionService: TransactionService
  ) {
  }

  faCheckCircle = faCheckCircle
  faExclamationCircle = faExclamationCircle
  faTimes = faTimes

  returnUrl = this.route.snapshot.queryParams['returnUrl'];

  _rootStockOrder: ChainStockOrder;
  reloadPing$ = new BehaviorSubject<boolean>(false)

  history$ = combineLatest(this.reloadPing$, this.route.params,
    (ping: boolean, params: any ) =>
     {
      return params
    })
  .pipe(
    tap(val => this.globalEventsManager.showLoading(true)),
    switchMap(val => {
      return this.chainStockOrderService.getAggregatesForStockOrder(val.stockOrderId)
    }),
    map(val => {
      if (val && val.status === "OK") {
        return val.data
      }
      return null
    }),
    tap(val => {
      this._rootStockOrder = this.rootStockOrder(val)
    }),
    tap(val => this.globalEventsManager.showLoading(false)),
    shareReplay(1)
  )

  rootStockOrder(history: ProcessingOrderHistory[]): ChainStockOrder {
    if (history.length === 0) return null
    let root = history.find(x => x.depth === 0)
    // console.log("ROOT:", root.stockOrderAggs[0].stockOrder)
    return root.stockOrderAggs[0].stockOrder
    // if (history[0].stockOrderAggs.length === 0) return null
    // return history[0].stockOrderAggs[0].stockOrder
  }

  isRoot(root: ChainStockOrder, one: ChainStockOrder) {
    return dbKey(root) === dbKey(one)
  }


  processingOrderName(aggregate: ProcessingOrderHistory) {
    if (aggregate.processingOrder) {
      if (aggregate.processingOrder.processingAction) {
        return aggregate.processingOrder.processingAction.name
      } else {
        return $localize`:@@orderHistoryView.processingOrderName.corruptedHistory: Corrupted history - processing action deleted`;
      }
    }
    return $localize`:@@orderHistoryView.processingOrderName.purchase:Purchase`;
  }

  processingCreationDate(aggregate: ProcessingOrderHistory) {
    if (!aggregate.processingOrder) return null
    return aggregate.processingOrder.created
  }

  processingLastChangeDate(aggregate: any) {
    return (aggregate.processingOrder as ChainProcessingOrder).lastChange
  }

  // groupAggregatesByStockOrder(aggregates: KeyAggregates[]): KeyAggregatesForStockOrder[] {
  //   let stockOrderIds = new Map<string, KeyAggregatesForStockOrder>()
  //   for (let aggregate of aggregates) {
  //     let aggs = aggregate.aggregates;
  //     aggs.forEach(agg => {
  //       stockOrderIds.set(agg.stockOrderId,
  //         {
  //           ...aggregate,
  //           stockOrderId: agg.stockOrderId,
  //           aggregates: []
  //         }
  //       )
  //     });
  //   }

  //   for (let aggregate of aggregates) {
  //     let aggs = aggregate.aggregates;
  //     aggs.forEach(agg => {
  //       let tmpAgg = stockOrderIds.get(agg.stockOrderId)
  //       tmpAgg.aggregates.push(agg)
  //       tmpAgg.identifier = agg.identifier
  //       tmpAgg.quantity = agg.quantity
  //       tmpAgg.measurementUnit = agg.measurementUnit.label
  //     });
  //   }
  //   return [...stockOrderIds.keys()].map(stockOrderId => stockOrderIds.get(stockOrderId))
  // }

  // actionData$ = this.history$.pipe(
  //   tap(val => console.log(val)),
  //   map(history => {
  //     let max = Math.max(...history.fieldAggregates.map(x => x.depth))
  //     let aggregates = (Array.apply(null, new Array(max + 1))).map(x => {
  //       return {
  //         created: history.stockOrder.created,
  //         lastChange: history.stockOrder.lastChange,
  //         fieldAggregates: [] as KeyAggregates[],
  //         docAggregates: [] as KeyAggregates[]
  //       }
  //     })
  //     // console.log(aggregates)
  //     history.fieldAggregates.forEach(agg => {
  //       aggregates[agg.depth].fieldAggregates.push(agg)
  //     })

  //     history.documentAggregates.forEach(agg => {
  //       aggregates[agg.depth].docAggregates.push(agg)
  //     })

  //     // for(let agg of aggregates) {
  //     //   agg.fieldAggregates = this.groupAggregatesByStockOrder(agg.fieldAggregates)
  //     // }
  //     let aggregates2 = this.groupAggregatesByStockOrder(aggregates)
  //     console.log("AGG2:", aggregates, aggregates2)
  //     return aggregates;
  //   }),
  //   shareReplay(1)
  // )

  // this.chainStockOrderService.getAggregatesForStockOrder(stockOrderId).pipe(
  //   map(val => {
  //     if(val && val.status === "OK") {
  //       return val.data
  //     }
  //     return null
  //   })
  // )

  // history$;
  ngOnInit() {
    // console.log("INIT")
    // let stockOrderId = this.route.snapshot.params.stockOrderId
  }

  goToInput(tx: ChainTransaction) {
    this.router.navigate(['stock-order', tx.sourceStockOrderId, 'view'], { relativeTo: this.route.parent })
  }


  async goToOutput(tx: ChainTransaction) {
    if (!tx.isProcessing) {
      this.router.navigate(['stock-order', tx.targetStockOrderId, 'view'], { relativeTo: this.route.parent })
    } else {
      let res = await this.chainProcessinOrderService.getProcessingOrder(tx.targetStockOrderId).pipe(take(1)).toPromise()
      if (res && res.status == 'OK') {
        if (res.data.targetStockOrders && res.data.targetStockOrderIds.length > 0) {
          this.router.navigate(['stock-order', res.data.targetStockOrderIds[0], 'view'], { relativeTo: this.route.parent })
        }
      }
    }
  }

  goToSibiling(order: ChainStockOrder) {
    this.router.navigate(['stock-order', dbKey(order), 'view'], { relativeTo: this.route.parent })
  }

  goToOrderView(order: ChainStockOrder) {
    this.router.navigate(['stock-order', dbKey(order), 'view'], { relativeTo: this.route.parent })
  }


  isThisOrder(currentOrder: ChainStockOrder, toShowOrder: ChainStockOrder) {
    return dbKey(currentOrder) == dbKey(toShowOrder)
  }

  areAnyFields(aggregate) {
    return aggregate.fieldAggregates.length > 0 && aggregate.fieldAggregates.filter(x => x.key != '__CONFIG__').length > 0
  }

  productId = this.route.snapshot.params.id;

  orderType(stockOrder: ChainStockOrder) {
    let ordType = stockOrder.processingAction.type
    console.log("ordType", ordType)
    switch (ordType) {
      case 'PROCESSING': return 'processing-order'
      case 'SHIPMENT': return 'shipment-order'
      case 'TRANSFER': return 'transfer-order'
      default:
        throw Error("Wrong processing action type: " + ordType)
    }
  }
  edit(stockOrder: ChainStockOrder) {
    this.router.navigate(['product-labels', this.productId, 'stock', 'processing', 'update', this.orderType(stockOrder), dbKey(this._rootStockOrder)]);
  }


  qrCodeString(stockOrder: ChainStockOrder) {
    if (!stockOrder) return
    return dbKey(stockOrder)
  }

  copyToClipboard() {
    document.execCommand('copy');
  }

  qrCodeSize = 150

  // async rejectInput(transaction: ChainTransaction) {
  //   const modalRef = this.modalService.open(RejectTransactionModalComponent, { centered: true });
  //   Object.assign(modalRef.componentInstance, {
  //     title: $localize`:@@orderHistoryView.rejectTransaction.modal.title:Reject transaction`,
  //     instructionsHtml: $localize`:@@orderHistoryView.rejectTransaction.modal.instructionsHtml:Comment`,
  //   })
  //   let comment = await modalRef.result;
  //   if (comment) {
  //     let res = await this.chainTransactionService.cancelTransactions(transaction._id, comment).pipe(take(1)).toPromise();
  //     this.reloadPing$.next(true);

  //   }
  // }

  transactionColor(tx) {
    if (tx.status === 'CANCELED') return 'ab-edit-link canceled';
    return 'ab-edit-link'
  }
}
