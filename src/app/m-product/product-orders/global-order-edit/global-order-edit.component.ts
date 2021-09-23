import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash-es';
import { take } from 'rxjs/operators';
import { CompanyCustomerService } from 'src/api-chain/api/companyCustomer.service';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { OrderService } from 'src/api-chain/api/order.service';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { PaymentsService } from 'src/api-chain/api/payments.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { UserService } from 'src/api-chain/api/user.service';
import { UserCustomerService } from 'src/api-chain/api/userCustomer.service';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { ChainPayment } from 'src/api-chain/model/chainPayment';
import { ChainProcessingOrder } from 'src/api-chain/model/chainProcessingOrder';
import { ChainProductOrder } from 'src/api-chain/model/chainProductOrder';
import { ChainSemiProduct } from 'src/api-chain/model/chainSemiProduct';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { ActiveCompanyCustomersByOrganizationService } from 'src/app/shared-services/active-company-customers-by-organization.service';
import { ActiveFacilitiesForOrganizationCodebookStandaloneService } from 'src/app/shared-services/active-facilities-for-organization-codebook-standalone.service';
import { ActiveFacilitiesForOrganizationService } from 'src/app/shared-services/active-facilities-for-organization.service';
import { ActiveMeasureUnitTypeService } from 'src/app/shared-services/active-measure-unit-types.service';
import { ActiveProductsService } from 'src/app/shared-services/active-products.service';
import { ActiveSemiProductsForProductServiceStandalone } from 'src/app/shared-services/active-semi-products-for-product-standalone.service';
import { ActiveUserCustomersByOrganizationAndRoleService } from 'src/app/shared-services/active-user-customers-by-organization-and-role.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { GradeAbbreviationCodebook } from 'src/app/shared-services/grade-abbreviation-codebook';
import { OrganizationsCodebookService } from 'src/app/shared-services/organizations-codebook.service';
import { ListEditorManager } from 'src/app/shared/list-editor/list-editor-manager';
import { AuthService } from 'src/app/core/auth.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { environment } from 'src/environments/environment';
import { dateAtMidnightISOString, dbKey, defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ChainStockOrderValidationScheme } from './stock-order-item/validation';
import { ChainProductOrderValidationScheme } from './validation';
import { GradeAbbreviationControllerService } from '../../../../api/api/gradeAbbreviationController.service';

@Component({
  selector: 'app-global-order-edit',
  templateUrl: './global-order-edit.component.html',
  styleUrls: ['./global-order-edit.component.scss']
})
export class GlobalOrderEditComponent implements OnInit {

  constructor(
    public sifrantProduct: ActiveProductsService,
    // private productController: ProductControllerService,
    protected chainCompanyCustomerService: CompanyCustomerService,
    public activeMeasureUnitTypeService: ActiveMeasureUnitTypeService,
    public activeFacilitiesForOrganizationService: ActiveFacilitiesForOrganizationService,
    private chainProductService: ProductService,
    private chainStockOrderService: StockOrderService,
    private chainOrderService: OrderService,
    private globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private chainSemiProductService: SemiProductService,
    public chainOrganizationCodebook: OrganizationsCodebookService,
    public chainFacilityService: FacilityService,
    private chainUserCustomerService: UserCustomerService,
    private chainPaymentsService: PaymentsService,
    private chainOrganizationService: OrganizationService,
    private companyService: CompanyControllerService,
    private chainUserService: UserService,
    public authService: AuthService,
    private chainCodebookService: GradeAbbreviationControllerService,
    private codebookTranslations: CodebookTranslations
  ) { }

  get outputFacilityId() {
    if (this.outputFacilityForm.value) { return dbKey(this.outputFacilityForm.value); }
    return null;
  }

  update = true;

  title: string = null;

  sku = null;
  payments: ChainPayment[];

  @Input()
  organizationId: string = null;

  form: FormGroup;
  submitted = false;

  rootImageUrl: string = environment.relativeImageUplodadUrlAllSizes;

  activeSemiProductsForProduct: ActiveSemiProductsForProductServiceStandalone;
  farmersCodebook: ActiveUserCustomersByOrganizationAndRoleService;
  collectorsCodebook: ActiveUserCustomersByOrganizationAndRoleService;

  alreadyPayed = 0;

  // inputFacilityForm = new FormControl(null, Validators.required);
  outputFacilityForm = new FormControl(null, Validators.required);

  order: ChainProductOrder;
  orderId = this.route.snapshot.params.orderId;
  stockOrder: ChainStockOrder;
  productId;
  chainProductId;
  chainProductOrganizationId;
  facility: ChainFacility;
  modelChoice = null;
  options: ChainSemiProduct[] = [];
  // purchaseOrderId = this.route.snapshot.params.purchaseOrderId;
  stockOrderId = this.route.snapshot.params.stockOrderId;

