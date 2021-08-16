import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash-es';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ProcessingActionService } from 'src/api-chain/api/processingAction.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { UserService } from 'src/api-chain/api/user.service';
import { ChainProcessingAction } from 'src/api-chain/model/chainProcessingAction';
import { ChainProcessingEvidenceType } from 'src/api-chain/model/chainProcessingEvidenceType';
import { ChainSemiProduct } from 'src/api-chain/model/chainSemiProduct';
import { DocTypeIdsWithRequired } from 'src/api-chain/model/docTypeIdsWithRequired';
import { FieldDefinition } from 'src/api-chain/model/fieldDefinition';
import { ActiveSemiProductsForProductServiceStandalone } from 'src/app/shared-services/active-semi-products-for-product-standalone.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { codeToFieldInfo, codeToFieldInfoList } from 'src/app/shared-services/document-translations.service';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { ProcessingEvidenceTypeService } from 'src/app/shared-services/processing_evidence_types.service';
import { AuthService } from 'src/app/system/auth.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { ProcessingActionType } from 'src/shared/types';
import { dbKey, defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ChainProcessingActionValidationScheme } from './validation';
import { ProcessingEvidenceTypeControllerService } from '../../../../../api/api/processingEvidenceTypeController.service';

interface FieldSelector {
  id: string;
  selected: boolean;
  mandatory: boolean;
  requiredOnQuote: boolean;
}

type SelectionMode = 'required' | 'mandatory' | 'requiredOnQuote';

// temporary stored here - to remember field type for "future"
// Price(RWF) / kg for Owner - stevilka, lahko decimal
// Price(EUR) / kg for Buyer - stevilka, lahko decimal
// Exchange rate at Buyer(1 EUR = X RWF) - stevilka, lahko decimal
// Price(EUR) / kg for End customer - stevilka, lahko decimal
// Exchange rate at End customer(1 EUR = X RWF) - stevilka, lahko decimal
// Cupping results - text area
// Cupping grade - input field
// Cupping flavour - text area
// Roasting date - datum picker
// Roasting profile - text area
// Shipper details - input field
// Carrier details - input field
// Port of loading - input field
// Port of discharge - input field
// Location of the end delivery - input field

// Here all fields should be configured

@Component({
  selector: 'app-product-label-stock-processing-action-detail',
  templateUrl: './product-label-stock-processing-action-detail.component.html',
  styleUrls: ['./product-label-stock-processing-action-detail.component.scss']
})
export class ProductLabelStockProcessingActionDetailComponent implements OnInit, OnDestroy {

  organizationId: string;
  productId: number;
  title: string;
  submitted = false;
  update: boolean;
  action: ChainProcessingAction;
  chainProductId: string;
  form: FormGroup;
  requiredFields: FieldSelector[] = [];
  requiredFieldsDE: FieldSelector[] = [];
  // repackedOutputsForm = new FormControl(null);
  faTimes = faTimes;
  subConditional: Subscription;
  processingEvidenceTypeService: ProcessingEvidenceTypeService;

  codebookRepackedOutputs = EnumSifrant.fromObject(this.repackedOutputs);

  docTypeForm = new FormControl(null);

  activeSemiProducstForProduct;

  booleanTrue = {
    id: true,
    value: true,
    // icon: "check",
    // class: "text-primary"
  };

  booleanFalse = {
    id: false,
    value: false,
    // icon: "times",
    // class: "text-secondary"
  };

  codebookProcessingTransaction = EnumSifrant.fromObject(this.procesingTransactionType);

  codebookIcons = EnumSifrant.fromObject(this.iconCode);

  constructor(
    private chainProcessingActionService: ProcessingActionService,
    private globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private location: Location,
    private chainProductService: ProductService,
    private chainUserService: UserService,
    public authService: AuthService,
    private chainSemiproductService: SemiProductService,
    private codebookTranslations: CodebookTranslations,
    private cdr: ChangeDetectorRef,
    private processingEvidenceTypeControllerService: ProcessingEvidenceTypeControllerService
  ) { }

