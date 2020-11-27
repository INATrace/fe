import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { ApiResponsePaginatedListChainFacility } from 'src/api-chain/model/apiResponsePaginatedListChainFacility';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { dbKey } from 'src/shared/utils';

@Component({
  selector: 'app-product-label-stock-facility-list',
  templateUrl: './product-label-stock-facility-list.component.html',
  styleUrls: ['./product-label-stock-facility-list.component.scss']
})
export class ProductLabelStockFacilityListComponent implements OnInit {

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false)

  @Input()
  chainProductId: string = null;

  @Input()
  organizationId: string;

  gMap = null;

  isGoogleMapsLoaded: boolean = false;
  markers: any = [];
  defaultCenter = {
    lat: 5.274054,
    lng: 21.514503
  };
  defaultZoom = 3;
  zoomForOnePin = 10;
  bounds: any;
  initialBounds: any = [];
  subs: Subscription[] = [];

  allFacilities: number = 0;
  showedFacilities: number = 0;

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  @ViewChild(GoogleMap) set map(map: GoogleMap) {
    if (map) { this.gMap = map; this.fitBounds(); };
  };

  @ViewChild(MapInfoWindow, { static: false }) gInfoWindow: MapInfoWindow

  constructor(
    private chainOrganizationService: OrganizationService,
    private chainFacilityService: FacilityService,
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private modalService: NgbModalImproved,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeFacilitiesObservable()

    let sub2 = this.globalEventsManager.areGoogleMapsLoadedEmmiter.subscribe(
      loaded => {
        if (loaded) this.isGoogleMapsLoaded = true;
      },
      error => { }
    )
    this.subs.push(sub2)
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => { sub.unsubscribe(); });
  }

  productId = this.route.snapshot.params.id;
  pagingParams$ = new BehaviorSubject({})
  sortingParams$ = new BehaviorSubject({ sortBy: 'name', sort: 'ASC' })
  paging$ = new BehaviorSubject<number>(1);
  page: number = 0;
  pageSize = 10;


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
      name: $localize`:@@productLabelFacilities.sortOptions.name.name:Name`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'type',
      name: $localize`:@@productLabelFacilities.sortOptions.type.name:Facility type`,
      inactive: true
    },
    {
      key: 'sellabaleSemiProducts',
      name: $localize`:@@productLabelFacilities.sortOptions.sellabaleSemiProducts.name:Sellable semi-products`,
      inactive: true
    },
    {
      key: 'location',
      name: $localize`:@@productLabelFacilities.sortOptions.location.name:Location`,
      inactive: true
    },
    {
      key: 'actions',
      name: $localize`:@@productLabelFacilities.sortOptions.actions.name:Actions`,
      inactive: true
    }

  ]

  locationName(location) {
    if (location.cell != null && location.country) return location.cell + ", " + location.country.name;
    if (location.city != null && location.country) return location.city + ", " + location.country.name;
    if (location.country != null) location.country.name;
    return "";
  }

  // organizationId$ = this.route.paramMap.pipe(
  //   map(m => Number(m.get('id'))),
  //   switchMap(productId => {
  //     return this.productService.getProductByAFId(productId)
  //   }),
  //   map(val => {
  //     if (val && val.data && val.data.companyId) return val.data.companyId;
  //     throw Error("Wrong productId or product not linked to a company by companyId")
  //   }),
  //   switchMap(companyId => {
  //     return this.chainOrganizationService.getOrganizationByCompanyId(companyId)
  //   }),
  //   map(val => {
  //     if (val && val.data && dbKey(val.data)) return dbKey(val.data);
  //     throw Error("Wrong companyId")
  //   }),
  //   shareReplay(1)
  // );

  loadEntityList(params: any) {
    return this.chainFacilityService.listFacilitiesForOrganizationByMap({ ...params, organizationId: this.organizationId })
  }

  facilities$

  initializeFacilitiesObservable() {
    this.facilities$ = combineLatest(this.reloadPingList$, this.paging$, this.sortingParams$,
      (ping: boolean, page: number, sorting: any) => {
        return {
          ...sorting,
          offset: (page - 1) * this.pageSize,
          limit: this.pageSize
        }
      }).pipe(
        tap(val => this.globalEventsManager.showLoading(true)),
        switchMap(params => {
          return this.loadEntityList(params)
        }),
        map((resp: ApiResponsePaginatedListChainFacility) => {
          if (resp) {
            this.intializeMarkers(resp.data);
            this.showedFacilities = 0;
            if (resp.data && resp.data.count && (this.pageSize - resp.data.count > 0)) this.showedFacilities = resp.data.count;
            else if (resp.data && resp.data.count && (this.pageSize - resp.data.count <= 0)) {
              let temp = resp.data.count - (this.pageSize * (this.page - 1));
              this.showedFacilities = temp >= this.pageSize ? this.pageSize : temp;
            }
            this.showing.emit(this.showedFacilities);
            return resp.data
          } else {
            return null
          }
        }),
        tap(val => {
          if (val) {
            this.allFacilities = val.count
            this.countAll.emit(this.allFacilities);
          } else {
            this.allFacilities = 0;
            this.countAll.emit(0)
          }
        }),
        tap(val => this.globalEventsManager.showLoading(false)),
        shareReplay(1)
      )
  }

  editFacility(facility) {
    this.router.navigate(['product-labels', this.productId, 'stock', 'configuration', 'facilities', 'update', dbKey(facility)]);
  }


  removeEntity(entity) {
    return this.chainFacilityService.deleteFacility(entity);
  }

  async deleteEntity(entity) {
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelStockFacilityModal.deleteFacility.error.message:Are you sure you want to delete the facility?`,
      options: { centered: true }
    });
    if (result != "ok") return
    let res = await this.removeEntity(entity).pipe(take(1)).toPromise();
    if (res && res.status == 'OK') {
      this.reloadPage()
    }
  }

  gInfoWindowText: string = "";

  openInfoWindow(gMarker: MapMarker, marker) {
    this.gInfoWindowText = marker.infoText;
    this.gInfoWindow.open(gMarker);
  }


  intializeMarkers(data) {
    if (!data) return;
    this.markers = [];
    this.initialBounds = [];
    for (let item of data.items) {
      if (item.location && item.location.isPubliclyVisible && item.location.latitude && item.location.longitude) {
        let tmp = {
          position: {
            lat: item.location.latitude,
            lng: item.location.longitude
          },
          infoText: item.name
        }
        this.markers.push(tmp);
        this.initialBounds.push(tmp.position);
      }
    }
    this.fitBounds();
  }

  fitBounds() {
    if (!this.gMap || this.gMap == null) return;
    this.bounds = new google.maps.LatLngBounds()
    for (let bound of this.initialBounds) {
      this.bounds.extend(bound);
    }
    if (this.bounds.isEmpty()) {
      this.gMap.googleMap.setCenter(this.defaultCenter)
      this.gMap.googleMap.setZoom(this.defaultZoom);
      return;
    }
    let center = this.bounds.getCenter()
    let offset = 0.02
    let northEast = new google.maps.LatLng(
      center.lat() + offset,
      center.lng() + offset
    )
    let southWest = new google.maps.LatLng(
      center.lat() - offset,
      center.lng() - offset
    )
    let minBounds = new google.maps.LatLngBounds(southWest, northEast)
    this.gMap.fitBounds(this.bounds.union(minBounds))
  }


  showPagination() {
    if (((this.showedFacilities - this.pageSize) == 0 && this.allFacilities >= this.pageSize) || this.page > 1) return true;
    else return false
  }

  setPublic(p: boolean) {
    if (p) return '✓';
    return null;
  }
}
