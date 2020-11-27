import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { ChainCompanyCustomer } from 'src/api-chain/model/chainCompanyCustomer';
import { ChainLocation } from 'src/api-chain/model/chainLocation';
import { Validators } from '@angular/forms';
import { EmailValidator } from 'src/shared/validation';

export const ChainLocationValidationScheme = {
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
      validators: [Validators.required]
    },
    state: {
      validators: []
    },
    zip: {
      validators: []
    },
    latitude: {
      validators: []
    },
    longitude: {
      validators: []
    },
    site: {
      validators: []
    },
    sector: {
      validators: []
    },
    cell: {
      validators: []
    },
    village: {
      validators: []
    },
    isPubliclyVisible: {
      validators: []
    },
  }
} as SimpleValidationScheme<ChainLocation>;

  export const ChainCompanyCustomerValidationScheme = {
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
                    validators: []
                },
                productId: {
                    validators: []
                },
                companyId: {
                    validators: []
                },
                type: {
                    validators: []
                },
                organizationId: {
                    validators: []
                },
                chainProductId: {
                    validators: []
                },
                contact: {
                    validators: []
                },
                email: {
                  validators: [EmailValidator()]
                },
                location: ChainLocationValidationScheme,
                name: {
                    validators: [Validators.required]
                },
                officialCompanyName: {
                    validators: []
                },
                phone: {
                    validators: []
                },
                vatId: {
                    validators: []
                },
                semiProductPrices: {
                    validators: []
                }
      }
  } as SimpleValidationScheme<ChainCompanyCustomer>;
