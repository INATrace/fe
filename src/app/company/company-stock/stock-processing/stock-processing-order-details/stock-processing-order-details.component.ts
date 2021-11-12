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
  GetAvailableStockForStockUnitInFacilityUsingGET,
  StockOrderControllerService
} from '../../../../../api/api/stockOrderController.service';
import { SemiProductControllerService } from '../../../../../api/api/semiProductController.service';
import { ApiSemiProduct } from '../../../../../api/model/apiSemiProduct';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { CompanyFacilitiesForSemiProductService } from '../../../../shared-services/company-facilities-for-semi-product.service';
import { Subscription } from 'rxjs';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { faCut } from '@fortawesome/free-solid-svg-icons';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faFemale } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ApiProcessingOrder } from '../../../../../api/model/apiProcessingOrder';
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
import { ApiFinalProduct } from '../../../../../api/model/apiFinalProduct';
import { ProductControllerService } from '../../../../../api/api/productController.service';
import ApiTransactionStatus = ApiTransaction.StatusEnum;
import OrderTypeEnum = ApiStockOrder.OrderTypeEnum;
import TypeEnum = ApiProcessingEvidenceField.TypeEnum;
import { GenerateQRCodeModalComponent } from '../../../../components/generate-qr-code-modal/generate-qr-code-modal.component';
import { NgbModalImproved } from '../../../../core/ngb-modal-improved/ngb-modal-improved.service';
import { ClipInputTransactionModalComponent } from './clip-input-transaction-modal/clip-input-transaction-modal.component';
import { ClipInputTransactionModalResult } from './clip-input-transaction-modal/model';

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
  faQrcode = faQrcode;
  faCut = faCut;
  faLeaf = faLeaf;
  faFemale = faFemale;

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

  // Processing action controls
  prAction: ApiProcessingAction;
  processingActionForm = new FormControl(null, Validators.required);
  processingActionLotPrefixForm = new FormControl({ value: null, disabled: true });
  qrCodeForFinalProductForm = new FormControl(null);

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

  // Input and output stock units (Semi-products and Final products)
  currentInputStockUnitProduct: ApiSemiProduct | ApiFinalProduct;
  currentOutputStockUnitProduct: ApiSemiProduct | ApiFinalProduct;
  currentOutputStockUnitNameForm = new FormControl(null);

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
  womenOnlyForm = new FormControl(null);
  womenOnlyStatus = new FormControl(null);
  organicOnlyForm = new FormControl(null);
  organicOnlyStatus = new FormControl(null);
  fromFilterDate = new FormControl(null);
  toFilterDate = new FormControl(null);

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

  // Output quantity expected range
  private outQuantityRangeLow: number = null;
  private outQuantityRangeHigh: number = null;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private globalEventsManager: GlobalEventManagerService,
    private stockOrderController: StockOrderControllerService,
    private processingOrderController: ProcessingOrderControllerService,
    private procActionController: ProcessingActionControllerService,
    private facilityController: FacilityControllerService,
    private semiProductsController: SemiProductControllerService,
    private productController: ProductControllerService,
    private companyController: CompanyControllerService,
    private authService: AuthService,
    private codebookTranslations: CodebookTranslations,
    public actionTypesCodebook: ActionTypesService,
    private modalService: NgbModalImproved
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

  get showInputTransactions() {
    return this.inputFacilityForm.value;
  }

  get womenOnlyStatusValue() {
    if (this.womenOnlyStatus.value != null) {
      if (this.womenOnlyStatus.value) { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.womenCoffee:Women coffee`; }
      else { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.nonWomenCoffee:Non-women coffee`; }
    }
    return null;
  }

  get organicOnlyStatusValue() {
    if (this.organicOnlyStatus.value != null) {
      if (this.organicOnlyStatus.value) {
        return $localize`:@@productLabelStockProcessingOrderDetail.organicOnlyStatus.organicCoffee:Organic coffee`;
      } else {
        return $localize`:@@productLabelStockProcessingOrderDetail.organicOnlyStatus.nonOrganicCoffee:Non-organic coffee`;
      }
    }
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

  get nonOutputStockOrdersInputStockOrdersLength() {

    if (!this.outputStockOrderForm) { return 0; }
    if (!this.update) { return this.availableStockOrders.length; }

    const allSet = new Set(this.availableStockOrders.map(x => x.id));

    if (this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING' || this.actionType === 'TRANSFER' || this.actionType === 'GENERATE_QR_CODE') {
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

  get outputStockUnitLabel() {

    switch (this.actionType) {
      case 'FINAL_PROCESSING':
        return $localize`:@@productLabelStockProcessingOrderDetail.textinput.finalProductType.label:Final product type`;

      case 'SHIPMENT':
      case 'TRANSFER':
        if (this.prAction.finalProductAction) {
          return $localize`:@@productLabelStockProcessingOrderDetail.textinput.finalProductType.label:Final product type`;
        }
        else {
          return $localize`:@@productLabelStockProcessingOrderDetail.textinput.semiProductType.label:Semi-product type`;
        }

      default:
        return $localize`:@@productLabelStockProcessingOrderDetail.textinput.semiProductType.label:Semi-product type`;
    }
  }

  get inputQuantityLabel() {
    return $localize`:@@productLabelStockProcessingOrderDetail.textinput.inputQuantityLabelWithUnits.label: Input quantity in ${
      this.currentInputStockUnitProduct ? this.codebookTranslations.translate(this.currentInputStockUnitProduct.measurementUnitType, 'label') : '' 
    }`;
  }

  get outputQuantityLabel() {
    return $localize`:@@productLabelStockProcessingOrderDetail.textinput.outputQuantityLabelWithUnits.label: Output quantity in ${
      this.currentOutputStockUnitProduct ? this.codebookTranslations.translate(this.currentOutputStockUnitProduct.measurementUnitType, 'label') : '' }`;
  }

  get expectedOutputQuantityHelpText() {

    if (this.actionType !== 'PROCESSING' || !this.prAction?.estimatedOutputQuantityPerUnit) {
      return null;
    }

    let quantityFrom = '/';
    let quantityTo = '/';

    const currentInputQuantity = Number(this.form.get('outputQuantity').value);
    if (currentInputQuantity) {

      let expectedOutputQuantity;
      let normalizedInputQuantity;
      if (!!this.underlyingMeasurementUnit) {
        expectedOutputQuantity = currentInputQuantity * this.prAction.estimatedOutputQuantityPerUnit;
      } else {

        normalizedInputQuantity =
          currentInputQuantity / this.currentInputStockUnitProduct.measurementUnitType.weight / this.currentOutputStockUnitProduct.measurementUnitType.weight;
        expectedOutputQuantity = normalizedInputQuantity * this.prAction.estimatedOutputQuantityPerUnit;
      }

      this.outQuantityRangeLow = Number(expectedOutputQuantity * 0.8);
      this.outQuantityRangeHigh = Math.min(Number(expectedOutputQuantity * 1.2), normalizedInputQuantity ? normalizedInputQuantity : currentInputQuantity);

      quantityFrom = this.outQuantityRangeLow.toFixed(2);
      quantityTo = this.outQuantityRangeHigh.toFixed(2);
    } else {

      this.outQuantityRangeLow = null;
      this.outQuantityRangeHigh = null;
    }

    return $localize`:@@productLabelStockProcessingOrderDetail.textinput.outputQuantity.expectedOutputHelpText:Expected output quantity range:` +
      ` ${quantityFrom} ~ ${quantityTo} (${this.currentOutputStockUnitProduct.measurementUnitType.label})`;
  }

  get showRemainingForm() {
    if (this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING') {
      return !!this.underlyingMeasurementUnit;
    }
    return this.actionType === 'SHIPMENT';
  }

  get underlyingMeasurementUnit() {

    if (!this.prAction) { return null; }

    if (this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING') {

      const inputMeasurementUnit = this.currentInputStockUnitProduct?.measurementUnitType;
      const outputMeasurementUnit = this.currentOutputStockUnitProduct?.measurementUnitType;

      if (!inputMeasurementUnit || !outputMeasurementUnit) {
        return null;
      }

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
    return this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING';
  }

  get outputQuantityNotInRange() {

    if (this.actionType !== 'PROCESSING' || !this.prAction?.estimatedOutputQuantityPerUnit ||
      !this.outQuantityRangeLow || !this.outQuantityRangeHigh) {
      return false;
    }

    const outputQuantity = Number(this.outputStockOrderForm.get('totalQuantity').value);
    if (!outputQuantity) {
      return false;
    }

    if (!(outputQuantity >= this.outQuantityRangeLow && outputQuantity <= this.outQuantityRangeHigh)) {
      return true;
    }
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

    if (!this.currentInputStockUnitProduct || !this.currentOutputStockUnitProduct) {
      return false;
    }

    const inputQuantityInKg: number = Number(this.form.get('outputQuantity').value).valueOf() / this.currentOutputStockUnitProduct.measurementUnitType.weight;
    const outputQuantityInKg: number = Number(this.outputStockOrderForm.get('totalQuantity').value).valueOf() / this.currentInputStockUnitProduct.measurementUnitType.weight;
    return inputQuantityInKg && outputQuantityInKg && (outputQuantityInKg > inputQuantityInKg);
  }

  get invalidOutputQuantityForShipment() {
    return this.actionType === 'SHIPMENT' && this.invalidOutputQuantity;
  }

  get showUseInput() {
    return (this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING') && this.underlyingMeasurementUnit;
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
        this.underlyingMeasurementUnit.label : this.currentOutputStockUnitProduct?.measurementUnitType.label;

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

    this.registerProcActionValueChangeListener();

    this.initInitialData().then(
      async () => {

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

          } else if (this.actionType === 'GENERATE_QR_CODE') {

            // IN case we are generating QR code, set the output facility to be the same with the input and set it as disabled
            this.inputFacilityForm.setValue(this.inputFacilityFromUrl);
            this.setInputFacility(this.inputFacilityFromUrl, !this.update).then();

            this.outputFacilityForm.setValue(this.inputFacilityFromUrl);
            this.outputFacilityForm.disable();
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
      },
      reason => {
        this.globalEventsManager.showLoading(false);
        throw reason;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private registerOutputValueChangeListener() {

    this.subscriptions.push(this.outputStockOrderForm.get('totalQuantity').valueChanges
      .pipe(debounceTime(300))
      .subscribe((val: number) => {
        if (!this.invalidOutputQuantityTooLargeValue) {
          this.setInputOutputFormAccordinglyToTransaction(val);
        }
      }));
  }

  private registerProcActionValueChangeListener() {

    this.subscriptions.push(this.processingActionForm.valueChanges.subscribe(procAction => {

      // If we have Processing action for generating QR code, set the final product form
      if (procAction && procAction.type === 'GENERATE_QR_CODE' && procAction.qrCodeForFinalProduct) {
        this.qrCodeForFinalProductForm
          .setValue(`${ procAction.qrCodeForFinalProduct.name } (${ procAction.qrCodeForFinalProduct.product.name })`);
      }

      // Set the prefix of the selected Processing action
      if (procAction) {
        this.processingActionLotPrefixForm.setValue(procAction.prefix);
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
          this.processingActionLotPrefixForm.setValue(this.prAction.prefix);
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
      this.processingActionLotPrefixForm.setValue(this.prAction.prefix);
      this.processingDateForm.setValue(this.editableProcessingOrder.processingDate);
      this.defineInputAndOutputSemiProduct(this.prAction).then();

      // Set the input transactions and stock orders
      this.processingOrderInputTransactions = this.editableProcessingOrder.inputTransactions;
      this.processingOrderInputOrders = this.editableProcessingOrder.inputTransactions.map(value => value.sourceStockOrder);

      // Handle the update initialization for Quote orders
      if (actionType === 'SHIPMENT') {

        this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateShipmentTitle:Update shipment action`;

        const respFacility = await this.facilityController
          .getFacilityUsingGET(this.outputStockOrder.quoteFacility.id).pipe(take(1)).toPromise();
        if (respFacility && respFacility.status === 'OK' && respFacility.data) {
          this.inputFacilityFromUrl = respFacility.data;
        }
      }

      // Set title for Transfer orders
      if (actionType === 'TRANSFER') {
        this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateTransferTitle:Update transfer action`;
      }

      // Set title for Processing orders
      if (actionType === 'PROCESSING') {
        this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateProcessingTitle:Update processing action`;
      }

      // Set title for Final processing orders
      if (actionType === 'FINAL_PROCESSING') {
        this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateFinalProcessingTitle:Update final processing action`;
      }

      // Handle the update initialization (the common code) for order where processing action type is 'PROCESSING' or 'TRANSFER'
      if (actionType === 'PROCESSING' || actionType === 'FINAL_PROCESSING' || actionType === 'TRANSFER' || actionType === 'GENERATE_QR_CODE') {

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
          isProcessing: this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING' || this.actionType === 'GENERATE_QR_CODE',
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
      womenShare: this.womenOnlyForm.value === true,
      organic: this.organicOnlyForm.value === true,
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

      const existingTargetStockOrdersCount =
        this.editableProcessingOrder && this.editableProcessingOrder.targetStockOrders ? this.editableProcessingOrder.targetStockOrders.length : 0;

      for (const [index, inputStockOrder] of this.selectedInputStockOrders.entries()) {
        const newStockOrder: ApiStockOrder = {
          ...sharedFields,
          facility: this.outputFacilityForm.value,
          semiProduct: inputStockOrder.semiProduct,
          finalProduct: inputStockOrder.finalProduct,
          internalLotNumber: `${this.outputStockOrderForm.get('internalLotNumber').value}/${index + 1 + existingTargetStockOrdersCount}`,
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

      const semiProduct: ApiSemiProduct = this.prAction.outputSemiProduct?.id ? this.prAction.outputSemiProduct : null;
      const finalProduct: ApiFinalProduct = this.prAction.outputFinalProduct?.id ? this.prAction.outputFinalProduct : null;

      // In this case we have multiple destination stock orders because we are repacking outputs
      if ((this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING') && this.outputStockOrders.value.length > 0) {

        for (const item of this.outputStockOrders.value) {
          const outputStockOrder = item as ApiStockOrder;
          if (outputStockOrder.totalQuantity) {
            const newStockOrder: ApiStockOrder = {
              ...sharedFields,
              id: outputStockOrder.id,
              internalLotNumber: this.outputStockOrderForm.get('internalLotNumber').value + `/${ outputStockOrder.sacNumber }`,
              creatorId: this.creatorId,
              semiProduct,
              finalProduct,
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

        // In this case we are dealing with ordinary processing (without repacking) or shipmen (Quote) order
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
          semiProduct,
          finalProduct,
          facility: this.outputFacilityForm.value,
          totalQuantity: parseFloat(this.totalQuantity),
          fulfilledQuantity: (this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING' || this.actionType === 'GENERATE_QR_CODE') ?
            parseFloat(this.totalQuantity) : 0,
          availableQuantity: (this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING' || this.actionType === 'GENERATE_QR_CODE') ?
            parseFloat(this.totalQuantity) : 0,
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
      this.currentOutputStockUnitNameForm,
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

    let inputSemiProduct: ApiSemiProduct;
    let outputSemiProduct: ApiSemiProduct;

    let inputFinalProduct: ApiFinalProduct;
    let outputFinalProduct: ApiFinalProduct;

    // If input semi-product is set, get its definition
    if (event.inputSemiProduct && event.inputSemiProduct.id) {
      const resInSP = await this.semiProductsController.getSemiProductUsingGET(event.inputSemiProduct.id).pipe(take(1)).toPromise();
      inputSemiProduct = resInSP && resInSP.status === 'OK' ? resInSP.data : null;
    }

    // If we have defined input semi-product, get its definition
    if (event.outputSemiProduct && event.outputSemiProduct.id) {
      const resOutSP = await this.semiProductsController.getSemiProductUsingGET(event.outputSemiProduct.id).pipe(take(1)).toPromise();
      outputSemiProduct = resOutSP && resOutSP.status === 'OK' ? resOutSP.data : null;
    }

    // If input final product is provided get its definition
    if (event.inputFinalProduct && event.inputFinalProduct.id) {
      const resInFP = await this.productController
        .getFinalProductUsingGET(event.inputFinalProduct.product.id, event.inputFinalProduct.id).pipe(take(1)).toPromise();
      inputFinalProduct = resInFP && resInFP.status === 'OK' ? resInFP.data : null;
    }

    // If output final product is provided get its definition
    if (event.outputFinalProduct && event.outputFinalProduct.id) {
      const resOutFP = await this.productController
        .getFinalProductUsingGET(event.outputFinalProduct.product.id, event.outputFinalProduct.id).pipe(take(1)).toPromise();
      outputFinalProduct = resOutFP && resOutFP.status === 'OK' ? resOutFP.data : null;
    }

    switch (event.type) {
      case ApiProcessingAction.TypeEnum.PROCESSING:
      case ApiProcessingAction.TypeEnum.GENERATEQRCODE:

        this.currentInputStockUnitProduct = inputSemiProduct;
        this.currentOutputStockUnitProduct = outputSemiProduct;
        this.currentOutputStockUnitNameForm.setValue(outputSemiProduct ? outputSemiProduct.name : null);
        break;

      case ApiProcessingAction.TypeEnum.FINALPROCESSING:

        this.currentInputStockUnitProduct = inputSemiProduct;
        this.currentOutputStockUnitProduct = outputFinalProduct;
        this.currentOutputStockUnitNameForm
          .setValue(outputFinalProduct ? `${outputFinalProduct.name} (${outputFinalProduct.product.name})` : null);
        break;

      case ApiProcessingAction.TypeEnum.TRANSFER:
      case ApiProcessingAction.TypeEnum.SHIPMENT:

        // Is it a final product only involvement
        if (event.finalProductAction) {

          this.currentInputStockUnitProduct = inputFinalProduct;
          this.currentOutputStockUnitProduct = outputFinalProduct;
          this.currentOutputStockUnitNameForm
            .setValue(outputFinalProduct ? `${outputFinalProduct.name} (${outputFinalProduct.product.name})` : null);

        } else {

          this.currentInputStockUnitProduct = inputSemiProduct;
          this.currentOutputStockUnitProduct = outputSemiProduct;
          this.currentOutputStockUnitNameForm.setValue(outputSemiProduct ? outputSemiProduct.name : null);
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
        if (this.prAction.type === 'SHIPMENT') { this.title = $localize`:@@productLabelStockProcessingOrderDetail.newShipmentTitle:Add shipment action`; }
        if (this.prAction.type === 'TRANSFER') { this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTransferTitle:Add transfer action`; }
        if (this.prAction.type === 'PROCESSING') { this.title = $localize`:@@productLabelStockProcessingOrderDetail.newProcessingTitle:Add processing action`; }
        if (this.prAction.type === 'FINAL_PROCESSING') { this.title = $localize`:@@productLabelStockProcessingOrderDetail.newFinalProcessingTitle:Add final processing action`; }
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
      return;
    }

    if (event) {
      this.currentInputFacility = event;

      const requestParams: GetAvailableStockForStockUnitInFacilityUsingGET.PartialParamMap = {
        limit: 500,
        offset: 0,
        facilityId: event.id,
        semiProductId: this.prAction.inputSemiProduct?.id,
        finalProductId: this.prAction.inputFinalProduct?.id
      };

      const res = await this.stockOrderController
        .getAvailableStockForStockUnitInFacilityUsingGETByMap(requestParams)
        .pipe(take(1)).toPromise();

      if (res && res.status === 'OK' && res.data) {
        this.availableStockOrders = res.data.items;
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

      if (this.currentOutputStockUnitProduct) {

        // If defined semi-product set the semi-product name (if defined final product, set the final product and product name)
        if (this.prAction.outputSemiProduct?.id) {
          this.currentOutputStockUnitNameForm.setValue(this.currentOutputStockUnitProduct.name);

        } else if (this.prAction.outputFinalProduct?.id) {

          const outputFinalProduct = this.prAction.outputFinalProduct as ApiFinalProduct;
          this.currentOutputStockUnitNameForm.setValue(`${ outputFinalProduct.name } (${ outputFinalProduct.product.name })`);
        }
      }
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

  async clipInputTransaction(item: ApiStockOrderSelectable, index: number) {

    if (!this.showLeftSide) { return; }

    const modalRef = this.modalService.open(ClipInputTransactionModalComponent, { centered: true, keyboard: false, backdrop: 'static' });
    Object.assign(modalRef.componentInstance, {
      stockOrder: item,
      currentSelectedQuantity: this.availableStockOrders[index].selectedQuantity
    });

    const result: ClipInputTransactionModalResult = await modalRef.result;
    if (!result) {
      return;
    }

    if (result.selectedQuantity > 0) {

      // If this transaction was not selected, trigger selection
      if (!this.availableStockOrders[index].selected) {
        this.select(item);
      }

      this.availableStockOrders[index].selected = true;
      this.availableStockOrders[index].selectedQuantity = result.selectedQuantity;
    } else {

      // If this transaction was selected, trigger unselect
      if (this.availableStockOrders[index].selected) {
        this.select(item);
      }

      this.availableStockOrders[index].selected = false;
      this.availableStockOrders[index].selectedQuantity = 0;
    }

    this.calcInputQuantity(true);
  }

  cbSelected(stockOrder, index: number) {

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

    this.select(stockOrder);
  }

  private select(stockOrder) {
    const index = this.selectedInputStockOrders.indexOf(stockOrder);
    if (index !== -1) {
      this.selectedInputStockOrders.splice(index, 1);
    } else {
      this.selectedInputStockOrders.push(stockOrder);
    }
    this.calcInputQuantity(true);
    this.setOrganicAndWomenOnly();
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
    this.setOrganicAndWomenOnly();
  }

  useInput(value: boolean) {
    if (!this.showRightSide) { return; }
    if (value) {
      this.outputStockOrderForm.get('totalQuantity').setValue(this.form.get('outputQuantity').value);
    }
  }

  isOutputStockOrder(order: ApiStockOrder) {
    if (!this.update) { return false; }
    return this.editableProcessingOrder.targetStockOrders.some(x => x.id === order.id);
  }

  private setOrganicAndWomenOnly() {

    let countOrganic = 0;
    let countWomenShare = 0;

    const allSelected = this.selectedInputStockOrders.length;
    for (const item of this.selectedInputStockOrders) {
      if (item.organic) {
        countOrganic++;
      }

      if (item.womenShare) {
        countWomenShare++;
      }
    }

    if (countOrganic === allSelected && allSelected > 0) {
      this.organicOnlyForm.setValue(true);
    } else {
      this.organicOnlyForm.setValue(false);
    }

    if (countWomenShare === allSelected && allSelected) {
      this.womenOnlyForm.setValue(true);
    } else {
      this.womenOnlyForm.setValue(false);
    }
  }

  private setRequiredFields(action: ApiProcessingAction) {

    // Clear all validators
    this.outputStockOrderForm.controls.pricePerUnit.clearValidators();
    this.outputStockOrderForm.controls.pricePerUnit.updateValueAndValidity();

    // Set validator on total quantity
    if ((this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING') && !this.prAction.repackedOutputs) {
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

    this.womenOnlyForm.setValue(null);
    this.womenOnlyStatus.setValue(null);

    this.organicOnlyForm.setValue(null);
    this.organicOnlyStatus.setValue(null);

    this.fromFilterDate.setValue(null);
    this.toFilterDate.setValue(null);

    this.checkboxUseInputFrom.setValue(false);
    this.checkboxClipOrderFrom.setValue(false);

    this.currentOutputStockUnitNameForm.setValue(null);
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
      if (this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING') {

        this.form.get('outputQuantity').setValue(Number(inputQuantity).toFixed(2));
        if (this.isUsingInput) {
          this.outputStockOrderForm.get('totalQuantity').setValue(Number(inputQuantity).toFixed(2));
        }

      } else if (this.actionType === 'GENERATE_QR_CODE') {

        if (this.form) {
          this.form.get('outputQuantity').setValue(Number(inputQuantity).toFixed(2));
          this.outputStockOrderForm.get('totalQuantity').setValue(Number(inputQuantity).toFixed(2));
        }
      } else {

        if (this.form) {
          this.form.get('outputQuantity').setValue(Number(inputQuantity).toFixed(2));
        }
      }
    }

    return inputQuantity;
  }

  private initializeFacilitiesCodebooks() {

    const inputSemiProductId = this.prAction.inputSemiProduct?.id;
    const inputFinalProductId = this.prAction.inputFinalProduct?.id;

    const outputSemiProductId = this.prAction.outputSemiProduct?.id;
    const outputFinalProductId = this.prAction.outputFinalProduct?.id;

    // If there is input semi-product or input final product set, initialize input facility codebook
    if (inputSemiProductId || inputFinalProductId) {

      // If we have shipment action (quote processing action), get the selling facilities that the current company can order from
      if (this.actionType === 'SHIPMENT') {
        this.inputFacilitiesCodebook =
          new AvailableSellingFacilitiesForCompany(this.facilityController, this.companyId, inputSemiProductId, inputFinalProductId);
      } else {
        this.inputFacilitiesCodebook =
          new CompanyFacilitiesForSemiProductService(this.facilityController, this.companyId, inputSemiProductId, inputFinalProductId);
      }
    }

    // If there is output semi-product or output final product set, initialize output facility codebook
    if (outputSemiProductId || outputFinalProductId) {
      this.outputFacilitiesCodebook =
        new CompanyFacilitiesForSemiProductService(this.facilityController, this.companyId, outputSemiProductId, outputFinalProductId);
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

    if (this.prAction && (this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING')) {

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

    if (this.prAction && (this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING')) {

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

  async setWomenOnlyStatus(status: boolean) {
    if (!this.showLeftSide) {
      return;
    }

    this.womenOnlyStatus.setValue(status);
    if (this.currentInputFacility) {
      this.dateSearch().then();
    }
  }

  async setOrganicOnlyStatus(organicOnly: boolean) {
    if (!this.showLeftSide) {
      return;
    }

    this.organicOnlyStatus.setValue(organicOnly);
    if (this.currentInputFacility) {
      this.dateSearch().then();
    }
  }

  private prefillOutputFacility() {

    this.subscriptions.push(this.outputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
      if (val && val.length === 1 && !this.update) {
        this.outputFacilityForm.setValue(val[0]);
      }
    }));
  }

  async dateSearch() {

    if (!this.showLeftSide) { return; }
    const from = this.fromFilterDate.value;
    const to = this.toFilterDate.value;
    if (!this.currentInputFacility) { return; }

    // Prepare initial request params
    const requestParams: GetAvailableStockForStockUnitInFacilityUsingGET.PartialParamMap = {
      limit: 500,
      offset: 0,
      facilityId: this.currentInputFacility.id,
      semiProductId: this.prAction.inputSemiProduct?.id,
      finalProductId: this.prAction.inputFinalProduct?.id,
      isWomenShare: this.womenOnlyStatus.value,
      organicOnly: this.organicOnlyStatus.value
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
      .getAvailableStockForStockUnitInFacilityUsingGETByMap(requestParams).pipe(take(1)).toPromise();
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

    if (this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING' || this.actionType === 'SHIPMENT' || this.actionType === 'GENERATE_QR_CODE') {
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

    if (this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING') {
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

  openInputStockOrderQRCode(order: ApiStockOrder) {

    if (!order.qrCodeTag) {
      return;
    }

    const modalRef = this.modalService.open(GenerateQRCodeModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
    Object.assign(modalRef.componentInstance, {
      qrCodeTag: order.qrCodeTag
    });
  }

}
