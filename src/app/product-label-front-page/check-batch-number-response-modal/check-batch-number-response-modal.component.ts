import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faTimesCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { CheckBatchNumberModalComponent } from '../check-batch-number-modal/check-batch-number-modal.component';
import { NgbModalImproved } from 'src/app/core/ngb-modal-improved/ngb-modal-improved.service';

@Component({
  selector: 'app-check-batch-number-response-modal',
  templateUrl: './check-batch-number-response-modal.component.html',
  styleUrls: ['./check-batch-number-response-modal.component.scss']
})
export class CheckBatchNumberResponseModalComponent implements OnInit {

  @Input()
  success: boolean;

  @Input()
  public callback: () => string;

  faTimesCircle = faTimesCircle;
  faCheckCircle = faCheckCircle;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  tryAgain(){
    this.dismiss();
  }

}
