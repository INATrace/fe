import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyDetailTabManagerComponent } from '../../company-detail-tab-manager/company-detail-tab-manager.component';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { EnumSifrant } from '../../../../shared-services/enum-sifrant';
import { ProcessingEvidenceTypeService } from '../../../../shared-services/processing-evidence-types.service';
import { ProcessingEvidenceTypeControllerService } from '../../../../../api/api/processingEvidenceTypeController.service';
import { ProcessingEvidenceFieldsService } from '../../../../shared-services/processing-evidence-fields.service';
import { ProcessingEvidenceFieldControllerService } from '../../../../../api/api/processingEvidenceFieldController.service';
import { ProcessingActionControllerService } from '../../../../../api/api/processingActionController.service';
import { CodebookTranslations } from '../../../../shared-services/codebook-translations';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ApiProcessingAction } from '../../../../../api/model/apiProcessingAction';
import { take } from 'rxjs/operators';
import { defaultEmptyObject, generateFormFromMetadata } from '../../../../../shared/utils';
import { ApiProcessingActionValidationScheme } from './validation';
import { ApiSemiProduct } from '../../../../../api/model/apiSemiProduct';
import { ApiProcessingEvidenceType } from '../../../../../api/model/apiProcessingEvidenceType';
import { SemiProductControllerService } from '../../../../../api/api/semiProductController.service';
import { ActiveSemiProductsService } from '../../../../shared-services/active-semi-products.service';
import { ApiProcessingEvidenceField } from '../../../../../api/model/apiProcessingEvidenceField';
import { AuthService } from '../../../../core/auth.service';
import { ActiveValueChainService } from '../../../../shared-services/active-value-chain.service';
import { FinalProductsForCompanyService } from '../../../../shared-services/final-products-for-company.service';
import { FinalProductControllerService } from '../../../../../api/api/finalProductController.service';
import { Subscription } from 'rxjs';
import { ApiValueChain } from '../../../../../api/model/apiValueChain';

@Component({
  selector: 'app-company-detail-processing-actions',
  templateUrl: './company-detail-processing-actions-detail.component.html',
  styleUrls: ['./company-detail-processing-actions-detail.component.scss']
})
export class CompanyDetailProcessingActionsDetailComponent extends CompanyDetailTabManagerComponent implements OnInit, OnDestroy {

  rootTab = 3;
  prepared = false;
  submitted = false;

  title: string;
  editMode: boolean;
  companyId: number;
  form: FormGroup;
  action: ApiProcessingAction;

  codebookProcessingTransaction = EnumSifrant.fromObject(this.processingActionType);

  activeSemiProductService: ActiveSemiProductsService;
  processingEvidenceTypeService: ProcessingEvidenceTypeService;
  processingEvidenceFieldService: ProcessingEvidenceFieldsService;
  evidenceDocInputForm: FormControl;
  evidenceFieldInputForm: FormControl;

  finalProductsForCompanyCodebook: FinalProductsForCompanyService;

  languages = ['EN', 'DE', 'RW', 'ES'];
  selectedLanguage = 'EN';
  faTimes = faTimes;

  booleanTrue = {
    id: true,
    value: true,
  };

  booleanFalse = {
    id: false,
    value: false,
  };

  private valueChainSubs: Subscription;

  constructor(
      protected router: Router,
      protected route: ActivatedRoute,
      protected globalEventsManager: GlobalEventManagerService,
      protected codebookTranslations: CodebookTranslations,
      private processingEvidenceTypeControllerService: ProcessingEvidenceTypeControllerService,
      private processingEvidenceFieldControllerService: ProcessingEvidenceFieldControllerService,
      private processingActionControllerService: ProcessingActionControllerService,
      public valueChainCodebook: ActiveValueChainService,
      private semiProductControllerService: SemiProductControllerService,
      private finalProductController: FinalProductControllerService,
      private cdr: ChangeDetectorRef,
      protected authService: AuthService
  ) {
    super(router, route, authService);
  }

