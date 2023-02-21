import { Validators } from '@angular/forms';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { ApiProcessingOrder } from '../../../../../api/model/apiProcessingOrder';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';

export const ApiProcessingOrderValidationScheme = {
  validators: [],
  fields: {
    initiatorUserId: {
      validators: [Validators.required]
    },
    inputTransactions: {
      validators: []
    },
    processingAction: {
      validators: [Validators.required]
    },
    processingDate: {
      validators: [Validators.required]
    },
    targetStockOrders: {
      validators: [Validators.required]
    },
  }
} as SimpleValidationScheme<ApiProcessingOrder>;

export const ApiStockOrderValidationScheme = {
  validators: [],
  fields: {
    totalQuantity: {
      validators: []
    },
    internalLotNumber: {
      validators: [Validators.required]
    }
  }
} as SimpleValidationScheme<ApiStockOrder>;
