import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { ChainSemiProduct } from 'src/api-chain/model/chainSemiProduct';
import { ActiveFacilitiesForOrganizationCodebookService } from 'src/app/shared-services/active-facilities-for-organization-codebook.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { SemiProductInFacilityCodebookServiceStandalone } from 'src/app/shared-services/semi-products-in-facility-standalone-codebook.service';
import { environment } from 'src/environments/environment';
import { dbKey, getPath, setNavigationParameter, setSelectedIdFieldFromQueryParams } from 'src/shared/utils';
import { ProductLabelOrdersComponent } from '../product-label-orders.component';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.scss']
})
export class ProductLabelOrdersDashboardComponent extends ProductLabelOrdersComponent {

  rootTab = 0
  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected chainFacilityService: FacilityService,
    protected codebookTranslations: CodebookTranslations
  ) {
    super(router, route)
  }

  faTimes = faTimes

  facilityForStockOrderForm = new FormControl(null)
  facilityCodebook;
  activeSemiProductsInFacility;

  semiProductFrom = new FormControl(null)
  organizationId;
  facilityId;
  public facilityIdPing$ = new BehaviorSubject<string>(null);

  semiProductId = null
  semiProductId$ = new BehaviorSubject<string>(null)


  // this.semiProductFrom.valueChanges.pipe(
  //   startWith(null),
  //   map(val => {
  //     if (val) return dbKey(val)
  //     return null
  //   }),
  //   shareReplay(1)
  // )

  // public facilityForStockOrderChanged(event) {
  //   if (event) {
  //     this.facilityId = dbKey(event);
  //     this.facilityIdPing$.next(dbKey(event));
  //     this.activeSemiProductsInFacility = new SemiProductInFacilityCodebookServiceStandalone(this.chainFacilityService, event, this.codebookTranslations)
  //     setSelectedIdFieldFromQueryParams(this, this.route, 'semiProductId', this.semiProductFrom, this.activeSemiProductsInFacility, (val) => this.selectSemiProduct(val))
  //   } else {
  //     this.facilityId = null;
  //     this.facilityIdPing$.next(null);
  //   }
  //   setNavigationParameter(this.router, this.route, 'facilityId', this.facilityId)
  // }

  // selectSemiProduct(event) {
  //   this.semiProductId = event ? dbKey(event) : null
  //   this.semiProductId$.next(this.semiProductId)
  //   setNavigationParameter(this.router, this.route, 'semiProductId', this.semiProductId)
  // }

  public reloadDataPing$ = new BehaviorSubject<boolean>(false);
  public reloadPage() {
    setTimeout(() => this.reloadDataPing$.next(true), environment.reloadDelay)
  }

  selectedFacilityId$ = new BehaviorSubject<string>(null)

  facilityChanged(event: ChainFacility) {
    if (event) {
      this.facilityId = dbKey(event);
      this.selectedFacilityId$.next(dbKey(event))
    } else {
      this.selectedFacilityId$.next(null)
      this.facilityId = null
    }
    setNavigationParameter(this.router, this.route, 'facilityId', this.facilityId)
  }

  showedOrders;
  allOrders;
  public onShow(event, type?: string) {
    this.showedOrders = event;
  }

  public onCount(event, type?: string) {
    this.allOrders = event;
  }

  openOnly: boolean = true;

  public openOnly$ = new BehaviorSubject<boolean>(this.openOnly);

  public setOpenOnly(openOnly: boolean) {
    this.openOnly = openOnly;
    this.openOnly$.next(openOnly)
  }

  ngOnInit() {
    this.organizationId = localStorage.getItem("selectedUserCompany");
    this.facilityCodebook = new ActiveFacilitiesForOrganizationCodebookService(this.chainFacilityService, this.organizationId, this.codebookTranslations)
    setSelectedIdFieldFromQueryParams(this, this.route, 'facilityId', this.facilityForStockOrderForm, this.facilityCodebook, (val) => this.facilityChanged(val))

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // console.log("NAV:", event.url, getPath(this.route.snapshot), event.url === getPath(this.route.snapshot))
        if (event.url === getPath(this.route.snapshot)) {
          this.reloadPage()
        }
      }
    })
  }
}
