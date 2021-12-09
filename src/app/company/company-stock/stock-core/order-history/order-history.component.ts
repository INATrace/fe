import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalImproved } from '../../../../core/ngb-modal-improved/ngb-modal-improved.service';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { faCheckCircle, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ProcessingOrderControllerService } from '../../../../../api/api/processingOrderController.service';
import { ApiTransaction } from '../../../../../api/model/apiTransaction';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { StockOrderControllerService } from '../../../../../api/api/stockOrderController.service';
import { StockOrderType } from '../../../../../shared/types';
import { ApiStockOrderHistory } from '../../../../../api/model/apiStockOrderHistory';
import { ApiStockOrderHistoryTimelineItem } from '../../../../../api/model/apiStockOrderHistoryTimelineItem';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  qrCodeSize = 150;

  faCheckCircle = faCheckCircle;
  faExclamationCircle = faExclamationCircle;
  faTimes = faTimes;

  reloadPing$ = new BehaviorSubject<boolean>(false);

  productId = this.route.snapshot.params.id;

  history$: Observable<ApiStockOrderHistory> = combineLatest(
    this.reloadPing$,
    this.route.params,
    (ping: boolean, params: any ) =>
    {
      return params;
    })
    .pipe(
      tap(() => this.globalEventsManager.showLoading(true)),
      switchMap(val => {
        return this.stockOrderService.getStockOrderAggregatedHistoryUsingGET(val.stockOrderId);
      }),
      map(val => {
        if (val && val.status === 'OK') {
          return val.data;
        }
        return null;
      }),
      tap(() => this.globalEventsManager.showLoading(false)),
      shareReplay(1)
    );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stockOrderService: StockOrderControllerService,
    private processingOrderService: ProcessingOrderControllerService,
    private modalService: NgbModalImproved,
    private globalEventsManager: GlobalEventManagerService
  ) { }

  isRoot(root: ApiStockOrder, one: ApiStockOrder) {
    return root.id === one.id;
  }

  processingOrderName(historyItem: ApiStockOrderHistoryTimelineItem) {

    if (historyItem.processingOrder) {
      if (historyItem.processingOrder.processingAction) {
        return historyItem.processingOrder.processingAction.name;
      } else {
        return $localize`:@@orderHistoryView.processingOrderName.corruptedHistory: Corrupted history - processing action deleted`;
      }
    }

    return $localize`:@@orderHistoryView.processingOrderName.purchase:Purchase`;
  }

  processingCreationDate(historyItem: ApiStockOrderHistoryTimelineItem) {
    if (!historyItem.processingOrder) { return null; }
    return historyItem.processingOrder.creationTimestamp;
  }

  ngOnInit() {
  }

  goToInput(tx: ApiTransaction) {
    this.router.navigate(['stock-order', tx.sourceStockOrder.id, 'view'], { relativeTo: this.route.parent }).then();
  }

  async goToOutput(tx: ApiTransaction) {
    this.router.navigate(['stock-order', tx.targetStockOrder.id, 'view'], { relativeTo: this.route.parent }).then();
  }

  goToSibling(order: ApiStockOrder) {
    this.router.navigate(['stock-order', order.id, 'view'], { relativeTo: this.route.parent }).then();
  }

  goToOrderView(order: ApiStockOrder) {
    this.router.navigate(['stock-order', order.id, 'view'], { relativeTo: this.route.parent }).then();
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
    return stockOrder.id.toString();
  }

  copyToClipboard() {
    document.execCommand('copy');
  }

  transactionColor(tx) {
    if (tx.status === 'CANCELED') { return 'ab-edit-link canceled'; }
    return 'ab-edit-link';
  }

}
