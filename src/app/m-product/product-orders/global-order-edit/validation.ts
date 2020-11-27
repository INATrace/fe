import { Validators } from '@angular/forms';
import { ChainProductOrder } from 'src/api-chain/model/chainProductOrder';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { MinLengthArrayValidator } from 'src/shared/validation';


export const ChainProductOrderValidationScheme = {
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
    id: {
      validators: [Validators.required]
    },
    facilityId: {
      validators: []
    },
    deliveryDeadline: {
      validators: [Validators.required]
    },
    customerId: {
      validators: []
    },
    requiredwomensOnly: {
      validators: []
    },
    requiredGradeId: {
      validators: []
    },
    items: {
      validators: [
        MinLengthArrayValidator(1)
      ]
    },
    facility: {
      validators: []
    },
    customer: {
      validators: [Validators.required]
    },
    requiredGrade: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ChainProductOrder>;
