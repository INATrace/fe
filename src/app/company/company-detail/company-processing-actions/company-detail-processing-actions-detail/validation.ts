import { FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ApiProcessingAction } from 'src/api/model/apiProcessingAction';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { multiFieldValidator } from 'src/shared/validation';

export function requireMaxOutputFinalProductsWeight(control: FormGroup): ValidationErrors | null {

    if (!control || !control.value) {
        return null;
    }
    const type = control.value['type'];
    const repackedOutputFinalProducts = control.value.repackedOutputFinalProducts;
    const maxOutputFinalProductsWeight = control.value.maxOutputWeight;
    if (type !== 'FINAL_PROCESSING' || !repackedOutputFinalProducts) {
        return null;
    }

    if (!maxOutputFinalProductsWeight) {
        return { required: true };
    }
    return null;
}

export function requiredTranslations(control: FormGroup): ValidationErrors | null {
    if (!control || !control.value || !control.contains('translations')) {
        return null;
    }
    const translations = control.value['translations'];
    if (translations.length === 0) {
        return { required: true };
    }
    // English translation is required, other are optional
    const englishTranslation = translations.find(t => t.language === 'EN');
    if (!englishTranslation || !englishTranslation.name || !englishTranslation.description) {
        return { required: true };
    }
    return null;
}

export function requiredFinalProductActionField(group: FormGroup): ValidationErrors | null {

  if (!group || !group.value || !group.contains('finalProductAction')) {
    return null;
  }

  const type = group.value['type'];
  const finalProductAction = group.value['finalProductAction'];

  if ((type === 'SHIPMENT' || type === 'TRANSFER') && finalProductAction == null) {
    return { required: true };
  }

  return null;
}

export function requiredInputSemiProduct(group: FormGroup): ValidationErrors | null {

  if (!group || !group.value || !group.contains('inputSemiProduct')) {
    return null;
  }

  const finalProductAction = group.value['finalProductAction'];
  const inputSemiProduct = group.value['inputSemiProduct'];

  if (!finalProductAction && inputSemiProduct == null) {
    return { required: true };
  }

  return null;
}

export function requiredInputFinalProduct(group: FormGroup): ValidationErrors | null {

  if (!group || !group.value || !group.contains('inputFinalProduct')) {
    return null;
  }

  const type = group.value['type'];
  const finalProductAction = group.value['finalProductAction'];
  const inputFinalProduct = group.value['inputFinalProduct'];

  if ((type === 'SHIPMENT' || type === 'TRANSFER') && finalProductAction && inputFinalProduct == null) {
    return { required: true };
  }

  return null;
}

export function requiredOutputFinalProduct(group: FormGroup): ValidationErrors | null {

  if (!group || !group.value || !group.contains('outputFinalProduct')) {
    return null;
  }

  const type = group.value['type'];
  const outputFinalProduct = group.value['outputFinalProduct'];

  if (type === 'FINAL_PROCESSING' && outputFinalProduct == null) {
    return { required: true };
  }

  return null;
}

export function requiredOutputSemiProducts(group: FormGroup): ValidationErrors | null {

  if (!group || !group.value || !group.contains('outputSemiProducts')) {
    return null;
  }

  const type = group.value['type'];

  // If action type is not processing we don't need further validation
  if (type !== 'PROCESSING') {
    return null;
  }

  const outputSemiProducts = group.value['outputSemiProducts'] as [];

  // Check that at least one output semi-product is added
  if (outputSemiProducts == null || outputSemiProducts.length === 0) {
    return { atLeastOneIsRequired: true };
  }

  return null;
}

export function requiredQRCodeForFinalProduct(group: FormGroup): ValidationErrors | null {

  if (!group || !group.value || !group.contains('qrCodeForFinalProduct')) {
    return null;
  }

  const type = group.value['type'];
  const qrCodeForFinalProduct = group.value['qrCodeForFinalProduct'];

  if (type === 'GENERATE_QR_CODE' && qrCodeForFinalProduct == null) {
    return { required: true };
  }

  return null;
}

export const ApiProcessingActionValidationScheme = {
  validators: [
    multiFieldValidator(['finalProductAction'], (group: FormGroup) => requiredFinalProductActionField(group), ['required']),
    multiFieldValidator(['inputSemiProduct'], (group: FormGroup) => requiredInputSemiProduct(group), ['required']),
    multiFieldValidator(['inputFinalProduct'], (group: FormGroup) => requiredInputFinalProduct(group), ['required']),
    multiFieldValidator(['outputFinalProduct'], (group: FormGroup) => requiredOutputFinalProduct(group), ['required']),
    multiFieldValidator(['qrCodeForFinalProduct'], (group: FormGroup) => requiredQRCodeForFinalProduct(group), ['required']),
    multiFieldValidator(['outputSemiProducts'], (group: FormGroup) => requiredOutputSemiProducts(group), ['atLeastOneIsRequired']),
    multiFieldValidator(['maxOutputWeight'], (group: FormGroup) => requireMaxOutputFinalProductsWeight(group), ['required']),
    multiFieldValidator(['translations'], (group: FormGroup) => requiredTranslations(group), ['required'])
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
    repackedOutputFinalProducts: {
      validators: []
    },
    requiredDocumentTypes: {
      validators: []
    },
    translations: {
      validators: [Validators.required]
    },
    valueChains: {
      validators: [Validators.required]
    },
    type: {
      validators: [Validators.required]
    },
    finalProductAction: {
      validators: [Validators.required]
    },
    inputFinalProduct: {
      validators: [Validators.required]
    },
    outputFinalProduct: {
      validators: [Validators.required]
    },
    qrCodeForFinalProduct: {
      validators: [Validators.required]
    },
    sortOrder: {
      validators: [Validators.pattern('[0-9]*')]
    }
  }
} as SimpleValidationScheme<ApiProcessingAction>;
