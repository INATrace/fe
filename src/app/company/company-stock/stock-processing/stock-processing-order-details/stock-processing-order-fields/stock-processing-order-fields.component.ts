import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiProcessingEvidenceField } from '../../../../../../api/model/apiProcessingEvidenceField';

@Component({
  selector: 'app-order-fields',
  templateUrl: './stock-processing-order-fields.component.html',
  styleUrls: ['./stock-processing-order-fields.component.scss']
})
export class StockProcessingOrderFieldsComponent implements OnInit {

  fieldInfoLocal: ApiProcessingEvidenceField;
  formGroupLocal: FormGroup;
  disabledLocal = false;

  @Input()
  submitted: boolean;

  @Input()
  productId: number;

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
    this.initialize();
  }

  get fieldInfo(): ApiProcessingEvidenceField {
    return this.fieldInfoLocal;
  }

  @Input()
  set formGroup(value: FormGroup) {
    this.formGroupLocal = value;
    this.initialize();
  }

  get formGroup(): FormGroup {
    return this.formGroupLocal;
  }

  @Input()
  set disabled(value: boolean) {
    this.disabledLocal = value;
    this.refreshDisabled();
  }

  get disabled(): boolean {
    return this.disabledLocal;
  }

  constructor() {}

  ngOnInit(): void {
  }

  private initialize() {
    // TODO: implement
  }

  private refreshDisabled() {
    // TODO: implement
  }

}