  ngOnInit(): void {
    this.processingEvidenceTypeService =
        new ProcessingEvidenceTypeService(this.processingEvidenceTypeControllerService, this.codebookTranslations, 'DOCUMENT');
    this.requiredFields = codeToFieldInfoList.filter(x => x.group === 'FIRST').map(x => {
      return {
        id: x.id,
        selected: false,
        mandatory: false,
        requiredOnQuote: false
      };
    });
    this.requiredFieldsDE = codeToFieldInfoList.filter(x => x.group === 'SECOND').map(x => {
      return {
        id: x.id,
        selected: false,
        mandatory: false,
        requiredOnQuote: false
      };
    });

    this.initInitialData().then(
      () => {
        if (this.update) {
          this.editAction();
        } else {
          this.newAction();
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.subConditional) { this.subConditional.unsubscribe(); }
  }

  async initInitialData() {

    const action = this.route.snapshot.data.action;
    if (!action) { return; }
    // standalone on route
    this.productId = this.route.snapshot.params.id;
    if (action === 'new') {
      this.title = $localize`:@@productLabelProcessingAction.newProcessingAction.newTitle:New processing action`;
      this.update = false;
    } else if (action === 'update') {
      this.title = $localize`:@@productLabelProcessingAction.newProcessingAction.editTitle:Edit processing action`;
      this.update = true;
      const resp = await this.chainProcessingActionService
          .getProcessingAction(this.route.snapshot.params.processingTransactionId).pipe(take(1)).toPromise();
      if (resp && resp.status === 'OK') {
        this.action = resp.data;
      }
    } else {
      throw Error('Wrong action.');
    }
    const res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data && dbKey(res.data)) {
      this.chainProductId = dbKey(res.data);
    }
    this.activeSemiProducstForProduct =
        new ActiveSemiProductsForProductServiceStandalone(this.chainSemiproductService, this.chainProductId, this.codebookTranslations);
  }

  emptyObject() {
    const obj = defaultEmptyObject(ChainProcessingAction.formMetadata()) as ChainProcessingAction;
    obj.inputSemiProduct = defaultEmptyObject(ChainSemiProduct.formMetadata()) as ChainSemiProduct;
    obj.outputSemiProduct = defaultEmptyObject(ChainSemiProduct.formMetadata()) as ChainSemiProduct;
    return obj;
  }

  newAction() {
    this.form = generateFormFromMetadata(ChainProcessingAction.formMetadata(), this.emptyObject(), ChainProcessingActionValidationScheme);
    this.form.get('inputSemiProduct').setValue(null);
    this.form.get('outputSemiProduct').setValue(null);
    this.form.get('maxOutputWeight').disable();
    // this.conditionalValidators();
  }

  editAction() {
    this.form = generateFormFromMetadata(ChainProcessingAction.formMetadata(), this.action, ChainProcessingActionValidationScheme);
    // this.conditionalValidators();
    this.prepareRequiredFields();
    this.prepareDocs();
    if (!this.form.get('repackedOutputs').value) {
      this.form.get('maxOutputWeight').disable();
    }
    // this.prepareRepacked();
    if (!this.form.get('type').value) { // legacy
      // if (this.form.get('repackedOutputs').value) {
      //   this.form.get('type').setValue('TRANSFER')
      // }
      this.form.get('type').setValue('PROCESSING');
    }
  }

  get outputMeasurementUnit() {
    if (!this.form || !this.form.get('outputSemiProduct')) { return; }
    const semi = this.form.get('outputSemiProduct').value as ChainSemiProduct;
    return semi && semi.measurementUnitType;
  }
  get maxOutputQuantityLabel() {
    if (!this.outputMeasurementUnit) { return null; }
    return $localize`:@@productLabelProcessingAction.newProcessingAction.field.maxOutputQuantityLabel:Max output quantity in ${this.outputMeasurementUnit.label}`;
    // Max output weight in kg
  }

  dismiss() {
    this.location.back();
  }

  async updateEntity() {
    this.submitted = true;
    const data = await this.prepareData();
    // console.log("form:", this.form)
    if (this.form.invalid) { return; }
    try {
      this.globalEventsManager.showLoading(true);
      const res = await this.chainProcessingActionService.postProcessingAction(data).pipe(take(1)).toPromise();
      if (res && res.status === 'OK') {
        this.dismiss();
      }
    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

  async prepareData() {
    if (!this.update) {
      this.form.get('productId').setValue(this.chainProductId);
      this.form.get('organizationId').setValue(localStorage.getItem('selectedUserCompany'));
    }

    const maxOutputWeight = this.form.get('maxOutputWeight').value;
    if (maxOutputWeight) { this.form.get('maxOutputWeight').setValue(parseFloat(maxOutputWeight)); }

    if (this.form.get('inputSemiProduct').value) {
      this.form.get('inputSemiProductId').setValue(dbKey(this.form.get('inputSemiProduct').value));
    }
    if (this.transactionType === 'PROCESSING') {
      if (this.form.get('outputSemiProduct').value) {
        this.form.get('outputSemiProductId').setValue(dbKey(this.form.get('outputSemiProduct').value));
      }
    } else {
      if (this.form.get('inputSemiProduct').value) {
        this.form.get('outputSemiProductId').setValue(dbKey(this.form.get('inputSemiProduct').value));
      }
    }

    if (this.transactionType === 'SHIPMENT') {
      this.form.get('repackedOutputs').setValue(false);
    }

    if (this.update && this.authService.currentUserProfile) {
      const res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) { this.form.get('userChangedId').setValue(dbKey(res.data)); }
    } else if (this.authService.currentUserProfile) {
      const res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) { this.form.get('userCreatedId').setValue(dbKey(res.data)); }
    }

    (this.form.get('requiredFields') as FormArray).clear();
    for (const item of this.requiredFields) {
      if (item.selected || item.requiredOnQuote) {
        (this.form.get('requiredFields') as FormArray).push(new FormControl({
          label: item.id,
          type: 'text',
          required: item.selected,
          mandatory: item.mandatory,
          requiredOnQuote: item.requiredOnQuote,
        }));
      }
    }

    for (const item of this.requiredFieldsDE) {
      if (item.selected || item.requiredOnQuote) {
        (this.form.get('requiredFields') as FormArray).push(new FormControl({
          label: item.id,
          type: 'text',
          required: item.selected,
          mandatory: item.mandatory,
          requiredOnQuote: item.requiredOnQuote,
        }));
      }
    }

    (this.form.get('requiredDocTypeIds') as FormArray).clear();
    (this.form.get('requiredDocTypeIdsWithRequired') as FormArray).clear();
    if (this.form.get('requiredDocTypes') && this.form.get('requiredDocTypes').value.length > 0) {
      for (const doc of this.form.get('requiredDocTypes').value as ChainProcessingEvidenceType[]) {
        (this.form.get('requiredDocTypeIds') as FormArray).push(new FormControl(dbKey(doc)));
        (this.form.get('requiredDocTypeIdsWithRequired') as FormArray).push(new FormControl({
          processingEvidenceTypeId: dbKey(doc),
          required: doc.required,
          requiredOnQuote: doc.requiredOnQuote,
          requiredOneOfGroupIdForQuote: doc.requiredOneOfGroupIdForQuote
        } as DocTypeIdsWithRequired));
      }
    }

    const data = _.cloneDeep(this.form.value);
    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);
    return data;
  }