  ngOnInit(): void {

    super.ngOnInit();

    this.companyId = +this.route.snapshot.paramMap.get('id');

    this.globalEventsManager.showLoading(true);

    // Initialize codebook service for final products for the selected company
    this.finalProductsForCompanyCodebook = new FinalProductsForCompanyService(this.finalProductController, this.companyId);

    this.activeSemiProductService =
        new ActiveSemiProductsService(this.semiProductControllerService, this.codebookTranslations);
    this.evidenceDocInputForm = new FormControl(null);

    this.evidenceFieldInputForm = new FormControl(null);

    this.initInitialData().then(
        () => {
          if (this.editMode) {
            this.editAction();
          } else {
            this.newAction();
          }
          this.finalizeForm();

          this.valueChainSubs = this.form.get('valueChain').valueChanges.subscribe((valueChain: ApiValueChain) => {

            if (valueChain) {

              // Initialize codebook services for proc. evidence types and proc. evidence fields
              this.processingEvidenceTypeService =
                new ProcessingEvidenceTypeService(this.processingEvidenceTypeControllerService, this.codebookTranslations, 'DOCUMENT', valueChain.id);
              this.processingEvidenceFieldService =
                new ProcessingEvidenceFieldsService(this.processingEvidenceFieldControllerService, this.codebookTranslations, valueChain.id);

            } else {

              this.processingEvidenceTypeService = null;
              this.processingEvidenceFieldService = null;
            }
          });
        }
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.valueChainSubs) {
      this.valueChainSubs.unsubscribe();
    }
  }

  emptyObject() {
    const obj = defaultEmptyObject(ApiProcessingAction.formMetadata()) as ApiProcessingAction;
    obj.inputSemiProduct = defaultEmptyObject(ApiSemiProduct.formMetadata()) as ApiSemiProduct;
    obj.outputSemiProduct = defaultEmptyObject(ApiSemiProduct.formMetadata()) as ApiSemiProduct;
    obj.finalProductAction = false;
    return obj;
  }

  finalizeForm() {
    if (!this.form.contains('requiredEvidenceFields')) {
      this.form.addControl('requiredEvidenceFields', new FormArray([]));
    }

    if (!this.form.contains('requiredDocumentTypes')) {
      this.form.addControl('requiredDocumentTypes', new FormArray([]));
    }

    if (!this.form.contains('translations')) {
      this.form.addControl('translations', new FormArray([]));
    }

    // Create form controls
    const translations = this.form.get('translations').value;
    this.form.removeControl('translations');
    this.form.addControl('translations', new FormArray([]));
    for (const lang of this.languages) {
      const translation = translations.find(t => t.language === lang);
      (this.form.get('translations') as FormArray).push(new FormGroup({
        language: new FormControl(lang),
        name: new FormControl(translation ? translation.name : ''),
        description: new FormControl(translation ? translation.description : '')
      }));
    }

    this.prepared = true;
    this.globalEventsManager.showLoading(false);
  }

  newAction() {
    this.form = generateFormFromMetadata(ApiProcessingAction.formMetadata(), this.emptyObject(), ApiProcessingActionValidationScheme);
    this.form.get('inputSemiProduct').setValue(null);
    this.form.get('outputSemiProduct').setValue(null);
    this.form.get('maxOutputWeight').setValue(null);
    this.form.get('maxOutputWeight').disable();
  }

  editAction() {
    this.form = generateFormFromMetadata(ApiProcessingAction.formMetadata(), this.action, ApiProcessingActionValidationScheme);

    if (!this.form.get('repackedOutputs').value) {
      this.form.get('maxOutputWeight').setValue(null);
      this.form.get('maxOutputWeight').disable();
    }

    if (!this.form.get('type').value) {
      this.form.get('type').setValue('PROCESSING');
    }

    if (this.form.get('valueChain').value) {

      const valueChain = this.form.get('valueChain').value as ApiValueChain;

      // Initialize codebook services for proc. evidence types and proc. evidence fields
      this.processingEvidenceTypeService =
        new ProcessingEvidenceTypeService(this.processingEvidenceTypeControllerService, this.codebookTranslations, 'DOCUMENT', valueChain.id);
      this.processingEvidenceFieldService =
        new ProcessingEvidenceFieldsService(this.processingEvidenceFieldControllerService, this.codebookTranslations, valueChain.id);
    }
  }

