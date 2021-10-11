import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyProcessingActionsService } from '../../../../shared-services/company-processing-actions.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { ApiProcessingAction } from '../../../../../api/model/apiProcessingAction';
import { ProcessingActionControllerService } from '../../../../../api/api/processingActionController.service';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { ApiFacility } from '../../../../../api/model/apiFacility';
import { dateAtMidnightISOString, generateFormFromMetadata } from '../../../../../shared/utils';
import { AuthService } from '../../../../core/auth.service';
import { GradeAbbreviationCodebook } from '../../../../shared-services/grade-abbreviation-codebook';
import { ActionTypesService } from '../../../../shared-services/action-types.service';
import { ApiCompanyGet } from '../../../../../api/model/apiCompanyGet';
import { ApiCompanyGetValidationScheme } from '../../../company-detail/validation';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';
import { CodebookTranslations } from '../../../../shared-services/codebook-translations';
import { ProcessingActionType } from '../../../../../shared/types';
import { CompanySellingFacilitiesForSemiProductService } from '../../../../shared-services/company-selling-facilities-for-semi-product.service';
import { FacilitiesCodebookService } from '../../../../shared-services/facilities-codebook.service';
import { SemiProductInFacilityCodebookServiceStandalone } from '../../../../shared-services/semi-products-in-facility-standalone-codebook.service';
import { StockOrderControllerService } from '../../../../../api/api/stockOrderController.service';
import { SemiProductControllerService } from '../../../../../api/api/semiProductController.service';
import { ApiSemiProduct } from '../../../../../api/model/apiSemiProduct';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { CompanyFacilitiesForSemiProductService } from '../../../../shared-services/company-facilities-for-semi-product.service';
import { Subscription } from 'rxjs';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ApiProcessingOrder } from '../../../../../api/model/apiProcessingOrder';

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

  // TODO: this is temporary
  form: FormGroup = new FormGroup({});

  submitted = false;
  update = false;

  prAction: ApiProcessingAction;
  processingActionForm = new FormControl(null, Validators.required);

  checkboxClipOrderFrom = new FormControl(false);

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
  // TODO: change this
  semiProductsInFacility: SemiProductInFacilityCodebookServiceStandalone = null;
  currentInputSemiProduct: ApiSemiProduct;
  currentOutputSemiProduct: ApiSemiProduct;
  currentOutputSemiProductNameForm = new FormControl(null);

  // Stock orders
  inputStockOrders: ApiStockOrderSelectable[] = [];
  selectedInputStockOrders: ApiStockOrderSelectable[] = [];
  cbSelectAllForm = new FormControl(false);
  outputStockOrderForm: FormGroup;

  // Processing orders
  editableProcessingOrder: ApiProcessingOrder;

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

  constructor(
    private route: ActivatedRoute,
    private stockOrderController: StockOrderControllerService,
    private procActionController: ProcessingActionControllerService,
    private facilityController: FacilityControllerService,
    private semiProductsController: SemiProductControllerService,
    private companyController: CompanyControllerService,
    private authService: AuthService,
    private codebookTranslations: CodebookTranslations,
    public gradeAbbreviationCodebook: GradeAbbreviationCodebook,
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

  get disabledLeftFields() {
    return !this.inputFacility || this.inputFacility.company?.id !== this.companyId;
  }

  get nonOutputSemiProductsInputSemiProductsLength() {

    if (!this.outputStockOrderForm) { return 0; }
    if (!this.update) { return this.inputStockOrders.length; }

    const allSet = new Set(this.inputStockOrders.map(x => x.id));

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

  private updateProcessingOrder() {
    // TODO: implement update of proc. order
  }

  private newProcessingOrder() {
    // TODO: implement new proc. order
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

      this.subscriptions.push(this.inputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
        if (val && val.length === 1) { this.inputFacilityForm.setValue(val[0]); }
      }));
      this.subscriptions.push(this.outputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
        if (val && val.length === 1 && !this.update) {
          this.outputFacilityForm.setValue(val[0]);
        }
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

  async setInputFacility(event: any, clearOutputForm = true) {

    // TODO: set input facility
    // this.clearCBAndValues();
    //
    // if (!event) {
    //   this.clearInputFacilityForm();
    //   if (clearOutputForm) { this.clearOutputForm(); }
    //   this.currentInputFacility = null;
    //   this.activeSemiProductsInFacility = null;
    //   return;
    // }
    // if (event) {
    //   this.currentInputFacility = event;
    //   if (this.isSemiProductDefined) {
    //     const res = await this.chainStockOrderService.listAvailableStockForSemiProductInFacility(dbKey(event),
    //     this.processingActionForm.value.inputSemiProductId).pipe(take(1)).toPromise();
    //     if (res && res.status === 'OK' && res.data) {
    //       this.inputSemiProducts = res.data.items;
    //       if (this.inputSemiProducts.length > 0 && this.inputSemiProducts[0].orderType === 'PURCHASE_ORDER') { this.showWomensFilter = true; }
    //       else { this.showWomensFilter = false; }
    //     }
    //   } else {
    //     this.activeSemiProductsInFacility = new SemiProductInFacilityCodebookServiceStandalone(this.chainFacilityService, event, this.codebookTranslations);
    //   }
    // }
    // if (!this.update) {
    //   this.prefillOutputFacility();
    // }
    // if (this.disabledLeftFields) {
    //   this.cbSelectAllForm.disable();
    // } else {
    //   this.cbSelectAllForm.enable();
    // }
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
      this.inputStockOrders = res.data.items;
      this.showWomensFilter = this.inputStockOrders.length > 0 && this.inputStockOrders[0].orderType === 'PURCHASE_ORDER';
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
      for (const item of this.inputStockOrders) {
        this.selectedInputStockOrders.push(item);
      }

      this.inputStockOrders.map(item => { item.selected = true; item.selectedQuantity = item.availableQuantity; return item; });

      if (this.isClipOrder) {
        this.clipOrder(true);
      }
    } else {
      this.selectedInputStockOrders = [];
      this.inputStockOrders.map(item => { item.selected = false; item.selectedQuantity = 0; return item; });
    }
    this.calcInputQuantity(true);
    this.setWomensOnly();
  }

  clipOrder(value: boolean) {
    // TODO: implement clip order
    // if (value) {
    //   // let outputQuantity = this.outputStockOrderForm.get('totalQuantity').value
    //   const outputQuantity = this.totalQuantity;
    //   let tmpQuantity = 0;
    //   for (const tx of this.inputTransactions) {
    //     tmpQuantity += tx.outputQuantity;
    //   }
    //   for (const item of this.inputSemiProducts) {
    //     if (!item.selected) { continue; }
    //     if (tmpQuantity + item.availableQuantity <= outputQuantity) {
    //       tmpQuantity += item.availableQuantity;
    //       item.selectedQuantity = item.availableQuantity;
    //       continue;
    //     }
    //     if (tmpQuantity >= outputQuantity) {
    //       item.selected = false;
    //       item.selectedQuantity = 0;
    //       continue;
    //     }
    //     item.selectedQuantity = outputQuantity - tmpQuantity;
    //     tmpQuantity = outputQuantity;
    //   }
    //   this.calcInputQuantity(true);
    // }
  }

  cbSelected(semiProduct, index: number) {
    // TODO: implement checkbox select event listener
    // if (!this.showLeftSide) { return; }
    // if (this.cbSelectAllForm.value) {
    //   this.cbSelectAllForm.setValue(false);
    // }
    // if (!this.inputSemiProducts[index].selected) {
    //   // let outputQuantity = this.form.get('outputQuantity').value as number || 0
    //   // let outputQuantity = this.outputStockOrderForm.get('totalQuantity').value as number || 0
    //   const outputQuantity = this.totalQuantity as number || 0;
    //   const toFill = outputQuantity - this.calcInputQuantity(false); // Todo - odštej obstoječe transakcije
    //
    //   // console.log("TO-FILL:", toFill, this.actionType, this.isClipOrder)
    //   const currentAvailable = this.inputSemiProducts[index].availableQuantity;
    //   if (this.actionType === 'SHIPMENT' && this.isClipOrder) {
    //     if (toFill > 0 && currentAvailable > 0) {
    //       this.inputSemiProducts[index].selected = true;
    //       this.inputSemiProducts[index].selectedQuantity = toFill < currentAvailable ? toFill : currentAvailable;
    //     } else {
    //       this.inputSemiProducts[index].selected = true;
    //       this.inputSemiProducts[index].selectedQuantity = 0;
    //       setTimeout(() => { this.inputSemiProducts[index].selected = false; this.calcInputQuantity(true); }, 600);
    //     }
    //   } else {
    //     this.inputSemiProducts[index].selected = true;
    //     this.inputSemiProducts[index].selectedQuantity = currentAvailable;
    //   }
    // } else {
    //   this.inputSemiProducts[index].selected = false;
    //   this.inputSemiProducts[index].selectedQuantity = 0;
    // }
    //
    // // this.inputSemiProducts[index].selected = !this.inputSemiProducts[index].selected;
    // this.select(semiProduct);
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
      this.outputStockOrderForm.get('totalQuantity').setValidators([Validators.required]);
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
    this.inputStockOrders = [];
    this.selectedInputStockOrders = [];
    this.cbSelectAllForm.setValue(false);
  }

  private clearOutputForm() {

    this.form.get('outputQuantity').setValue(null);

    this.outputStockOrderForm.get('gradeAbbreviation').setValue(null);
    this.outputStockOrderForm.get('actionType').setValue(null);
    this.outputStockOrderForm.get('pricePerUnit').setValue(null);
    this.outputStockOrderForm.get('lotNumber').setValue(null);
    this.outputStockOrderForm.get('screenSize').setValue(null);
    this.outputStockOrderForm.get('lotLabel').setValue(null);
    this.outputStockOrderForm.get('startOfDrying').setValue(null);
    this.outputStockOrderForm.get('clientId').setValue(null);
    this.outputStockOrderForm.get('flavourProfile').setValue(null);
    this.outputStockOrderForm.get('comments').setValue(null);

    this.womensOnlyForm.setValue(null);

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
    // TODO: implement calc input quantity
    // let inputQuantity = 0;
    // if (this.update) {
    //   for (const item of this.inputSemiProducts) {
    //     inputQuantity += item.selectedQuantity ? item.selectedQuantity : 0;
    //   }
    //   // let txs = this.outputStockOrderForm.get('inputTransactions').value as ChainTransaction[];
    //   const txs = this.inputTransactions;
    //   if (txs) {
    //     for (const tx of txs) {
    //       inputQuantity += tx.outputQuantity;
    //     }
    //   }
    // } else {
    //   // for (let item of this.selectedInputStockOrders) {
    //   //   inputQuantity += item.availableQuantity
    //   // }
    //   for (const item of this.inputSemiProducts) {
    //     inputQuantity += item.selectedQuantity ? item.selectedQuantity : 0;
    //   }
    //
    // }
    //
    // if (setValue) {
    //   if (this.actionType == 'PROCESSING') {
    //     this.form.get('outputQuantity').setValue(inputQuantity);
    //     if (!this.update) {
    //       this.setInputOutputFormAccordinglyToTransaction();
    //     }
    //     if (this.isUsingInput) {
    //       this.outputStockOrderForm.get('totalQuantity').setValue(inputQuantity);
    //     }
    //   } else {
    //     if (this.form) { this.form.get('outputQuantity').setValue(inputQuantity); }
    //   }
    // }
    //
    // // if (setValue && (this.actionType == 'PROCESSING' || this.actionType === 'SHIPMENT') {
    // //   this.form.get('outputQuantity').setValue(inputQuantity);
    // //   if (!this.update) {
    // //     this.setInputOutputFormAccordinglyToTransaction();
    // //   }
    // //   if (this.isUsingInput) {
    // //     this.outputStockOrderForm.get('totalQuantity').setValue(inputQuantity)
    // //   }
    // // }
    // // if (setValue && this.actionType == 'TRANSFER') {
    // //   this.form.get('outputQuantity').setValue(inputQuantity);
    // // }
    //
    // return inputQuantity;
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

  async setWomensOnlyStatus(status: boolean) {
    if (!this.showLeftSide) { return; }
    this.womensOnlyStatus.setValue(status);
    if (this.currentInputFacility) {
      this.dateSearch().then();
    }
  }

  async dateSearch() {
    // TODO: implement date search for available stock at facility
  }

}
