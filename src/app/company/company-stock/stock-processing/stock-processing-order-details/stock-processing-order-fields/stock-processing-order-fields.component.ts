import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiProcessingEvidenceField } from '../../../../../../api/model/apiProcessingEvidenceField';

@Component({
  selector: 'app-stock-processing-order-fields',
  templateUrl: './stock-processing-order-fields.component.html',
  styleUrls: ['./stock-processing-order-fields.component.scss']
})
export class StockProcessingOrderFieldsComponent implements OnInit {

  private fieldInfoLocal: ApiProcessingEvidenceField;
  private formGroupLocal: FormGroup;

  @Input()
  submitted: boolean;

  @Input()
  side: 'left' | 'right' = 'right';

  @Input()
  isQuote = false;

  @Input()
  rowClass = 'af-row';

  @Input()
  colClass = 'af-c12';

  @Input()
  set fieldInfo(value: ApiProcessingEvidenceField) {
    this.fieldInfoLocal = value;
  }

  get fieldInfo(): ApiProcessingEvidenceField {
    return this.fieldInfoLocal;
  }

  @Input()
  set formGroup(value: FormGroup) {
    this.formGroupLocal = value;
  }

  get formGroup(): FormGroup {
    return this.formGroupLocal;
  }

  get showRow() {
    return this.fieldInfo && this.fieldInfo.fieldName && this.formGroup;
  }

  constructor() {}

  ngOnInit(): void {
  }

}
