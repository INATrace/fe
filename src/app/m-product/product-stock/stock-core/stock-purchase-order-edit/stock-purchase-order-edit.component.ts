import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash-es';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { PaymentsService } from 'src/api-chain/api/payments.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { UserService } from 'src/api-chain/api/user.service';
import { UserCustomerService } from 'src/api-chain/api/userCustomer.service';
import { ChainActivityProof } from 'src/api-chain/model/chainActivityProof';
import { ChainDocumentRequirement } from 'src/api-chain/model/chainDocumentRequirement';
import { ChainDocumentRequirementList } from 'src/api-chain/model/chainDocumentRequirementList';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { ChainPayment } from 'src/api-chain/model/chainPayment';
import { ChainSemiProduct } from 'src/api-chain/model/chainSemiProduct';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { ChainUserCustomer } from 'src/api-chain/model/chainUserCustomer';
import { FieldDefinition } from 'src/api-chain/model/fieldDefinition';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { ActiveMeasureUnitTypeService } from 'src/app/shared-services/active-measure-unit-types.service';
import { ActiveProductsService } from 'src/app/shared-services/active-products.service';
import { ActiveSemiProductsForProductServiceStandalone } from 'src/app/shared-services/active-semi-products-for-product-standalone.service';
import { ActiveUserCustomersByOrganizationAndRoleService } from 'src/app/shared-services/active-user-customers-by-organization-and-role.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { OrganizationsCodebookService } from 'src/app/shared-services/organizations-codebook.service';
import { ListEditorManager } from 'src/app/shared/list-editor/list-editor-manager';
import { AuthService } from 'src/app/core/auth.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { environment } from 'src/environments/environment';
import { StockOrderType } from 'src/shared/types';
import { dateAtMidnightISOString, dateAtNoonISOString, dbKey, defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ApiActivityProofValidationScheme } from '../../../../company/company-stock/stock-core/additional-proof-item/validation';
import { ChainPaymentValidationScheme } from '../payment-item/validation';
import { ChainStockOrderValidationScheme } from './validation';

@Component({
  selector: 'app-stock-purchase-order-edit',
  templateUrl: './stock-purchase-order-edit.component.html',
  styleUrls: ['./stock-purchase-order-edit.component.scss']
})
export class StockPurchaseOrderEditComponent implements OnInit {

  update: Boolean = true;

  title: String = null;

  sku = null;
  payments: ChainPayment[];

  @Input()
  organizationId: string = null;

  stockOrderForm: FormGroup;
  submitted: Boolean = false;

  rootImageUrl: string = environment.relativeImageUplodadUrlAllSizes;

  activeSemiProductsForProduct: ActiveSemiProductsForProductServiceStandalone;
  farmersCodebook: ActiveUserCustomersByOrganizationAndRoleService;
  collectorsCodebook: ActiveUserCustomersByOrganizationAndRoleService;

  alreadyPayed: number = 0;

  updatePOInProgress: boolean = false;

  constructor(
    public sifrantProduct: ActiveProductsService,
    public activeMeasureUnitTypeService: ActiveMeasureUnitTypeService,
    private chainProductService: ProductService,
    private chainStockOrderService: StockOrderService,
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
    private codebookTranslations: CodebookTranslations
  ) {
  }

  order;
  productId;
  chainProductId;
  chainProductOrganizationId;
  facility: ChainFacility;
  modelChoice = null;
  options: ChainSemiProduct[] = []
  purchaseOrderId = this.route.snapshot.params.purchaseOrderId;
  facilityNameForm = new FormControl(null);
  searchWomensCoffeeForm = new FormControl(null, Validators.required);
  userLastChanged = null;

  updateTitle(pageMode: StockOrderType) {
    switch (pageMode) {
      case 'GENERAL_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.updateGeneralOrderTitle:Update transfer order`
      case 'PROCESSING_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.updateProcessingOrderTitle:Update processing order`
      case 'PURCHASE_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.updatePurchaseOrderTitle:Update purchase order`
      default:
        return null
    }
  }

  newTitle(pageMode: StockOrderType) {
    switch (pageMode) {
      case 'GENERAL_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.newGeneralOrderTitle:New transfer order`
      case 'PROCESSING_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.newProcessingOrderTitle:New processing order`
      case 'PURCHASE_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.newPurchaseOrderTitle:New purchase order`
      default:
        return null
    }
  }

