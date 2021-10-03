import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash-es';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CompanyCustomerService } from 'src/api-chain/api/companyCustomer.service';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { ProcessingActionService } from 'src/api-chain/api/processingAction.service';
import { ProcessingOrderService } from 'src/api-chain/api/processingOrder.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { TransactionService } from 'src/api-chain/api/transaction.service';
import { UserService } from 'src/api-chain/api/user.service';
import { ChainActivityProof } from 'src/api-chain/model/chainActivityProof';
import { ChainDocumentRequirement } from 'src/api-chain/model/chainDocumentRequirement';
import { ChainDocumentRequirementList } from 'src/api-chain/model/chainDocumentRequirementList';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { ChainProcessingAction } from 'src/api-chain/model/chainProcessingAction';
import { ChainProcessingEvidenceType } from 'src/api-chain/model/chainProcessingEvidenceType';
import { ChainProcessingOrder } from 'src/api-chain/model/chainProcessingOrder';
import { ChainProductOrder } from 'src/api-chain/model/chainProductOrder';
import { ChainSemiProduct } from 'src/api-chain/model/chainSemiProduct';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { ChainTransaction } from 'src/api-chain/model/chainTransaction';
import { DocTypeIdsWithRequired } from 'src/api-chain/model/docTypeIdsWithRequired';
import { FieldDefinition } from 'src/api-chain/model/fieldDefinition';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { ProductControllerService } from 'src/api/api/productController.service';
import { ApiCertification } from 'src/api/model/apiCertification';
import { ApiCompanyGet } from 'src/api/model/apiCompanyGet';
import { CompanyDetailComponent } from 'src/app/company/company-detail/company-detail.component';
import { ApiCompanyGetValidationScheme } from 'src/app/company/company-detail/validation';
import { ApiCertificationValidationScheme } from 'src/app/m-product/product-label/validation';
import { ActionTypesService } from 'src/app/shared-services/action-types.service';
import { ActiveCompanyCustomersByOrganizationService } from 'src/app/shared-services/active-company-customers-by-organization.service';
import { ActiveFacilitiesCodebookService } from 'src/app/shared-services/active-facilities-codebook.service';
import { ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService } from 'src/app/shared-services/active-facilities-for-organization-and-semi-product-id-standalone';
import { ActiveProcessingActionForProductAndOrganizationStandalone } from 'src/app/shared-services/active-processing-action-for-product-and-organization-standalone';
import { ActiveSellingFacilitiesForOrganizationAndSemiProductIdStandaloneService } from 'src/app/shared-services/active-selling-facilities-for-organization-and-semi-product-id-standalone';
import { AssociatedCompaniesService } from 'src/app/shared-services/associated-companies.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { GradeAbbreviationCodebook } from 'src/app/shared-services/grade-abbreviation-codebook';
import { SemiProductInFacilityCodebookServiceStandalone } from 'src/app/shared-services/semi-products-in-facility-standalone-codebook.service';
import { ThemeService } from 'src/app/shared-services/theme.service';
import { ListEditorManager } from 'src/app/shared/list-editor/list-editor-manager';
import { AuthService } from 'src/app/core/auth.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { environment } from 'src/environments/environment';
import { ProcessingActionType } from 'src/shared/types';
import { dateAtMidnightISOString, dbKey, defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ApiActivityProofValidationScheme } from '../../../../company/company-stock/stock-core/additional-proof-item/validation';
import { ChainStockOrderValidationScheme, ChainTransactionValidationScheme } from './validation';
import { GradeAbbreviationControllerService } from '../../../../../api/api/gradeAbbreviationController.service';
import { ActionTypeControllerService } from '../../../../../api/api/actionTypeController.service';
import { ProcessingEvidenceTypeControllerService } from '../../../../../api/api/processingEvidenceTypeController.service';

export function customValidateArrayGroup(): ValidatorFn {
  return (formArray: FormArray): { [key: string]: any } | null => {
    let valid = false;
    for (const item of formArray.controls) {
      if (item.value.totalQuantity != null && item.value.totalQuantity > 0) {
        valid = true;
        break;
      }
    }
    return valid ? null : { atLeastOne: true };
  };
}

export interface ChainStockOrderSelectable extends ChainStockOrder {
  selected?: boolean;
  selectedQuantity?: number;
}

@Component({
  selector: 'app-product-label-stock-processing-order-detail',
  templateUrl: './product-label-stock-processing-order-detail.component.html',
  styleUrls: ['./product-label-stock-processing-order-detail.component.scss']
})

