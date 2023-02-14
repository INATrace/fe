import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { generateFormFromMetadata, defaultEmptyObject } from 'src/shared/utils';
import { take } from 'rxjs/operators';
import {
  ApiFacilityTypeValidationScheme,
  ApiMeasureUnitTypeValidationScheme,
  ApiActionTypeValidationScheme,
  ApiGradeAbbreviationValidationScheme,
  ApiProcessingEvidenceTypeValidationScheme,
  ApiSemiProductValidationScheme,
  ApiProcessingEvidenceFieldValidationScheme, ApiProductTypeValidationScheme
} from './validation';
import _ from 'lodash-es';
import { EnumSifrant } from '../../shared-services/enum-sifrant';
import { ActiveMeasureUnitTypeService } from '../../shared-services/active-measure-unit-types.service';
import { FacilityTypeControllerService } from '../../../api/api/facilityTypeController.service';
import { MeasureUnitTypeControllerService } from '../../../api/api/measureUnitTypeController.service';
import { ActionTypeControllerService } from '../../../api/api/actionTypeController.service';
import { GradeAbbreviationControllerService } from '../../../api/api/gradeAbbreviationController.service';
import { ProcessingEvidenceTypeControllerService } from '../../../api/api/processingEvidenceTypeController.service';
import { ApiFacilityType } from '../../../api/model/apiFacilityType';
import { ApiMeasureUnitType } from '../../../api/model/apiMeasureUnitType';
import { ApiActionType } from '../../../api/model/apiActionType';
import { ApiGradeAbbreviation } from '../../../api/model/apiGradeAbbreviation';
import { ApiProcessingEvidenceType } from '../../../api/model/apiProcessingEvidenceType';
import { SemiProductControllerService } from '../../../api/api/semiProductController.service';
import { ApiSemiProduct } from '../../../api/model/apiSemiProduct';
import { ProcessingEvidenceFieldControllerService } from '../../../api/api/processingEvidenceFieldController.service';
import { ApiProcessingEvidenceField } from '../../../api/model/apiProcessingEvidenceField';
import { ApiSemiProductTranslation } from '../../../api/model/apiSemiProductTranslation';
import LanguageEnum = ApiSemiProductTranslation.LanguageEnum;
import {ProductTypeControllerService} from '../../../api/api/productTypeController.service';
import {ApiProductType} from '../../../api/model/apiProductType';

@Component({
  selector: 'app-type-detail-modal',
  templateUrl: './type-detail-modal.component.html',
  styleUrls: ['./type-detail-modal.component.scss']
})
export class TypeDetailModalComponent implements OnInit {

  @Input()
  title: string = null;

  @Input()
  type: string = null;

  @Input()
  update = false;

  @Input()
  typeElement = null;

  @Input()
  public saveCallback: () => string;

  form: FormGroup;
  submitted = false;

  productForm = new FormControl(null, Validators.required);

  codebookProcessingEvidenceTypeType = EnumSifrant.fromObject(this.processingEvidenceTypeType);
  codebookProcessingEvidenceFieldType = EnumSifrant.fromObject(this.processingEvidenceFieldType);

  languages = [LanguageEnum.EN, LanguageEnum.DE, LanguageEnum.RW, LanguageEnum.ES];
  selectedLanguage = LanguageEnum.EN;

  constructor(
    public activeModal: NgbActiveModal,
    private facilityTypeService: FacilityTypeControllerService,
    private measureUnitTypeService: MeasureUnitTypeControllerService,
    private actionTypeService: ActionTypeControllerService,
    private gradeAbbreviationService: GradeAbbreviationControllerService,
    private processingEvidenceTypeService: ProcessingEvidenceTypeControllerService,
    private processingEvidenceFieldService: ProcessingEvidenceFieldControllerService,
    private semiProductService: SemiProductControllerService,
    private productTypeService: ProductTypeControllerService,
    public activeMeasureUnitTypeService: ActiveMeasureUnitTypeService
  ) { }

