import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyProcessingActionsService } from '../../../../shared-services/company-processing-actions.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, take } from 'rxjs/operators';
import { ApiProcessingAction } from '../../../../../api/model/apiProcessingAction';
import { ProcessingActionControllerService } from '../../../../../api/api/processingActionController.service';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { ApiFacility } from '../../../../../api/model/apiFacility';
import { dateAtMidnightISOString, defaultEmptyObject, deleteNullFields, generateFormFromMetadata } from '../../../../../shared/utils';
import { AuthService } from '../../../../core/auth.service';
import { ActionTypesService } from '../../../../shared-services/action-types.service';
import { ApiCompanyGet } from '../../../../../api/model/apiCompanyGet';
import { ApiCompanyGetValidationScheme } from '../../../company-detail/validation';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';
import { CodebookTranslations } from '../../../../shared-services/codebook-translations';
import { ProcessingActionType } from '../../../../../shared/types';
import { AvailableSellingFacilitiesForCompany } from '../../../../shared-services/available-selling-facilities-for.company';
import { FacilitiesCodebookService } from '../../../../shared-services/facilities-codebook.service';
import {
  GetAvailableStockForSemiProductInFacilityUsingGET,
  StockOrderControllerService
} from '../../../../../api/api/stockOrderController.service';
import { SemiProductControllerService } from '../../../../../api/api/semiProductController.service';
import { ApiSemiProduct } from '../../../../../api/model/apiSemiProduct';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { CompanyFacilitiesForSemiProductService } from '../../../../shared-services/company-facilities-for-semi-product.service';
import { Subscription } from 'rxjs';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ApiProcessingOrder } from '../../../../../api/model/apiProcessingOrder';
import { FacilitySemiProductsCodebookService } from '../../../../shared-services/facility-semi-products-codebook.service';
import { ApiTransaction } from '../../../../../api/model/apiTransaction';
import { ApiStockOrderValidationScheme, ApiTransactionValidationScheme, customValidateArrayGroup } from './validation';
import { Location } from '@angular/common';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import _ from 'lodash-es';
import { ProcessingOrderControllerService } from '../../../../../api/api/processingOrderController.service';
import { ApiStockOrderEvidenceFieldValue } from '../../../../../api/model/apiStockOrderEvidenceFieldValue';
import { ApiProcessingEvidenceField } from '../../../../../api/model/apiProcessingEvidenceField';
import { ApiStockOrderEvidenceTypeValue } from '../../../../../api/model/apiStockOrderEvidenceTypeValue';
import { ApiActivityProof } from '../../../../../api/model/apiActivityProof';
import { ListEditorManager } from '../../../../shared/list-editor/list-editor-manager';
import { ApiActivityProofValidationScheme } from '../../stock-core/additional-proof-item/validation';
import { ApiProcessingEvidenceType } from '../../../../../api/model/apiProcessingEvidenceType';
import { ApiProductOrder } from '../../../../../api/model/apiProductOrder';
import { ApiResponseApiStockOrder } from '../../../../../api/model/apiResponseApiStockOrder';
import { ApiResponseApiProcessingOrder } from '../../../../../api/model/apiResponseApiProcessingOrder';
import ApiTransactionStatus = ApiTransaction.StatusEnum;
import OrderTypeEnum = ApiStockOrder.OrderTypeEnum;
import TypeEnum = ApiProcessingEvidenceField.TypeEnum;

export interface ApiStockOrderSelectable extends ApiStockOrder {
  selected?: boolean;
  selectedQuantity?: number;
}

@Component({
  selector: 'app-stock-processing-order-details',
  templateUrl: './stock-processing-order-details.component.html',
  styleUrls: ['./stock-processing-order-details.component.scss']
})
export class StockProcessingOrderDetailsComponent implements OnInit, OnDestroy {

  // FontAwesome icons
  faTimes = faTimes;
  faTrashAlt = faTrashAlt;

  title: string;

  companyId: number;
  creatorId: number;

  // List for holding references to observable subscriptions
  subscriptions: Subscription[] = [];

  form: FormGroup;

  submitted = false;
  update = false;

  // Holds the current company profile which executes the processing action
  companyProfile: ApiCompanyGet;

  prAction: ApiProcessingAction;
  processingActionForm = new FormControl(null, Validators.required);

  // Checkboxes form controls
  checkboxClipOrderFrom = new FormControl(false);
  checkboxUseInputFrom = new FormControl();

  // Input facility
  inputFacilityFromUrl: ApiFacility = null;
  currentInputFacility: ApiFacility = null;
  inputFacilityForm = new FormControl(null, Validators.required);
  inputFacilitiesCodebook: FacilitiesCodebookService | CompanyFacilitiesForSemiProductService | AvailableSellingFacilitiesForCompany;

  // Output facility
  outputFacilityForm = new FormControl(null, Validators.required);
  outputFacilitiesCodebook: FacilitiesCodebookService | CompanyFacilitiesForSemiProductService;

  // Semi-products
  filterSemiProduct = new FormControl(null);
  semiProductsInFacility: FacilitySemiProductsCodebookService = null;
  currentInputSemiProduct: ApiSemiProduct;
  currentOutputSemiProduct: ApiSemiProduct;
  currentOutputSemiProductNameForm = new FormControl(null);

  // Stock orders
  availableStockOrders: ApiStockOrderSelectable[] = [];
  selectedInputStockOrders: ApiStockOrderSelectable[] = [];
  cbSelectAllForm = new FormControl(false);
  outputStockOrderForm: FormGroup;
  outputStockOrders = new FormArray([], customValidateArrayGroup());
  outputStockOrder: ApiStockOrder;

  // Processing orders
  editableProcessingOrder: ApiProcessingOrder;
  processingOrderInputTransactions: ApiTransaction[];
  processingOrderInputOrders: ApiStockOrder[];

  // Input stock orders filters
  showWomensFilter = false;
  womensOnlyForm = new FormControl(null);
  fromFilterDate = new FormControl(null);
  toFilterDate = new FormControl(null);
  womensOnlyStatus = new FormControl(null);

  activeProcessingCodebook: CompanyProcessingActionsService;

  processingDateForm = new FormControl(null);

  companyDetailForm: FormGroup;

  // Processing evidence controls
  requiredProcessingEvidenceArray = new FormArray([]);
  otherProcessingEvidenceArray = new FormArray([]);
  processingEvidenceListManager = null;

  // Processing evidence fields controls
  requiredProcEvidenceFieldsForm: FormGroup;

  // Certificated and standards controls
  showCertificatesIds = false;
  certificationListManager = null;

  remainingForm = new FormControl(null);

