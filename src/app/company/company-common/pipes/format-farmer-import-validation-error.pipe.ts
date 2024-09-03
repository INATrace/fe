import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatFarmerImportValidationError',
})
export class FormatFarmerImportValidationErrorPipe implements PipeTransform {

  transform(value: string): any {
    switch (value) {
      case 'INCORRECT_TYPE':
        return $localize`:@@companyDetail.farmers.import.validationErrors.cellError.type.INCORRECT_TYPE:The value in the cell is of wrong type`;
      case 'REQUIRED':
        return $localize`:@@companyDetail.farmers.import.validationErrors.cellError.type.REQUIRED:The cell cannot be empty`;
      case 'INVALID_VALUE':
        return $localize`:@@companyDetail.farmers.import.validationErrors.cellError.type.INVALID_VALUE:The provided value in the cell is invalid`;
      default:
        return '/';
    }
  }
}
