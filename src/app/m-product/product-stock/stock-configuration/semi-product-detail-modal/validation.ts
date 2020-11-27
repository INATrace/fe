import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { ChainSemiProduct } from 'src/api-chain/model/chainSemiProduct';
import { Validators, AbstractControl, ValidationErrors } from '@angular/forms';

export const ChainSemiProductValidationScheme = {
  validators: [],
  fields: {
    docType: {
      validators: []
    },
    _id: {
      validators: []
    },
    _rev: {
      validators: []
    },
    created: {
      validators: []
    },
    lastChange: {
      validators: []
    },
    userCreatedId: {
      validators: []
    },
    userChangedId: {
      validators: []
    },
    productId: {
      validators: []
    },
    name: {
      validators: [Validators.required]
    },
    description: {
      validators: [Validators.required]
    },
    measurementUnitType: {
      forceFormControl: true,
      validators: [Validators.required]
    },
    isSKU: {
      validators: []
    },
    isBuyable: {
      validators: []
    },
    product: {
      validators: []
    },
  }
} as SimpleValidationScheme<ChainSemiProduct>;
