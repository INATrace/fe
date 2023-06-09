import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaceQuoteOrderModalResult } from './model';

@Component({
  selector: 'app-place-quote-order-modal',
  templateUrl: './place-quote-order-modal.component.html',
  styleUrls: ['./place-quote-order-modal.component.scss']
})
export class PlaceQuoteOrderModalComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.activeModal.close();
  }

  onConfirm() {
    // TODO: implement facility and processing action selection
    const result: PlaceQuoteOrderModalResult = {
      facilityId: 10,
      orderTemplateId: 15
    };
    this.activeModal.close(result);
  }

}
