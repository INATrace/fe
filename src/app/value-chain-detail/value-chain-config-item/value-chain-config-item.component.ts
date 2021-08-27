import { Component, Input, OnInit } from '@angular/core';
import { GenericEditableItemComponent } from '../../shared/generic-editable-item/generic-editable-item.component';
import { GlobalEventManagerService } from '../../system/global-event-manager.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { generateFormFromMetadata } from '../../../shared/utils';
import { ApiFacilityType } from '../../../api/model/apiFacilityType';
import { ApiFacilityTypeValidationScheme, ApiGradeAbbreviationValidationScheme } from '../../type-detail-modal/validation';
import { ActiveFacilityTypeService } from '../../shared-services/active-facility-types.service';
import { ApiMeasureUnitType } from '../../../api/model/apiMeasureUnitType';
import { ActiveMeasureUnitTypeService } from '../../shared-services/active-measure-unit-types.service';
import { ApiVCMeasureUnitTypeValidationScheme } from '../validation';
import { ApiGradeAbbreviation } from '../../../api/model/apiGradeAbbreviation';
import { GradeAbbreviationCodebook } from '../../shared-services/grade-abbreviation-codebook';

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

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    public facilityTypesCodebook: ActiveFacilityTypeService,
    public measureUnitTypesCodebook: ActiveMeasureUnitTypeService,
    public gradeAbbreviationTypesCodebook: GradeAbbreviationCodebook
  ) {
    super(globalEventsManager);
  }

  ngOnInit(): void {
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

  }

  setSelectedValue($event) {
    if ($event) {

      if (this.configItemType === 'facility-types' || this.configItemType === 'grade-abbreviation-types') {
        this.form.setValue({...$event});
      }

      if (this.configItemType === 'measure-unit-types') {
        this.form.setValue({...$event, underlyingMeasurementUnitType: null, weight: null});
      }

      this.form.markAsDirty();
    }
  }

}
