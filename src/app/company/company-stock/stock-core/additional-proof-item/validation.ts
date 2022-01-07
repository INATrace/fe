import { Validators } from '@angular/forms';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { ApiActivityProof } from '../../../../../api/model/apiActivityProof';

export const ApiActivityProofValidationScheme = {
  validators: [],
  fields: {
    formalCreationDate: {
      validators: [Validators.required]
    },
    type: {
      validators: [Validators.required]
    },
    document: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ApiActivityProof>;
