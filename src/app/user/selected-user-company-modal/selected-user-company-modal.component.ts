import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-selected-user-company-modal',
  templateUrl: './selected-user-company-modal.component.html',
  styleUrls: ['./selected-user-company-modal.component.scss']
})
export class SelectedUserCompanyModalComponent implements OnInit {

  @Input()
  codebookMyCompanies;

  title = $localize`:@@selectUserCompany.title:Select company`;
  instructionsHtml = $localize`:@@selectUserCompany.instructionsHtml:Select a company you would like to continue with:`;

  @Input()
  onSelectedCompany: (company: any) => {};

  companyForm = new FormControl('');

  constructor(
    public activeModal: NgbActiveModal
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
