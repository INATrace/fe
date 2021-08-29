import { Component, Input, OnInit } from '@angular/core';
import { GenericEditableItemComponent } from '../../shared/generic-editable-item/generic-editable-item.component';
import { GlobalEventManagerService } from '../../system/global-event-manager.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { generateFormFromMetadata } from '../../../shared/utils';
import { ApiFacilityType } from '../../../api/model/apiFacilityType';
import {
  ApiFacilityTypeValidationScheme,
  ApiGradeAbbreviationValidationScheme,
  ApiProcessingEvidenceTypeValidationScheme, ApiSemiProductValidationScheme
} from '../../type-detail-modal/validation';
import { ActiveFacilityTypeService } from '../../shared-services/active-facility-types.service';
import { ApiMeasureUnitType } from '../../../api/model/apiMeasureUnitType';
import { ActiveMeasureUnitTypeService } from '../../shared-services/active-measure-unit-types.service';
import { ApiVCMeasureUnitTypeValidationScheme } from '../validation';
import { ApiGradeAbbreviation } from '../../../api/model/apiGradeAbbreviation';
import { GradeAbbreviationCodebook } from '../../shared-services/grade-abbreviation-codebook';
import { ApiProcessingEvidenceType } from '../../../api/model/apiProcessingEvidenceType';
import { ProcessingEvidenceTypeService } from '../../shared-services/processing-evidence-types.service';
import { ProcessingEvidenceTypeControllerService } from '../../../api/api/processingEvidenceTypeController.service';
import { CodebookTranslations } from '../../shared-services/codebook-translations';
import { ApiSemiProduct } from '../../../api/model/apiSemiProduct';
import { ActiveSemiProductsService } from '../../shared-services/active-semi-products.service';

@Component({
  selector: 'app-value-chain-config-item',
  templateUrl: './value-chain-config-item.component.html',
  styleUrls: ['./value-chain-config-item.component.scss']
})
export class ValueChainConfigItemComponent extends GenericEditableItemComponent<any> implements OnInit {

  @Input()
  configItemType: string;

  @Input()
  readOnly = false;

  configItemForm = new FormControl(null, Validators.required);

  procEvidenceTypesCodebook: ProcessingEvidenceTypeService;

  constructor(
    private codebookTranslations: CodebookTranslations,
    private procEvidenceTypeController: ProcessingEvidenceTypeControllerService,
    protected globalEventsManager: GlobalEventManagerService,
    public facilityTypesCodebook: ActiveFacilityTypeService,
    public measureUnitTypesCodebook: ActiveMeasureUnitTypeService,
    public gradeAbbreviationTypesCodebook: GradeAbbreviationCodebook,
    public semiProductsCodebook: ActiveSemiProductsService
  ) {
    super(globalEventsManager);
  }

  ngOnInit(): void {
    this.procEvidenceTypesCodebook = new ProcessingEvidenceTypeService(this.procEvidenceTypeController, this.codebookTranslations, null);
  }

  public generateForm(value: any): FormGroup {

    if (this.configItemType === 'facility-types') {
      return generateFormFromMetadata(ApiFacilityType.formMetadata(), value, ApiFacilityTypeValidationScheme);
    }

    if (this.configItemType === 'measure-unit-types') {
      return generateFormFromMetadata(ApiMeasureUnitType.formMetadata(), value, ApiVCMeasureUnitTypeValidationScheme);
    }

    if (this.configItemType === 'grade-abbreviation-types') {
      return generateFormFromMetadata(ApiGradeAbbreviation.formMetadata(), value, ApiGradeAbbreviationValidationScheme);
    }

    if (this.configItemType === 'processing-evidence-types') {
      return generateFormFromMetadata(ApiProcessingEvidenceType.formMetadata(), value, ApiProcessingEvidenceTypeValidationScheme);
    }

    if (this.configItemType === 'semi-products') {
      return generateFormFromMetadata(ApiSemiProduct.formMetadata(), value, ApiSemiProductValidationScheme);
    }

  }

  setSelectedValue($event) {
    if ($event) {

      if (this.configItemType === 'facility-types' || this.configItemType === 'grade-abbreviation-types') {
        this.form.setValue({...$event});
      }

      if (this.configItemType === 'measure-unit-types') {
        this.form.setValue({...$event, underlyingMeasurementUnitType: null, weight: null});
      }

      if (this.configItemType === 'processing-evidence-types') {
        this.form.setValue({...$event,
          fairness: null,
          provenance: null,
          quality: null,
          required: null,
          requiredOnQuote: null,
          requiredOneOfGroupIdForQuote: null});
      }

      if (this.configItemType === 'semi-products') {
        this.form.setValue({...$event, skuendCustomer: null, sku: null, buyable: null});
      }

      this.form.markAsDirty();
    }
  }

}
