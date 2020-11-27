import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ChainProductOrder } from 'src/api-chain/model/chainProductOrder';
import { dateAtNoonISOString, formatDateWithDots } from 'src/shared/utils';

@Component({
  selector: 'app-order-left-panel-content',
  templateUrl: './order-left-panel-content.component.html',
  styleUrls: ['./order-left-panel-content.component.scss']
})
export class OrderLeftPanelContentComponent implements OnInit {

  @Input()
  title: string = $localize`:@@orderLeftPanelContent.title:Order`;

  @Input()
  showIcon: boolean = true;

  @Input()
  create: boolean = false;

  @Input()
  order$: Observable<ChainProductOrder>;

  faTrashAlt = faTrashAlt;

  imgStorageKey: String = null;

  @Input()
  producersString$: Observable<string>

  @Input()
  product;

  @Input()
  orderId;

  constructor(
    private chainStockOrderController: StockOrderService,
    private router: Router
  ) { }

  facility: string;

  ngOnInit(): void {
    this.getFacilityForUp();
  }

  formatDate(date) {
    if (date) return formatDateWithDots(date);
    return "";
  }

  onTime(order: ChainProductOrder) {
    let today = dateAtNoonISOString(new Date())
    let deliveryDate = dateAtNoonISOString(order.deliveryDeadline)
    return today <= deliveryDate
  }

  itemsQuantityString(order: ChainProductOrder) {
    let kilos = order.items.map(ord => {
      let weightConv = ord.measurementUnitType.weight || 1
      return ord.totalQuantity * weightConv
    }).reduce((a, b) => a + b)
    return `${kilos} kg`
  }

  async getFacilityForUp() {
    let res = await this.chainStockOrderController.getStockOrderById(this.orderId).pipe(take(1)).toPromise();
    if (res && res.status === 'OK') {
      this.facility = res.data.facilityId;
    }
  }

  goUp() {
    if (this.facility) this.router.navigate(['/', 'product-labels', this.product.id, 'orders', 'dashboard'], { queryParams: { facilityId: this.facility } })
  }
}
