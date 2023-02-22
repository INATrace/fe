import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ApiStockOrderEvidenceFieldValue } from '../../../../../api/model/apiStockOrderEvidenceFieldValue';
import { ApiProcessingAction } from '../../../../../api/model/apiProcessingAction';
import { ApiStockOrderEvidenceTypeValue } from '../../../../../api/model/apiStockOrderEvidenceTypeValue';
import { ApiProcessingEvidenceType } from '../../../../../api/model/apiProcessingEvidenceType';
import ProcessingEvidenceFieldType = ApiProcessingEvidenceField.TypeEnum;
import { ApiProcessingEvidenceField } from '../../../../../api/model/apiProcessingEvidenceField';
import { ApiActivityProof } from '../../../../../api/model/apiActivityProof';
import { defaultEmptyObject } from '../../../../../shared/utils';
import { ApiActivityProofValidationScheme } from '../../stock-core/additional-proof-item/validation';

export class StockProcessingOrderDetailsHelper {

  public static setFormControlValidators(formGroup: FormGroup, formControlName: string, validators: ValidatorFn[]) {
    formGroup.get(formControlName).setValidators(validators);
    formGroup.get(formControlName).updateValueAndValidity();
  }

  public static async setRequiredProcessingEvidence(action: ApiProcessingAction, requiredProcessingEvidenceArray: FormArray) {

    requiredProcessingEvidenceArray.clear();

    if (action && action.requiredDocumentTypes && action.requiredDocumentTypes.length > 0) {

      for (const requiredDocumentType of action.requiredDocumentTypes) {
        requiredProcessingEvidenceArray.push(new FormGroup({
          evidenceTypeId: new FormControl(requiredDocumentType.id),
          evidenceTypeCode: new FormControl(requiredDocumentType.code),
          evidenceTypeLabel: new FormControl({ value: requiredDocumentType.label, disabled: true }),
          date: new FormControl(new Date(), requiredDocumentType.mandatory ? Validators.required : null),
          document: new FormControl(null, requiredDocumentType.mandatory ? Validators.required : null)
        }));
      }

    } else {
      requiredProcessingEvidenceArray.clear();
    }
  }

  public static prepareRequiredEvidenceTypeValues(requiredProcessingEvidenceArray: FormArray): ApiStockOrderEvidenceTypeValue[] {

    const evidenceTypesValues: ApiStockOrderEvidenceTypeValue[] = [];

    for (const control of requiredProcessingEvidenceArray.controls) {
      const controlValue: ApiStockOrderEvidenceTypeValue = control.value;
      if (controlValue && controlValue.document && controlValue.document.id) {
        evidenceTypesValues.push(controlValue);
      }
    }

    return evidenceTypesValues;
  }

  public static prepareOtherEvidenceDocuments(otherProcessingEvidenceArray: FormArray): ApiStockOrderEvidenceTypeValue[] {

    const otherEvidenceDocuments: ApiStockOrderEvidenceTypeValue[] = [];

    for (const control of otherProcessingEvidenceArray.controls) {

      const evidenceType: ApiProcessingEvidenceType = control.value.type;

      otherEvidenceDocuments.push({
        evidenceTypeId: evidenceType.id,
        evidenceTypeCode: evidenceType.code,
        date: control.value.formalCreationDate,
        document: control.value.document
      });
    }

    return otherEvidenceDocuments;
  }

  public static prepareRequiredEvidenceFieldValues(stockOrderEvidenceFields,
                                                   selectedProcAction: ApiProcessingAction): ApiStockOrderEvidenceFieldValue[] {

    const evidenceFieldsValues: ApiStockOrderEvidenceFieldValue[] = [];

    // Create stock order evidence field instances (values) for every form control
    Object.keys(stockOrderEvidenceFields).forEach(key => {

      const procEvidenceField = selectedProcAction.requiredEvidenceFields.find(pef => pef.fieldName === key);

      const evidenceFieldValue: ApiStockOrderEvidenceFieldValue = {
        evidenceFieldId: procEvidenceField.id,
        evidenceFieldName: procEvidenceField.fieldName
      };

      switch (procEvidenceField.type) {
        case ProcessingEvidenceFieldType.NUMBER:
        case ProcessingEvidenceFieldType.INTEGER:
        case ProcessingEvidenceFieldType.EXCHANGERATE:
        case ProcessingEvidenceFieldType.PRICE:
          evidenceFieldValue.numericValue = stockOrderEvidenceFields[key];
          break;
        case ProcessingEvidenceFieldType.DATE:
        case ProcessingEvidenceFieldType.TIMESTAMP:
          evidenceFieldValue.dateValue = stockOrderEvidenceFields[key];
          break;
        case ProcessingEvidenceFieldType.STRING:
        case ProcessingEvidenceFieldType.TEXT:
          evidenceFieldValue.stringValue = stockOrderEvidenceFields[key];
          break;
        default:
          evidenceFieldValue.stringValue = stockOrderEvidenceFields[key];
      }

      evidenceFieldsValues.push(evidenceFieldValue);
    });

    return evidenceFieldsValues;
  }

  // Create form control for use in activity proofs list manager
  public static ApiActivityProofCreateEmptyObject(): ApiActivityProof {
    const obj = ApiActivityProof.formMetadata();
    return defaultEmptyObject(obj) as ApiActivityProof;
  }

  public static ApiActivityProofEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(StockProcessingOrderDetailsHelper.ApiActivityProofCreateEmptyObject(),
        ApiActivityProofValidationScheme.validators);
    };
  }
}
