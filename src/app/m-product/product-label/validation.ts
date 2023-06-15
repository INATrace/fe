import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { Validators } from '@angular/forms';
import { ApiProduct } from 'src/api/model/apiProduct';
import { ApiResponsibility } from 'src/api/model/apiResponsibility';
import { ApiSustainability } from 'src/api/model/apiSustainability';
import { ApiProcess } from 'src/api/model/apiProcess';
import { ApiCompany } from 'src/api/model/apiCompany';
import { ApiAddress } from 'src/api/model/apiAddress';
import { ApiProcessDocument } from 'src/api/model/apiProcessDocument';
import { ApiProductOrigin } from 'src/api/model/apiProductOrigin';
import { ApiCertification } from 'src/api/model/apiCertification';
import { ApiProductSettings } from 'src/api/model/apiProductSettings';
import { ApiValueChain } from '../../../api/model/apiValueChain';

export const ApiCertificationValidationScheme = {
  validators: [Validators.required],
  fields: {
    certificate: {
      validators: [Validators.required]
    },
    description: {
      validators: [Validators.required]
    },
    type: {
      validators: []
    },
    validity: {
      validators: []
    }
  }
} as SimpleValidationScheme<ApiCertification>;

export const ApiProcessDocumentValidationScheme = {
  validators: [],
  fields: {
    description: {
      validators: [Validators.required]
    },
    document: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ApiProcessDocument>;

export const ApiValueChainValidationScheme = {
  validators: [],
  fields: {
    id: {
      validators: [Validators.required]
    }
  }
} as SimpleValidationScheme<ApiValueChain>;

const ApiResponsibilityValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    laborPolicies: {
      validators: [Validators.required]
    }
  }
} as SimpleValidationScheme<ApiResponsibility>;

const ApiSustainabilityValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    co2Footprint: {
      validators: []
    },
    packaging: {
      validators: [Validators.maxLength(1000)]
    },
    production: {
      validators: [Validators.required, Validators.maxLength(1000)]
    },
  }
} as SimpleValidationScheme<ApiSustainability>;

const ApiProcessValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    production: {
      validators: [Validators.required]
    }
  }
} as SimpleValidationScheme<ApiProcess>;


const ApiAddressValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    address: {
      validators: []
    },
    city: {
      validators: []
    },
    country: {
      validators: []
    },
    state: {
      validators: []
    },
    zip: {
      validators: []
    },
  }
} as SimpleValidationScheme<ApiAddress>;

export const ApiCompanyValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    abbreviation: {
      validators: []
    },
    about: {
      validators: []
    },
    certifications: {
      validators: []
    },
    documents: {
      validators: []
    },
    email: {
      validators: []
    },
    headquarters: ApiAddressValidationScheme,
    id: {
      validators: []
    },
    interview: {
      validators: []
    },
    logo: {
      validators: []
    },
    manager: {
      validators: []
    },
    mediaLinks: {
      validators: []
    },
    name: {
      validators: []
    },
    phone: {
      validators: []
    },
    webPage: {
      validators: []
    },
  }
} as SimpleValidationScheme<ApiCompany>;

export const ApiProductOriginValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    locations: {
      validators: [Validators.required]
    },
    text: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ApiProductOrigin>;

export const ApiProductSettingsValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    checkAuthenticity: {
      validators: []
    },
    costBreakdown: {
      validators: []
    },
    gdprText: {
      validators: []
    },
    giveFeedback: {
      validators: []
    },
    incomeIncreaseDescription: {
      validators: []
    },
    incomeIncreaseDocument: {
      validators: []
    },
    language: {
      validators: []
    },
    pricingTransparency: {
      validators: []
    },
    traceOrigin: {
      validators: []
    },
  }
} as SimpleValidationScheme<ApiProductSettings>;

export const ApiBusinessToCustomerSettingsValidationScheme = {
  validators: [],
  fields: {
    primaryColor: {
      validators: []
    },
    secondaryColor: {
      validators: []
    },
    headingColor: {
      validators: []
    },
    textColor: {
      validators: []
    }
  }
};

export const ApiProductValidationScheme = {
  validators: [],
  fields: {
    company: ApiCompanyValidationScheme,
    description: {
      validators: [Validators.required]
    },
    id: {
      validators: []
    },
    name: {
      validators: [Validators.required]
    },
    origin: ApiProductOriginValidationScheme,
    photo: {
      validators: [Validators.required]
    },
    process: ApiProcessValidationScheme,
    responsibility: ApiResponsibilityValidationScheme,
    sustainability: ApiSustainabilityValidationScheme,
    settings: ApiProductSettingsValidationScheme,
    businessToCustomerSettings: ApiBusinessToCustomerSettingsValidationScheme,
    journeyMarkers: {
      validators: [],
      forceExpand: true,
      arrayElementValidators: {
        validators: [],
        forceExpand: true,
      }
    }
  }
} as SimpleValidationScheme<ApiProduct>;

export function pricingTransparencyFormMetadata() {
  return {
    metadata: pricingTransparencyFormMetadata,
    vars: [
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'exchangeRate',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'priceAtEndCustomer',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'costAtBuyer',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'costAtOwner',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'costAtProducer',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'costAtFarmerWithPremium',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'costAtFarmer',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'costAtFarmerAtCompetition',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      }
    ]
  };
}

export const pricingTransparencyValidationScheme = {
  validators: [],
  fields: {
    exchangeRate: {
      validators: []
    },
    priceAtEndCustomer: {
      validators: []
    },
    costAtBuyer: {
      validators: []
    },
    costAtOwner: {
      validators: []
    },
    costAtProducer: {
      validators: []
    },
    costAtFarmerWithPremium: {
      validators: []
    },
    costAtFarmer: {
      validators: []
    },
    costAtFarmerAtCompetition: {
      validators: []
    }
  }
};