  async initInitialData() {
    let action = this.route.snapshot.data.action
    if (!action) return;


    // standalone on route
    this.productId = this.route.snapshot.params.id
    if (action === 'new') {
      this.update = false;
      this.title = this.newTitle(this.orderType)
      let facilityId = this.route.snapshot.params.facilityId;

      let resp = await this.chainFacilityService.getFacilityById(facilityId).pipe(take(1)).toPromise();
      if (resp && resp.status === "OK" && resp.data && resp.data) {
        this.facility = resp.data;
        for (let item of this.facility.semiProducts) {
          if (item.isBuyable) {
            item.name = this.translateName(item);
            this.options.push(item);
          }
        }
        this.facilityNameForm.setValue(this.translateName(this.facility));
      }

    } else if (action == 'update') {
      this.title = this.updateTitle(this.orderType)
      this.update = true;
      let resp = await this.chainStockOrderService.getStockOrderById(this.purchaseOrderId).pipe(take(1)).toPromise()
      if (resp && resp.status === 'OK' && resp.data) {
        this.order = resp.data;
        this.facility = resp.data.facility;
        for (let item of this.facility.semiProducts) {
          if (item.isBuyable) {
            item.name = this.translateName(item);
            this.options.push(item);
          }
        }
        this.facilityNameForm.setValue(this.translateName(this.facility));
      }
    } else {
      throw Error("Wrong action.")
    }


    let res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    if (res && res.status === "OK" && res.data && dbKey(res.data)) {
      this.chainProductId = dbKey(res.data);
      this.chainProductOrganizationId = dbKey(res.data.organization);
    }
    if (!this.organizationId) this.organizationId = localStorage.getItem("selectedUserCompany");
    let resOrg = await this.chainOrganizationService.getOrganization(this.organizationId).pipe(take(1)).toPromise();
    if (resOrg && resOrg.status === "OK" && resOrg.data) {
      let resOrgAF = await this.companyService.getCompanyUsingGET(resOrg.data.id).pipe(take(1)).toPromise();
      if (resOrgAF && resOrgAF.status === "OK" && resOrgAF.data) {
        let obj = {};
        for (let item of resOrgAF.data.users) {
          obj[item.id.toString()] = item.name + " " + item.surname;
        }
        this.codebookUsers = EnumSifrant.fromObject(obj);
      }
    }

    this.initializeListManager();
  }
  codebookUsers;
  additionalProofsForm;
  paymentsForm;

  ngOnInit(): void {
    this.reloadPO();
  }

  get orderType(): StockOrderType {
    let realType = this.stockOrderForm && this.stockOrderForm.get('orderType').value
    if (realType) return realType
    if (this.route.snapshot.data.action === 'update') {
      if (this.order) {
        if (this.order.orderType) return this.order.orderType
      }
      return null
    }
    if (!this.route.snapshot.data.mode) throw Error("No stock order mode set")
    return this.route.snapshot.data.mode as StockOrderType
  }


  get orderTypeOptions() {
    let obj = {}
    obj['GENERAL_ORDER'] = $localize`:@@orderType.codebook.generalOrder:General order`;
    obj['PROCESSING_ORDER'] = $localize`:@@orderType.codebook.processingOrder:Processing order`;
    obj['PURCHASE_ORDER'] = $localize`:@@orderType.codebook.purchaseOrder:Purchase order`;
    return obj;
  }

  orderTypeCodebook = EnumSifrant.fromObject(this.orderTypeOptions)

  orderTypeForm = new FormControl(null)

