import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { OrderService } from 'src/api-chain/api/order.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { ApiResponsePaginatedListChainFacility } from 'src/api-chain/model/apiResponsePaginatedListChainFacility';
import { ApiResponsePaginatedListChainProductOrder } from 'src/api-chain/model/apiResponsePaginatedListChainProductOrder';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { dbKey } from 'src/shared/utils';

@Component({
  selector: 'app-order-card-list',
  templateUrl: './order-card-list.component.html',
  styleUrls: ['./order-card-list.component.scss']
})
export class OrderCardListComponent implements OnInit {

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false)

  @Input()
  facilityId$ = new BehaviorSubject<string>(null)

  @Input()
  organizationId: string;

  @Input()
  openOnly$ = new BehaviorSubject<boolean>(false);

  allEntities: number = 0;
  showedEntities: number = 0;
  productId = this.route.snapshot.params.id;
  chainProductId;

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  // @Output() onSelectedFacility = new EventEmitter<ChainFacility>()

  constructor(
    private chainOrderService: OrderService,
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private chainProductService: ProductService
  ) { }

  ngOnInit(): void {
    // this.initChainProductId().then(() =>
    this.initializeFacilitiesObservable()
    // )

  }

  // async initChainProductId() {
  //   let res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
  //   if (res && res.status === "OK" && res.data && dbKey(res.data)) {
  //     this.chainProductId = dbKey(res.data);
  //   }
  // }

  reloadPage() {
    this.reloadPingList$.next(true)
  }

  loadEntityList(params: any) {
    // console.log("PARAM:", params)
    if (params.facilityId) return this.chainOrderService.listOpenOrdersForFacilityByMap({ ...params })
    else return this.chainOrderService.listOpenOrdersForOrganizationByMap({...params, organizationId: this.organizationId})
  }

  orders$

  initializeFacilitiesObservable() {
    this.orders$ = combineLatest(this.reloadPingList$, this.facilityId$, this.openOnly$,
      (ping: boolean, facilityId: string, openOnly: boolean) => {
        return {
          facilityId,
          openOnly
        }
      }).pipe(
        filter(x => !!x),
        tap(val => this.globalEventsManager.showLoading(true)),
        switchMap(params => {
          return this.loadEntityList(params)
        }),
        // tap(val => console.log("RESp:", val)),
        map((resp: ApiResponsePaginatedListChainProductOrder) => {
          if (resp) {
            // console.log("RESP:", resp)
            this.showedEntities = resp.data && resp.data.count;
            this.showing.emit(this.showedEntities);
            // this.arrangeFacilities(resp.data.items);
            return resp.data
          } else {
            return null
          }
        }),
        tap(val => {
          if (val) {
            this.allEntities = val.count
          } else {
            this.allEntities = 0;
          }
          this.countAll.emit(this.allEntities)
        }),
        tap(val => this.globalEventsManager.showLoading(false)),
        shareReplay(1)
      )
  }

  // collection = [];
  // other = [];
  // storage = [];
  // arrangeFacilities(facilities) {
  //   this.collection = [];
  //   this.other = [];
  //   this.storage = [];
  //   let washing = [];
  //   let hulling = [];
  //   let drying = [];
  //   let nonSellable = [];
  //   let sellable = [];
  //   for (let item of facilities) {
  //     if (item.facilityType.id === 'WASHING_STATION') {
  //       if (item.isCollectionFacility) this.collection.push(item);
  //       else washing.push(item);
  //     } else if (item.facilityType.id === 'HULLING_STATION') {
  //       hulling.push(item);
  //     } else if (item.facilityType.id === 'DRYING_BED') {
  //       drying.push(item);
  //     } else if (item.facilityType.id === 'STORAGE') {
  //       if (item.isPublic) sellable.push(item);
  //       else nonSellable.push(item);
  //     }
  //   }

  //   this.collection.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  //   washing.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  //   hulling.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  //   drying.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  //   nonSellable.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  //   sellable.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

  //   this.other = [...washing, ...hulling, ...drying, ...nonSellable];
  //   this.storage = [...sellable];

  // }

  // selectFacility(facility: ChainFacility) {
  //   this.onSelectedFacility.next(facility)
  // }

}