export class ProductLabelStockProcessingOrderDetailComponent implements OnInit, OnDestroy {

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public productController: ProductControllerService,
    private chainProductService: ProductService,
    private chainProcessingActionService: ProcessingActionService,
    private chainFacilityService: FacilityService,
    private chainStockOrderService: StockOrderService,
    private chainSemiProductService: SemiProductService,
    private gradeAbbreviationService: GradeAbbreviationControllerService,
    private actionTypeService: ActionTypeControllerService,
    private processingEvidenceTypeService: ProcessingEvidenceTypeControllerService,
    private chainUserService: UserService,
    private chainProcessingOrderService: ProcessingOrderService,
    public authService: AuthService,
    private chainTransactionService: TransactionService,
    public theme: ThemeService,
    private chainOrganizationService: OrganizationService,
    private companyController: CompanyControllerService,
    private globalEventsManager: GlobalEventManagerService,
    protected codebookTranslations: CodebookTranslations,
    protected chainCompanyCustomerService: CompanyCustomerService
  ) { }

  get isSemiProductDefined() {
    return !(this.actionType === 'TRANSFER' && !(this.prAction && this.prAction.inputSemiProductId));
  }

  get showTotalQuantityForm() {
    if (this.actionType === 'SHIPMENT') { return true; }
    if (this.actionType !== 'PROCESSING') { return false; }
    return !this.prAction.repackedOutputs;
    // return !this.outputStockOrders.value || this.outputStockOrders.value.length == 0
  }

  get canSave() {
    console.log('CAN SAVE:', this.outputStockOrderForm);
    if (this.processingDateForm.invalid) {
      console.log('processingDateForm invalid');
      return false;
    }
    if (this.outputStockOrderForm.invalid) {
      console.log('outputStockOrderForm invalid');
      return false;
    }

    if (!this.noRepackaging) {
      if (this.form.invalid) {
        console.log('form invalid');
        return false;
      }

      // if (this.requiredEvidenceError) {
      //   console.log("requiredProcessingEvidenceArray invalid")
      //   return false;
      // }
      if (this.requiredProcessingEvidenceArray.invalid) {
        console.log('requiredProcessingEvidenceArray invalid');
        return false;
      }
    }

    if (this.invalidOutputQuantity) {
      console.log('invalidOutputQuantity');
      return false;
    }
    if (this.inputFacilityForm.invalid) {
      console.log('inputFacilityForm invalid');
      return false;
    }
    if (this.outputFacilityForm.invalid) {
      console.log('outputFacilityForm invalid');
      return false;
    }
    if (this.processingActionForm.invalid) {
      console.log('processingActionForm invalid');
      return false;
    }
    if (this.oneInputStockOrderRequired) {
      console.log('oneInputStockOrderRequired invalid');
      return false;
    }
    if (this.outputStockOrders.value.length > 0 && this.outputStockOrders.invalid) {
      console.log('outputStockOrders invalid', this.outputStockOrders);
      return false;
    }
    return true;
  }

  get actionType(): ProcessingActionType {
    if (!this.prAction) { return null; }
    const type = this.prAction.type;
    // legacy
    if (!type) {
      // if (!this.prAction.repackedOutputs) return 'TRANSFER'
      return 'PROCESSING';
    }
    return type;
  }

  get inputTransactions(): ChainTransaction[] {
    if (this.update) {
      if (this.actionType === 'SHIPMENT' && this.outputStockOrderForm) { return this.outputStockOrderForm.get('inputTransactions').value; }
      // if (this.actionType === 'PROCESSING' || this.actionType === 'TRANSFER') {
      return this.processingOrderInputTransactions ? this.processingOrderInputTransactions : [];
      // }
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

  get totalQuantity() {
    return this.outputStockOrderForm.getRawValue().totalQuantity;
  }

  get qrCodeValue() {
    const value = '?id=' + '' + '&ln=' + '' + '&lt=' + '' + '&q=' + '' + '&let=' + '';
    return value;
  }

  get womensOnlyStatusValue() {
    if (this.womensOnlyStatus.value != null) {
      if (this.womensOnlyStatus.value) { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.womenCoffee:Women coffee`; }
      else { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.nonWomenCoffee:Non-women coffee`; }
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
    // return this.outputStockOrderForm.get('totalQuantity').value
    return this.totalQuantity;
  }

  get sacNetWLabel() {
    if (this.prAction) {
      const unit = this.underlyingMeasurementUnit ? this.underlyingMeasurementUnit.label : this.prAction.outputSemiProduct.measurementUnitType.label;
      return $localize`:@@productLabelStockProcessingOrderDetail.itemNetWeightLabel: Quantity (max. ${ this.prAction.maxOutputWeight } ${ unit })`;
    }
  }


  get outputQuantityReadonly() {
    return true;
    // if (this.actionType === 'SHIPMENT') return false;
    // return this.outputStockOrders.length > 0 // || this.selectedInputStockOrders.length == 0
  }

  get noRepackaging() {
    if (this.prAction) {
      return this.prAction.repackedOutputs != null && !this.prAction.repackedOutputs;
    }
    return false;
  }

  get showInputTransactions() {
    // if(this.actionType === 'SHIPMENT') return this.inputFacilityForm.value && this.outputFacilityForm.value && this.form.get('outputQuantity').value
    return this.inputFacilityForm.value;
  }

  get isUsingInput(): boolean {
    return !!this.checkboxUseInputFrom.value;
  }

  get showUseInput() {
    return this.actionType === 'PROCESSING' && this.underlyingMeasurementUnit;
  }

  get showRemainingForm() {
    if (this.actionType === 'PROCESSING') { return !!this.underlyingMeasurementUnit; }
    if (this.actionType === 'SHIPMENT') { return true; }
    return false;
  }

  // toggleClipOrder() {
  //   let val = this.checkboxClipOrderFrom.value
  //   this.checkboxClipOrderFrom.setValue(!val)
  // }

  get isClipOrder(): boolean {
    return !!this.checkboxClipOrderFrom.value;
  }

  get showClipOrder() {
    return this.actionType === 'SHIPMENT';
  }




  get oneInputStockOrderRequired() {
    if (this.actionType === 'SHIPMENT') { return false; }
    const inTRCount = this.inputTransactions ? this.inputTransactions.length : 0;
    const selTRCount = this.selectedInputStockOrders ? this.selectedInputStockOrders.length : 0;
    return inTRCount + selTRCount == 0;
  }

  get inputQuantityOrOutputFacilityNotSet() {
    if (this.actionType === 'SHIPMENT') {
      // return !this.inputFacilityForm.value || !this.outputStockOrderForm || !this.outputStockOrderForm.get('totalQuantity').value
      return !this.inputFacilityForm.value || !this.outputStockOrderForm || !this.totalQuantity;
    }
  }

  get invalidOutputQuantity() {
    // return this.showTotalQuantityForm && !this.outputStockOrderForm.get('totalQuantity').value
    return this.showTotalQuantityForm && !this.totalQuantity;
  }


  get invalidOutputQuantityForShipment() {
    return this.actionType === 'SHIPMENT' && this.invalidOutputQuantity;
  }

  get invalidOutputFacility() {
    return false;
    // if (this.actionType === 'SHIPMENT') return !this.outputFacilityForm.value
  }

  get nonOutputSemiProductsInputSemiProductsLength() {
    if (!this.outputStockOrderForm) { return 0; }
    if (!this.update) { return this.inputSemiProducts.length; }
    const allSet = new Set(this.inputSemiProducts.map(x => dbKey(x)));
    if (this.actionType === 'PROCESSING' || this.actionType === 'TRANSFER') {
      this.editableProcessingOrder.targetStockOrderIds.forEach(x => {
        allSet.delete(x);
      });
    }
    if (this.actionType === 'SHIPMENT') {
      const id = dbKey(this.outputStockOrderForm.value);
      allSet.delete(id);
    }
    return allSet.size;
  }


  get showFilterSemiProduct() {
    return this.actionType === 'TRANSFER' && !(this.prAction && this.prAction.inputSemiProductId) && this.activeSemiProductsInFacility;
  }

  get inputQuantityLabel() {
    return $localize`:@@productLabelStockProcessingOrderDetail.textinput.inputQuantityLabelWithUnits.label: Input quantity in ${ this.prAction ? this.codebookTranslations.translate(this.prAction.inputSemiProduct.measurementUnitType, 'label') : '' }`;
  }

  get outputQuantityLabel() {
    return $localize`:@@productLabelStockProcessingOrderDetail.textinput.outputQuantityLabelWithUnits.label: Output quantity in ${ this.prAction ? this.codebookTranslations.translate(this.prAction.outputSemiProduct.measurementUnitType, 'label') : '' }`;
  }

  get inputFacility() {
    return this.inputFacilityForm.value as ChainFacility;
  }

  get underlyingMeasurementUnit() {
    if (!this.prAction) { return null; }
    if (this.actionType === 'PROCESSING') {
      const inputMeasurementUnit = this.prAction.inputSemiProduct.measurementUnitType;
      const outputMeasurementUnit = this.prAction.outputSemiProduct.measurementUnitType;
      // console.log("INP:", inputMeasurementUnit)
      // console.log("OUT", outputMeasurementUnit)
      if (dbKey(inputMeasurementUnit) === dbKey(outputMeasurementUnit)) { return inputMeasurementUnit; }
      const underlyingOutputMesUnit = outputMeasurementUnit.underlyingMeasurementUnitType;
      if (underlyingOutputMesUnit && dbKey(underlyingOutputMesUnit) === dbKey(inputMeasurementUnit)) { return inputMeasurementUnit; }
      const underlyingInputMesUnit = inputMeasurementUnit.underlyingMeasurementUnitType;
      if (underlyingInputMesUnit && dbKey(underlyingInputMesUnit) === dbKey(outputMeasurementUnit)) { return outputMeasurementUnit; }
    }
    return null;
  }

  get showLeftSide() {
    const facility = this.inputFacility;
    if (!facility) { return true; }
    if (!this.update) { return true; }
    return this.organizationId === facility.organizationId;
  }

  get disabledLeftFields() {
    return !this.inputFacility || this.inputFacility.organizationId != this.organizationId;
  }

  get showRightSide() {
    const facility = this.outputFacilityForm.value as ChainFacility;
    if (!facility) { return true; }
    return this.organizationId === facility.organizationId;
  }

  get showDeliveryData() {
    return this.actionType === 'SHIPMENT';
  }

  get showInternalLotNumberField() {
    return this.actionType !== 'TRANSFER';
  }

  get productOrderId() {
    const form = this.outputStockOrderForm.get('productOrder');
    if (form && form.value) {
      const val = form.value as ChainProductOrder;
      return val.id;
    }
    return null;
  }

  activeProcessingCodebook: ActiveProcessingActionForProductAndOrganizationStandalone;
  inputFacilitiesCodebook: ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService | ActiveFacilitiesCodebookService | ActiveSellingFacilitiesForOrganizationAndSemiProductIdStandaloneService;
  outputFacilitiesCodebook: ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService | ActiveFacilitiesCodebookService;
  gradeAbbreviationCodebook: GradeAbbreviationCodebook;
  actionTypesCodebook: ActionTypesService;
  associatedCompaniesService: AssociatedCompaniesService;
  companyCustomerCodebook: ActiveCompanyCustomersByOrganizationService;

  submitted = false;
  cbSelectAllForm = new FormControl(false);
  productId;
  update = false;
  title;
  prAction: ChainProcessingAction;
  chainProductId;
  organizationId;
  processingActionForm = new FormControl(null, Validators.required);
  inputFacilityForm = new FormControl(null, Validators.required);
  outputFacilityForm = new FormControl(null, Validators.required);
  filterSemiProduct = new FormControl(null);
  womensOnlyStatus = new FormControl(null);
  remainingForm = new FormControl(null);
  womensOnlyForm = new FormControl(null);
  form: FormGroup;
  currentInputSemiProduct: ChainSemiProduct;
  currentOutputSemiProduct: ChainSemiProduct;
  currentOutputSemiProductNameForm = new FormControl(null);
  outputStockOrderForm: FormGroup;
  processingEvidenceListManager = null;
  inputFacilityFromUrl: ChainFacility = null;
  currentInputFacility: ChainFacility = null;
  showPricePerUnit = false;
  showGrade = false;
  showExportLotNumber = false;
  showScreenSize = false;
  showLotLabel = false;
  showStartOfDrying = false;
  showClientName = false;
  showCertificatesIds = false;
  companyDetailForm: FormGroup;
  certificationListManager = null;
  showTransactionType = false;
  showFlavourProfile = false;
  selectedInputStockOrders: ChainStockOrderSelectable[] = [];
  subs: Subscription[] = [];
  qrCodeSize = 110;
  faTimes = faTimes;
  faTrashAlt = faTrashAlt;
  showWomensFilter = false;

  outputStockOrders = new FormArray([], customValidateArrayGroup());

  fromFilterDate = new FormControl(null);
  toFilterDate = new FormControl(null);

  otherProcessingEvidenceArray = new FormArray([]);
  requiredProcessingEvidenceArray = new FormArray([]);

  chainRootUrl: string = environment.chainRelativeFileUploadUrl;
  chainDownloadRootUrl: string = environment.chainRelativeFileDownloadUrl;

  saveProcessingOrderInProgress = false;

  outputStockOrder: ChainStockOrder;
  editableProcessingOrder: ChainProcessingOrder;

  // processingDateForm = new FormControl(null, Validators.required)
  processingDateForm = new FormControl(null);

  processingOrderInputTransactions: ChainTransaction[];
  processingOrderInputOrders: ChainStockOrder[];
  creatorId: string;

  activeSemiProductsInFacility: SemiProductInFacilityCodebookServiceStandalone = null;

  inputSemiProducts: ChainStockOrderSelectable[] = [];

  blinkInputQuantityFacilityError = false;

  priceItemTest;

  checkboxUseInputFrom = new FormControl();

  checkboxClipOrderFrom = new FormControl(false);

  static ChainActivityProofCreateEmptyObject(): ChainActivityProof {
    const obj = ChainActivityProof.formMetadata();
    return defaultEmptyObject(obj) as ChainActivityProof;
  }

  static ChainActivityProofEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(ProductLabelStockProcessingOrderDetailComponent.ChainActivityProofCreateEmptyObject(), ApiActivityProofValidationScheme.validators);
    };
  }

  ngOnInit(): void {
    this.initInitialData().then(
      async (resp: any) => {
        await this.generateCompanyDetailForm();
        this.gradeAbbreviationCodebook = new GradeAbbreviationCodebook(this.gradeAbbreviationService, this.codebookTranslations);
        this.activeProcessingCodebook = new ActiveProcessingActionForProductAndOrganizationStandalone(this.chainProcessingActionService, this.chainProductId, this.organizationId, this.codebookTranslations);
        this.actionTypesCodebook = new ActionTypesService(this.actionTypeService);
        if (this.prAction) {
          this.setRequiredProcessingEvidence(this.prAction);
          if (this.prAction.inputSemiProductId) {
            if (this.actionType === 'SHIPMENT') {
              this.inputFacilitiesCodebook = new ActiveSellingFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService, this.organizationId, this.prAction.inputSemiProductId, this.codebookTranslations);
            } else {
              this.inputFacilitiesCodebook = new ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService, this.organizationId, this.prAction.inputSemiProductId, this.codebookTranslations);
            }
          } else {
            this.inputFacilitiesCodebook = new ActiveFacilitiesCodebookService(this.chainFacilityService, this.codebookTranslations);
          }
          if (this.prAction.outputSemiProductId) {
            this.outputFacilitiesCodebook = new ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService, this.organizationId, this.prAction.outputSemiProductId, this.codebookTranslations);
          } else {
            this.outputFacilitiesCodebook = new ActiveFacilitiesCodebookService(this.chainFacilityService, this.codebookTranslations);
          }
          this.associatedCompaniesService = new AssociatedCompaniesService(this.productController, this.route.snapshot.params.id, 'BUYER');
          if (!this.update && this.actionType === 'SHIPMENT') {
            // do not set input form for new shipments
            this.outputFacilityForm.setValue(this.inputFacilityFromUrl);
            this.setOutputFacility(this.inputFacilityFromUrl);
          } else {
            this.inputFacilityForm.setValue(this.inputFacilityFromUrl);
            this.setInputFacility(this.inputFacilityFromUrl, !this.update);  // clear output form on new
          }
          if (this.actionType === 'SHIPMENT') {
            this.companyCustomerCodebook = new ActiveCompanyCustomersByOrganizationService(this.chainCompanyCustomerService, this.organizationId);
          }
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
    this.subs.forEach(sub => sub.unsubscribe());
  }

  async initInitialData() {
    const action = this.route.snapshot.data.action;
    if (!action) { return; }
    // standalone on route
    this.productId = this.route.snapshot.params.id;
    if (action === 'new') {
      this.update = false;
      this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTitle:Add action`;

      const actionId = this.route.snapshot.params.actionId;
      const facilityIdFromLink = this.route.snapshot.params.inputFacilityId;

      if (actionId !== 'NEW') {

        const resp = await this.chainProcessingActionService.getProcessingAction(actionId).pipe(take(1)).toPromise();
        if (resp && resp.status === 'OK' && resp.data) {
          this.prAction = resp.data;
          this.processingActionForm.setValue(this.prAction);
          this.defineInputAndOutputSemiProduct(this.prAction);
        }

        const resf = await this.chainFacilityService.getFacilityById(facilityIdFromLink).pipe(take(1)).toPromise();
        if (resf && resf.status === 'OK' && resf.data) {
          this.inputFacilityFromUrl = resf.data;
        }
      }
      const today = dateAtMidnightISOString(new Date().toDateString());
      this.processingDateForm.setValue(today);
    } else if (action === 'update') {
      this.update = true;
      const actionType = this.route.snapshot.data.type;
      if (actionType === 'SHIPMENT') {
        this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateShipmentTitle:Update action`;
        const orderId = this.route.snapshot.params.orderId as string;
        if (!orderId) { throw Error('No order id!'); }
        const resp = await this.chainStockOrderService.getStockOrderByIdWithInputOrders(orderId).pipe(take(1)).toPromise();
        if (resp && resp.status === 'OK') {
          this.outputStockOrder = resp.data;
          this.prAction = this.outputStockOrder.processingAction;
          // console.log("PR_ACTION", this.prAction)
          this.processingActionForm.setValue(this.prAction);
          this.defineInputAndOutputSemiProduct(this.prAction);
          if (this.outputStockOrder.processingOrder) {
            this.editableProcessingOrder = this.outputStockOrder.processingOrder;
            this.processingDateForm.setValue(this.editableProcessingOrder.processingDate);
          } else {
            const processingOrderId = this.outputStockOrder.processingOrderId;
            const resp2 = await this.chainProcessingOrderService.getProcessingOrder(processingOrderId).pipe(take(1)).toPromise();
            if (resp2 && resp2.status === 'OK') {
              this.editableProcessingOrder = resp2.data;
              this.processingDateForm.setValue(this.editableProcessingOrder.processingDate);
            }
          }
          const inputTxs = this.outputStockOrder.inputTransactions;
          let facId = null;
          if (this.outputStockOrder.quoteFacilityId) {
            facId = this.outputStockOrder.quoteFacilityId;
          } else if (inputTxs && inputTxs.length > 0) {
            facId = inputTxs[0].sourceFacilityId;
          }
          if (facId) {
            const resf = await this.chainFacilityService.getFacilityById(facId).pipe(take(1)).toPromise();
            if (resf && resf.status === 'OK' && resf.data) {
              this.inputFacilityFromUrl = resf.data;
            }
          }
        }
      }
      if (actionType === 'PROCESSING') {  // FIX
        this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateProcessingTitle:Update processing action`;
        const orderId = this.route.snapshot.params.orderId as string;
        if (!orderId) { throw Error('No order id!'); }
        const resp = await this.chainStockOrderService.getStockOrderByIdWithInputOrders(orderId).pipe(take(1)).toPromise();
        if (resp && resp.status === 'OK') {
          this.outputStockOrder = resp.data;
          this.prAction = this.outputStockOrder.processingAction;
          this.processingActionForm.setValue(this.prAction);
          this.defineInputAndOutputSemiProduct(this.prAction);
          const processingOrderId = this.outputStockOrder.processingOrderId;
          const resp2 = await this.chainProcessingOrderService.getProcessingOrder(processingOrderId).pipe(take(1)).toPromise();
          if (resp2 && resp2.status === 'OK') {
            this.editableProcessingOrder = resp2.data;
            this.processingDateForm.setValue(this.editableProcessingOrder.processingDate);
            this.initializeOutputStockOrdersForEdit();
            this.processingOrderInputTransactions = this.editableProcessingOrder.inputTransactions;
            this.processingOrderInputOrders = this.editableProcessingOrder.inputOrders;
            // console.log("IOS:", this.processingOrderInputOrders)
            if (this.processingOrderInputTransactions && this.processingOrderInputTransactions.length > 0) {
              const resf = await this.chainFacilityService
                  .getFacilityById(this.processingOrderInputTransactions[0].sourceFacilityId).pipe(take(1)).toPromise();
              if (resf && resf.status === 'OK' && resf.data) {
                this.inputFacilityFromUrl = resf.data;
              }
            }
          }
        }
      }
      if (actionType === 'TRANSFER') {  // FIX
        this.title = $localize`:@@productLabelStockProcessingOrderDetail.updateShipmentTitle:Update shipment action`;
        const orderId = this.route.snapshot.params.orderId as string;
        if (!orderId) { throw Error('No order id!'); }
        let resp;
        try {
          this.globalEventsManager.showLoading(true);
          resp = await this.chainStockOrderService.getStockOrderByIdWithInputOrders(orderId).pipe(take(1)).toPromise();
        } catch (e) {
          throw e;
        } finally {
          this.globalEventsManager.showLoading(false);
        }
        if (resp && resp.status === 'OK') {
          this.outputStockOrder = resp.data;
          this.prAction = this.outputStockOrder.processingAction;
          this.processingActionForm.setValue(this.prAction);
          this.defineInputAndOutputSemiProduct(this.prAction);
          const processingOrderId = this.outputStockOrder.processingOrderId;

          let procOrder = this.outputStockOrder.processingOrder;
          if (!procOrder) {
            const resp2 = await this.chainProcessingOrderService.getProcessingOrder(processingOrderId).pipe(take(1)).toPromise();
            if (resp2 && resp2.status === 'OK') {
              procOrder = resp2.data;
            }
          }
          // let resp2 = await this.chainProcessingOrderService.getProcessingOrder(processingOrderId).pipe(take(1)).toPromise()
          // if (resp2 && resp2.status === 'OK') {
          if (procOrder) {
            this.editableProcessingOrder = procOrder; // resp2.data
            this.processingDateForm.setValue(this.editableProcessingOrder.processingDate);
            this.initializeOutputStockOrdersForEdit();
            this.processingOrderInputTransactions = this.editableProcessingOrder.inputTransactions;
            this.processingOrderInputOrders = this.editableProcessingOrder.inputOrders;
            // this.processingOrderInputTransactions.forEach((x, i) => {
            //   (x as any).__position = i
            // })
            if (this.processingOrderInputTransactions && this.processingOrderInputTransactions.length > 0) {
              const resf = await this.chainFacilityService
                  .getFacilityById(this.processingOrderInputTransactions[0].sourceFacilityId).pipe(take(1)).toPromise();
              if (resf && resf.status === 'OK' && resf.data) {
                this.inputFacilityFromUrl = resf.data;
              }
            }
          }
        }
      }

    } else {
      throw Error('Wrong action.');
    }

    const res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data) {
      this.chainProductId = dbKey(res.data);
    }

    this.organizationId = localStorage.getItem('selectedUserCompany');
    this.creatorId = await this.getCreatorId();
  }

  async initializeClientName() {
    if (this.prAction.requiredFields) {
      const cname = this.prAction.requiredFields.find(x => x.label === 'CLIENT_NAME');
      if (!cname) { return; }
      const form = this.outputStockOrderForm.get('clientId');
      if (!form || !form.value) { return; }
      const candidates = await this.associatedCompaniesService.getAllCandidates().pipe(take(1)).toPromise();
      const val = candidates.find(x => x.company.id === form.value);
      if (val) {
        form.setValue(val);
      } else {
        form.setValue(null);
      }
    }
    //   for (let item of this.prAction..requiredFields) {
    //     if (item.label == 'CLIENT_NAME') {
    //       this.subs.push(this.associatedCompaniesService.getAllCandidates().subscribe((val) => {
    //         if (this.outputStockOrderForm.get('clientId') && this.outputStockOrderForm.get('clientId').value) {
    //           for (const [i, v] of val.entries()) {
    //             if (v.company.id == this.outputStockOrderForm.get('clientId').value) {
    //               this.outputStockOrderForm.get('clientId').setValue(val[i])
    //               break
    //             }
    //           }
    //         } else if (val && val.length == 8) this.outputStockOrderForm.get('clientId').setValue(val[0])
    //       }))
    //       break
    //     }
    //   }
    // }

  }
  newProcessingOrder() {
    this.form = generateFormFromMetadata(ChainTransaction.formMetadata(), {}, ChainTransactionValidationScheme);
    this.outputStockOrderForm = generateFormFromMetadata(ChainStockOrder.formMetadata(), {}, ChainStockOrderValidationScheme);
    if (this.actionType === 'SHIPMENT') {
      this.checkboxClipOrderFrom.setValue(true);
    }
    // inject transaction form for easier validation purposes
    this.outputStockOrderForm.setControl('form', this.form);
    this.outputStockOrderForm.setControl('remainingForm', this.remainingForm);
    this.outputStockOrderForm.setControl('processingActionForm', this.processingActionForm);
    this.initializeListManager();
    if (this.prAction) {
      this.setRequiredFields(this.prAction);
      this.initializeClientName();

      // if (this.prAction.requiredFields) {
      //   for (let item of this.prAction.requiredFields) {
      //     if (item.label == 'CLIENT_NAME') {
      //       this.subs.push(this.associatedCompaniesService.getAllCandidates().subscribe((val) => {
      //         if (this.outputStockOrderForm.get('clientId') && this.outputStockOrderForm.get('clientId').value) {
      //           for (const [i, v] of val.entries()) {
      //             if (v.company.id == this.outputStockOrderForm.get('clientId').value) {
      //               this.outputStockOrderForm.get('clientId').setValue(val[i])
      //               break
      //             }
      //           }
      //         } else if (val && val.length == 8) this.outputStockOrderForm.get('clientId').setValue(val[0])
      //       }))
      //       break
      //     }
      //   }
      // }
    }
    this.defaultInternalLotNumber();
  }

  defaultInternalLotNumber(setOutputForm = true, forceSet = false) {
    return; // disabled for now
    // let internalLotNumberArr = []

    // if (this.prAction && this.prAction.prefix) {
    //   internalLotNumberArr.push(this.prAction.prefix)
    // }
    // let now = new Date();
    // internalLotNumberArr.push("" + now.getFullYear() + (now.getMonth() + 1 < 10 ? "0" : "") + (now.getMonth() + 1) + (now.getDate() < 10 ? "0" : "") + now.getDate())
    // let internalLotNumber = internalLotNumberArr.join('-')
    // if (setOutputForm) {
    //   if (forceSet || !this.outputStockOrderForm.get('internalLotNumber').value) {
    //     this.outputStockOrderForm.get('internalLotNumber').setValue(internalLotNumber);
    //   }
    // }
    // return internalLotNumber
  }

  async setProcessingAction(event) {
    this.prAction = event;
    this.setRequiredProcessingEvidence(this.prAction);
    if (event) {
      this.clearInput();
      this.clearOutput();
      // this.inputFacilitiesCodebook = new ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService, this.organizationId, event.inputSemiProductId)
      // this.outputFacilitiesCodebook = new ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService, this.organizationId, event.outputSemiProductId)

      if (this.prAction.inputSemiProductId) {
        if (this.actionType === 'SHIPMENT') {
          this.inputFacilitiesCodebook = new ActiveSellingFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService, this.organizationId, this.prAction.inputSemiProductId, this.codebookTranslations);
        } else {
          this.inputFacilitiesCodebook = new ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService, this.organizationId, this.prAction.inputSemiProductId, this.codebookTranslations);
        }
      } else {
        this.inputFacilitiesCodebook = new ActiveFacilitiesCodebookService(this.chainFacilityService, this.codebookTranslations);
      }
      if (this.prAction.outputSemiProductId) {
        this.outputFacilitiesCodebook = new ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService, this.organizationId, this.prAction.outputSemiProductId, this.codebookTranslations);
      } else {
        this.outputFacilitiesCodebook = new ActiveFacilitiesCodebookService(this.chainFacilityService, this.codebookTranslations);
      }


      this.subs.push(this.inputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
        if (val && val.length === 1) { this.inputFacilityForm.setValue(val[0]); }
      }));
      this.subs.push(this.outputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
        if (val && val.length === 1 && !this.update) {
          this.outputFacilityForm.setValue(val[0]);
        }
      }));
      this.defineInputAndOutputSemiProduct(event);
      this.setRequiredFields(event);
      this.defaultInternalLotNumber(true, true);

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

  async setInputFacility(event: any, clearOutputForm = true) {
    // console.log("SET INPUT FACILITY")
    this.clearCBAndValues();

    if (!event) {
      this.clearInputFacilityForm();
      if (clearOutputForm) { this.clearOutputForm(); }
      this.currentInputFacility = null;
      this.activeSemiProductsInFacility = null;
      return;
    }
    if (event) {
      this.currentInputFacility = event;
      if (this.isSemiProductDefined) {
        const res = await this.chainStockOrderService.listAvailableStockForSemiProductInFacility(dbKey(event), this.processingActionForm.value.inputSemiProductId).pipe(take(1)).toPromise();
        if (res && res.status === 'OK' && res.data) {
          this.inputSemiProducts = res.data.items;
          if (this.inputSemiProducts.length > 0 && this.inputSemiProducts[0].orderType === 'PURCHASE_ORDER') { this.showWomensFilter = true; }
          else { this.showWomensFilter = false; }
        }
      } else {
        this.activeSemiProductsInFacility = new SemiProductInFacilityCodebookServiceStandalone(this.chainFacilityService, event, this.codebookTranslations);
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

  prefillOutputFacility() {
    let prefillOutputFacility = false;
    if (this.prAction && this.prAction.requiredFields) {
      for (const item of this.prAction.requiredFields) {
        if (item.label === 'PREFILL_OUTPUT_FACILITY') {
          if (this.inputFacilityForm && this.inputFacilityForm.value) {
            this.subs.push(this.outputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
              if (val) {
                for (const item of val) {
                  if (item._id === this.inputFacilityForm.value._id && !this.update) {
                    this.outputFacilityForm.setValue(this.inputFacilityForm.value);
                    prefillOutputFacility = true;
                    break;
                  }
                }
              }
            }));
          }
          break;
        }
      }
    }
    if (!prefillOutputFacility) {
      this.subs.push(this.outputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
        if (val && val.length === 1 && !this.update) {
          this.outputFacilityForm.setValue(val[0]);
        }
      }));
    }
  }

  dismiss() {
    this.location.back();
  }

  disableFormsOnUpdate() {
    this.outputFacilityForm.disable();
    if (this.inputFacilityForm.value) {
      this.inputFacilityForm.disable();
      // if (this.actionType != 'SHIPMENT') {
      //   this.inputFacilityForm.disable() // !!!XX
      // } else {
      //   if (this.inputTransactions && this.inputTransactions.length > 0) {
      //     this.inputFacilityForm.disable()
      //   }
      // }
    }
    this.processingActionForm.disable();
  }

  updateProcessingOrder() {
    this.form = generateFormFromMetadata(ChainTransaction.formMetadata(), {}, ChainTransactionValidationScheme);
    this.form.get('outputQuantity').disable();
    this.outputStockOrderForm = generateFormFromMetadata(ChainStockOrder.formMetadata(), this.outputStockOrder, ChainStockOrderValidationScheme);
    const internalLotNumber = this.outputStockOrderForm.get('internalLotNumber').value;
    if (internalLotNumber) {
      this.outputStockOrderForm.get('internalLotNumber').setValue(internalLotNumber.replace(/^([^\/]+)\/\d+$/, '$1'));
    }

    // inject transaction form for easier validation purposes
    this.outputStockOrderForm.setControl('form', this.form);
    this.outputStockOrderForm.setControl('remainingForm', this.remainingForm);
    this.outputStockOrderForm.setControl('processingActionForm', this.processingActionForm);
    // console.log("X", this.outputStockOrderForm, this.processingActionForm)

    this.prepareDocumentsForEdit();  // async
    this.initializeListManager();
    const inQuantity = this.calcInputQuantity(true);
    if (this.actionType === 'SHIPMENT') {
      // let outQuantity = this.outputStockOrderForm.get('totalQuantity').value
      const outQuantity = this.totalQuantity;
      if (outQuantity >= inQuantity) {
        this.checkboxClipOrderFrom.setValue(true);
      }
    }

    if (this.prAction) {
      this.setRequiredFields(this.prAction);
      this.initializeClientName();
    }

    // if (this.actionType === 'SHIPMENT') {
    //   this.form.get('outputQuantity').setValue(this.outputStockOrder.totalQuantity)
    // }

    // if (this.actionType === 'SHIPMENT' || this.actionType === 'PROCESSING' || ) {
    this.outputFacilityForm.setValue(this.outputStockOrder.facility);
    this.disableFormsOnUpdate();
    this.setInputOutputFormSidesVisibility();
    // this.outputFacilityForm.disable()
    // if (this.inputFacilityForm.value) {
    //   if (this.actionType != 'SHIPMENT') {
    //     this.inputFacilityForm.disable() // !!!XX
    //   } else {
    //     if (this.inputTransactions && this.inputTransactions.length > 0) {
    //       this.inputFacilityForm.disable()
    //     }
    //   }
    // }
    // this.processingActionForm.disable()
  }

  async saveProcessingOrder() {
    if (this.saveProcessingOrderInProgress) { return; }
    this.globalEventsManager.showLoading(true);
    this.saveProcessingOrderInProgress = true;
    this.submitted = true;
    if (!this.canSave) {
      this.saveProcessingOrderInProgress = false;
      this.globalEventsManager.showLoading(false);
      return;
    }
    // create output stock orders
    const outputStockOrderList = await this.prepareDataAndStoreStockOrder();
    if (outputStockOrderList) {
      // create processingOrder
      let processingOrder: ChainProcessingOrder;

      // let targetOrderId;
      // if (this.actionType === 'PROCESSING' || this.actionType === 'TRANSFER') {
      processingOrder = {
        _id: this.editableProcessingOrder ? dbKey(this.editableProcessingOrder) : undefined,
        initiatorUserId: this.creatorId,
        processingActionId: dbKey(this.prAction),
        // gradeAbbreviationId: this.outputStockOrderForm.get('gradeAbbreviation').value ? dbKey(this.outputStockOrderForm.get('gradeAbbreviation').value) : null,
        targetStockOrders: outputStockOrderList,
        inputTransactions: this.actionType === 'SHIPMENT' ? [] : this.inputTransactions,
        processingDate: this.processingDateForm.value ? dateAtMidnightISOString(this.processingDateForm.value) : null
      } as ChainProcessingOrder;

      const data = _.cloneDeep(processingOrder);
      Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

      // }

      for (const [index, stockOrder] of this.selectedInputStockOrders.entries()) {
        if (stockOrder.selectedQuantity === 0) { continue; }  // ignore bad selections
        const transaction = {
          isProcessing: this.actionType === 'PROCESSING',
          organizationId: this.organizationId,
          initiatorUserId: this.creatorId,
          sourceStockOrderId: dbKey(stockOrder), // this.selectedInputStockOrders.map(item => dbKey(item)),
          status: (outputStockOrderList.length === 1 && this.prAction.type === 'SHIPMENT' && outputStockOrderList[0].orderType === 'GENERAL_ORDER') ? 'PENDING' : 'EXECUTED',
          inputQuantity: stockOrder.selectedQuantity,
          outputQuantity: stockOrder.selectedQuantity,
        } as ChainTransaction;
        const data = _.cloneDeep(transaction);
        Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

        if (this.actionType === 'SHIPMENT') {
          if (!outputStockOrderList[0].inputTransactions) {
            outputStockOrderList[0].inputTransactions = [data];
          } else {
            outputStockOrderList[0].inputTransactions.push(data);
          }
        } else { // PROCESSING, TRANSFER
          if (!processingOrder.inputTransactions) {
            processingOrder.inputTransactions = [data];
          } else {
            processingOrder.inputTransactions.push(data);
          }
        }
      }
      // if (this.actionType === 'SHIPMENT') {
      //   try {
      //     this.globalEventsManager.showLoading(true)
      //     let res = await this.chainTransactionService.postStockOrdersWithInputTransactions(outputStockOrderList as ChainStockOrder[]).pipe(take(1)).toPromise();
      //     if (!(res && res.status === 'OK')) throw Error("Problem stock orders and transactions for order type: " + this.actionType)
      //   } finally {
      //     this.globalEventsManager.showLoading(false)
      //   }
      // } else {  // PROCESSING or TRANSFER
      try {
        // this.globalEventsManager.showLoading(true)
        const res = await this.chainTransactionService.postProcessingOrdersWithInputTransactionsAndOutputStockOrders([processingOrder]).pipe(take(1)).toPromise();
        if (!(res && res.status === 'OK')) { throw Error('Problem stock orders and transactions for order type: ' + this.actionType); }
      } finally {
        this.globalEventsManager.showLoading(false);
        this.saveProcessingOrderInProgress = false;
      }
      // }

      this.dismiss();
    }

  }


  async prepareDataAndStoreStockOrder(): Promise<ChainStockOrder[]> {
    const docs = this.prepareSODocuments();
    const ids: string[] = [];
    const stockOrderList: ChainStockOrder[] = [];
    const commonDocumentRequirements = {
      identifier: 'PROCESSING_EVIDENCE_TYPE',
      semiProductId: this.isSemiProductDefined ? dbKey(this.currentOutputSemiProduct) : undefined,
      requirements: docs,
      targets: {
        fairness: 0,
        provenance: 0,
        quality: 0,
        qualityLevel: this.outputStockOrderForm.get('gradeAbbreviation').value ? this.outputStockOrderForm.get('gradeAbbreviation').value.label : '',
        womenShare: this.womensOnlyForm.value === 'YES' ? 1 : 0,
        order: 0,
        payment: 0
      }
    };

    const commonFields = {
      gradeAbbreviation: this.outputStockOrderForm.get('gradeAbbreviation').value ? this.outputStockOrderForm.get('gradeAbbreviation').value : null,
      lotNumber: this.outputStockOrderForm.get('lotNumber').value ? this.outputStockOrderForm.get('lotNumber').value : null,
      pricePerUnit: this.outputStockOrderForm.get('pricePerUnit').value ? this.outputStockOrderForm.get('pricePerUnit').value : null,
      screenSize: this.outputStockOrderForm.get('screenSize').value ? this.outputStockOrderForm.get('screenSize').value : null,
      lotLabel: this.outputStockOrderForm.get('lotLabel').value ? this.outputStockOrderForm.get('lotLabel').value : null,
      startOfDrying: this.outputStockOrderForm.get('startOfDrying').value ? this.outputStockOrderForm.get('startOfDrying').value : null,
      clientId: this.outputStockOrderForm.get('clientId').value ? this.outputStockOrderForm.get('clientId').value.company.id : null,
      certificates: this.outputStockOrderForm.get('certificates').value ? this.outputStockOrderForm.get('certificates').value : null,
      flavourProfile: this.outputStockOrderForm.get('flavourProfile').value ? this.outputStockOrderForm.get('flavourProfile').value : null,
      comments: this.outputStockOrderForm.get('comments').value ? this.outputStockOrderForm.get('comments').value : null,
      womenShare: this.womensOnlyForm.value === 'YES' ? 1 : 0,
    };

    if (this.actionType === 'TRANSFER') {  // copy stock orders to destination (prej !repackedOutputs)
      if (this.editableProcessingOrder) {
        for (const [index, stockOrder] of this.editableProcessingOrder.targetStockOrders.entries()) {
          const newStockOrder = {
            ...stockOrder,
            ...commonFields,
            documentRequirements: commonDocumentRequirements,
            // internalLotNumber: this.outputStockOrderForm.get('internalLotNumber').value + `/${ index + 1 }`   // do not override
          };
          Object.keys(newStockOrder).forEach((key) => (newStockOrder[key] == null) && delete newStockOrder[key]);
          stockOrderList.push(newStockOrder);
        }
      }

      const existingSOLength = this.editableProcessingOrder && this.editableProcessingOrder.targetStockOrders
        ? this.editableProcessingOrder.targetStockOrders.length
        : 0;

      for (const [index, stockOrder] of this.selectedInputStockOrders.entries()) {
        let data = _.cloneDeep(stockOrder);
        delete data._id;
        delete data._rev;
        delete data.docType;
        delete data.selected;
        delete data.selectedQuantity;
        delete data.identifier;
        delete data.producerUserCustomer;
        delete data.isPurchaseOrder;
        delete data.created;
        // TODO - delete all fields
        data.facilityId = dbKey(this.outputFacilityForm.value);
        data.creatorId = this.creatorId;
        data.productionDate = data.productionDate ? data.productionDate : this.calcToday();
        data.orderType = 'TRANSFER_ORDER';
        data.processingActionId = dbKey(this.prAction);
        data.totalQuantity = stockOrder.availableQuantity;
        data.fullfilledQuantity = 0;
        data.availableQuantity = 0;
        data = {
          ...data,
          ...commonFields,
          documentRequirements: commonDocumentRequirements,
          // internalLotNumber: this.outputStockOrderForm.get('internalLotNumber').value + `/${index + 1 + existingSOLength}`
        };
        Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);
        stockOrderList.push(data);
        // if (create) {
        //   let res = await this.chainStockOrderService.postStockOrder(data).pipe(take(1)).toPromise();
        //   if (res && res.status === 'OK' && res.data) ids.push(dbKey(res.data));
        // }
      }
      return stockOrderList;
    } else { // END TRANSFER
      if (this.actionType === 'PROCESSING' && this.outputStockOrders.value.length > 0) {  // repacked outputs!

        for (const [index, item] of this.outputStockOrders.value.entries()) {
          if (item.totalQuantity != null && item.totalQuantity > 0) {
            const stockOrder = {
              _id: item.id,
              _rev: item.rev,
              internalLotNumber: this.outputStockOrderForm.get('internalLotNumber').value + `/${ item.sacNumber }`,
              creatorId: this.creatorId,
              semiProductId: dbKey(this.currentOutputSemiProduct),
              facilityId: dbKey(this.outputFacilityForm.value),
              totalQuantity: parseFloat(item.totalQuantity),
              fullfilledQuantity: parseFloat(item.totalQuantity),
              availableQuantity: parseFloat(item.totalQuantity),
              productionDate: this.calcToday(),
              sacNumber: parseInt(item.sacNumber),
              // pricePerUnit: this.form.get('pricePerUnit').value ? this.form.get('pricePerUnit').value : null,
              // currency: this.form.get('pricePerUnit').value ? "RWF" : null,

              ...commonFields,
              currency: this.outputStockOrderForm.get('pricePerUnit').value ? 'RWF' : null,
              orderType: 'PROCESSING_ORDER',
              processingAction: this.prAction,

              documentRequirements: commonDocumentRequirements
            } as ChainStockOrder;

            delete (stockOrder as any).form;
            delete (stockOrder as any).remainingForm;
            delete (stockOrder as any).processingActionForm;
            delete (stockOrder as any).facility;
            delete (stockOrder as any).semiProduct;
            delete (stockOrder as any).processingAction;
            delete (stockOrder as any).processingOrder;
            delete (stockOrder as any).triggeredOrders;
            delete (stockOrder as any).productOrder;


            const data = _.cloneDeep(stockOrder);
            Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);
            stockOrderList.push(data);
          }
        }
        return stockOrderList;
      } else {   // type is PROCESSING or SHIPMENT, not repacked outputs

        let stockOrder = this.outputStockOrderForm.getRawValue() as ChainStockOrder;
        // console.log("UU", this.outputStockOrderForm.value, this.outputStockOrderForm.getRawValue())
        const outputFormRawValue = this.outputStockOrderForm.getRawValue();
        stockOrder = {
          ...stockOrder,
          creatorId: stockOrder.creatorId ? stockOrder.creatorId : this.creatorId,
          semiProductId: dbKey(this.currentOutputSemiProduct),
          facilityId: dbKey(this.outputFacilityForm.value),
          // totalQuantity: parseFloat(this.outputStockOrderForm.get('totalQuantity').value),
          totalQuantity: parseFloat(this.totalQuantity),
          // fullfilledQuantity: this.actionType === 'PROCESSING' ? parseFloat(this.outputStockOrderForm.get('totalQuantity').value) : 0,
          // availableQuantity: this.actionType === 'PROCESSING' ? parseFloat(this.outputStockOrderForm.get('totalQuantity').value) : 0,
          fullfilledQuantity: this.actionType === 'PROCESSING' ? parseFloat(this.totalQuantity) : 0,
          availableQuantity: this.actionType === 'PROCESSING' ? parseFloat(this.totalQuantity) : 0,

          productionDate: stockOrder.productionDate ? stockOrder.productionDate : this.calcToday(),
          orderType: this.prAction.type === 'SHIPMENT' ? 'GENERAL_ORDER' : 'PROCESSING_ORDER',
          processingAction: this.prAction,
          ...commonFields,
          quoteFacilityId: this.prAction.type === 'SHIPMENT' ? dbKey(this.inputFacilityForm.value) : undefined,
          currency: stockOrder.currency ? stockOrder.currency : (stockOrder.pricePerUnit ? 'RWF' : null),
          documentRequirements: commonDocumentRequirements
        } as ChainStockOrder;
        // remove injection
        delete (stockOrder as any).form;
        delete (stockOrder as any).remainingForm;
        delete (stockOrder as any).processingActionForm;
        delete (stockOrder as any).facility;
        delete (stockOrder as any).semiProduct;
        delete (stockOrder as any).processingAction;
        delete (stockOrder as any).processingOrder;
        delete (stockOrder as any).triggeredOrders;
        delete (stockOrder as any).productOrder;

        const data = _.cloneDeep(stockOrder);
        Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);
        stockOrderList.push(data);
        // if (create) {
        //   let res = await this.chainStockOrderService.postStockOrder(data).pipe(take(1)).toPromise();
        //   if (res && res.status === 'OK' && res.data) return [dbKey(res.data)];
        // }
        // if (create) return ids;
        // console.log("SOLIST:", stockOrderList)
        return stockOrderList;
      }
    }
  }


  // async setRequiredProcessingEvidence(action: ChainProcessingAction) {
  //   (this.requiredProcessingEvidenceArray as FormArray).clear();
  //   if (action && action.requiredDocTypeIds) {
  //     let types = [];
  //     if (action.requiredDocTypes) types = action.requiredDocTypes;
  //     else {
  //       for (let id of action.requiredDocTypeIds) {
  //         let res = await this.chainCodebookService.getActionType(id).pipe(take(1)).toPromise();
  //         if (res && res.status === 'OK' && res.data) {
  //           types.push(res.data);
  //         }
  //       }
  //     }

  //     for (let act of types) {
  //       this.requiredProcessingEvidenceArray.push(new FormGroup({
  //         date: new FormControl(this.calcToday(), Validators.required),
  //         type_label: new FormControl(act.label),
  //         type_id: new FormControl(act.id),
  //         type__id: new FormControl(dbKey(act)),
  //         document: new FormControl(null, Validators.required)
  //       })
  //       )
  //     }
  //   } else {
  //     (this.requiredProcessingEvidenceArray as FormArray).clear()
  //   }
  // }

  extractFieldDefinitionValueType(fieldDefinition: FieldDefinition): any {
    switch (fieldDefinition.type) {
      case 'text':
      case 'date':
      case 'timestamp':
        return fieldDefinition.stringValue;
      case 'number':
        return fieldDefinition.numericValue;
      case 'file':
        return fieldDefinition.files;
      case 'object':
        return fieldDefinition.objectValue;
      default:
        return null;
    }
  }

  formOfRequirementItem(item: ChainDocumentRequirement, useFormalCreationDate = false): FormGroup | FormControl {
    let date = null;
    let type = null;
    let document = null;

    for (const field of item.fields) {
      if (field.label === 'Date') { date = field.stringValue; }
      if (field.label === 'Type') { type = this.extractFieldDefinitionValueType(field); }
      if (field.label === 'Document') {
        if (field.files && field.files.length > 0) {
          document = field.files[0];
        }
      }
    }

    if (useFormalCreationDate) {
      return new FormControl({
        formalCreationDate: date,
        type,
        document
      });
      // return new FormGroup({
      //   formalCreationDate: new FormControl(date, Validators.required),
      //   type: new FormControl(type),
      //   document: new FormControl(document, Validators.required)
      // })
    }
    return new FormGroup({
      date: new FormControl(date, Validators.required),
      type: new FormControl(type),
      document: new FormControl(document, Validators.required)
    });
  }


  async prepareDocumentsForEdit() {
    // this.requiredProcessingEvidenceArray.clear()
    this.otherProcessingEvidenceArray.clear();
    let types: ChainProcessingEvidenceType[] = [];
    if (this.prAction && this.prAction.requiredDocTypeIds) {
      if (this.prAction.requiredDocTypes) { types = this.prAction.requiredDocTypes; }
      else {
        for (const id of this.prAction.requiredDocTypeIds) {
          const res = await this.actionTypeService.getActionTypeUsingGET(Number(id)).pipe(take(1)).toPromise();
          if (res && res.status === 'OK' && res.data) {
            types.push(res.data as any); // FIXME: check this after other entities are migrated
          }
        }
      }

      const documentRequirements = this.outputStockOrderForm.get('documentRequirements').value as ChainDocumentRequirementList;
      const requirements = (documentRequirements && documentRequirements.requirements) || [];
      // console.log("Reqs:", requirements, this.requiredProcessingEvidenceArray.controls.map(x => x.value))
      for (const item of requirements) {
        const res = this.requiredProcessingEvidenceArray.controls.find(x => x.value.type && x.value.type.id === item.description);
        if (res) {
          const formOfReq = this.formOfRequirementItem(item);
          res.setValue(formOfReq.value);
        } else {
          this.otherProcessingEvidenceArray.push(this.formOfRequirementItem(item, true));
        }
      }
    }
  }

  prepareSODocuments() {
    const docs = [];
    if ((this.requiredProcessingEvidenceArray as FormArray).value.length > 0) {
      for (const item of this.requiredProcessingEvidenceArray.controls) {
        const chainDoc: ChainDocumentRequirement = {
          name: item.value.type.label,
          description: item.value.type.id,
          documentIdentifier: item.value.type._id,
          fields: [
            {
              label: 'Date',
              type: FieldDefinition.TypeEnum.Date, // "date",
              required: true,
              stringValue: item.value.date ? dateAtMidnightISOString(item.value.date) : null
            },
            {
              label: 'Type',
              type: FieldDefinition.TypeEnum.Object, // "object",
              required: true,
              objectValue: item.value.type
            },
            {
              label: 'Document',
              type: FieldDefinition.TypeEnum.File, // "file",
              required: true,
              files: item.value.document ? [item.value.document] : []
            }
          ],
          score: []
        };
        docs.push(chainDoc);
      }
    }
    if ((this.otherProcessingEvidenceArray as FormArray).value.length > 0) {
      for (const item of this.otherProcessingEvidenceArray.controls) {
        const chainDoc: ChainDocumentRequirement = {
          name: item.value.type.label,
          description: item.value.type.id,
          documentIdentifier: item.value.type._id,
          fields: [
            {
              label: 'Date',
              type: FieldDefinition.TypeEnum.Date, // "date",
              required: true,
              stringValue: item.value.formalCreationDate ? dateAtMidnightISOString(item.value.formalCreationDate) : null
            },
            {
              label: 'Type',
              type: FieldDefinition.TypeEnum.Object, // "object",
              required: true,
              objectValue: item.value.type
            },
            {
              label: 'Document',
              type: FieldDefinition.TypeEnum.File, // "file",
              required: true,
              files: item.value.document ? [item.value.document] : []
            }
          ],
          score: []
        };
        docs.push(chainDoc);
      }
    }
    return docs;
  }

  async getCreatorId() {
    const profile = await this.authService.userProfile$.pipe(take(1)).toPromise();
    const AFuserIdRes = await this.chainUserService.getUserByAFId(profile.id).pipe(take(1)).toPromise();
    if (AFuserIdRes && AFuserIdRes.status === 'OK' && AFuserIdRes.data) {
      return dbKey(AFuserIdRes.data);
    }
  }

  calcToday() {
    return dateAtMidnightISOString(new Date().toDateString());
  }

  clearCBAndValues() {
    this.inputSemiProducts = [];
    this.selectedInputStockOrders = [];
    this.cbSelectAllForm.setValue(false);
  }

  clearInput() {
    this.clearCBAndValues();
    this.clearInputFacilityForm();
    this.inputFacilitiesCodebook = new ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService, this.organizationId, 'EMPTY', this.codebookTranslations); // TODO find better way of doing it
  }

  clearOutput() {
    this.clearOutputFacilityForm();
    this.outputFacilitiesCodebook = new ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService, this.organizationId, 'EMPTY', this.codebookTranslations); // TODO find better way of doing it
    this.clearOutputForm();
  }

  clearInputFacilityForm() {
    this.inputFacilityForm.setValue(null);
  }

  clearOutputFacilityForm() {
    if (!this.update) {
      this.outputFacilityForm.setValue(null);
    }
  }

  clearOutputForm() {
    this.form.get('outputQuantity').setValue(null);
    // this.form.get('pricePerUnit').setValue(null);
    this.outputStockOrderForm.get('gradeAbbreviation').setValue(null);
    this.outputStockOrderForm.get('actionType').setValue(null);
    this.outputStockOrderForm.get('pricePerUnit').setValue(null);
    this.outputStockOrderForm.get('lotNumber').setValue(null);
    // this.outputStockOrderForm.get('internalLotNumber').setValue(null);
    this.outputStockOrderForm.get('screenSize').setValue(null);
    this.outputStockOrderForm.get('lotLabel').setValue(null);
    this.outputStockOrderForm.get('startOfDrying').setValue(null);
    this.outputStockOrderForm.get('clientId').setValue(null);
    this.outputStockOrderForm.get('flavourProfile').setValue(null);
    this.outputStockOrderForm.get('comments').setValue(null);
    // this.outputStockOrderForm.get('certificates').setValue(null);
    this.womensOnlyForm.setValue(null);
    this.currentOutputSemiProductNameForm.setValue(null);
  }


  async setSelectedSemiProduct(event) {
    this.currentInputSemiProduct = event;
    const res = await this.chainStockOrderService.listAvailableStockForSemiProductInFacility(dbKey(this.inputFacilityForm.value), dbKey(event)).pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data) {
      this.inputSemiProducts = res.data.items;
      if (this.inputSemiProducts.length > 0 && this.inputSemiProducts[0].orderType === 'PURCHASE_ORDER') { this.showWomensFilter = true; }
      else { this.showWomensFilter = false; }
    }
  }

  async defineInputAndOutputSemiProduct(event) {
    if (event.inputSemiProductId) {
      const resIn = await this.chainSemiProductService.getSemiProduct(event.inputSemiProductId).pipe(take(1)).toPromise();
      if (resIn && resIn.status === 'OK') { this.currentInputSemiProduct = resIn.data; }
    }
    if (event.outputSemiProductId) {
      const resOut = await this.chainSemiProductService.getSemiProduct(event.outputSemiProductId).pipe(take(1)).toPromise();
      if (resOut && resOut.status === 'OK') {
        this.currentOutputSemiProduct = resOut.data;
        this.currentOutputSemiProductNameForm.setValue(this.translateName(this.currentOutputSemiProduct));
      }
    }
  }

  setRemaining() {
    // if (this.form && this.form.get('outputQuantity') && this.form.get('outputQuantity').value) {
    //   this.remainingForm.setValue((this.calcInputQuantity(false) - this.form.get('outputQuantity').value).toFixed(2));
    // } else {
    //   this.remainingForm.setValue(null);
    // }
    if (this.actionType === 'PROCESSING') {
      this.remainingForm.setValue((this.calcInputQuantity(false) - this.calculateOutputQuantity).toFixed(2));
    }
    if (this.actionType === 'SHIPMENT') {
      // this.remainingForm.setValue((this.outputStockOrderForm.get('totalQuantity').value - this.calcInputQuantity(false)).toFixed(2));
      this.remainingForm.setValue((this.totalQuantity - this.calcInputQuantity(false)).toFixed(2));
    }
  }

  initializeListManager() {
    this.processingEvidenceListManager = new ListEditorManager<ChainActivityProof>(
      this.otherProcessingEvidenceArray as FormArray,
      ProductLabelStockProcessingOrderDetailComponent.ChainActivityProofEmptyObjectFormFactory(),
      ApiActivityProofValidationScheme
    );

  }

  select(semiProduct) {
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
    if (!this.inputSemiProducts[index].selected) {
      // let outputQuantity = this.form.get('outputQuantity').value as number || 0
      // let outputQuantity = this.outputStockOrderForm.get('totalQuantity').value as number || 0
      const outputQuantity = this.totalQuantity as number || 0;
      const toFill = outputQuantity - this.calcInputQuantity(false); // Todo - odštej obstoječe transakcije

      // console.log("TO-FILL:", toFill, this.actionType, this.isClipOrder)
      const currentAvailable = this.inputSemiProducts[index].availableQuantity;
      if (this.actionType === 'SHIPMENT' && this.isClipOrder) {
        if (toFill > 0 && currentAvailable > 0) {
          this.inputSemiProducts[index].selected = true;
          this.inputSemiProducts[index].selectedQuantity = toFill < currentAvailable ? toFill : currentAvailable;
        } else {
          this.inputSemiProducts[index].selected = true;
          this.inputSemiProducts[index].selectedQuantity = 0;
          setTimeout(() => { this.inputSemiProducts[index].selected = false; this.calcInputQuantity(true); }, 600);
        }
      } else {
        this.inputSemiProducts[index].selected = true;
        this.inputSemiProducts[index].selectedQuantity = currentAvailable;
      }
    } else {
      this.inputSemiProducts[index].selected = false;
      this.inputSemiProducts[index].selectedQuantity = 0;
    }

    // this.inputSemiProducts[index].selected = !this.inputSemiProducts[index].selected;
    this.select(semiProduct);
  }
  selectAll() {
    if (!this.showLeftSide) { return; }
    if (this.disabledLeftFields) { return; }
    if (this.cbSelectAllForm.value) {
      this.selectedInputStockOrders = [];
      for (const item of this.inputSemiProducts) {
        this.selectedInputStockOrders.push(item);
      }
      this.inputSemiProducts.map(item => { item.selected = true; item.selectedQuantity = item.availableQuantity; return item; });
      // if (this.inputQuantityOrOutputFacilityNotSet) {
      //   setTimeout(() => {
      //     this.cbSelectAllForm.setValue(false)
      //     this.selectAll()
      //     this.blinkInputQuantityFacilityError = true
      //     setTimeout(() => { this.blinkInputQuantityFacilityError = false }, 1000)
      //   }, 700)
      // }
      if (this.isClipOrder) {
        this.clipOrder(true);
      }
    } else {
      this.selectedInputStockOrders = [];
      this.inputSemiProducts.map(item => { item.selected = false; item.selectedQuantity = 0; return item; });
    }
    this.calcInputQuantity(true);
    this.setWomensOnly();
  }

  calcInputQuantity(setValue) {
    let inputQuantity = 0;
    if (this.update) {
      for (const item of this.inputSemiProducts) {
        inputQuantity += item.selectedQuantity ? item.selectedQuantity : 0;
      }
      // let txs = this.outputStockOrderForm.get('inputTransactions').value as ChainTransaction[];
      const txs = this.inputTransactions;
      if (txs) {
        for (const tx of txs) {
          inputQuantity += tx.outputQuantity;
        }
      }
    } else {
      // for (let item of this.selectedInputStockOrders) {
      //   inputQuantity += item.availableQuantity
      // }
      for (const item of this.inputSemiProducts) {
        inputQuantity += item.selectedQuantity ? item.selectedQuantity : 0;
      }

    }

    if (setValue) {
      if (this.actionType == 'PROCESSING') {
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

    // if (setValue && (this.actionType == 'PROCESSING' || this.actionType === 'SHIPMENT') {
    //   this.form.get('outputQuantity').setValue(inputQuantity);
    //   if (!this.update) {
    //     this.setInputOutputFormAccordinglyToTransaction();
    //   }
    //   if (this.isUsingInput) {
    //     this.outputStockOrderForm.get('totalQuantity').setValue(inputQuantity)
    //   }
    // }
    // if (setValue && this.actionType == 'TRANSFER') {
    //   this.form.get('outputQuantity').setValue(inputQuantity);
    // }

    return inputQuantity;
  }

  setWomensOnly() {
    let number = 0;
    let all = 0;
    for (const item of this.selectedInputStockOrders) {
      if (item.documentRequirements.targets.womenShare === 1) {
        number += item.availableQuantity;
      }
      all += item.availableQuantity;
    }
    if (number === all && all > 0) { this.womensOnlyForm.setValue('YES'); }
    else if (number < all && all > 0) { this.womensOnlyForm.setValue('NO'); }
    else { this.womensOnlyForm.setValue(null); }
  }

  setRequiredFields(action: ChainProcessingAction) {
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
      this.outputStockOrderForm.get('totalQuantity').setValidators([Validators.required]);
    }
    // Set fields specifically to the
    if (action && action.requiredFields) {
      for (const item of action.requiredFields) {
        // if (item.label === 'GRADE') {
        //   let form = this.outputStockOrderForm.controls['gradeAbbreviation']
        //   form.setValidators([Validators.required]);
        //   form.updateValueAndValidity();
        //   this.showGrade = true;
        // } else if (item.label === 'LOT_EXPORT_NUMBER') {
        //   this.outputStockOrderForm.controls['lotNumber'].setValidators([Validators.required]);
        //   this.outputStockOrderForm.controls['lotNumber'].updateValueAndValidity();
        //   this.showExportLotNumber = true;
        // } else if (item.label === 'PRICE_PER_UNIT') {
        //   this.outputStockOrderForm.controls['pricePerUnit'].setValidators([Validators.required]);
        //   this.outputStockOrderForm.controls['pricePerUnit'].updateValueAndValidity();
        //   this.showPricePerUnit = true;
        //   this.priceItemTest = item
        // } else if (item.label === 'SCREEN_SIZE') {
        //   this.outputStockOrderForm.controls['screenSize'].setValidators([Validators.required]);
        //   this.outputStockOrderForm.controls['screenSize'].updateValueAndValidity();
        //   this.showScreenSize = true;
        // } else if (item.label === 'LOT_LABEL') {
        //   this.outputStockOrderForm.controls['lotLabel'].setValidators([Validators.required]);
        //   this.outputStockOrderForm.controls['lotLabel'].updateValueAndValidity();
        //   this.showLotLabel = true;
        // } else if (item.label === 'START_OF_DRYING') {
        //   this.outputStockOrderForm.controls['startOfDrying'].setValidators([Validators.required]);
        //   this.outputStockOrderForm.controls['startOfDrying'].updateValueAndValidity();
        //   this.showStartOfDrying = true;
        // } else if (item.label === 'CLIENT_NAME') {
        //   this.outputStockOrderForm.controls['clientId'].setValidators([Validators.required]);
        //   this.outputStockOrderForm.controls['clientId'].updateValueAndValidity();
        //   this.showClientName = true;
        // } else
        if (item.label === 'CERTIFICATES_IDS') {
          if (!this.outputStockOrderForm.get('certificates').value || this.outputStockOrderForm.get('certificates').value.length == 0) {
            const formArrayCD = this.companyDetailForm.get('certifications') as FormArray;
            const formArrayOSO = this.outputStockOrderForm.get('certificates') as FormArray;
            const now = new Date();
            for (const cd of formArrayCD.controls) {
              const validity = new Date(cd.value.validity);
              if (validity > now) {
                formArrayOSO.push(cd);
              }
            }
          }
          this.initializeCertificationListManager();
          this.showCertificatesIds = true;
        }
        // else if (item.label === 'TRANSACTION_TYPE') {
        //   this.outputStockOrderForm.controls['actionType'].setValidators([Validators.required]);
        //   this.outputStockOrderForm.controls['actionType'].updateValueAndValidity();
        //   this.showTransactionType = true;
        // } else if (item.label === 'FLAVOUR_PROFILE') {
        //   this.outputStockOrderForm.controls['flavourProfile'].setValidators([Validators.required]);
        //   this.outputStockOrderForm.controls['flavourProfile'].updateValueAndValidity();
        //   this.showFlavourProfile = true;
        // } else
        if (item.label === 'PREFILL_OUTPUT_FACILITY') {
          if (!this.update) {
            this.prefillOutputFacility();
          }
        }
      }
    }
  }

  async setWomensOnlyStatus(status: boolean) {
    if (!this.showLeftSide) { return; }
    this.womensOnlyStatus.setValue(status);
    if (this.currentInputFacility) {
      this.dateSearch();
    }
  }

  async dateSearch() {
    // console.log("DS")
    if (!this.showLeftSide) { return; }
    const from = this.fromFilterDate.value;
    const to = this.toFilterDate.value;
    if (!this.currentInputFacility) { return; }
    if (from && to) {
      const res = await this.chainStockOrderService
          .listAvailableStockForSemiProductInFacility(dbKey(this.currentInputFacility), this.processingActionForm.value.inputSemiProductId, this.womensOnlyStatus.value, this.formatDate(from), this.formatDate(to)).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        this.inputSemiProducts = res.data.items;
      }
    } else if (from) {
      const tomorrow = new Date();
      tomorrow.setDate(new Date().getDate() + 1);

      const res = await this.chainStockOrderService
          .listAvailableStockForSemiProductInFacility(dbKey(this.currentInputFacility), this.processingActionForm.value.inputSemiProductId, this.womensOnlyStatus.value, this.formatDate(from), this.formatDate(tomorrow)).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        this.inputSemiProducts = res.data.items;
      }
    } else if (to) {
      const fromBeginingOfTime = new Date(null);
      const res = await this.chainStockOrderService
          .listAvailableStockForSemiProductInFacility(dbKey(this.currentInputFacility), this.processingActionForm.value.inputSemiProductId, this.womensOnlyStatus.value, this.formatDate(fromBeginingOfTime), this.formatDate(to)).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        this.inputSemiProducts = res.data.items;
      }
    } else {
      const res = await this.chainStockOrderService
          .listAvailableStockForSemiProductInFacility(dbKey(this.currentInputFacility), this.processingActionForm.value.inputSemiProductId, this.womensOnlyStatus.value, null, null).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        this.inputSemiProducts = res.data.items;
      }
    }

    const tmpSelected = [];
    for (const semi of this.inputSemiProducts) {
      for (const selected of this.selectedInputStockOrders) {
        if (dbKey(selected) === dbKey(semi)) {
          tmpSelected.push(semi);
          semi.selected = true;
          semi.selectedQuantity = selected.availableQuantity;
        }
      }
    }
    this.selectedInputStockOrders = tmpSelected;
    this.calcInputQuantity(true);
  }


  formatDate(dateString) {
    const date = new Date(dateString);
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
  }


  setInputOutputFormAccordinglyToTransaction() {
    if (this.outputStockOrders && this.outputStockOrders.length > 0) {  // prevent recalculating sac numbers if something already entered.
      if ((this.outputStockOrders.value).some(item => item.sacNumber || item.totalQuantity)) { return; }
    }
    (this.outputStockOrders as FormArray).clear();
    // if (this.prAction && this.prAction.repackedOutputs != null) {
    if (this.prAction && this.actionType === 'PROCESSING') {
      // if (this.prAction.repackedOutputs && this.prAction.maxOutputWeight < 10000 && this.prAction.maxOutputWeight > 0) {
      if (this.prAction.repackedOutputs && this.prAction.maxOutputWeight > 0) {
        // if (this.prAction.repackedOutputs && this.prAction.maxOutputWeight < 10000 && this.prAction.maxOutputWeight > 0) {
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
      // if (!this.prAction.repackedOutputs) {  // nothing to do, legacy

      // }
    }
  }

  initializeOutputStockOrdersForEdit() {
    if (this.prAction && this.actionType === 'PROCESSING') {
      if (this.prAction.repackedOutputs && this.prAction.maxOutputWeight < 10000 && this.prAction.maxOutputWeight > 0) {
        for (const [i, stockOrder] of this.editableProcessingOrder.targetStockOrders.entries()) {

          this.outputStockOrders.push(new FormGroup({
            identifier: new FormControl(i + 1),
            id: new FormControl(stockOrder._id),
            rev: new FormControl(stockOrder._rev),
            totalQuantity: new FormControl(stockOrder.totalQuantity, [Validators.min(stockOrder.fullfilledQuantity - stockOrder.availableQuantity), Validators.max(this.prAction.maxOutputWeight)]),
            sacNumber: new FormControl(stockOrder.sacNumber, [Validators.required])
          }));
        }
        this.outputStockOrders.updateValueAndValidity();
      }
    }
  }

  removeItem(idx) {
    (this.outputStockOrders as FormArray).removeAt(idx);
  }

  setSacNumber(idx) {
    (this.outputStockOrders as FormArray).controls[idx].get('identifier').setValue(idx + 1);
  }

  addOutput() {
    (this.outputStockOrders as FormArray).push(
      new FormGroup({
        identifier: new FormControl(null),
        id: new FormControl(null),
        totalQuantity: new FormControl(null, Validators.max(this.prAction.maxOutputWeight)),
        sacNumber: new FormControl(null, [Validators.required])
      }));
  }

  setOutputQuantity() {
    if (this.outputStockOrders.length > 0) {
      let sum = 0;
      for (const item of (this.outputStockOrders as FormArray).value) {
        if (item.totalQuantity != null) { sum += parseFloat(item.totalQuantity); }
      }
      if (this.form.get('outputQuantity')) { this.form.get('outputQuantity').setValue(sum.toFixed(2)); }
    }
  }

  documentRequestFromProcessingEvidence(evidence: ChainProcessingEvidenceType) {
    return {
      label: evidence.label,
      id: evidence.id,
      _id: evidence._id
    };
  }

  async setRequiredProcessingEvidence(action: ChainProcessingAction) {
    (this.requiredProcessingEvidenceArray as FormArray).clear();
    if (action && action.requiredDocTypeIds) {
      let types: ChainProcessingEvidenceType[] = [];
      if (action.requiredDocTypes) { types = action.requiredDocTypes; }
      else {
        for (const id of action.requiredDocTypeIds) {
          const res = await this.processingEvidenceTypeService.getProcessingEvidenceTypeUsingGET(Number(id)).pipe(take(1)).toPromise();
          if (res && res.status === 'OK' && res.data) {
            types.push(res.data as any); // FIXME: check this after other entities are migrated
          }
        }
      }
      if (types.length > 0) {
        const validationConditions: DocTypeIdsWithRequired[] = action.requiredDocTypeIdsWithRequired || [];
        for (const act of types) {
          const item = validationConditions.find(x => x.processingEvidenceTypeId === dbKey(act));
          this.requiredProcessingEvidenceArray.push(new FormGroup({
            date: new FormControl(this.calcToday(), item && item.required ? Validators.required : null),
            type: new FormControl(this.documentRequestFromProcessingEvidence(act)),
            // type_label: new FormControl(act.label),
            // type_id: new FormControl(act.id),
            // type__id: new FormControl(dbKey(act)),
            document: new FormControl(null, item && item.required ? Validators.required : null)
          }));
        }
      }
    } else {
      (this.requiredProcessingEvidenceArray as FormArray).clear();
    }
  }

  deleteTransaction(i: number) {
    // console.log("DELETING I", i, this.actionType, this.showLeftSide)
    if (!this.showLeftSide) { return; }
    if (this.actionType === 'SHIPMENT') {
      (this.outputStockOrderForm.get('inputTransactions') as FormArray).removeAt(i);
      this.calcInputQuantity(true);
      return;
    }
    if (this.actionType === 'PROCESSING') {
      this.processingOrderInputTransactions.splice(i, 1);
      this.calcInputQuantity(true);
    }
    if (this.actionType === 'TRANSFER') {
      this.processingOrderInputTransactions.splice(i, 1);
      this.editableProcessingOrder.targetStockOrders.splice(i, 1);
      this.calcInputQuantity(true);
    }
  }

  useInput(value: boolean) {
    if (!this.showRightSide) { return; }
    if (value) {
      this.outputStockOrderForm.get('totalQuantity').setValue(this.form.get('outputQuantity').value);
    }
  }

  toggleUseInput() {
    const val = this.checkboxUseInputFrom.value;
    this.checkboxUseInputFrom.setValue(!val);
  }

  clipOrder(value: boolean) {
    // if (!this.showRightSide) return
    if (value) {
      // let outputQuantity = this.outputStockOrderForm.get('totalQuantity').value
      const outputQuantity = this.totalQuantity;
      let tmpQuantity = 0;
      for (const tx of this.inputTransactions) {
        tmpQuantity += tx.outputQuantity;
      }
      for (const item of this.inputSemiProducts) {
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

  // get requiredEvidenceError() {
  //   let len = (this.requiredProcessingEvidenceArray as FormArray).value.length;
  //   let count = 0;
  //   for (let item of this.requiredProcessingEvidenceArray.controls) {
  //     console.log(item)
  //     if (!item.value.document) count += 1;
  //   }
  //   console.log(len, count)
  //   if (len > 0 && len === count) return true;
  //   return false;
  // }

  initializeCertificationListManager() {
    this.certificationListManager = new ListEditorManager<ApiCertification>(
      (this.outputStockOrderForm.get('certificates')) as FormArray,
      CompanyDetailComponent.ApiCertificationEmptyObjectFormFactory(),
      ApiCertificationValidationScheme
    );
  }

  async generateCompanyDetailForm() {
    const res = await this.chainOrganizationService.getOrganization(this.organizationId).pipe(take(1)).toPromise();
    if (res && 'OK' === res.status && res.data) {
      const respComp = await this.companyController.getCompanyUsingGET(res.data.id).pipe(take(1)).toPromise();
      if (respComp && 'OK' === respComp.status && respComp.data) {
        const c = respComp.data;
        this.companyDetailForm = generateFormFromMetadata(ApiCompanyGet.formMetadata(), c, ApiCompanyGetValidationScheme);
      }
    }
  }

  isOutputStockOrder(order: ChainStockOrder) {
    // if (this.actionType === 'PROCESSING' || this.actionType === 'TRANSFER') {
    if (!this.update) { return false; }
    return this.editableProcessingOrder.targetStockOrderIds.some(x => x === dbKey(order));
    // }
    // if (this.actionType === 'SHIPMENT') {
    //   let id = dbKey(this.outputStockOrderForm.value)
    //   if (id == null) return false;
    //   return dbKey(order) === id
    // }
    // return false
  }

  translateName(obj) {
    return this.codebookTranslations.translate(obj, 'name');
  }

  setEnabledOnLeftSideForms(value: boolean) {
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

    // dateSearch()
    // setWomensOnlyStatus(null)
    // selectAll()
    // cbSelected(item, i)
    // deleteTransaction(i)
  }

  setEnabledOnRightSideForms(value: boolean) {
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
    // useInput()
    // clipOrder($event)
  }

  setInputOutputFormSidesVisibility() {
    if (this.update && this.actionType === 'SHIPMENT') {
      if (this.showLeftSide) { this.setEnabledOnLeftSideForms(true); }
      else { this.setEnabledOnLeftSideForms(false); }

      if (this.showRightSide) { this.setEnabledOnRightSideForms(true); }
      else { this.setEnabledOnRightSideForms(false); }
    }
  }

}
