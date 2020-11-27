import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, startWith, take } from 'rxjs/operators';
import { CompanyCustomerService } from 'src/api-chain/api/companyCustomer.service';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { ChainSemiProduct } from 'src/api-chain/model/chainSemiProduct';
import { ActiveCompanyCustomersByOrganizationService } from 'src/app/shared-services/active-company-customers-by-organization.service';
import { ActiveFacilitiesForOrganizationCodebookService } from 'src/app/shared-services/active-facilities-for-organization-codebook.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { GeneralSifrantService } from 'src/app/shared-services/general-sifrant.service';
import { SemiProductInFacilityCodebookServiceStandalone } from 'src/app/shared-services/semi-products-in-facility-standalone-codebook.service';
import { environment } from 'src/environments/environment';
import { dbKey, getPath, setNavigationParameter, setSelectedIdFieldFromQueryParams } from 'src/shared/utils';
import { ProductLabelOrdersComponent } from '../product-label-orders.component';

@Component({
  selector: 'app-orders-customer-orders',
  templateUrl: './orders-customer-orders.component.html',
  styleUrls: ['./orders-customer-orders.component.scss']
})
export class OrdersCustomerOrdersComponent extends ProductLabelOrdersComponent {

  rootTab = 2
  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected chainFacilityService: FacilityService,
    protected codebookTranslations: CodebookTranslations,
    protected chainCompanyCustomerService: CompanyCustomerService
  ) {
    super(router, route)
  }

  faTimes = faTimes

  facilityForStockOrderForm = new FormControl(null)
  facilityCodebook: ActiveFacilitiesForOrganizationCodebookService;
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

  public facilityForStockOrderChanged(event) {
    if (event) {
      this.facilityId = dbKey(event);
      this.facilityIdPing$.next(dbKey(event));
      this.activeSemiProductsInFacility = new SemiProductInFacilityCodebookServiceStandalone(this.chainFacilityService, event, this.codebookTranslations)
    } else {
      this.facilityId = null;
      this.facilityIdPing$.next(null);
    }
    setNavigationParameter(this.router, this.route, 'facilityId', this.facilityId)
  }

  selectSemiProduct(event) {
    this.semiProductId = event ? dbKey(event) : null
    this.semiProductId$.next(this.semiProductId)
    setNavigationParameter(this.router, this.route, 'semiProductId', this.semiProductId)
  }

  customerForm = new FormControl(null)
  companyCustomerId = null
  companyCustomerId$ = new BehaviorSubject<string>(null)

  customerChanged(event) {
    this.companyCustomerId = event ? dbKey(event) : null
    this.companyCustomerId$.next(this.companyCustomerId)
    setNavigationParameter(this.router, this.route, 'companyCustomerId', this.companyCustomerId)
  }

  public reloadDataPing$ = new BehaviorSubject<boolean>(false);
  public reloadPage() {
    setTimeout(() => this.reloadDataPing$.next(true), environment.reloadDelay)
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

  companyCustomerCodebook;

  ngOnInit() {
    this.organizationId = localStorage.getItem("selectedUserCompany");
    this.facilityCodebook = new ActiveFacilitiesForOrganizationCodebookService(this.chainFacilityService, this.organizationId, this.codebookTranslations)
    this.companyCustomerCodebook = new ActiveCompanyCustomersByOrganizationService(this.chainCompanyCustomerService, this.organizationId)
    setSelectedIdFieldFromQueryParams(this, this.route, 'facilityId', this.facilityForStockOrderForm, this.facilityCodebook, (val) => this.facilityForStockOrderChanged(val))
    setSelectedIdFieldFromQueryParams(this, this.route, 'companyCustomerId', this.customerForm, this.companyCustomerCodebook, (val) => this.customerChanged(val))
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // console.log("NAV:", event.url, getPath(this.route.snapshot), event.url === getPath(this.route.snapshot))
        if (event.url === getPath(this.route.snapshot)) {
          this.reloadPage()
        }
      }
    })
  }


  newGlobalOrder() {
    this.router.navigate(['global-order', 'create'], {relativeTo: this.route.parent})
  }
}
