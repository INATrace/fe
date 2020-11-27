import { Validators } from '@angular/forms';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { ChainFacilityType } from 'src/api-chain/model/chainFacilityType';
import { ChainLocation } from 'src/api-chain/model/chainLocation';

export const ChainFacilityTypeValidationScheme = {
  forceExpand: true,
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
      validators: [Validators.required]
    },
    label: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ChainFacilityType>;

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
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ChainLocation>;


export const ChainFacilityValidationScheme = {
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
    name: {
      validators: [Validators.required]
    },
    organizationId: {
      validators: [Validators.required]
    },
    // facilityType: ChainFacilityTypeValidationScheme,
    facilityType: {
      validators: [Validators.required]
    },
    isCollectionFacility: {
      validators: [Validators.required]
    },
    isPublic: {
      validators: [Validators.required]
    },
    location: ChainLocationValidationScheme,
    semiProducts: {
      validators: []
    },
    semiProductIds: {
      validators: []
    },
    semiProductPrices: {
      validators: []
    }
  }
} as SimpleValidationScheme<ChainFacility>;
