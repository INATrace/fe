import { Validators } from '@angular/forms';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { StockOrderType } from 'src/shared/types';


export function ChainStockOrderValidationScheme(orderType: StockOrderType) {
  return {
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
        validators: orderType === 'PURCHASE_ORDER'
          ? [Validators.required]
          : []
      },
      productionLocation: {
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
        validators: orderType != 'PROCESSING_ORDER'
          ? [Validators.required]
          : []
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
        validators: [Validators.required]
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
        validators: orderType === 'PURCHASE_ORDER'
          ? [Validators.required]
          : []
      },
      salesPricePerUnit: {
        validators: orderType === 'SALES_ORDER'
          ? [Validators.required]
          : []
      },
      currency: {
        validators: orderType === 'PURCHASE_ORDER'
          ? [Validators.required]
          : []
      },
      salesCurrency: {
        validators: orderType === 'SALES_ORDER'
          ? [Validators.required]
          : []
      },
      isPurchaseOrder: {
        validators: []
      },
      orderType: {
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
      preferredWayOfPayment: {
        validators: [Validators.required]
      },
    }
  } as SimpleValidationScheme<ChainStockOrder>;
}


  // export const ChainStockOrderValidationScheme = {
  //     validators: [],
  //     fields: {
  //               balance: {
  //                   validators: []
  //               },
  //               semiProduct: {
  //                   validators: []
  //               },
  //               facility: {
  //                   validators: []
  //               },
  //               representativeOfProducerUserCustomer: {
  //                   validators: []
  //               },
  //               producerUserCustomer: {
  //                   validators: []
  //               },
  //               inputTransactions: {
  //                   validators: []
  //               },
  //               outputTransactions: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ChainStockOrder>;
