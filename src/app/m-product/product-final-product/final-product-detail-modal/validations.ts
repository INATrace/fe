import { SimpleValidationScheme } from '../../../../interfaces/Validation';
import { ApiFinalProduct } from '../../../../api/model/apiFinalProduct';
import { Validators } from '@angular/forms';

export const ApiFinalProductValidationScheme = {
  validators: [],
  fields: {
    description: {
      validators: [Validators.required]
    },
    id: {
      validators: []
    },
    measurementUnitType: {
      forceFormControl: true,
      validators: [Validators.required]
    },
    name: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ApiFinalProduct>;