  saveProcessingOrderInProgress = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private globalEventsManager: GlobalEventManagerService,
    private stockOrderController: StockOrderControllerService,
    private processingOrderController: ProcessingOrderControllerService,
    private procActionController: ProcessingActionControllerService,
    private facilityController: FacilityControllerService,
    private semiProductsController: SemiProductControllerService,
    private companyController: CompanyControllerService,
    private authService: AuthService,
    private codebookTranslations: CodebookTranslations,
    public actionTypesCodebook: ActionTypesService
  ) { }

  // Create form control for use in activity proofs list manager
  static ApiActivityProofCreateEmptyObject(): ApiActivityProof {
    const obj = ApiActivityProof.formMetadata();
    return defaultEmptyObject(obj) as ApiActivityProof;
  }

  static ApiActivityProofEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(StockProcessingOrderDetailsComponent.ApiActivityProofCreateEmptyObject(),
        ApiActivityProofValidationScheme.validators);
    };
  }

  get actionType(): ProcessingActionType {
    if (!this.prAction) { return null; }
    return this.prAction.type;
  }

  get showFilterSemiProduct() {
    return this.actionType === 'TRANSFER' &&
      !(this.prAction && this.prAction.inputSemiProduct && this.prAction.inputSemiProduct.id) &&
      this.semiProductsInFacility;
  }

  get showInputTransactions() {
    return this.inputFacilityForm.value;
  }

  get womensOnlyStatusValue() {
    if (this.womensOnlyStatus.value != null) {
      if (this.womensOnlyStatus.value) { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.womenCoffee:Women coffee`; }
      else { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.nonWomenCoffee:Non-women coffee`; }
    }
    return null;
  }

  get inputFacility(): ApiFacility {
    return this.inputFacilityForm.value as ApiFacility;
  }

  get showLeftSide() {
    const facility = this.inputFacility;
    if (!facility) { return true; }
    if (!this.update) { return true; }
    return this.companyId === facility.company?.id;
  }

  get showRightSide() {
    const facility = this.outputFacilityForm.value as ApiFacility;
    if (!facility) { return true; }
    return this.companyId === facility.company?.id;
  }

  get disabledLeftFields() {
    return !this.inputFacility || this.inputFacility.company?.id !== this.companyId;
  }

  get nonOutputSemiProductsInputSemiProductsLength() {

    if (!this.outputStockOrderForm) { return 0; }
    if (!this.update) { return this.availableStockOrders.length; }

    const allSet = new Set(this.availableStockOrders.map(x => x.id));

    if (this.actionType === 'PROCESSING' || this.actionType === 'TRANSFER') {
      this.editableProcessingOrder.targetStockOrders.forEach(x => {
        allSet.delete(x.id);
      });
    }

    if (this.actionType === 'SHIPMENT') {
      const id = this.outputStockOrderForm.value.id;
      allSet.delete(id);
    }
    return allSet.size;
  }

  get isClipOrder(): boolean {
    return !!this.checkboxClipOrderFrom.value;
  }

  get isSemiProductDefined() {
    return !(this.actionType === 'TRANSFER' && !(this.prAction && this.prAction.inputSemiProduct && this.prAction.inputSemiProduct.id));
  }

  get totalQuantity() {
    return this.outputStockOrderForm.getRawValue().totalQuantity;
  }

  get inputTransactions(): ApiTransaction[] {

    if (this.update) {
      return this.processingOrderInputTransactions ? this.processingOrderInputTransactions : [];
    }
    return [];
  }

  get inputStockOrders() {
    if (this.update) {
      return this.processingOrderInputOrders ? this.processingOrderInputOrders : [];
    }
    return [] as ApiStockOrder[];
  }

  get isUsingInput(): boolean {
    return !!this.checkboxUseInputFrom.value;
  }

  get inputQuantityOrOutputFacilityNotSet() {
    if (this.actionType === 'SHIPMENT') {
      return !this.inputFacilityForm.value || !this.outputStockOrderForm || !this.totalQuantity;
    }
  }

  get oneInputStockOrderRequired() {

    if (this.actionType === 'SHIPMENT') { return false; }

    const inTRCount = this.inputTransactions ? this.inputTransactions.length : 0;
    const selTRCount = this.selectedInputStockOrders ? this.selectedInputStockOrders.length : 0;
    return inTRCount + selTRCount === 0;
  }

  get productOrderId() {
    const form = this.outputStockOrderForm.get('productOrder');
    if (form && form.value) {
      const val = form.value as ApiProductOrder;
      return val.id;
    }
    return null;
  }

  get showInternalLotNumberField() {
    return this.actionType !== 'TRANSFER';
  }

  get inputQuantityLabel() {
    return $localize`:@@productLabelStockProcessingOrderDetail.textinput.inputQuantityLabelWithUnits.label: Input quantity in ${ 
      this.prAction ? this.codebookTranslations.translate(this.prAction.inputSemiProduct.apiMeasureUnitType, 'label') : '' 
    }`;
  }

  get outputQuantityLabel() {
    if (this.actionType === 'SHIPMENT') {
      return $localize`:@@productLabelStockProcessingOrderDetail.textinput.outputQuantityLabelWithUnits.label: Output quantity in ${
        this.prAction ? this.codebookTranslations.translate(this.prAction.inputSemiProduct.apiMeasureUnitType, 'label') : '' }`;
    } else {
      return $localize`:@@productLabelStockProcessingOrderDetail.textinput.outputQuantityLabelWithUnits.label: Output quantity in ${
        this.prAction ? this.codebookTranslations.translate(this.prAction.outputSemiProduct.apiMeasureUnitType, 'label') : '' }`;
    }
  }

  get showRemainingForm() {
    if (this.actionType === 'PROCESSING') {
      return !!this.underlyingMeasurementUnit;
    }
    return this.actionType === 'SHIPMENT';
  }

  get underlyingMeasurementUnit() {

    if (!this.prAction) { return null; }

    if (this.actionType === 'PROCESSING') {

      const inputMeasurementUnit = this.prAction.inputSemiProduct.apiMeasureUnitType;
      const outputMeasurementUnit = this.prAction.outputSemiProduct.apiMeasureUnitType;

      if (inputMeasurementUnit.id === outputMeasurementUnit.id) { return inputMeasurementUnit; }

      const underlyingOutputMesUnit = outputMeasurementUnit.underlyingMeasurementUnitType;
      if (underlyingOutputMesUnit && underlyingOutputMesUnit.id === inputMeasurementUnit.id) { return inputMeasurementUnit; }

      const underlyingInputMesUnit = inputMeasurementUnit.underlyingMeasurementUnitType;
      if (underlyingInputMesUnit && underlyingInputMesUnit.id === outputMeasurementUnit.id) { return outputMeasurementUnit; }
    }

    return null;
  }

  get calculateOutputQuantity() {

    if (this.outputStockOrders.length > 0) {
      let sum = 0;
      for (const item of (this.outputStockOrders as FormArray).value) {
        if (item.totalQuantity != null) { sum += parseFloat(item.totalQuantity); }
      }
      return sum;
    }

    return this.totalQuantity;
  }

  get showTotalQuantityForm() {

    if (this.actionType === 'SHIPMENT') { return true; }
    return this.actionType === 'PROCESSING';

  }

  get invalidOutputQuantity() {
    return this.showTotalQuantityForm && !this.totalQuantity;
  }

  get invalidFormat() {
   return Number.isNaN(Number(this.outputStockOrderForm.get('totalQuantity').value));
  }

  get invalidOutputQuantityTooLargeValue() {

    if (this.actionType === 'SHIPMENT') {
      return false;
    }

    const inputQuantityInKg: number = Number(this.form.get('outputQuantity').value).valueOf() / this.currentOutputSemiProduct.apiMeasureUnitType.weight;
    const outputQuantityInKg: number = Number(this.outputStockOrderForm.get('totalQuantity').value).valueOf() / this.currentInputSemiProduct.apiMeasureUnitType.weight;
    return inputQuantityInKg && outputQuantityInKg && (outputQuantityInKg > inputQuantityInKg);
  }

  get invalidOutputQuantityForShipment() {
    return this.actionType === 'SHIPMENT' && this.invalidOutputQuantity;
  }

  get showUseInput() {
    return this.actionType === 'PROCESSING' && this.underlyingMeasurementUnit;
  }

  get showClipOrder() {
    return this.actionType === 'SHIPMENT';
  }

  get showDeliveryData() {
    return this.actionType === 'SHIPMENT';
  }

  get sacNetWLabel() {
    if (this.prAction) {
      const unit = this.underlyingMeasurementUnit ?
        this.underlyingMeasurementUnit.label : this.prAction.outputSemiProduct.apiMeasureUnitType.label;

      return $localize`:@@productLabelStockProcessingOrderDetail.itemNetWeightLabel: Quantity (max. ${ this.prAction.maxOutputWeight } ${ unit })`;
    }
  }

  get stockOrderCertificatedForm(): FormArray {
    return this.outputStockOrderForm.get('certificates') as FormArray;
  }

  get noRepackaging() {
    if (this.prAction) {
      return this.prAction.repackedOutputs != null && !this.prAction.repackedOutputs;
    }
    return false;
  }

  get canSave() {

    if (this.processingDateForm.invalid) {
      return false;
    }

    if (this.outputStockOrderForm.invalid) {
      return false;
    }

    if (!this.noRepackaging) {
      if (this.form.invalid) {
        return false;
      }

      if (this.requiredProcessingEvidenceArray.invalid) {
        return false;
      }
    }

    if (this.invalidOutputQuantity || this.invalidOutputQuantityTooLargeValue || this.invalidFormat) {
      return false;
    }
    if (this.inputFacilityForm.invalid) {
      return false;
    }
    if (this.outputFacilityForm.invalid) {
      return false;
    }
    if (this.processingActionForm.invalid) {
      return false;
    }
    if (this.oneInputStockOrderRequired) {
      return false;
    }

    return !(this.outputStockOrders.value.length > 0 && this.outputStockOrders.invalid);
  }

  ngOnInit(): void {

    this.initInitialData().then(
      async (resp: any) => {

        await this.generateCompanyDetailForm();
        this.activeProcessingCodebook =
          new CompanyProcessingActionsService(this.procActionController, this.companyId, this.codebookTranslations);

        if (this.prAction) {

          this.setRequiredProcessingEvidence(this.prAction).then();

          // Set the input and output facilities codebook services
          this.initializeFacilitiesCodebooks();

          if (!this.update && this.actionType === 'SHIPMENT') {

            // Do not set input form for new shipments
            this.outputFacilityForm.setValue(this.inputFacilityFromUrl);
            this.setOutputFacility(this.inputFacilityFromUrl);

          } else {

            this.inputFacilityForm.setValue(this.inputFacilityFromUrl);

            // Clear output form on new
            this.setInputFacility(this.inputFacilityFromUrl, !this.update).then();
          }
        }

        if (this.update) {
          this.updateProcessingOrder();
        } else {
          this.newProcessingOrder();
        }

        this.registerOutputValueChangeListener();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private registerOutputValueChangeListener(){

    this.subscriptions.push(this.outputStockOrderForm.get('totalQuantity').valueChanges
      .pipe(debounceTime(300))
      .subscribe((val: number) => {
        if (!this.invalidOutputQuantityTooLargeValue) {
          this.setInputOutputFormAccordinglyToTransaction(val);
        }
      }));

  }


  private async initInitialData() {

    const action = this.route.snapshot.data.action;
    if (!action) { return; }

    if (action === 'new') {

      this.update = false;
      this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTitle:Add action`;

      const actionId = this.route.snapshot.params.actionId;
      const facilityIdFromLink = this.route.snapshot.params.inputFacilityId;

      if (actionId !== 'NEW') {
        const respProcAction = await this.procActionController
          .getProcessingActionUsingGET(actionId).pipe(take(1)).toPromise();
        if (respProcAction && respProcAction.status === 'OK' && respProcAction.data) {
          this.prAction = respProcAction.data;
          this.processingActionForm.setValue(this.prAction);
          this.defineInputAndOutputSemiProduct(this.prAction).then();
        }

        const respFacility = await this.facilityController.getFacilityUsingGET(facilityIdFromLink).pipe(take(1)).toPromise();
        if (respFacility && respFacility.status === 'OK' && respFacility.data) {
          this.inputFacilityFromUrl = respFacility.data;
        }
      }

      const today = dateAtMidnightISOString(new Date().toDateString());
      this.processingDateForm.setValue(today);

    } else if (action === 'update') {

      this.update = true;
      const actionType = this.route.snapshot.data.type;

      const orderId = this.route.snapshot.params.orderId as string;
      if (!orderId) { throw Error('No order id!'); }

      this.globalEventsManager.showLoading(true);

      // Get the stock order with the passed ID
      let respStockOrder: ApiResponseApiStockOrder;
      try {

        respStockOrder = await this.stockOrderController
          .getStockOrderUsingGET(Number(orderId), true).pipe(take(1)).toPromise();

      } catch (e) {
        this.globalEventsManager.showLoading(false);
        throw e;
      }

      // Validate returned status for the Stock order
      if (!respStockOrder || respStockOrder.status !== 'OK') {
        throw new Error('Cannot retrieve stock order with passed ID');
      }
      this.outputStockOrder = respStockOrder.data;

      // Validate that stock order has processing order
      if (!this.outputStockOrder.processingOrder || !this.outputStockOrder.processingOrder.id) {
        throw new Error('Stock order has no processing order set');
      }

      // Get the processing order
      let respProcessingOrder: ApiResponseApiProcessingOrder;
      try {

        respProcessingOrder = await this.processingOrderController
          .getProcessingOrder(this.outputStockOrder.processingOrder.id).pipe(take(1)).toPromise();

      } catch (e) {
        throw e;
      } finally {
        this.globalEventsManager.showLoading(false);
      }

      // Validate the returned status for the Processing order
      if (!respProcessingOrder || respProcessingOrder.status !== 'OK') {
        throw new Error('Cannot retrieve the processing order');
      }
      this.editableProcessingOrder = respProcessingOrder.data;

      // Set the processing action from the processing order and related data
      this.prAction = this.editableProcessingOrder.processingAction;
      this.processingActionForm.setValue(this.prAction);
      this.processingDateForm.setValue(this.editableProcessingOrder.processingDate);
      this.defineInputAndOutputSemiProduct(this.prAction).then();

      // Set the input transactions and stock orders
      this.processingOrderInputTransactions = this.editableProcessingOrder.inputTransactions;
      this.processingOrderInputOrders = this.editableProcessingOrder.inputTransactions.map(value => value.sourceStockOrder);

      // Handle the update initialization for Quote orders
      if (actionType === 'SHIPMENT') {

        this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateShipmentTitle:Update action`;

        const respFacility = await this.facilityController
          .getFacilityUsingGET(this.outputStockOrder.quoteFacility.id).pipe(take(1)).toPromise();
        if (respFacility && respFacility.status === 'OK' && respFacility.data) {
          this.inputFacilityFromUrl = respFacility.data;
        }
      }

      // Set title for Processing orders
      if (actionType === 'PROCESSING' || actionType === 'TRANSFER') {
        this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateProcessingTitle:Update processing action`;
      }

      // Set title for Transfer orders
      if (actionType === 'TRANSFER') {
        this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateShipmentTitle:Update shipment action`;
      }

      // Handle the update initialization (the common code) for order where processing action type is 'PROCESSING' or 'TRANSFER'
      if (actionType === 'PROCESSING' || actionType === 'TRANSFER') {

        this.initializeOutputStockOrdersForEdit();

        // Set the input facility from the input transactions
        if (this.processingOrderInputTransactions && this.processingOrderInputTransactions.length > 0) {
          const respFacility = await this.facilityController
            .getFacilityUsingGET(this.processingOrderInputTransactions[0].sourceFacility.id).pipe(take(1)).toPromise();
          if (respFacility && respFacility.status === 'OK' && respFacility.data) {
            this.inputFacilityFromUrl = respFacility.data;
          }
        }
      }

    } else {
      throw Error('Wrong action.');
    }

    this.companyId = Number(localStorage.getItem('selectedUserCompany'));
    this.creatorId = await this.getCreatorId();
  }

  private newProcessingOrder() {

    this.form = generateFormFromMetadata(ApiTransaction.formMetadata(), {}, ApiTransactionValidationScheme);
    this.outputStockOrderForm = generateFormFromMetadata(ApiStockOrder.formMetadata(), {}, ApiStockOrderValidationScheme);

    if (this.actionType === 'SHIPMENT') {
      this.checkboxClipOrderFrom.setValue(true);
    }

    // Inject transaction form for easier validation purposes
    this.outputStockOrderForm.setControl('form', this.form);
    this.outputStockOrderForm.setControl('remainingForm', this.remainingForm);
    this.outputStockOrderForm.setControl('processingActionForm', this.processingActionForm);
    this.outputStockOrderForm.setControl('requiredProcEvidenceFieldsForm', this.requiredProcEvidenceFieldsForm);

    this.initializeListManager();

    if (this.prAction) {
      this.setRequiredFields(this.prAction);
    }
  }

  private updateProcessingOrder() {

    this.form = generateFormFromMetadata(ApiTransaction.formMetadata(), {}, ApiTransactionValidationScheme);
    this.form.get('outputQuantity').disable();
    this.outputStockOrderForm = generateFormFromMetadata(ApiStockOrder.formMetadata(), this.outputStockOrder, ApiStockOrderValidationScheme);

    // Inject transaction form for easier validation purposes
    this.outputStockOrderForm.setControl('form', this.form);
    this.outputStockOrderForm.setControl('remainingForm', this.remainingForm);
    this.outputStockOrderForm.setControl('processingActionForm', this.processingActionForm);
    this.outputStockOrderForm.setControl('requiredProcEvidenceFieldsForm', this.requiredProcEvidenceFieldsForm);

    this.prepareDocumentsForEdit().then();
    this.initializeListManager();

    const inQuantity = this.calcInputQuantity(true);

    if (this.actionType === 'SHIPMENT') {
      const outQuantity = this.totalQuantity;
      if (outQuantity >= inQuantity) {
        this.checkboxClipOrderFrom.setValue(true);
      }
    }

    if (this.prAction) {
      this.setRequiredFields(this.prAction);
    }

    this.outputFacilityForm.setValue(this.outputStockOrder.facility);
    this.disableFormsOnUpdate();
    this.setInputOutputFormSidesVisibility();
  }

  async saveProcessingOrder() {

    if (this.saveProcessingOrderInProgress) {
      return;
    }

    this.globalEventsManager.showLoading(true);
    this.saveProcessingOrderInProgress = true;
    this.submitted = true;

    if (!this.canSave) {
      this.saveProcessingOrderInProgress = false;
      this.globalEventsManager.showLoading(false);
      return;
    }

    const outputStockOrderList = await this.prepareDataAndStoreStockOrder();

    if (outputStockOrderList) {

      const processingOrder: ApiProcessingOrder = {
        id: this.editableProcessingOrder ? this.editableProcessingOrder.id : undefined,
        initiatorUserId: this.creatorId,
        processingAction: this.prAction,
        targetStockOrders: outputStockOrderList,
        inputTransactions: this.inputTransactions,
        processingDate: this.processingDateForm.value ? new Date(this.processingDateForm.value) : null
      };

      for (const stockOrder of this.selectedInputStockOrders) {

        // If there is now selected quantity, proceed with the next
        if (stockOrder.selectedQuantity === 0) {
          continue;
        }

        // Create transaction for current stock order from the list of selected stock orders
        const transaction: ApiTransaction = {
          isProcessing: this.actionType === 'PROCESSING',
          company: { id: this.companyId },
          initiationUserId: this.creatorId,
          sourceStockOrder: stockOrder,
          status: (outputStockOrderList.length === 1 && this.prAction.type === 'SHIPMENT' && outputStockOrderList[0].orderType === 'GENERAL_ORDER') ?
            ApiTransactionStatus.PENDING : ApiTransactionStatus.EXECUTED,
          inputQuantity: stockOrder.selectedQuantity,
          outputQuantity: stockOrder.selectedQuantity
        };

        const cleanTransaction = _.cloneDeep(transaction);
        deleteNullFields(cleanTransaction);

        if (!processingOrder.inputTransactions) {
          processingOrder.inputTransactions = [cleanTransaction];
        } else {
          processingOrder.inputTransactions.push(cleanTransaction);
        }
      }

      try {

        const res = await this.processingOrderController
          .createOrUpdateProcessingOrderUsingPUT(processingOrder).pipe(take(1)).toPromise();

        if (!res || res.status !== 'OK') {
          throw Error('Error while creating processing order for order type: ' + this.actionType);
        }

      } finally {
        this.globalEventsManager.showLoading(false);
        this.saveProcessingOrderInProgress = false;
      }

      this.dismiss();
    }
  }

  private async prepareDataAndStoreStockOrder(): Promise<ApiStockOrder[]> {

    const stockOrderList: ApiStockOrder[] = [];

    const sharedFields: ApiStockOrder = {
      pricePerUnit: this.outputStockOrderForm.get('pricePerUnit').value ? this.outputStockOrderForm.get('pricePerUnit').value : null,
      comments: this.outputStockOrderForm.get('comments').value ? this.outputStockOrderForm.get('comments').value : null,
      womenShare: this.womensOnlyForm.value === 'YES',
      requiredEvidenceFieldValues: this.prepareRequiredEvidenceFieldValues(),
      requiredEvidenceTypeValues: this.prepareRequiredEvidenceTypeValues(),
      otherEvidenceDocuments: this.prepareOtherEvidenceDocuments()
    };

    // In this case we only copy the input stock orders to the destination stock orders
    if (this.actionType === 'TRANSFER') {

      if (this.editableProcessingOrder) {
        for (const targetStockOrder of this.editableProcessingOrder.targetStockOrders) {
          const newStockOrder: ApiStockOrder = {
            ...targetStockOrder,
            ...sharedFields
          };

          deleteNullFields(newStockOrder);
          stockOrderList.push(newStockOrder);
        }
      }

      for (const inputStockOrder of this.selectedInputStockOrders) {
        const newStockOrder: ApiStockOrder = {
          ...sharedFields,
          facility: this.outputFacilityForm.value,
          semiProduct: inputStockOrder.semiProduct,
          internalLotNumber: inputStockOrder.internalLotNumber,
          creatorId: this.creatorId,
          productionDate: inputStockOrder.productionDate ? inputStockOrder.productionDate : new Date(),
          orderType: OrderTypeEnum.TRANSFERORDER,
          totalQuantity: inputStockOrder.availableQuantity,
          fulfilledQuantity: 0,
          availableQuantity: 0
        };

        deleteNullFields(newStockOrder);
        stockOrderList.push(newStockOrder);
      }

      return stockOrderList;

    } else {

      // In this case we have multiple destination stock orders because we are repacking outputs
      if (this.actionType === 'PROCESSING' && this.outputStockOrders.value.length > 0) {

        for (const item of this.outputStockOrders.value) {
          const outputStockOrder = item as ApiStockOrder;
          if (outputStockOrder.totalQuantity) {
            const newStockOrder: ApiStockOrder = {
              ...sharedFields,
              id: outputStockOrder.id,
              internalLotNumber: this.outputStockOrderForm.get('internalLotNumber').value + `/${ outputStockOrder.sacNumber }`,
              creatorId: this.creatorId,
              semiProduct: this.currentOutputSemiProduct,
              facility: this.outputFacilityForm.value,
              totalQuantity: outputStockOrder.totalQuantity,
              fulfilledQuantity: outputStockOrder.totalQuantity,
              availableQuantity: outputStockOrder.totalQuantity,
              productionDate: new Date(),
              sacNumber: outputStockOrder.sacNumber,
              currency: this.outputStockOrderForm.get('pricePerUnit').value ? this.companyProfile.currency.code : null,
              orderType: OrderTypeEnum.PROCESSINGORDER
            };

            deleteNullFields(newStockOrder);
            stockOrderList.push(newStockOrder);
          }
        }

        return stockOrderList;

      } else {

        // In this case we are dealing with ordinary processing or shipmen (Quote) order
        const outputStockOrder: ApiStockOrder = this.outputStockOrderForm.getRawValue();

        // Delete injected sub-forms used for easier validation
        delete (outputStockOrder as any).form;
        delete (outputStockOrder as any).remainingForm;
        delete (outputStockOrder as any).processingActionForm;

        // Set the rest of the fields for the Stock order
        const newStockOrder: ApiStockOrder = {
          ...outputStockOrder,
          ...sharedFields,
          creatorId: outputStockOrder.creatorId ? outputStockOrder.creatorId : this.creatorId,
          semiProduct: this.currentOutputSemiProduct,
          facility: this.outputFacilityForm.value,
          totalQuantity: parseFloat(this.totalQuantity),
          fulfilledQuantity: this.actionType === 'PROCESSING' ? parseFloat(this.totalQuantity) : 0,
          availableQuantity: this.actionType === 'PROCESSING' ? parseFloat(this.totalQuantity) : 0,
          productionDate: outputStockOrder.productionDate ? outputStockOrder.productionDate : new Date(),
          orderType: this.prAction.type === 'SHIPMENT' ? OrderTypeEnum.GENERALORDER : OrderTypeEnum.PROCESSINGORDER,
          quoteFacility: this.prAction.type === 'SHIPMENT' ? this.inputFacilityForm.value : null,
          currency: outputStockOrder.currency ? outputStockOrder.currency : (outputStockOrder.pricePerUnit ? this.companyProfile.currency.code : null)
        };

        deleteNullFields(newStockOrder);
        stockOrderList.push(newStockOrder);

        return stockOrderList;
      }
    }
  }

  private prepareRequiredEvidenceFieldValues(): ApiStockOrderEvidenceFieldValue[] {

    const evidenceFieldsValues: ApiStockOrderEvidenceFieldValue[] = [];

    if (!this.prAction) {
      return evidenceFieldsValues;
    }

    // Create stock order evidence field instances (values) for every form control
    Object.keys(this.requiredProcEvidenceFieldsForm.controls).forEach(key => {

      const formControl = this.requiredProcEvidenceFieldsForm.get(key);
      const procEvidenceField = this.prAction.requiredEvidenceFields.find(pef => pef.fieldName === key);

      const evidenceFieldValue: ApiStockOrderEvidenceFieldValue = {
        evidenceFieldId: procEvidenceField.id,
        evidenceFieldName: procEvidenceField.fieldName
      };

      switch (procEvidenceField.type) {
        case TypeEnum.NUMBER:
        case TypeEnum.INTEGER:
        case TypeEnum.EXCHANGERATE:
        case TypeEnum.PRICE:
          evidenceFieldValue.numericValue = formControl.value;
          break;
        case TypeEnum.DATE:
        case TypeEnum.TIMESTAMP:
          evidenceFieldValue.dateValue = formControl.value;
          break;
        case TypeEnum.STRING:
        case TypeEnum.TEXT:
          evidenceFieldValue.stringValue = formControl.value;
          break;
        default:
          evidenceFieldValue.stringValue = formControl.value;
      }

      evidenceFieldsValues.push(evidenceFieldValue);
    });

    return evidenceFieldsValues;
  }

  private prepareRequiredEvidenceTypeValues(): ApiStockOrderEvidenceTypeValue[] {

    const evidenceTypesValues: ApiStockOrderEvidenceTypeValue[] = [];

    if (!this.prAction) {
      return evidenceTypesValues;
    }

    for (const control of this.requiredProcessingEvidenceArray.controls) {
      const controlValue: ApiStockOrderEvidenceTypeValue =  control.value;
      if (controlValue && controlValue.document && controlValue.document.id) {
        evidenceTypesValues.push(controlValue);
      }
    }

    return evidenceTypesValues;
  }

  private prepareOtherEvidenceDocuments(): ApiStockOrderEvidenceTypeValue[] {

    const otherEvidenceDocuments: ApiStockOrderEvidenceTypeValue[] = [];

    if (!this.prAction) {
      return otherEvidenceDocuments;
    }

    for (const control of this.otherProcessingEvidenceArray.controls) {

      const evidenceType: ApiProcessingEvidenceType = control.value.type;

      otherEvidenceDocuments.push({
        evidenceTypeId: evidenceType.id,
        evidenceTypeCode: evidenceType.code,
        date: control.value.formalCreationDate,
        document: control.value.document
      });
    }

    return otherEvidenceDocuments;
  }

  private async prepareDocumentsForEdit() {

    // TODO: implement
    // this.otherProcessingEvidenceArray.clear();
    // let types: ChainProcessingEvidenceType[] = [];
    // if (this.prAction && this.prAction.requiredDocTypeIds) {
    //   if (this.prAction.requiredDocTypes) { types = this.prAction.requiredDocTypes; }
    //   else {
    //     for (const id of this.prAction.requiredDocTypeIds) {
    //       const res = await this.actionTypeService.getActionTypeUsingGET(Number(id)).pipe(take(1)).toPromise();
    //       if (res && res.status === 'OK' && res.data) {
    //         types.push(res.data as any);
    //       }
    //     }
    //   }
    //
    //   const documentRequirements = this.outputStockOrderForm.get('documentRequirements').value as ChainDocumentRequirementList;
    //   const requirements = (documentRequirements && documentRequirements.requirements) || [];
    //   // console.log("Reqs:", requirements, this.requiredProcessingEvidenceArray.controls.map(x => x.value))
    //   for (const item of requirements) {
    //     const res = this.requiredProcessingEvidenceArray.controls.find(x => x.value.type && x.value.type.id === item.description);
    //     if (res) {
    //       const formOfReq = this.formOfRequirementItem(item);
    //       res.setValue(formOfReq.value);
    //     } else {
    //       this.otherProcessingEvidenceArray.push(this.formOfRequirementItem(item, true));
    //     }
    //   }
    // }
  }

  private disableFormsOnUpdate() {

    this.outputFacilityForm.disable();
    if (this.inputFacilityForm.value) {
      this.inputFacilityForm.disable();
    }
    this.processingActionForm.disable();
  }

  private setInputOutputFormSidesVisibility() {

    if (this.update && this.actionType === 'SHIPMENT') {
      if (this.showLeftSide) {
        this.setEnabledOnLeftSideForms(true);
      }
      else {
        this.setEnabledOnLeftSideForms(false);
      }

      if (this.showRightSide) {
        this.setEnabledOnRightSideForms(true);
      }
      else {
        this.setEnabledOnRightSideForms(false);
      }
    }
  }

  private setEnabledOnLeftSideForms(value: boolean) {

    const leftSideForms = [
      this.inputFacilityForm,
      this.filterSemiProduct,
      this.fromFilterDate,
      this.toFilterDate,
      this.cbSelectAllForm
    ];

    if (value) {
      leftSideForms.forEach(form => {
        if (form) { form.enable(); }
      });
    } else {
      leftSideForms.forEach(form => {
        if (form) { form.disable(); }
      });
    }

    if (this.update) {
      this.disableFormsOnUpdate();
    }
  }

  private setEnabledOnRightSideForms(value: boolean) {

    const rightSideForms = [
      this.outputFacilityForm,
      this.outputStockOrderForm,
      this.currentOutputSemiProductNameForm,
      this.form,
      this.outputStockOrders,
      this.requiredProcessingEvidenceArray,
      this.checkboxUseInputFrom,
      this.checkboxClipOrderFrom
    ];

    if (value) {
      rightSideForms.forEach(form => {
        if (form) { form.enable(); }
      });
    } else {
      rightSideForms.forEach(form => {
        if (form) { form.disable(); }
      });
    }

    if (this.update) {
      this.disableFormsOnUpdate();
    }
  }

  private async defineInputAndOutputSemiProduct(event: ApiProcessingAction) {

    // If we have defined input semi-product, get its definition
    if (event.inputSemiProduct && event.inputSemiProduct.id) {
      const resInSP = await this.semiProductsController.getSemiProductUsingGET(event.inputSemiProduct.id).pipe(take(1)).toPromise();
      if (resInSP && resInSP.status === 'OK') {
        this.currentInputSemiProduct = resInSP.data;
      }
    }

    if (event.outputSemiProduct && event.outputSemiProduct.id) {
      const resOutSP = await this.semiProductsController.getSemiProductUsingGET(event.outputSemiProduct.id).pipe(take(1)).toPromise();
      if (resOutSP && resOutSP.status === 'OK') {
        this.currentOutputSemiProduct = resOutSP.data;
        this.currentOutputSemiProductNameForm.setValue(this.currentOutputSemiProduct.name);
      }
    }
  }

  private async setRequiredProcessingEvidence(action: ApiProcessingAction) {

    (this.requiredProcessingEvidenceArray as FormArray).clear();

    if (action && action.requiredDocumentTypes && action.requiredDocumentTypes.length > 0) {

      for (const requiredDocumentType of action.requiredDocumentTypes) {
        this.requiredProcessingEvidenceArray.push(new FormGroup({
          evidenceTypeId: new FormControl(requiredDocumentType.id),
          evidenceTypeCode: new FormControl(requiredDocumentType.code),
          evidenceTypeLabel: new FormControl(requiredDocumentType.label),
          date: new FormControl(new Date(), requiredDocumentType.mandatory ? Validators.required : null),
          document: new FormControl(null, requiredDocumentType.mandatory ? Validators.required : null)
        }));
      }

    } else {
      (this.requiredProcessingEvidenceArray as FormArray).clear();
    }
  }

  async setProcessingAction(event) {

    this.prAction = event;
    this.setRequiredProcessingEvidence(this.prAction).then();

    if (event) {

      this.clearInput();
      this.clearOutput();

      this.initializeFacilitiesCodebooks();

      // If there is only one appropriate input facility selected it
      this.subscriptions.push(this.inputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
        if (val && val.length === 1) {
          this.inputFacilityForm.setValue(val[0]);
          this.setInputFacility(this.inputFacilityForm.value);
        }
      }));

      // If there is only one appropriate output facility select it
      this.subscriptions.push(this.outputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
        if (val && val.length === 1 && !this.update) { this.outputFacilityForm.setValue(val[0]); }
      }));

      this.defineInputAndOutputSemiProduct(event).then();
      this.setRequiredFields(event);

      if (!this.update) {
        this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTitle:Add action`;
        if (this.prAction.type === 'TRANSFER') { this.title = $localize`:@@productLabelStockProcessingOrderDetail.newShipmentTitle:Add shipment action`; }
        if (this.prAction.type === 'PROCESSING') { this.title = $localize`:@@productLabelStockProcessingOrderDetail.newProcessingTitle:Add processing action`; }
      }
    } else {
      this.clearInput();
      this.clearOutput();
      this.setRequiredFields(null);

      this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTitle:Add action`;
    }
  }

  async setInputFacility(event: ApiFacility, clearOutputForm = true) {

    this.clearCBAndValues();

    if (!event) {
      this.clearInputFacilityForm();
      if (clearOutputForm) { this.clearOutputForm(); }
      this.currentInputFacility = null;
      this.semiProductsInFacility = null;
      return;
    }

    if (event) {
      this.currentInputFacility = event;
      if (this.isSemiProductDefined) {

        const res = await this.stockOrderController
          .getAvailableStockForSemiProductInFacilityUsingGET(event.id, this.processingActionForm.value.inputSemiProduct.id)
          .pipe(take(1)).toPromise();

        if (res && res.status === 'OK' && res.data) {
          this.availableStockOrders = res.data.items;
          this.showWomensFilter = this.availableStockOrders.length > 0 && this.availableStockOrders[0].orderType === 'PURCHASE_ORDER';
        }
      } else {
        this.semiProductsInFacility = new FacilitySemiProductsCodebookService(this.facilityController, event.id, this.codebookTranslations);
      }
    }

    if (!this.update) {
      this.prefillOutputFacility();
    }

    if (this.disabledLeftFields) {
      this.cbSelectAllForm.disable();
    } else {
      this.cbSelectAllForm.enable();
    }
  }

  setOutputFacility(event: any, clearOutputForm = false) {

    if (!event) {
      if (clearOutputForm) { this.clearOutputForm(); }
      this.clearOutputFacilityForm();
      return;
    }

    if (event) {
      if (clearOutputForm) { this.clearOutputForm(); }
      this.calcInputQuantity(true);
      if (this.currentOutputSemiProduct) {
        this.currentOutputSemiProductNameForm.setValue(this.translateName(this.currentOutputSemiProduct));
      }
    }
  }

  async selectedSemiProductChange(event) {

    this.currentInputSemiProduct = event;
    const res = await this.stockOrderController
      .getAvailableStockForSemiProductInFacilityUsingGET(this.inputFacilityForm.value.id, event.id).pipe(take(1)).toPromise();

    if (res && res.status === 'OK' && res.data) {
      this.availableStockOrders = res.data.items;
      this.showWomensFilter = this.availableStockOrders.length > 0 && this.availableStockOrders[0].orderType === 'PURCHASE_ORDER';
    }
  }

  private async getCreatorId() {
    const profile = await this.authService.userProfile$.pipe(take(1)).toPromise();
    return profile.id;
  }

  private async generateCompanyDetailForm() {
    const res = await this.companyController.getCompanyUsingGET(this.companyId).pipe(take(1)).toPromise();
    if (res && 'OK' === res.status && res.data) {
      this.companyProfile = res.data;
      this.companyDetailForm = generateFormFromMetadata(ApiCompanyGet.formMetadata(), res.data, ApiCompanyGetValidationScheme);
    }
  }

  translateName(obj) {
    return this.codebookTranslations.translate(obj, 'name');
  }

  selectAll() {

    if (!this.showLeftSide) { return; }
    if (this.disabledLeftFields) { return; }

    if (this.cbSelectAllForm.value) {

      this.selectedInputStockOrders = [];
      for (const item of this.availableStockOrders) {
        this.selectedInputStockOrders.push(item);
      }

      this.availableStockOrders.map(item => { item.selected = true; item.selectedQuantity = item.availableQuantity; return item; });

      if (this.isClipOrder) {
        this.clipOrder(true);
      }
    } else {
      this.selectedInputStockOrders = [];
      this.availableStockOrders.map(item => { item.selected = false; item.selectedQuantity = 0; return item; });
    }
    this.calcInputQuantity(true);
    this.setWomensOnly();
  }

  clipOrder(value: boolean) {

    if (value) {

      const outputQuantity = this.totalQuantity;
      let tmpQuantity = 0;

      for (const tx of this.inputTransactions) {
        tmpQuantity += tx.outputQuantity;
      }

      for (const item of this.availableStockOrders) {

        if (!item.selected) { continue; }

        if (tmpQuantity + item.availableQuantity <= outputQuantity) {
          tmpQuantity += item.availableQuantity;
          item.selectedQuantity = item.availableQuantity;
          continue;
        }

        if (tmpQuantity >= outputQuantity) {
          item.selected = false;
          item.selectedQuantity = 0;
          continue;
        }

        item.selectedQuantity = outputQuantity - tmpQuantity;
        tmpQuantity = outputQuantity;
      }

      this.calcInputQuantity(true);
    }
  }

  useInput(value: boolean) {
    if (!this.showRightSide) { return; }
    if (value) {
      this.outputStockOrderForm.get('totalQuantity').setValue(this.form.get('outputQuantity').value);
    }
  }

  private select(semiProduct) {
    const index = this.selectedInputStockOrders.indexOf(semiProduct);
    if (index !== -1) {
      this.selectedInputStockOrders.splice(index, 1);
    } else {
      this.selectedInputStockOrders.push(semiProduct);
    }
    this.calcInputQuantity(true);
    this.setWomensOnly();
  }

  cbSelected(semiProduct, index: number) {

    if (!this.showLeftSide) { return; }

    if (this.cbSelectAllForm.value) {
      this.cbSelectAllForm.setValue(false);
    }

    if (!this.availableStockOrders[index].selected) {

      const outputQuantity = this.totalQuantity as number || 0;
      const toFill = outputQuantity - this.calcInputQuantity(false);

      const currentAvailable = this.availableStockOrders[index].availableQuantity;

      if (this.actionType === 'SHIPMENT' && this.isClipOrder) {
        if (toFill > 0 && currentAvailable > 0) {
          this.availableStockOrders[index].selected = true;
          this.availableStockOrders[index].selectedQuantity = toFill < currentAvailable ? toFill : currentAvailable;
        } else {
          this.availableStockOrders[index].selected = true;
          this.availableStockOrders[index].selectedQuantity = 0;

          this.availableStockOrders[index].selected = false;
          this.calcInputQuantity(true);
        }
      } else {
        this.availableStockOrders[index].selected = true;
        this.availableStockOrders[index].selectedQuantity = currentAvailable;
      }

    } else {
      this.availableStockOrders[index].selected = false;
      this.availableStockOrders[index].selectedQuantity = 0;
    }

    this.select(semiProduct);
  }

  isOutputStockOrder(order: ApiStockOrder) {
    if (!this.update) { return false; }
    return this.editableProcessingOrder.targetStockOrders.some(x => x === order.id);
  }

  private setWomensOnly() {

    let count = 0;
    let all = 0;

    for (const item of this.selectedInputStockOrders) {
      if (item.womenShare) {
        count += item.availableQuantity;
      }
      all += item.availableQuantity;
    }
    if (count === all && all > 0) { this.womensOnlyForm.setValue('YES'); }
    else if (count < all && all > 0) { this.womensOnlyForm.setValue('NO'); }
    else { this.womensOnlyForm.setValue(null); }
  }

  private setRequiredFields(action: ApiProcessingAction) {

    // Clear all validators
    this.outputStockOrderForm.controls.pricePerUnit.clearValidators();
    this.outputStockOrderForm.controls.pricePerUnit.updateValueAndValidity();

    // Set validator on total quantity
    if (this.actionType === 'PROCESSING' && !this.prAction.repackedOutputs) {
      setTimeout(() => this.outputStockOrderForm.get('totalQuantity').setValidators([Validators.required]));
    }

    // Clear the required fields form
    this.requiredProcEvidenceFieldsForm = new FormGroup({});

    // Set required fields form group
    if (action) {

      const evidenceFieldsValues: ApiStockOrderEvidenceFieldValue[] =
        this.outputStockOrderForm.get('requiredEvidenceFieldValues')?.value ?
          this.outputStockOrderForm.get('requiredEvidenceFieldValues').value : [];

      action.requiredEvidenceFields.forEach(field => {

        let value = null;
        const evidenceFieldValue = evidenceFieldsValues
          .find(efv => efv.evidenceFieldId === field.id && efv.evidenceFieldName === field.fieldName);

        if (evidenceFieldValue) {
          switch (field.type) {
            case TypeEnum.NUMBER:
            case TypeEnum.INTEGER:
            case TypeEnum.EXCHANGERATE:
            case TypeEnum.PRICE:
              value = evidenceFieldValue.numericValue;
              break;
            case TypeEnum.DATE:
            case TypeEnum.TIMESTAMP:
              value = evidenceFieldValue.dateValue;
              break;
            case TypeEnum.STRING:
            case TypeEnum.TEXT:
              value = evidenceFieldValue.stringValue;
              break;
            default:
              value = evidenceFieldValue.stringValue;
          }
        }

        if (field.mandatory) {
          this.requiredProcEvidenceFieldsForm.addControl(field.fieldName, new FormControl(value, Validators.required));
        } else {
          this.requiredProcEvidenceFieldsForm.addControl(field.fieldName, new FormControl(value));
        }
      });
    }
  }

  private clearCBAndValues() {
    this.availableStockOrders = [];
    this.selectedInputStockOrders = [];
    this.cbSelectAllForm.setValue(false);
  }

  private clearOutputForm() {

    this.form.get('outputQuantity').setValue(null);

    this.outputStockOrderForm.get('totalQuantity').setValue(null);
    this.outputStockOrderForm.get('pricePerUnit').setValue(null);
    this.outputStockOrderForm.get('comments').setValue(null);

    this.remainingForm.setValue(null);

    this.womensOnlyForm.setValue(null);
    this.womensOnlyStatus.setValue(null);

    this.fromFilterDate.setValue(null);
    this.toFilterDate.setValue(null);

    this.checkboxUseInputFrom.setValue(false);
    this.checkboxClipOrderFrom.setValue(false);

    this.currentOutputSemiProductNameForm.setValue(null);
  }

  private clearInputFacilityForm() {
    this.inputFacilityForm.setValue(null);
  }

  private clearOutputFacilityForm() {
    if (!this.update) {
      this.outputFacilityForm.setValue(null);
    }
  }

  private clearInput() {
    this.clearCBAndValues();
    this.clearInputFacilityForm();
  }

  private clearOutput() {
    this.clearOutputFacilityForm();
    this.clearOutputForm();
  }

  private calcInputQuantity(setValue) {

    let inputQuantity = 0;
    if (this.update) {
      for (const item of this.availableStockOrders) {
        inputQuantity += item.selectedQuantity ? item.selectedQuantity : 0;
      }

      const txs = this.inputTransactions;

      if (txs) {
        for (const tx of txs) {
          if (tx.status !== ApiTransactionStatus.CANCELED) {
            inputQuantity += tx.outputQuantity;
          }
        }
      }

    } else {
      for (const item of this.availableStockOrders) {
        inputQuantity += item.selectedQuantity ? item.selectedQuantity : 0;
      }
    }

    if (setValue) {
      if (this.actionType === 'PROCESSING') {
        this.form.get('outputQuantity').setValue(Number(inputQuantity).toFixed(2));
        if (this.isUsingInput) {
          this.outputStockOrderForm.get('totalQuantity').setValue(Number(inputQuantity).toFixed(2));
        }
      } else {
        if (this.form) { this.form.get('outputQuantity').setValue(Number(inputQuantity).toFixed(2)); }
      }
    }

    return inputQuantity;
  }

  private initializeFacilitiesCodebooks() {

    // If we have defined input semi-product, set input facility
    if (this.prAction.inputSemiProduct && this.prAction.inputSemiProduct.id) {
      if (this.actionType === 'SHIPMENT') {

        // If we have shipment action (quote processing action), get the selling facilities that the current company can order from
        this.inputFacilitiesCodebook =
          new AvailableSellingFacilitiesForCompany(this.facilityController, this.companyId, this.prAction.inputSemiProduct.id);

      } else {
        this.inputFacilitiesCodebook =
          new CompanyFacilitiesForSemiProductService(this.facilityController, this.companyId, this.prAction.inputSemiProduct.id);
      }
    }

    // If we have defined output semi-product, set output facility
    if (this.prAction.outputSemiProduct && this.prAction.outputSemiProduct.id) {
      this.outputFacilitiesCodebook =
        new CompanyFacilitiesForSemiProductService(this.facilityController, this.companyId, this.prAction.outputSemiProduct.id);
    }
  }

  private initializeListManager() {
    this.processingEvidenceListManager = new ListEditorManager<ApiActivityProof>(
      this.otherProcessingEvidenceArray as FormArray,
      StockProcessingOrderDetailsComponent.ApiActivityProofEmptyObjectFormFactory(),
      ApiActivityProofValidationScheme
    );
  }

  private setInputOutputFormAccordinglyToTransaction(availableQua: number) {

    (this.outputStockOrders as FormArray).clear();

    if (this.prAction && this.actionType === 'PROCESSING') {

      if (this.prAction.repackedOutputs && this.prAction.maxOutputWeight > 0) {

        const outputStockOrdersSize = Math.ceil(availableQua / this.prAction.maxOutputWeight);
        for (let i = 0; i < outputStockOrdersSize; i++) {
          let w = this.prAction.maxOutputWeight;
          if (i === outputStockOrdersSize - 1) { w = availableQua - i * this.prAction.maxOutputWeight; }
          (this.outputStockOrders as FormArray).push(new FormGroup({
            id: new FormControl(null),
            totalQuantity: new FormControl(null, Validators.max(this.prAction.maxOutputWeight)),
            sacNumber: new FormControl(i + 1, [Validators.required])
          }));
        }
      }
    }
  }

  private initializeOutputStockOrdersForEdit() {

    if (this.prAction && this.actionType === 'PROCESSING') {
      if (this.prAction.repackedOutputs && this.prAction.maxOutputWeight > 0) {
        for (const stockOrder of this.editableProcessingOrder.targetStockOrders) {

          this.outputStockOrders.push(new FormGroup({
            id: new FormControl(stockOrder.id),
            totalQuantity: new FormControl(stockOrder.totalQuantity,
              [Validators.min(stockOrder.fulfilledQuantity - stockOrder.availableQuantity),
                Validators.max(this.prAction.maxOutputWeight)]),
            sacNumber: new FormControl(stockOrder.sacNumber, [Validators.required])
          }));
        }
        this.outputStockOrders.updateValueAndValidity();
      }
    }
  }

  async setWomensOnlyStatus(status: boolean) {
    if (!this.showLeftSide) { return; }
    this.womensOnlyStatus.setValue(status);
    if (this.currentInputFacility) {
      this.dateSearch().then();
    }
  }

  private prefillOutputFacility() {

    // TODO: complete the implementation
    const prefillOutputFacility = false;

    // if (this.prAction && this.prAction.requiredFields) {
    //   for (const item of this.prAction.requiredFields) {
    //     if (item.label === 'PREFILL_OUTPUT_FACILITY') {
    //       if (this.inputFacilityForm && this.inputFacilityForm.value) {
    //         this.subs.push(this.outputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
    //           if (val) {
    //             for (const item of val) {
    //               if (item._id === this.inputFacilityForm.value._id && !this.update) {
    //                 this.outputFacilityForm.setValue(this.inputFacilityForm.value);
    //                 prefillOutputFacility = true;
    //                 break;
    //               }
    //             }
    //           }
    //         }));
    //       }
    //       break;
    //     }
    //   }
    // }

    if (!prefillOutputFacility) {
      this.subscriptions.push(this.outputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
        if (val && val.length === 1 && !this.update) {
          this.outputFacilityForm.setValue(val[0]);
        }
      }));
    }
  }

  async dateSearch() {

    if (!this.showLeftSide) { return; }
    const from = this.fromFilterDate.value;
    const to = this.toFilterDate.value;
    if (!this.currentInputFacility) { return; }

    // Prepare initial request params
    const requestParams: GetAvailableStockForSemiProductInFacilityUsingGET.PartialParamMap = {
      facilityId: this.currentInputFacility.id,
      semiProductId: this.processingActionForm.value.inputSemiProduct.id,
      isWomenShare: this.womensOnlyStatus.value
    };

    // Prepare date filters
    if (from && to) {
      requestParams.productionDateStart = new Date(from);
      requestParams.productionDateEnd = new Date(to);
    } else if (from) {
      requestParams.productionDateStart = new Date(from);

      const tomorrow = new Date();
      tomorrow.setDate(new Date().getDate() + 1);
      requestParams.productionDateEnd = tomorrow;

    } else if (to) {
      requestParams.productionDateStart = new Date(null);
      requestParams.productionDateEnd = new Date(to);
    }

    // Get the available stock in the provided facility for the provided semi-product
    const res = await this.stockOrderController
      .getAvailableStockForSemiProductInFacilityUsingGETByMap(requestParams).pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data) {
      this.availableStockOrders = res.data.items;
    }

    // Reinitialize selections
    const tmpSelected = [];
    for (const item of this.availableStockOrders) {
      for (const selected of this.selectedInputStockOrders) {
        if (selected.id === item.id) {
          tmpSelected.push(item);
          item.selected = true;
          item.selectedQuantity = selected.availableQuantity;
        }
      }
    }
    this.selectedInputStockOrders = tmpSelected;
    this.calcInputQuantity(true);
  }

  deleteTransaction(i: number) {

    if (!this.showLeftSide) { return; }

    if (this.actionType === 'PROCESSING' || this.actionType === 'SHIPMENT') {
      this.processingOrderInputTransactions.splice(i, 1);
      this.calcInputQuantity(true);
      return;
    }

    if (this.actionType === 'TRANSFER') {
      this.processingOrderInputTransactions.splice(i, 1);
      this.editableProcessingOrder.targetStockOrders.splice(i, 1);
      this.calcInputQuantity(true);
    }
  }

  setRemaining() {

    if (this.actionType === 'PROCESSING') {
      this.remainingForm.setValue((this.calcInputQuantity(false) - this.calculateOutputQuantity).toFixed(2));
    }
    if (this.actionType === 'SHIPMENT') {
      this.remainingForm.setValue((this.totalQuantity - this.calcInputQuantity(false)).toFixed(2));
    }
  }

  prefillOutputStockOrdersQuantities() {

    let availableQua = this.outputStockOrderForm.get('totalQuantity').value;

    const maxWeight = this.prAction.maxOutputWeight;

    this.outputStockOrders.controls.some((outputStockOrderGroup: FormGroup) => {
      outputStockOrderGroup.get('totalQuantity').setValue(Number(availableQua > maxWeight ? maxWeight : availableQua).toFixed(2));
      availableQua -= maxWeight;
      if (availableQua <= 0) {
        return true;
      }
    });
  }

  addOutputStockOrder() {

    let sacNumber = null;
    if (this.outputStockOrders.length > 0) {
      const lastSacNumber = Number(this.outputStockOrders.controls[this.outputStockOrders.length - 1].get('sacNumber').value);
      if (lastSacNumber && lastSacNumber > 0) {
        sacNumber = lastSacNumber + 1;
      }
    }

    (this.outputStockOrders as FormArray).push(
      new FormGroup({
        id: new FormControl(null),
        totalQuantity: new FormControl(null, Validators.max(this.prAction.maxOutputWeight)),
        sacNumber: new FormControl(sacNumber, [Validators.required])
      }));
  }

  removeOutputStockOrder(idx) {
    (this.outputStockOrders as FormArray).removeAt(idx);
  }

  dismiss() {
    this.location.back();
  }

}
