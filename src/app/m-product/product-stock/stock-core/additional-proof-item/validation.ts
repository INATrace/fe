import { Validators } from '@angular/forms';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { ChainActivityProof } from 'src/api-chain/model/chainActivityProof';

export const ChainActivityProofValidationScheme = {
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
} as SimpleValidationScheme<ChainActivityProof>;
