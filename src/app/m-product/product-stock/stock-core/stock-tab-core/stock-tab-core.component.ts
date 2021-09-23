import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { PaymentsService } from 'src/api-chain/api/payments.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { ChainPayment } from 'src/api-chain/model/chainPayment';
import { ChainProduct } from 'src/api-chain/model/chainProduct';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { UserControllerService } from 'src/api/api/userController.service';
import { AuthorisedLayoutComponent } from 'src/app/layout/authorised/authorised-layout/authorised-layout.component';
import { ActiveCollectingFacilitiesForOrganizationCodebookService } from 'src/app/shared-services/active-collecting-facilities-for-organization-codebook.service';
import { ActiveFacilitiesForOrganizationCodebookService } from 'src/app/shared-services/active-facilities-for-organization-codebook.service';
import { ActiveSemiProductsForProductServiceStandalone } from 'src/app/shared-services/active-semi-products-for-product-standalone.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { GeneralSifrantService } from 'src/app/shared-services/general-sifrant.service';
import { OrganizationsCodebookService } from 'src/app/shared-services/organizations-codebook.service';
import { QuoteOrdersOnOrganizationStandaloneService } from 'src/app/shared-services/quote-orders-on-organization-standalone.service';
import { TabCommunicationService } from 'src/app/shared/tab-communication.service';
import { AuthService } from 'src/app/core/auth.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { NgbModalImproved } from 'src/app/core/ngb-modal-improved/ngb-modal-improved.service';
import { environment } from 'src/environments/environment';
import { UnsubscribeList } from 'src/shared/rxutils';
import { dateAtMidnightISOString, dbKey, getPath, setNavigationParameter } from 'src/shared/utils';

export interface DeliveryDates {
  from: string;
  to: string;
}

export type StockOrderListingPageMode = 'PURCHASE_ORDERS' | 'COMPANY_ADMIN' | 'ADMIN';

@Component({
  template: ''
})
export class StockTabCoreComponent implements OnInit {

  faTimes = faTimes;
  productId = this.route.snapshot.params.id;
  chainProductId: string;
  chainProduct: ChainProduct;
  allFacilities = 0;
  showedFacilities = 0;
  allOrders = 0;
  showedOrders = 0;
  allProcessFacilities = 0;
  showedProcessFacilities = 0;
  allSemiProducts = 0;
  showedSemiProducts = 0;
  showedPurchaseOrders = 0;
  allPurchaseOrders = 0;
  showedPayments = 0;
  allPayments = 0;
  showedBulkPayments = 0;
  allBulkPayments = 0;
  showedProcessingActions = 0;
  allProcessingActions = 0;
  selectedIds: ChainPayment[];
  selectedOrders: ChainStockOrder[];
  buyableSemiProductStatus: FormControl = new FormControl(false);
  skuSemiProductStatus: FormControl = new FormControl(false);
  searchNameFacility = new FormControl(null);
  searchFarmerNameAndSurname = new FormControl(null);
  facilityForm = new FormControl(null);
  public reloadFacilitiesListPing$ = new BehaviorSubject<boolean>(false);
  public reloadProcessingOrdersListPing$ = new BehaviorSubject<boolean>(false);
  public reloadSemiProductsListPing$ = new BehaviorSubject<boolean>(false);
  public reloadPurchaseOrdersPing$ = new BehaviorSubject<boolean>(false);
  public reloadPaymentsPing$ = new BehaviorSubject<boolean>(false);
  public reloadBulkPaymentsPing$ = new BehaviorSubject<boolean>(false);
  public reloadProcessingActionsListPing$ = new BehaviorSubject<boolean>(false);
  public reloadProcessingFacilitiesListPing$ = new BehaviorSubject<boolean>(false);
  public clickAddPaymentsPing$ = new BehaviorSubject<boolean>(false);
  public clickConfirmPaymentsPing$ = new BehaviorSubject<boolean>(false);
  public clickClearCheckboxesPing$ = new BehaviorSubject<boolean>(false);
  public clickAssocPing$ = new BehaviorSubject<boolean>(false);
  public clickCoopPing$ = new BehaviorSubject<boolean>(true);
  openBalanceOnly = false;
  purchaseOrderOnly = true;
  public openBalancePing$ = new BehaviorSubject<boolean>(this.openBalanceOnly);
  public purchaseOrderOnly$ = new BehaviorSubject<boolean>(this.purchaseOrderOnly);

