import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { EmailValidator } from 'src/shared/validation';
import { Validators } from '@angular/forms';
import { ApiUserCustomer } from 'src/api/model/apiUserCustomer';
import { ChainLocation } from 'src/api-chain/model/chainLocation';
import { ChainUserCustomer } from 'src/api-chain/model/chainUserCustomer';
import { BankAccountInfo } from 'src/api-chain/model/bankAccountInfo';
import { FarmInfo } from 'src/api-chain/model/farmInfo';
import { ContactInfo } from 'src/api-chain/model/contactInfo';
import { ChainUserCustomerRole } from 'src/api-chain/model/chainUserCustomerRole';
import { ApiCompanyValidationScheme } from '../../../m-product/product-label/validation';

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

export const BankAccountInfoValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    accountHoldersName: {
      validators: []
    },
    accountNumber: {
      validators: []
    },
    bankName: {
      validators: []
    },
    branchAddress: {
      validators: []
    },
    country: {
      validators: []
    },
  }
} as SimpleValidationScheme<BankAccountInfo>;

export const FarmInfoValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    ownsFarm: {
      validators: []
    },
    farmSize: {
      validators: []
    },
    numberOfTrees: {
      validators: []
    },
    organicFarm: {
      validators: []
    },
    fertilizerDescription: {
      validators: []
    },
    additionalInfo: {
      validators: []
    },
  }
} as SimpleValidationScheme<FarmInfo>;

export const ContactInfoValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    phone: {
      validators: []
    },
    email: {
      validators: []
    },
    hasSmartPhone: {
      validators: []
    },
  }
} as SimpleValidationScheme<ContactInfo>;


export const ChainUserCustomerValidationScheme = {
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
    chainProductId: {
      validators: []
    },
    companyId: {
      validators: []
    },
    organizationId: {
      validators: []
    },
    customerRoles: {
      validators: []
    },
    name: {
      validators: []
    },
    surname: {
      validators: [Validators.required]
    },
    gender: {
      validators: [Validators.required]
    },
    location: ChainLocationValidationScheme,
    customerId: {
      validators: []
    },
    contact: ContactInfoValidationScheme,
    farmInfo: FarmInfoValidationScheme,
    associationIds: {
      validators: []
    },
    cooperativeIdsAndRoles: {
      validators: [Validators.required]
    },
    bankAccountInfo: BankAccountInfoValidationScheme
  }
} as SimpleValidationScheme<ChainUserCustomer>;

export const ApiAddressValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    address: {
      validators: [Validators.required]
    },
    cell: {
      validators: [Validators.required]
    },
    city: {
      validators: [Validators.required]
    },
    country: {
      validators: [Validators.required]
    },
    state: {
      validators: [Validators.required]
    },
    zip: {
      validators: [Validators.maxLength(50)]
    },
    hondurasDepartment: {
      validators: []
    },
    hondurasFarm: {
      validators: []
    },
    hondurasMunicipality: {
      validators: []
    },
    hondurasVillage: {
      validators: []
    }
  }
};

export const ApiLocationValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    address: ApiAddressValidationScheme
  }
};

export const ApiBankInformationValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    accountHolderName: {
      validators: []
    },
    accountNumber: {
      validators: []
    },
    additionalInformation: {
      validators: []
    },
    bankName: {
      validators: []
    }
  }
};

export const ApiFarmInformationValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    areaUnit : {
      validators: []
    },
    totalCultivatedArea: {
      validators: []
    },
    coffeeCultivatedArea: {
      validators: []
    },
    numberOfTrees: {
      validators: []
    },
    organic: {
      validators: []
    },
    areaOrganicCertified: {
      validators: []
    },
    startTransitionToOrganic: {
      validators: []
    }
  }
};

export const ApiUserCustomerCooperativeValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    company: ApiCompanyValidationScheme,
    id: {
      validators: []
    },
    type: {
      validators: [Validators.required]
    },
    userCustomerType: {
      validators: [Validators.required]
    }
  }
};

export const ApiUserCustomerValidationScheme = {
  validators: [],
  fields: {
    companyId: {
      validators: []
    },
    email: {
      validators: [EmailValidator()]
    },
    gender: {
      validators: [Validators.required]
    },
    id: {
      validators: []
    },
    location: ApiLocationValidationScheme,
    name: {
      validators: []
    },
    phone: {
      validators: []
    },
    surname: {
      validators: [Validators.required]
    },
    type: {
      validators: []
    },
    bank: ApiBankInformationValidationScheme,
    farm: ApiFarmInformationValidationScheme,
    cooperatives: ApiUserCustomerCooperativeValidationScheme
  }
} as SimpleValidationScheme<ApiUserCustomer>;

export const ChainUserCustomerRoleValidationScheme = {
  validators: [],
  fields: {
    organizationId: {
      validators: [Validators.required]
    },
    role: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ChainUserCustomerRole>;


