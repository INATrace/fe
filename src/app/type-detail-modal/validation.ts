import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { UndesrcoreAndCapitalsValidator } from 'src/shared/validation';
import { Validators } from '@angular/forms';
import { ApiFacilityType } from '../../api/model/apiFacilityType';
import { ApiMeasureUnitType } from '../../api/model/apiMeasureUnitType';
import { ApiActionType } from '../../api/model/apiActionType';
import { ApiGradeAbbreviation } from '../../api/model/apiGradeAbbreviation';
import { ApiProcessingEvidenceType } from '../../api/model/apiProcessingEvidenceType';
import { ApiSemiProduct } from '../../api/model/apiSemiProduct';
import { ApiProcessingEvidenceField } from '../../api/model/apiProcessingEvidenceField';

export const ApiSemiProductValidationScheme = {
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
    apiMeasureUnitType: {
      forceFormControl: true,
      validators: [Validators.required]
    },
    sku: {
      validators: []
    },
    skuendCustomer: {
      validators: []
    },
    buyable: {
      validators: []
    }
  }
} as SimpleValidationScheme<ApiSemiProduct>;

export const ApiFacilityTypeValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: []
    },
    code: {
      validators: [UndesrcoreAndCapitalsValidator(), Validators.required]
    },
    label: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ApiFacilityType>;

export const ApiMeasureUnitTypeValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: []
    },
    code: {
      validators: [UndesrcoreAndCapitalsValidator(), Validators.required]
    },
    label: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ApiMeasureUnitType>;

export const ApiActionTypeValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: []
    },
    code: {
      validators: [UndesrcoreAndCapitalsValidator(), Validators.required]
    },
    label: {
      validators: [Validators.required]
    },
    facilityId: {
      validators: []
    },
    facilityType: {
      validators: []
    },
  }
} as SimpleValidationScheme<ApiActionType>;

export const ApiGradeAbbreviationValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: []
    },
    code: {
      validators: [UndesrcoreAndCapitalsValidator(), Validators.required]
    },
    label: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ApiGradeAbbreviation>;

export const ApiProcessingEvidenceTypeValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: []
    },
    code: {
      validators: [UndesrcoreAndCapitalsValidator(), Validators.required]
    },
    label: {
      validators: [Validators.required]
    },
    type: {
      validators: [Validators.required]
    },
    requiredOnQuote: {
      validators: []
    },
    fairness: {
      validators: []
    },
    provenance: {
      validators: []
    },
    quality: {
      validators: []
    }
  }
} as SimpleValidationScheme<ApiProcessingEvidenceType>;

export const ApiProcessingEvidenceFieldValidationScheme = {
    validators: [],
    fields: {
              fileMultiplicity: {
                  validators: []
              },
              files: {
                  validators: []
              },
              id: {
                  validators: []
              },
              label: {
                  validators: [Validators.required]
              },
              mandatory: {
                  validators: []
              },
              numericValue: {
                  validators: []
              },
              required: {
                  validators: []
              },
              requiredOnQuote: {
                  validators: []
              },
              stringValue: {
                  validators: []
              },
              type: {
                  validators: [Validators.required]
              },
    }
} as SimpleValidationScheme<ApiProcessingEvidenceField>;
