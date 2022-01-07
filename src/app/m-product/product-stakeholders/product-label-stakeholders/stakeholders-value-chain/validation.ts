import { Validators } from '@angular/forms';
import { SimpleValidationScheme } from '../../../../../interfaces/Validation';
import { ApiProduct } from '../../../../../api/model/apiProduct';
import { ApiProductDataSharingAgreement } from '../../../../../api/model/apiProductDataSharingAgreement';

export const ApiProductValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: [Validators.required]
    },
    dataSharingAgreements: {
      validators: []
    }
  }
} as SimpleValidationScheme<ApiProduct>;

export const ApiProductDataSharingAgreementValidationScheme = {
  validators: [],
  fields: {
    description: {
      validators: [Validators.required]
    },
    document: {
      validators: [Validators.required]
    }
  }
} as SimpleValidationScheme<ApiProductDataSharingAgreement>;