  filterStatus = new FormControl('');
  public paymentStatusPing$ = new BehaviorSubject<string>(this.filterStatus.value);
  filterWayOfPayment = new FormControl('');
  filterWomenOnly = new FormControl(null);
  public wayOfPaymentPing$ = new BehaviorSubject<string>(this.filterWayOfPayment.value);
  public womenOnlyPing$ = new BehaviorSubject<boolean>(this.filterWomenOnly.value);
  public semiProductBuyableStatusPing$ = new BehaviorSubject<boolean>(this.buyableSemiProductStatus.value);
  public semiProductSKUStatusPing$ = new BehaviorSubject<boolean>(this.skuSemiProductStatus.value);
  public facilityIdPing$ = new BehaviorSubject<string>('');
  byCategory = 'STOCK_ORDER_NAME';
  public byCategoryPing$ = new BehaviorSubject<string>(this.byCategory);
  public queryPing$ = new BehaviorSubject<string>(null);
  public queryFarmerNameSurnamePing$ = new BehaviorSubject<string>(null);

  byCategoryPayment = 'STOCK_ORDER_NAME';
  items = [{ name: $localize`:@@productLabelStock.search.purchase:purchase`, category: 'STOCK_ORDER_NAME' }];

  selectedProcessingFacility: ChainFacility;
  selectedFacilityId$ = new BehaviorSubject<string>(null);

  fromFilterDate = new FormControl(null);
  toFilterDate = new FormControl(null);
  public deliveryDatesPing$ = new BehaviorSubject<DeliveryDates>({ from: null, to: null });

  fromFilterDatePayments = new FormControl(null);
  toFilterDatePayments = new FormControl(null);
  public deliveryDatesPingPayments$ = new BehaviorSubject<DeliveryDates>({ from: null, to: null });
  public submitSeasonalData = false;

  producerListForm = new FormControl(null, Validators.required);
  orderListForm = new FormControl(null);
  orderListCheckbox = new FormControl(true);
  fromSeasonalFilterDate = new FormControl(null, Validators.required);
  toSeasonalFilterDate = new FormControl(null, Validators.required);
  producerListFormReadOnly = false;
  userOrgId;
  owner = true;

  public quoteOrdersOnOrganizationCodebook: QuoteOrdersOnOrganizationStandaloneService;

  public getIdForTabName(name: string) {
    return this.tabNames.indexOf(name);
  }

  public getTabNameForId(id: number) {
    if (id >= this.tabNames.length || id < 0) { return null; }
    return this.tabNames[id];
  }

  public get myTabName() {
    return this.tabNames[this.rootTab];
  }
  public get pageMode(): StockOrderListingPageMode {
    if (!this.route.snapshot.data.mode) { return 'PURCHASE_ORDERS'; }
    return this.route.snapshot.data.mode as StockOrderListingPageMode;
  }

  constructor(
    protected route: ActivatedRoute,
    protected chainProductService: ProductService,
    protected chainSemiProductService: SemiProductService,
    protected router: Router,
    public chainOrganizationService: OrganizationService,
    public chainOrganizationCodebook: OrganizationsCodebookService,
    protected globalEventManager: GlobalEventManagerService,
    protected chainFacilityService: FacilityService,
    protected chainStockOrderService: StockOrderService,
    protected modalService: NgbModalImproved,
    protected codebookTranslations: CodebookTranslations,
    protected chainPaymentsContoller: PaymentsService,
    protected authService: AuthService,
    protected companyController: CompanyControllerService,
    protected userController: UserControllerService
  ) { }

  // TABS ////////////////
  @ViewChild(AuthorisedLayoutComponent) authorizedLayout;
  rootTab = 0;
  selectedTab: Subscription;

  tabs = [
    $localize`:@@productLabelStock.tab0.title:Purchases`,
    $localize`:@@productLabelStock.tab1.title:Processing`,
    $localize`:@@productLabelStock.tab2.title:Payments`,
    $localize`:@@productLabelStock.tab4.title:My stock`,
  ];
  activeTab = 1;

