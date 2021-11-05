import { SimpleValidationScheme } from '../../../interfaces/Validation';
import { ApiValueChain } from '../../../api/model/apiValueChain';
import { Validators } from '@angular/forms';
import { ApiMeasureUnitType } from '../../../api/model/apiMeasureUnitType';
import { ApiSemiProduct } from '../../../api/model/apiSemiProduct';
import { ApiProcessingEvidenceField } from '../../../api/model/apiProcessingEvidenceField';
import { ApiProcessingEvidenceType } from '../../../api/model/apiProcessingEvidenceType';

export const ApiValueChainValidationScheme = {
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
    valueChainStatus: {
      validators: []
    },
    facilityTypes: {
      validators: []
    },
    measureUnitTypes: {
      validators: []
    },
    gradeAbbreviations: {
      validators: []
    },
    processingEvidenceTypes: {
      validators: []
    },
    processingEvidenceFields: {
      validators: []
    },
    semiProducts: {
      validators: []
    }
  }
} as SimpleValidationScheme<ApiValueChain>;

export const ApiVCMeasureUnitTypeValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: []
    },
    code: {
      validators: []
    },
    label: {
      validators: []
    }
  }
} as SimpleValidationScheme<ApiMeasureUnitType>;

export const ApiSemiProductValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: [Validators.required]
    },
    name: {
      validators: [Validators.required]
    },
    translations: {
      validators: []
    }
  }
} as SimpleValidationScheme<ApiSemiProduct>;

export const ApiVCProcessingEvidenceFieldValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: [Validators.required]
    }
  }
} as SimpleValidationScheme<ApiProcessingEvidenceField>;

export const ApiVCProcessingEvidenceTypeValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: [Validators.required]
    }
  }
} as SimpleValidationScheme<ApiProcessingEvidenceType>;
