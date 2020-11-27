import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAvailability'
})
export class FormatAvailabilityPipe implements PipeTransform {

  transform(value: string): any {
    return value == "1"
      ? $localize`:@@stockOrderAvailability.available:Available`
      : $localize`:@@stockOrderAvailability.notAvailable:Not available`
  }


}
