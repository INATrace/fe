import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ApiResponsePaginatedListChainStockOrder } from 'src/api-chain/model/apiResponsePaginatedListChainStockOrder';
import { ProductControllerService } from 'src/api/api/productController.service';
import { ActiveFacilitiesForOrganizationService } from 'src/app/shared-services/active-facilities-for-organization.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { NgbModalImproved } from 'src/app/core/ngb-modal-improved/ngb-modal-improved.service';
import { dbKey } from 'src/shared/utils';
import { ProductLabelStockSkuModalComponent } from '../product-label-stock-sku-modal/product-label-stock-sku-modal.component';

@Component({
  selector: 'app-product-label-stock-sku-list',
  templateUrl: './product-label-stock-sku-list.component.html',
  styleUrls: ['./product-label-stock-sku-list.component.scss']
})
export class ProductLabelStockSkuListComponent implements OnInit {

  subs: Subscription[] = [];
  facilityForm = new FormControl(null);
  organizationId: String = null;
  facilityId: String = null;
  productId = this.route.snapshot.params.id;
  reloadPingList$ = new BehaviorSubject<boolean>(false)
  pagingParams$ = new BehaviorSubject({})
  sortingParams$ = new BehaviorSubject({ sortBy: 'name', sort: 'ASC' })
  facilityParams$ = new BehaviorSubject({ facilityId: null})
  paging$ = new BehaviorSubject<number>(1);
  page: number = 0;
  pageSize = 10;


  constructor(
    // private chainDataService: DataService,
    private chainStockOrderService: StockOrderService,
    private chainOrganizationService: OrganizationService,
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private productController: ProductControllerService,
    private modalService: NgbModalImproved,
    private activeFacilitiesForOrganizationService: ActiveFacilitiesForOrganizationService
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => { sub.unsubscribe(); });
  }

  async initializeData() {
    let resp = await this.productController.getProductUsingGET(this.productId).pipe(take(1)).toPromise();
    if (resp && resp.status === "OK" && resp.data && resp.data.company) {
      let companyId = resp.data.company.id;
      let resp1 = await this.chainOrganizationService.getOrganizationByCompanyId(companyId).pipe(take(1)).toPromise();
      if (resp1 && resp1.status === "OK" && resp1.data && dbKey(resp1.data)) {
        this.organizationId = dbKey(resp1.data);
      }
    }

  }
  setFacilityId($event) {
    // console.log($event);
    if ($event){
      this.facilityId = dbKey($event);
      this.reloadPage();
    } else this.facilityId = null;
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
      key: 'measureUnitType',
      name: $localize`:@@productLabelSkus.sortOptions.measureUnitType.name:Measure unit`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'totalQuantity',
      name: $localize`:@@productLabelSkus.sortOptions.totalQuantity.name:Total quantity`,
    },
    {
      key: 'creationDate',
      name: $localize`:@@productLabelSkus.sortOptions.creationDate.name:Creation date`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'productionDate',
      name: $localize`:@@productLabelSkus.sortOptions.productionDate.name:Production date`,
    },
    {
      key: 'actions',
      name: $localize`:@@productLabelSkus.sortOptions.actions.name:Actions`,
      inactive: true
    }

  ]

  skus$ = combineLatest(this.reloadPingList$, this.paging$, this.sortingParams$,
    (ping: boolean, page: number, sorting: any) => {
      return {
        ...sorting,
        offset: (page - 1) * this.pageSize,
        limit: this.pageSize
      }
    }).pipe(
      tap(val => this.globalEventsManager.showLoading(true)),
      switchMap(params => {
        let par = { facilityId: this.facilityId, ...params }
        return this.chainStockOrderService.listStockForFacilityByMap({ ...par })
      }),
      map((resp: ApiResponsePaginatedListChainStockOrder) => {
        if (resp) {
          return resp.data
        }
      }),
      tap(val => this.globalEventsManager.showLoading(false)),
      shareReplay(1)
    )



  editSku(sku) {
    let editTitle = $localize`:@@productLabelSkus.newSKU.addTitle:Edit SKU`;
    this.modalService.open(ProductLabelStockSkuModalComponent, {
      centered: true
    }, {
      title: editTitle,
      sku: sku,
      update: true,
      organizationId: this.organizationId,
      saveCallback: () => {
        this.reloadPage();
      }
    });

  }

}