  async initInitialData(){
    const action = this.route.snapshot.data.action;

    if (action === 'new') {
      this.title = $localize`:@@companyDetailProcessingActions.title.new:New processing action`;
      this.editMode = false;

    } else if (action === 'edit') {
      this.title = $localize`:@@companyDetailProcessingActions.title.edit:Edit processing action`;
      this.editMode = true;
      const paId = this.route.snapshot.params.paId;
      const resp = await this.processingActionControllerService
          .getProcessingActionDetailUsingGET(paId)
          .pipe(take(1))
          .toPromise();

      if (resp && resp.status === 'OK') {
        this.action = resp.data;
      }

    } else {
      throw Error('Wrong action.');
    }
  }

  async addSelectedEvidenceDoc(doc: ApiProcessingEvidenceType) {
    if (!doc) { return; }
    const formArray = this.form.get('requiredDocumentTypes') as FormArray;

    // If selected element is already present in array, clear input field
    if (formArray.value.some(x => x.id === doc.id)) {
      setTimeout(() => this.evidenceDocInputForm.setValue(null));
      return;
    }

    // Add selected element to array
    formArray.push(new FormControl({
      ...doc,
      mandatory: false,
      requiredOnQuote: false,
      requiredOneOfGroupIdForQuote: null
    }));
    formArray.markAsDirty();

    // Clear input field
    setTimeout(() => this.evidenceDocInputForm.setValue(null));
  }

  async removeEvidenceDoc(doc: ApiProcessingEvidenceType) {
    if (!doc) { return; }
    const formArray = this.form.get('requiredDocumentTypes') as FormArray;
    const index = (formArray.value as ApiProcessingEvidenceType[]).findIndex(x => x.id === doc.id);
    if (index >= 0) {
      formArray.removeAt(index);
      formArray.markAsDirty();
    }
  }

  async addSelectedEvidenceField(field: ApiProcessingEvidenceField) {
    if (!field) { return; }
    const formArray = this.form.get('requiredEvidenceFields') as FormArray;

    // If selected element is already present in array, clear input field
    if (formArray.value.some(x => x.id === field.id)) {
      setTimeout(() => this.evidenceFieldInputForm.setValue(null));
      return;
    }

    // Add selected element to array
    formArray.push(new FormControl({
      ...field,
      mandatory: false,
      requiredOnQuote: false
    }));
    formArray.markAsDirty();

    // Clear input field
    setTimeout(() => this.evidenceFieldInputForm.setValue(null));
  }

  async removeEvidenceField(field: ApiProcessingEvidenceField) {
    if (!field) { return; }
    const formArray = this.form.get('requiredEvidenceFields') as FormArray;
    const index = (formArray.value as ApiProcessingEvidenceField[]).findIndex(x => x.id === field.id);
    if (index >= 0) {
      formArray.removeAt(index);
      formArray.markAsDirty();
    }
  }

  groupDecided(doc: ApiProcessingEvidenceType) {
    if (doc.requiredOneOfGroupIdForQuote) {
      doc.requiredOneOfGroupIdForQuote = null;
      return;
    }
    doc.requiredOnQuote = null;
    let group = 1;
    const lst: ApiProcessingEvidenceType[] = this.form.get('requiredDocumentTypes').value || [];
    const res = lst.map(x => x.requiredOneOfGroupIdForQuote)
        .filter(x => x && /^\+?(0|[1-9]\d*)$/.test(x))
        .map(x => Number(x));
    if (res.length === 0) {
      doc.requiredOneOfGroupIdForQuote = '' + group;
    } else {
      group = Math.max(...res) + 1;
      doc.requiredOneOfGroupIdForQuote = '' + group;
    }
    this.cdr.detectChanges();
  }