  ngOnInit(): void {
    this.init().then();
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  async init() {
    if (this.type === 'facility-types') {
      if (!this.update) {
        this.form = generateFormFromMetadata(ApiFacilityType.formMetadata(),
          defaultEmptyObject(ApiFacilityType.formMetadata()) as ApiFacilityType, ApiFacilityTypeValidationScheme);
      } else {
        this.form = generateFormFromMetadata(ApiFacilityType.formMetadata(), this.typeElement, ApiFacilityTypeValidationScheme);
      }
    }

    if (this.type === 'measurement-unit-types') {
      if (!this.update) {
        this.form = generateFormFromMetadata(ApiMeasureUnitType.formMetadata(),
          defaultEmptyObject(ApiMeasureUnitType.formMetadata()) as ApiMeasureUnitType, ApiMeasureUnitTypeValidationScheme);
      } else {
        this.form = generateFormFromMetadata(ApiMeasureUnitType.formMetadata(), this.typeElement, ApiMeasureUnitTypeValidationScheme);
      }
    }

    if (this.type === 'action-types') {
      if (!this.update) {
        this.form = generateFormFromMetadata(ApiActionType.formMetadata(),
          defaultEmptyObject(ApiActionType.formMetadata()) as ApiActionType, ApiActionTypeValidationScheme);
      }
      else {
        this.form = generateFormFromMetadata(ApiActionType.formMetadata(), this.typeElement, ApiActionTypeValidationScheme);
      }
    }

    if (this.type === 'grade-abbreviation') {
      if (!this.update) {
        this.form = generateFormFromMetadata(ApiGradeAbbreviation.formMetadata(),
          defaultEmptyObject(ApiGradeAbbreviation.formMetadata()) as ApiGradeAbbreviation, ApiGradeAbbreviationValidationScheme);
      }
      else {
        this.form = generateFormFromMetadata(ApiGradeAbbreviation.formMetadata(), this.typeElement, ApiGradeAbbreviationValidationScheme);
      }
    }

    if (this.type === 'processing-evidence-types') {
      if (!this.update) {
        this.form = generateFormFromMetadata(
          ApiProcessingEvidenceType.formMetadata(),
          defaultEmptyObject(ApiProcessingEvidenceType.formMetadata()) as ApiProcessingEvidenceType,
          ApiProcessingEvidenceTypeValidationScheme);
      } else {
        this.form = generateFormFromMetadata(
          ApiProcessingEvidenceType.formMetadata(), this.typeElement, ApiProcessingEvidenceTypeValidationScheme);
      }
      this.updateProcessingEvidenceTypeTranslations();
    }

    if (this.type === 'processing-evidence-fields') {
      if (!this.update) {
        this.form = generateFormFromMetadata(
            ApiProcessingEvidenceField.formMetadata(),
            defaultEmptyObject(ApiProcessingEvidenceField.formMetadata()) as ApiProcessingEvidenceField,
            ApiProcessingEvidenceFieldValidationScheme);
      } else {
        this.form = generateFormFromMetadata(
            ApiProcessingEvidenceField.formMetadata(), this.typeElement, ApiProcessingEvidenceFieldValidationScheme);
      }
      this.updateProcessingEvidenceFieldTranslations();
    }

    if (this.type === 'semi-products') {
      if (!this.update) {
        this.form = generateFormFromMetadata(ApiSemiProduct.formMetadata(),
          defaultEmptyObject(ApiSemiProduct.formMetadata()) as ApiSemiProduct, ApiSemiProductValidationScheme);
      } else {
        this.form = generateFormFromMetadata(ApiSemiProduct.formMetadata(), this.typeElement, ApiSemiProductValidationScheme);
      }
      this.finalizeForm();
    }

    if (this.type === 'product-types') {
      if (!this.update) {
        this.form = generateFormFromMetadata(ApiProductType.formMetadata(),
          defaultEmptyObject(ApiProductType.formMetadata()) as ApiProductType, ApiProductTypeValidationScheme)
      } else {
        this.form = generateFormFromMetadata(ApiProductType.formMetadata(), this.typeElement, ApiProductTypeValidationScheme)
      }
      this.finalizeForm();
    }

  }

  async save() {
    if (this.type === 'processing-evidence-types' || this.type === 'processing-evidence-fields') {
      this.form.get('label').setValue(this.form.get('translations.0.label').value);
    }
    this.submitted = true;
    if (this.form.invalid) { return; }
    if (this.type === 'measurement-unit-types' && (!this.form.value.weight || this.form.value.weight.toString().trim() === '')) {
      this.form.get('weight').setValue(null);
    }
    const data = _.cloneDeep(this.form.value);
    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

    let res = null;

    if (this.type === 'facility-types') {
      res = await this.facilityTypeService.createOrUpdateFacilityTypeUsingPUT(data).pipe(take(1)).toPromise();
    }

    if (this.type === 'measurement-unit-types') {
      res = await this.measureUnitTypeService.createOrUpdateMeasurementUnitTypeUsingPUT(data).pipe(take(1)).toPromise();
    }

    if (this.type === 'action-types') {
      res = await this.actionTypeService.createOrUpdateActionTypeUsingPUT(data).pipe(take(1)).toPromise();
    }

    if (this.type === 'grade-abbreviation') {
      res = await this.gradeAbbreviationService.createOrUpdateGradeAbbreviationUsingPUT(data).pipe(take(1)).toPromise();
    }

    if (this.type === 'processing-evidence-types') {
      res = await this.processingEvidenceTypeService.createOrUpdateProcessingEvidenceTypeUsingPUT(data).pipe(take(1)).toPromise();
    }

    if (this.type === 'processing-evidence-fields') {
      res = await this.processingEvidenceFieldService.createOrUpdateProcessingEvidenceFieldUsingPUT(data).pipe(take(1)).toPromise();
    }

    if (this.type === 'semi-products') {
      res = await this.semiProductService.createOrUpdateSemiProductUsingPUT(data).pipe(take(1)).toPromise();
    }

    if (this.type === 'product-types') {
      if (data.id) {
        res = await this.productTypeService.updateProductTypeUsingPUT(data).pipe(take(1)).toPromise();
      } else {
        res = await this.productTypeService.createProductTypeUsingPOST(data).pipe(take(1)).toPromise();
      }
    }

    if (res && res.status === 'OK') {
      if (this.saveCallback) { this.saveCallback(); }
      this.dismiss();
    }
  }

  get processingEvidenceTypeType() {
    const obj = {};
    obj['DOCUMENT'] = $localize`:@@processingEvidenceTypeType.document:Document`;
    obj['FIELD'] = $localize`:@@processingEvidenceTypeType.field:Field`;
    obj['CALCULATED'] = $localize`:@@processingEvidenceTypeType.calculated:Calculated`;
    return obj;
  }

  get processingEvidenceFieldType() {
    const obj = {};
    obj['STRING'] = $localize`:@@processingEvidenceFieldType.string:String`;
    obj['TEXT'] = $localize`:@@processingEvidenceFieldType.text:Text`;
    obj['NUMBER'] = $localize`:@@processingEvidenceFieldType.number:Number`;
    obj['INTEGER'] = $localize`:@@processingEvidenceFieldType.integer:Integer`;
    obj['DATE'] = $localize`:@@processingEvidenceFieldType.date:Date`;
    obj['OBJECT'] = $localize`:@@processingEvidenceFieldType.object:Object`;
    obj['PRICE'] = $localize`:@@processingEvidenceFieldType.price:Price`;
    obj['EXCHANGE_RATE'] = $localize`:@@processingEvidenceFieldType.exchange_rate:Exchange rate`;
    obj['TIMESTAMP'] = $localize`:@@processingEvidenceFieldType.timestamp:Timestamp`;
    return obj;
  }

  selectLanguage(lang: LanguageEnum) {
    this.selectedLanguage = lang;
  }

  finalizeForm() {
    if (!this.form.contains('translations')) {
      this.form.addControl('translations', new FormArray([]));
    }

    const translations = this.form.get('translations').value;
    this.form.removeControl('translations');
    this.form.addControl('translations', new FormArray([]));

    for (const lang of this.languages) {
      const translation = translations.find(t => t.language === lang);
      (this.form.get('translations') as FormArray).push(new FormGroup({
        name: new FormControl(translation ? translation.name : ''),
        description: new FormControl(translation ? translation.description : ''),
        language: new FormControl(lang)
      }));
    }
  }

  get languageEnum() {
    return LanguageEnum;
  }

  updateProcessingEvidenceFieldTranslations() {
    if (!this.form.contains('translations')) {
      this.form.addControl('translations', new FormArray([]));
    }

    const translations = this.form.get('translations').value;
    this.form.removeControl('translations');
    this.form.addControl('translations', new FormArray([]));

    for (const lang of this.languages) {
      const translation = translations.find(t => t.language === lang);
      (this.form.get('translations') as FormArray).push(new FormGroup({
        label: new FormControl(translation ? translation.label : ''),
        language: new FormControl(lang)
      }));
    }
  }

  updateProcessingEvidenceTypeTranslations() {
    if (!this.form.contains('translations')) {
      this.form.addControl('translations', new FormArray([]));
    }

    const translations = this.form.get('translations').value;
    this.form.removeControl('translations');
    this.form.addControl('translations', new FormArray([]));

    for (const lang of this.languages) {
      const translation = translations.find(t => t.language === lang);
      (this.form.get('translations') as FormArray).push(new FormGroup({
        label: new FormControl(translation ? translation.label : ''),
        language: new FormControl(lang)
      }));
    }
  }

}
