import { SimpleValidationScheme } from '../../../../../interfaces/Validation';
import { ApiBulkPayment } from '../../../../../api/model/apiBulkPayment';

export const ApiBulkPaymentValidationScheme = {
    validators: [],
    fields: {
              additionalCost: {
                  validators: []
              },
              additionalCostDescription: {
                  validators: []
              },
              additionalProofs: {
                  validators: []
              },
              createdBy: {
                  validators: []
              },
              currency: {
                  validators: []
              },
              id: {
                  validators: []
              },
              payingCompany: {
                  validators: []
              },
              paymentDescription: {
                  validators: []
              },
              paymentPurposeType: {
                  validators: []
              },
              receiptNumber: {
                  validators: []
              },
              stockOrders: {
                  validators: []
              },
              totalAmount: {
                  validators: []
              },
    }
} as SimpleValidationScheme<ApiBulkPayment>;
