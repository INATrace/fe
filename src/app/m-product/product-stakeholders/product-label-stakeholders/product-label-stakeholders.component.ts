import { Component, Host, OnInit, ViewChild } from '@angular/core';
import { ProductControllerService } from 'src/api/api/productController.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { take, filter, tap, switchMap, catchError, map, shareReplay } from 'rxjs/operators';
import { ApiProductCompany } from 'src/api/model/apiProductCompany';
import { BehaviorSubject, combineLatest, of, Subscription } from 'rxjs';
import { UnsubscribeList } from 'src/shared/rxutils';
import { FormControl } from '@angular/forms';
import { getPath, dbKey } from 'src/shared/utils';
import { ProductService } from 'src/api-chain/api/product.service';
import { CompanySelectModalComponent } from 'src/app/company/company-list/company-select-modal/company-select-modal.component';
import { OrganizationsCodebookService } from 'src/app/shared-services/organizations-codebook.service';
import { TabCommunicationService } from 'src/app/shared/tab-communication.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { AuthorisedLayoutComponent } from 'src/app/layout/authorised/authorised-layout/authorised-layout.component';
import { UserCustomerService } from 'src/api-chain/api/userCustomer.service';

@Component({
  selector: 'app-product-label-stakeholders',
  templateUrl: './product-label-stakeholders.component.html',
  styleUrls: ['./product-label-stakeholders.component.scss']
})
export class ProductLabelStakeholdersComponent implements OnInit {

  constructor(
    protected productController: ProductControllerService,
    protected globalEventsManager: GlobalEventManagerService,
    protected modalService: NgbModalImproved,
    protected route: ActivatedRoute,
    protected router: Router,
    public chainOrganizationCodebook: OrganizationsCodebookService,
    protected chainProductService: ProductService,
    public chainUserCustomer: UserCustomerService
  ) { }

  // TABS ////////////////
  @ViewChild(AuthorisedLayoutComponent) authorizedLayout;
  rootTab = 0;
  selectedTab: Subscription;

  tabs = [
    $localize`:@@productLabelStakeholders.tab0.title:Value chain`,
    $localize`:@@productLabelStakeholders.tab1.title:Collectors`,
    $localize`:@@productLabelStakeholders.tab2.title:Farmers`,
    $localize`:@@productLabelStakeholders.tab3.title:Customers`];

  tabNames = [
    'value-chain',
    'collectors',
    'farmers',
    'customers'
  ]

  get tabCommunicationService(): TabCommunicationService {
    return this.authorizedLayout ? this.authorizedLayout.tabCommunicationService : null
  }

  targetNavigate(segment: string) {
    // this.router.navigate(['product-labels', this.productId, 'stakeholders', segment])
    this.router.navigate([segment], { relativeTo: this.route.parent })
  }
  ngAfterViewInit() {
    this.selectedTab = this.tabCommunicationService.subscribe(this.tabs, this.tabNames, this.rootTab, this.targetNavigate.bind(this))
  }
  /////////////////////////


  activeTab = this.getIdForTabName(this.route.snapshot.data.tab)
  isActivePage = false;
  unsubsribeList = new UnsubscribeList()

  showedCollectors: number = 0;
  showedCustomers: number = 0;
  showedFarmers: number = 0;

  allCollectors: number = 0;
  allCustomers: number = 0;
  allFarmers: number = 0;

  searchNameCollectors = new FormControl(null);
  searchNameCustomers = new FormControl(null);
  searchNameFarmers = new FormControl(null);

  productId = this.route.snapshot.params.id;
  buyers: ApiProductCompany[] = [];
  producers: ApiProductCompany[] = [];
  associations: ApiProductCompany[] = [];
  owners: ApiProductCompany[] = [];
  roasters: ApiProductCompany[] = [];
  unsubscribeList = new UnsubscribeList()
  currentProduct;
  organizationId;
  productOrganizationId;

  public reloadValueChainPing$ = new BehaviorSubject<boolean>(false)
  public reloadCollectorsPing$ = new BehaviorSubject<boolean>(false)
  public reloadCustomersPing$ = new BehaviorSubject<boolean>(false)
  public reloadFarmersPing$ = new BehaviorSubject<boolean>(false)


