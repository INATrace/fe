import { Validators } from '@angular/forms';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { ApiStockOrder } from '../../../../../../api/model/apiStockOrder';

export const ApiStockOrderValidationScheme = {
  validators: [],
  fields: {
    totalQuantity: {
      validators: [Validators.required]
    },
    processingAction: {
      validators: [Validators.required]
    }
  }
} as SimpleValidationScheme<ApiStockOrder>;
