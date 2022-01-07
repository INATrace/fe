import { Validators } from '@angular/forms';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { MinLengthArrayValidator } from 'src/shared/validation';
import { ApiProductOrder } from '../../../../../api/model/apiProductOrder';

export const ApiProductOrderValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: []
    },
    orderId: {
      validators: [Validators.required]
    },
    deliveryDeadline: {
      validators: [Validators.required]
    },
    requiredWomensOnly: {
      validators: []
    },
    requiredOrganic: {
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
  }
} as SimpleValidationScheme<ApiProductOrder>;
