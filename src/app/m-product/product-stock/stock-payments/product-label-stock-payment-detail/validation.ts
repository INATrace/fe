import { Validators, FormGroup, ValidationErrors } from '@angular/forms';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { ChainPayment } from 'src/api-chain/model/chainPayment';
import { multiFieldValidator } from 'src/shared/validation';

function atLeastOnePayableTo(control: FormGroup): ValidationErrors | null {
  let toCompany = control.value && control.value['recipientOrganizationId'];
  let toFarmer = control.value && control.value['recipientUserCustomerId'];
  return toCompany == null && toFarmer == null
    ? { atLeastOnePayableTo: true }
    : null
}

function onlyOnePayableTo(control: FormGroup): ValidationErrors | null {
  let toCompany = control.value && control.value['recipientOrganizationId'];
  let toFarmer = control.value && control.value['recipientUserCustomerId'];
  return toCompany != null && toFarmer != null
    ? { onlyOnePayableTo: true }
    : null
}

function requireReceiptDocument(control: FormGroup): ValidationErrors | null {
  let paymentPurposeType = control.value && control.value['paymentPurposeType'];
  let receiptDocument = control.value && control.value['receiptDocument'];
  return paymentPurposeType == 'FIRST_INSTALLMENT' && !receiptDocument
    ? { required: true }
    : null
}

export const ChainPaymentValidationScheme = {
  validators: [
    multiFieldValidator(['recipientOrganizationId', 'recipientUserCustomerId'], atLeastOnePayableTo, ['atLeastOnePayableTo']),
    multiFieldValidator(['recipientOrganizationId', 'recipientUserCustomerId'], onlyOnePayableTo, ['onlyOnePayableTo']),
    multiFieldValidator(['receiptDocument'], requireReceiptDocument, ['required'])
  ],
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
    formalCreationTime: {
      validators: [Validators.required]
    },
    paymentType: {
      validators: [Validators.required]
    },
    currency: {
      validators: [Validators.required]
    },
    amount: {
      validators: [Validators.required]
    },
    stockOrderId: {
      validators: [Validators.required]
    },
    transactionIds: {
      validators: []
    },
    payingOrganizationId: {
      validators: [Validators.required]
    },
    recipientOrganizationId: {
      validators: []
    },
    recipientUserCustomerId: {
      validators: []
    },
    recipientCompanyCustomerId: {
      validators: []
    },
    recipientType: {
      validators: [Validators.required]
    },
    receiptNumber: {
      validators: [Validators.required]
    },
    receiptDocument: {
      validators: []
    },
    receiptDocumentType: {
      validators: [Validators.required]
    },
    bankTransferId: {
      validators: []
    },
    payingOrganization: {
      validators: []
    },
    recipientOrganization: {
      validators: []
    },
    recipientUserCustomer: {
      validators: []
    },
    recipientCompanyCustomer: {
      validators: []
    },
    representativeOfRecipientOrganizationId: {
      validators: []
    },
    representativeOfRecipientUserCustomerId: {
      validators: []
    },
    bankTransfer: {
      validators: []
    },
    paymentPurposeType: {
      validators: [Validators.required]
    },
    paymentStatus: {
      validators: []
    },
    paymentConfirmedBy: {
      validators: []
    },
    paymentConfirmedAtTime: {
      validators: []
    },
    preferredWayOfPayment: {
      validators: []
    }
  }
} as SimpleValidationScheme<ChainPayment>;

