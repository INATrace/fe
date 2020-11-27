import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { catchError, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { OrderService } from 'src/api-chain/api/order.service';
import { ProcessingOrderService } from 'src/api-chain/api/processingOrder.service';
import { ChainProcessingOrder } from 'src/api-chain/model/chainProcessingOrder';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { ChainTransaction } from 'src/api-chain/model/chainTransaction';
import { ProcessingOrderHistory } from 'src/api-chain/model/processingOrderHistory';
import { ProductControllerService } from 'src/api/api/productController.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { environment } from 'src/environments/environment';
import { UnsubscribeList } from 'src/shared/rxutils';
import { dbKey, getPath } from 'src/shared/utils';
import { CustomerOrderViewComponent } from '../customer-order-view.component';

@Component({
  selector: 'app-customer-order-history',
  templateUrl: './customer-order-history.component.html',
  styleUrls: ['./customer-order-history.component.scss']
})
export class CustomerOrderHistoryComponent extends CustomerOrderViewComponent {

  rootTab = 2
  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private chainOrderService: OrderService,
    private chainProcessinOrderService: ProcessingOrderService,
    protected codebookTranslations: CodebookTranslations,
    private productController: ProductControllerService,
  ) {
    super(router, route)
  }

  unsubscribeList = new UnsubscribeList()

  public reloadDataPing$ = new BehaviorSubject<boolean>(false);
  public reloadPage() {
    setTimeout(() => this.reloadDataPing$.next(true), environment.reloadDelay)
  }


  faCheckCircle = faCheckCircle
  faExclamationCircle = faExclamationCircle

  _rootStockOrder: ChainStockOrder;

  productId = this.route.snapshot.params.id;
  product;

  orderID = this.route.snapshot.params.orderId;

  ngOnInit() {
    this.unsubscribeList.add(this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === getPath(this.route.snapshot)) {
          this.reloadPage()
        }
      }
    }))

    this.unsubscribeList.add(this.product$.subscribe(val => {
      this.product = val
    }))
  }

  ngOnDestroy() {
    this.unsubscribeList.cleanup()
  }

  product$ = this.route.params.pipe(
    map(val => val.id),
    switchMap(id => {
      return this.productController.getProductUsingGET(id).pipe(
        catchError(val => of(null))
      )
    }),
    map(resp => {;
      if (resp && resp.status === 'OK') return resp.data
      return null
    }),
    shareReplay(1)
  )

  history$ = this.route.params.pipe(
    map(val => {
      return val.orderId
    }),
    switchMap(orderId => {
      return this.chainOrderService.getAggregatesForOrder(orderId)
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
    shareReplay(1)
  )

  rootStockOrder(history: ProcessingOrderHistory[]): ChainStockOrder {
    if (history.length === 0) return null
    let root = history.find(x => x.depth === 0)
    return root.stockOrderAggs[0].stockOrder
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
    this.router.navigate(['stock-order', dbKey(order), 'view'])
  }

  goToOrderView(order: ChainStockOrder) {
    this.router.navigate(['/product-labels', this.route.snapshot.params.id, 'stock', 'stock-orders', 'stock-order', dbKey(order), 'view'])
  }


  isThisOrder(currentOrder: ChainStockOrder, toShowOrder: ChainStockOrder) {
    return dbKey(currentOrder) == dbKey(toShowOrder)
  }

  areAnyFields(aggregate) {
    return aggregate.fieldAggregates.length > 0 && aggregate.fieldAggregates.filter(x => x.key != '__CONFIG__').length > 0
  }


  orderType(stockOrder: ChainStockOrder) {
    let ordType = stockOrder.processingAction.type
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

}
