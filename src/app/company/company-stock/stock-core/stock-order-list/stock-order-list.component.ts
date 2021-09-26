import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChainStockOrder } from '../../../../../api-chain/model/chainStockOrder';
import { DeliveryDates } from '../stock-core-tab/stock-core-tab.component';
import { SortOption } from '../../../../shared/result-sorter/result-sorter-types';
import { PaginatedListChainStockOrder } from '../../../../../api-chain/model/paginatedListChainStockOrder';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-stock-order-list',
  templateUrl: './stock-order-list.component.html',
  styleUrls: ['./stock-order-list.component.scss']
})
export class StockOrderListComponent implements OnInit {

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false);

  @Input()
  facilityId$ = new BehaviorSubject<number>(null);

  @Input()
  openBalanceOnly$ = new BehaviorSubject<boolean>(false);

  @Input()
  selectedOrders: ChainStockOrder[];

  @Input()
  clickAddPaymentsPing$ = new BehaviorSubject<boolean>(false);

  @Input()
  companyId: number = null;

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

  @Output()
  countAll = new EventEmitter<number>();

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  selectedIdsChanged = new EventEmitter<ChainStockOrder[]>();

  sortOptions: SortOption[];
  private sortingParams$ = new BehaviorSubject(null);

  private allOrders = 0;
  private showedOrders = 0;
  page = 0;
  pageSize = 10;
  private paging$ = new BehaviorSubject<number>(1);

  orders$: Observable<PaginatedListChainStockOrder>;

  cbCheckedAll = new FormControl(false);
  private allSelected = false;
  currentData: ChainStockOrder[];

  constructor() { }

  ngOnInit(): void {
  }

  changeSort(event) {
    if (event.key === 'cb') {
      this.selectAll(event.checked);
      return;
    }
    this.sortingParams$.next({ sortBy: event.key, sort: event.sortOrder });
  }

  private selectAll(checked) {
    if (checked) {
      this.selectedOrders = [];
      for (const item of this.currentData) {
        this.selectedOrders.push(item);
      }
      this.currentData.map(item => { (item as any).selected = true; return item; });
      this.allSelected = true;
      this.selectedIdsChanged.emit(this.selectedOrders);
    } else {
      this.selectedOrders = [];
      this.allSelected = false;
      this.currentData.map(item => { (item as any).selected = false; return item; });
      this.selectedIdsChanged.emit(this.selectedOrders);
    }
  }

  showPagination() {
    return ((this.showedOrders - this.pageSize) === 0 && this.allOrders >= this.pageSize) || this.page > 1;
  }

  onPageChange(event) {
    this.paging$.next(event);
  }

}
