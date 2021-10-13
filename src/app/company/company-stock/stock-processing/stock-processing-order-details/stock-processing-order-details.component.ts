import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyProcessingActionsService } from '../../../../shared-services/company-processing-actions.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { ApiProcessingAction } from '../../../../../api/model/apiProcessingAction';
import { ProcessingActionControllerService } from '../../../../../api/api/processingActionController.service';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { ApiFacility } from '../../../../../api/model/apiFacility';
import { dateAtMidnightISOString, generateFormFromMetadata } from '../../../../../shared/utils';
import { AuthService } from '../../../../core/auth.service';
import { ActionTypesService } from '../../../../shared-services/action-types.service';
import { ApiCompanyGet } from '../../../../../api/model/apiCompanyGet';
import { ApiCompanyGetValidationScheme } from '../../../company-detail/validation';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';
import { CodebookTranslations } from '../../../../shared-services/codebook-translations';
import { ProcessingActionType } from '../../../../../shared/types';
import { CompanySellingFacilitiesForSemiProductService } from '../../../../shared-services/company-selling-facilities-for-semi-product.service';
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
import { ApiProcessingOrder } from '../../../../../api/model/apiProcessingOrder';
import { FacilitySemiProductsCodebookService } from '../../../../shared-services/facility-semi-products-codebook.service';
import { ApiTransaction } from '../../../../../api/model/apiTransaction';
import { ApiStockOrderValidationScheme, ApiTransactionValidationScheme, customValidateArrayGroup } from './validation';
import { ApiPaginatedResponseApiStockOrder } from '../../../../../api/model/apiPaginatedResponseApiStockOrder';
import StatusEnum = ApiPaginatedResponseApiStockOrder.StatusEnum;
import { ChainProductOrder } from '../../../../../api-chain/model/chainProductOrder';

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

  title: string;

  companyId: number;
  creatorId: number;

  // List for holding references to observable subscriptions
  subscriptions: Subscription[] = [];

  form: FormGroup;

  submitted = false;
  update = false;

  prAction: ApiProcessingAction;
  processingActionForm = new FormControl(null, Validators.required);

  // Checkboxes form controls
  checkboxClipOrderFrom = new FormControl(false);
  checkboxUseInputFrom = new FormControl();

  // Input facility
  inputFacilityFromUrl: ApiFacility = null;
  currentInputFacility: ApiFacility = null;
  inputFacilityForm = new FormControl(null, Validators.required);
  inputFacilitiesCodebook: FacilitiesCodebookService | CompanyFacilitiesForSemiProductService | CompanySellingFacilitiesForSemiProductService;

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

  // Output stock order form fields
  showGrade = false;
  showExportLotNumber = false;
  showPricePerUnit = false;
  showScreenSize = false;
  showLotLabel = false;
  showStartOfDrying = false;
  showClientName = false;
  showCertificatesIds = false;
  showTransactionType = false;
  showFlavourProfile = false;

  remainingForm = new FormControl(null);

  constructor(
    private route: ActivatedRoute,
    private stockOrderController: StockOrderControllerService,
    private procActionController: ProcessingActionControllerService,
    private facilityController: FacilityControllerService,
    private semiProductsController: SemiProductControllerService,
    private companyController: CompanyControllerService,
    private authService: AuthService,
    private codebookTranslations: CodebookTranslations,
    public actionTypesCodebook: ActionTypesService
  ) { }

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
      if (this.actionType === 'SHIPMENT' && this.outputStockOrderForm) {
        return this.outputStockOrderForm.get('inputTransactions').value;
      }

      return this.processingOrderInputTransactions ? this.processingOrderInputTransactions : [];
    }
    return [];
  }

  get inputStockOrders() {
    if (this.update) {
      if (this.actionType === 'SHIPMENT' && this.outputStockOrderForm) { return this.outputStockOrderForm.get('inputOrders').value; }
      return this.processingOrderInputOrders ? this.processingOrderInputOrders : [];
    }
    return [];
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
      const val = form.value as ChainProductOrder;
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
    return $localize`:@@productLabelStockProcessingOrderDetail.textinput.outputQuantityLabelWithUnits.label: Output quantity in ${ 
      this.prAction ? this.codebookTranslations.translate(this.prAction.outputSemiProduct.apiMeasureUnitType, 'label') : '' }`;
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
    if (this.actionType !== 'PROCESSING') { return false; }
    return !this.prAction.repackedOutputs;
  }

  get invalidOutputQuantity() {
    return this.showTotalQuantityForm && !this.totalQuantity;
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

  ngOnInit(): void {

    this.initInitialData().then(
      async (resp: any) => {

        await this.generateCompanyDetailForm();
        this.activeProcessingCodebook = new CompanyProcessingActionsService(this.procActionController, this.companyId, this.codebookTranslations);

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

          // TODO: correct this when new API for Company customers is available
          // if (this.actionType === 'SHIPMENT') {
          //   this.companyCustomerCodebook = new ActiveCompanyCustomersByOrganizationService(this.chainCompanyCustomerService, this.organizationId);
          // }
        }

        if (this.update) {
          this.updateProcessingOrder();
        } else {
          this.newProcessingOrder();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
        const respProcAction = await this.procActionController.getProcessingActionUsingGET(actionId).pipe(take(1)).toPromise();
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

      // TODO: initialize data for update proc. action

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

    // TODO: check if this is needed
    // Inject transaction form for easier validation purposes
    // this.outputStockOrderForm.setControl('form', this.form);
    // this.outputStockOrderForm.setControl('remainingForm', this.remainingForm);
    // this.outputStockOrderForm.setControl('processingActionForm', this.processingActionForm);

    this.initializeListManager();

    if (this.prAction) {
      this.setRequiredFields(this.prAction);
      this.initializeClientName().then();
    }
  }

  private updateProcessingOrder() {
    // TODO: implement update of proc. order
  }

  private async defineInputAndOutputSemiProduct(event: ApiProcessingAction) {

    if (event.inputSemiProduct && event.inputSemiProduct.id) {
      const resInSP = await this.semiProductsController.getSemiProductUsingGET(event.inputSemiProduct.id).pipe(take(1)).toPromise();
      if (resInSP && resInSP.status === 'OK') { this.currentInputSemiProduct = resInSP.data; }
    }

    if (event.outputSemiProduct && event.outputSemiProduct.id) {
      const resOutSP = await this.semiProductsController.getSemiProductUsingGET(event.outputSemiProduct.id).pipe(take(1)).toPromise();
      if (resOutSP && resOutSP.status === 'OK') {
        this.currentOutputSemiProduct = resOutSP.data;
        this.currentOutputSemiProductNameForm.setValue(this.translateName(this.currentOutputSemiProduct));
      }
    }
  }

  private async setRequiredProcessingEvidence(action: ApiProcessingAction) {

    // TODO: implement initialization for processing evidence types
    // (this.requiredProcessingEvidenceArray as FormArray).clear();
    // if (action && action.requiredDocTypeIds) {
    //   let types: ChainProcessingEvidenceType[] = [];
    //   if (action.requiredDocTypes) { types = action.requiredDocTypes; }
    //   else {
    //     for (const id of action.requiredDocTypeIds) {
    //       const res = await this.processingEvidenceTypeService.getProcessingEvidenceTypeUsingGET(Number(id)).pipe(take(1)).toPromise();
    //       if (res && res.status === 'OK' && res.data) {
    //         types.push(res.data as any); // FIXME: check this after other entities are migrated
    //       }
    //     }
    //   }
    //   if (types.length > 0) {
    //     const validationConditions: DocTypeIdsWithRequired[] = action.requiredDocTypeIdsWithRequired || [];
    //     for (const act of types) {
    //       const item = validationConditions.find(x => x.processingEvidenceTypeId === dbKey(act));
    //       this.requiredProcessingEvidenceArray.push(new FormGroup({
    //         date: new FormControl(this.calcToday(), item && item.required ? Validators.required : null),
    //         type: new FormControl(this.documentRequestFromProcessingEvidence(act)),
    //         // type_label: new FormControl(act.label),
    //         // type_id: new FormControl(act.id),
    //         // type__id: new FormControl(dbKey(act)),
    //         document: new FormControl(null, item && item.required ? Validators.required : null)
    //       }));
    //     }
    //   }
    // } else {
    //   (this.requiredProcessingEvidenceArray as FormArray).clear();
    // }
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

    // First clear all fields
    this.showGrade = false;
    this.showExportLotNumber = false;
    this.showPricePerUnit = false;
    this.showScreenSize = false;
    this.showLotLabel = false;
    this.showStartOfDrying = false;
    this.showClientName = false;
    this.showCertificatesIds = false;
    this.showTransactionType = false;
    this.showFlavourProfile = false;

    // Clear all validators
    this.outputStockOrderForm.controls.gradeAbbreviation.clearValidators();
    this.outputStockOrderForm.controls.gradeAbbreviation.updateValueAndValidity();

    this.outputStockOrderForm.controls.lotNumber.clearValidators();
    this.outputStockOrderForm.controls.lotNumber.updateValueAndValidity();

    this.outputStockOrderForm.controls.pricePerUnit.clearValidators();
    this.outputStockOrderForm.controls.pricePerUnit.updateValueAndValidity();

    this.outputStockOrderForm.controls.screenSize.clearValidators();
    this.outputStockOrderForm.controls.screenSize.updateValueAndValidity();

    this.outputStockOrderForm.controls.actionType.clearValidators();
    this.outputStockOrderForm.controls.actionType.updateValueAndValidity();

    if (this.actionType === 'PROCESSING' && !this.prAction.repackedOutputs) {
      setTimeout(() => this.outputStockOrderForm.get('totalQuantity').setValidators([Validators.required]));
    }

    // Set fields specifically to the
    // TODO: rethink this and modify accordingly
    // if (action && action.requiredFields) {
    //   for (const item of action.requiredFields) {
    //
    //     if (item.label === 'CERTIFICATES_IDS') {
    //       if (!this.outputStockOrderForm.get('certificates').value || this.outputStockOrderForm.get('certificates').value.length === 0) {
    //         const formArrayCD = this.companyDetailForm.get('certifications') as FormArray;
    //         const formArrayOSO = this.outputStockOrderForm.get('certificates') as FormArray;
    //         const now = new Date();
    //         for (const cd of formArrayCD.controls) {
    //           const validity = new Date(cd.value.validity);
    //           if (validity > now) {
    //             formArrayOSO.push(cd);
    //           }
    //         }
    //       }
    //       this.initializeCertificationListManager();
    //       this.showCertificatesIds = true;
    //     }
    //
    //     if (item.label === 'PREFILL_OUTPUT_FACILITY') {
    //       if (!this.update) {
    //         this.prefillOutputFacility();
    //       }
    //     }
    //   }
    // }
  }

  private clearCBAndValues() {
    this.availableStockOrders = [];
    this.selectedInputStockOrders = [];
    this.cbSelectAllForm.setValue(false);
  }

  private clearOutputForm() {

    this.form.get('outputQuantity').setValue(null);

    this.outputStockOrderForm.get('totalQuantity').setValue(null);
    this.outputStockOrderForm.get('gradeAbbreviation').setValue(null);
    this.outputStockOrderForm.get('actionType').setValue(null);
    this.outputStockOrderForm.get('pricePerUnit').setValue(null);
    this.outputStockOrderForm.get('lotNumber').setValue(null);
    this.outputStockOrderForm.get('lotLabel').setValue(null);
    this.outputStockOrderForm.get('screenSize').setValue(null);
    this.outputStockOrderForm.get('startOfDrying').setValue(null);
    this.outputStockOrderForm.get('flavourProfile').setValue(null);
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
    // this.inputFacilitiesCodebook = new ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService,
    // this.organizationId, 'EMPTY', this.codebookTranslations);
  }

  private clearOutput() {
    this.clearOutputFacilityForm();
    this.clearOutputForm();
    // this.outputFacilitiesCodebook = new ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService,
    // this.organizationId, 'EMPTY', this.codebookTranslations);
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
          inputQuantity += tx.outputQuantity;
        }
      }

    } else {
      for (const item of this.availableStockOrders) {
        inputQuantity += item.selectedQuantity ? item.selectedQuantity : 0;
      }
    }

    if (setValue) {
      if (this.actionType === 'PROCESSING') {
        this.form.get('outputQuantity').setValue(inputQuantity);
        if (!this.update) {
          this.setInputOutputFormAccordinglyToTransaction();
        }
        if (this.isUsingInput) {
          this.outputStockOrderForm.get('totalQuantity').setValue(inputQuantity);
        }
      } else {
        if (this.form) { this.form.get('outputQuantity').setValue(inputQuantity); }
      }
    }

    return inputQuantity;
  }

  private initializeFacilitiesCodebooks() {

    // If we have defined input semi-product, set input facility
    if (this.prAction.inputSemiProduct && this.prAction.inputSemiProduct.id) {
      if (this.actionType === 'SHIPMENT') {
        this.inputFacilitiesCodebook =
          new CompanySellingFacilitiesForSemiProductService(this.facilityController, this.companyId, this.prAction.inputSemiProduct.id);
      } else {
        this.inputFacilitiesCodebook =
          new CompanyFacilitiesForSemiProductService(this.facilityController, this.companyId, this.prAction.inputSemiProduct.id);
      }
    } else {
      this.inputFacilitiesCodebook = new FacilitiesCodebookService(this.facilityController, this.codebookTranslations);
    }

    // If we have defined output semi-product, set output facility
    if (this.prAction.outputSemiProduct && this.prAction.outputSemiProduct.id) {
      this.outputFacilitiesCodebook =
        new CompanyFacilitiesForSemiProductService(this.facilityController, this.companyId, this.prAction.outputSemiProduct.id);
    } else {
      this.outputFacilitiesCodebook = new FacilitiesCodebookService(this.facilityController, this.codebookTranslations);
    }
  }

  private initializeListManager() {
    // TODO: initialize list manager for processing evidence types
    // this.processingEvidenceListManager = new ListEditorManager<ChainActivityProof>(
    //   this.otherProcessingEvidenceArray as FormArray,
    //   ProductLabelStockProcessingOrderDetailComponent.ChainActivityProofEmptyObjectFormFactory(),
    //   ApiActivityProofValidationScheme
    // );
  }

  private async initializeClientName() {

    // TODO: recheck this because it connects to associated companies through the product
    // if (this.prAction.requiredFields) {
    //   const cname = this.prAction.requiredFields.find(x => x.label === 'CLIENT_NAME');
    //   if (!cname) { return; }
    //   const form = this.outputStockOrderForm.get('clientId');
    //   if (!form || !form.value) { return; }
    //   const candidates = await this.associatedCompaniesService.getAllCandidates().pipe(take(1)).toPromise();
    //   const val = candidates.find(x => x.company.id === form.value);
    //   if (val) {
    //     form.setValue(val);
    //   } else {
    //     form.setValue(null);
    //   }
    // }
  }

  private setInputOutputFormAccordinglyToTransaction() {

    // Prevent recalculating sac numbers if something already entered.
    if (this.outputStockOrders && this.outputStockOrders.length > 0) {
      if ((this.outputStockOrders.value).some(item => item.sacNumber || item.totalQuantity)) { return; }
    }

    (this.outputStockOrders as FormArray).clear();

    if (this.prAction && this.actionType === 'PROCESSING') {

      if (this.prAction.repackedOutputs && this.prAction.maxOutputWeight > 0) {

        let avQua = 0;
        for (const item of this.selectedInputStockOrders) {
          avQua += item.availableQuantity;
        }

        const outputStockOrdersSize = Math.ceil(avQua / this.prAction.maxOutputWeight);
        for (let i = 0; i < outputStockOrdersSize; i++) {
          let w = this.prAction.maxOutputWeight;
          if (i === outputStockOrdersSize - 1) { w = avQua - i * this.prAction.maxOutputWeight; }
          (this.outputStockOrders as FormArray).push(new FormGroup({
            identifier: new FormControl(null),
            id: new FormControl(null),
            totalQuantity: new FormControl(null, Validators.max(this.prAction.maxOutputWeight)),
            sacNumber: new FormControl(null, [Validators.required])
          }));
        }
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
    if (res && res.status === StatusEnum.OK && res.data) {
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

    if (this.actionType === 'SHIPMENT') {
      (this.outputStockOrderForm.get('inputTransactions') as FormArray).removeAt(i);
      this.calcInputQuantity(true);
      return;
    }

    if (this.actionType === 'PROCESSING') {
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

}
