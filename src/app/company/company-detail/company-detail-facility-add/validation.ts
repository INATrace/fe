import { SimpleValidationScheme } from '../../../../interfaces/Validation';
import { ApiFacility } from '../../../../api/model/apiFacility';
import { Validators } from '@angular/forms';
import { ApiFacilityType } from '../../../../api/model/apiFacilityType';
import { ApiFacilityLocation } from '../../../../api/model/apiFacilityLocation';
import { ApiAddress } from '../../../../api/model/apiAddress';

export const ApiFacilityTypeValidationScheme = {
    validators: [],
    fields: {
        code: {
            validators: []
        },
        id: {
            validators: []
        },
        label: {
            validators: []
        }
    }
} as SimpleValidationScheme<ApiFacilityType>;

export const ApiAddressValidationScheme = {
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
        }
    }
} as SimpleValidationScheme<ApiAddress>;

export const ApiFacilityLocationValidationScheme = {
    forceExpand: true,
    validators: [],
    fields: {
        address: ApiAddressValidationScheme,
        latitude: {
            validators: []
        },
        longitude: {
            validators: []
        },
        publiclyVisible: {
            validators: [Validators.required]
        }
    }
} as SimpleValidationScheme<ApiFacilityLocation>;

export const ApiFacilityValidationScheme = {
    forceExpand: true,
    validators: [],
    fields: {
        name: {
            validators: [Validators.required]
        },
        facilityType: {
            validators: [Validators.required]
        },
        facilityLocation: ApiFacilityLocationValidationScheme,
        isCollectionFacility: {
            validators: [Validators.required]
        },
        isPublic: {
            validators: [Validators.required]
        }
    }
} as SimpleValidationScheme<ApiFacility>;
