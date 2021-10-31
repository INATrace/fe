import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductControllerService } from 'src/api/api/productController.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take, filter, tap, switchMap, catchError, map, shareReplay } from 'rxjs/operators';
import { ApiProductCompany } from 'src/api/model/apiProductCompany';
import { BehaviorSubject, combineLatest, of, Subscription } from 'rxjs';
import { UnsubscribeList } from 'src/shared/rxutils';
import { FormControl } from '@angular/forms';
import { CompanySelectModalComponent } from 'src/app/company/company-list/company-select-modal/company-select-modal.component';
import { TabCommunicationService } from 'src/app/shared/tab-communication.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { NgbModalImproved } from 'src/app/core/ngb-modal-improved/ngb-modal-improved.service';
import { AuthorisedLayoutComponent } from 'src/app/layout/authorised/authorised-layout/authorised-layout.component';
import { ApiProduct } from '../../../../api/model/apiProduct';

@Component({
  template: ''
})
export class ProductLabelStakeholdersComponent implements OnInit, OnDestroy, AfterViewInit {

  buyers: ApiProductCompany[] = [];
  importers: ApiProductCompany[] = [];
  exporters: ApiProductCompany[] = [];
  owners: ApiProductCompany[] = [];
  producers: ApiProductCompany[] = [];
  associations: ApiProductCompany[] = [];
  processors: ApiProductCompany[] = [];
  traders: ApiProductCompany[] = [];

  isOwner = false;

  constructor(
    protected productController: ProductControllerService,
    protected globalEventsManager: GlobalEventManagerService,
    protected modalService: NgbModalImproved,
    protected route: ActivatedRoute,
    protected router: Router
  ) { }

  // TABS ////////////////
  @ViewChild(AuthorisedLayoutComponent) authorizedLayout;
  rootTab = 0;
  selectedTab: Subscription;

  tabs = [
    $localize`:@@productLabelStakeholders.tab0.title:Value chain`
  ];

  tabNames = [
    'value-chain'
  ];

  buyersSection = {
    anchor: 'BUYERS',
    title: $localize`:@@productLabelStakeholders.title.buyers:Buyers`
  };

  ownersSection = {
    anchor: 'OWNERS',
    title: $localize`:@@productLabelStakeholders.title.owners:Product admins`
  };

  producersSection = {
    anchor: 'PRODUCERS',
    title: $localize`:@@productLabelStakeholders.title.producers:Producers`
  };

  roastersSection = {
    anchor: 'ROASTERS',
    title: $localize`:@@productLabelStakeholders.title.roasters:Roasters`
  };

  associationsSection = {
    anchor: 'ASSOCIATIONS',
    title: $localize`:@@productLabelStakeholders.title.associations:Associations`
  };

  toc = [
    this.buyersSection,
    this.ownersSection,
    this.producersSection,
    this.roastersSection,
    this.associationsSection,
  ];

  activeTab = this.getIdForTabName(this.route.snapshot.data.tab);
  isActivePage = false;
  unsubsribeList = new UnsubscribeList();

  showedCollectors = 0;
  showedCustomers = 0;
  showedFarmers = 0;

  allCollectors = 0;
  allCustomers = 0;
  allFarmers = 0;

  searchNameCollectors = new FormControl(null);
  searchNameCustomers = new FormControl(null);
  searchNameFarmers = new FormControl(null);

  productId = this.route.snapshot.params.id;
  unsubscribeList = new UnsubscribeList();
  currentProduct;
  organizationId;
  productOrganizationId;

  public reloadValueChainPing$ = new BehaviorSubject<boolean>(false);
  public reloadCollectorsPing$ = new BehaviorSubject<boolean>(false);
  public reloadCustomersPing$ = new BehaviorSubject<boolean>(false);
  public reloadFarmersPing$ = new BehaviorSubject<boolean>(false);


  byCategoryFarmer = 'BY_NAME';
  byCategoryCollector = 'BY_NAME';
  public sortingParamsFarmer$ = new BehaviorSubject({ queryBy: this.byCategoryFarmer, sort: 'ASC' });
  public sortingParamsCollector$ = new BehaviorSubject({ queryBy: this.byCategoryCollector, sort: 'ASC' });
  items = [{ name: $localize`:@@productLabelStakeholders.search.name:name`, category: 'BY_NAME' }, { name: $localize`:@@productLabelStakeholders.search.surname:surname`, category: 'BY_SURNAME' }];

  tabSub: Subscription;

