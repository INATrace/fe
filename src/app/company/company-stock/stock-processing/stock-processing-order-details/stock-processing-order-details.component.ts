import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyProcessingActionsService } from '../../../../shared-services/company-processing-actions.service';
import { ProcessingActionControllerService } from '../../../../../api/api/processingActionController.service';
import { CodebookTranslations } from '../../../../shared-services/codebook-translations';
import { ApiProcessingAction } from '../../../../../api/model/apiProcessingAction';
import { ProcessingActionType } from '../../../../../shared/types';
import { Location } from '@angular/common';
import { ListEditorManager } from '../../../../shared/list-editor/list-editor-manager';
import { ApiActivityProof } from '../../../../../api/model/apiActivityProof';
import { ApiActivityProofValidationScheme } from '../../stock-core/additional-proof-item/validation';
import { dateISOString, deleteNullFields, generateFormFromMetadata } from '../../../../../shared/utils';
import { CompanyFacilitiesForStockUnitProductService } from '../../../../shared-services/company-facilities-for-stock-unit-product.service';
import { AvailableSellingFacilitiesForCompany } from '../../../../shared-services/available-selling-facilities-for.company';
import { ApiFacility } from '../../../../../api/model/apiFacility';
import { GetAvailableStockForStockUnitInFacilityUsingGET, StockOrderControllerService } from '../../../../../api/api/stockOrderController.service';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { Subscription } from 'rxjs';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { debounceTime, map, take } from 'rxjs/operators';
import { faCut, faFemale, faLeaf, faQrcode, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ApiSemiProduct } from '../../../../../api/model/apiSemiProduct';
import { ApiFinalProduct } from '../../../../../api/model/apiFinalProduct';
import { SemiProductControllerService } from '../../../../../api/api/semiProductController.service';
import { ProductControllerService } from '../../../../../api/api/productController.service';
import { ApiStockOrderSelectable } from './stock-processing-order-details.model';
import { GenerateQRCodeModalComponent } from '../../../../components/generate-qr-code-modal/generate-qr-code-modal.component';
import { NgbModalImproved } from '../../../../core/ngb-modal-improved/ngb-modal-improved.service';
import { ClipInputTransactionModalComponent } from './clip-input-transaction-modal/clip-input-transaction-modal.component';
import { ClipInputTransactionModalResult } from './clip-input-transaction-modal/model';
import { ApiTransaction } from '../../../../../api/model/apiTransaction';
import { ApiCompanyGet } from '../../../../../api/model/apiCompanyGet';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';
import { AuthService } from '../../../../core/auth.service';
import { ProcessingOrderControllerService } from '../../../../../api/api/processingOrderController.service';
import { ApiProcessingOrder } from '../../../../../api/model/apiProcessingOrder';
import { ApiProcessingOrderValidationScheme, ApiStockOrderValidationScheme } from './validation';
import { ApiStockOrderEvidenceFieldValue } from '../../../../../api/model/apiStockOrderEvidenceFieldValue';
import { ApiProcessingEvidenceField } from '../../../../../api/model/apiProcessingEvidenceField';
import { StaticSemiProductsService } from './static-semi-products.service';
import { StockProcessingOrderDetailsHelper } from './stock-processing-order-details.helper';
import ApiTransactionStatus = ApiTransaction.StatusEnum;
import TypeEnum = ApiProcessingAction.TypeEnum;
import ProcessingEvidenceField = ApiProcessingEvidenceField.TypeEnum;
import StatusEnum = ApiTransaction.StatusEnum;
import OrderTypeEnum = ApiStockOrder.OrderTypeEnum;

