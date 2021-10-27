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
import { ProcessingActionService } from '../../../../../api-chain/api/processingAction.service';
import { defaultEmptyObject, generateFormFromMetadata } from '../../../../../shared/utils';
import { ApiProcessingActionValidationScheme } from './validation';
import { ApiSemiProduct } from '../../../../../api/model/apiSemiProduct';
import { ApiProcessingEvidenceType } from '../../../../../api/model/apiProcessingEvidenceType';
import { SemiProductService } from '../../../../../api-chain/api/semiProduct.service';
import { SemiProductControllerService } from '../../../../../api/api/semiProductController.service';
import { ActiveSemiProductsService } from '../../../../shared-services/active-semi-products.service';
import { ApiProcessingEvidenceField } from '../../../../../api/model/apiProcessingEvidenceField';
import { AuthService } from '../../../../core/auth.service';

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
  organizationId: number;
  form: FormGroup;
  action: ApiProcessingAction;

  codebookRepackedOutputs = EnumSifrant.fromObject(this.repackedOutputs);
  codebookProcessingTransaction = EnumSifrant.fromObject(this.processingTransactionType);

  activeSemiProductService: ActiveSemiProductsService;
  processingEvidenceTypeService: ProcessingEvidenceTypeService;
  processingEvidenceFieldService: ProcessingEvidenceFieldsService;
  evidenceDocInputForm: FormControl;
  evidenceFieldInputForm: FormControl;

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

  constructor(
      protected router: Router,
      protected route: ActivatedRoute,
      protected globalEventsManager: GlobalEventManagerService,
      protected codebookTranslations: CodebookTranslations,
      private processingEvidenceTypeControllerService: ProcessingEvidenceTypeControllerService,
      private processingEvidenceFieldControllerService: ProcessingEvidenceFieldControllerService,
      private processingActionControllerService: ProcessingActionControllerService,
      private processingActionService: ProcessingActionService,
      private semiProductControllerService: SemiProductControllerService,
      private semiProductService: SemiProductService,
      private cdr: ChangeDetectorRef,
      protected authService: AuthService
  ) {
    super(router, route, authService);
  }

  ngOnInit(): void {

    super.ngOnInit();

    this.globalEventsManager.showLoading(true);

    this.processingEvidenceTypeService =
        new ProcessingEvidenceTypeService(this.processingEvidenceTypeControllerService, this.codebookTranslations, 'DOCUMENT');
    this.processingEvidenceFieldService =
        new ProcessingEvidenceFieldsService(this.processingEvidenceFieldControllerService, this.codebookTranslations, null);
    this.activeSemiProductService =
        new ActiveSemiProductsService(this.semiProductControllerService, this.codebookTranslations);

    this.evidenceDocInputForm = new FormControl(null);
    this.evidenceFieldInputForm = new FormControl(null);

    this.organizationId = +this.route.snapshot.paramMap.get('id');

    this.initInitialData().then(
        () => {

          if (this.editMode) {
            this.editAction();
          } else {
            this.newAction();
          }
          this.finalizeForm();
        }
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  emptyObject() {
    const obj = defaultEmptyObject(ApiProcessingAction.formMetadata()) as ApiProcessingAction;
    obj.inputSemiProduct = defaultEmptyObject(ApiSemiProduct.formMetadata()) as ApiSemiProduct;
    obj.outputSemiProduct = defaultEmptyObject(ApiSemiProduct.formMetadata()) as ApiSemiProduct;
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

  documentFormatter = (value: any) => {
    return this.processingEvidenceTypeService.textRepresentation(value);
  }

  fieldFormatter = (value: any) => {
    return this.processingEvidenceFieldService.textRepresentation(value);
  }

  selectLanguage(lang: string) {
    this.selectedLanguage = lang;
  }

  repackedFormatter(x: any) {
    return x.value
        ? $localize`:@@companyDetailProcessingActions.singleChoice.repackedOutputs.yes:Yes`
        : $localize`:@@companyDetailProcessingActions.singleChoice.repackedOutputs.no:No`;
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

  get processingTransactionType() {
    const obj = {};
    obj['SHIPMENT'] = $localize`:@@companyDetailProcessingActions.singleChoice.type.quote:Quote`;
    obj['PROCESSING'] = $localize`:@@companyDetailProcessingActions.singleChoice.type.processing:Processing`;
    obj['TRANSFER'] = $localize`:@@companyDetailProcessingActions.singleChoice.type.transfer:Transfer`;
    return obj;
  }

  get maxOutputQuantityLabel() {
    if (!this.outputMeasurementUnit) {
      return ' ';
    }
    // Weight in kg
    return $localize`:@@companyDetailProcessingActions.field.maxOutputQuantity.label:Max output quantity in ${this.outputMeasurementUnit.label}`;
  }

  get outputMeasurementUnit() {
    if (!this.form || !this.form.get('outputSemiProduct')) {
      return;
    }
    const semi = this.form.get('outputSemiProduct').value as ApiSemiProduct;
    return semi && semi.apiMeasureUnitType;
  }

  async saveProcessingAction() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const data = this.form.value;
    if (!data.company || !data.company.id) {
      data.company = { id: this.organizationId };
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
    this.router.navigate(['companies', this.organizationId, 'processingActions']).then();
  }

  canDeactivate(): boolean {
    return true;
  }

}
