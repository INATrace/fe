import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { ApiCompanyGet } from 'src/api/model/apiCompanyGet';
import { EmailValidator } from 'src/shared/validation';
import { ApiAddress } from 'src/api/model/apiAddress';
import { Validators } from '@angular/forms';
import { ApiCompanyDocument } from 'src/api/model/apiCompanyDocument';
import { ApiCompanyUser } from 'src/api/model/apiCompanyUser';

export const ApiCompanyUserValidationScheme = {
  validators: [],
  fields: {
    companyRole: {
      validators: [Validators.required]
    },
    email: {
      validators: []
    },
    id: {
      validators: []
    },
    language: {
      validators: []
    },
    name: {
      validators: []
    },
    role: {
      validators: []
    },
    status: {
      validators: []
    },
    surname: {
      validators: []
    },
  }
} as SimpleValidationScheme<ApiCompanyUser>;

export const ApiCompanyDocumentValidationScheme = {
  validators: [Validators.required],
  fields: {
    description: {
      validators: [Validators.required, Validators.maxLength(2000)]
    },
    category: {
      validators: [Validators.required]
    },
    document: {
      validators: []
    },
    link: {
      validators: []
    },
    name: {
      validators: []
    },
    quote: {
      validators: [Validators.maxLength(2000)]
    },
    type: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ApiCompanyDocument>;

export const ApiAddressValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    address: {
      validators: [Validators.required]
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
      validators: [Validators.maxLength(50)]
    },
  }
} as SimpleValidationScheme<ApiAddress>;

export const ApiCompanyGetValidationScheme = {
  validators: [],
  fields: {
    abbreviation: {
      validators: [Validators.minLength(3), Validators.maxLength(6)]
    },
    about: {
      validators: [Validators.required, Validators.maxLength(2000)]
    },
    actions: {
      validators: []
    },
    certifications: {
      validators: []
    },
    currency: {
      validators: [Validators.required]
    },
    documents: {
      validators: []
    },
    email: {
      validators: [EmailValidator(), Validators.required]
    },
    headquarters: ApiAddressValidationScheme,
    id: {
      validators: []
    },
    interview: {
      validators: [Validators.maxLength(2000)]
    },
    logo: {
      validators: [Validators.required]
    },
    manager: {
      validators: []
    },
    mediaLinks: {
      validators: []
    },
    valueChains: {
      validators: [Validators.required]
    },
    name: {
      validators: [Validators.required]
    },
    phone: {
      validators: [Validators.required]
    },
    users: {
      validators: []
    },
    webPage: {
      validators: []
    }
  }
} as SimpleValidationScheme<ApiCompanyGet>;


export const TranslateApiCompanyGetValidationScheme = {
  validators: [],
  fields: {
    abbreviation: {
      validators: [Validators.minLength(3), Validators.maxLength(6)]
    },
    about: {
      validators: [Validators.maxLength(2000)]
    },
    actions: {
      validators: []
    },
    certifications: {
      validators: []
    },
    documents: {
      validators: []
    },
    email: {
      validators: [EmailValidator()]
    },
    headquarters: ApiAddressValidationScheme,
    id: {
      validators: []
    },
    interview: {
      validators: [Validators.maxLength(2000)]
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
    users: {
      validators: []
    },
    webPage: {
      validators: []
    }
  }
} as SimpleValidationScheme<ApiCompanyGet>;
