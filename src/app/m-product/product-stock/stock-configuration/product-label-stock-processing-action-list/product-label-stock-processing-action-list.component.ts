import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
import { ProcessingActionService } from 'src/api-chain/api/processingAction.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { ChainProcessingAction } from 'src/api-chain/model/chainProcessingAction';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { dbKey } from 'src/shared/utils';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';

@Component({
  selector: 'app-product-label-stock-processing-action-list',
  templateUrl: './product-label-stock-processing-action-list.component.html',
  styleUrls: ['./product-label-stock-processing-action-list.component.scss']
})
export class ProductLabelStockProcessingActionListComponent implements OnInit {

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false)
  @Output()
  showing = new EventEmitter<number>();
  @Output()
  countAll = new EventEmitter<number>();
  @Input()
  organizationId: string;
  @Input()
  chainProductId;

  productId = this.route.snapshot.params.id;
  searchName = new FormControl(null)
  pagingParams$ = new BehaviorSubject({})
  sortingParams$ = new BehaviorSubject({ sortBy: 'name', sort: 'ASC' })
  paging$ = new BehaviorSubject<number>(1);
  page: number = 0;
  pageSize = 10;

  showed: number = 0;
  all: number = 0;

  searchParams$ = combineLatest(
    this.searchName.valueChanges.pipe(
      startWith(null),
      debounceTime(200)
    ),
    (query: string) => {
      return { query }
    }
  )

  constructor(
    private chainProcessingActionService: ProcessingActionService,
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private chainProductService: ProductService,
    private codebookTranslations: CodebookTranslations
  ) { }

  ngOnInit(): void {
    this.initChainProductId().then(() =>
      this.initializeEntitiesObservable()
    )

  }

  async initChainProductId() {
    let res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    if (res && res.status === "OK" && res.data && dbKey(res.data)) {
      this.chainProductId = dbKey(res.data);
    }
  }


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
      name: $localize`:@@processingActionList.sortOptions.description.name:Name of process`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'type',
      name: $localize`:@@processingActionList.sortOptions.type.name:Type`,
      inactive: true
    },
    {
      key: 'inputSemiProduct',
      name: $localize`:@@processingActionList.sortOptions.inputSemiProduct.name:Input semi-product`,
      inactive: true
    },
    {
      key: 'outputSemiProduct',
      name: $localize`:@@processingActionList.sortOptions.outputSemiProduct.name:Output semi-product`,
      inactive: true
    },
    {
      key: 'actions',
      name: $localize`:@@processingActionList.sortOptions.actions.name:Actions`,
      inactive: true
    }
  ]

  entities$;

  initializeEntitiesObservable() {
    this.entities$ = combineLatest(this.reloadPingList$, this.paging$, this.searchParams$, this.sortingParams$,
      (ping: boolean, page: number, search: any, sorting: any) => {
        return {
          ...search,
          ...sorting,
          offset: (page - 1) * this.pageSize,
          limit: this.pageSize
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

  loadEntityList(params: any) {
    return this.chainProcessingActionService.listProcessingActionsForProductAndOrganizationByMap({ ...params, organizationId: this.organizationId, productId: this.chainProductId})
  }

  removeEntity(entity) {
    return this.chainProcessingActionService.deleteProcessingAction(entity);
  }

  async deleteEntity(entity) {
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@processingActionList.deleteProcessingAction.error.message:Are you sure you want to delete it?`,
      options: { centered: true }
    });
    if (result != "ok") return
    let res = await this.removeEntity(entity).pipe(take(1)).toPromise();
    if (res && res.status == 'OK') {
      this.reloadPage()
    }
  }

  async entityDetail(entity) {
    this.router.navigate(['product-labels', this.productId, 'stock', 'configuration', 'processing-transaction', 'update', dbKey(entity)]);
  }


  showPagination() {
    if (((this.showed - this.pageSize) == 0 && this.all >= this.pageSize) || this.page > 1) return true;
    else return false
  }

  processingActionToShow: ChainProcessingAction;

  view(action: ChainProcessingAction) {
    this.processingActionToShow = action;
  }

  semiProductName(item) {
    return this.codebookTranslations.translate(item, 'name');
  }

}
