import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StockOrderType } from '../../../../../shared/types';
import { ActivatedRoute } from '@angular/router';
import { EnumSifrant } from '../../../../shared-services/enum-sifrant';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { CompanyUserCustomersByRoleService } from '../../../../shared-services/company-user-customers-by-role.service';
import { ProductControllerService } from '../../../../../api/api/productController.service';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { take } from 'rxjs/operators';
import { ApiFacility } from '../../../../../api/model/apiFacility';
import { ApiSemiProduct } from '../../../../../api/model/apiSemiProduct';
import { CodebookTranslations } from '../../../../shared-services/codebook-translations';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';
import { ApiResponseApiCompanyGet } from '../../../../../api/model/apiResponseApiCompanyGet';
import StatusEnum = ApiResponseApiCompanyGet.StatusEnum;
import { ApiUserCustomer } from '../../../../../api/model/apiUserCustomer';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { dateAtMidnightISOString, dateAtNoonISOString, generateFormFromMetadata } from '../../../../../shared/utils';
import { ApiStockOrderValidationScheme } from './validation';
import { Location } from '@angular/common';
import { AuthService } from '../../../../core/auth.service';
import _ from 'lodash-es';
import { StockOrderControllerService } from '../../../../../api/api/stockOrderController.service';

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

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private globalEventsManager: GlobalEventManagerService,
    private productControllerService: ProductControllerService,
    private facilityControllerService: FacilityControllerService,
    private companyControllerService: CompanyControllerService,
    private stockOrderControllerService: StockOrderControllerService,
    private codebookTranslations: CodebookTranslations,
    private authService: AuthService,
  ) { }

  get orderType(): StockOrderType {

    const realType = this.stockOrderForm && this.stockOrderForm.get('orderType').value;

    if (realType) {
      return realType;
    }

    if (this.route.snapshot.data.action === 'update') {
      if (this.order) {
        if (this.order.orderType) { return this.order.orderType; }
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

  private reloadOrder() {

    this.globalEventsManager.showLoading(true);
    this.submitted = false;

    this.initializeData().then(() => {
      this.farmersCodebook = new CompanyUserCustomersByRoleService(this.productControllerService, this.companyId, 'FARMER');
      this.collectorsCodebook = new CompanyUserCustomersByRoleService(this.productControllerService, this.companyId, 'COLLECTOR');

      if (this.update) {
        this.editStockOrder().then();
      } else {
        this.newStockOrder();
      }
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
      // TODO
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

    this.initializeListManager();
  }

  private initializeListManager() {
    // TODO
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
    // TODO
  }

  async updatePurchaseOrder(close: boolean = true) {

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

    let data = _.cloneDeep(this.stockOrderForm.value);
    data = {
      ...data,
      womenShare: this.searchWomenCoffeeForm.value === 'YES' ? 1 : 0
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
    // TODO: get farmer from API
    // let farmer = await this.chainUserCustomerService.getUserCustomer(this.stockOrderForm.get("producerUserCustomerId").value).pipe(take(1)).toPromise();
    // if (farmer && farmer.status === "OK" && farmer.data) {
    //   let identifier = "PT-" + farmer.data.surname + "-" + this.stockOrderForm.get("productionDate").value;
    //   this.stockOrderForm.get('identifier').setValue(identifier);
    // }
  }

  private translateName(obj) {
    return this.codebookTranslations.translate(obj, 'name');
  }

}
