import { Component, OnInit } from '@angular/core';
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
import { defaultEmptyObject } from '../../../../../shared/utils';

@Component({
  selector: 'app-stock-processing-order-details',
  templateUrl: './stock-processing-order-details.component.html',
  styleUrls: ['./stock-processing-order-details.component.scss']
})
export class StockProcessingOrderDetailsComponent implements OnInit {

  title: string;

  companyId: number;

  // Properties and controls used for display and selection of processing action
  selectedProcessingAction: ApiProcessingAction;
  processingActionsCodebook: CompanyProcessingActionsService;
  processingActionFormControl = new FormControl(null, Validators.required);
  qrCodeForFinalProductFormControl = new FormControl(null);

  // Processing evidence controls
  requiredProcessingEvidenceArray = new FormArray([]);
  otherProcessingEvidenceArray = new FormArray([]);
  processingEvidenceListManager = null;

  submitted = false;
  update = false;

  saveInProgress = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private globalEventsManager: GlobalEventManagerService,
    private procActionController: ProcessingActionControllerService,
    private codebookTranslations: CodebookTranslations,
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
    return this.selectedProcessingAction ? this.selectedProcessingAction.type : null;
  }

  get showRightSide() {
    // TODO: implement - if quote order and not owner company, return false
    return true;
    // const facility = this.outputFacilityForm.value as ApiFacility;
    // if (!facility) { return true; }
    // return this.companyId === facility.company?.id;
  }

  ngOnInit(): void {

    // Get the current user selected company from the local storage
    this.companyId = Number(localStorage.getItem('selectedUserCompany'));

    this.initInitialData().then(
      async () => {

        this.processingActionsCodebook =
          new CompanyProcessingActionsService(this.procActionController, this.companyId, this.codebookTranslations);
        // TODO: add other initializations
      },
      reason => {
        this.globalEventsManager.showLoading(false);
        throw reason;
      }
    );
  }

  async setProcessingAction(procAction: ApiProcessingAction) {

    this.selectedProcessingAction = procAction;
    this.setRequiredProcessingEvidence(procAction).then();

    if (procAction) {

      // this.clearInput();
      // this.clearOutput();

      // this.initializeFacilitiesCodebooks();

      // If there is only one appropriate input facility selected it
      // this.subscriptions.push(this.inputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
      //   if (val && val.length === 1) {
      //     this.inputFacilityForm.setValue(val[0]);
      //     this.setInputFacility(this.inputFacilityForm.value);
      //   }
      // }));

      // If there is only one appropriate output facility select it
      // this.subscriptions.push(this.outputFacilitiesCodebook.getAllCandidates().subscribe((val) => {
      //   if (val && val.length === 1 && !this.update) { this.outputFacilityForm.setValue(val[0]); }
      // }));

      // this.defineInputAndOutputSemiProduct(event).then();
      // this.setRequiredFields(event);

      if (!this.update) {
        this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTitle:Add action`;
        if (this.selectedProcessingAction.type === 'SHIPMENT') {
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.newShipmentTitle:Add shipment action`;
        }
        if (this.selectedProcessingAction.type === 'TRANSFER') {
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTransferTitle:Add transfer action`;
        }
        if (this.selectedProcessingAction.type === 'PROCESSING') {
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.newProcessingTitle:Add processing action`;
        }
        if (this.selectedProcessingAction.type === 'FINAL_PROCESSING') {
          this.title = $localize`:@@productLabelStockProcessingOrderDetail.newFinalProcessingTitle:Add final processing action`;
        }
      }
    } else {
      // this.clearInput();
      // this.clearOutput();
      // this.setRequiredFields(null);

      this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTitle:Add action`;
    }
  }

  async saveProcessingOrder() {
    // TODO: implement
  }

  dismiss() {
    this.location.back();
  }

  private async initInitialData() {

    const action = this.route.snapshot.data.action;
    if (!action) {
      return;
    }

    this.initProcEvidenceListManager();

    if (action === 'new') {

      this.update = false;
      this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTitle:Add action`;

      // TODO: handle new case

    } else if (action === 'update') {

      this.update = true;

      // TODO: handle update case

    } else {
      throw Error('Wrong action.');
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

}
