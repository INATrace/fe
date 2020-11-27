import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { Validators } from '@angular/forms';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';




// export const ChainStockKeepingtUnitValidationScheme = {
//   validators: [],
//   fields: {
//     docType: {
//       validators: []
//     },
//     _id: {
//       validators: []
//     },
//     _rev: {
//       validators: []
//     },
//     productId: {
//       validators: [Validators.required]
//     },
//     facilityId: {
//       validators: [Validators.required]
//     },
//     measurementUnitType: {
//       validators: [Validators.required]
//     },
//     totalQuantity: {
//       validators: []
//     },
//     creationDate: {
//       validators: [Validators.required]
//     },
//     productionDate: {
//       validators: [Validators.required]
//     },
//     expiryDate: {
//       validators: []
//     },
//     labelId: {
//       validators: []
//     },
//     orderId: {
//       validators: []
//     },
//   }
// } as SimpleValidationScheme<ChainStockOrder>;



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
    formalCreationTime: {
      validators: [Validators.required]
    },
    identifier: {
      validators: []
    },
    creatorId: {
      validators: []
    },
    producerUserId: {
      validators: []
    },
    productionLocation: {
      validators: []
    },
    semiProductId: {
      validators: [Validators.required]
    },
    facilityId: {
      validators: [Validators.required]
    },
    measurementUnitType: {
      validators: [Validators.required]
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
    labelId: {
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
    currency: {
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
    isPurchaseOrder: {
      validators: []
    },
  }
} as SimpleValidationScheme<ChainStockOrder>;
