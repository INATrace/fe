import { Component, OnInit } from '@angular/core';
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
import { CompanySellingFacilitiesService } from '../../../../shared-services/company-selling-facilities.service';
import { CompanyFacilitiesService } from '../../../../shared-services/company-facilities.service';
import { FacilitiesCodebookService } from '../../../../shared-services/facilities-codebook.service';
import { SemiProductInFacilityCodebookServiceStandalone } from '../../../../shared-services/semi-products-in-facility-standalone-codebook.service';
import { StockOrderControllerService } from '../../../../../api/api/stockOrderController.service';

@Component({
  selector: 'app-stock-processing-order-details',
  templateUrl: './stock-processing-order-details.component.html',
  styleUrls: ['./stock-processing-order-details.component.scss']
})
export class StockProcessingOrderDetailsComponent implements OnInit {

  title: string;

  companyId: number;
  creatorId: number;

  // TODO: this is temporary
  form: FormGroup = new FormGroup({});

  submitted = false;
  update = false;

  prAction: ApiProcessingAction;
  processingActionForm = new FormControl(null, Validators.required);

  // Input facility
  inputFacilityFromUrl: ApiFacility = null;
  inputFacilityForm = new FormControl(null, Validators.required);
  inputFacilitiesCodebook: FacilitiesCodebookService | CompanyFacilitiesService | CompanySellingFacilitiesService;

  // Output facility
  outputFacilityForm = new FormControl(null, Validators.required);
  outputFacilitiesCodebook: FacilitiesCodebookService | CompanyFacilitiesService;

  // Semi-products
  filterSemiProduct = new FormControl(null);
  // TODO: change this
  semiProductsInFacility: SemiProductInFacilityCodebookServiceStandalone = null;

  activeProcessingCodebook: CompanyProcessingActionsService;

  processingDateForm = new FormControl(null);

  companyDetailForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private stockOrderController: StockOrderControllerService,
    private procActionController: ProcessingActionControllerService,
    private facilityController: FacilityControllerService,
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

  ngOnInit(): void {

    this.initInitialData().then(
      async (resp: any) => {

        await this.generateCompanyDetailForm();
        this.activeProcessingCodebook = new CompanyProcessingActionsService(this.procActionController, this.companyId, this.codebookTranslations);

        if (this.prAction) {

          this.setRequiredProcessingEvidence(this.prAction).then();

          // If we have defined input semi-product, set input facility
          if (this.prAction.inputSemiProduct && this.prAction.inputSemiProduct.id) {
            if (this.actionType === 'SHIPMENT') {
              this.inputFacilitiesCodebook = new CompanySellingFacilitiesService(this.facilityController, this.companyId);
            } else {
              this.inputFacilitiesCodebook = new CompanyFacilitiesService(this.facilityController, this.companyId);
            }
          } else {
            this.inputFacilitiesCodebook = new FacilitiesCodebookService(this.facilityController, this.codebookTranslations);
          }

          // If we have defined output semi-product, set output facility
          if (this.prAction.outputSemiProduct && this.prAction.outputSemiProduct.id) {
            this.outputFacilitiesCodebook = new CompanyFacilitiesService(this.facilityController, this.companyId);
          } else {
            this.outputFacilitiesCodebook = new FacilitiesCodebookService(this.facilityController, this.codebookTranslations);
          }

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

  async defineInputAndOutputSemiProduct(event) {
    // TODO: correct this
    // if (event.inputSemiProductId) {
    //   const resIn = await this.chainSemiProductService.getSemiProduct(event.inputSemiProductId).pipe(take(1)).toPromise();
    //   if (resIn && resIn.status === 'OK') { this.currentInputSemiProduct = resIn.data; }
    // }
    // if (event.outputSemiProductId) {
    //   const resOut = await this.chainSemiProductService.getSemiProduct(event.outputSemiProductId).pipe(take(1)).toPromise();
    //   if (resOut && resOut.status === 'OK') {
    //     this.currentOutputSemiProduct = resOut.data;
    //     this.currentOutputSemiProductNameForm.setValue(this.translateName(this.currentOutputSemiProduct));
    //   }
    // }
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
    // TODO: implement set proc. action on UI dropdown value change
  }

  setOutputFacility(event: any, clearOutputForm = false) {

    // TODO: set output facility
    // if (!event) {
    //   if (clearOutputForm) { this.clearOutputForm(); }
    //   this.clearOutputFacilityForm();
    //   return;
    // }
    // if (event) {
    //   if (clearOutputForm) { this.clearOutputForm(); }
    //   this.calcInputQuantity(true);
    //   if (this.currentOutputSemiProduct) {
    //     this.currentOutputSemiProductNameForm.setValue(this.translateName(this.currentOutputSemiProduct));
    //   }
    // }
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

  async setSelectedSemiProduct(event) {

    // TODO: set selected semi product
    // this.currentInputSemiProduct = event;
    // const res = await this.chainStockOrderService.listAvailableStockForSemiProductInFacility(dbKey(this.inputFacilityForm.value), dbKey(event)).pipe(take(1)).toPromise();
    // if (res && res.status === 'OK' && res.data) {
    //   this.inputSemiProducts = res.data.items;
    //   if (this.inputSemiProducts.length > 0 && this.inputSemiProducts[0].orderType === 'PURCHASE_ORDER') { this.showWomensFilter = true; }
    //   else { this.showWomensFilter = false; }
    // }
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

}
