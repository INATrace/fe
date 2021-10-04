import { SimpleValidationScheme } from '../../../interfaces/Validation';
import { ApiValueChain } from '../../../api/model/apiValueChain';
import { Validators } from '@angular/forms';
import { ApiMeasureUnitType } from '../../../api/model/apiMeasureUnitType';

export const ApiValueChainValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: []
    },
    name: {
      validators: [Validators.required]
    },
    description: {
      validators: [Validators.required]
    },
    valueChainStatus: {
      validators: []
    },
    facilityTypes: {
      validators: []
    },
    measureUnitTypes: {
      validators: []
    },
    gradeAbbreviations: {
      validators: []
    },
    processingEvidenceTypes: {
      validators: []
    },
    semiProducts: {
      validators: []
    }
  }
} as SimpleValidationScheme<ApiValueChain>;

export const ApiVCMeasureUnitTypeValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: []
    },
    code: {
      validators: []
    },
    label: {
      validators: []
    }
  }
} as SimpleValidationScheme<ApiMeasureUnitType>;
