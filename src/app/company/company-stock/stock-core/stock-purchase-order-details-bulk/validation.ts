import {Validators} from '@angular/forms';
import {SimpleValidationScheme} from '../../../../../interfaces/Validation';
import {ApiPurchaseOrder} from '../../../../../api/model/apiPurchaseOrder';
import {ApiPurchaseOrderFarmer} from '../../../../../api/model/apiPurchaseOrderFarmer';


export function ApiPurchaseOrderValidationScheme() {
  return {
    validators: [],
    fields: {
      creatorId: {
        validators: [Validators.required]
      },
      productionDate: {
        validators: [Validators.required]
      },
      currency: {
        validators: [Validators.required]
      },
      representativeOfProducerUserCustomer: {
        validators: []
      },
      preferredWayOfPayment: {
        validators: [Validators.required]
      }
    }
  } as SimpleValidationScheme<ApiPurchaseOrder>;
}

export function ApiPurchaseOrderFarmerValidationScheme() {
  return {
    validators: [],
    fields: {
      semiProduct: {
        validators: [Validators.required]
      },
      producerUserCustomer: {
        validators: [Validators.required]
      },
      totalGrossQuantity: {
        validators: [Validators.required]
      },
      totalQuantity: {
         validators : []
      },
      pricePerUnit: {
        validators: [Validators.required]
      },
      salesPricePerUnit: {
        validators: []
      },
      salesCurrency: {
        validators: []
      },
      womenShare: {
        validators: [Validators.required]
      }
    }
  } as SimpleValidationScheme<ApiPurchaseOrderFarmer>;
}
