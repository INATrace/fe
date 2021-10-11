import { Validators } from '@angular/forms';
import { EmailValidator } from 'src/shared/validation';

export const ApiGeoAddressValidationScheme = {
    forceExpand: true,
    validators: [],
    fields: {
        latitude: {
            validators: []
        },
        longitude: {
            validators: []
        },
        address: {
            validators: []
        },
        cell: {
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

export const ApiCompanyCustomerValidationScheme = {
    forceExpand: true,
    validators: [],
    fields: {
        name: {
            validators: [Validators.required]
        },
        officialCompanyName: {
            validators: []
        },
        vatId: {
            validators: []
        },
        contact: {
            validators: []
        },
        email: {
            validators: [EmailValidator]
        },
        location: ApiGeoAddressValidationScheme
    }
};
