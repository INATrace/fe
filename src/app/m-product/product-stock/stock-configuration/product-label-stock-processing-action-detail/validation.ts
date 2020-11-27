import { FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ChainProcessingAction } from 'src/api-chain/model/chainProcessingAction';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { multiFieldValidator, requiredFieldIfOtherFieldHasValue } from 'src/shared/validation';

export function requireRepackedOutputs(control: FormGroup): ValidationErrors | null {
  if(!control || !control.value) return null;
  let type = control.value['type']
  let repackedOutputs = control.value.repackedOutputs
  let maxOutputWeight = control.value.maxOutputWeight
  if(type != 'PROCESSING') return null;
  if(!repackedOutputs) return null
  if(!maxOutputWeight) return {required: true}
  return null;
}


export function requireInputSemiproduct(control: FormGroup): ValidationErrors | null {
  if(!control || !control.value) return null;
  let type = control.value['type']
  if(type === 'TRANSFER') return null
  return {required: true}
}

export const ChainProcessingActionValidationScheme = {
  validators: [
    multiFieldValidator(['outputSemiProduct'], (group: FormGroup) => requiredFieldIfOtherFieldHasValue(group, 'outputSemiProduct', 'type', 'PROCESSING'), ['required']),
    multiFieldValidator(['maxOutputWeight'], (group: FormGroup) => requireRepackedOutputs(group), ['required']),
    // multiFieldValidator(['inputSemiProduct'], (group: FormGroup) => requireInputSemiproduct(group), ['required']),
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
    productId: {
      validators: []
    },
    organizationId: {
      validators: []
    },
    name: {
      validators: [Validators.required]
    },
    description: {
      validators: [Validators.required]
    },
    inputSemiProductId: {
      validators: []
    },
    outputSemiProductId: {
      validators: []
    },
    requiredFields: {
      validators: []
    },
    inputSemiProduct: {
      validators: [Validators.required]
    },
    outputSemiProduct: {
      validators: [Validators.required]
    },
    requiredDocTypeIds: {
      validators: []
    },
    requiredDocTypes: {
      validators: []
    },
    requiredDocTypeIdsWithRequired : {
      validators: []
    },
    repackedOutputs: {
      validators: []
    },
    maxOutputWeight: {
      // validators: [notIsNaNValidator]
      validators: []
    },
    type: {
      validators: [Validators.required]
    },
    prefix: {
      validators: [Validators.required]
    }
  }
} as SimpleValidationScheme<ChainProcessingAction>;
