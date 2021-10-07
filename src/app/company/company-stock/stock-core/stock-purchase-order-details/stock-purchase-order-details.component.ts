import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { StockOrderType } from '../../../../../shared/types';
import { ActivatedRoute } from '@angular/router';
import { EnumSifrant } from '../../../../shared-services/enum-sifrant';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { CompanyUserCustomersByRoleService } from '../../../../shared-services/company-user-customers-by-role.service';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { take } from 'rxjs/operators';
import { ApiFacility } from '../../../../../api/model/apiFacility';
import { ApiSemiProduct } from '../../../../../api/model/apiSemiProduct';
import { CodebookTranslations } from '../../../../shared-services/codebook-translations';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';
import { ApiUserCustomer } from '../../../../../api/model/apiUserCustomer';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { dateAtMidnightISOString, dateAtNoonISOString, defaultEmptyObject, generateFormFromMetadata } from '../../../../../shared/utils';
import { ApiStockOrderValidationScheme } from './validation';
import { Location } from '@angular/common';
import { AuthService } from '../../../../core/auth.service';
import _ from 'lodash-es';
import { StockOrderControllerService } from '../../../../../api/api/stockOrderController.service';
import { ApiResponseApiStockOrder } from '../../../../../api/model/apiResponseApiStockOrder';
import { ListEditorManager } from '../../../../shared/list-editor/list-editor-manager';
import { ChainActivityProof } from '../../../../../api-chain/model/chainActivityProof';
import { ApiActivityProofValidationScheme } from '../additional-proof-item/validation';
import { ApiActivityProof } from '../../../../../api/model/apiActivityProof';
import StatusEnum = ApiResponseApiStockOrder.StatusEnum;

@Component({
  selector: 'app-stock-purchase-order-details',
  templateUrl: './stock-purchase-order-details.component.html',
  styleUrls: ['./stock-purchase-order-details.component.scss']
})
export class StockPurchaseOrderDetailsComponent implements OnInit {

  title: string = null;

  update = true;

  stockOrderForm: FormGroup;
  order: ApiStockOrder;
  orderTypeForm = new FormControl(null);
  orderTypeCodebook = EnumSifrant.fromObject(this.orderTypeOptions);

  userLastChanged = null;

  submitted = false;

  codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList);

  searchFarmers = new FormControl(null, Validators.required);
  searchCollectors = new FormControl(null);
  farmersCodebook: CompanyUserCustomersByRoleService;
  collectorsCodebook: CompanyUserCustomersByRoleService;

  employeeForm = new FormControl(null, Validators.required);
  codebookUsers: EnumSifrant;

  facilityNameForm = new FormControl(null);

  options: ApiSemiProduct[] = [];
  modelChoice = null;

  searchWomenCoffeeForm = new FormControl(null, Validators.required);
  codebookWomenCoffee = EnumSifrant.fromObject(this.womenCoffeeList);

  updatePOInProgress = false;

  private companyId: number = null;

  private facility: ApiFacility;

  private purchaseOrderId = this.route.snapshot.params.purchaseOrderId;

  additionalProofsListManager = null;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private globalEventsManager: GlobalEventManagerService,
    private facilityControllerService: FacilityControllerService,
    private companyControllerService: CompanyControllerService,
    private stockOrderControllerService: StockOrderControllerService,
    private codebookTranslations: CodebookTranslations,
    private authService: AuthService,
  ) { }

  // Additional proof item factory methods (used when creating ListEditorManger)
  static AdditionalProofItemCreateEmptyObject(): ApiActivityProof {
    const object = ApiActivityProof.formMetadata();
    return defaultEmptyObject(object) as ApiActivityProof;
  }

  static AdditionalProofItemEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(StockPurchaseOrderDetailsComponent.AdditionalProofItemCreateEmptyObject(),
        ApiActivityProofValidationScheme.validators);
    };
  }

  get orderType(): StockOrderType {

    const realType = this.stockOrderForm && this.stockOrderForm.get('orderType').value;

    if (realType) {
      return realType;
    }

    if (this.route.snapshot.data.action === 'update') {
      if (this.order && this.order.orderType) {
        return this.order.orderType;
      }
      return null;
    }

    if (!this.route.snapshot.data.mode) {
      throw Error('No stock order mode set');
    }
    return this.route.snapshot.data.mode as StockOrderType;
  }

  get orderTypeOptions() {

    const obj = {};
    obj['GENERAL_ORDER'] = $localize`:@@orderType.codebook.generalOrder:General order`;
    obj['PROCESSING_ORDER'] = $localize`:@@orderType.codebook.processingOrder:Processing order`;
    obj['PURCHASE_ORDER'] = $localize`:@@orderType.codebook.purchaseOrder:Purchase order`;
    obj['SALES_ORDER'] = $localize`:@@orderType.codebook.salesOrder:Sales order`;
    return obj;
  }

  get preferredWayOfPaymentList() {

    const obj = {};
    obj['CASH_VIA_COOPERATIVE'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cashViaCooperative:Cash via cooperative`;

    if (this.stockOrderForm &&
      this.stockOrderForm.get('representativeOfProducerUserCustomerId') &&
      this.stockOrderForm.get('representativeOfProducerUserCustomerId').value) {

      obj['CASH_VIA_COLLECTOR'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cashViaCollector:Cash via collector`;
    }

    if (this.stockOrderForm &&
      this.stockOrderForm.get('producerUserCustomerId') &&
      this.stockOrderForm.get('producerUserCustomerId').value &&
      this.stockOrderForm.get('representativeOfProducerUserCustomerId') &&
      !this.stockOrderForm.get('representativeOfProducerUserCustomerId').value) {

      obj['UNKNOWN'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.unknown:Unknown`;
    }

    obj['BANK_TRANSFER'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.bankTransfer:Bank transfer`;
    return obj;
  }

  get quantityLabel() {
    if (this.orderType === 'PURCHASE_ORDER') {
      return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.quantityDelieveredInKG.label:Quantity (kg)`;
    } else {
      return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.quantity.label:Quantity (units)`;
    }
  }

  get additionalProofsForm(): FormArray {
    return this.stockOrderForm.get('activityProofs') as FormArray;
  }

  private get womenCoffeeList() {
    const obj = {};
    obj['YES'] = $localize`:@@productLabelStockPurchaseOrdersModal.womensCoffeeList.yes:Yes`;
    obj['NO'] = $localize`:@@productLabelStockPurchaseOrdersModal.womensCoffeeList.no:No`;
    return obj;
  }

  ngOnInit(): void {
    this.companyId = Number(localStorage.getItem('selectedUserCompany'));
    this.reloadOrder();
  }

  private newTitle(pageMode: StockOrderType) {
    switch (pageMode) {
      case 'GENERAL_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.newGeneralOrderTitle:New transfer order`;
      case 'PROCESSING_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.newProcessingOrderTitle:New processing order`;
      case 'PURCHASE_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.newPurchaseOrderTitle:New purchase order`;
      case 'SALES_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.newSalesOrderTitle:New sales order`;
      default:
        return null;
    }
  }

  updateTitle(pageMode: StockOrderType) {
    switch (pageMode) {
      case 'GENERAL_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.updateGeneralOrderTitle:Update transfer order`;
      case 'PROCESSING_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.updateProcessingOrderTitle:Update processing order`;
      case 'PURCHASE_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.updatePurchaseOrderTitle:Update purchase order`;
      case 'SALES_ORDER':
        return $localize`:@@productLabelStockPurchaseOrdersModal.updateSalesOrderTitle:Update sales order`;
      default:
        return null;
    }
  }

  private reloadOrder() {

    this.globalEventsManager.showLoading(true);
    this.submitted = false;

    this.initializeData().then(() => {
      this.farmersCodebook = new CompanyUserCustomersByRoleService(this.companyControllerService, this.companyId, 'FARMER');
      this.collectorsCodebook = new CompanyUserCustomersByRoleService(this.companyControllerService, this.companyId, 'COLLECTOR');

      if (this.update) {
        this.editStockOrder().then();
      } else {
        this.newStockOrder();
      }
      this.initializeListManager();
      this.globalEventsManager.showLoading(false);
    });
  }

  private async initializeData() {

    const action = this.route.snapshot.data.action;
    if (!action) {
      return;
    }

    if (action === 'new') {

      this.update = false;
      this.title = this.newTitle(this.orderType);
      const facilityId = this.route.snapshot.params.facilityId;

      const response = await this.facilityControllerService.getFacilityUsingGET(facilityId).pipe(take(1)).toPromise();
      if (response && response.status === StatusEnum.OK && response.data) {
        this.facility = response.data;
        for (const item of this.facility.facilitySemiProductList) {
          if (item.buyable) {
            item.name = this.translateName(item);
            this.options.push(item);
          }
        }
        this.facilityNameForm.setValue(this.translateName(this.facility));
      }

    } else if (action === 'update') {

      this.update = true;

      const stockOrderResponse = await this.stockOrderControllerService.getStockOrderUsingGET(this.purchaseOrderId).pipe(take(1)).toPromise();
      if (stockOrderResponse && stockOrderResponse.status === StatusEnum.OK && stockOrderResponse.data) {

        this.order = stockOrderResponse.data;
        this.title = this.updateTitle(this.orderType);
        this.facility = stockOrderResponse.data.facility;

        for (const item of this.facility.facilitySemiProductList) {
          if (item.buyable) {
            item.name = this.translateName(item);
            this.options.push(item);
          }
        }
        this.facilityNameForm.setValue(this.translateName(this.facility));
      }
    } else {
      throw Error('Wrong action.');
    }

    const companyRes = await this.companyControllerService.getCompanyUsingGET(this.companyId).pipe(take(1)).toPromise();
    if (companyRes && companyRes.status === StatusEnum.OK && companyRes.data) {
      const obj = {};
      for (const user of companyRes.data.users) {
        obj[user.id.toString()] = user.name + ' ' + user.surname;
      }
      this.codebookUsers = EnumSifrant.fromObject(obj);
    }

  }

  private initializeListManager() {

    this.additionalProofsListManager = new ListEditorManager<ChainActivityProof>(
      this.additionalProofsForm as FormArray,
      StockPurchaseOrderDetailsComponent.AdditionalProofItemEmptyObjectFormFactory(),
      ApiActivityProofValidationScheme
    );

    // TODO: initialize payments list manager
  }

  private newStockOrder() {

    this.stockOrderForm = generateFormFromMetadata(ApiStockOrder.formMetadata(), { facility: { id: this.facility.id } }, ApiStockOrderValidationScheme(this.orderType));

    // Set initial data
    if (!this.stockOrderForm.get('currency').value) {
      this.stockOrderForm.get('currency').setValue('RWF');
    }

    this.stockOrderForm.get('orderType').setValue(this.orderType);
    this.setDate();

    // Set current logged in user as employee
    this.employeeForm.setValue(this.authService.currentUserProfile.id.toString());

    // If only one semi-product select it as a default
    if (this.options && this.options.length === 1) {
      this.modelChoice = this.options[0].id;
      this.stockOrderForm.get('semiProduct').setValue({ id: this.options[0].id });
    }

    this.prepareData();
  }

  private async editStockOrder() {

    // Generate the form
    this.stockOrderForm = generateFormFromMetadata(ApiStockOrder.formMetadata(), this.order, ApiStockOrderValidationScheme(this.orderType));

    if (this.orderType === 'PURCHASE_ORDER') {
      this.searchFarmers.setValue(this.order.producerUserCustomer);
      if (this.order.representativeOfProducerUserCustomer && this.order.representativeOfProducerUserCustomer.id) {
        this.searchCollectors.setValue(this.order.representativeOfProducerUserCustomer);
      }
    }

    this.modelChoice = this.order.semiProduct?.id;
    this.employeeForm.setValue(this.order.creatorId.toString());
    this.searchWomenCoffeeForm.setValue(this.order.womenShare ? 'YES' : 'NO');

    // TODO: set documents and payments if purchase order

    if (this.order.updatedBy && this.order.updatedBy.id) {
      const userUpdatedBy = this.order.updatedBy;
      this.userLastChanged = `${userUpdatedBy.name} ${userUpdatedBy.surname}`;
    } else if (this.order.createdBy && this.order.createdBy.id) {
      const userCreatedBy = this.order.createdBy;
      this.userLastChanged = `${userCreatedBy.name} ${userCreatedBy.surname}`;
    }
  }

  async createOrUpdatePurchaseOrder(close: boolean = true) {

    if (this.updatePOInProgress) {
      return;
    }
    this.updatePOInProgress = true;
    this.globalEventsManager.showLoading(true);
    this.submitted = true;

    // Validate forms
    if (this.cannotUpdatePO()) {
      this.updatePOInProgress = false;
      this.globalEventsManager.showLoading(false);
      return;
    }

    // Set the user ID that creates the purchase order
    this.stockOrderForm.get('creatorId').setValue(this.employeeForm.value);

    // Set the identifier if we are creating new purchase order
    if (!this.update) {
      await this.setIdentifier();
    }

    let data: ApiStockOrder = _.cloneDeep(this.stockOrderForm.value);
    data = {
      ...data,
      womenShare: this.searchWomenCoffeeForm.value === 'YES'
    };

    // Remove keys that are not set
    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

    // Create the purchase order
    try {

      const res = await this.stockOrderControllerService.createOrUpdateStockOrderUsingPUT(data).pipe(take(1)).toPromise();

      if (res && res.status === 'OK') {
        if (close) {
          this.dismiss();
        }
        else {
          this.stockOrderForm.markAsPristine();
          this.searchFarmers.markAsPristine();
          this.employeeForm.markAsPristine();
          this.reloadOrder();
        }
      }
    } catch (e) {
      throw e;
    } finally {
      this.updatePOInProgress = false;
      this.globalEventsManager.showLoading(false);
    }
  }

  private cannotUpdatePO() {
    this.prepareData();
    return (this.stockOrderForm.invalid || this.searchFarmers.invalid ||
      this.employeeForm.invalid || !this.modelChoice || this.searchWomenCoffeeForm.invalid);
  }

  onSelectedType(type: StockOrderType) {
    switch (type as StockOrderType) {
      case 'PURCHASE_ORDER':
        this.stockOrderForm.get('orderType').setValue(type);
        return;
      case 'GENERAL_ORDER':
        // this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'general-order', 'update', this.purchaseOrderId]);
        return;
      case 'PROCESSING_ORDER':
        // this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'processing-order', 'update', this.purchaseOrderId]);
        return;
      case 'SALES_ORDER':
        // this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'sales-order', 'update', this.purchaseOrderId]);
        return;
      default:
        throw Error('Wrong order type: ' + type);
    }
  }

  setFarmer(event: ApiUserCustomer) {

    if (event) {
      this.stockOrderForm.get('producerUserCustomer').setValue({ id: event.id });
    } else {
      this.stockOrderForm.get('producerUserCustomer').setValue(null);
    }

    this.stockOrderForm.get('producerUserCustomer').markAsDirty();
    this.stockOrderForm.get('producerUserCustomer').updateValueAndValidity();
    this.codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList);
  }

  setCollector(event: ApiUserCustomer) {

    if (event) {
      this.stockOrderForm.get('representativeOfProducerUserCustomer').setValue({ id: event.id });
      if (this.stockOrderForm.get('preferredWayOfPayment') && this.stockOrderForm.get('preferredWayOfPayment').value === 'UNKNOWN') {
        this.stockOrderForm.get('preferredWayOfPayment').setValue(null);
      }
    } else {
      this.stockOrderForm.get('representativeOfProducerUserCustomer').setValue(null);
      if (this.stockOrderForm.get('preferredWayOfPayment') && this.stockOrderForm.get('preferredWayOfPayment').value === 'CASH_VIA_COLLECTOR') {
        this.stockOrderForm.get('preferredWayOfPayment').setValue(null);
      }
    }

    this.stockOrderForm.get('representativeOfProducerUserCustomer').markAsDirty();
    this.stockOrderForm.get('representativeOfProducerUserCustomer').updateValueAndValidity();
    this.codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList);
  }

  semiProductSelected(id: string) {

    if (id) {
      this.stockOrderForm.get('semiProduct').setValue({ id });
    } else {
      this.stockOrderForm.get('semiProduct').setValue(null);
    }

    this.stockOrderForm.get('semiProduct').markAsDirty();
    this.stockOrderForm.get('semiProduct').updateValueAndValidity();
  }

  setToBePaid() {

    if (this.stockOrderForm && this.stockOrderForm.get('totalQuantity').value &&
      this.stockOrderForm.get('pricePerUnit').value) {

      this.stockOrderForm.get('cost').setValue(this.stockOrderForm.get('totalQuantity').value * this.stockOrderForm.get('pricePerUnit').value);
    } else {

      this.stockOrderForm.get('cost').setValue(null);
    }
  }

  setBalance() {

    if (this.stockOrderForm && this.stockOrderForm.get('cost').value) {
      if (!this.update) {
        this.stockOrderForm.get('balance').setValue(this.stockOrderForm.get('cost').value);
      }
    } else {

      this.stockOrderForm.get('balance').setValue(null);
    }
  }

  dismiss() {
    this.location.back();
  }

  private setQuantities() {

    if (this.stockOrderForm.get('totalQuantity').valid) {

      const quantity = parseFloat(this.stockOrderForm.get('totalQuantity').value);

      let form = this.stockOrderForm.get('fulfilledQuantity');
      form.setValue(quantity);
      form.updateValueAndValidity();

      form = this.stockOrderForm.get('availableQuantity');
      form.setValue(quantity);
      form.updateValueAndValidity();
    }
  }

  private setDate() {
    const today = dateAtMidnightISOString(new Date().toDateString());
    this.stockOrderForm.get('productionDate').setValue(today);
  }

  private prepareData() {
    this.setQuantities();
    const pd = this.stockOrderForm.get('productionDate').value;
    if (pd != null) {
      this.stockOrderForm.get('productionDate').setValue(dateAtNoonISOString(pd));
    }
  }

  private async setIdentifier() {

    const farmerResponse = await this.companyControllerService
      .getUserCustomerUsingGET(this.stockOrderForm.get('producerUserCustomer').value?.id).pipe(take(1)).toPromise();

    if (farmerResponse && farmerResponse.status === StatusEnum.OK && farmerResponse.data) {
      const identifier = 'PT-' + farmerResponse.data.surname + '-' + this.stockOrderForm.get('productionDate').value;
      this.stockOrderForm.get('identifier').setValue(identifier);
    }
  }

  private translateName(obj) {
    return this.codebookTranslations.translate(obj, 'name');
  }

}
