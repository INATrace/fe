import { ValidatorFn } from '@angular/forms';

export interface SimpleValidationScheme<T> {
        validators: ValidatorFn[];
        forceFormControl?: boolean;
        forceExpand?: boolean;
        fields?: {[key: string]: SimpleValidationScheme<any>};
        arrayElementValidators?: SimpleValidationScheme<any>;
}