  prepareDocs() {
    if (this.form.get('requiredDocTypes') && this.form.get('requiredDocTypes').value.length > 0) {
      if (this.form.get('requiredDocTypeIdsWithRequired') && this.form.get('requiredDocTypeIdsWithRequired').value.length > 0) {
        for (const control of (this.form.get('requiredDocTypes') as FormArray).controls) {
          for (const docReq of this.form.get('requiredDocTypeIdsWithRequired').value as DocTypeIdsWithRequired[]) {
            if (dbKey(control.value) === docReq.processingEvidenceTypeId) {
              control.setValue({
                ...control.value,
                required: docReq.required,
                requiredOnQuote: docReq.requiredOnQuote,
                requiredOneOfGroupIdForQuote: docReq.requiredOneOfGroupIdForQuote
              });
              control.updateValueAndValidity();
            }
          }
        }
      }
    }
  }

  prepareRequiredFields() {

    const currentMap = new Map<string, FieldDefinition>();
    (this.form.get('requiredFields').value as FieldDefinition[]).forEach(val => {
      currentMap.set(val.label, val);
    });

    this.requiredFields = this.requiredFields.map(val => {
      const read = currentMap.get(val.id);
      if (!read) { return val; }
      return {
        id: val.id,
        selected: read.required,
        mandatory: read.mandatory,
        requiredOnQuote: read.requiredOnQuote
      };
    });
    this.requiredFieldsDE = this.requiredFieldsDE.map(val => {
      const read = currentMap.get(val.id);
      if (!read) { return val; }
      return {
        id: val.id,
        selected: read.required,
        mandatory: read.mandatory,
        requiredOnQuote: read.requiredOnQuote
      };
    });
  }

