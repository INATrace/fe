import { ChainBulkPayment } from 'src/api-chain/model/chainBulkPayment';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { Validators } from '@angular/forms';


export const ChainBulkPaymentValidationScheme = {
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
    currency: {
      validators: []
    },
    formalCreationTime: {
      validators: [Validators.required]
    },
    payingOrganizationId: {
      validators: [Validators.required]
    },
    paymentPurposeType: {
      validators: [Validators.required]
    },
    paymentDescription: {
      validators: [Validators.required]
    },
    totalAmount: {
      validators: [Validators.required]
    },
    additionalCost: {
      validators: []
    },
    additionalCostDescription: {
      validators: []
    },
    payments: {
      validators: []
    },
    additionalProofs: {
      validators: []
    },
    payingOrganization: {
      validators: []
    },
    receiptNumber: {
      validators: [Validators.required]
    },
    paymentPerKg: {
      validators: []
    },
  }
} as SimpleValidationScheme<ChainBulkPayment>;

