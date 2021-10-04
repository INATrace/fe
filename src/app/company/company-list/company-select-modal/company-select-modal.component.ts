import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActiveCompaniesService } from 'src/app/shared-services/active-companies.service';

@Component({
  selector: 'app-company-select-modal',
  templateUrl: './company-select-modal.component.html',
  styleUrls: ['./company-select-modal.component.scss']
})
export class CompanySelectModalComponent implements OnInit {

  @Input()
  dismissable = true;

  @Input()
  title = null;

  @Input()
  instructionsHtml = null;

  @Input()
  onSelectedCompany: (company: any) => {};

  companyForm = new FormControl(null);

  constructor(
    public activeModal: NgbActiveModal,
    public sifrantCompany: ActiveCompaniesService
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.activeModal.close();
  }

  onConfirm() {
    if (this.companyForm.value) {
      this.activeModal.close(this.companyForm.value);
    }
  }
}