  product$ = combineLatest(this.reloadValueChainPing$, of(this.productId),
      (ping: any, id: string) => {
        return ping && id != null ? Number(id) : null;
      }
  ).pipe(
      filter(val => val != null),
      tap(val => { this.globalEventsManager.showLoading(true); }),
      switchMap(id => this.productController.getProductUsingGET(id).pipe(
          catchError(val => of(null))
      )),
      filter(resp => !!resp),
      map(resp => {
        return resp.data;
      }),
      tap(val => { this.globalEventsManager.showLoading(false); }),
      tap((data: ApiProduct) => {
        this.currentProduct = data;

        this.isOwner = data.associatedCompanies.some(value => value.type === ApiProductCompany.TypeEnum.OWNER && value.company.id === Number(this.organizationId));

        this.buyers = [];
        this.importers = [];
        this.exporters = [];
        this.owners = [];
        this.producers = [];
        this.associations = [];
        this.processors = [];
        this.traders = [];

        for (const ac of this.currentProduct.associatedCompanies) {
          switch (ac.type) {
            case ApiProductCompany.TypeEnum.BUYER: this.buyers.push(ac); break;
            case ApiProductCompany.TypeEnum.IMPORTER: this.importers.push(ac); break;
            case ApiProductCompany.TypeEnum.EXPORTER: this.exporters.push(ac); break;
            case ApiProductCompany.TypeEnum.OWNER: this.owners.push(ac); break;
            case ApiProductCompany.TypeEnum.PRODUCER: this.producers.push(ac); break;
            case ApiProductCompany.TypeEnum.ASSOCIATION: this.associations.push(ac); break;
            case ApiProductCompany.TypeEnum.PROCESSOR: this.processors.push(ac); break;
            case ApiProductCompany.TypeEnum.TRADER: this.traders.push(ac); break;
          }
        }
      }),
      shareReplay(1)
  );

  get tabCommunicationService(): TabCommunicationService {
    return this.authorizedLayout ? this.authorizedLayout.tabCommunicationService : null;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.reloadPage();
  }

  targetNavigate(segment: string) {
    this.router.navigate([segment], { relativeTo: this.route.parent });
  }
  ngAfterViewInit() {
    this.selectedTab = this.tabCommunicationService.subscribe(this.tabs, this.tabNames, this.rootTab, this.targetNavigate.bind(this));
  }

  ngOnInit(): void {
    this.unsubscribeList.add(
      this.product$.subscribe(val => { }),
    );
    this.reload();

    this.setAlls();
    this.setOrganizationId();
  }

  ngOnDestroy(): void {
    this.tabCommunicationService.announceTabTitles([]);
    this.unsubscribeList.cleanup();
    if (this.tabSub) {
      this.tabSub.unsubscribe();
    }
  }

  async setOrganizationId() {

    this.organizationId = localStorage.getItem('selectedUserCompany');


  }

  getIdForTabName(name: string) {
    return this.tabNames.indexOf(name);
  }

  getTabNameForId(id: number) {
    if (id >= this.tabNames.length || id < 0) {
      return null;
    }
    return this.tabNames[id];
  }