  facilityNameForm = new FormControl(null);
  searchWomensCoffeeForm = new FormControl(null, Validators.required);
  userLastChanged = null;

  creatorId: string;

  outputFacilitiesCodebook: ActiveFacilitiesForOrganizationCodebookStandaloneService;

  codebookUsers;
  additionalProofsForm;
  paymentsForm;

  companyCustomerCodebook: ActiveCompanyCustomersByOrganizationService;
  gradeAbbreviationCodebook: GradeAbbreviationCodebook;

  stockOrdersListManager = null;

  static StockOrderItemCreateEmptyObject(): ChainStockOrder {
    const obj = ChainStockOrder.formMetadata();
    return defaultEmptyObject(obj) as ChainStockOrder;
  }

  static StockOrderItemEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(GlobalOrderEditComponent.StockOrderItemCreateEmptyObject(), ChainStockOrderValidationScheme.validators);
    };
  }

  updateTitle() {
    return $localize`:@@globalOrderEdit.updateTitle:Update order`;
  }

  newTitle() {
    return $localize`:@@globalOrderEdit.newTitle:New order`;
  }

  async initInitialData() {
    const action = this.route.snapshot.data.action;
    // if (!action) return;


    // standalone on route
    this.productId = this.route.snapshot.params.id;
    if (action === 'new') {
      this.update = false;
      this.title = this.newTitle();
    } else if (action === 'update') {
      this.title = this.updateTitle();
      this.update = true;
      if (this.stockOrderId) {
        const resp = await this.chainStockOrderService.getStockOrderById(this.stockOrderId).pipe(take(1)).toPromise();
        if (resp && resp.status === 'OK' && resp.data) {
          this.stockOrder = resp.data;
          const resp2 = await this.chainOrderService.getOrder(this.stockOrder.orderId).pipe(take(1)).toPromise();
          if (resp2 && resp2.status === 'OK') {
            this.order = resp2.data;
          }
        }
      }
    } else {
      throw Error('Wrong action.');
    }


    const res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data && dbKey(res.data)) {
      this.chainProductId = dbKey(res.data);
      this.chainProductOrganizationId = dbKey(res.data.organization);
    }
    if (!this.organizationId) { this.organizationId = localStorage.getItem('selectedUserCompany'); }
    console.log('ORG_ID', this.chainProductId, this.organizationId);
    this.outputFacilitiesCodebook = new ActiveFacilitiesForOrganizationCodebookStandaloneService(this.chainFacilityService, this.organizationId, this.codebookTranslations);
    //
    // let resOrg = await this.chainOrganizationService.getOrganization(this.organizationId).pipe(take(1)).toPromise();
    // if (resOrg && resOrg.status === "OK" && resOrg.data) {
    //   let resOrgAF = await this.companyService.getCompanyUsingGET(resOrg.data.id).pipe(take(1)).toPromise();
    //   if (resOrgAF && resOrgAF.status === "OK" && resOrgAF.data) {
    //     let obj = {};
    //     for (let item of resOrgAF.data.users) {
    //       obj[item.id.toString()] = item.name + " " + item.surname;
    //     }
    //     this.codebookUsers = EnumSifrant.fromObject(obj);
    //   }
    // }
    this.creatorId = await this.getCreatorId();
  }

  ngOnInit(): void {
    this.reloadPO();
  }

  // generateOrderId() {
  //   let id = "NEKI"
  //   this.form.get('id').setValue(id)
  //   this.form.updateValueAndValidity()
  // }

  reloadPO() {
    this.globalEventsManager.showLoading(true);
    this.submitted = false;
    this.initInitialData().then(
      (resp: any) => {
        this.companyCustomerCodebook = new ActiveCompanyCustomersByOrganizationService(this.chainCompanyCustomerService, this.organizationId);
        this.gradeAbbreviationCodebook = new GradeAbbreviationCodebook(this.chainCodebookService, this.codebookTranslations);
        if (this.update) {
          this.editStockOrder();
        } else {
          this.newOrder();
        }
      }
    );

  }

  dismiss() {
    this.location.back();
  }

  newOrder() {
    this.form = generateFormFromMetadata(ChainProductOrder.formMetadata(), {}, ChainProductOrderValidationScheme);
    const userProfile = this.authService.currentUserProfile;
    this.initializeListManager();
    this.globalEventsManager.showLoading(false);
    // this.prepareData()
  }

  async editStockOrder() {
    this.form = generateFormFromMetadata(ChainProductOrder.formMetadata(), this.order, ChainProductOrderValidationScheme);
    const AFuserIdRes = await this.chainUserService.getUser(this.form.get('creatorId').value).pipe(take(1)).toPromise();
    this.initializeListManager();
    this.globalEventsManager.showLoading(false);
  }

  async getCreatorId() {
    const profile = await this.authService.userProfile$.pipe(take(1)).toPromise();
    const AFuserIdRes = await this.chainUserService.getUserByAFId(profile.id).pipe(take(1)).toPromise();
    if (AFuserIdRes && AFuserIdRes.status === 'OK' && AFuserIdRes.data) {
      return dbKey(AFuserIdRes.data);
    }
  }

  calcToday() {
    return dateAtMidnightISOString(new Date().toDateString());
  }


  async updatePO(close: boolean = true) {
    this.submitted = true;
    if (this.form.invalid || this.outputFacilityForm.invalid) {
      console.log('FORM:', this.form, this.outputFacilityForm);
      return;
    }

    let data = _.cloneDeep(this.form.value) as ChainProductOrder;
    console.log('DATA1:', data);
    const stockOrders = data.items;
    const processingOrders: ChainProcessingOrder[] = stockOrders.map((order: ChainStockOrder, index: number) => {
      let orderData = {...order} as ChainStockOrder;
      orderData.deliveryTime = data.deliveryDeadline;
      orderData.consumerCompanyCustomerId = dbKey(data.customer);
      orderData.requiredWomensCoffee = data.requiredwomensOnly;
      orderData.requiredQualityId = data.requiredGrade._id;
      delete orderData.facility;  // abused to get input facility
      // delete orderData.processingAction

      const commonDocumentRequirements = {
        identifier: 'PROCESSING_EVIDENCE_TYPE',
        semiProductId: dbKey(order.processingAction.inputSemiProduct),
        requirements: [],
        targets: {
          fairness: 0,
          provenance: 0,
          quality: 0,
          qualityLevel: '',
          womenShare: 1,
          order: 0,
          payment: 0
        }
      };

      orderData = {
        ...orderData,
        creatorId: this.creatorId,
        semiProductId: dbKey(order.processingAction.inputSemiProduct),
        facilityId: dbKey(this.outputFacilityForm.value),
        // totalQuantity: parseFloat(this.form.get('totalQuantity').value),
        fullfilledQuantity: 0,
        availableQuantity: 0,
        productionDate: this.calcToday(),
        orderType: ChainStockOrder.OrderTypeEnum.GENERALORDER,
        // processingAction: this.prAction,
        // ...commonFields,
        quoteFacilityId: dbKey((orderData as any).inputFacilityForm),
        currency: 'EUR',
        documentRequirements: commonDocumentRequirements,
        // Overriding
        internalLotNumber: `${data.id} (${orderData.processingAction.inputSemiProduct.name}, ${orderData.totalQuantity} ${orderData.processingAction.inputSemiProduct.measurementUnitType.label})`
      };

      delete (orderData as any).inputFacilityForm;
      // delete (orderData as any).outputFacilityForm

      Object.keys(orderData).forEach((key) => (orderData[key] == null) && delete orderData[key]);
      const processingOrder = {
        // _id: this.editableProcessingOrder ? dbKey(this.editableProcessingOrder) : undefined,
        initiatorUserId: this.creatorId,
        processingActionId: dbKey(order.processingAction),
        targetStockOrders: [orderData],
        // inputTransactions: this.actionType === 'SHIPMENT' ? [] : this.inputTransactions,
        inputTransactions: [],
      } as ChainProcessingOrder;
      return processingOrder;
    });
    data = {
      ...data,
      facilityId: dbKey(this.outputFacilityForm.value),
      processingOrders
    } as ChainProductOrder;
    delete data.items;
    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

    try {
      this.globalEventsManager.showLoading(true);
      const res = await this.chainOrderService.postOrder(data).pipe(take(1)).toPromise();
      if (res && res.status === 'OK') {
        // this.globalEventsManager.showLoading(false);
        if (close) { this.dismiss(); }
        else {
          setTimeout(() => this.reloadPO(), environment.reloadDelay);
        }
      }
      // this.dismiss();
    } catch (e) {
      this.globalEventsManager.showLoading(false);
      throw e;
    } finally {
      this.globalEventsManager.showLoading(false); // reloadPO with timeout takes care of it.
    }
  }

  initializeListManager() {
    this.stockOrdersListManager = new ListEditorManager<ChainStockOrder>(
      this.form.get('items') as FormArray,
      GlobalOrderEditComponent.StockOrderItemEmptyObjectFormFactory(),
      ChainStockOrderValidationScheme
    );
  }


  translateName(obj) {
    return this.codebookTranslations.translate(obj, 'name');
  }
}
