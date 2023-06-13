import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiEnumWithLabelString, EnumSifrant } from '../../shared-services/enum-sifrant';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-selected-user-company-modal',
  templateUrl: './selected-user-company-modal.component.html',
  styleUrls: ['./selected-user-company-modal.component.scss']
})
export class SelectedUserCompanyModalComponent implements OnInit {

  @Input()
  codebookMyCompanies: EnumSifrant;

  title = $localize`:@@selectUserCompany.title:Select company`;
  instructionsHtml = $localize`:@@selectUserCompany.instructionsHtml:Select a company you would like to continue with:`;

  @Input()
  onSelectedCompany: (company: any) => {};

  companyForm = new FormControl('');

  availableUserCompanies$: Observable<ApiEnumWithLabelString[]> | undefined = undefined;

  protected readonly length = length;

  constructor(
    private activeModal: NgbActiveModal,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.availableUserCompanies$ = this.codebookMyCompanies.getAllCandidates().pipe(take(1));
  }

  cancel() {
    this.activeModal.close();
  }

  onConfirm(): void {
    if (this.companyForm.value) {
      this.activeModal.close(this.companyForm.value);
    }
  }

  logout(): void {
    this.authService.logout().then(() => this.activeModal.dismiss());
  }

}
