import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { GeneralSifrantService } from '../../../../shared-services/general-sifrant.service';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { CompanyFacilitiesService } from '../../../../shared-services/company-facilities.service';
import { CompanyCollectingFacilitiesService } from '../../../../shared-services/company-collecting-facilities.service';
import { dateAtMidnightISOString, setNavigationParameter } from '../../../../../shared/utils';
import { ApiFacility } from '../../../../../api/model/apiFacility';
import { BehaviorSubject, Subscription } from 'rxjs';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthorisedLayoutComponent } from '../../../../layout/authorised/authorised-layout/authorised-layout.component';
import { TabCommunicationService } from '../../../../shared/tab-communication.service';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { ApiPayment } from '../../../../../api/model/apiPayment';

export type StockOrderListingPageMode = 'PURCHASE_ORDERS' | 'COMPANY_ADMIN' | 'ADMIN';

export interface DeliveryDates {
  from: string;
  to: string;
}

@Component({
  template: ''
})
export class StockCoreTabComponent implements OnInit, AfterViewInit {

  faTimes = faTimes;

  companyId: number = Number(localStorage.getItem('selectedUserCompany'));

  selectedFacilityId: number;
  facilityIdPing$ = new BehaviorSubject<number>(null);
  facilityForStockOrderForm = new FormControl(null);
  facilityCodebook: GeneralSifrantService<any>;

  openBalanceOnly = false;
  openBalancePing$ = new BehaviorSubject<boolean>(this.openBalanceOnly);

  filterWayOfPayment = new FormControl('');
  wayOfPaymentPing$ = new BehaviorSubject<string>(this.filterWayOfPayment.value);

  selectedOrders: ApiStockOrder[];
  selectedPayments: ApiPayment[];

  clickAddPaymentsPing$ = new BehaviorSubject<boolean>(false);

  fromFilterDate = new FormControl(null);
  toFilterDate = new FormControl(null);
  deliveryDatesPing$ = new BehaviorSubject<DeliveryDates>({ from: null, to: null });

  fromFilterDatePayments = new FormControl(null);
  toFilterDatePayments = new FormControl(null);
  deliveryDatesPingPayments$ = new BehaviorSubject<DeliveryDates>({ from: null, to: null });

  isAuthRoleToSeeProcessing = true;

  // TABS
  @ViewChild(AuthorisedLayoutComponent)
  authorizedLayout;

  rootTab = 0;
  selectedTab: Subscription;

  tabs = [
    $localize`:@@productLabelStock.tab0.title:Purchases`,
    $localize`:@@productLabelStock.tab1.title:Processing`,
    $localize`:@@productLabelStock.tab2.title:Payments`,
    $localize`:@@productLabelStock.tab4.title:My stock`,
  ];

