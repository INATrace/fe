import { FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ApiProcessingAction } from 'src/api/model/apiProcessingAction';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { multiFieldValidator, requiredFieldIfOtherFieldHasValue } from 'src/shared/validation';

export function requireRepackedOutputs(control: FormGroup): ValidationErrors | null {
    if (!control || !control.value) {
        return null;
    }
    const type = control.value['type'];
    const repackedOutputs = control.value.repackedOutputs;
    const maxOutputWeight = control.value.maxOutputWeight;
    if (type !== 'PROCESSING' || !repackedOutputs) {
        return null;
    }
    if (!maxOutputWeight) {
        return {required: true};
    }
    return null;
}


export function requireInputSemiProduct(control: FormGroup): ValidationErrors | null {
    if (!control || !control.value) {
        return null;
    }
    const type = control.value['type'];
    if (type === 'TRANSFER') {
        return null;
    }
    return {required: true};
}

export const ApiProcessingActionValidationScheme = {
    validators: [
        multiFieldValidator(['outputSemiProduct'], (group: FormGroup) => requiredFieldIfOtherFieldHasValue(group, 'outputSemiProduct', 'type', 'PROCESSING'), ['required']),
        multiFieldValidator(['maxOutputWeight'], (group: FormGroup) => requireRepackedOutputs(group), ['required']),
        // multiFieldValidator(['inputSemiProduct'], (group: FormGroup) => requireInputSemiProduct(group), ['required']),
    ],
    fields: {
              company: {
                  validators: []
              },
              description: {
                  validators: [Validators.required]
              },
              id: {
                  validators: []
              },
              inputSemiProduct: {
                  validators: [Validators.required]
              },
              maxOutputWeight: {
                  validators: []
              },
              name: {
                  validators: [Validators.required]
              },
              outputSemiProduct: {
                  validators: [Validators.required]
              },
              prefix: {
                  validators: [Validators.required]
              },
              publicTimelineIconType: {
                  validators: []
              },
              publicTimelineLabel: {
                  validators: []
              },
              publicTimelineLocation: {
                  validators: []
              },
              repackedOutputs: {
                  validators: []
              },
              requiredDocumentTypes: {
                  validators: []
              },
              type: {
                  validators: [Validators.required]
              },
    }
} as SimpleValidationScheme<ApiProcessingAction>;
