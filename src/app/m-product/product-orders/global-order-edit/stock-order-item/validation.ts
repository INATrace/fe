import { Validators } from '@angular/forms';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { SimpleValidationScheme } from 'src/interfaces/Validation';

export const ChainStockOrderValidationScheme = {
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
    consumerCompanyCustomerId: {
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
      validators: [Validators.required]
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
      validators: [Validators.required]
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
    consumerCompanyCustomer: {
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
    pricePerUnitForBuyer: {
      validators: []
    },
    exchangeRateAtBuyer: {
      validators: []
    },
    pricePerUnitForEndCustomer: {
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
    roastingProfile: {
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
    dateOfEndDelivery: {
      validators: []
    },
    requiredWomensCoffee: {
      validators: []
    },
    requiredQuality: {
      validators: []
    },
    requiredQualityId: {
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
