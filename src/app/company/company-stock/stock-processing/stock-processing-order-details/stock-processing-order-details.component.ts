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
import { dateISOString, defaultEmptyObject, generateFormFromMetadata } from '../../../../../shared/utils';
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
import ApiTransactionStatus = ApiTransaction.StatusEnum;
import TypeEnum = ApiProcessingAction.TypeEnum;
import { ApiProcessingOrderValidationScheme } from './validation';
import { ApiStockOrderValidationScheme } from '../stock-processing-order-details-old/validation';
import OrderTypeEnum = ApiStockOrder.OrderTypeEnum;
import { ApiStockOrderEvidenceFieldValue } from '../../../../../api/model/apiStockOrderEvidenceFieldValue';
import { ApiProcessingEvidenceField } from '../../../../../api/model/apiProcessingEvidenceField';
import ProcessingEvidenceField = ApiProcessingEvidenceField.TypeEnum;

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

  // Processing evidence controls
  requiredProcessingEvidenceArray = new FormArray([]);
  otherProcessingEvidenceArray = new FormArray([]);
  processingEvidenceListManager = null;

  submitted = false;
  editing = false;

  saveInProgress = false;

  // List for holding references to observable subscriptions
  subscriptions: Subscription[] = [];

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

  get isClipOrder(): boolean {
    // FIXME: refactor this
    // return !!this.checkboxClipOrderFrom.value;
    return true;
  }

  get totalOutputQuantity() {
    return this.totalOutputQuantityControl.value ? parseFloat(this.totalOutputQuantityControl.value) : 0;
  }

  private get companyId(): number {
    return this.companyProfile.id;
  }

  private get inputTransactionsArray(): FormArray {
    return this.procOrderGroup.get('inputTransactions') as FormArray;
  }

  private get targetStockOrdersArray(): FormArray {
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

  ngOnInit(): void {

    // Register value change listeners for input controls
    this.registerInternalLotSearchValueChangeListener();

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
  }

  async processingActionUpdated(procAction: ApiProcessingAction) {

    this.setRequiredProcessingEvidence(procAction).then();
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

    if (!this.editing) {
      // this.prefillOutputFacility();
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
    // TODO: implement
    this.submitted = true;
    console.log('Proc order: ', this.procOrderGroup);
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

      if (this.isClipOrder) {
        // FIXME: refactor this
        // this.clipOrder(true);
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

      if (this.actionType === 'SHIPMENT' && this.isClipOrder) {
        if (toFill > 0 && currentAvailable > 0) {
          this.availableInputStockOrders[index].selected = true;
          this.availableInputStockOrders[index].selectedQuantity = toFill < currentAvailable ? toFill : currentAvailable;
        } else {
          this.availableInputStockOrders[index].selected = true;
          this.availableInputStockOrders[index].selectedQuantity = 0;

          this.availableInputStockOrders[index].selected = false;
          this.calcInputQuantity(true);
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

  addNewOutput() {

    // If no processing action is selected, exit
    if (!this.selectedProcAction) {
      return;
    }

    // Validate if we can add new output
    switch (this.actionType) {
      case 'TRANSFER':
        // If Processing action type is 'TRANSFER' exit (these are handled differently)
        return;
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
    this.setRequiredFieldsForTSO(targetStockOrderGroup);

    this.targetStockOrdersArray.push(targetStockOrderGroup);
  }

  private registerInternalLotSearchValueChangeListener() {
    this.subscriptions.push(
      this.internalLotNameSearchControl.valueChanges
        .pipe(debounceTime(350))
        .subscribe(() => this.dateSearch())
    );
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
    }

    // Initialize the Processing order group using the fetched data
    this.prepareEditingProcOrderGroup(respProcessingOrder.data);
    await this.processingActionUpdated(respProcessingOrder.data.processingAction);

    // Calculate and set the total output and total input quantity
    this.calcTotalOutputQuantity();
    this.calcInputQuantity(true);

    // Set required fields for every target Stock order
    this.targetStockOrdersArray.controls.forEach(tso => this.setRequiredFieldsForTSO(tso as FormGroup));
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

    // FIXME: refactor this
    // If there is only one appropriate output facility select it
    // this.subscriptions.push(this.outputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
    //   if (val && val.length === 1 && !this.update) { this.outputFacilityForm.setValue(val[0]); }
    // }));
  }

  private initializeFacilitiesCodebooks() {

    const inputSemiProductId = this.selectedProcAction.inputSemiProduct?.id;
    const inputFinalProductId = this.selectedProcAction.inputFinalProduct?.id;

    // FIXME: refactor this
    // const outputSemiProductId = this.prAction.outputSemiProduct?.id;
    // const outputFinalProductId = this.prAction.outputFinalProduct?.id;

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

    // If there is output semi-product or output final product set, initialize output facility codebook
    // FIXME: refactor this
    // if (outputSemiProductId || outputFinalProductId) {
    //   if (this.actionType === 'SHIPMENT') {
    //     this.outputFacilitiesCodebook =
    //         new CompanyFacilitiesForStockUnitProductService(this.facilityController, this.companyId, outputSemiProductId, outputFinalProductId, supportedFacilitiesIds);
    //   } else {
    //     this.outputFacilitiesCodebook =
    //         new CompanyFacilitiesForStockUnitProductService(this.facilityController, this.companyId, outputSemiProductId, outputFinalProductId);
    //   }
    // }
  }

  private async defineInputAndOutputStockUnits(procAction: ApiProcessingAction) {

    let inputSemiProduct: ApiSemiProduct;
    // let outputSemiProduct: ApiSemiProduct;

    let inputFinalProduct: ApiFinalProduct;
    let outputFinalProduct: ApiFinalProduct;

    // If input semi-product is set, get its definition
    if (procAction.inputSemiProduct && procAction.inputSemiProduct.id) {
      const resInSP = await this.semiProductsController.getSemiProductUsingGET(procAction.inputSemiProduct.id).pipe(take(1)).toPromise();
      inputSemiProduct = resInSP && resInSP.status === 'OK' ? resInSP.data : null;
    }

    // If we have defined input semi-product, get its definition
    // FIXME: refactor this
    // if (event.outputSemiProduct && event.outputSemiProduct.id) {
    //   const resOutSP = await this.semiProductsController.getSemiProductUsingGET(event.outputSemiProduct.id).pipe(take(1)).toPromise();
    //   outputSemiProduct = resOutSP && resOutSP.status === 'OK' ? resOutSP.data : null;
    // }

    // If input final product is provided get its definition
    if (procAction.inputFinalProduct && procAction.inputFinalProduct.id) {
      const resInFP = await this.productController
        .getFinalProductUsingGET(procAction.inputFinalProduct.product.id, procAction.inputFinalProduct.id).pipe(take(1)).toPromise();
      inputFinalProduct = resInFP && resInFP.status === 'OK' ? resInFP.data : null;
    }

    // If output final product is provided get its definition
    if (procAction.outputFinalProduct && procAction.outputFinalProduct.id) {
      const resOutFP = await this.productController
        .getFinalProductUsingGET(procAction.outputFinalProduct.product.id, procAction.outputFinalProduct.id).pipe(take(1)).toPromise();
      outputFinalProduct = resOutFP && resOutFP.status === 'OK' ? resOutFP.data : null;
    }

    switch (procAction.type) {
      case ApiProcessingAction.TypeEnum.PROCESSING:
      case ApiProcessingAction.TypeEnum.GENERATEQRCODE:

        this.currentInputStockUnit = inputSemiProduct;
        // this.currentOutputStockUnitProduct = outputSemiProduct;
        // this.currentOutputStockUnitNameForm.setValue(outputSemiProduct ? outputSemiProduct.name : null);
        break;

      case ApiProcessingAction.TypeEnum.FINALPROCESSING:

        this.currentInputStockUnit = inputSemiProduct;
        // this.currentOutputStockUnitProduct = outputFinalProduct;
        // this.currentOutputStockUnitNameForm
        //     .setValue(outputFinalProduct ? `${outputFinalProduct.name} (${outputFinalProduct.product.name})` : null);
        break;

      case ApiProcessingAction.TypeEnum.TRANSFER:
      case ApiProcessingAction.TypeEnum.SHIPMENT:

        // Is it a final product only involvement
        if (procAction.finalProductAction) {

          this.currentInputStockUnit = inputFinalProduct;
          // this.currentOutputStockUnitProduct = outputFinalProduct;
          // this.currentOutputStockUnitNameForm
          //     .setValue(outputFinalProduct ? `${outputFinalProduct.name} (${outputFinalProduct.product.name})` : null);

        } else {

          this.currentInputStockUnit = inputSemiProduct;
          // this.currentOutputStockUnitProduct = outputSemiProduct;
          // this.currentOutputStockUnitNameForm.setValue(outputSemiProduct ? outputSemiProduct.name : null);
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

  private initProcEvidenceListManager() {

    this.processingEvidenceListManager = new ListEditorManager<ApiActivityProof>(
      this.otherProcessingEvidenceArray as FormArray,
      StockProcessingOrderDetailsComponent.ApiActivityProofEmptyObjectFormFactory(),
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

    // Clear the target Stock orders form array and push Stock orders as Form groups with a specific validation scheme
    this.targetStockOrdersArray.clear();
    processingOrder.targetStockOrders.forEach(tso => {
      this.targetStockOrdersArray.push(generateFormFromMetadata(ApiStockOrder.formMetadata(), tso, ApiStockOrderValidationScheme));
    });
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

    // Add new initial output
    this.addNewOutput();
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

    if (inputQuantity != null) {
      const remainingQuantity = inputQuantity - outputQuantity;
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
    (this.targetStockOrdersArray.value as ApiStockOrder[]).forEach(tso => {

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

  private setRequiredFieldsForTSO(targetStockOrderGroup: FormGroup) {

    // Set validator on total quantity
    if ((this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING') && !this.selectedProcAction.repackedOutputs) {
      setTimeout(() => targetStockOrderGroup.get('totalQuantity').setValidators([Validators.required]));
    }

    // Clear the required fields form
    const requiredProcEvidenceFieldGroup = new FormGroup({});

    // Set required fields form group
    const evidenceFieldsValues: ApiStockOrderEvidenceFieldValue[] =
      targetStockOrderGroup.get('requiredEvidenceFieldValues')?.value ?
        targetStockOrderGroup.get('requiredEvidenceFieldValues').value : [];

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

    targetStockOrderGroup.setControl('requiredProcEvidenceFieldGroup', requiredProcEvidenceFieldGroup);
  }

}