  byCategoryFarmer: string = 'BY_NAME';
  byCategoryCollector: string = 'BY_NAME';
  public sortingParamsFarmer$ = new BehaviorSubject({ queryBy: this.byCategoryFarmer, sort: 'ASC' })
  public sortingParamsCollector$ = new BehaviorSubject({ queryBy: this.byCategoryCollector, sort: 'ASC' })
  items = [{ name: $localize`:@@productLabelStakeholders.search.name:name`, category: 'BY_NAME' }, { name: $localize`:@@productLabelStakeholders.search.surname:surname`, category: 'BY_SURNAME' }, { name: $localize`:@@productLabelStakeholders.search.id:id`, category: 'BY_USER_CUSTOMER_ID' }]

  ngOnInit(): void {
    this.unsubscribeList.add(
      this.product$.subscribe(val => { }),
    )
    this.reload();

    // this.isActivePage = true;

    // this.tabCommunicationService.announceTabTitles(this.tabs);
    // setTimeout(() => {
    //   this.tabCommunicationService.confirmActiveTab(this.activeTab)
    // });

    // this.initializeTabs()
    // this.cachedPageActivation()

    this.setAlls();
    this.setOrganizationId();

  }

  ngOnDestroy(): void {
    this.tabCommunicationService.announceTabTitles([])
    this.unsubscribeList.cleanup();
    if (this.tabSub) this.tabSub.unsubscribe()
  }

