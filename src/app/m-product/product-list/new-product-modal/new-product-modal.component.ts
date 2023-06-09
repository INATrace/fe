import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ActiveCompaniesService} from '../../../shared-services/active-companies.service';
import {ActiveValueChainService} from '../../../shared-services/active-value-chain.service';

@Component({
  selector: 'app-new-product-modal',
  templateUrl: './new-product-modal.component.html',
  styleUrls: ['./new-product-modal.component.scss']
})
export class NewProductModalComponent implements OnInit {

  @Input()
  dismissable = true;

  @Input()
  title = null;

  @Input()
  companyInstructionsHtml = null;

  @Input()
  valueChainInstructionsHtml = null;

  @Input()
  onSelectedCompany: (company: any) => {};

  companyForm = new FormControl(null);
  valueChainForm = new FormControl(null);


  constructor(
      public activeModal: NgbActiveModal,
      public sifrantCompany: ActiveCompaniesService,
      public sifrantValueChains: ActiveValueChainService
  ) {

  }

  ngOnInit(): void {
  }

  cancel() {
    this.activeModal.close();
  }

  onConfirm() {
    if (this.companyForm.value && this.valueChainForm.value) {
      this.activeModal.close({company: this.companyForm.value, valueChain: this.valueChainForm.value});
    }
  }
}
