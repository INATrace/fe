import { Validators } from '@angular/forms';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { ApiStockOrder } from '../../../../../../api/model/apiStockOrder';
import { ApiProcessingOrder } from '../../../../../../api/model/apiProcessingOrder';

export const ApiStockOrderValidationScheme = {
  validators: [],
  fields: {
    totalQuantity: {
      validators: [Validators.required]
    },
    pricePerUnitForEndCustomer: {
      validators: [Validators.required]
    },
    currencyForEndCustomer: {
      validators: [Validators.required]
    }
  }
} as SimpleValidationScheme<ApiStockOrder>;

export const ApiProcessingOrderValidationScheme = {
  validators: [],
  fields: {
    processingAction: {
      validators: [Validators.required]
    }
  }
} as SimpleValidationScheme<ApiProcessingOrder>;