type PageMode = 'create' | 'edit';

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

  // Holds the ID of the current user that is doing the processing
  processingUserId: number;

  // Holds the current company profile which executes the processing action
  companyProfile: ApiCompanyGet;

  // Holds the input facility ID provided as path param in the route (can be null)
  facilityIdPathParam: number | null = null;

  // Properties and controls used for display and selection of processing action
  procActionsCodebook: CompanyProcessingActionsService;
  procActionLotPrefixControl = new FormControl({ value: null, disabled: true });
  qrCodeForFinalProductControl = new FormControl({ value: null, disabled: true });

  // Properties and controls used for display and selection of input facility
  selectedInputFacility: ApiFacility = null;
  inputFacilitiesCodebook: CompanyFacilitiesForStockUnitProductService | AvailableSellingFacilitiesForCompany;
  inputFacilityControl = new FormControl(null, Validators.required);

  // Input stock orders filter controls
  dateFromFilterControl = new FormControl(null);
  dateToFilterControl = new FormControl(null);
  internalLotNameSearchControl = new FormControl(null);
  womenOnlyFilterControl = new FormControl(null);
  organicOnlyFilterControl = new FormControl(null);

  // Input stock orders properties and controls
  availableInputStockOrders: ApiStockOrderSelectable[] = [];
  selectedInputStockOrders: ApiStockOrderSelectable[] = [];
  organicOnlyInputStockOrders = false;
  womenOnlyInputStockOrders = false;
  cbSelectAllControl = new FormControl(false);
  totalInputQuantityControl = new FormControl({ value: null, disabled: true });
  remainingQuantityControl = new FormControl({ value: null, disabled: true });

  // Input stock unit (Semi-product or Final product)
  currentInputStockUnit: ApiSemiProduct | ApiFinalProduct;

  // Processing order properties (the Processing order connects the input transactions with the target - to be created Stock orders)
  procOrderGroup: FormGroup;

  // Output stock orders properties and controls
  totalOutputQuantityControl = new FormControl({ value: null, disabled: true });
  commentsControl = new FormControl(null);
  private totalOutQuantityRangeLow: number = null;
  private totalOutQuantityRangeHigh: number = null;

  // Repacked output stock orders
  repackedOutputStockOrdersArray = new FormArray([]);

  // Properties and controls for displaying output final-product and output semi-product
  finalProductOutputFacilitiesCodebook: CompanyFacilitiesForStockUnitProductService;
  currentOutputFinalProduct: ApiFinalProduct;
  outputFinalProductNameControl = new FormControl({ value: null, disabled: true });

  outputSemiProductsCodebook: StaticSemiProductsService;
  semiProductOutputFacilitiesCodebooks: Map<number, CompanyFacilitiesForStockUnitProductService>;

  // Processing evidence controls
  requiredProcessingEvidenceArray = new FormArray([]);
  otherProcessingEvidenceArray = new FormArray([]);
  processingEvidenceListManager = null;

  submitted = false;
  editing = false;

  saveInProgress = false;

  // List for holding references to observable subscriptions
  subscriptions: Subscription[] = [];
  repackedOutQuantitySubscription: Subscription;

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
    private codebookTranslations: CodebookTranslations,
    private companyController: CompanyControllerService,
    private authService: AuthService,
    private modalService: NgbModalImproved
  ) { }

  get selectedProcAction(): ApiProcessingAction {
    return this.procOrderGroup?.get('processingAction')?.value as ApiProcessingAction ?? null;
  }

  get actionType(): ProcessingActionType {
    return this.selectedProcAction ? this.selectedProcAction.type : null;
  }

  get leftSideEnabled() {
    const facility = this.inputFacilityControl.value as ApiFacility;
    if (!facility) { return true; }
    if (!this.editing) { return true; }
    return this.companyId === facility.company?.id;
  }

  get rightSideEnabled(): boolean {

    if (this.targetStockOrdersArray.length > 0) {
      const tso = this.targetStockOrdersArray.at(0).value as ApiStockOrder;
      if (!tso.facility) {
        return true;
      }
      return this.companyId === tso.facility.company?.id;
    }

    return true;
  }

  get disabledLeftFields() {
    const facility = this.inputFacilityControl.value as ApiFacility;
    return !facility || facility.company?.id !== this.companyId;
  }

  get womenOnlyStatusValue() {
    if (this.womenOnlyFilterControl.value != null) {
      if (this.womenOnlyFilterControl.value) { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.womenCoffee:Women coffee`; }
      else { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.nonWomenCoffee:Non-women coffee`; }
    }
    return null;
  }

  get organicOnlyStatusValue() {
    if (this.organicOnlyFilterControl.value != null) {
      if (this.organicOnlyFilterControl.value) {
        return $localize`:@@productLabelStockProcessingOrderDetail.organicOnlyStatus.organicCoffee:Organic coffee`;
      } else {
        return $localize`:@@productLabelStockProcessingOrderDetail.organicOnlyStatus.nonOrganicCoffee:Non-organic coffee`;
      }
    }
  }

  get oneInputStockOrderRequired() {

    if (this.actionType === 'SHIPMENT') { return false; }

    const existingInputTRCount = this.inputTransactions ? this.inputTransactions.length : 0;
    const selectedInputSOCount = this.selectedInputStockOrders ? this.selectedInputStockOrders.length : 0;

    return existingInputTRCount + selectedInputSOCount === 0;
  }

  get inputTransactions(): ApiTransaction[] {
    return this.inputTransactionsArray.value ? this.inputTransactionsArray.value : [];
  }

  get totalOutputQuantity() {
    return this.totalOutputQuantityControl.value ? parseFloat(this.totalOutputQuantityControl.value) : 0;
  }

  get totalInputQuantity() {
    return this.totalInputQuantityControl.value ? parseFloat(this.totalInputQuantityControl.value) : 0;
  }

  get totalOutputQuantityTooLarge() {

    if (this.actionType === 'SHIPMENT' || this.totalInputQuantityControl.value == null) {
      return false;
    }

    return this.totalOutputQuantity > this.totalInputQuantity;
  }

  get outputQuantityNotInRange() {

    if (this.actionType !== 'PROCESSING' || !this.selectedProcAction?.estimatedOutputQuantityPerUnit ||
        !this.totalOutQuantityRangeLow || !this.totalOutQuantityRangeHigh) {
      return false;
    }

    if (!this.totalOutputQuantity) {
      return false;
    }

    if (!(this.totalOutputQuantity >= this.totalOutQuantityRangeLow && this.totalOutputQuantity <= this.totalOutQuantityRangeHigh)) {
      return true;
    }
  }

  get notAllOutputQuantityIsUsed() {

    if (!this.selectedProcAction?.repackedOutputs) {
      return false;
    }

    const enteredOutputQuantity = this.targetStockOrdersArray.at(0).get('totalQuantity').value;
    if (!enteredOutputQuantity) {
      return false;
    }

    let repackedSOQuantity = 0;
    this.repackedOutputStockOrdersArray.controls.forEach((soGroup: FormGroup) => {
      repackedSOQuantity += soGroup.get('totalQuantity').value ? Number(soGroup.get('totalQuantity').value) : 0;
    });

    return Number(enteredOutputQuantity) > repackedSOQuantity;
  }

  get expectedOutputQuantityHelpText() {

    if (this.actionType !== 'PROCESSING' || !this.selectedProcAction?.estimatedOutputQuantityPerUnit) {
      return null;
    }

    let quantityFrom = '/';
    let quantityTo = '/';

    if (this.totalInputQuantity) {

      let expectedOutputQuantity;
      expectedOutputQuantity = this.totalInputQuantity * this.selectedProcAction.estimatedOutputQuantityPerUnit;

      this.totalOutQuantityRangeLow = Number(expectedOutputQuantity * 0.8);
      this.totalOutQuantityRangeHigh = Math.min(Number(expectedOutputQuantity * 1.2), this.totalInputQuantity);

      quantityFrom = this.totalOutQuantityRangeLow.toFixed(2);
      quantityTo = this.totalOutQuantityRangeHigh.toFixed(2);
    } else {

      this.totalOutQuantityRangeLow = null;
      this.totalOutQuantityRangeHigh = null;
    }

    return $localize`:@@productLabelStockProcessingOrderDetail.textinput.outputQuantity.expectedOutputHelpText:Expected output quantity range:` +
        ` ${quantityFrom} ~ ${quantityTo} (${this.currentInputStockUnit.measurementUnitType.label})`;
  }

  get targetStockOrdersArray(): FormArray {
    return this.procOrderGroup.get('targetStockOrders') as FormArray;
  }

  get productOrderId(): string | null {

    if (this.targetStockOrdersArray.length > 0) {
      const so = this.targetStockOrdersArray.at(0).value as ApiStockOrder;
      return so.productOrder?.orderId ?? null;
    }

    return null;
  }

  get quoteOrderOwnerCompany(): string | null {

    if (this.targetStockOrdersArray.length > 0) {
      const so = this.targetStockOrdersArray.at(0).value as ApiStockOrder;
      return so.facility?.company?.name;
    }

    return null;
  }

  get inputQuantityLabel() {
    return $localize`:@@productLabelStockProcessingOrderDetail.textinput.inputQuantityLabelWithUnits.label: Input quantity in ${
      this.currentInputStockUnit ? this.codebookTranslations.translate(this.currentInputStockUnit.measurementUnitType, 'label') : ''
    }`;
  }

  get remainingQuantityLabel() {
    return $localize`:@@productLabelStockProcessingOrderDetail.textinput.remainingQuantityLabelWithUnits.label: Remaining quantity in ${
      this.currentInputStockUnit ? this.codebookTranslations.translate(this.currentInputStockUnit.measurementUnitType, 'label') : ''
    }`;
  }

  get totalOutputQuantityLabel() {
    return $localize`:@@productLabelStockProcessingOrderDetail.textinput.totalOutputQuantityLabelWithUnits.label: Total output quantity in ${
      this.currentInputStockUnit ? this.codebookTranslations.translate(this.currentInputStockUnit.measurementUnitType, 'label') : ''
    }`;
  }

  get targetStockOrderOutputQuantityLabel() {
    return $localize`:@@productLabelStockProcessingOrderDetail.textinput.outputQuantityLabelWithUnits.label: Output quantity in`;
  }

  get showAddNewOutputButton() {
    return this.actionType === 'PROCESSING' && !this.selectedProcAction.repackedOutputs;
  }

  get sacQuantityLabel() {

    let unit = '';
    if (this.selectedProcAction.outputFinalProduct) {
      unit = this.selectedProcAction.outputFinalProduct.measurementUnitType.label;
    } else if (this.selectedProcAction.outputSemiProducts?.length > 0) {
      unit = this.selectedProcAction.outputSemiProducts[0].measurementUnitType.label;
    }

    return $localize`:@@productLabelStockProcessingOrderDetail.itemNetWeightLabel: Quantity (max. ${ this.selectedProcAction.maxOutputWeight } ${ unit })`;
  }

  private get companyId(): number {
    return this.companyProfile.id;
  }

  private get inputTransactionsArray(): FormArray {
    return this.procOrderGroup.get('inputTransactions') as FormArray;
  }

  ngOnInit(): void {

    // Register value change listeners for input controls
    this.registerInternalLotSearchValueChangeListener();
    this.registerInputFacilityValueChangeListener();

    // Start loading of data and prepare form groups
    this.globalEventsManager.showLoading(true);
    this.initializeData().then(
      async () => this.globalEventsManager.showLoading(false),
      reason => {
        this.globalEventsManager.showLoading(false);
        throw reason;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());

    if (this.repackedOutQuantitySubscription) {
      this.repackedOutQuantitySubscription.unsubscribe();
    }
  }

  async processingActionUpdated(procAction: ApiProcessingAction) {

    this.submitted = false;

    StockProcessingOrderDetailsHelper.setRequiredProcessingEvidence(procAction, this.requiredProcessingEvidenceArray).then();
    this.clearInputPropsAndControls();
    this.clearInputFacility();
    this.clearOutputPropsAndControls();

    if (procAction) {

      // Set the LOT prefix for the selected Processing action
      this.procActionLotPrefixControl.setValue(procAction.prefix);

      // If we have Processing action for generating QR code, set the final product form
      if (procAction && procAction.type === 'GENERATE_QR_CODE' && procAction.qrCodeForFinalProduct) {
        this.qrCodeForFinalProductControl
          .setValue(`${ procAction.qrCodeForFinalProduct.name } (${ procAction.qrCodeForFinalProduct.product.name })`);
      }

      await this.defineInputAndOutputStockUnits(procAction);

      // Load and the facilities that are applicable for the processing action
      await this.loadFacilities();

      // Set the page title depending on the page mode and the Processing action type
      this.updatePageTitle();

      // Add new initial output (if not in edit mode)
      if (!this.editing) {
        this.addNewOutput().then(() => this.registerRepackedOutQuantityVCListener());
      }

    } else {

      this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTitle:Add action`;

      this.procActionLotPrefixControl.reset();
      this.qrCodeForFinalProductControl.reset();
    }
  }

  async setInputFacility(facility: ApiFacility) {

    this.clearInputPropsAndControls();

    if (facility) {
      this.selectedInputFacility = facility;

      const requestParams: GetAvailableStockForStockUnitInFacilityUsingGET.PartialParamMap = {
        limit: 500,
        offset: 0,
        facilityId: facility.id,
        semiProductId: this.selectedProcAction.inputSemiProduct?.id,
        finalProductId: this.selectedProcAction.inputFinalProduct?.id
      };

      this.availableInputStockOrders = await this.fetchAvailableStockOrders(requestParams);
    } else {
      this.clearInputFacility();
    }

    if (this.disabledLeftFields) {
      this.cbSelectAllControl.disable();
    } else {
      this.cbSelectAllControl.enable();
    }
  }

  async setWomenOnlyStatus(status: boolean) {
    if (!this.leftSideEnabled) {
      return;
    }

    this.womenOnlyFilterControl.setValue(status);
    if (this.selectedInputFacility) {
      this.dateSearch().then();
    }
  }

  async setOrganicOnlyStatus(organicOnly: boolean) {
    if (!this.leftSideEnabled) {
      return;
    }

    this.organicOnlyFilterControl.setValue(organicOnly);
    if (this.selectedInputFacility) {
      this.dateSearch().then();
    }
  }

  async saveProcessingOrder() {

    console.log('Proc. order form group: ', this.procOrderGroup);
    console.log('One input stock order required: ', this.oneInputStockOrderRequired);
    console.log('Not all output quantity is used: ', this.notAllOutputQuantityIsUsed);

    if (this.saveInProgress) {
      return;
    }

    this.submitted = true;

    if (this.procOrderGroup.invalid || this.oneInputStockOrderRequired || this.notAllOutputQuantityIsUsed) {
      return;
    }

    this.saveInProgress = true;
    this.globalEventsManager.showLoading(true);
    try {

      // Get the raw value from the form group
      const processingOrder = this.procOrderGroup.getRawValue() as ApiProcessingOrder;

      // Create input transactions from the selected Stock orders
      processingOrder.inputTransactions.push(...this.prepInputTransactionsFromStockOrders());

      // If we have 'TRANSFER' order, the target Stock order present is just temporary (holds entered info)
      // We need to create the actual target Stock orders from the selected input Stock orders
      if (this.actionType === 'TRANSFER') {
        processingOrder.targetStockOrders = this.prepareTransferTargetStockOrders(processingOrder.targetStockOrders[0]);
      } else if (this.selectedProcAction.repackedOutputs) {

        // If we have processing with repacking, the target Stock order present is just temporary (holds entered info)
        // We have to create the actual target Stock orders from the generated repacked output stock orders (repackedOutputStockOrdersArray)
        processingOrder.targetStockOrders = this.prepareRepackedTargetStockOrders(processingOrder.targetStockOrders[0]);
      }

      // Add common shared data (processing evidences, comments, etc.) to all target output Stock order
      this.enrichTargetStockOrders(processingOrder.targetStockOrders);

      const res = await this.processingOrderController
        .createOrUpdateProcessingOrderUsingPUT(processingOrder).pipe(take(1)).toPromise();

      if (!res || res.status !== 'OK') {
        throw Error('Error while creating processing order for order type: ' + this.actionType);
      } else {
        this.dismiss();
      }

    } finally {
      this.saveInProgress = false;
      this.globalEventsManager.showLoading(false);
    }
  }

  dismiss() {
    this.location.back();
  }

  async dateSearch() {

    if (!this.leftSideEnabled) { return; }
    if (!this.selectedInputFacility) { return; }

    const from = this.dateFromFilterControl.value;
    const to = this.dateToFilterControl.value;

    // Prepare initial request params
    const requestParams: GetAvailableStockForStockUnitInFacilityUsingGET.PartialParamMap = {
      limit: 500,
      offset: 0,
      facilityId: this.selectedInputFacility.id,
      semiProductId: this.selectedProcAction.inputSemiProduct?.id,
      finalProductId: this.selectedProcAction.inputFinalProduct?.id,
      isWomenShare: this.womenOnlyFilterControl.value,
      organicOnly: this.organicOnlyFilterControl.value,
      internalLotName: this.internalLotNameSearchControl.value
    };

    // Prepare date filters
    if (from && to) {
      requestParams.productionDateStart = dateISOString(from);
      requestParams.productionDateEnd = dateISOString(to);
    } else if (from) {
      requestParams.productionDateStart = dateISOString(from);
    } else if (to) {
      requestParams.productionDateEnd = dateISOString(to);
    }

    // Get the available stock in the provided facility for the provided semi-product
    this.availableInputStockOrders = await this.fetchAvailableStockOrders(requestParams);

    // Reinitialize selections
    const tmpSelected = [];
    for (const item of this.availableInputStockOrders) {
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

  cbSelectAllClick() {

    if (!this.leftSideEnabled) { return; }
    if (this.disabledLeftFields) { return; }

    if (this.cbSelectAllControl.value) {

      this.selectedInputStockOrders = [];
      for (const item of this.availableInputStockOrders) {
        this.selectedInputStockOrders.push(item);
      }

      this.availableInputStockOrders.map(item => { item.selected = true; item.selectedQuantity = item.availableQuantity; return item; });

      if (this.actionType === 'SHIPMENT') {
        this.clipInputQuantity();
      }

    } else {

      this.selectedInputStockOrders = [];
      this.availableInputStockOrders.map(item => { item.selected = false; item.selectedQuantity = 0; return item; });
    }

    this.calcInputQuantity(true);
    this.setOrganicAndWomenOnly();
  }

  cbSelectClick(stockOrder: ApiStockOrderSelectable, index: number) {

    if (!this.leftSideEnabled) { return; }

    if (this.cbSelectAllControl.value) {
      this.cbSelectAllControl.setValue(false);
    }

    if (!this.availableInputStockOrders[index].selected) {

      const outputQuantity = this.totalOutputQuantity as number || 0;
      const inputQuantity = this.calcInputQuantity(false);

      const toFill = Number((outputQuantity - inputQuantity).toFixed(2));

      const currentAvailable = this.availableInputStockOrders[index].availableQuantity;

      if (this.actionType === 'SHIPMENT') {

        // In case of 'SHIPMENT' we always clip the input quantity
        if (toFill > 0 && currentAvailable > 0) {
          this.availableInputStockOrders[index].selected = true;
          this.availableInputStockOrders[index].selectedQuantity = toFill < currentAvailable ? toFill : currentAvailable;
        } else {

          // We have to set first to true due tu change detection in checkbox component
          this.availableInputStockOrders[index].selected = true;
          this.availableInputStockOrders[index].selectedQuantity = 0;
          setTimeout(() => this.availableInputStockOrders[index].selected = false);
        }
      } else {
        this.availableInputStockOrders[index].selected = true;
        this.availableInputStockOrders[index].selectedQuantity = currentAvailable;
      }
    } else {
      this.availableInputStockOrders[index].selected = false;
      this.availableInputStockOrders[index].selectedQuantity = 0;
    }

    this.selectInputStockOrder(stockOrder);
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
      qrCodeTag: order.qrCodeTag,
      qrCodeFinalProduct: order.qrCodeTagFinalProduct
    });
  }

  async clipInputTransaction(item: ApiStockOrderSelectable, index: number) {

    if (!this.leftSideEnabled) { return; }

    const modalRef = this.modalService.open(ClipInputTransactionModalComponent, { centered: true, keyboard: false, backdrop: 'static' });
    Object.assign(modalRef.componentInstance, {
      stockOrder: item,
      currentSelectedQuantity: this.availableInputStockOrders[index].selectedQuantity
    });

    const result: ClipInputTransactionModalResult = await modalRef.result;
    if (!result) {
      return;
    }

    if (result.selectedQuantity > 0) {

      // If this transaction was not selected, trigger selection
      if (!this.availableInputStockOrders[index].selected) {
        this.selectInputStockOrder(item);
      }

      this.availableInputStockOrders[index].selected = true;
      this.availableInputStockOrders[index].selectedQuantity = result.selectedQuantity;
    } else {

      // If this transaction was selected, trigger unselect
      if (this.availableInputStockOrders[index].selected) {
        this.selectInputStockOrder(item);
      }

      this.availableInputStockOrders[index].selected = false;
      this.availableInputStockOrders[index].selectedQuantity = 0;
    }

    this.calcInputQuantity(true);
  }

  deleteTransaction(i: number) {

    if (!this.leftSideEnabled) { return; }

    switch (this.actionType) {
      case 'PROCESSING':
      case 'FINAL_PROCESSING':
      case 'GENERATE_QR_CODE':
      case 'SHIPMENT':
        this.inputTransactionsArray.removeAt(i);
        this.calcInputQuantity(true);
        break;
      case 'TRANSFER':
        this.inputTransactionsArray.removeAt(i);
        this.targetStockOrdersArray.removeAt(i);
        this.calcInputQuantity(true);
    }
  }

  async addNewOutput() {

    // If no processing action is selected, exit
    if (!this.selectedProcAction) {
      return;
    }

    // Validate if we can add new output
    switch (this.actionType) {
      case 'TRANSFER':
      case 'SHIPMENT':
      case 'GENERATE_QR_CODE':
      case 'FINAL_PROCESSING':
        // If we already have one target Stock order, exit
        if (this.targetStockOrdersArray.length > 0) {
          return;
        }
    }

    // Create a default Stock order with common shared values
    const defaultStockOrder: ApiStockOrder = {
      creatorId: this.processingUserId,
      orderType: this.actionType === 'SHIPMENT' ? OrderTypeEnum.GENERALORDER : OrderTypeEnum.PROCESSINGORDER,
      productionDate: dateISOString(new Date())
    };

    const targetStockOrderGroup = generateFormFromMetadata(ApiStockOrder.formMetadata(), defaultStockOrder, ApiStockOrderValidationScheme);
    this.targetStockOrdersArray.push(targetStockOrderGroup);

    this.setRequiredFieldsAndListenersForTSO(targetStockOrderGroup);

    // If we have defined output final product, set it the target Stock order form group
    if (this.currentOutputFinalProduct) {
      targetStockOrderGroup.get('finalProduct').setValue(this.currentOutputFinalProduct);

      // If there is only one facility available for the output final product, set it in the target Stock order form group
      const facilities = await this.finalProductOutputFacilitiesCodebook.getAllCandidates().toPromise();
      if (facilities?.length === 1) {
        targetStockOrderGroup.get('facility').setValue(facilities[0]);
      }

    } else if (this.selectedProcAction.outputSemiProducts?.length === 1) {

      // If we have output semi-products, and there is only one defined in the Processing action, set it automatically
      targetStockOrderGroup.get('semiProduct').setValue(this.selectedProcAction.outputSemiProducts[0]);
    }
  }

  removeOutput(index: number) {
    this.targetStockOrdersArray.removeAt(index);
    this.calcTotalOutputQuantity();
    this.calcRemainingQuantity();
  }

  getOutputFacilityCodebook(tsoGroup: FormGroup): CompanyFacilitiesForStockUnitProductService | null {

    if (this.finalProductOutputFacilitiesCodebook) {
      return this.finalProductOutputFacilitiesCodebook;
    }

    const semiProduct = (tsoGroup.get('semiProduct').value as ApiSemiProduct);
    if (semiProduct) {
      return this.semiProductOutputFacilitiesCodebooks.get(semiProduct.id);
    }

    return null;
  }

  prefillRepackedOutputSOQuantities() {

    let availableQua = this.targetStockOrdersArray.at(0).get('totalQuantity').value;
    const maxAllowedWeight = this.selectedProcAction.maxOutputWeight;

    this.repackedOutputStockOrdersArray.controls.some((outputStockOrderGroup: FormGroup) => {
      outputStockOrderGroup.get('totalQuantity').setValue(Number(availableQua > maxAllowedWeight ? maxAllowedWeight : availableQua).toFixed(2));
      availableQua -= maxAllowedWeight;
      if (availableQua <= 0) {
        return true;
      }
    });
  }

  addRepackedOutputStockOrder() {

    let sacNumber = null;
    if (this.repackedOutputStockOrdersArray.length > 0) {
      const lastSacNumber = Number(this.repackedOutputStockOrdersArray.controls[this.repackedOutputStockOrdersArray.length - 1].get('sacNumber').value);
      if (lastSacNumber && lastSacNumber > 0) {
        sacNumber = lastSacNumber + 1;
      }
    }

    this.repackedOutputStockOrdersArray.push(this.prepareRepackedSOFormGroup(sacNumber));
  }

  removeRepackedOutputStockOrder(index) {
    this.repackedOutputStockOrdersArray.removeAt(index);
  }

  private registerInternalLotSearchValueChangeListener() {
    this.subscriptions.push(
      this.internalLotNameSearchControl.valueChanges
        .pipe(debounceTime(350))
        .subscribe(() => this.dateSearch())
    );
  }

  private registerInputFacilityValueChangeListener() {
    this.subscriptions.push(
      this.inputFacilityControl.valueChanges.subscribe((facility: ApiFacility) => {

        // If we are creating new Quote order, set the quoteFacility when input facility is selected
        if (!this.editing && this.actionType === 'SHIPMENT' && this.targetStockOrdersArray?.length > 0) {
          this.targetStockOrdersArray.at(0).get('quoteFacility').setValue(facility);
        }
    })
    );
  }

  private registerRepackedOutQuantityVCListener() {

    if (this.repackedOutQuantitySubscription) {
      this.repackedOutQuantitySubscription.unsubscribe();
      this.repackedOutQuantitySubscription = null;
    }

    // When the total output quantity changes we need to re/generate the output stock order that are
    // being repacked as part of this processing; This is only applicable when we have Processing action
    // that has selected the option 'repackedOutputs' and set 'maxOutputWeight'
    if (this.selectedProcAction.repackedOutputs && this.selectedProcAction.maxOutputWeight > 0) {
      this.repackedOutQuantitySubscription = this.targetStockOrdersArray.at(0).get('totalQuantity').valueChanges
        .pipe(debounceTime(300))
        .subscribe((totalQuantity: number) => this.generateRepackedOutputStockOrders(totalQuantity));
    }
  }

  private async initializeData() {

    // Get the page mode
    const pageMode = this.route.snapshot.data.mode as PageMode;
    if (!pageMode) {
      return;
    }

    // Load and set current user that is doing the processing
    this.loadProcessingUser();

    // Get the current user selected company from the local storage and load company profile
    await this.loadCompanyProfile();

    // Initialize list managers
    this.initProcEvidenceListManager();

    // Initialize the processing actions codebook
    this.procActionsCodebook =
      new CompanyProcessingActionsService(this.procActionController, this.companyId, this.codebookTranslations);

    if (pageMode === 'create') {

      this.editing = false;
      this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTitle:Add action`;

      // Initialize the Processing order form group
      this.prepareNewProcOrderGroup();

      // Get the processing action ID from the route (this is user to load the Processing action)
      const procActionIdPathParam = this.route.snapshot.params.procActionId;

      // If the path param is not 'NEW' means that we are provided with Processing action ID (load the Processing action with this ID)
      if (procActionIdPathParam !== 'NEW') {
        this.facilityIdPathParam = Number(this.route.snapshot.params.inputFacilityId);
        await this.loadProcessingAction(procActionIdPathParam);
      }

    } else if (pageMode === 'edit') {

      this.editing = true;

      // Load the processing order that we are editing
      await this.loadProcessingOrder();

    } else {
      throw Error('Unsupported page mode.');
    }

    // Depending on the page mode set some form controls as disabled
    this.setFormControlsDisabledState();
  }

  private loadProcessingUser() {
    this.authService.userProfile$.pipe(take(1)).toPromise().then(profile => this.processingUserId = profile.id);
  }

  private async loadCompanyProfile() {

    const companyId = Number(localStorage.getItem('selectedUserCompany'));
    const res = await this.companyController.getCompanyUsingGET(companyId).pipe(take(1)).toPromise();
    if (res && 'OK' === res.status && res.data) {
      this.companyProfile = res.data;
    } else {
      throw Error('Cannot get company profile.');
    }
  }

  private async loadProcessingAction(procActionId: number) {

    const respProcAction = await this.procActionController.getProcessingActionUsingGET(procActionId)
      .pipe(take(1)).toPromise();
    if (respProcAction && respProcAction.status === 'OK' && respProcAction.data) {
      this.procOrderGroup.get('processingAction').setValue(respProcAction.data);
      await this.processingActionUpdated(respProcAction.data);
    }
  }

  private async loadProcessingOrder() {

    // First get the Stock order ID provided in route (we fetch the Processing order using the Stock order ID)
    const stockOrderId = this.route.snapshot.params.stockOrderId as string;
    if (!stockOrderId) { throw Error('No Stock order ID in path!'); }

    // Get the Processing order for the Stock order with the provided ID
    const respProcessingOrder = await this.stockOrderController.getStockOrderProcessingOrderUsingGET(Number(stockOrderId))
        .pipe(take(1)).toPromise();

    if (!respProcessingOrder || respProcessingOrder.status !== 'OK') {
      throw new Error('Cannot retrieve the processing order!');
    } else if (respProcessingOrder.data.targetStockOrders?.length === 0) {
      throw new Error('Processing order does not contain any target Stock orders!');
    }

    // Initialize the Processing order group using the fetched data
    this.prepareEditingProcOrderGroup(respProcessingOrder.data);
    await this.processingActionUpdated(respProcessingOrder.data.processingAction);

    // After Processing order and Processing action are loaded and initialized, set the existing evidence documents
    const firstTSO = this.targetStockOrdersArray.at(0) as FormGroup;
    StockProcessingOrderDetailsHelper.loadExistingOtherEvidenceDocuments(firstTSO, this.otherProcessingEvidenceArray);
    StockProcessingOrderDetailsHelper.loadExistingRequiredEvidenceDocuments(firstTSO, this.requiredProcessingEvidenceArray);

    // Calculate and set the total output and total input quantity
    this.calcTotalOutputQuantity();
    this.calcInputQuantity(true);

    // Set required fields for every target Stock order
    this.targetStockOrdersArray.controls.forEach(tso => this.setRequiredFieldsAndListenersForTSO(tso as FormGroup));
  }

  private async loadFacilities() {

    // With the data provided from the Processing action, initialize the facilities codebook services (for input and output facilities)
    this.initializeFacilitiesCodebooks();

    if (this.editing) {

      // If Processing action type is 'SHIPMENT' - Quote order, set the input facility from the quote facility set in the target Stock order
      if (this.selectedProcAction.type === TypeEnum.SHIPMENT) {

        const quoteFacility = this.targetStockOrdersArray.value[0].quoteFacility;
        this.inputFacilityControl.setValue(quoteFacility);
        await this.setInputFacility(this.inputFacilityControl.value);
      } else {

        // In the other case, we set the input facility from the sourceFacility in the first input transaction
        const sourceFacility = this.inputTransactions[0].sourceFacility;
        this.inputFacilityControl.setValue(sourceFacility);
        await this.setInputFacility(this.inputFacilityControl.value);
      }

    } else {

      // Get all the applicable facilities
      const facilities = await this.inputFacilitiesCodebook.getAllCandidates().toPromise();

      // If facility ID is provided in path, set that facility if applicable
      if (this.facilityIdPathParam != null) {

        // Find the facility with the provided ID and set it
        const facility = facilities.find(f => f.id === this.facilityIdPathParam);
        if (facility) {
          this.inputFacilityControl.setValue(facility);
          await this.setInputFacility(this.inputFacilityControl.value);
          return;
        }
      }

      if (facilities && facilities.length === 1) {
        this.inputFacilityControl.setValue(facilities[0]);
        await this.setInputFacility(this.inputFacilityControl.value);
      }
    }
  }

  private initializeFacilitiesCodebooks() {

    // Reset the hashmap that's holding the facilities codebooks per output semi-product and also reset the
    // codebook for the output final product facility
    this.semiProductOutputFacilitiesCodebooks = null;
    this.finalProductOutputFacilitiesCodebook = null;

    const inputSemiProductId = this.selectedProcAction.inputSemiProduct?.id;
    const inputFinalProductId = this.selectedProcAction.inputFinalProduct?.id;

    const outputFinalProductId = this.currentOutputFinalProduct?.id;

    let supportedFacilitiesIds: number[] | undefined;
    if (this.selectedProcAction.supportedFacilities?.length > 0) {
      supportedFacilitiesIds = this.selectedProcAction.supportedFacilities.map(f => f.id);
    }

    // If there is input semi-product or input final product set, initialize input facility codebook
    if (inputSemiProductId || inputFinalProductId) {

      // If we have shipment action (quote processing action), get the selling facilities that the current company can order from
      if (this.actionType === 'SHIPMENT') {
        this.inputFacilitiesCodebook =
          new AvailableSellingFacilitiesForCompany(this.facilityController, this.companyId, inputSemiProductId, inputFinalProductId);
      } else {
        this.inputFacilitiesCodebook =
          new CompanyFacilitiesForStockUnitProductService(this.facilityController, this.companyId, inputSemiProductId, inputFinalProductId, supportedFacilitiesIds);
      }
    }

    // If there is output final product set, initialize output facility codebook for this output final product
    if (outputFinalProductId) {
      if (this.actionType === 'SHIPMENT') {
        this.finalProductOutputFacilitiesCodebook =
            new CompanyFacilitiesForStockUnitProductService(this.facilityController, this.companyId, undefined, outputFinalProductId, supportedFacilitiesIds);
      } else {
        this.finalProductOutputFacilitiesCodebook =
            new CompanyFacilitiesForStockUnitProductService(this.facilityController, this.companyId, undefined, outputFinalProductId);
      }
    }

    // If the selected Processing action has defined output semi-product, we need to create facility codebook instance per semi-product
    if (this.selectedProcAction.outputSemiProducts?.length > 0) {

      this.semiProductOutputFacilitiesCodebooks = new Map<number, CompanyFacilitiesForStockUnitProductService>();
      this.selectedProcAction.outputSemiProducts.forEach(osp => {
        let facilityCodebook;
        if (this.actionType === 'SHIPMENT') {
          facilityCodebook = new CompanyFacilitiesForStockUnitProductService(this.facilityController,
            this.companyId, osp.id, undefined, supportedFacilitiesIds);
        } else {
          facilityCodebook = new CompanyFacilitiesForStockUnitProductService(this.facilityController,
            this.companyId, osp.id);
        }

        this.semiProductOutputFacilitiesCodebooks.set(osp.id, facilityCodebook);
      });
    }
  }

  private async defineInputAndOutputStockUnits(procAction: ApiProcessingAction) {

    // Reset the current output final product
    this.currentOutputFinalProduct = null;
    this.outputFinalProductNameControl.reset();

    // Reset the output semi products codebook service
    this.outputSemiProductsCodebook = null;

    switch (procAction.type) {
      case ApiProcessingAction.TypeEnum.PROCESSING:
      case ApiProcessingAction.TypeEnum.GENERATEQRCODE:

        this.currentInputStockUnit = procAction.inputSemiProduct;
        this.outputSemiProductsCodebook = new StaticSemiProductsService(procAction.outputSemiProducts);
        break;

      case ApiProcessingAction.TypeEnum.FINALPROCESSING:

        this.currentInputStockUnit = procAction.inputSemiProduct;
        this.currentOutputFinalProduct = procAction.outputFinalProduct;
        this.outputFinalProductNameControl
            .setValue(this.currentOutputFinalProduct ? `${this.currentOutputFinalProduct.name} (${this.currentOutputFinalProduct.product.name})` : null);
        break;

      case ApiProcessingAction.TypeEnum.TRANSFER:
      case ApiProcessingAction.TypeEnum.SHIPMENT:

        // Is it a final product only involvement
        if (procAction.finalProductAction) {

          this.currentInputStockUnit = procAction.inputFinalProduct;
          this.currentOutputFinalProduct = procAction.outputFinalProduct;
          this.outputFinalProductNameControl
              .setValue(this.currentOutputFinalProduct ? `${this.currentOutputFinalProduct.name} (${this.currentOutputFinalProduct.product.name})` : null);

        } else {

          this.currentInputStockUnit = procAction.inputSemiProduct;
          this.outputSemiProductsCodebook = new StaticSemiProductsService(procAction.outputSemiProducts);
        }
    }
  }

  private initProcEvidenceListManager() {

    this.processingEvidenceListManager = new ListEditorManager<ApiActivityProof>(
      this.otherProcessingEvidenceArray,
      StockProcessingOrderDetailsHelper.ApiActivityProofEmptyObjectFormFactory(),
      ApiActivityProofValidationScheme
    );
  }

  private prepareNewProcOrderGroup() {

    this.procOrderGroup =
      generateFormFromMetadata(ApiProcessingOrder.formMetadata(), {}, ApiProcessingOrderValidationScheme);

    // Set values for common controls
    this.procOrderGroup.get('initiatorUserId').setValue(this.processingUserId);
    this.procOrderGroup.get('processingDate').setValue(dateISOString(new Date()));
  }

  private prepareEditingProcOrderGroup(processingOrder: ApiProcessingOrder) {

    this.procOrderGroup =
      generateFormFromMetadata(ApiProcessingOrder.formMetadata(), processingOrder, ApiProcessingOrderValidationScheme);

    if (processingOrder.processingAction?.repackedOutputs) {

      this.targetStockOrdersArray.clear();
      this.repackedOutputStockOrdersArray.clear();

      const firstTSO = processingOrder.targetStockOrders[0];
      this.commentsControl.setValue(firstTSO.comments);

      // Set the first Stock order as a target Stock order in the target Stock orders array
      this.targetStockOrdersArray.push(generateFormFromMetadata(ApiStockOrder.formMetadata(), firstTSO, ApiStockOrderValidationScheme));

      // Add all the repacked Stock orders as repacked output stock order in the repackedOutputStockOrdersArray
      let totalOutputQuantity = 0;
      processingOrder.targetStockOrders.forEach(tso => {

        const repackedStockOrder = generateFormFromMetadata(ApiStockOrder.formMetadata(), tso, ApiStockOrderValidationScheme);
        repackedStockOrder.get('totalQuantity').setValidators([Validators.required, Validators.max(this.selectedProcAction.maxOutputWeight)]);
        repackedStockOrder.get('sacNumber').setValidators([Validators.required]);

        this.repackedOutputStockOrdersArray.push(repackedStockOrder);
        totalOutputQuantity += tso.totalQuantity;
      });

      // Set the total output quantity (calculated above) to the target Stock order
      this.targetStockOrdersArray.at(0).get('totalQuantity').setValue(totalOutputQuantity);

      const lastSlashIndex = firstTSO.internalLotNumber.lastIndexOf('/');
      if (lastSlashIndex !== -1) {
        this.targetStockOrdersArray.at(0).get('internalLotNumber').setValue(firstTSO.internalLotNumber.substring(0, lastSlashIndex));
      }

    } else {

      // Clear the target Stock orders form array and push Stock orders as Form groups with a specific validation scheme
      this.targetStockOrdersArray.clear();
      processingOrder.targetStockOrders.forEach((tso, index) => {
        this.targetStockOrdersArray.push(generateFormFromMetadata(ApiStockOrder.formMetadata(), tso, ApiStockOrderValidationScheme));

        // Get the comment content from the first target Stock order (all Stock orders have same comments content)
        if (index === 0) {
          this.commentsControl.setValue(tso.comments);
        }
      });
    }
  }

  private clearInputPropsAndControls() {

    this.dateFromFilterControl.setValue(null);
    this.dateToFilterControl.setValue(null);
    this.internalLotNameSearchControl.setValue(null, { emitEvent: false });

    this.womenOnlyFilterControl.setValue(null);
    this.organicOnlyFilterControl.setValue(null);

    this.availableInputStockOrders = [];
    this.selectedInputStockOrders = [];
    this.cbSelectAllControl.setValue(false);

    this.organicOnlyInputStockOrders = false;
    this.womenOnlyInputStockOrders = false;

    this.totalInputQuantityControl.reset();
    this.remainingQuantityControl.reset();
  }

  private clearOutputPropsAndControls() {

    // If editing existing order exit
    if (this.editing) {
      return;
    }

    // Clear all the target Stock orders
    this.targetStockOrdersArray.clear();

    this.totalOutputQuantityControl.reset();
    this.commentsControl.reset();
  }

  private clearInputFacility() {
    this.selectedInputFacility = null;
    this.inputFacilityControl.setValue(null);
  }

  private async fetchAvailableStockOrders(params: GetAvailableStockForStockUnitInFacilityUsingGET.PartialParamMap): Promise<ApiStockOrder[]> {

    // Final product is defined for 'FINAL_PROCESSING' and Quote or Transfer for a final product
    const finalProduct = this.selectedProcAction.outputFinalProduct;

    return this.stockOrderController
      .getAvailableStockForStockUnitInFacilityUsingGETByMap(params)
      .pipe(
        take(1),
        map(res => {
          if (res && res.status === 'OK' && res.data) {

            // If we are editing existing order, filter the stock orders that are already present in the proc. order
            if (this.editing) {
              const availableStockOrders = res.data.items;
              this.targetStockOrdersArray.value.forEach(tso => {
                const soIndex = availableStockOrders.findIndex(aso => aso.id === tso.id);
                if (soIndex !== -1) {
                  availableStockOrders.splice(soIndex, 1);
                }
              });

              return availableStockOrders;
            }

            return res.data.items;
          } else {
            return [];
          }
        }),
        map(availableStockOrders => {

          // If generating QR code, filter all the stock orders that have already generated QR code tag
          if (this.selectedProcAction.type === 'GENERATE_QR_CODE') {
            return availableStockOrders.filter(apiStockOrder => !apiStockOrder.qrCodeTag);
          } else if (finalProduct) {

            // If final product action (final processing of Quote or Transfer order for a final product)
            // filter the stock orders that have QR code tag for different final products than the selected one (from the Proc. action)
            return availableStockOrders.filter(apiStockOrder => !apiStockOrder.qrCodeTag || apiStockOrder.qrCodeTagFinalProduct.id === finalProduct.id);

          } else {
            return availableStockOrders;
          }
        })
      )
      .toPromise();
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

    this.organicOnlyInputStockOrders = countOrganic === allSelected && allSelected > 0;
    this.womenOnlyInputStockOrders = countWomenShare === allSelected && allSelected > 0;
  }

  private selectInputStockOrder(stockOrder: ApiStockOrderSelectable) {

    const index = this.selectedInputStockOrders.indexOf(stockOrder);
    if (index !== -1) {
      this.selectedInputStockOrders.splice(index, 1);
    } else {
      this.selectedInputStockOrders.push(stockOrder);
    }

    this.calcInputQuantity(true);
    this.setOrganicAndWomenOnly();
  }

  private calcInputQuantity(setValue: boolean) {

    let inputQuantity = 0;
    if (this.editing) {
      for (const item of this.availableInputStockOrders) {
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
      for (const item of this.availableInputStockOrders) {
        inputQuantity += item.selectedQuantity ? item.selectedQuantity : 0;
      }
    }

    // Set total input quantity value
    if (setValue) {

      if (inputQuantity) {
        switch (this.actionType) {
          case 'GENERATE_QR_CODE':
            // If generating QR code, the output is always the same with the input
            this.totalInputQuantityControl.setValue(Number(inputQuantity).toFixed(2));
            this.targetStockOrdersArray.at(0).get('totalQuantity').setValue(Number(inputQuantity).toFixed(2));
            break;
          default:
            this.totalInputQuantityControl.setValue(Number(inputQuantity).toFixed(2));
        }
      } else {
        this.totalInputQuantityControl.reset();
      }

      // Also update the remaining quantity
      this.calcRemainingQuantity();
    }

    return inputQuantity;
  }

  private calcRemainingQuantity() {

    const inputQuantity = this.totalInputQuantityControl.value ? parseFloat(this.totalInputQuantityControl.value) : null;
    const outputQuantity = this.totalOutputQuantity;

    if (this.actionType === 'SHIPMENT') {

      this.remainingQuantityControl.setValue(Number(this.totalOutputQuantity - inputQuantity ?? 0).toFixed(2));
      return;

    } else if (inputQuantity != null) {
      let remainingQuantity = inputQuantity - outputQuantity;
      remainingQuantity = Math.max(0, remainingQuantity);
      this.remainingQuantityControl.setValue(Number(remainingQuantity).toFixed(2));
      return;
    }

    this.remainingQuantityControl.reset();
  }

  /**
   * Calculates the total output quantity normalized in the input measuring unit (from current input stock unit).
   */
  private calcTotalOutputQuantity() {

    let sumInKGs = 0;
    (this.targetStockOrdersArray.getRawValue() as ApiStockOrder[]).forEach(tso => {

      const measuringUnit = tso.measureUnitType;
      const quantityInMeasureUnit = tso.totalQuantity != null ? tso.totalQuantity : null;

      if (measuringUnit != null && quantityInMeasureUnit != null) {

        // Calculate the quantity in KGs
        const quantityInKGs = quantityInMeasureUnit * measuringUnit.weight;
        sumInKGs += quantityInKGs;
      }
    });

    // Convert the sum in the input stock unit measure unit
    if (sumInKGs) {

      const sumInInputMeasureUnit = sumInKGs / this.currentInputStockUnit.measurementUnitType.weight;
      this.totalOutputQuantityControl.setValue(Number(sumInInputMeasureUnit).toFixed(2));
      return;
    }

    this.totalOutputQuantityControl.reset();
  }

  private clipInputQuantity() {

    const outputQuantity = this.totalOutputQuantity;
    let tmpQuantity = 0;

    for (const tx of this.inputTransactions) {
      tmpQuantity += tx.outputQuantity;
    }

    for (const item of this.availableInputStockOrders) {

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

      item.selectedQuantity = Number((outputQuantity - tmpQuantity).toFixed(2));
      tmpQuantity = outputQuantity;
    }

    // Filter all selected Stock orders that are no longer selected (after clipping)
    this.selectedInputStockOrders = this.selectedInputStockOrders.filter(so => so.selected);
  }

  private updatePageTitle() {

    if (!this.editing) {

      this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTitle:Add action`;

      switch (this.actionType) {
        case TypeEnum.SHIPMENT:
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.newShipmentTitle:Add shipment action`;
          break;
        case TypeEnum.TRANSFER:
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTransferTitle:Add transfer action`;
          break;
        case TypeEnum.PROCESSING:
        case TypeEnum.GENERATEQRCODE:
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.newProcessingTitle:Add processing action`;
          break;
        case TypeEnum.FINALPROCESSING:
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.newFinalProcessingTitle:Add final processing action`;
          break;
      }
    } else {

      switch (this.actionType) {
        case TypeEnum.SHIPMENT:
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateShipmentTitle:Update shipment action`;
          break;
        case TypeEnum.TRANSFER:
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateTransferTitle:Update transfer action`;
          break;
        case TypeEnum.PROCESSING:
        case TypeEnum.GENERATEQRCODE:
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateProcessingTitle:Update processing action`;
          break;
        case TypeEnum.FINALPROCESSING:
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateFinalProcessingTitle:Update final processing action`;
          break;
      }
    }
  }

  private setFormControlsDisabledState() {

    if (this.editing) {
      this.procOrderGroup.get('processingAction').disable();
      this.inputFacilityControl.disable();
    }
  }

  private setRequiredFieldsAndListenersForTSO(tsoGroup: FormGroup) {

    // Set validators for specific fields depending on the Processing action type
    switch (this.actionType) {
      case 'PROCESSING':
        StockProcessingOrderDetailsHelper.setFormControlValidators(tsoGroup, 'totalQuantity', [Validators.required]);
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'GENERATE_QR_CODE':
        StockProcessingOrderDetailsHelper.setFormControlValidators(tsoGroup, 'semiProduct', [Validators.required]);
        break;
      case 'SHIPMENT':
        StockProcessingOrderDetailsHelper.setFormControlValidators(tsoGroup, 'totalQuantity', [Validators.required]);
        StockProcessingOrderDetailsHelper.setFormControlValidators(tsoGroup, 'deliveryTime', [Validators.required]);
        StockProcessingOrderDetailsHelper.setFormControlValidators(tsoGroup, 'quoteFacility', [Validators.required]);
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'TRANSFER':
        if (this.selectedProcAction.finalProductAction) {
          StockProcessingOrderDetailsHelper.setFormControlValidators(tsoGroup, 'finalProduct', [Validators.required]);
        } else {
          StockProcessingOrderDetailsHelper.setFormControlValidators(tsoGroup, 'semiProduct', [Validators.required]);
        }
        break;
    }

    StockProcessingOrderDetailsHelper.setFormControlValidators(tsoGroup, 'facility', [Validators.required]);

    // Clear the required fields form
    const requiredProcEvidenceFieldGroup = new FormGroup({});

    // Set required fields form group
    const evidenceFieldsValues: ApiStockOrderEvidenceFieldValue[] =
      tsoGroup.get('requiredEvidenceFieldValues')?.value ?
        tsoGroup.get('requiredEvidenceFieldValues').value : [];

    this.selectedProcAction.requiredEvidenceFields.forEach(field => {

      let value = null;
      const evidenceFieldValue = evidenceFieldsValues
        .find(efv => efv.evidenceFieldId === field.id && efv.evidenceFieldName === field.fieldName);

      if (evidenceFieldValue) {
        switch (field.type) {
          case ProcessingEvidenceField.NUMBER:
          case ProcessingEvidenceField.INTEGER:
          case ProcessingEvidenceField.EXCHANGERATE:
          case ProcessingEvidenceField.PRICE:
            value = evidenceFieldValue.numericValue;
            break;
          case ProcessingEvidenceField.DATE:
          case ProcessingEvidenceField.TIMESTAMP:
            value = evidenceFieldValue.dateValue;
            break;
          case ProcessingEvidenceField.STRING:
          case ProcessingEvidenceField.TEXT:
            value = evidenceFieldValue.stringValue;
            break;
          default:
            value = evidenceFieldValue.stringValue;
        }
      }

      if (field.mandatory) {
        requiredProcEvidenceFieldGroup.addControl(field.fieldName, new FormControl(value, Validators.required));
      } else {
        requiredProcEvidenceFieldGroup.addControl(field.fieldName, new FormControl(value));
      }
    });

    tsoGroup.setControl('requiredProcEvidenceFieldGroup', requiredProcEvidenceFieldGroup);

    // Register value change listeners for specific fields
    this.subscriptions.push(tsoGroup.get('totalQuantity').valueChanges
        .pipe(debounceTime(350))
        .subscribe(() => setTimeout(() => this.targetStockOrderOutputQuantityChange())));

    this.subscriptions.push(tsoGroup.get('finalProduct').valueChanges
        .subscribe((value: ApiFinalProduct | null) => this.targetStockOrderFinalProductChange(value, tsoGroup)));

    this.subscriptions.push(tsoGroup.get('semiProduct').valueChanges
        .subscribe((value: ApiFinalProduct | null) => this.targetStockOrderSemiProductChange(value, tsoGroup)));

    // Set specific fields to default disabled state
    if (!this.editing) {
      tsoGroup.get('totalQuantity').disable({ emitEvent: false });
    }
  }

  private targetStockOrderOutputQuantityChange() {
    this.calcTotalOutputQuantity();
    this.calcRemainingQuantity();
  }

  private targetStockOrderFinalProductChange(finalProduct: ApiFinalProduct | null, targetStockOrderGroup: FormGroup) {
    if (finalProduct) {
      targetStockOrderGroup.get('measureUnitType').setValue(finalProduct.measurementUnitType);
      targetStockOrderGroup.get('totalQuantity').enable({ emitEvent: false });
    } else {
      targetStockOrderGroup.get('measureUnitType').setValue(null);
      targetStockOrderGroup.get('totalQuantity').disable({ emitEvent: false });
    }
    targetStockOrderGroup.get('totalQuantity').setValue(null);
  }

  private targetStockOrderSemiProductChange(semiProduct: ApiSemiProduct | null, targetStockOrderGroup: FormGroup) {

    if (semiProduct) {
      targetStockOrderGroup.get('measureUnitType').setValue(semiProduct.measurementUnitType);
      targetStockOrderGroup.get('totalQuantity').enable({ emitEvent: false });

      // If there is only one facility available for this semi-product set it by default
      const facilitiesCodebook = this.semiProductOutputFacilitiesCodebooks.get(semiProduct.id);
      facilitiesCodebook.getAllCandidates().pipe(take(1)).subscribe(facilities => {
        if (facilities.length === 1) {
          setTimeout(() => {
            targetStockOrderGroup.get('facility').setValue(facilities[0]);
          });
        }
      });

    } else {
      targetStockOrderGroup.get('facility').setValue(null);
      targetStockOrderGroup.get('measureUnitType').setValue(null);
      targetStockOrderGroup.get('totalQuantity').disable({ emitEvent: false });
    }
    targetStockOrderGroup.get('totalQuantity').setValue(null);
  }

  private prepInputTransactionsFromStockOrders(): ApiTransaction[] {

    const inputTransactions: ApiTransaction[] = [];

    // Common computed properties used in every transaction
    const isProcessing = this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING' || this.actionType === 'GENERATE_QR_CODE';
    const status: ApiTransaction.StatusEnum = this.actionType === 'SHIPMENT' ? StatusEnum.PENDING : StatusEnum.EXECUTED;

    for (const stockOrder of this.selectedInputStockOrders) {

      // Create transaction for current stock order from the list of selected stock orders
      const transaction: ApiTransaction = {
        isProcessing,
        company: { id: this.companyId },
        initiationUserId: this.processingUserId,
        sourceStockOrder: stockOrder,
        status,
        inputQuantity: stockOrder.selectedQuantity,
        outputQuantity: stockOrder.selectedQuantity
      };

      inputTransactions.push(transaction);
    }

    return inputTransactions;
  }

  private prepareTransferTargetStockOrders(sourceStockOrder: ApiStockOrder): ApiStockOrder[] {

    const targetStockOrders: ApiStockOrder[] = [];

    for (const [index, selectedStockOrder] of this.selectedInputStockOrders.entries()) {
      const newStockOrder: ApiStockOrder = {
        facility: sourceStockOrder.facility,
        semiProduct: selectedStockOrder.semiProduct,
        finalProduct: selectedStockOrder.finalProduct,
        internalLotNumber: `${sourceStockOrder.internalLotNumber}/${index + 1 + 0}`,
        creatorId: this.processingUserId,
        productionDate: selectedStockOrder.productionDate ? selectedStockOrder.productionDate : (dateISOString(new Date()) as any),
        orderType: OrderTypeEnum.TRANSFERORDER,
        totalQuantity: selectedStockOrder.availableQuantity
      };

      // Set the temporary object that holds the processing evidence fields
      newStockOrder['requiredProcEvidenceFieldGroup'] = sourceStockOrder['requiredProcEvidenceFieldGroup'];

      targetStockOrders.push(newStockOrder);
    }

    return targetStockOrders;
  }

  private prepareRepackedTargetStockOrders(sourceStockOrder: ApiStockOrder): ApiStockOrder[] {

    return this.repackedOutputStockOrdersArray.controls.map((repackedOutputSOGroup: FormGroup) => {

      const newStockOrder = repackedOutputSOGroup.getRawValue() as ApiStockOrder;
      newStockOrder.creatorId = sourceStockOrder.creatorId;
      newStockOrder.internalLotNumber = sourceStockOrder.internalLotNumber;
      newStockOrder.facility = sourceStockOrder.facility;
      newStockOrder.semiProduct = sourceStockOrder.semiProduct;
      newStockOrder.finalProduct = sourceStockOrder.finalProduct;
      newStockOrder.productionDate = sourceStockOrder.productionDate;
      newStockOrder.orderType = OrderTypeEnum.PROCESSINGORDER;

      // Add the injected FormGroup for processing evidence fields
      newStockOrder['requiredProcEvidenceFieldGroup'] = sourceStockOrder['requiredProcEvidenceFieldGroup'];

      return newStockOrder;
    });
  }

  private enrichTargetStockOrders(targetStockOrders: ApiStockOrder[]) {

    // Common computed properties
    const requiredEvidenceTypeValues = StockProcessingOrderDetailsHelper.prepareRequiredEvidenceTypeValues(this.requiredProcessingEvidenceArray);
    const otherEvidenceDocuments = StockProcessingOrderDetailsHelper.prepareOtherEvidenceDocuments(this.otherProcessingEvidenceArray);

    targetStockOrders.forEach(tso => {

      // Set shared properties
      tso.requiredEvidenceTypeValues = requiredEvidenceTypeValues;
      tso.otherEvidenceDocuments = otherEvidenceDocuments;
      tso.comments = this.commentsControl.value;
      tso.fulfilledQuantity = 0;
      tso.availableQuantity = 0;

      // Set specific properties
      tso.requiredEvidenceFieldValues = StockProcessingOrderDetailsHelper.prepareRequiredEvidenceFieldValues(tso['requiredProcEvidenceFieldGroup'], this.selectedProcAction);

      // Delete null and not need properties
      delete tso['requiredProcEvidenceFieldGroup'];
      deleteNullFields(tso);
    });
  }

  private generateRepackedOutputStockOrders(totalOutputQuantity: number): void {

    // If we are updating a processing order, do not regenerate the output stock orders
    if (this.editing) {
      return;
    }

    const maxOutputWeight = this.selectedProcAction.maxOutputWeight;

    this.repackedOutputStockOrdersArray.clear();

    const outputStockOrdersSize = Math.ceil(totalOutputQuantity / maxOutputWeight);
    for (let i = 0; i < outputStockOrdersSize; i++) {
      this.repackedOutputStockOrdersArray.push(this.prepareRepackedSOFormGroup(i + 1));
    }
  }

  private prepareRepackedSOFormGroup(sacNumber: number): FormGroup {

    return new FormGroup({
      id: new FormControl(null),
      totalQuantity: new FormControl(null, [Validators.required, Validators.max(this.selectedProcAction.maxOutputWeight)]),
      sacNumber: new FormControl(sacNumber, [Validators.required])
    });
  }

}
