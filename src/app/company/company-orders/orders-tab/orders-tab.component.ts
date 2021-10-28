import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorisedLayoutComponent } from '../../../layout/authorised/authorised-layout/authorised-layout.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TabCommunicationService } from '../../../shared/tab-communication.service';
import { FormControl } from '@angular/forms';
import { setNavigationParameter } from '../../../../shared/utils';
import { ApiFacility } from '../../../../api/model/apiFacility';
import { FacilityControllerService } from '../../../../api/api/facilityController.service';
import { CompanyFacilitiesService } from '../../../shared-services/company-facilities.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  template: ''
})
export class OrdersTabComponent implements OnInit, AfterViewInit, OnDestroy {

  faTimes = faTimes;

  rootTab = 0;

  selectedTab: Subscription;

  tabs = [
    $localize`:@@productLabelOrder.tab0.title:Dashboard`,
    $localize`:@@productLabelOrder.tab1.title:All orders`,
    $localize`:@@productLabelOrder.tab2.title:Customer orders`
  ];

  tabNames = [
    'dashboard',
    'all-orders',
    'customer-orders'
  ];

  companyId: number;

  // Controls for the facility dropdown select component
  facilityCodebook: CompanyFacilitiesService;
  facilityForStockOrderForm = new FormControl(null);
  selectedFacilityId = null;
  selectedFacilityId$ = new BehaviorSubject<number>(null);

  allOrders = 0;
  showedOrders = 0;

  openOnly = false;
  openOnly$ = new BehaviorSubject<boolean>(this.openOnly);

  // TABS
  @ViewChild(AuthorisedLayoutComponent)
  authorizedLayout;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected facilityController: FacilityControllerService
  ) { }

  get tabCommunicationService(): TabCommunicationService {
    return this.authorizedLayout ? this.authorizedLayout.tabCommunicationService : null;
  }

  ngOnInit(): void {
    this.companyId = Number(localStorage.getItem('selectedUserCompany'));
    this.facilityCodebook = new CompanyFacilitiesService(this.facilityController, this.companyId);
  }

  ngAfterViewInit() {
    this.selectedTab = this.tabCommunicationService.subscribe(this.tabs, this.tabNames, this.rootTab, this.targetNavigate.bind(this));
  }

  ngOnDestroy() {
    this.tabCommunicationService.announceTabTitles([]);
    if (this.selectedTab) {
      this.selectedTab.unsubscribe();
    }
  }

  targetNavigate(segment: string) {
    this.router.navigate([segment], { relativeTo: this.route.parent }).then();
  }

  facilityChanged(event: ApiFacility) {
    if (event) {
      this.selectedFacilityId = event.id;
      this.selectedFacilityId$.next(event.id);
    } else {
      this.selectedFacilityId = null;
      this.selectedFacilityId$.next(null);
    }
    setNavigationParameter(this.router, this.route, 'facilityId', this.selectedFacilityId);
  }

  setOpenOnly(openOnly: boolean) {
    this.openOnly = openOnly;
    this.openOnly$.next(openOnly);
  }

  onCount(event) {
    this.allOrders = event;
  }

  onShow(event) {
    this.showedOrders = event;
  }

}
