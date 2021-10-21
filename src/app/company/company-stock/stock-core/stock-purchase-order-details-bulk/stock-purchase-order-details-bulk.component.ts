import {Component, OnInit} from '@angular/core';
import {ListEditorManager} from '../../../../shared/list-editor/list-editor-manager';
import {ApiActivityProof} from '../../../../../api/model/apiActivityProof';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiActivityProofValidationScheme} from '../additional-proof-item/validation';
import {
  dateAtMidnightISOString,
  dateAtNoonISOString,
  defaultEmptyObject,
  generateFormFromMetadata
} from '../../../../../shared/utils';
import {Location} from '@angular/common';
import {GlobalEventManagerService} from '../../../../core/global-event-manager.service';
import {StockOrderType} from '../../../../../shared/types';
import {ApiFacility} from '../../../../../api/model/apiFacility';
import {take} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ApiResponseApiCompanyGet} from '../../../../../api/model/apiResponseApiCompanyGet';
import StatusEnum = ApiResponseApiCompanyGet.StatusEnum;
import {FacilityControllerService} from '../../../../../api/api/facilityController.service';
import {CodebookTranslations} from '../../../../shared-services/codebook-translations';
import {ApiSemiProduct} from '../../../../../api/model/apiSemiProduct';
import {ApiCompany} from '../../../../../api/model/apiCompany';
import {CompanyControllerService} from '../../../../../api/api/companyController.service';
import {CompanyUserCustomersByRoleService} from '../../../../shared-services/company-user-customers-by-role.service';
import {ApiUserCustomer} from '../../../../../api/model/apiUserCustomer';
import {EnumSifrant} from '../../../../shared-services/enum-sifrant';
import {SemiProductControllerService} from '../../../../../api/api/semiProductController.service';
import {AuthService} from '../../../../core/auth.service';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {ApiPurchaseOrder} from '../../../../../api/model/apiPurchaseOrder';
import _ from 'lodash-es';
import {StockOrderControllerService} from '../../../../../api/api/stockOrderController.service';
import {ApiPurchaseOrderFarmer} from '../../../../../api/model/apiPurchaseOrderFarmer';
import {ApiPurchaseOrderFarmerValidationScheme, ApiPurchaseOrderValidationScheme} from './validation';

@Component({
  selector: 'app-stock-purchase-order-details-bulk',
  templateUrl: './stock-purchase-order-details-bulk.component.html',
  styleUrls: ['./stock-purchase-order-details-bulk.component.scss']
})
export class StockPurchaseOrderDetailsBulkComponent implements OnInit {

  // FontAwesome icons
  faTrashAlt = faTrashAlt;

  title: string = null;

  purchaseOrderBulkForm: FormGroup;

  codebookPreferredWayOfPayment: EnumSifrant;

  searchCollectors = new FormControl(null);
  farmersCodebook: CompanyUserCustomersByRoleService;
  collectorsCodebook: CompanyUserCustomersByRoleService;

  employeeForm = new FormControl(null, Validators.required);
  codebookUsers: EnumSifrant;

  facilityNameForm = new FormControl(null);

  options: ApiSemiProduct[] = [];

  additionalProofsListManager = null;

  company: ApiCompany;
  private companyId: number = null;

  private facility: ApiFacility;

  updatePOInProgress = false;

  selectedCurrency = '-';

  // temp objects for storing measureUnit for differentFarmers
  measureUnitArray: string[] = ['-'];

 // searchWomenCoffeeForm = new FormControl(null, Validators.required);
  codebookWomenCoffee = EnumSifrant.fromObject(this.womenCoffeeList);
  codebookOrganic = EnumSifrant.fromObject(this.yesNo);

  submitted = false;

  emptyFarmersFormArray = null;

  netWeightFormArray: FormControl[] = [new FormControl(null)];
  finalPriceFormArray: FormControl[] = [new FormControl(null)];

  constructor(
      private route: ActivatedRoute,
      private location: Location,
      private fb: FormBuilder,
      private globalEventsManager: GlobalEventManagerService,
      private facilityControllerService: FacilityControllerService,
      private companyControllerService: CompanyControllerService,
      private semiProductControllerService: SemiProductControllerService,
      private stockOrderControllerService: StockOrderControllerService,
      private codebookTranslations: CodebookTranslations,
      private authService: AuthService
  ) {
  }

  // Additional proof item factory methods (used when creating ListEditorManger)
  static AdditionalProofItemCreateEmptyObject(): ApiActivityProof {
    const object = ApiActivityProof.formMetadata();
    return defaultEmptyObject(object) as ApiActivityProof;
  }

