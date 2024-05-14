import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { EmailValidator } from 'src/shared/validation';
import { Validators } from '@angular/forms';
import { ApiUserCustomer } from 'src/api/model/apiUserCustomer';
import { ApiCompanyValidationScheme } from '../../../m-product/product-label/validation';

export const ApiAddressValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    country: {
      validators: [Validators.required]
    },
    address: {
      validators: []
    },
    city: {
      validators: [Validators.required]
    },
    state: {
      validators: [Validators.required]
    },
    zip: {
      validators: [Validators.maxLength(50)]
    },
    otherAddress: {
      validators: [Validators.maxLength(1000)]
    },
    village: {
      validators: []
    },
    cell: {
      validators: []
    },
    sector: {
      validators: []
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
    farmPlantInformationList: {
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
