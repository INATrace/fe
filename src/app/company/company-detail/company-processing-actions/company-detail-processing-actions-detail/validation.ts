import {FormArray, FormGroup, ValidationErrors, Validators} from '@angular/forms';
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

export function requiredTranslations(control: FormGroup): ValidationErrors | null {
    if (!control || !control.value || !control.contains('translations')) {
        return null;
    }
    const translations = control.value['translations'];
    if (translations.length === 0) {
        return {required: true};
    }
    // English translation is required, other are optional
    const englishTranslation = translations.find(t => t.language === 'EN');
    if (!englishTranslation || !englishTranslation.name || !englishTranslation.description) {
        return {required: true};
    }
    return null;
}

export const ApiProcessingActionValidationScheme = {
    validators: [
        multiFieldValidator(['outputSemiProduct'], (group: FormGroup) => requiredFieldIfOtherFieldHasValue(group, 'outputSemiProduct', 'type', 'PROCESSING'), ['required']),
        multiFieldValidator(['maxOutputWeight'], (group: FormGroup) => requireRepackedOutputs(group), ['required']),
        multiFieldValidator(['translations'], (group: FormGroup) => requiredTranslations(group), ['required']),
        // multiFieldValidator(['inputSemiProduct'], (group: FormGroup) => requireInputSemiProduct(group), ['required']),
    ],
    fields: {
              company: {
                  validators: []
              },
              description: {
                  validators: []
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
                  validators: []
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
              translations: {
                  validators: [Validators.required]
              },
              type: {
                  validators: [Validators.required]
              },
              sortOrder: {
                  validators: [Validators.pattern('[0-9]*')]
              }
    }
} as SimpleValidationScheme<ApiProcessingAction>;