  fieldName(item) {

    if (item.id === 'PREFILL_OUTPUT_FACILITY') {
      return $localize`:@@productLabelProcessingAction.newProcessingAction.field.prefillOutputFacility:Prefill output facility with the input facility `;
    }
    const info = codeToFieldInfo[item.id];
    if (!info) { return item.id; }
    return info.label;
  }

  cbSelected(index: number, mode: SelectionMode) {
    if (mode === 'required') {
      this.requiredFields[index].selected = !this.requiredFields[index].selected;
      if (!this.requiredFields[index].selected) {
        this.requiredFields[index].mandatory = false;
      }
    }
    if (mode === 'mandatory') {
      this.requiredFields[index].mandatory = !this.requiredFields[index].mandatory;
      if (this.requiredFields[index].mandatory) {
        this.requiredFields[index].selected = true;
      }
    }
    if (mode === 'requiredOnQuote') {
      this.requiredFields[index].requiredOnQuote = !this.requiredFields[index].requiredOnQuote;
    }
  }

  cbSelectedDE(index: number, mode: SelectionMode) {
    if (mode === 'required') {
      this.requiredFieldsDE[index].selected = !this.requiredFieldsDE[index].selected;
      if (!this.requiredFieldsDE[index].selected) {
        this.requiredFieldsDE[index].mandatory = false;
      }
    }
    if (mode === 'mandatory') {
      this.requiredFieldsDE[index].mandatory = !this.requiredFieldsDE[index].mandatory;
      if (this.requiredFieldsDE[index].mandatory) {
        this.requiredFieldsDE[index].selected = true;
      }
    }
    if (mode === 'requiredOnQuote') {
      this.requiredFieldsDE[index].requiredOnQuote = !this.requiredFieldsDE[index].requiredOnQuote;
    }
  }

  get repackedOutputs() {
    const obj = {};
    obj['YES'] = $localize`:@@productLabelProcessingAction.repackedOutputs.yes:Yes`;
    obj['NO'] = $localize`:@@productLabelProcessingAction.repackedOutputs.no:No`;
    return obj;
  }

  typeResultFormatter = (value: any) => {
    return this.processingEvidenceTypeService.textRepresentation(value);
  }

  typeInputFormatter = (value: any) => {
    return this.processingEvidenceTypeService.textRepresentation(value);
  }

  //// temp

  async addSelectedType(sp: ChainProcessingEvidenceType) {
    if (!sp) { return; }
    const formArray = this.form.get('requiredDocTypes') as FormArray;
    if (formArray.value.some(x => dbKey(x) === dbKey(sp))) {
      this.docTypeForm.setValue(null);
      return;
    }
    // sp.required = true;
    formArray.push(new FormControl({
      ...sp,
      required: false,
      requiredOnQuote: false,
    }));
    formArray.markAsDirty();

    setTimeout(() => this.docTypeForm.setValue(null));
  }

