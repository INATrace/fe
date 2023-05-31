import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ReplaySubject } from 'rxjs';
import { ApiCompanyGet } from '../../api/model/apiCompanyGet';
import { CompanyControllerService } from '../../api/api/companyController.service';
import { ApiUserGet } from '../../api/model/apiUserGet';
import { take } from 'rxjs/operators';
import { EnumSifrant } from '../shared-services/enum-sifrant';
import { SelectedUserCompanyModalComponent } from '../user/selected-user-company-modal/selected-user-company-modal.component';
import { NgbModalImproved } from './ngb-modal-improved/ngb-modal-improved.service';

@Injectable({
  providedIn: 'root'
})
export class SelectedUserCompanyService {

  private readonly selectedCompanyProfileSubject = new ReplaySubject<ApiCompanyGet>(1);
  selectedCompanyProfile$ = this.selectedCompanyProfileSubject.asObservable();

  constructor(
    private authService: AuthService,
    private companyControllerService: CompanyControllerService,
    private modalService: NgbModalImproved,
  ) {
    this.authService.userProfile$.subscribe(userProfile => this.selectUserCompany(userProfile));
  }

  private async selectUserCompany(user: ApiUserGet): Promise<void> {

    if (user) {

      // If there is already selected company, check that the user has access to it (if not, remove it from local storage)
      let currentlySelectedCompany = localStorage.getItem('selectedUserCompany');
      if (user.companyIds == null || user.companyIds.length === 0 || !user.companyIds.includes(Number(currentlySelectedCompany))) {
        localStorage.removeItem('selectedUserCompany');
        this.selectedCompanyProfileSubject.next(null);
        currentlySelectedCompany = null;
      }

      // If there is no current company selected, selected one or present modal dialog with list of available companies
      if (currentlySelectedCompany == null) {
        if (user.companyIds && user.companyIds.length === 1) {
          const res = await this.companyControllerService.getCompanyUsingGET(user.companyIds[0]).toPromise();
          if (res && res.status === 'OK' && res.data) {
            localStorage.setItem('selectedUserCompany', String(res.data.id));
            this.selectedCompanyProfileSubject.next(res.data);
            // TODO: rethink this
            // this.globalEventManager.selectedUserCompany(res.data.name);
          }
          return;
        }

        this.listMyCompanies(user.companyIds ?? []).then();
      }

    } else {
      // TODO: handle this case
    }
  }

  private async listMyCompanies(ids): Promise<void> {

    if (this.modalService.hasOpenModals()) {
      return;
    }

    const objCompanies = {};
    for (const id of ids) {
      const res = await this.companyControllerService.getCompanyUsingGET(id).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        objCompanies[res.data.id] = res.data.name;
      }
    }

    // TODO: refactor this to support Company object
    const codebookMyCompanies = EnumSifrant.fromObject(objCompanies);

    const modalRef = this.modalService.open(SelectedUserCompanyModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false });
    Object.assign(modalRef.componentInstance, {
      codebookMyCompanies
    });

    const company = await modalRef.result;
    if (company) {
      localStorage.setItem('selectedUserCompany', company);
      this.selectedCompanyProfileSubject.next(company);
      // TODO: rethink this
      // this.globalEventManager.selectedUserCompany(objCompanies[company]);
    }
  }

}
