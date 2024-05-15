import { Validators } from '@angular/forms';

export const ApiPlotValidationScheme = {
  forceExpand: true,
  validators: [],
  fields: {
    plotName: {
      validators: [Validators.required]
    },
    crop: {
      validators: [Validators.required]
    },
  }
};