  async deleteDocType(sp: ChainProcessingEvidenceType) {
    if (!sp) { return; }
    const formArray = this.form.get('requiredDocTypes') as FormArray;
    const index = (formArray.value as ChainProcessingEvidenceType[]).findIndex(x => dbKey(x) === dbKey(sp));
    if (index >= 0) {
      formArray.removeAt(index);
      formArray.markAsDirty();
    }
  }

  cbSelectedSP(sp, i: number, mode: 'mandatory' | 'quote') {
    if (mode === 'mandatory') {
      sp.required = !sp.required;
    }
    if (mode === 'quote') {
      sp.requiredOnQuote = !sp.requiredOnQuote;
      if (sp.requiredOnQuote) {
        sp.requiredOneOfGroupIdForQuote = null;
      }
    }
  }

  repackedFormatter = (x: any) => x.value
    ? $localize`:@@productLabelProcessingAction.repackedOutputs.yes:Yes`
    : $localize`:@@productLabelProcessingAction.repackedOutputs.no:No`

  setRepacked(event) {
    this.form.get('repackedOutputs').setValue(event ? (event === 'YES' ? true : false) : null);
    if (!event || event === 'NO') { this.form.get('maxOutputWeight').setValue(null); }
  }

  get procesingTransactionType() {
    let obj = {};
    obj['SHIPMENT'] = $localize`:@@productLabelProcessingAction.procesingTransactionType.quote:Quote`;
    obj['PROCESSING'] = $localize`:@@productLabelProcessingAction.procesingTransactionType.processing:Processing`;
    obj['TRANSFER'] = $localize`:@@productLabelProcessingAction.procesingTransactionType.transfer:Transfer`;
    return obj;
  }

  get transactionType(): ProcessingActionType {
    return this.form.get('type') && this.form.get('type').value;
  }

  changeTransactionType(type: ProcessingActionType) {
    // not used
  }

  repackedOutputsSet(value: any) {
    if (!value || !value.value) {
      this.form.get('maxOutputWeight').setValue(null);
      this.form.get('maxOutputWeight').disable();
    } else {
      this.form.get('maxOutputWeight').enable();
    }
  }

  changeRequiredOneOf(event: string, sp, i: number) {
    sp.requiredOneOfGroupIdForQuote = event;
    // sp.requiredOnQuote = !!event
  }

  groupDecided(sp, i) {
    if (sp.requiredOneOfGroupIdForQuote) {
      sp.requiredOneOfGroupIdForQuote = null;
      return;
    }
    sp.requiredOnQuote = null;
    let group = 1;
    const lst: ChainProcessingEvidenceType[] = this.form.get('requiredDocTypes').value || [];
    // console.log("LST:",lst.map(x => x.requiredOneOfGroupIdForQuote).filter(x => x && /^\+?(0|[1-9]\d*)$/.test(x)))
    const res = lst.map(x => x.requiredOneOfGroupIdForQuote).filter(x => x && /^\+?(0|[1-9]\d*)$/.test(x)).map(x => parseInt(x));
    if (res.length === 0) {
      sp.requiredOneOfGroupIdForQuote = '' + group;
    } else {
      group = Math.max(...res) + 1;
      sp.requiredOneOfGroupIdForQuote = '' + group;
    }
    this.cdr.detectChanges();
  }

  get iconCode() {
    const obj = {};
    obj['SHIP'] = $localize`:@@productLabelProcessingAction.timelineIcon.ship:Ship`;
    obj['LEAF'] = $localize`:@@productLabelProcessingAction.timelineIcon.leaf:Leaf`;
    obj['WAREHOUSE'] = $localize`:@@productLabelProcessingAction.timelineIcon.warehouse:Warehouse`;
    obj['QRCODE'] = $localize`:@@productLabelProcessingAction.timelineIcon.qrCode:QR code`;
    obj['OTHER'] = $localize`:@@productLabelProcessingAction.timelineIcon.other:Other`;
    return obj;
  }

}
