import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { CompanyCustomerService } from 'src/api-chain/api/companyCustomer.service';
import { ApiResponsePaginatedListChainCompanyCustomer } from 'src/api-chain/model/apiResponsePaginatedListChainCompanyCustomer';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { dbKey } from 'src/shared/utils';

@Component({
  selector: 'app-product-label-stakeholders-customers',
  templateUrl: './product-label-stakeholders-customers.component.html',
  styleUrls: ['./product-label-stakeholders-customers.component.scss']
})
export class ProductLabelStakeholdersCustomersComponent implements OnInit {

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private chainCompanyCustomerService: CompanyCustomerService
  ) { }

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false);

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  productId = this.route.snapshot.params.id;
  @Input()
  organizationId;

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

  goToLink: string = this.router.url.substr(0, this.router.url.lastIndexOf("/"));


  @ViewChild(GoogleMap) set map(map: GoogleMap) {
    if (map) { this.gMap = map; this.fitBounds(); };
  };

  @ViewChild(MapInfoWindow) set infoWindow(infoWindow: MapInfoWindow) {
    if (infoWindow) this.gInfoWindow = infoWindow;
  };

  gInfoWindow = null;
  gInfoWindowText: string = "";



  ngOnInit(): void {
    this.initializeObservable();
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

  @Input()
  query = null;

  pagingParams$ = new BehaviorSubject({})
  sortingParams$ = new BehaviorSubject({ sortBy: 'name', sort: 'ASC' })
  paging$ = new BehaviorSubject<number>(1);
  page: number = 0;
  pageSize = 10;
  all = 0;
  showed = 0;


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
    this.sortingParams$.next({ sortBy: event.key, sort: event.sortOrder })
  }

  sortOptions = [
    {
      key: 'name',
      name: $localize`:@@productLabelStakeholdersCustomers.sortOptions.companyName.name:Company name`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'contact',
      name: $localize`:@@productLabelStakeholdersCustomers.sortOptions.contact.name:Contact`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'email',
      name: $localize`:@@productLabelStakeholdersCustomers.sortOptions.email.name:E-mail`,
    },
    {
      key: 'actions',
      name: $localize`:@@productLabelStakeholdersCustomers.sortOptions.actions.name:Actions`,
      inactive: true
    }
  ]

  customers$

  initializeObservable() {
    this.customers$ = combineLatest(this.reloadPingList$, this.paging$, this.sortingParams$,
      (ping: boolean, page: number, sorting: any) => {
        return {
          ...sorting,
          offset: (page - 1) * this.pageSize,
          limit: this.pageSize
        }
      }).pipe(
        tap(val => this.globalEventsManager.showLoading(true)),
        switchMap(params => {
          return this.chainCompanyCustomerService.listCompanyCustomersForOrganizationByMap({ ...params, organizationId: this.organizationId })
        }),
        map((resp: ApiResponsePaginatedListChainCompanyCustomer) => {
          if (resp) {
            this.intializeMarkers(resp.data);
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

  async deleteCustomer(customer) {
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelStakeholdersCustomers.deleteCustomer.error.message:Are you sure you want to delete the customer?`,
      options: { centered: true }
    });
    if (result != "ok") return
    let res = await this.chainCompanyCustomerService.deleteCompanyCustomer(customer).pipe(take(1)).toPromise();
    if (res && res.status == 'OK') {
      this.reloadPage()
    }
  }

  customerDetail(id) {
    this.router.navigate(['product-labels', this.productId, 'stakeholders', 'customers', 'update', id]);
  }


  openInfoWindow(gMarker, marker) {
    this.gInfoWindowText = marker.infoText;
    this.gInfoWindow.open(gMarker);
  }


  intializeMarkers(data) {
    if (!data) return;
    this.markers = [];
    this.initialBounds = [];

    for (let item of data.items) {
      if (item.location && item.location.latitude && item.location.longitude) {
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

  dbKey = dbKey
}
