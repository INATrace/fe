import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { FormArray, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { multiFieldValidator } from 'src/shared/validation';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { ApiTransaction } from '../../../../../api/model/apiTransaction';
import { ApiProcessingAction } from '../../../../../api/model/apiProcessingAction';

function tooSmallOutputQuantity(control: FormGroup): ValidationErrors | null {

  if (!control.value) { return null; }
  if (!control.value.processingAction) { return null; }
  const action = control.value.processingAction as ApiProcessingAction;
  if (action.type !== 'SHIPMENT') { return null; }
  const transactions = control.value.inputTransactions as ApiTransaction[];
  if (!transactions || transactions.length === 0) { return null; }
  if (!control.value.form) { return null; }
  const inputQuantity = transactions.map(tx => tx.outputQuantity).reduce((a, b) => a + b, 0);
  const outputQuantity = control.value.form.outputQuantity;
  if (inputQuantity > outputQuantity) { return { tooSmall: inputQuantity }; }
  return null;
}

function deliveryTimeRequired(control: FormGroup): ValidationErrors | null {

  if (!control) { return null; }
  if (!control.value) { return null; }

  const action = control.getRawValue().processingActionForm as ApiProcessingAction;
  if (!action) { return null; }
  if (action.type !== 'SHIPMENT') { return null; }
  if (!control.value.deliveryTime) { return {required: true}; }
  return null;
}

export const ApiStockOrderValidationScheme = {
  validators: [
    multiFieldValidator(['form.outputQuantity'], tooSmallOutputQuantity, ['tooSmall']),
    multiFieldValidator(['deliveryTime'], deliveryTimeRequired, ['required'])
  ],
  fields: {
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
      validators: []
    },
    identifier: {
      validators: []
    },
    creatorId: {
      validators: []
    },
    productionLocation: {
      validators: []
    },
    certificates: {
      validators: []
    },
    consumerCompanyCustomer: {
      validators: []
    },
    measurementUnitType: {
      validators: []
    },
    totalQuantity: {
      validators: []
    },
    fullfilledQuantity: {
      validators: []
    },
    availableQuantity: {
      validators: []
    },
    isAvailable: {
      validators: []
    },
    productionDate: {
      validators: []
    },
    expiryDate: {
      validators: []
    },
    estimatedDeliveryDate: {
      validators: []
    },
    deliveryTime: {
      validators: []
    },
    orderId: {
      validators: []
    },
    globalOrderId: {
      validators: []
    },
    documentRequirements: {
      validators: []
    },
    pricePerUnit: {
      validators: []
    },
    salesPricePerUnit: {
      validators: []
    },
    currency: {
      validators: []
    },
    salesCurrency: {
      validators: []
    },
    isPurchaseOrder: {
      validators: []
    },
    orderType: {
      validators: []
    },
    gradeAbbreviationId: {
      validators: []
    },
    internalLotNumber: {
      validators: [Validators.required]
    },
    lotNumber: {
      validators: []
    },
    screenSize: {
      validators: []
    },
    comments: {
      validators: []
    },
    actionType: {
      validators: []
    },
    womenShare: {
      validators: []
    },
    cost: {
      validators: []
    },
    paid: {
      validators: []
    },
    balance: {
      validators: []
    },
    semiProduct: {
      validators: []
    },
    facility: {
      validators: []
    },
    representativeOfProducerUserCustomer: {
      validators: []
    },
    producerUserCustomer: {
      validators: []
    },
    inputTransactions: {
      validators: []
    },
    outputTransactions: {
      validators: []
    },
    lotLabel: {
      validators: []
    },
    startOfDrying: {
      validators: []
    },
    clientId: {
      validators: []
    },
    flavourProfile: {
      validators: []
    },
    processingActionId: {
      validators: []
    },
    processingAction: {
      validators: []
    },
    gradeAbbreviation: {
      validators: []
    },
    processingOrderId: {
      validators: []
    },
    processingOrder: {
      validators: []
    },
    preferredWayOfPayment: {
      validators: []
    },
    client: {
      validators: []
    },
    sacNumber: {
      validators: []
    },
    isOpenOrder: {
      validators: []
    },
    inputOrders: {
      validators: []
    },
    pricePerUnitForOwner: {
      validators: []
    },
    currencyPricePerUnitForOwner: {
      validators: []
    },
    pricePerUnitForBuyer: {
      validators: []
    },
    currencyPricePerUnitForBuyer: {
      validators: []
    },
    exchangeRateAtBuyer: {
      validators: []
    },
    pricePerUnitForEndCustomer: {
      validators: []
    },
    currencyPricePerUnitForEndCustomer: {
      validators: []
    },
    exchangeRateAtEndCustomer: {
      validators: []
    },
    cuppingResult: {
      validators: []
    },
    cuppingGrade: {
      validators: []
    },
    cuppingFlavour: {
      validators: []
    },
    roastingDate: {
      validators: []
    },
    shipperDetails: {
      validators: []
    },
    carrierDetails: {
      validators: []
    },
    portOfLoading: {
      validators: []
    },
    portOfDischarge: {
      validators: []
    },
    locationOfEndDelivery: {
      validators: []
    },
    shippedAtDateFromOriginPort: {
      validators: []
    },
    arrivedAtDateToDestinationPort: {
      validators: []
    }
  }
} as SimpleValidationScheme<ApiStockOrder>;

export const ApiTransactionValidationScheme = {
  validators: [],
  fields: {
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
    initiatorUserId: {
      validators: []
    },
    sourceStockOrderIds: {
      validators: []
    },
    targetStockOrderId: {
      validators: []
    },
    sourceFacilityId: {
      validators: []
    },
    targetFacilityId: {
      validators: []
    },
    actionType: {
      validators: []
    },
    status: {
      validators: []
    },
    shippmentId: {
      validators: []
    },
    inputMeasureUnitType: {
      validators: []
    },
    inputQuantity: {
      validators: []
    },
    outputMeasureUnitType: {
      validators: []
    },
    outputQuantity: {
      validators: []
    },
    pricePerUnit: {
      validators: []
    },
    currency: {
      validators: []
    },
    gradeAbbreviationId: {
      validators: []
    },
    gradeAbbreviation: {
      validators: []
    }
  }
} as SimpleValidationScheme<ApiTransaction>;

export function customValidateArrayGroup(): ValidatorFn {
  return (formArray: FormArray): { [key: string]: any } | null => {
    let valid = false;
    for (const item of formArray.controls) {
      if (item.value.totalQuantity != null && item.value.totalQuantity > 0) {
        valid = true;
        break;
      }
    }
    return valid ? null : { atLeastOne: true };
  };
}
