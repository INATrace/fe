import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../system/auth.service';
import { NgbModalImproved } from '../../system/ngb-modal-improved/ngb-modal-improved.service';
import { WelcomeScreenUnconfirmedComponent } from '../../welcome-screen-unconfirmed/welcome-screen-unconfirmed.component';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { EnumSifrant } from '../../shared-services/enum-sifrant';
import { SelectedUserCompanyModalComponent } from '../selected-user-company-modal/selected-user-company-modal.component';
import { GlobalEventManagerService } from '../../system/global-event-manager.service';
import { dbKey } from 'src/shared/utils';
import { CompanyControllerService } from '../../../api/api/companyController.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    public router: Router,
    private modalService: NgbModalImproved,
    private globalEventManager: GlobalEventManagerService,
    private companyControllerService: CompanyControllerService
  ) { }

  user = null;
  sub: Subscription;
  confirmedOnlyUser = false;

  codebookMyCompanies;

  ngOnInit(): void {
    this.authService.refreshUserProfile();
    this.sub = this.authService.userProfile$.subscribe(user => {
      if (this.authService.currentUserProfile) {
        this.user = user;
        this.confirmedOnlyUser = user.status === 'CONFIRMED_EMAIL';
        if (this.confirmedOnlyUser && !this.modalService.hasOpenModals()) { this.openModal(); }
        if (!localStorage.getItem('selectedUserCompany') && !this.confirmedOnlyUser) { this.setSelectedUserCompany(user).then(); }
      }
    });
  }

  openModal() {
    const modalRef = this.modalService.open(WelcomeScreenUnconfirmedComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    Object.assign(modalRef.componentInstance, {});
  }

  async setSelectedUserCompany(user) {
    if (!user) { return; }
    if (user.companyIds && user.companyIds.length === 1) {
      const res = await this.companyControllerService.getCompanyUsingGET(user.companyIds[0]).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        localStorage.setItem('selectedUserCompany', String(res.data.id));
        this.globalEventManager.selectedUserCompany(res.data.name);
      }
    }
    if (user.companyIds && user.companyIds.length > 1) {
      this.listMyCompanies(user.companyIds).then();
    }
  }

  async listMyCompanies(ids) {
    const objCompanies = {};
    for (const id of ids) {
      const res = await this.companyControllerService.getCompanyUsingGET(id).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        objCompanies[dbKey(res.data)] = res.data.name;
      }
    }
    this.codebookMyCompanies = EnumSifrant.fromObject(objCompanies);
    if (this.modalService.hasOpenModals()) { return; }
    const modalRef = this.modalService.open(SelectedUserCompanyModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false });
    Object.assign(modalRef.componentInstance, {
      codebookMyCompanies: this.codebookMyCompanies
    });
    const company = await modalRef.result;
    if (company) {
      localStorage.setItem('selectedUserCompany', company);
      this.globalEventManager.selectedUserCompany(objCompanies[company]);
    }
  }

}