  async setOrganizationId() {

    this.organizationId = localStorage.getItem("selectedUserCompany");

    if (!this.currentProduct) {
      let res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        this.productOrganizationId = dbKey(res.data.organization);
      }
    }
  }

  tabSub: Subscription;

  // initializeTabs() {
  //   if (this.tabSub) {
  //     this.tabSub.unsubscribe()
  //   }

  //   this.tabSub = this.tabCommunicationService.confirmActiveTab$.subscribe(
  //     tab => {
  //       if (tab === this.activeTab) return;
  //       if (this.isActivePage) {
  //         this.router.navigate(['product-labels', this.productId, 'stakeholders', this.getTabNameForId(tab)])
  //         this.isActivePage = false;
  //       }
  //     })
  // }

  getIdForTabName(name: string) {
    return this.tabNames.indexOf(name)
  }

  getTabNameForId(id: number) {
    if (id >= this.tabNames.length || id < 0) return null;
    return this.tabNames[id]
  }

  // cachedPageActivation() {
  //   this.unsubsribeList.add(
  //     this.router.events.subscribe(event => {
  //       if (event instanceof NavigationEnd) {
  //         if (event.url + '/' === getPath(this.route.snapshot)) {
  //           this.isActivePage = true;
  //           this.initializeTabs();
  //           this.reloadPage();
  //         } else {
  //           this.isActivePage = false;
  //         }
  //       }
  //     })
  //   );
  // }

  reloadPage() {

    let tabName = this.route.snapshot.data.tab;
    switch (tabName) {
      case 'value-chain':
        this.reloadValueChainPing$.next(true);
        return;
      case 'collectors':
        this.reloadCollectorsPing$.next(true);
        return;
      case 'customers':
        this.reloadCustomersPing$.next(true);
        return;
      case 'farmers':
        this.reloadFarmersPing$.next(true);
        return;
      default:
        return;
    }
  }

  async setAlls() {
    // let res0 = await this.productController.getUserCustomersListUsingGET(this.productId).pipe(take(1)).toPromise();
    // if (res0 && res0.status === 'OK' && res0.data && res0.data.count >= 0) {
    //   this.allCollectors = res0.data.count;
    // }
    // let res1 = await this.productController.getCompanyCustomersListUsingGET(this.productId).pipe(take(1)).toPromise();
    // if (res1 && res1.status === 'OK' && res1.data && res1.data.count >= 0) {
    //   this.allCustomers = res1.data.count;
    // }
  }

  onShow(event, type) {
    if (type == 'collectors') this.showedCollectors = event;
    if (type == 'customers') this.showedCustomers = event;
    if (type == 'farmers') this.showedFarmers = event;
  }

  onCountAll(event, type) {
    if (type === 'collectors') this.allCollectors = event;
    if (type === 'customers') this.allCustomers = event;
    if (type == 'farmers') this.allFarmers = event;
  }

  async addBuyerProducerToProduct(cId, cType) {
    try {
      this.globalEventsManager.showLoading(true);
      this.currentProduct.associatedCompanies.push({ company: { id: cId }, type: cType });
      let res = await this.productController.updateProductUsingPUT(this.currentProduct).pipe(take(1)).toPromise()
      if (res && res.status === 'OK') {
        let resChain = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
        if (resChain && 'OK' === resChain.status && resChain.data) {
          let chainObj = resChain.data;

          let organizationRoles = [];
          if (this.currentProduct.associatedCompanies && this.currentProduct.associatedCompanies.length > 0) {
            for (let com of this.currentProduct.associatedCompanies) {
              let assocComp = {
                companyId: com.company.id,
                role: com.type
              }
              organizationRoles.push(assocComp);
            }
          }

          chainObj['organizationRoles'] = organizationRoles;
          let resPost = await this.chainProductService.postProduct(chainObj).pipe(take(1)).toPromise();
        }
        this.reload()
      }
    } catch (e) {
    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }


  reload() {
    this.reloadValueChainPing$.next(true)
  }


  product$ = combineLatest(this.reloadValueChainPing$, this.productId,
    (ping: any, id: string) => {
      return ping && id != null ? Number(id) : null
    }
  ).pipe(
    filter(val => val != null),
    tap(val => { this.globalEventsManager.showLoading(true); }),
    switchMap(id => this.productController.getProductUsingGET(id).pipe(
      catchError(val => of(null))
    )),
    filter(resp => !!resp),
    map(resp => {
      return resp.data
    }),
    tap(val => { this.globalEventsManager.showLoading(false); }),
    tap(data => {
      this.currentProduct = data
      this.buyers = [];
      this.producers = [];
      this.owners = [];
      this.associations = [];
      this.roasters = [];
      for (let c of this.currentProduct.associatedCompanies) {
        if (c.type === "BUYER") this.buyers.push(c);
        if (c.type === "PRODUCER") this.producers.push(c);
        if (c.type === "OWNER") this.owners.push(c);
        if (c.type === "ASSOCIATION") this.associations.push(c);
        if (c.type === "ROASTER") this.roasters.push(c);
      }
    }),
    shareReplay(1)
  )

  async newBuyer() {
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabelStakeholders.modal.buyer.title:Add buyer`,
      instructionsHtml: $localize`:@@productLabelStakeholders.modal.buyer.instructionsHtml:Select buyer company`
    })
    let company = await modalRef.result;
    if (company) {
      this.addBuyerProducerToProduct(company.id, "BUYER")
    }
  }

  async newProducer() {
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabelStakeholders.modal.producer.title:Add producer`,
      instructionsHtml: $localize`:@@productLabelStakeholders.modal.producer.instructionsHtml:Select producer company`
    })
    let company = await modalRef.result;
    if (company) {
      this.addBuyerProducerToProduct(company.id, "PRODUCER")
    }
  }

  async newOwner() {
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabelStakeholders.modal.owner.title:Add owner`,
      instructionsHtml: $localize`:@@productLabelStakeholders.modal.owner.instructionsHtml:Select owner company`
    })
    let company = await modalRef.result;
    if (company) {
      this.addBuyerProducerToProduct(company.id, "OWNER")
    }
  }

  async newAssociation() {
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabelStakeholders.modal.association.title:Add association`,
      instructionsHtml: $localize`:@@productLabelStakeholders.modal.association.instructionsHtml:Select association company`
    })
    let company = await modalRef.result;
    if (company) {
      this.addBuyerProducerToProduct(company.id, "ASSOCIATION")
    }
  }

  async newRoaster() {
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabelStakeholders.modal.roaster.title:Add roaster`,
      instructionsHtml: $localize`:@@productLabelStakeholders.modal.roaster.instructionsHtml:Select roaster company`
    })
    let company = await modalRef.result;
    if (company) {
      this.addBuyerProducerToProduct(company.id, "ROASTER")
    }
  }

  async remove(company) {
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelStakeholders.remove.warning.message:Are you sure you want to remove ${company.company.name}?`,
      options: { centered: true },
      dismissable: false
    });
    if (result != "ok") return

    try {
      this.globalEventsManager.showLoading(true);
      this.currentProduct.associatedCompanies = this.currentProduct.associatedCompanies.filter(c => c !== company);
      let res = await this.productController.updateProductUsingPUT(this.currentProduct).pipe(take(1)).toPromise()
      if (res && res.status === 'OK') {
        let resChain = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
        if (resChain && 'OK' === resChain.status && resChain.data) {
          let chainObj = resChain.data;

          let organizationRoles = [];
          if (this.currentProduct.associatedCompanies && this.currentProduct.associatedCompanies.length > 0) {
            for (let com of this.currentProduct.associatedCompanies) {
              let assocComp = {
                companyId: com.company.id,
                role: com.type
              }
              organizationRoles.push(assocComp);
            }
          }
          chainObj['organizationRoles'] = organizationRoles;
          let resPost = await this.chainProductService.postProduct(chainObj).pipe(take(1)).toPromise();
        }
        this.reload();
      }
    } catch (e) {
    } finally {
      this.globalEventsManager.showLoading(false);
    }

  }


  async collectorDetail(type) {
    let resp = await this.chainUserCustomer.listUserCustomers().pipe(take(1)).toPromise();
    if(resp && resp.status === 'OK' && resp.data) {
      let collectorId = resp.data.count +1;
      this.router.navigate(['product-labels', this.productId, 'stakeholders', type, 'organization', this.organizationId, 'new', collectorId]);
    }
    // console.log(resp);
    // let collectorId = 0;
    // if (type === 'farmers') collectorId = this.allFarmers+1;
    // else collectorId = this.allCollectors+1;
    // this.router.navigate(['product-labels', this.productId, 'stakeholders', type, 'organization', this.organizationId, 'new', collectorId]);
  }

  customerDetail() {
    let customerId = this.allCustomers+1;
    this.router.navigate(['product-labels', this.productId, 'stakeholders', 'customers', 'organization', this.organizationId, 'new', customerId]);
  }

  serchInput(event, type) {
    if (type == 'collectors') this.reloadCollectorsPing$.next(true);
    if (type == 'farmers') this.reloadFarmersPing$.next(true);
    if (type == 'customer') this.reloadCustomersPing$.next(true);
  }

  onCategoryChange(event, type) {
    if (type === 'collectors') {
      this.byCategoryCollector = event;
      this.sortingParamsCollector$.next({ queryBy: event, sort: event.sortOrder })
    }
    if (type === 'farmers') {
      this.byCategoryFarmer = event;
      this.sortingParamsFarmer$.next({ queryBy: event, sort: event.sortOrder })
    }
  }

  onSortChanged(event, type) {
    if (type === 'collectors') {
      this.byCategoryCollector = event;
    }
    if (type === 'farmers') {
      this.byCategoryFarmer = event;
    }
  }

  buyersSection = {
    anchor: 'BUYERS',
    title: $localize`:@@productLabelStakeholders.title.buyers:Buyers`
  }

  ownersSection = {
    anchor: 'OWNERS',
    title: $localize`:@@productLabelStakeholders.title.owners:Owners`
  }

  producersSection = {
    anchor: 'PRODUCERS',
    title: $localize`:@@productLabelStakeholders.title.producers:Producers`
  }

  roastersSection = {
    anchor: 'ROASTERS',
    title: $localize`:@@productLabelStakeholders.title.roasters:Roasters`
  }

  associationsSection = {
    anchor: 'ASSOCIATIONS',
    title: $localize`:@@productLabelStakeholders.title.associations:Associations`
  }

  toc = [
    this.buyersSection,
    this.ownersSection,
    this.producersSection,
    this.roastersSection,
    this.associationsSection,
  ]


  showWarning() {
    let buttonOkText = $localize`:@@productLabelStakeholders.warning.button.ok:OK`
    this.globalEventsManager.openMessageModal({
      type: 'warning',
      title: $localize`:@@productLabelStakeholders.warning.title:Missing company`,
      message: $localize`:@@productLabelStakeholders.warning.message:Please select company before continuing`,
      options: { centered: true },
      dismissable: false,
      buttons: ['ok'],
      buttonTitles: { ok: buttonOkText }
    });
  }



}
