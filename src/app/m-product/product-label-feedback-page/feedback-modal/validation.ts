import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { EmailValidator } from 'src/shared/validation';
import { ApiProductLabelFeedback } from 'src/api/model/apiProductLabelFeedback';
import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export function conditionConfirmation(control: AbstractControl): ValidationErrors | null {
  const condition = control.value
  return condition === true ? null : { conditionsNotConfirmed: true }
}


export const ApiProductLabelFeedbackValidationScheme = {
  validators: [],
  fields: {
    email: {
      validators: [EmailValidator()]
    },
    feedback: {
      validators: [Validators.maxLength(500)]
    },
    gdprConsent: {
      validators: [conditionConfirmation]
    },
    id: {
      validators: []
    },
    labelId: {
      validators: []
    },
    questionnaireAnswers: {
      validators: []
    },
    type: {
      validators: []
    },
  }
} as SimpleValidationScheme<ApiProductLabelFeedback>;



export function questionnaireAnswersFormMetadata() {
  return {
    metadata: questionnaireAnswersFormMetadata,
    vars: [
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'rateTaste',
        dataType: 'string',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'howDoYouPrepare',
        dataType: 'string',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'age',
        dataType: 'string',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      },
      {
        isReadOnly: false,
        isEnum: false,
        required: false,
        name: 'gender',
        dataType: 'string',
        isPrimitiveType: true,
        isListContainer: false,
        complexType: ''
      }
    ]
  }
}

export const questionnaireAnswersValidationScheme = {
  validators: [],
  fields: {
    rateTaste: {
      validators: []
    },
    howDoYouPrepare: {
      validators: []
    },
    age: {
      validators: []
    },
    gender: {
      validators: []
    }
  }
}



