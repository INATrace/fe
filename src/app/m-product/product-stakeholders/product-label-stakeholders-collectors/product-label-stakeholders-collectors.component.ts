import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ProductService } from 'src/api-chain/api/product.service';
import { UserCustomerService } from 'src/api-chain/api/userCustomer.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { NgbModalImproved } from 'src/app/core/ngb-modal-improved/ngb-modal-improved.service';
import { dbKey } from 'src/shared/utils';
import { ProductControllerService } from '../../../../api/api/productController.service';
import { ApiPaginatedResponseApiUserCustomer } from '../../../../api/model/apiPaginatedResponseApiUserCustomer';

@Component({
  selector: 'app-product-label-stakeholders-collectors',
  templateUrl: './product-label-stakeholders-collectors.component.html',
  styleUrls: ['./product-label-stakeholders-collectors.component.scss']
})
export class ProductLabelStakeholdersCollectorsComponent implements OnInit {

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    private modalService: NgbModalImproved,
    private route: ActivatedRoute,
    private router: Router,
    private chainUserCustomerService: UserCustomerService,
    private chainProductService: ProductService,
    private productController: ProductControllerService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false);

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  @Output()
  onSortChanged = new EventEmitter<string>();

  productId = this.route.snapshot.params.id;
  @Input()
  organizationId;
  @Input()
  role;
  @Input()
  byCategory = null
  @Input()
  query = null;

  pagingParams$ = new BehaviorSubject({})
  @Input()
  sortingParams$ = new BehaviorSubject({ queryBy: this.byCategory, sort: 'ASC' })
  paging$ = new BehaviorSubject<number>(1);
  page: number = 0;
  pageSize = 10;
  all = 0;
  showed = 0;
  goToLink: string = this.router.url.substr(0, this.router.url.lastIndexOf("/"));


  chainProduct
  async init() {
    let res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    if (res && res.status == "OK" && res.data) {
      this.chainProduct = res.data;
    }
    this.initializeObservables();
  }

  showPagination() {
    if (((this.showed - this.pageSize) == 0 && this.all >= this.pageSize) || this.page > 1) return true;
    else return false
  }


  onPageChange(event) {
    this.paging$.next(event);
  }

  reloadPage() {
    this.reloadPingList$.next(true)
  }

  changeSort(event) {
    if (event.key === 'name') {
      this.byCategory = 'BY_NAME';
    } else if (event.key === 'surname') {
      this.byCategory = 'BY_SURNAME';
    } else if (event.key === 'id') {
      this.byCategory = 'BY_USER_CUSTOMER_ID';
    }
    this.sortingParams$.next({ queryBy: this.byCategory, sort: event.sortOrder })
    this.onSortChanged.emit(this.byCategory);
  }

  sortOptions = [
    {
      key: 'name',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.name.name:First name`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'surname',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.surname.name:Last name`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'gender',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.gender.name:Gender`,
      inactive: true
    },
    {
      key: 'id',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.id.name:Id`,
    },
    {
      key: 'village',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.village.name:Village`,
      inactive: true
    },
    {
      key: 'cell',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.cell.name:Cell`,
      inactive: true
    },
    {
      key: 'actions',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.actions.name:Actions`,
      inactive: true
    }
  ]

  collectors$
  initializeObservables() {
    this.collectors$ = combineLatest(this.reloadPingList$, this.paging$, this.sortingParams$,
      (ping: boolean, page: number, sorting: any) => {
        return {
          query: this.query,
          ...sorting,
          offset: (page - 1) * this.pageSize,
          limit: this.pageSize
        }
      }).pipe(
        tap(val => this.globalEventsManager.showLoading(true)),
        switchMap(params => {
          return this.getAPI(params);
        }),
        map((resp: ApiPaginatedResponseApiUserCustomer) => {
          if (resp) {
            this.showed = 0;
            if (resp.data && resp.data.count && (this.pageSize - resp.data.count > 0)) this.showed = resp.data.count;
            else if (resp.data && resp.data.count && (this.pageSize - resp.data.count <= 0)) {
              let temp = resp.data.count - (this.pageSize * (this.page - 1));
              this.showed = temp >= this.pageSize ? this.pageSize : temp;
            }
            this.showing.emit(this.showed);
            this.all = resp.data.count;
            this.countAll.emit(this.all);
            return resp.data
          }
        }),
        tap(val => this.globalEventsManager.showLoading(false)),
        shareReplay(1)
      )
  }
  
  getAPI(params) {
    return this.productController.getUserCustomersListUsingGET(this.productId, null, null, null, null, null, null, null, this.role);
  }

  async deleteCollector(collector) {
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelStakeholdersCollectors.deleteCollector.error.message:Are you sure you want to delete the collector?`,
      options: { centered: true }
    });
    if (result != "ok") return
    let res = await this.productController.deleteUserCustomerUsingDELETE(collector).pipe(take(1)).toPromise();
    if (res && res.status == 'OK') {
      this.reloadPage()
    }
  }

  collectorDetail(id) {
    let type = this.role === 'FARMER' ? 'farmers' : 'collectors';
    this.router.navigate(['product-labels', this.productId, 'stakeholders', type, 'update', id]);
  }

  noCollectors() {
    if (this.role === 'COLLECTOR') return $localize`:@@productLabelStakeholdersCollectors.noCollectors:No collectors found`;
    return $localize`:@@productLabelStakeholdersCollectors.noFarmers:No farmers found`;
  }

  dbKey = dbKey

  showLocation(type, location) {
    if (type === 'cell') {
      if (location && location.cell) return location.cell;
      else return '-'
    } else {
      if (location && location.village) return location.village;
      else return '-'
    }

  }
}