  tabNames = [
    'purchases',
    'processing',
    'payments',
    'stock-orders'
  ];

  get tabCommunicationService(): TabCommunicationService {
    return this.authorizedLayout ? this.authorizedLayout.tabCommunicationService : null;
  }

  targetNavigate(segment: string) {
    this.router.navigate(['product-labels', this.productId, 'stock', segment, 'tab']);
    // this.router.navigate([segment], { relativeTo: this.route.parent.parent })
  }

  ngAfterViewInit() {
    this.selectedTab = this.tabCommunicationService.subscribe(this.tabs, this.tabNames, this.rootTab, this.targetNavigate.bind(this));
  }
  /////////////////////////

  isActivePage = false;
  unsubsribeList = new UnsubscribeList();

  companyForFacilityForm = new FormControl(null);
  companyForStockOrderForm = new FormControl(null);
  facilityForStockOrderForm

  // organizationIdForFacility$ = new BehaviorSubject<string>(null);
  // organizationIdForStockOrder$ = new BehaviorSubject<string>(null);
  organizationId = localStorage.getItem('selectedUserCompany');

  // collectingFacilityForStockOrderCodebook: ActiveCollectingFacilitiesForOrganizationCodebookService
  facilityId;

  public facilityForStockOrderChanged(event) {
    if (event) {
      this.facilityId = dbKey(event);
      this.facilityIdPing$.next(dbKey(event));
    } else {
      this.facilityId = null;
      this.facilityIdPing$.next(null);
    }
    setNavigationParameter(this.router, this.route, 'facilityId', this.facilityId)
  }

  payments;
  purchaseOrderId;

  public setFacilityList() {
    switch (this.pageMode) {
      case 'ADMIN':
      case 'COMPANY_ADMIN':
        this.facilityCodebook =
          new ActiveFacilitiesForOrganizationCodebookService(this.chainFacilityService, this.organizationId, this.codebookTranslations)
        break;
      case 'PURCHASE_ORDERS':
      default:
        this.facilityCodebook =
          new ActiveCollectingFacilitiesForOrganizationCodebookService(this.chainFacilityService, this.organizationId);
        break;
    }
  }

  facilityCodebook: GeneralSifrantService<any>;
  activeSemiProductsForProduct;

