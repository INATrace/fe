import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash-es';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CodebookService } from 'src/api-chain/api/codebook.service';
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
import { ProcessingEvidenceTypeaService } from 'src/app/shared-services/processing_evidence_types.service';
import { AuthService } from 'src/app/system/auth.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { ProcessingActionType } from 'src/shared/types';
import { dbKey, defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ChainProcessingActionValidationScheme } from './validation';


interface FieldSelector {
  id: string;
  selected: boolean;
  mandatory: boolean;
  requiredOnQuote: boolean
}

type SelectionMode = 'required' | 'mandatory' | 'requiredOnQuote'

//temporary stored here - to remember field type for "future"
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
export class ProductLabelStockProcessingActionDetailComponent implements OnInit {

  organizationId: string;
  productId: number;
  title: string;
  submitted: boolean = false;
  update: boolean;
  action: ChainProcessingAction;
  chainProductId: string;
  form: FormGroup;
  requiredFields: FieldSelector[] = [];
  requiredFieldsDE: FieldSelector[] = [];
  // repackedOutputsForm = new FormControl(null);
  faTimes = faTimes;
  subConditional: Subscription;
  processingEvidenceTypeaService: ProcessingEvidenceTypeaService;

  activeSemiProducstForProduct;
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
    private chainCodebookService: CodebookService
  ) {
    this.requiredFields
  }


  ngOnInit(): void {
    this.processingEvidenceTypeaService = new ProcessingEvidenceTypeaService(this.chainCodebookService, this.codebookTranslations, 'DOCUMENT');
    this.requiredFields = codeToFieldInfoList.filter(x => x.group === 'FIRST').map(x => {
      return {
        id: x.id,
        selected: false,
        mandatory: false,
        requiredOnQuote: false
      }
    })
    this.requiredFieldsDE = codeToFieldInfoList.filter(x => x.group === 'SECOND').map(x => {
      return {
        id: x.id,
        selected: false,
        mandatory: false,
        requiredOnQuote: false
      }
    })

    this.initInitialData().then(
      (resp: any) => {
        if (this.update) {
          this.editAction();
        } else {
          this.newAction();
        }
      }
    )
  }

  ngOnDestroy() {
    if (this.subConditional) this.subConditional.unsubscribe();
  }

  async initInitialData() {

    let action = this.route.snapshot.data.action
    if (!action) return;
    // standalone on route
    this.productId = this.route.snapshot.params.id
    if (action === 'new') {
      this.title = $localize`:@@productLabelProcessingAction.newProcessingAction.newTitle:New processing action`;
      this.update = false;
    } else if (action == 'update') {
      this.title = $localize`:@@productLabelProcessingAction.newProcessingAction.editTitle:Edit processing action`;
      this.update = true;
      let resp = await this.chainProcessingActionService.getProcessingAction(this.route.snapshot.params.processingTransactionId).pipe(take(1)).toPromise()
      if (resp && resp.status === 'OK') {
        this.action = resp.data;
      }
    } else {
      throw Error("Wrong action.")
    }
    let res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    if (res && res.status === "OK" && res.data && dbKey(res.data)) {
      this.chainProductId = dbKey(res.data);
    }
    this.activeSemiProducstForProduct = new ActiveSemiProductsForProductServiceStandalone(this.chainSemiproductService, this.chainProductId, this.codebookTranslations)
  }

  emptyObject() {
    let obj = defaultEmptyObject(ChainProcessingAction.formMetadata()) as ChainProcessingAction;
    obj.inputSemiProduct = defaultEmptyObject(ChainSemiProduct.formMetadata()) as ChainSemiProduct;
    obj.outputSemiProduct = defaultEmptyObject(ChainSemiProduct.formMetadata()) as ChainSemiProduct;
    return obj;
  }

  newAction() {
    this.form = generateFormFromMetadata(ChainProcessingAction.formMetadata(), this.emptyObject(), ChainProcessingActionValidationScheme)
    this.form.get('inputSemiProduct').setValue(null);
    this.form.get('outputSemiProduct').setValue(null);
    this.form.get('maxOutputWeight').disable()
    // this.conditionalValidators();
  }

  editAction() {
    this.form = generateFormFromMetadata(ChainProcessingAction.formMetadata(), this.action, ChainProcessingActionValidationScheme)
    // this.conditionalValidators();
    this.prepareRequiredFields();
    this.prepareDocs();
    if (!this.form.get('repackedOutputs').value) {
      this.form.get('maxOutputWeight').disable()
    }
    // this.prepareRepacked();
    if (!this.form.get('type').value) { // legacy
      // if (this.form.get('repackedOutputs').value) {
      //   this.form.get('type').setValue('TRANSFER')
      // }
      this.form.get('type').setValue('PROCESSING')
    }

  }

  get outputMeasurementUnit() {
    if(!this.form || !this.form.get('outputSemiProduct')) return
    let semi = this.form.get('outputSemiProduct').value as ChainSemiProduct
    return semi && semi.measurementUnitType
  }
  get maxOutputQuantityLabel() {
    if(!this.outputMeasurementUnit) return null
    return $localize`:@@productLabelProcessingAction.newProcessingAction.field.maxOutputQuantityLabel:Max output quantity in ${this.outputMeasurementUnit.label}`;
    // Max output weight in kg
  }

  dismiss() {
    this.location.back()
  }

  async updateEntity() {
    this.submitted = true;
    let data = await this.prepareData();
    // console.log("form:", this.form)
    if (this.form.invalid) return;
    try {
      this.globalEventsManager.showLoading(true);
      let res = await this.chainProcessingActionService.postProcessingAction(data).pipe(take(1)).toPromise();
      if (res && res.status == 'OK') {
        this.dismiss();
      }
    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

  async prepareData() {
    if (!this.update) {
      this.form.get('productId').setValue(this.chainProductId);
      this.form.get('organizationId').setValue(localStorage.getItem("selectedUserCompany"));
    }

    let maxOutputWeight = this.form.get('maxOutputWeight').value;
    if (maxOutputWeight) this.form.get('maxOutputWeight').setValue(parseFloat(maxOutputWeight));

    if (this.form.get('inputSemiProduct').value) this.form.get('inputSemiProductId').setValue(dbKey(this.form.get('inputSemiProduct').value));
    if (this.transactionType === 'PROCESSING') {
      if (this.form.get('outputSemiProduct').value) this.form.get('outputSemiProductId').setValue(dbKey(this.form.get('outputSemiProduct').value));
    } else {
      if (this.form.get('inputSemiProduct').value) this.form.get('outputSemiProductId').setValue(dbKey(this.form.get('inputSemiProduct').value));
    }

    if (this.transactionType === 'SHIPMENT') {
      this.form.get('repackedOutputs').setValue(false)
    }
    // if(this.transactionType === 'TRANSFER') {
    //   this.form.get('repackedOutputs').setValue(true)
    // } else {
    //   this.form.get('repackedOutputs').setValue(false)
    // }

    if (this.update && this.authService.currentUserProfile) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) { this.form.get('userChangedId').setValue(dbKey(res.data)); }
    } else if (this.authService.currentUserProfile) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) { this.form.get('userCreatedId').setValue(dbKey(res.data)); }
    }

    (this.form.get('requiredFields') as FormArray).clear();
    for (let item of this.requiredFields) {
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
    for (let item of this.requiredFieldsDE) {
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
      for (let doc of this.form.get('requiredDocTypes').value as ChainProcessingEvidenceType[]) {
        (this.form.get('requiredDocTypeIds') as FormArray).push(new FormControl(dbKey(doc)));
        (this.form.get('requiredDocTypeIdsWithRequired') as FormArray).push(new FormControl({
          processingEvidenceTypeId: dbKey(doc),
          required: doc.required,
          requiredOnQuote: doc.requiredOnQuote,
          requiredOneOfGroupIdForQuote: doc.requiredOneOfGroupIdForQuote
        } as DocTypeIdsWithRequired));
      }
    }

    let data = _.cloneDeep(this.form.value);
    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);
    return data;
  }

  prepareDocs() {
    if (this.form.get('requiredDocTypes') && this.form.get('requiredDocTypes').value.length > 0) {
      if (this.form.get('requiredDocTypeIdsWithRequired') && this.form.get('requiredDocTypeIdsWithRequired').value.length > 0) {
        for (let control of (this.form.get('requiredDocTypes') as FormArray).controls) {
          for (let docReq of this.form.get('requiredDocTypeIdsWithRequired').value as DocTypeIdsWithRequired[]) {
            if (dbKey(control.value) == docReq.processingEvidenceTypeId) {
              control.setValue({
                ...control.value,
                required: docReq.required,
                requiredOnQuote: docReq.requiredOnQuote,
                requiredOneOfGroupIdForQuote: docReq.requiredOneOfGroupIdForQuote
              });
              control.updateValueAndValidity()
            }
          }
        }
      }
    }
  }

  // prepareRepacked() {
  //   this.repackedOutputsForm.setValue(this.form.get('repackedOutputs').value ? (this.form.get('repackedOutputs').value ? 'YES' : 'NO') : null);
  // }

  prepareRequiredFields() {

    let currentMap = new Map<string, FieldDefinition>();
    (this.form.get('requiredFields').value as FieldDefinition[]).forEach(val => {
      currentMap.set(val.label, val)
    })
    this.requiredFields = this.requiredFields.map(val => {
      let read = currentMap.get(val.id)
      if (!read) return val
      return {
        id: val.id,
        selected: read.required,
        mandatory: read.mandatory,
        requiredOnQuote: read.requiredOnQuote
      }
    })
    this.requiredFieldsDE = this.requiredFieldsDE.map(val => {
      let read = currentMap.get(val.id)
      if (!read) return val
      return {
        id: val.id,
        selected: read.required,
        mandatory: read.mandatory,
        requiredOnQuote: read.requiredOnQuote
      }
    })

    // for (let field of (this.form.get('requiredFields') as FormArray).value) {
    //   for (let item of this.requiredFields) {
    //     if (field.label === 'GRADE' && item.id === 'GRADE') item.selected = true;
    //     else if (field.label === 'LOT_EXPORT_NUMBER' && item.id === 'LOT_EXPORT_NUMBER') item.selected = true;
    //     else if (field.label === 'PRICE_PER_UNIT' && item.id === 'PRICE_PER_UNIT') item.selected = true;
    //     else if (field.label === 'SCREEN_SIZE' && item.id === 'SCREEN_SIZE') item.selected = true;
    //     else if (field.label === 'LOT_LABEL' && item.id === 'LOT_LABEL') item.selected = true;
    //     else if (field.label === 'START_OF_DRYING' && item.id === 'START_OF_DRYING') item.selected = true;
    //     else if (field.label === 'CLIENT_NAME' && item.id === 'CLIENT_NAME') item.selected = true;
    //     else if (field.label === 'CERTIFICATES_IDS' && item.id === 'CERTIFICATES_IDS') item.selected = true;
    //     else if (field.label === 'PREFILL_OUTPUT_FACILITY' && item.id === 'PREFILL_OUTPUT_FACILITY') item.selected = true;
    //     else if (field.label === 'TRANSACTION_TYPE' && item.id === 'TRANSACTION_TYPE') item.selected = true;
    //     else if (field.label === 'FLAVOUR_PROFILE' && item.id === 'FLAVOUR_PROFILE') item.selected = true;
    //   }
    //   for (let item of this.requiredFieldsDE) {
    //     if (field.label === 'PRICE_FOR_OWNER' && item.id === 'PRICE_FOR_OWNER') item.selected = true;
    //     else if (field.label === 'PRICE_FOR_BUYER' && item.id === 'PRICE_FOR_BUYER') item.selected = true;
    //     else if (field.label === 'EXC_RATE_AT_BUYER' && item.id === 'EXC_RATE_AT_BUYER') item.selected = true;
    //     else if (field.label === 'PRICE_FOR_END_CUSTOMER' && item.id === 'PRICE_FOR_END_CUSTOMER') item.selected = true;
    //     else if (field.label === 'EXC_RATE_AT_END_CUSTOMER' && item.id === 'EXC_RATE_AT_END_CUSTOMER') item.selected = true;
    //     else if (field.label === 'CUPPING_RESULT' && item.id === 'CUPPING_RESULT') item.selected = true;
    //     else if (field.label === 'CUPPING_GRADE' && item.id === 'CUPPING_GRADE') item.selected = true;
    //     else if (field.label === 'CUPPING_FLAVOUR' && item.id === 'CUPPING_FLAVOUR') item.selected = true;
    //     else if (field.label === 'ROASTING_DATE' && item.id === 'ROASTING_DATE') item.selected = true;
    //     else if (field.label === 'ROASTING_PROFILE' && item.id === 'ROASTING_PROFILE') item.selected = true;
    //     else if (field.label === 'SHIPPER_DETAILS' && item.id === 'SHIPPER_DETAILS') item.selected = true;
    //     else if (field.label === 'CARRIER_DETAILS' && item.id === 'CARRIER_DETAILS') item.selected = true;
    //     else if (field.label === 'PORT_OF_LOADING' && item.id === 'PORT_OF_LOADING') item.selected = true;
    //     else if (field.label === 'PORT_OF_DISCHARGE' && item.id === 'PORT_OF_DISCHARGE') item.selected = true;
    //     else if (field.label === 'LOCATION_OF_END_DELIVERY' && item.id === 'LOCATION_OF_END_DELIVERY') item.selected = true;
    //   }
    // }

  }

  fieldName(item) {

    if (item.id === 'PREFILL_OUTPUT_FACILITY') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.prefillOutputFacility:Prefill output facility with the input facility `;
    let info = codeToFieldInfo[item.id]
    if (!info) return item.id
    return info.label


    // if (item.id === 'GRADE') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.grade:Grade`;
    // else if (item.id === 'LOT_EXPORT_NUMBER') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.lotExternalNumber:Export lot number`;
    // else if (item.id === 'PRICE_PER_UNIT') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.pricePerUnit:Price per unit`;
    // else if (item.id === 'SCREEN_SIZE') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.screenSize:Screen size`;
    // else if (item.id === 'LOT_LABEL') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.lotLabel:Lot label`;
    // else if (item.id === 'START_OF_DRYING') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.startOfDrying:Start of drying`;
    // else if (item.id === 'CLIENT_NAME') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.clientName:Client's name`;
    // else if (item.id === 'CERTIFICATES_IDS') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.certificatesIds:Certificates`;
    // else if (item.id === 'PREFILL_OUTPUT_FACILITY') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.prefillOutputFacility:Prefill output facility with the input facility `;
    // else if (item.id === 'TRANSACTION_TYPE') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.transactionType:Type of transaction`;
    // else if (item.id === 'FLAVOUR_PROFILE') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.flavourProfile:Flavour profile`;

    // else if (item.id === 'PRICE_FOR_OWNER') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.priceOwner:Price (RWF) / kg for Owner`;
    // else if (item.id === 'PRICE_FOR_BUYER') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.priceBuyer:Price (EUR) / kg for Buyer`;
    // else if (item.id === 'EXC_RATE_AT_BUYER') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.rateBuyer:Exchange rate at Buyer (1 EUR = X RWF)`;
    // else if (item.id === 'PRICE_FOR_END_CUSTOMER') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.priceEndCustomer:Price (EUR) / kg for End customer`;
    // else if (item.id === 'EXC_RATE_AT_END_CUSTOMER') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.rateEndCustomer:Exchange rate at End customer (1 EUR = X RWF)`;

    // else if (item.id === 'CUPPING_RESULT') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.cuppingResult:Cupping results`;
    // else if (item.id === 'CUPPING_GRADE') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.cuppingGrade:Cupping grade`;
    // else if (item.id === 'CUPPING_FLAVOUR') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.cuppingFlavour:Cupping flavour`;
    // else if (item.id === 'ROASTING_DATE') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.roastingDate:Roasting date`;
    // else if (item.id === 'ROASTING_PROFILE') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.roastingProfile:Roasting profile`;

    // else if (item.id === 'SHIPPER_DETAILS') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.shipperDetails:Shipper details`;
    // else if (item.id === 'CARRIER_DETAILS') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.carrierDetails:Carrier details`;
    // else if (item.id === 'PORT_OF_LOADING') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.portOfLoading:Port of loading`;
    // else if (item.id === 'PORT_OF_DISCHARGE') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.portOfDischarge:Port of discharge`;
    // else if (item.id === 'LOCATION_OF_END_DELIVERY') return $localize`:@@productLabelProcessingAction.newProcessingAction.field.LocationOfEndDelivery:Location of end delivery`;


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
        this.requiredFields[index].selected = true
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
        this.requiredFieldsDE[index].selected = true
      }
    }
    if (mode === 'requiredOnQuote') {
      this.requiredFieldsDE[index].requiredOnQuote = !this.requiredFieldsDE[index].requiredOnQuote;
    }
  }

  get repackedOutputs() {
    let obj = {}
    obj['YES'] = $localize`:@@productLabelProcessingAction.repackedOutputs.yes:Yes`
    obj['NO'] = $localize`:@@productLabelProcessingAction.repackedOutputs.no:No`
    return obj;
  }
  codebookRepackedOutputs = EnumSifrant.fromObject(this.repackedOutputs)




  docTypeForm = new FormControl(null)

  typeResultFormatter = (value: any) => {
    return this.processingEvidenceTypeaService.textRepresentation(value)
  }

  typeInputFormatter = (value: any) => {
    return this.processingEvidenceTypeaService.textRepresentation(value)
  }

  //// temp

  async addSelectedType(sp: ChainProcessingEvidenceType) {
    if (!sp) return;
    let formArray = this.form.get('requiredDocTypes') as FormArray
    if (formArray.value.some(x => dbKey(x) === dbKey(sp))) {
      this.docTypeForm.setValue(null);
      return;
    }
    // sp.required = true;
    formArray.push(new FormControl({
      ...sp,
      required: false,
      requiredOnQuote: false,
    }))
    formArray.markAsDirty()

    setTimeout(() => this.docTypeForm.setValue(null))
  }

  async deleteDocType(sp: ChainProcessingEvidenceType) {
    if (!sp) return
    let formArray = this.form.get('requiredDocTypes') as FormArray
    let index = (formArray.value as ChainProcessingEvidenceType[]).findIndex(x => dbKey(x) === dbKey(sp))
    if (index >= 0) {
      formArray.removeAt(index)
      formArray.markAsDirty()
    }
  }

  cbSelectedSP(sp, i: number, mode: 'mandatory' | 'quote') {
    if (mode === 'mandatory') {
      sp.required = !sp.required;
    }
    if (mode === 'quote') {
      sp.requiredOnQuote = !sp.requiredOnQuote
      if(sp.requiredOnQuote) {
        sp.requiredOneOfGroupIdForQuote = null
      }
    }
  }
  // conditionalValidators() {
  //   this.subConditional = this.repackedOutputsForm.valueChanges.subscribe(val => {
  //     if (val && val === 'YES') {
  //       this.form.controls['maxOutputWeight'].setValidators([Validators.required]);
  //       this.form.controls['maxOutputWeight'].updateValueAndValidity();
  //     } else {
  //       this.form.controls['maxOutputWeight'].clearValidators();
  //       this.form.controls['maxOutputWeight'].updateValueAndValidity();
  //     }
  //   });
  // }

  booleanTrue = {
    id: true,
    value: true,
    // icon: "check",
    // class: "text-primary"
  }

  booleanFalse = {
    id: false,
    value: false,
    // icon: "times",
    // class: "text-secondary"
  }

  repackedFormatter = (x: any) => x.value
    ? $localize`:@@productLabelProcessingAction.repackedOutputs.yes:Yes`
    : $localize`:@@productLabelProcessingAction.repackedOutputs.no:No`


  setRepacked(event) {
    this.form.get('repackedOutputs').setValue(event ? (event === 'YES' ? true : false) : null);
    if (!event || event === 'NO') this.form.get('maxOutputWeight').setValue(null);
  }

  get procesingTransactionType() {
    let obj = {}
    obj['SHIPMENT'] = $localize`:@@productLabelProcessingAction.procesingTransactionType.quote:Quote`
    obj['PROCESSING'] = $localize`:@@productLabelProcessingAction.procesingTransactionType.processing:Processing`
    obj['TRANSFER'] = $localize`:@@productLabelProcessingAction.procesingTransactionType.transfer:Transfer`
    return obj;
  }

  codebookProcessingTransaction = EnumSifrant.fromObject(this.procesingTransactionType)

  get transactionType(): ProcessingActionType {
    return this.form.get('type') && this.form.get('type').value
  }

  changeTransactionType(type: ProcessingActionType) {
    // not used
  }

  repackedOutputsSet(value: any) {
    if (!value || !value.value) {
      this.form.get('maxOutputWeight').setValue(null)
      this.form.get('maxOutputWeight').disable()
    } else {
      this.form.get('maxOutputWeight').enable()
    }
  }

  changeRequiredOneOf(event: string, sp, i: number) {
    sp.requiredOneOfGroupIdForQuote = event
    // sp.requiredOnQuote = !!event
  }

  groupDecided(sp, i) {
    if(sp.requiredOneOfGroupIdForQuote) {
      sp.requiredOneOfGroupIdForQuote = null
      return
    }
    sp.requiredOnQuote = null
    let group = 1;
    let lst: ChainProcessingEvidenceType[] = this.form.get('requiredDocTypes').value || [];
    // console.log("LST:",lst.map(x => x.requiredOneOfGroupIdForQuote).filter(x => x && /^\+?(0|[1-9]\d*)$/.test(x)))
    let res = lst.map(x => x.requiredOneOfGroupIdForQuote).filter(x => x && /^\+?(0|[1-9]\d*)$/.test(x)).map(x => parseInt(x))
    if(res.length === 0) {
      sp.requiredOneOfGroupIdForQuote = '' + group
    } else {
      group = Math.max(...res) + 1
      sp.requiredOneOfGroupIdForQuote = '' + group
    }
    this.cdr.detectChanges();
  }


  get iconCode() {
    let obj = {}
    obj['SHIP'] = $localize`:@@productLabelProcessingAction.timelineIcon.ship:Ship`
    obj['LEAF'] = $localize`:@@productLabelProcessingAction.timelineIcon.leaf:Leaf`
    obj['WAREHOUSE'] = $localize`:@@productLabelProcessingAction.timelineIcon.warehouse:Warehouse`
    obj['QRCODE'] = $localize`:@@productLabelProcessingAction.timelineIcon.qrCode:QR code`
    obj['OTHER'] = $localize`:@@productLabelProcessingAction.timelineIcon.other:Other`
    return obj;
  }

  codebookIcons = EnumSifrant.fromObject(this.iconCode)

}
