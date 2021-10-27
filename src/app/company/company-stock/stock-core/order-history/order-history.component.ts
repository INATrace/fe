import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModalImproved} from '../../../../core/ngb-modal-improved/ngb-modal-improved.service';
import {GlobalEventManagerService} from '../../../../core/global-event-manager.service';
import {faCheckCircle, faExclamationCircle, faTimes} from '@fortawesome/free-solid-svg-icons';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {ProcessingOrderControllerService} from '../../../../../api/api/processingOrderController.service';
import {ApiTransaction} from '../../../../../api/model/apiTransaction';
import {ApiStockOrder} from '../../../../../api/model/apiStockOrder';
import {StockOrderControllerService} from '../../../../../api/api/stockOrderController.service';
import {ApiStockOrderAggregatedHistory} from '../../../../../api/model/apiStockOrderAggregatedHistory';
import {StockOrderType} from '../../../../../shared/types';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stockOrderService: StockOrderControllerService,
    private processingOrderService: ProcessingOrderControllerService,
    private modalService: NgbModalImproved,
    private globalEventsManager: GlobalEventManagerService
  ) {
  }

  qrCodeSize = 150;

  faCheckCircle = faCheckCircle;
  faExclamationCircle = faExclamationCircle;
  faTimes = faTimes;


  rootHistory: ApiStockOrderAggregatedHistory;


  rootStockOrder: ApiStockOrder;
  reloadPing$ = new BehaviorSubject<boolean>(false);

  productId = this.route.snapshot.params.id;

  history$ = combineLatest(
    this.reloadPing$,
    this.route.params,
    (ping: boolean, params: any ) =>
    {
      return params;
    })
    .pipe(
      tap(val => this.globalEventsManager.showLoading(true)),
      switchMap(val => {
        return this.stockOrderService.getStockOrderAggregatedHistoryUsingGET(val.stockOrderId);
      }),
      map(val => {
        if (val && val.status === 'OK') {
          return val.data;
        }
        return null;
      }),
      tap(val => {
        this.rootStockOrder = this.readRootStockOrder(val.items);
      }),
      tap(val => this.globalEventsManager.showLoading(false)),
      shareReplay(1)
    );



  readRootStockOrder(aggregatedHistoryList: ApiStockOrderAggregatedHistory[]): ApiStockOrder {
    if (aggregatedHistoryList.length === 0) {
      return null;
    }
    const root = aggregatedHistoryList.find(x => x.depth === 0);

    this.rootHistory = root;

    return root.stockOrder;
  }

  isRoot(root: ApiStockOrder, one: ApiStockOrder) {
    return root.id === one.id;
  }


  processingOrderName(aggregate: ApiStockOrderAggregatedHistory) {
    if (aggregate.processingOrder) {
      if (aggregate.processingOrder.processingAction) {
        return aggregate.processingOrder.processingAction.name;
      } else {
        return $localize`:@@orderHistoryView.processingOrderName.corruptedHistory: Corrupted history - processing action deleted`;
      }
    }
    if (aggregate.aggregations.length === 0) {
      return $localize`:@@orderHistoryView.processingOrderName.missingHistory:History too big. Only part is loaded. Follow other order links to view the rest.`;
    }
    return $localize`:@@orderHistoryView.processingOrderName.purchase:Purchase`;
  }

  processingCreationDate(aggregate: ApiStockOrderAggregatedHistory) {
    if (!aggregate.processingOrder) { return null; }
    return aggregate.processingOrder.creationTimestamp;
  }

  ngOnInit() {
  }

  goToInput(tx: ApiTransaction) {
    this.router.navigate(['stock-order', tx.sourceStockOrder.id, 'view'], { relativeTo: this.route.parent });
  }


  async goToOutput(tx: ApiTransaction) {
    if (!tx.isProcessing) {
      this.router.navigate(['stock-order', tx.targetStockOrder.id, 'view'], { relativeTo: this.route.parent });
    } else {
      const res = await this.processingOrderService.getProcessingOrder(tx.targetStockOrder.id).pipe(take(1)).toPromise();
      if (res && res.status === 'OK') {
        if (res.data.targetStockOrders && res.data.targetStockOrders.length > 0) {
          this.router.navigate(['stock-order', res.data.targetStockOrders[0], 'view'], { relativeTo: this.route.parent });
        }
      }
    }
  }

  goToSibiling(order: ApiStockOrder) {
    this.router.navigate(['stock-order', order.id, 'view'], { relativeTo: this.route.parent });
  }

  goToOrderView(order: ApiStockOrder) {
    this.router.navigate(['stock-order', order.id, 'view'], { relativeTo: this.route.parent });
  }


  isThisOrder(currentOrder: ApiStockOrder, toShowOrder: ApiStockOrder) {
    return currentOrder.id === toShowOrder.id;
  }

  edit(order: ApiStockOrder) {

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

  qrCodeString(stockOrder: ApiStockOrder) {
    if (!stockOrder) {
      return;
    }
    return stockOrder.id;
  }

  copyToClipboard() {
    document.execCommand('copy');
  }

  transactionColor(tx) {
    if (tx.status === 'CANCELED') { return 'ab-edit-link canceled'; }
    return 'ab-edit-link';
  }

}