  static AdditionalProofItemEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(StockPurchaseOrderDetailsBulkComponent.AdditionalProofItemCreateEmptyObject(),
          ApiActivityProofValidationScheme.validators);
    };
  }

  get orderType(): StockOrderType {
    // order type is fixed to PURCHASE_ORDER
    return 'PURCHASE_ORDER' as StockOrderType;
  }

  get preferredWayOfPaymentList() {

    const obj = {};
    obj['CASH'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cash:Cash`;

    if (this.purchaseOrderBulkForm &&
        this.purchaseOrderBulkForm.get('representativeOfProducerUserCustomer') &&
        this.purchaseOrderBulkForm.get('representativeOfProducerUserCustomer').value) {

      obj['CASH_VIA_COLLECTOR'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cashViaCollector:Cash via collector`;
    }

    if (this.purchaseOrderBulkForm &&
        this.purchaseOrderBulkForm.get('representativeOfProducerUserCustomer') &&
        !this.purchaseOrderBulkForm.get('representativeOfProducerUserCustomer').value) {

      obj['UNKNOWN'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.unknown:Unknown`;
    }

    obj['BANK_TRANSFER'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.bankTransfer:Bank transfer`;
    obj['CHEQUE'] = $localize`:@@preferredWayOfPayment.cheque:Cheque`;
    obj['OFFSETTING'] = $localize`:@@preferredWayOfPayment.offsetting:Cheque`;

    return obj;
  }

  quantityLabel(idx: number) {
    return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.quantityDelievered.label:Quantity` + ` (${this.measureUnitArray[idx]})`;
  }

  tareLabel(idx: number) {
    return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.tare.label:Tare` + ` (${this.measureUnitArray[idx]})`;
  }

  netLabel(idx: number) {
    return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.netWeight.label:Net weight` + ` (${this.measureUnitArray[idx]})`;
  }

  finalPriceLabel(idx: number) {
    return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.finalPrice.label:Final price` + ` (${this.selectedCurrency}/${this.measureUnitArray[idx]})`;
  }

  pricePerUnitLabel(idx: number) {
    return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.pricePerUnit.label:Price per unit` + ` (${this.selectedCurrency}/${this.measureUnitArray[idx]})`;
  }

  get costLabel() {
    return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.cost.label:Payable 1st installment` + ` (${this.selectedCurrency})`;
  }

  get balanceLabel() {
    return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.balance.label:Open balance` + ` (${this.selectedCurrency})`;
  }

  damagedPriceDeductionLabel(idx: number) {
    return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.damagedPriceDeduction.label: Deduction` + ` (${this.selectedCurrency}/${this.measureUnitArray[idx]})`;
  }

  get additionalProofsForm(): FormArray {
    return this.purchaseOrderBulkForm.get('activityProofs') as FormArray;
  }

  private get womenCoffeeList() {
    const obj = {};
    obj['YES'] = $localize`:@@productLabelStockPurchaseOrdersModal.womensCoffeeList.yes:Yes`;
    obj['NO'] = $localize`:@@productLabelStockPurchaseOrdersModal.womensCoffeeList.no:No`;
    return obj;
  }

  get yesNo() {
    const obj = {};
    obj['true'] = $localize`:@@productLabelStockPurchaseOrdersModal.organic.yes:Yes`;
    obj['false'] = $localize`:@@productLabelStockPurchaseOrdersModal.organic.no:No`;
    return obj;
  }

  async ngOnInit() {

    this.companyId = Number(localStorage.getItem('selectedUserCompany'));

    // Get the company base currency
    if (this.companyId && this.route.snapshot.data.action === 'new') {
      const res = await this.companyControllerService.getCompanyUsingGET(this.companyId).pipe(take(1)).toPromise();
      if (res && res.status === StatusEnum.OK && res.data) {
        this.company = res.data;
        // push the first currency into list
        this.selectedCurrency = res.data.currency?.code ? res.data.currency.code : '-';
      }
    }

    this.reloadOrder();
  }

  private newTitle() {
    // only purchase_order supported
    return $localize`:@@productLabelStockPurchaseOrdersModal.newPurchaseOrderTitle:New purchase order`;
  }

  private reloadOrder() {

    this.globalEventsManager.showLoading(true);
    this.submitted = false;

    this.initializeData().then(() => {
      this.farmersCodebook = new CompanyUserCustomersByRoleService(this.companyControllerService, this.companyId, 'FARMER');
      this.collectorsCodebook = new CompanyUserCustomersByRoleService(this.companyControllerService, this.companyId, 'COLLECTOR');

      this.newPurchaseBulkOrder();

      this.updateValidators();
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

      this.title = this.newTitle();
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

    this.additionalProofsListManager = new ListEditorManager<ApiActivityProof>(
        this.additionalProofsForm as FormArray,
        StockPurchaseOrderDetailsBulkComponent.AdditionalProofItemEmptyObjectFormFactory(),
        ApiActivityProofValidationScheme
    );

  }

  private newPurchaseBulkOrder() {

    this.purchaseOrderBulkForm = generateFormFromMetadata(
        ApiPurchaseOrder.formMetadata(), {facility: {id: this.facility.id}}, ApiPurchaseOrderValidationScheme());

    this.emptyFarmersFormArray = generateFormFromMetadata(ApiPurchaseOrderFarmer.formMetadata(),
      defaultEmptyObject(ApiPurchaseOrderFarmer.formMetadata()) as ApiPurchaseOrderFarmer,  ApiPurchaseOrderFarmerValidationScheme());

    this.farmersFormArray.push(
      _.cloneDeep(this.emptyFarmersFormArray)
    );

    // Initialize preferred way of payments
    this.codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList);

    // Set initial data
    if (this.selectedCurrency !== '-') {
      this.purchaseOrderBulkForm.get('currency').setValue(this.selectedCurrency);
    }

    this.setDate();

    // Set current logged in user as employee
    this.employeeForm.setValue(this.authService.currentUserProfile.id.toString());

    // If only one semi-product select it as a default
    if (this.options && this.options.length === 1) {

      const index = 0;

      this.farmersFormArray.at(index).get('semiProduct').setValue(this.options[0]);
      this.setMeasureUnit(this.options[0].id, index).then();
    }

    this.prepareData();
  }


  async createBulkPurchaseOrder(close: boolean = true) {

    if (this.updatePOInProgress) {
      return;
    }
    this.updatePOInProgress = true;
    this.globalEventsManager.showLoading(true);
    this.submitted = true;

    // Set the user ID that creates the purchase order
    this.purchaseOrderBulkForm.get('creatorId').setValue(this.employeeForm.value);

    this.prepareData();

    // Validate forms
    if (this.cannotUpdatePO()) {
      this.updatePOInProgress = false;
      this.globalEventsManager.showLoading(false);
      return;
    }

    // call for adding new bulk purchase
    // Set the identifier if we are creating new purchase order
    this.farmersFormArray.controls.forEach((nextFormGroup, index) => {
      this.setIdentifier(index);

      this.setToBePaid(index);

      this.setBalance(index);

      // convert values for send
      if (this.showWomensOnly(index)) {
        this.farmersFormArray.at(index).get('womenShare').setValue(this.farmersFormArray.at(index).get('womenShare').value === 'YES');
      }
    });

    const data: ApiPurchaseOrder = _.cloneDeep(this.purchaseOrderBulkForm.value);

    // Remove keys that are not set
    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

    // Create the purchase order
    try {

      const res = await this.stockOrderControllerService.createPurchaseOrderBulkUsingPOST(data).pipe(take(1)).toPromise();

      if (res && res.status === 'OK') {
        if (close) {
          this.dismiss();
        }
        else {
          this.purchaseOrderBulkForm.markAsPristine();

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
    return (this.purchaseOrderBulkForm.invalid || this.employeeForm.invalid);
  }

  setFarmer(event: ApiUserCustomer, idx: number) {

    this.farmersFormArray.at(idx).get('producerUserCustomer').markAsDirty();
    this.farmersFormArray.at(idx).get('producerUserCustomer').updateValueAndValidity();
    this.codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList);
  }

  setCollector(event: ApiUserCustomer) {

    if (event) {
      this.purchaseOrderBulkForm.get('representativeOfProducerUserCustomer').setValue({ id: event.id });
      if (this.purchaseOrderBulkForm.get('preferredWayOfPayment') && this.purchaseOrderBulkForm.get('preferredWayOfPayment').value === 'UNKNOWN') {
        this.purchaseOrderBulkForm.get('preferredWayOfPayment').setValue(null);
      }
    } else {
      this.purchaseOrderBulkForm.get('representativeOfProducerUserCustomer').setValue(null);
      if (this.purchaseOrderBulkForm.get('preferredWayOfPayment') && this.purchaseOrderBulkForm.get('preferredWayOfPayment').value === 'CASH_VIA_COLLECTOR') {
        this.purchaseOrderBulkForm.get('preferredWayOfPayment').setValue(null);
      }
    }

    this.purchaseOrderBulkForm.get('representativeOfProducerUserCustomer').markAsDirty();
    this.purchaseOrderBulkForm.get('representativeOfProducerUserCustomer').updateValueAndValidity();
    this.codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList);
  }

  semiProductSelected(semiProduct , idx: number) {

    if (semiProduct) {
      this.setMeasureUnit(Number(semiProduct.id), idx).then();
    }

  }

  async setMeasureUnit(semiProdId: number, idx: number) {

    if (this.measureUnitArray[idx] === null || this.measureUnitArray[idx] === undefined) {
      // init value
      this.measureUnitArray.push('-');
    }

    const res = await this.semiProductControllerService.getSemiProductUsingGET(semiProdId).pipe(take(1)).toPromise();
    if (res && res.status === StatusEnum.OK && res.data) {
      this.measureUnitArray[idx] = res.data.apiMeasureUnitType.label;
    } else {
      this.measureUnitArray[idx] = '-';
    }
  }

  setToBePaid(idx: number) {

    if (this.farmersFormArray.at(idx) && this.farmersFormArray.at(idx).get('totalQuantity').value && this.farmersFormArray.at(idx).get('pricePerUnit').value) {
      let netWeight = this.farmersFormArray.at(idx).get('totalQuantity').value;
      let finalPrice = this.farmersFormArray.at(idx).get('pricePerUnit').value;

      if (this.farmersFormArray.at(idx).get('tare').value) {
        netWeight -= this.farmersFormArray.at(idx).get('tare').value;
      }

      if (this.farmersFormArray.at(idx).get('damagedPriceDeduction').value) {
        finalPrice -= this.farmersFormArray.at(idx).get('damagedPriceDeduction').value;
      }

      this.farmersFormArray.at(idx).get('cost').setValue(netWeight * finalPrice);
    } else {

      this.farmersFormArray.at(idx).get('cost').setValue(null);
    }
  }

  setBalance(idx: number) {

    if (this.farmersFormArray.at(idx) && this.farmersFormArray.at(idx).get('cost').value !== null && this.farmersFormArray.at(idx).get('cost').value !== undefined) {
      this.farmersFormArray.at(idx).get('balance').setValue(this.farmersFormArray.at(idx).get('cost').value);
    } else {
      this.farmersFormArray.at(idx).get('balance').setValue(null);
    }
  }

  dismiss() {
    this.location.back();
  }

  get showCollector() {
    return this.facility && this.facility.displayMayInvolveCollectors;
  }

  get readonlyCollector() {
    return this.facility && !this.facility.displayMayInvolveCollectors;
  }

  showOrganic(idx: number) {
    return this.facility && this.facility.displayOrganic || this.farmersFormArray.at(idx).get('organic').value;
  }

  get readonlyOrganic() {
    return this.facility && !this.facility.displayOrganic;
  }

  showWomensOnly(idx: number) {
    return this.facility && this.facility.displayWomenOnly || this.farmersFormArray.at(idx).get('womenShare').value;
  }

  get readonlyWomensOnly() {
    return this.facility && !this.facility.displayWomenOnly;
  }

  showTare(idx: number) {
    return this.facility && this.facility.displayTare || this.farmersFormArray.at(idx).get('tare').value;
  }

  get readonlyTare() {
    return this.facility && !this.facility.displayTare;
  }

  showDamagedPriceDeduction(idx: number) {
    return this.facility && this.facility.displayPriceDeductionDamage || this.farmersFormArray.at(idx).get('damagedPriceDeduction').value;
  }

  get readonlyDamagedPriceDeduction() {
    return this.facility && !this.facility.displayPriceDeductionDamage;
  }

  netWeight(idx: number) {
    if (this.farmersFormArray.at(idx) && this.farmersFormArray.at(idx).get('totalQuantity').value) {
      if (this.farmersFormArray.at(idx).get('tare').value) {
        this.netWeightFormArray[idx].setValue(this.farmersFormArray.at(idx).get('totalQuantity').value - this.farmersFormArray.at(idx).get('tare').value);
      } else {
        this.netWeightFormArray[idx].setValue(this.farmersFormArray.at(idx).get('totalQuantity').value);
      }
    } else {
      this.netWeightFormArray[idx].setValue(null);
    }
  }

  finalPrice(idx: number) {
    if (this.farmersFormArray.at(idx) && this.farmersFormArray.at(idx).get('pricePerUnit').value) {
      let finalPrice = this.farmersFormArray.at(idx).get('pricePerUnit').value;
      if (this.farmersFormArray.at(idx).get('damagedPriceDeduction').value) {
        finalPrice -= this.farmersFormArray.at(idx).get('damagedPriceDeduction').value;
      }
      this.finalPriceFormArray[idx].setValue(finalPrice);
    } else {
      this.finalPriceFormArray[idx].setValue(null);
    }
  }

  updateValidators() {

    this.farmersFormArray.controls.forEach((nextFormGroup) => {
          nextFormGroup.get('organic').setValidators(
              this.facility &&
              this.facility.displayOrganic ?
                  [Validators.required] : []
          );
          nextFormGroup.get('organic').updateValueAndValidity();
          nextFormGroup.get('tare').setValidators(
              this.facility &&
              this.facility.displayTare ?
                  [Validators.required] : []
          );
          nextFormGroup.get('tare').updateValueAndValidity();
          nextFormGroup.get('damagedPriceDeduction').setValidators(
              this.facility &&
              this.facility.displayPriceDeductionDamage ?
                  [Validators.required] : []
          );
          nextFormGroup.get('damagedPriceDeduction').updateValueAndValidity();
          nextFormGroup.get('womenShare').setValidators(
              this.facility &&
              this.facility.displayWomenOnly ?
                  [Validators.required] : []
          );
          nextFormGroup.get('womenShare').updateValueAndValidity();
        }
    );

  }

  private setQuantities() {

    this.farmersFormArray.controls.forEach((nextFormGroup) => {
      if (nextFormGroup.get('totalQuantity').valid) {

        const quantity = parseFloat(nextFormGroup.get('totalQuantity').value);

        let form = nextFormGroup.get('fulfilledQuantity');
        form.setValue(quantity);
        form.updateValueAndValidity();

        form = nextFormGroup.get('availableQuantity');
        form.setValue(quantity);
        form.updateValueAndValidity();
      }
    });
  }

  private setDate() {
    const today = dateAtMidnightISOString(new Date().toDateString());
    this.purchaseOrderBulkForm.get('productionDate').setValue(today);
  }

  private prepareData() {
    this.setQuantities();
    const pd = this.purchaseOrderBulkForm.get('productionDate').value;
    if (pd != null) {
      this.purchaseOrderBulkForm.get('productionDate').setValue(dateAtNoonISOString(pd));
    }
  }

  addFarmerInfo() {

    let semiProductControlValue = null;

    // use size as new index
    const farmerListSize = this.farmersFormArray.length;

    // If only one semi-product, select it as a default
    if (this.options && this.options.length === 1) {
      semiProductControlValue =  this.options[0];
      this.setMeasureUnit(this.options[0].id, farmerListSize).then();
    }

    if (this.measureUnitArray[farmerListSize] === null || this.measureUnitArray[farmerListSize] === undefined) {
      // init value
      this.measureUnitArray.push('-');
    }

    this.netWeightFormArray.push(new FormControl(null));
    this.finalPriceFormArray.push(new FormControl(null));

    // add new fields to form, and init semiProduct if only one available
    const emptyFarmersFormArrayNewItem = _.cloneDeep(this.emptyFarmersFormArray);
    (emptyFarmersFormArrayNewItem as FormGroup).get('semiProduct').setValue(semiProductControlValue);
    this.farmersFormArray.push(
      emptyFarmersFormArrayNewItem
    );

    this.updateValidators();

  }

  removeFarmer(idx) {
    this.farmersFormArray.removeAt(idx);
  }

  // get farmers form array
  get farmersFormArray() {
    return (this.purchaseOrderBulkForm.get('farmers') as FormArray);
  }

  checkRemoveFarmerIconShow(idx: number) {
    return (idx > 0) || (idx === 0 && this.farmersFormArray.length > 1);
  }

  private async setIdentifier(idx: number) {

    const farmerResponse = await this.companyControllerService
        .getUserCustomerUsingGET(this.farmersFormArray.at(idx).get('producerUserCustomer').value?.id).pipe(take(1)).toPromise();

    if (farmerResponse && farmerResponse.status === StatusEnum.OK && farmerResponse.data) {
      const identifier = 'PT-' + farmerResponse.data.surname + '-' + this.purchaseOrderBulkForm.get('productionDate').value;
      this.farmersFormArray.at(idx).get('identifier').setValue(identifier);
    }
  }

  private translateName(obj) {
    return this.codebookTranslations.translate(obj, 'name');
  }

}