  cbSelectedSP(sp, i: number, mode: 'mandatory' | 'quote') {
    if (mode === 'mandatory') {
      sp.mandatory = !sp.mandatory;
    }
    if (mode === 'quote') {
      sp.requiredOnQuote = !sp.requiredOnQuote;
      if (sp.requiredOnQuote) {
        sp.requiredOneOfGroupIdForQuote = null;
      }
    }
  }

  changeRequiredOneOf(event: string, sp) {
    sp.requiredOneOfGroupIdForQuote = event;
  }

  selectLanguage(lang: string) {
    this.selectedLanguage = lang;
  }

  repackedFormatter(x: any) {
    return x.value
        ? $localize`:@@companyDetailProcessingActions.singleChoice.repackedOutputs.yes:Yes`
        : $localize`:@@companyDetailProcessingActions.singleChoice.repackedOutputs.no:No`;
  }

  finalProductActionFormatter(x: any) {
    return x.value
      ? $localize`:@@companyDetailProcessingActions.singleChoice.finalProductAction.yes:Yes`
      : $localize`:@@companyDetailProcessingActions.singleChoice.finalProductAction.no:No`;
  }

  repackedOutputsSet(x: any) {
    if (!x || !x.value) {
      this.form.get('maxOutputWeight').setValue(null);
      this.form.get('maxOutputWeight').disable();
    } else {
      this.form.get('maxOutputWeight').enable();
    }
  }

  get repackedOutputs() {
    const obj = {};
    obj['YES'] = $localize`:@@companyDetailProcessingActions.singleChoice.repackedOutputs.yes:Yes`;
    obj['NO'] = $localize`:@@companyDetailProcessingActions.singleChoice.repackedOutputs.no:No`;
    return obj;
  }

  get processingActionType() {
    const obj = {};
    obj['SHIPMENT'] = $localize`:@@companyDetailProcessingActions.singleChoice.type.quote:Quote`;
    obj['PROCESSING'] = $localize`:@@companyDetailProcessingActions.singleChoice.type.processing:Processing`;
    obj['FINAL_PROCESSING'] = $localize`:@@companyDetailProcessingActions.singleChoice.type.finalProcessing:Final processing`;
    obj['TRANSFER'] = $localize`:@@companyDetailProcessingActions.singleChoice.type.transfer:Transfer`;
    obj['GENERATE_QR_CODE'] = $localize`:@@companyDetailProcessingActions.singleChoice.type.generateQrCode:Generate QR code`;
    return obj;
  }

  get outputMeasurementUnit() {
    if (!this.form || !this.form.get('outputSemiProduct')) {
      return;
    }
    const semi = this.form.get('outputSemiProduct').value as ApiSemiProduct;
    return semi && semi.measurementUnitType;
  }

  get maxOutputQuantityLabel() {
    if (!this.outputMeasurementUnit) {
      return ' ';
    }
    // Weight in kg
    return $localize`:@@companyDetailProcessingActions.field.maxOutputQuantity.label:Max output quantity in ${this.outputMeasurementUnit.label}`;
  }

  get estimatedOutputQuantityLabel() {
    const outputMeasureUnitLabel = this.outputMeasurementUnit?.label;
    return $localize`:@@companyDetailProcessingActions.textInput.estimatedOutputQuantity.label:Estimated output quantity per` +
      ` ${outputMeasureUnitLabel ? outputMeasureUnitLabel : '-'}`;
  }

  async saveProcessingAction() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const data = this.form.value;
    if (!data.company || !data.company.id) {
      data.company = { id: this.companyId };
    }

    try {
      this.globalEventsManager.showLoading(true);
      const res = await this.processingActionControllerService
          .createOrUpdateProcessingActionUsingPUT(data)
          .pipe(take(1))
          .toPromise();

      if (res && res.status === 'OK') {
        this.goBack();
      }
    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

  goBack() {
    this.router.navigate(['companies', this.companyId, 'processingActions']).then();
  }

  canDeactivate(): boolean {
    return true;
  }

}
