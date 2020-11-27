import { ChainTransaction } from 'src/api-chain/model/chainTransaction';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { multiFieldValidator } from 'src/shared/validation';
import { ChainProcessingAction } from 'src/api-chain/model/chainProcessingAction';

function tooSmallOutputQuantity(control: FormGroup): ValidationErrors | null {
  if (!control.value) return null
  if (!control.value.processingAction) return null
  let action = control.value.processingAction as ChainProcessingAction;
  if (action.type != 'SHIPMENT') return null
  let transactions = control.value.inputTransactions as ChainTransaction[]
  if (!transactions || transactions.length === 0) return null
  if (!control.value.form) return null
  let inputQuantity = transactions.map(tx => tx.outputQuantity).reduce((a, b) => a + b, 0)
  let outputQuantity = control.value.form.outputQuantity;
  if (inputQuantity > outputQuantity) return { tooSmall: inputQuantity }
  return null
}

function deliveryTimeRequired(control: FormGroup): ValidationErrors | null {
  if(!control) return null
  if (!control.value) return null

  let action = control.getRawValue().processingActionForm as ChainProcessingAction;
  if (!action) return null
  if (action.type != 'SHIPMENT') return null
  if(!control.value.deliveryTime) return {required: true}
  return null
}

function internalLotNumberRequired(control: FormGroup): ValidationErrors | null {
  if(!control) return null
  if (!control.value) return null

  let action = control.getRawValue().processingActionForm as ChainProcessingAction;
  if (!action) return null
  if (action.type != 'TRANSFER' && !control.value.internalLotNumber) return {required: true}
  return null
}


export const ChainStockOrderValidationScheme = {
  validators: [
    multiFieldValidator(['form.outputQuantity'], tooSmallOutputQuantity, ['tooSmall']),
    multiFieldValidator(['deliveryTime'], deliveryTimeRequired, ['required']),
    multiFieldValidator(['internalLotNumber'], internalLotNumberRequired, ['required'])
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
      validators: []
    },
    identifier: {
      validators: []
    },
    creatorId: {
      validators: []
    },
    representativeOfProducerUserCustomerId: {
      validators: []
    },
    producerUserCustomerId: {
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
    semiProductId: {
      validators: []
    },
    facilityId: {
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
      validators: []
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
    triggerOrderId: {
      validators: []
    },
    isOpenOrder: {
      validators: []
    },
    quoteFacilityId: {
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
} as SimpleValidationScheme<ChainStockOrder>;


export const ChainTransactionValidationScheme = {
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
} as SimpleValidationScheme<ChainTransaction>;