  reloadPage() {

    const tabName = this.route.snapshot.data.tab;
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

  async setAlls() { }

  onShow(event, type) {
    if (type === 'collectors') { this.showedCollectors = event; }
    if (type === 'customers') { this.showedCustomers = event; }
    if (type === 'farmers') { this.showedFarmers = event; }
  }

  onCountAll(event, type) {
    if (type === 'collectors') { this.allCollectors = event; }
    if (type === 'customers') { this.allCustomers = event; }
    if (type === 'farmers') { this.allFarmers = event; }
  }

  async addStakeholderToProduct(cId, cType) {
    try {
      this.globalEventsManager.showLoading(true);
      this.currentProduct.associatedCompanies.push({ company: { id: cId }, type: cType });
      const res = await this.productController.updateProductUsingPUT(this.currentProduct).pipe(take(1)).toPromise();
      if (res && res.status === 'OK') {
        this.reload();
      }
    } catch (e) {
    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

  reload() {
    this.reloadValueChainPing$.next(true);
  }

  async newBuyer() {
    if (this.owners && this.owners.length === 0) {
      await this.dialogEmptyOwner();
      return;
    }
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabelStakeholders.modal.buyer.title:Add buyer`,
      instructionsHtml: $localize`:@@productLabelStakeholders.modal.buyer.instructionsHtml:Select buyer company`
    });
    const company = await modalRef.result;
    if (company) {
      this.addStakeholderToProduct(company.id, ApiProductCompany.TypeEnum.BUYER);
    }
  }

  async newImporter() {
    if (this.owners && this.owners.length === 0) {
      await this.dialogEmptyOwner();
      return;
    }
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabelStakeholders.modal.importer.title:Add importer`,
      instructionsHtml: $localize`:@@productLabelStakeholders.modal.importer.instructionsHtml:Select importer company`
    });
    const company = await modalRef.result;
    if (company) {
      this.addStakeholderToProduct(company.id, ApiProductCompany.TypeEnum.IMPORTER);
    }
  }

  async newExporter() {
    if (this.owners && this.owners.length === 0) {
      await this.dialogEmptyOwner();
      return;
    }
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabelStakeholders.modal.exporter.title:Add exporter`,
      instructionsHtml: $localize`:@@productLabelStakeholders.modal.exporter.instructionsHtml:Select exporter company`
    });
    const company = await modalRef.result;
    if (company) {
      this.addStakeholderToProduct(company.id, ApiProductCompany.TypeEnum.EXPORTER);
    }
  }

  async newProducer() {
    if (this.owners && this.owners.length === 0) {
      await this.dialogEmptyOwner();
      return;
    }
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabelStakeholders.modal.producer.title:Add producer`,
      instructionsHtml: $localize`:@@productLabelStakeholders.modal.producer.instructionsHtml:Select producer company`
    });
    const company = await modalRef.result;
    if (company) {
      this.addStakeholderToProduct(company.id, ApiProductCompany.TypeEnum.PRODUCER);
    }
  }

  async newOwner() {
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabelStakeholders.modal.owner.title:Add product admin`,
      instructionsHtml: $localize`:@@productLabelStakeholders.modal.owner.instructionsHtml:Select product admin company`
    });
    const company = await modalRef.result;
    if (company) {
      this.addStakeholderToProduct(company.id, ApiProductCompany.TypeEnum.OWNER);
    }
  }

  async newAssociation() {
    if (this.owners && this.owners.length === 0) {
      await this.dialogEmptyOwner();
      return;
    }
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabelStakeholders.modal.association.title:Add association`,
      instructionsHtml: $localize`:@@productLabelStakeholders.modal.association.instructionsHtml:Select association company`
    });
    const company = await modalRef.result;
    if (company) {
      this.addStakeholderToProduct(company.id, ApiProductCompany.TypeEnum.ASSOCIATION);
    }
  }

  async newProcessor() {
    if (this.owners && this.owners.length === 0) {
      await this.dialogEmptyOwner();
      return;
    }
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabelStakeholders.modal.processor.title:Add processor`,
      instructionsHtml: $localize`:@@productLabelStakeholders.modal.processor.instructionsHtml:Select processor company`
    });
    const company = await modalRef.result;
    if (company) {
      this.addStakeholderToProduct(company.id, ApiProductCompany.TypeEnum.PROCESSOR);
    }
  }

  async newTrader() {
    if (this.owners && this.owners.length === 0) {
      await this.dialogEmptyOwner();
      return;
    }
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabelStakeholders.modal.trader.title:Add trader`,
      instructionsHtml: $localize`:@@productLabelStakeholders.modal.trader.instructionsHtml:Select trader company`
    });
    const company = await modalRef.result;
    if (company) {
      this.addStakeholderToProduct(company.id, ApiProductCompany.TypeEnum.TRADER);
    }
  }

  async remove(company) {
    if (!this.isOwner) {
      return;
    }
    if (company.type === ApiProductCompany.TypeEnum.OWNER && this.owners.length <= 1) {
      await this.globalEventsManager.openMessageModal({
        type: 'error',
        message: $localize`:@@productLabelStakeholders.modal.owner.remove.error.title:The product must have at least one owner. If you want to delete the current owner, add another owner first.`,
        options: {
          centered: true
        },
        dismissable: false
      });
      return;
    }
    const result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelStakeholders.remove.warning.message:Are you sure you want to remove ${company.company.name}?`,
      options: { centered: true },
      dismissable: false
    });
    if (result !== 'ok') {
      return;
    }

    try {
      this.globalEventsManager.showLoading(true);
      this.currentProduct.associatedCompanies = this.currentProduct.associatedCompanies.filter(c => c !== company);
      const res = await this.productController.updateProductUsingPUT(this.currentProduct).pipe(take(1)).toPromise();
      if (res && res.status === 'OK') {
        this.reload();
      }
    } catch (e) {
    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

  async dialogEmptyOwner() {
    await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelStakeholders.modal.owner.add.warning.title:Please add an owner first.`,
      options: {
        centered: true
      },
      dismissable: false
    });
  }

  customerDetail() {
    const customerId = this.allCustomers + 1;
    this.router.navigate(['product-labels', this.productId, 'stakeholders', 'customers', 'organization', this.organizationId, 'new', customerId]);
  }

  serchInput(event, type) {
    if (type === 'collectors') { this.reloadCollectorsPing$.next(true); }
    if (type === 'farmers') { this.reloadFarmersPing$.next(true); }
    if (type === 'customer') { this.reloadCustomersPing$.next(true); }
  }

  onCategoryChange(event, type) {
    if (type === 'collectors') {
      this.byCategoryCollector = event;
      this.sortingParamsCollector$.next({ queryBy: event, sort: event.sortOrder });
    }
    if (type === 'farmers') {
      this.byCategoryFarmer = event;
      this.sortingParamsFarmer$.next({ queryBy: event, sort: event.sortOrder });
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


  showWarning() {
    const buttonOkText = $localize`:@@productLabelStakeholders.warning.button.ok:OK`;
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

  editable() {
    return this.isOwner;
  }

}
