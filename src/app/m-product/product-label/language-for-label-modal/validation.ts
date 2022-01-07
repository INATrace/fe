import { Validators } from '@angular/forms';
import { SimpleValidationScheme } from '../../../../interfaces/Validation';
import { ApiProductLabelBase } from '../../../../api/model/apiProductLabelBase';

export const ApiProductLabelBaseValidationScheme = {
  validators: [],
  fields: {
    language: {
      validators: [Validators.required]
    },
    title: {
      validators: [Validators.required]
    }
  }
} as SimpleValidationScheme<ApiProductLabelBase>;
