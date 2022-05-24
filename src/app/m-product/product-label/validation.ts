import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { Validators } from '@angular/forms';
import { ApiProduct } from 'src/api/model/apiProduct';
import { ApiResponsibility } from 'src/api/model/apiResponsibility';
import { ApiSustainability } from 'src/api/model/apiSustainability';
import { ApiProcess } from 'src/api/model/apiProcess';
import { ApiCompany } from 'src/api/model/apiCompany';
import { ApiAddress } from 'src/api/model/apiAddress';
import { ApiProcessDocument } from 'src/api/model/apiProcessDocument';
import { ApiResponsibilityFarmerPicture } from 'src/api/model/apiResponsibilityFarmerPicture';
import { ApiProductOrigin } from 'src/api/model/apiProductOrigin';
import { ApiCertification } from 'src/api/model/apiCertification';
import { ApiProductSettings } from 'src/api/model/apiProductSettings';
import { ApiComparisonOfPrice } from 'src/api/model/apiComparisonOfPrice';


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

export const ApiResponsibilityFarmerPictureValidationScheme = {
  validators: [],
  fields: {
    description: {
      validators: [Validators.required]
    },
    document: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ApiResponsibilityFarmerPicture>;

const ApiResponsibilityValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    farmer: {
      validators: []
    },
    laborPolicies: {
      validators: [Validators.required]
    },
    pictures: {
      validators: []
    },
    relationship: {
      validators: []
    },
    story: {
      validators: []
    },
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
    codesOfConduct: {
      validators: []
    },
    production: {
      validators: [Validators.required]
    },
    records: {
      validators: []
    },
    standards: {
      validators: []
    },
    storage: {
      validators: []
    },
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

export function marketShareFormMetadata() {
  return {
    metadata: marketShareFormMetadata,
    vars: [
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'yourCountry',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'eastAfrica',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'restOfAfrica',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'europe',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'usa',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'elsewhere',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
    ]
  }
}

export const MarketShareValidationScheme = {
  validators: [],
  fields: {
    yourCountry: {
      validators: []
    },
    eastAfrica: {
      validators: []
    },
    restOfAfrica: {
      validators: []
    },
    europe: {
      validators: []
    },
    usa: {
      validators: []
    },
    elsewhere: {
      validators: []
    }
  }
}

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
    increaseOfCoffee: {
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

export const ApiComparisonOfPriceValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    description: {
      validators: []
    },
    prices: {
      validators: []
    },
  }
} as SimpleValidationScheme<ApiComparisonOfPrice>;

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
    howToUse: {
      validators: []
    },
    id: {
      validators: []
    },
    ingredients: {
      validators: []
    },
    keyMarketsShare: {
      validators: []
    },
    name: {
      validators: [Validators.required]
    },
    nutritionalValue: {
      validators: []
    },
    origin: ApiProductOriginValidationScheme,
    photo: {
      validators: [Validators.required]
    },
    process: ApiProcessValidationScheme,
    responsibility: ApiResponsibilityValidationScheme,
    sustainability: ApiSustainabilityValidationScheme,
    settings: ApiProductSettingsValidationScheme,
    comparisonOfPrice: ApiComparisonOfPriceValidationScheme,
    knowledgeBlog: {
      validators: []
    },
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
  }
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
}


export function pricesFormMetadata() {
  return {
    metadata: pricesFormMetadata,
    vars: [
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'worldMarket',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'fairTrade',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'EURtoRWF',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'EURtoUSD',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'poundToKg',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'containerSize',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'estimatedAdditionalPrice',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'manualFarmGatePrice',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'manualProducerPrice',
        dataType: 'number',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      }
    ]
  }
}

export const pricesValidationScheme = {
  validators: [],
  fields: {
    worldMarket: {
      validators: []
    },
    fairTrade: {
      validators: []
    },
    EURtoRWF: {
      validators: []
    },
    EURtoUSD: {
      validators: []
    },
    poundToKg: {
      validators: []
    },
    containerSize: {
      validators: []
    },
    estimatedAdditionalPrice: {
      validators: []
    },
    manualFarmGatePrice: {
      validators: []
    },
    manualProducerPrice: {
      validators: []
    }
  }
}
