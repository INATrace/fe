import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ProductService } from 'src/api-chain/api/product.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { UnsubscribeList } from 'src/shared/rxutils';
import { dbKey } from 'src/shared/utils';

@Component({
  selector: 'app-semi-product-listing',
  templateUrl: './semi-product-listing.component.html',
  styleUrls: ['./semi-product-listing.component.scss']
})
export class SemiProductListingComponent implements OnInit {


  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false)

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  @Input()
  organizationId$: Observable<string>;

  @Input()
  semiProductBuyableStatusPing$ = new BehaviorSubject<boolean>(false);

  @Input()
  semiProductSKUStatusPing$ = new BehaviorSubject<boolean>(false);

  unsubscribeList = new UnsubscribeList();

  goToLink: string = this.router.url.substr(0, this.router.url.lastIndexOf("/"));

  constructor(
    private productService: ProductService,
    private semiProductService: SemiProductService,
    protected globalEventsManager: GlobalEventManagerService,
    private modalService: NgbModalImproved,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeEntitiesObservable()
  }

  ngOnDestroy(): void {
    this.unsubscribeList.cleanup()
  }

  productId = this.route.snapshot.params.id;
  pagingParams$ = new BehaviorSubject({})
  sortingParams$ = new BehaviorSubject({ sortBy: 'name', sort: 'ASC' })
  paging$ = new BehaviorSubject<number>(1);
  page: number = 0;
  pageSize = 10;

  showed: number = 0;
  all: number = 0;


  onPageChange(event) {
    this.paging$.next(event);
  }

  reloadPage() {
    this.reloadPingList$.next(true)
  }

  changeSort(event) {
    this.sortingParams$.next({ sortBy: event.key, sort: event.sortOrder })
  }

  sortOptions = [
    {
      key: 'name',
      name: $localize`:@@semiProductListing.sortOptions.name.name:Name`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'buyable',
      name: $localize`:@@semiProductListing.sortOptions.buyable.name:Buyable`,
      inactive: true
    },
    {
      key: 'SKU',
      name: $localize`:@@semiProductListing.sortOptions.sku.name:SKU (at producer)`,
      inactive: true
    },

    {
      key: 'SKUEndCustomer',
      name: $localize`:@@semiProductListing.sortOptions.skuEndCustomer.name:SKU (at end customer)`,
      inactive: true
    },
    {
      key: 'actions',
      name: $localize`:@@semiProductListing.sortOptions.actions.name:Actions`,
      inactive: true
    }
  ]

  productId$ = this.route.paramMap.pipe(
    map(m => Number(m.get('id'))),
    switchMap(productId => {
      return this.productService.getProductByAFId(productId)
    }),
    map(val => {
      if (val && val.data && dbKey(val.data)) return dbKey(val.data);
      throw Error("Wrong productId")
    }),
    shareReplay(1)
  );


  loadEntityList(params: any) {
    return this.productId$.pipe(
      switchMap(id => {
        return this.semiProductService.listSemiProductsForProductByMap({ ...params, productId: id })
      })
    )
  }

  entities$;

  initializeEntitiesObservable() {
    this.entities$ = combineLatest(this.reloadPingList$, this.paging$, this.sortingParams$, this.semiProductBuyableStatusPing$, this.semiProductSKUStatusPing$,
      (ping: boolean, page: number, sorting: any, buyable: boolean, sku: boolean) => {
        return {
          ...sorting,
          offset: (page - 1) * this.pageSize,
          limit: this.pageSize,
          isSKU: sku,
          isBuyable: buyable
        }
      }).pipe(
        tap(val => this.globalEventsManager.showLoading(true)),
        switchMap(params => {
          return this.loadEntityList(params)
        }),
        map(val => {
          this.showed = 0;
          if (val.data && val.data.count && (this.pageSize - val.data.count > 0)) this.showed = val.data.count;
          else if (val.data && val.data.count && (this.pageSize - val.data.count <= 0)) {
            let temp = val.data.count - (this.pageSize * (this.page - 1));
            this.showed = temp >= this.pageSize ? this.pageSize : temp;
          }
          this.all = val.data.count;
          this.showing.emit(this.showed);
          this.countAll.emit(val.data.count);

          return val.data;
        }),
        tap(val => this.globalEventsManager.showLoading(false)),
        shareReplay(1)
      )
  }
  removeEntity(entity) {
    return this.semiProductService.deleteSemiProduct(entity);
    // return this.productController.deleteCompanyCustomerUsingDELETEByMap(entity)
  }

  async deleteEntity(entity) {
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@semiProductListing.deleteCustomer.error.message:Are you sure you want to delete the semi-product?`,
      options: { centered: true }
    });
    if (result != "ok") return
    let res = await this.removeEntity(entity).pipe(take(1)).toPromise();
    if (res && res.status == 'OK') {
      this.reloadPage()
    }
  }

  async entityDetail(entity) {
    this.router.navigate(['product-labels', this.productId, 'stock', 'configuration', 'semi-products', 'update', dbKey(entity)]);
  }


  showPagination() {
    if (((this.showed - this.pageSize) == 0 && this.all >= this.pageSize) || this.page > 1) return true;
    else return false
  }

  setBoolean(b: boolean) {
    if (b) return '✓';
    return null;
  }

}
