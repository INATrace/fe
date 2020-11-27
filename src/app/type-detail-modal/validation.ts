import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { ChainFacilityType } from 'src/api-chain/model/chainFacilityType';
import { UndesrcoreAndCapitalsValidator } from 'src/shared/validation';
import { Validators } from '@angular/forms';
import { ChainMeasureUnitType } from 'src/api-chain/model/chainMeasureUnitType';
import { ChainActionType } from 'src/api-chain/model/chainActionType';
import { ChainGradeAbbreviation } from 'src/api-chain/model/chainGradeAbbreviation';
import { ChainProcessingEvidenceType } from 'src/api-chain/model/chainProcessingEvidenceType';
import { ChainOrderEvidenceType } from 'src/api-chain/model/chainOrderEvidenceType';

export const ChainFacilityTypeValidationScheme = {
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
    id: {
      validators: [UndesrcoreAndCapitalsValidator(), Validators.required]
    },
    label: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ChainFacilityType>;

export const ChainMeasureUnitTypeValidationScheme = {
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
    id: {
      validators: [UndesrcoreAndCapitalsValidator(), Validators.required]
    },
    label: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ChainMeasureUnitType>;


export const ChainActionTypeValidationScheme = {
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
    id: {
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
} as SimpleValidationScheme<ChainActionType>;

export const ChainGradeAbbreviationValidationScheme = {
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
    id: {
      validators: [UndesrcoreAndCapitalsValidator(), Validators.required]
    },
    label: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ChainGradeAbbreviation>;


export const ChainProcessingEvidenceTypeValidationScheme = {
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
    id: {
      validators: [UndesrcoreAndCapitalsValidator(), Validators.required]
    },
    label: {
      validators: [Validators.required]
    },
    // semiProductId: {
    //   validators: []
    // },
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
    },
    // semiProduct: {
    //   validators: [Validators.required]
    // },
  }
} as SimpleValidationScheme<ChainProcessingEvidenceType>;

export const ChainOrderEvidenceTypeValidationScheme = {
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
    id: {
      validators: [UndesrcoreAndCapitalsValidator(), Validators.required]
    },
    label: {
      validators: [Validators.required]
    },
    fairness: {
      validators: []
    },
    provenance: {
      validators: []
    },
    quality: {
      validators: []
    },
  }
} as SimpleValidationScheme<ChainOrderEvidenceType>;
