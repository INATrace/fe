import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { UndesrcoreAndCapitalsValidator } from 'src/shared/validation';
import { Validators } from '@angular/forms';
import { ApiFacilityType } from '../../api/model/apiFacilityType';
import { ApiMeasureUnitType } from '../../api/model/apiMeasureUnitType';
import { ApiActionType } from '../../api/model/apiActionType';
import { ApiGradeAbbreviation } from '../../api/model/apiGradeAbbreviation';
import { ApiProcessingEvidenceType } from '../../api/model/apiProcessingEvidenceType';

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
