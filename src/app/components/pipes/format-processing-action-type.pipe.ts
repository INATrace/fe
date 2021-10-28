import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatProcessingActionType'
})
export class FormatProcessingActionTypePipe implements PipeTransform {

  transform(value: string): any {
    switch (value) {
      case 'PROCESSING':
        return $localize`:@@formatProcessingActionType.processing:Processing`;
      case 'FINAL_PROCESSING':
        return $localize`:@@formatProcessingActionType.finalProcessing:Final processing`;
      case 'SHIPMENT':
        return $localize`:@@formatProcessingActionType.quote:Quote`;
      case 'TRANSFER':
        return $localize`:@@formatProcessingActionType.transfer:Transfer`;
      default:
        return '-';
    }
  }

}