  ngOnInit(): void {

    this.isAuthorisedCompanyRole().then();
    this.unsubsribeList.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          // console.log("NAV:", event.url, getPath(this.route.snapshot), event.url.startsWith(getPath(this.route.snapshot)))
          if (event.url.startsWith(getPath(this.route.snapshot))) { // to also reload when facility id is in url
            this.reloadPage();
          }
        }
      })
    );

    this.selectedIds = [];
    this.selectedOrders = [];
    this.facilityForStockOrderForm = new FormControl(null);

    this.isActivePage = true;
    this.initChainProductId().then(() => {
      this.userOrgId = localStorage.getItem('selectedUserCompany');
      if (this.userOrgId) {
        this.owner = (this.chainProduct.organizationId === this.userOrgId);
      }
      this.listOfOrgProducer().then();
    });

    this.setFacilityList();
    this.initializedForPageMode();
  }

  public reloadPage() {
    const tabName = this.route.snapshot.data.tab;
    switch (tabName) {
      case 'purchases':
        setTimeout(() => this.reloadPurchaseOrdersPing$.next(true), environment.reloadDelay);
        return;
      case 'processing':
        setTimeout(() => this.reloadProcessingFacilitiesListPing$.next(true), environment.reloadDelay);
        return;
      case 'payments':
        setTimeout(() => this.reloadPaymentsPing$.next(true), environment.reloadDelay);
        setTimeout(() => this.reloadBulkPaymentsPing$.next(true), environment.reloadDelay);
        return;
      case 'configuration':
        setTimeout(() => this.reloadFacilitiesListPing$.next(true), environment.reloadDelay);
        setTimeout(() => this.reloadSemiProductsListPing$.next(true), environment.reloadDelay);
        setTimeout(() => this.reloadProcessingActionsListPing$.next(true), environment.reloadDelay);
        return;
      default:
        return;
    }
  }

  ngOnDestroy() {
    // this.tabCommunicationService.announceTabTitles([]);
    this.unsubsribeList.cleanup();
    if (this.selectedTab) { this.selectedTab.unsubscribe(); }
    // if (this.tabSub) this.tabSub.unsubscribe();
  }

  public initializedForPageMode() {
    switch (this.pageMode) {
      case 'ADMIN':
      case 'COMPANY_ADMIN':
        this.setOpenBalanceOnly(false);
        this.setPurchaseOrdersOnly(false);
        break;
      case 'PURCHASE_ORDERS':
      default:
        break;
    }
  }

  async initChainProductId() {
    const res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data && dbKey(res.data)) {
      this.chainProductId = dbKey(res.data);
      this.activeSemiProductsForProduct =
        new ActiveSemiProductsForProductServiceStandalone(this.chainSemiProductService, this.chainProductId, this.codebookTranslations);
      this.chainProduct = res.data;
      this.isBuyer().then();
      this.isAssociation().then();
    }
  }

  public newPurchaseOrder() {
    if (!this.facilityForStockOrderForm.value) {
      const title = $localize`:@@productLabelStock.purchase.warning.title:Missing facility`;
      const message = $localize`:@@productLabelStock.purchase.warning.message:Please select facility before continuing`;
      this.showWarning(title, message);
      return;
    }
    this.router.navigate(['product-labels', this.productId, 'stock', 'purchases', 'facility', this.facilityId, 'purchases', 'new']);
  }

  public newSalesOrder() {
    if (!this.facilityForStockOrderForm.value) {
      const title = $localize`:@@productLabelStock.purchase.warning.title:Missing facility`;
      const message = $localize`:@@productLabelStock.purchase.warning.message:Please select facility before continuing`;
      this.showWarning(title, message);
      return;
    }
    this.router.navigate(['product-labels', this.productId, 'stock', 'sales', 'facility', this.facilityId, 'stock-orders', 'new']);
  }

  public newGeneralOrder() {
    if (!this.facilityForStockOrderForm.value) {
      const title = $localize`:@@productLabelStock.purchase.warning.title:Missing facility`;
      const message = $localize`:@@productLabelStock.purchase.warning.message:Please select facility before continuing`;
      this.showWarning(title, message);
      return;
    }
    this.router.navigate(['product-labels', this.productId, 'stock', 'general', 'facility', this.facilityId, 'stock-orders', 'new']);
  }

  public newProcessingOrder() {
    this.router.navigate(['product-labels', this.productId, 'stock', 'processing', 'NEW', 'facility', 'NEW', 'new']);
  }

  public newProcessingAction() {
    this.router.navigate(['product-labels', this.productId, 'stock', 'configuration', 'processing-transaction', 'new'])
  }

  public async newSeasonalPayment() {
    const poIds = [];
    if (this.orderListForm.value === null) {
      const orders = await this.quoteOrdersOnOrganizationCodebook.getAllCandidates().pipe(take(1)).toPromise();
      for (const item of orders) {
        poIds.push(dbKey(item));
      }
    } else {
      poIds.push(dbKey(this.orderListForm.value));
    }
    this.router.navigate(['product-labels', this.productId, 'stock', 'payments', 'purchases', 'bulk-payment', poIds.toString(), 'new', 'BONUS']);
  }

  public seasonalData = {};

  get isDataAvailable() {
    return Object.keys(this.seasonalData).length > 0;
  }

  sortOptionsSeasonalData = [
    {
      key: 'totalSeason',
      name: $localize`:@@productLabelStock.sortOptionsSeasonalData.totalSeason.name:Total purchased (kg)`,
      inactive: true
    },
    {
      key: 'totalOrder',
      name: $localize`:@@productLabelStock.sortOptionsSeasonalData.totalOrder.name:Total purchased in selected order(s) (kg)`,
      inactive: true
    },
    {
      key: 'paymentAdvanced',
      name: $localize`:@@productLabelStock.sortOptionsSeasonalData.paymentAdvanced.name:Advanced payment (RWF)`,
      inactive: true
    },
    {
      key: 'paymentCherry',
      name: $localize`:@@productLabelStock.sortOptionsSeasonalData.paymentCherry.name:Cherry payment (RWF)`,
      inactive: true
    },
    {
      key: 'paymentBonus',
      name: $localize`:@@productLabelStock.sortOptionsSeasonalData.paymentBonus.name:Member bonus (RWF)`,
      inactive: true
    },
    {
      key: 'paymentPremium',
      name: $localize`:@@productLabelStock.sortOptionsSeasonalData.paymentPremium.name:AF Women premium (RWF)`,
      inactive: true
    }
  ];

  public onShow(event, type?: string) {
    if (type === 'PROCESS') { this.showedProcessFacilities = event; }
    if (type === 'ORDER') { this.showedOrders = event; }
    else { this.showedFacilities = event; }
  }

  public onCountAll(event, type?: string) {
    if (type === 'PROCESS') { this.allProcessFacilities = event; }
    if (type === 'ORDER') { this.allOrders = event; }
    else { this.allFacilities = event; }
  }

  public onShowSP(event, type?: string) {
    if (type === 'ACTION') { this.showedProcessingActions = event; }
    else { this.showedSemiProducts = event; }
  }

  public onCountAllSP(event, type?: string) {
    if (type === 'ACTION') { this.allProcessingActions = event; }
    else { this.allSemiProducts = event; }
  }

  public onShowPO(event) {
    this.showedPurchaseOrders = event;
  }

  public onCountAllPO(event) {
    this.allPurchaseOrders = event;
  }

  public onShowPayments(event, type?: string) {
    if (type === 'BULK') { this.showedBulkPayments = event; }
    else { this.showedPayments = event; }
  }

  public onCountAllPayments(event, type?: string) {
    if (type === 'BULK') { this.allBulkPayments = event; }
    else { this.allPayments = event; }
  }

  public showWarning(title, message) {
    const buttonOkText = $localize`:@@productLabelStock.warning.button.ok:OK`;
    this.globalEventManager.openMessageModal({
      title,
      message,
      type: 'warning',
      options: { centered: true },
      dismissable: false,
      buttons: ['ok'],
      buttonTitles: { ok: buttonOkText }
    });
  }

  public searchInput(event) {
    this.queryPing$.next(event);
  }

  searchPurchaseInput(event) {
    this.queryFarmerNameSurnamePing$.next(event);
  }

  public onCategoryChange(event) {
    this.byCategory = event;
    this.byCategoryPing$.next(event);
  }

  public setOpenBalanceOnly(openB: boolean) {
    this.openBalanceOnly = openB;
    this.openBalancePing$.next(openB);
  }

  public setPurchaseOrdersOnly(poOnly: boolean) {
    this.purchaseOrderOnly = poOnly;
    this.purchaseOrderOnly$.next(poOnly);
  }

  public setPaymentStatus(status: string) {
    this.filterStatus.setValue(status);
    this.paymentStatusPing$.next(status);
  }

  public setWayOfPayment(value: string) {
    this.filterWayOfPayment.setValue(value);
    this.wayOfPaymentPing$.next(value);
  }

  public setWomenOnly(value: boolean) {
    this.filterWomenOnly.setValue(value);
    this.womenOnlyPing$.next(value);
  }

  public get womensOnlyStatusValue() {
    if (this.filterWomenOnly.value != null) {
      if (this.filterWomenOnly.value) { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.womenCoffee:Women coffee`; }
      else { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.nonWomenCoffee:Non-women coffee`; }
    }
    return null;
  }

  public selectedIdsChanged(event, type) {
    if (type === 'PURCHASE') { this.selectedOrders = event; }
    else { this.selectedIds = event; }
  }

  public setBuyableSemiProductStatus(status: boolean) {
    this.buyableSemiProductStatus.setValue(status);
    this.semiProductBuyableStatusPing$.next(status);
  }

  public setSKUSemiProductStatus(status: boolean) {
    this.skuSemiProductStatus.setValue(status);
    this.semiProductSKUStatusPing$.next(status);
  }

  showProcessingOrderList = false;

  public setShowProcessingOrderList(value: boolean) {
    this.showProcessingOrderList = value
    if (value) {
      this.reloadProcessingOrdersListPing$.next(true);
    }
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

  onChange(type = 'PURCHASES') {
    this.dateSearch(type);
  }

  codebookAssoc;
  codebookCoop;
  assocCoop;

  public async listOfOrgProducer() {
    const assoc = this.chainProduct.organizationRoles.filter(item => item.role === 'PRODUCER');
    const buyers = this.chainProduct.organizationRoles.filter(item => item.role === 'BUYER');
    let buyer = false;
    for (const item of buyers) {
      const resb = await this.chainOrganizationService.getOrganizationByCompanyId(item.companyId).pipe(take(1)).toPromise();
      if (resb && resb.status === 'OK' && resb.data && resb.data.id === item.companyId) { buyer = true; }
    }
    const assocObj = {};
    for (const item of assoc) {
      const res = await this.chainOrganizationService.getOrganizationByCompanyId(item.companyId).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        if (this.owner || buyer) {
          assocObj[dbKey(res.data)] = res.data.name;
        } else {
          if (this.userOrgId === dbKey(res.data)) {
            assocObj[dbKey(res.data)] = res.data.name;
          }
        }
      }
    }
    this.codebookCoop = EnumSifrant.fromObject(assocObj);
    this.assocCoop = assocObj;

    if (this.codebookCoop && this.codebookCoop.keys.length === 1) {
      this.producerListForm.setValue(this.codebookCoop.keys[0]);
      this.producerListFormReadOnly = true;
    }
  }

  setQuoteOrdersForSeasonal() {
    if (this.producerListForm.value && this.fromSeasonalFilterDate.value && this.toSeasonalFilterDate.value) {
      const from = dateAtMidnightISOString(this.fromSeasonalFilterDate.value);
      const to = dateAtMidnightISOString(this.toSeasonalFilterDate.value);
      this.quoteOrdersOnOrganizationCodebook =
        new QuoteOrdersOnOrganizationStandaloneService(this.chainStockOrderService, this.producerListForm.value, from, to);
    }
    this.seasonalData = {};
  }

  clickOrderListCheckbox() {
    if (this.orderListCheckbox.value) { this.orderListForm.setValue(null); }
    this.seasonalData = {};
  }

  get showSeasonalButtonShowEnable() {
    return !(this.fromSeasonalFilterDate.invalid || this.toSeasonalFilterDate.invalid ||
      this.producerListForm.invalid || this.orderListError);
  }

  get orderListError() {
    return (this.orderListCheckbox.value != null && !this.orderListCheckbox.value && !this.orderListForm.value)
  }

  get orderListFormReadOnly() {
    return this.orderListCheckbox.value;
  }

  get showOrdersSeasonal() {
    if (this.fromSeasonalFilterDate.invalid || this.toSeasonalFilterDate.invalid || this.producerListForm.invalid) {
      return false;
    } else {
      this.setQuoteOrdersForSeasonal();
      return true;
    }
  }

  public async showSeasonalPayments() {

    this.globalEventManager.showLoading(true);
    this.submitSeasonalData = true;
    if (this.fromSeasonalFilterDate.invalid || this.toSeasonalFilterDate.invalid || this.producerListForm.invalid) { return; }
    if (this.producerListForm.value) {
      const from = dateAtMidnightISOString(this.fromSeasonalFilterDate.value);
      const to = dateAtMidnightISOString(this.toSeasonalFilterDate.value);
      //todo

      let resres = null;
      if (this.orderListForm.value) { resres = await this.chainStockOrderService.getSeasonalStatisticsForOrganization(this.producerListForm.value, from, to, this.orderListForm.value._id).pipe(take(1)).toPromise(); }
      else { resres = await this.chainStockOrderService.getSeasonalStatisticsForOrganization(this.producerListForm.value, from, to, null).pipe(take(1)).toPromise(); }

      if (resres && resres.status === 'OK' && resres.data) {
        this.seasonalData = { totalSeason: resres.data.totalSeason, totalOrder: resres.data.totalOrder, paymentAdvanced: resres.data.paymentAdvanced, paymentCherry: resres.data.paymentCherry, paymentBonus: resres.data.paymentBonus, paymentPremium: resres.data.paymentPremium, ordersTotalPropToFullFilled: resres.data.ordersTotalPropToFullFilled }
        this.globalEventManager.showLoading(false);
      } else {
        this.globalEventManager.showLoading(false);
      }
    } else {
      this.globalEventManager.showLoading(false);
    }
  }

  public async isAssociation() {
    const coop = this.chainProduct.organizationRoles.filter(item => item.role === 'ASSOCIATION');
    for (const item of coop) {
      const res = await this.chainOrganizationService.getOrganizationByCompanyId(item.companyId).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        if (dbKey(res.data) === this.organizationId) {
          this.clickAssocPing$.next(true);
        }
      }
    }
  }

  sortOptions = [];
  async isBuyer() {
    const coop = this.chainProduct.organizationRoles.filter(item => item.role === 'BUYER');
    for (const item of coop) {
      const res = await this.chainOrganizationService.getOrganizationByCompanyId(item.companyId).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        if (dbKey(res.data) === this.organizationId) {
          this.clickCoopPing$.next(false);
        }
        this.sortOptions = [
          {
            key: 'cb',
            selectAllCheckbox: true,
            hide: !this.clickCoopPing$.value
          },
          {
            key: 'purpose',
            name: $localize`:@@productLabelPayments.sortOptions.paymentPurposeType.name:Payment purpose`,
            inactive: true
          },
          {
            key: 'amount',
            name: $localize`:@@productLabelPayments.sortOptions.amount.name:Amount paid to the farmer (RWF)`,
            inactive: true,
            hide: !this.clickCoopPing$.value
          },
          {
            key: 'amount_company',
            name: $localize`:@@productLabelPayments.sortOptions.amount.company.name:Amount paid (EUR)`,
            inactive: true,
            hide: this.clickCoopPing$.value
          },
          {
            key: 'producer_name',
            name: $localize`:@@productLabelPayments.sortOptions.producer_name.name:Farmer name`,
            inactive: true,
            hide: !this.clickCoopPing$.value
          },
          {
            key: 'company_name',
            name: $localize`:@@productLabelPayments.sortOptions.company_name.name:Company name`,
            inactive: true,
            hide: this.clickCoopPing$.value
          },
          {
            key: 'DELIVERY_DATE',
            name: $localize`:@@productLabelPayments.sortOptions.deliveryDate.name:Delivery date`,
            hide: !this.clickCoopPing$.value
          },
          {
            key: 'PAYMENT_DATE',
            name: $localize`:@@productLabelPayments.sortOptions.paymentDate.name:Payment date`,
          },
          {
            key: 'payment_status',
            name: $localize`:@@productLabelPayments.sortOptions.paymentStatus.name:Status`,
            inactive: true,
            hide: !this.clickCoopPing$.value
          },
          {
            key: 'way_of_payment',
            name: $localize`:@@productLabelPayments.sortOptions.wayOfPayment.name:Way of payment`,
            inactive: true,
            hide: !this.clickCoopPing$.value
          },
          {
            key: 'actions',
            name: $localize`:@@productLabelPayments.sortOptions.actions.name:Actions`,
            inactive: true
          }
        ];
      }
    }
  }

  get isAdmin() {
    return this.authService.currentUserProfile && this.authService.currentUserProfile.role === 'ADMIN'
  }

  isAuthRoleToSeeConfiguration = true;
  isAuthRoleToSeeProcessing = true;
  isAuthRoleToSeeMyStock = true;

  public async isAuthorisedCompanyRole() {
    const orgId = localStorage.getItem('selectedUserCompany');
    const currrentUser = await this.userController.getProfileForUserUsingGET().pipe(take(1)).toPromise();
    if (currrentUser && currrentUser.status === 'OK' && currrentUser.data) {
      const res = await this.chainOrganizationService.getOrganization(orgId).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        const resC = await this.companyController.getCompanyUsingGET(res.data.id).pipe(take(1)).toPromise();
        if (resC && resC.status === 'OK' && resC.data) {
          for (const user of resC.data.users) {
            if (user.email === currrentUser.data.email) {
              if (user.companyRole === 'USER') { this.isAuthRoleToSeeConfiguration = false; }
              if (user.companyRole === 'ACCOUNTANT') {
                this.isAuthRoleToSeeProcessing = false;
                this.isAuthRoleToSeeMyStock = false;
              }
              break;
            }
          }
        }
      }
    }
  }

}