  onSelectedType(typ: StockOrderType) {
    switch (typ as StockOrderType) {
      case 'PURCHASE_ORDER':
        this.stockOrderForm.get("orderType").setValue(typ)
        return;
      case 'GENERAL_ORDER':
        this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'general-order', 'update', this.purchaseOrderId]);
        return;
      case 'PROCESSING_ORDER':
        this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'processing-order', 'update', this.purchaseOrderId]);
        return;
      default:
        throw Error("Wrong order type: " + typ)
    }
  }

  get isGeneralOrder() {
    return this.orderType === 'GENERAL_ORDER'
  }

  get isPurchaseOrder() {
    return this.orderType === 'PURCHASE_ORDER'
  }

  get isProcessingOrder() {
    return this.orderType === 'PROCESSING_ORDER'
  }

  reloadPO() {
    this.additionalProofsForm = new FormArray([]);
    this.paymentsForm = new FormArray([]);
    this.globalEventsManager.showLoading(true);
    this.submitted = false;
    this.initInitialData().then(
      (resp: any) => {
        this.activeSemiProductsForProduct = new ActiveSemiProductsForProductServiceStandalone(this.chainSemiProductService, this.chainProductId, this.codebookTranslations)
        this.farmersCodebook = new ActiveUserCustomersByOrganizationAndRoleService(this.chainUserCustomerService, this.organizationId, 'FARMER');
        this.collectorsCodebook = new ActiveUserCustomersByOrganizationAndRoleService(this.chainUserCustomerService, this.organizationId, 'COLLECTOR');
        if (this.update) {
          this.editStockOrder();
          this.codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList)
          this.globalEventsManager.showLoading(false);
        } else {
          this.newStockOrder();
          this.codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList)
          this.globalEventsManager.showLoading(false);
        }
      }
    )

  }
  dismiss() {
    this.location.back()
  }

  newStockOrder() {
    this.stockOrderForm = generateFormFromMetadata(ChainStockOrder.formMetadata(), { facilityId: dbKey(this.facility)}, ChainStockOrderValidationScheme(this.orderType))
    if (!this.stockOrderForm.get('currency').value) {
      this.stockOrderForm.get('currency').setValue('RWF');
    }
    if (this.isPurchaseOrder) {
      this.stockOrderForm.get("isPurchaseOrder").setValue(true);
    } else {
      this.stockOrderForm.get("isPurchaseOrder").setValue(false);
    }
    this.setDate();
    let userProfile = this.authService.currentUserProfile;
    this.employeeForm.setValue(userProfile.id.toString());
    //if one semi-product => preselect it
    if (this.options && this.options.length == 1) {
      this.modelChoice = dbKey(this.options[0]);
      this.stockOrderForm.get('semiProductId').setValue(dbKey(this.options[0]));
      this.setSemiProductPrice(dbKey(this.options[0]));

    }
    this.prepareData()
  }


  get showQuantityBox() {
    let action = this.route.snapshot.data.action
    return !(this.orderType === 'PURCHASE_ORDER' && action === 'new')
  }
  subPurchaseOrdersQuantities: Subscription

  async editStockOrder() {
    this.stockOrderForm = generateFormFromMetadata(ChainStockOrder.formMetadata(), this.order, ChainStockOrderValidationScheme(this.orderType))
    if (this.isPurchaseOrder) {
      let res = await this.chainUserCustomerService.getUserCustomer(this.order.producerUserCustomerId).pipe(take(1)).toPromise();
      if (res && res.status === 'OK') this.searchFarmers.setValue(res.data);
      if (this.order.representativeOfProducerUserCustomerId) {
        let res = await this.chainUserCustomerService.getUserCustomer(this.order.representativeOfProducerUserCustomerId).pipe(take(1)).toPromise();
        if (res && res.status === 'OK') this.searchCollectors.setValue(res.data);
      }

      // sync quantities for new purchase order
      if (this.showQuantityBox) {
        if (this.subPurchaseOrdersQuantities) this.subPurchaseOrdersQuantities.unsubscribe;
        this.subPurchaseOrdersQuantities = this.stockOrderForm.get('totalQuantity').valueChanges.subscribe(val => {
          this.setQuantities()
        })
      }
    }
    this.modelChoice = this.order.semiProductId;

    // let resPay = await this.chainPaymentsService.listPaymentsForStockOrder(this.purchaseOrderId).pipe(take(1)).toPromise();
    // if (resPay && resPay.status === "OK" && resPay.data) {
    //   this.payments = resPay.data.items;
    // }
    let AFuserIdRes = await this.chainUserService.getUser(this.stockOrderForm.get('creatorId').value).pipe(take(1)).toPromise();
    if (AFuserIdRes && AFuserIdRes.status === "OK" && AFuserIdRes.data) {
      this.employeeForm.setValue(AFuserIdRes.data.id.toString());
    }
    this.prepareDocumentsForEdit();
    if (this.isPurchaseOrder) {
      this.preparePaymentsForEdit();
    }
    if (this.order.userChangedId) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) this.userLastChanged = res.data.name + " " + res.data.surname;
    } else if (this.order.userCreatedId) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) this.userLastChanged = res.data.name + " " + res.data.surname;
    }
  }

  setDate() {
    let today = dateAtMidnightISOString(new Date().toDateString());
    this.stockOrderForm.get('productionDate').setValue(today);
  }

  get preferredWayOfPaymentList() {
    let obj = {}
    obj['CASH_VIA_COOPERATIVE'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cashViaCooperative:Cash via cooperative`
    if (this.stockOrderForm && this.stockOrderForm.get('representativeOfProducerUserCustomerId') && this.stockOrderForm.get('representativeOfProducerUserCustomerId').value) {
      obj['CASH_VIA_COLLECTOR'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cashViaCollector:Cash via collector`
    }
    if (this.stockOrderForm && this.stockOrderForm.get('producerUserCustomerId') && this.stockOrderForm.get('producerUserCustomerId').value && this.stockOrderForm.get('representativeOfProducerUserCustomerId') && !this.stockOrderForm.get('representativeOfProducerUserCustomerId').value) {
      obj['UNKNOWN'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.unknown:Unknown`
    }
    obj['BANK_TRANSFER'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.bankTransfer:Bank transfer`
    return obj;
  }
  codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList)

  get womensCoffeeList() {
    let obj = {}
    obj['YES'] = $localize`:@@productLabelStockPurchaseOrdersModal.womensCoffeeList.yes:Yes`
    obj['NO'] = $localize`:@@productLabelStockPurchaseOrdersModal.womensCoffeeList.no:No`
    return obj;
  }
  codebookWomensCoffee = EnumSifrant.fromObject(this.womensCoffeeList)

  searchCollectors = new FormControl(null)
  searchFarmers = new FormControl(null, Validators.required)
  employeeForm = new FormControl(null, Validators.required)

  onFileUpload() { }

  initData() {
  }

  async updatePO(close: boolean = true) {
    if (this.updatePOInProgress) return;
    this.updatePOInProgress = true;
    this.globalEventsManager.showLoading(true);
    this.submitted = true;
    if (this.cannotUpdatePOorAddPayment()) {
      this.updatePOInProgress = false;
      this.globalEventsManager.showLoading(false);
      return;
    }
    let AFuserIdRes = await this.chainUserService.getUserByAFId(parseInt(this.employeeForm.value)).pipe(take(1)).toPromise();
    if (AFuserIdRes && AFuserIdRes.status === "OK" && AFuserIdRes.data) {
      this.stockOrderForm.get('creatorId').setValue(dbKey(AFuserIdRes.data));
    }
    this.stockOrderForm.get('orderType').setValue("PURCHASE_ORDER")
    this.prepareDocuments();
    if (!this.update) await this.setIdentifier();
    let data = _.cloneDeep(this.stockOrderForm.value);

    data = {
      ...data,
      womenShare: this.searchWomensCoffeeForm.value === 'YES' ? 1 : 0
    }
    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);
    if (this.update && this.authService.currentUserProfile) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) data.userChangedId = dbKey(res.data);
    } else if (this.authService.currentUserProfile) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) data.userCreatedId = dbKey(res.data);
    }

    try {
      // this.globalEventsManager.showLoading(true);
      // console.log("DT:", data)
      let res = await this.chainStockOrderService.postStockOrder(data).pipe(take(1)).toPromise()
      // console.log("SAVED", data._id)
      if (res && res.status == 'OK') {
        // this.globalEventsManager.showLoading(false);
        if (close) this.dismiss();
        else {
          this.stockOrderForm.markAsPristine();
          this.searchFarmers.markAsPristine();
          this.employeeForm.markAsPristine();
          setTimeout(() => this.reloadPO(), environment.reloadDelay);
        }
      }
      // this.dismiss();
    } catch(e) {
      this.globalEventsManager.showLoading(false)
      throw e
    } finally {
      this.updatePOInProgress = false;
      // this.globalEventsManager.showLoading(false); // reloadPO with timeout takes care of it.
    }
  }

  cannotUpdatePOorAddPayment() {
    this.prepareData();
    return (this.stockOrderForm.invalid || this.searchFarmers.invalid || this.employeeForm.invalid || !this.modelChoice || this.searchWomensCoffeeForm.invalid);
  }

  get changed() {
    return this.employeeForm.dirty || this.searchFarmers.dirty || this.stockOrderForm.dirty
  }

  setSemiProductPrice(id) {
    for (let price of this.facility.semiProductPrices) {
      if (price.semiProductId === id) {
        this.stockOrderForm.get('pricePerUnit').setValue(price.price);
        this.stockOrderForm.get('semiProductId').markAsDirty();
        this.stockOrderForm.get('semiProductId').updateValueAndValidity();
      }
    }
  }
  semiProductSelected(id: string) {
    if (id) {
      this.stockOrderForm.get('semiProductId').setValue(id);
      if (!this.update) this.setSemiProductPrice(id);
    } else {
      this.stockOrderForm.get('semiProductId').setValue(null);
    }
    this.stockOrderForm.get('semiProductId').markAsDirty();
    this.stockOrderForm.get('semiProductId').updateValueAndValidity();
  }

  setCollector(event: ChainUserCustomer) {
    if (event) {
      this.stockOrderForm.get('representativeOfProducerUserCustomerId').setValue(dbKey(event))
      if (this.stockOrderForm.get('preferredWayOfPayment') && this.stockOrderForm.get('preferredWayOfPayment').value == 'UNKNOWN') {
        this.stockOrderForm.get('preferredWayOfPayment').setValue(null)
      }
    } else {
      this.stockOrderForm.get('representativeOfProducerUserCustomerId').setValue(null)
      if (this.stockOrderForm.get('preferredWayOfPayment') && this.stockOrderForm.get('preferredWayOfPayment').value == 'CASH_VIA_COLLECTOR') {
        this.stockOrderForm.get('preferredWayOfPayment').setValue(null)
      }
    }
    this.stockOrderForm.get('representativeOfProducerUserCustomerId').markAsDirty();
    this.stockOrderForm.get('representativeOfProducerUserCustomerId').updateValueAndValidity()
    this.codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList)
  }

  setFarmer(event: ChainUserCustomer) {
    if (event) {
      this.stockOrderForm.get('producerUserCustomerId').setValue(dbKey(event))
    } else {
      this.stockOrderForm.get('producerUserCustomerId').setValue(null)
    }
    this.stockOrderForm.get('producerUserCustomerId').markAsDirty();
    this.stockOrderForm.get('producerUserCustomerId').updateValueAndValidity()
    this.codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList)
  }

  setToBePaid() {
    if (this.stockOrderForm && this.stockOrderForm.get('totalQuantity').value && this.stockOrderForm.get('pricePerUnit').value) {
      this.stockOrderForm.get('cost').setValue(this.stockOrderForm.get('totalQuantity').value * this.stockOrderForm.get('pricePerUnit').value)
    } else {
      this.stockOrderForm.get('cost').setValue(null)
    }
  }

  setBalance() {
    if (this.stockOrderForm && this.stockOrderForm.get('cost').value) {
      if (!this.update) this.stockOrderForm.get('balance').setValue(this.stockOrderForm.get('cost').value)
      // else this.stockOrderForm.get('balance').setValue(this.stockOrderForm.get('cost').value - this.alreadyPayed)
    } else {
      this.stockOrderForm.get('balance').setValue(null)
    }
  }

  async setIdentifier() {
    let farmer = await this.chainUserCustomerService.getUserCustomer(this.stockOrderForm.get("producerUserCustomerId").value).pipe(take(1)).toPromise();
    if (farmer && farmer.status === "OK" && farmer.data) {
      let identifier = "PT-" + farmer.data.surname + "-" + this.stockOrderForm.get("productionDate").value;
      this.stockOrderForm.get('identifier').setValue(identifier);
    }
  }

  setQuantities() {
    if (this.stockOrderForm.get('totalQuantity').valid) {
      let quantity = parseFloat(this.stockOrderForm.get('totalQuantity').value)
      let form = this.stockOrderForm.get('fullfilledQuantity')
      form.setValue(quantity);
      // form.markAsDirty()
      form.updateValueAndValidity()
      // this.stockOrderForm.get('availableQuantity').setValue(quantity);
      form = this.stockOrderForm.get('availableQuantity')
      form.setValue(quantity);
      form.updateValueAndValidity()
    }
  }

  prepareData() {
    this.setQuantities()
    let pd = this.stockOrderForm.get('productionDate').value;
    if (pd != null) this.stockOrderForm.get('productionDate').setValue(dateAtNoonISOString(pd));
  }

  prepareDocuments() {
    let documentRequirements: ChainDocumentRequirementList = {
      identifier: "DOC",
      semiProductId: this.stockOrderForm.get('semiProductId').value,
      requirements: [],
      targets: {
        fairness: 0,
        provenance: 0,
        quality: 0,
        qualityLevel: "",
        // womenShare: this.searchWomensCoffeeForm.value === 'YES' ? 1 : 0,
        womenShare: this.searchWomensCoffeeForm.value === 'YES' ? 1 : 0,
        order: 0,
        payment: 0
      }
    }

    for (let item of this.additionalProofsForm.controls) {
      let chainDoc: ChainDocumentRequirement = {
        name: "",
        description: "",
        documentIdentifier: item.value.type,
        fields: [
          {
            label: "Date",
            type: FieldDefinition.TypeEnum.Date, //"date",
            required: true,
            stringValue: item.value.formalCreationDate
          },
          {
            label: "Type",
            type: FieldDefinition.TypeEnum.Text,  //"text",
            required: true,
            stringValue: item.value.type
          },
          {
            label: "Document",
            type: FieldDefinition.TypeEnum.File,//"file",
            required: true,
            files: [
              item.value.document
            ]
          }
        ],
        score: []
      };
      documentRequirements.requirements.push(chainDoc);
    }

    this.stockOrderForm.get('documentRequirements').setValue(documentRequirements);
    this.stockOrderForm.get('documentRequirements').updateValueAndValidity();

  }

  prepareDocumentsForEdit() {
    let date = null;
    let type = null;
    let document = null;
    if (this.stockOrderForm.get('documentRequirements').value && this.stockOrderForm.get('documentRequirements').value.requirements) {
      for (let item of this.stockOrderForm.get('documentRequirements').value.requirements) {
        if (item.fields && item.fields.length > 0) {
          for (let field of item.fields) {
            if (field.label === "Date") date = field.stringValue;
            if (field.label === "Type") type = field.stringValue;
            if (field.label === "Document") {
              if (field.files && field.files.length > 0) {
                document = field.files[0];
              }
            }
          }
        }
        if (date != null && type != null && document != null) {
          let doc: ChainActivityProof = {
            formalCreationDate: date,
            type: type,
            document: document
          };
          (this.additionalProofsForm as FormArray).push(new FormControl(doc));
        }
      }
    }
    if (this.stockOrderForm.get('documentRequirements').value && this.stockOrderForm.get('documentRequirements').value.targets) {
      let val = this.stockOrderForm.get('documentRequirements').value.targets.womenShare;
      this.searchWomensCoffeeForm.setValue(val == 1 ? 'YES' : 'NO');
    }
  }

  async preparePaymentsForEdit() {
    (this.paymentsForm as FormArray).clear();
    let resPay = await this.chainPaymentsService.listPaymentsForStockOrder(this.purchaseOrderId).pipe(take(1)).toPromise();
    if (resPay && resPay.status === "OK" && resPay.data) {
      this.payments = resPay.data.items;
    }
    for (let payment of this.payments) {
      this.alreadyPayed += payment.amount;
      (this.paymentsForm as FormArray).push(new FormControl(payment));
    }
  }

  onPaymentSaved() {
    setTimeout(() => this.reloadPO(), environment.reloadDelay);
  }

  additionalProofsListManager = null;
  paymentsListManager = null;

  initializeListManager() {
    this.additionalProofsListManager = new ListEditorManager<ChainActivityProof>(
      this.additionalProofsForm as FormArray,
      StockPurchaseOrderEditComponent.AdditionalProofItemEmptyObjectFormFactory(),
      ApiActivityProofValidationScheme
    )

    this.paymentsListManager = new ListEditorManager<ChainPayment>(
      this.paymentsForm as FormArray,
      StockPurchaseOrderEditComponent.ChainPaymentEmptyObjectFormFactory(),
      ChainPaymentValidationScheme
    )
  }

  get quantityLabel() {
    if (this.orderType === 'PURCHASE_ORDER') {
      return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.quantityDelieveredInKG.label:Quantity (kg)`
    } else {
      return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.quantity.label:Quantity (units)`
    }
  }

  static AdditionalProofItemCreateEmptyObject(): ChainActivityProof {
    let obj = ChainActivityProof.formMetadata();
    return defaultEmptyObject(obj) as ChainActivityProof
  }

  static AdditionalProofItemEmptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(StockPurchaseOrderEditComponent.AdditionalProofItemCreateEmptyObject(), ApiActivityProofValidationScheme.validators)
      return f
    }
  }

  static ChainPaymentCreateEmptyObject(): ChainPayment {
    let obj = ChainPayment.formMetadata();
    return defaultEmptyObject(obj) as ChainPayment
  }

  static ChainPaymentEmptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(StockPurchaseOrderEditComponent.ChainPaymentCreateEmptyObject(), ChainPaymentValidationScheme.validators)
      return f
    }
  }

  translateName(obj) {
    return this.codebookTranslations.translate(obj, 'name');
  }
}
