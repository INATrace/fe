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
import { dateISOString, defaultEmptyObject } from '../../../../../shared/utils';
import { CompanyFacilitiesForStockUnitProductService } from '../../../../shared-services/company-facilities-for-stock-unit-product.service';
import { AvailableSellingFacilitiesForCompany } from '../../../../shared-services/available-selling-facilities-for.company';
import { ApiFacility } from '../../../../../api/model/apiFacility';
import { GetAvailableStockForStockUnitInFacilityUsingGET, StockOrderControllerService } from '../../../../../api/api/stockOrderController.service';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { Subscription } from 'rxjs';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { debounceTime, map, take } from 'rxjs/operators';
import { faTimes, faTrashAlt, faQrcode, faCut, faLeaf, faFemale } from '@fortawesome/free-solid-svg-icons';
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
import ApiTransactionStatus = ApiTransaction.StatusEnum;
import { ApiCompanyGet } from '../../../../../api/model/apiCompanyGet';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';
import { AuthService } from '../../../../core/auth.service';
import { ProcessingOrderControllerService } from '../../../../../api/api/processingOrderController.service';

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
  selectedProcAction: ApiProcessingAction;
  procActionsCodebook: CompanyProcessingActionsService;
  procActionControl = new FormControl(null, Validators.required);
  qrCodeForFinalProductControl = new FormControl(null);

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

  // Input stock unit (Semi-product or Final product)
  currentInputStockUnit: ApiSemiProduct | ApiFinalProduct;

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

  get actionType(): ProcessingActionType {
    return this.selectedProcAction ? this.selectedProcAction.type : null;
  }

  get inputFacility(): ApiFacility {
    return this.inputFacilityControl.value as ApiFacility;
  }

  get leftSideEnabled() {
    const facility = this.inputFacility;
    if (!facility) { return true; }
    if (!this.editing) { return true; }
    return this.companyId === facility.company?.id;
  }

  get rightSideEnabled() {
    // TODO: implement - if quote order and not owner company, return false
    return true;
    // const facility = this.outputFacilityForm.value as ApiFacility;
    // if (!facility) { return true; }
    // return this.companyId === facility.company?.id;
  }

  get disabledLeftFields() {
    return !this.inputFacility || this.inputFacility.company?.id !== this.companyId;
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

    const inTRCount = this.inputTransactions ? this.inputTransactions.length : 0;
    const selTRCount = this.selectedInputStockOrders ? this.selectedInputStockOrders.length : 0;

    return inTRCount + selTRCount === 0;
  }

  get inputTransactions(): ApiTransaction[] {

    if (this.editing) {
      // FIXME: refactor this
      // return this.processingOrderInputTransactions ? this.processingOrderInputTransactions : [];
    }
    return [];
  }

  get inputStockOrders(): ApiStockOrder[] {

    if (this.editing) {
      // FIXME: refactor this
      // return this.processingOrderInputOrders ? this.processingOrderInputOrders : [];
    }
    return [] as ApiStockOrder[];
  }

  get isClipOrder(): boolean {
    // FIXME: refactor this
    // return !!this.checkboxClipOrderFrom.value;
    return true;
  }

  get totalQuantity() {
    // FIXME: refactor this
    // return this.outputStockOrderForm.getRawValue().totalQuantity;
    return 0;
  }

  private get companyId(): number {
    return this.companyProfile.id;
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

  async setProcessingAction(procAction: ApiProcessingAction) {

    this.procActionControl.setValue(procAction);
    this.selectedProcAction = procAction;
    this.setRequiredProcessingEvidence(procAction).then();
    this.clearInputPropsAndControls();
    this.clearInputFacility();
    // this.clearOutput();

    if (procAction) {

      // With the data provided from the Processing action, initialize the facilities codebook services (for input and output facilities)
      this.initializeFacilitiesCodebooks();

      // If there is only one appropriate input facility selected it
      this.subscriptions.push(this.inputFacilitiesCodebook.getAllCandidates().subscribe((facilitates) => {

        // If facility ID is provided in path, set that facility if applicable
        if (this.facilityIdPathParam != null) {

          // Find the facility with the provided ID and set it
          const facility = facilitates.find(f => f.id === this.facilityIdPathParam);
          if (facility) {
            this.inputFacilityControl.setValue(facility);
            this.setInputFacility(this.inputFacilityControl.value);
            return;
          }
        }

        if (facilitates && facilitates.length === 1) {
          this.inputFacilityControl.setValue(facilitates[0]);
          this.setInputFacility(this.inputFacilityControl.value);
        }
      }));

      // FIXME: refactor this
      // If there is only one appropriate output facility select it
      // this.subscriptions.push(this.outputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
      //   if (val && val.length === 1 && !this.update) { this.outputFacilityForm.setValue(val[0]); }
      // }));

      this.defineInputAndOutputStockUnits(procAction).then();
      // this.setRequiredFields(event);

      if (!this.editing) {
        this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTitle:Add action`;
        if (this.selectedProcAction.type === 'SHIPMENT') {
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.newShipmentTitle:Add shipment action`;
        }
        if (this.selectedProcAction.type === 'TRANSFER') {
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTransferTitle:Add transfer action`;
        }
        if (this.selectedProcAction.type === 'PROCESSING') {
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.newProcessingTitle:Add processing action`;
        }
        if (this.selectedProcAction.type === 'FINAL_PROCESSING') {
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.newFinalProcessingTitle:Add final processing action`;
        }
      }
    } else {

      // this.setRequiredFields(null);
      this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTitle:Add action`;
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
  }

  dismiss() {
    this.location.back();
  }

  async dateSearch() {

    if (!this.leftSideEnabled) { return; }
    const from = this.dateFromFilterControl.value;
    const to = this.dateToFilterControl.value;
    if (!this.selectedInputFacility) { return; }

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

      const outputQuantity = this.totalQuantity as number || 0;
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

    // FIXME: refactor this
    // if (this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING' || this.actionType === 'SHIPMENT' || this.actionType === 'GENERATE_QR_CODE') {
    //   this.processingOrderInputTransactions.splice(i, 1);
    //   this.calcInputQuantity(true);
    //   return;
    // }
    //
    // if (this.actionType === 'TRANSFER') {
    //   this.processingOrderInputTransactions.splice(i, 1);
    //   this.editableProcessingOrder.targetStockOrders.splice(i, 1);
    //   this.calcInputQuantity(true);
    // }
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

      // TODO: handle update case

    } else {
      throw Error('Unsupported page mode.');
    }
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
      await this.setProcessingAction(respProcAction.data);

      // FIXME: refactor this
      // this.processingActionLotPrefixForm.setValue(this.prAction.prefix);
    }
  }

  private async loadProcessingOrder() {

    // First get the Stock order ID provided in route (we fetch the Processing order using the Stock order ID)
    const stockOrderId = this.route.snapshot.params.stockOrderId as string;
    if (!stockOrderId) { throw Error('No Stock order ID in path!'); }

    // FIXME: add new API endpoint for fetching Proc. order using Stock order ID
    // Get the Processing order with the provided ID
    const respProcessingOrder = await this.processingOrderController.getProcessingOrderUsingGET(Number(stockOrderId))
      .pipe(take(1)).toPromise();

    if (!respProcessingOrder || respProcessingOrder.status !== 'OK') {
      throw new Error('Cannot retrieve the processing order!');
    }

    console.log('Proc order: ', respProcessingOrder.data);

    // FIXME: refactor this
    // this.editableProcessingOrder = respProcessingOrder.data;
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
              // TODO: if we are editing existing order, filter the stock orders that are already present in the proc. order
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

    // FIXME: refactor this
    // if (setValue) {
    //   if (this.actionType === 'PROCESSING' || this.actionType === 'FINAL_PROCESSING') {
    //
    //     this.form.get('outputQuantity').setValue(Number(inputQuantity).toFixed(2));
    //     if (this.isUsingInput) {
    //       this.outputStockOrderForm.get('totalQuantity').setValue(Number(inputQuantity).toFixed(2));
    //     }
    //
    //   } else if (this.actionType === 'GENERATE_QR_CODE') {
    //
    //     if (this.form) {
    //       this.form.get('outputQuantity').setValue(Number(inputQuantity).toFixed(2));
    //       this.outputStockOrderForm.get('totalQuantity').setValue(Number(inputQuantity).toFixed(2));
    //     }
    //   } else {
    //
    //     if (this.form) {
    //       this.form.get('outputQuantity').setValue(Number(inputQuantity).toFixed(2));
    //     }
    //   }
    // }

    return inputQuantity;
  }

}