  tabNames = [
    'purchases',
    'processing',
    'payments',
    'stock-orders'
  ];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected globalEventManager: GlobalEventManagerService,
    protected facilityControllerService: FacilityControllerService
  ) { }

  get pageMode(): StockOrderListingPageMode {
    if (!this.route.snapshot.data.mode) { return 'PURCHASE_ORDERS'; }
    return this.route.snapshot.data.mode as StockOrderListingPageMode;
  }

  get tabCommunicationService(): TabCommunicationService {
    return this.authorizedLayout ? this.authorizedLayout.tabCommunicationService : null;
  }

  targetNavigate(segment: string) {
    this.router.navigate(['my-stock', segment, 'tab']).then();
  }

  ngOnInit(): void {

    this.isAuthorisedCompanyRole().then();

    this.selectedOrders = [];
    this.selectedPayments = [];

    this.initFacilityCodebook();
  }

  ngAfterViewInit() {
    this.selectedTab = this.tabCommunicationService.subscribe(this.tabs, this.tabNames, this.rootTab, this.targetNavigate.bind(this));
  }

  private initFacilityCodebook(): void {
    switch (this.pageMode) {
      case 'ADMIN':
      case 'COMPANY_ADMIN':
        this.facilityCodebook = new CompanyFacilitiesService(this.facilityControllerService, this.companyId);
        break;
      case 'PURCHASE_ORDERS':
      default:
        this.facilityCodebook = new CompanyCollectingFacilitiesService(this.facilityControllerService, this.companyId);
        break;
    }
  }

  facilityForStockOrderChanged(event: ApiFacility) {
    if (event) {
      this.selectedFacilityId = event.id;
      this.facilityIdPing$.next(this.selectedFacilityId);
    } else {
      this.selectedFacilityId = null;
      this.facilityIdPing$.next(null);
    }
    setNavigationParameter(this.router, this.route, 'facilityId', String(this.selectedFacilityId));
  }

  setOpenBalanceOnly(openB: boolean) {
    this.openBalanceOnly = openB;
    this.openBalancePing$.next(openB);
  }

  public setWayOfPayment(value: string) {
    this.filterWayOfPayment.setValue(value);
    this.wayOfPaymentPing$.next(value);
  }

  showWarning(title, message) {
    const buttonOkText = $localize`:@@productLabelStock.warning.button.ok:OK`;
    this.globalEventManager.openMessageModal({
      title,
      message,
      type: 'warning',
      options: {centered: true},
      dismissable: false,
      buttons: ['ok'],
      buttonTitles: {ok: buttonOkText}
    }).then();
   }

  dateSearch(type: string) {
    let from = this.fromFilterDate.value;
    let to = this.toFilterDate.value;
    if (type === 'PAYMENTS') {
      from = this.fromFilterDatePayments.value;
      to = this.toFilterDatePayments.value;
    }

    if (from && to) {
      from = dateAtMidnightISOString(from);
      to = dateAtMidnightISOString(to);
    } else if (from) {
      const tomorrow = new Date();
      tomorrow.setDate(new Date().getDate() + 1);
      from = dateAtMidnightISOString(from);
      to = dateAtMidnightISOString(tomorrow);
    } else if (to) {
      const fromBeginingOfTime = new Date(null);
      from = dateAtMidnightISOString(fromBeginingOfTime);
      to = dateAtMidnightISOString(to);
    } else {
      from = null;
      to = null;
    }

    if (type === 'PAYMENTS') {
      this.deliveryDatesPingPayments$.next({ from, to });
    } else {
      this.deliveryDatesPing$.next({ from, to });
    }
  }

  onFilterDateRangeChange(type = 'PURCHASES') {
    this.dateSearch(type);
  }

  selectedIdsChanged(event, type?) {
    if (type === 'PURCHASE') { this.selectedOrders = event; }
    else { this.selectedPayments = event; }
  }

  public async isAuthorisedCompanyRole() {
    // TODO: implement
    // const orgId = localStorage.getItem('selectedUserCompany');
    // const currrentUser = await this.userController.getProfileForUserUsingGET().pipe(take(1)).toPromise();
    // if (currrentUser && currrentUser.status === 'OK' && currrentUser.data) {
    //   const res = await this.chainOrganizationService.getOrganization(orgId).pipe(take(1)).toPromise();
    //   if (res && res.status === 'OK' && res.data) {
    //     const resC = await this.companyController.getCompanyUsingGET(res.data.id).pipe(take(1)).toPromise();
    //     if (resC && resC.status === 'OK' && resC.data) {
    //       for (const user of resC.data.users) {
    //         if (user.email === currrentUser.data.email) {
    //           if (user.companyRole === 'USER') { this.isAuthRoleToSeeConfiguration = false; }
    //           if (user.companyRole === 'ACCOUNTANT') {
    //             this.isAuthRoleToSeeProcessing = false;
    //             this.isAuthRoleToSeeMyStock = false;
    //           }
    //           break;
    //         }
    //       }
    //     }
    //   }
    // }
  }

}
