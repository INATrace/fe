import { SimpleValidationScheme } from '../../interfaces/Validation';
import { ApiValueChain } from '../../api/model/apiValueChain';
import { Validators } from '@angular/forms';

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
