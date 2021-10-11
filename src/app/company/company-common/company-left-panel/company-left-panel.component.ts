import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalEventManagerService } from '../../../core/global-event-manager.service';
import { Subscription } from 'rxjs';
import { CompanyControllerService } from '../../../../api/api/companyController.service';
import { take } from 'rxjs/operators';
import { ApiResponseApiCompanyGet } from '../../../../api/model/apiResponseApiCompanyGet';
import StatusEnum = ApiResponseApiCompanyGet.StatusEnum;
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-left-panel',
  templateUrl: './company-left-panel.component.html',
  styleUrls: ['./company-left-panel.component.scss']
})
export class CompanyLeftPanelComponent implements OnInit, OnDestroy {

  faCog = faCog;

  companyTitle: string;
  private companyId: number;

  imgStorageKey: string = null;

  private companySubs: Subscription;

  constructor(
    private router: Router,
    private globalEventManager: GlobalEventManagerService,
    private companyControllerService: CompanyControllerService
  ) { }

  ngOnInit() {
    this.companySubs = this.globalEventManager.selectedUserCompanyEmitter.subscribe(company => this.companyTitle = company);

    const selectedCompanyId = localStorage.getItem('selectedUserCompany');
    if (!selectedCompanyId) {
      return;
    }

    this.companyId = Number(selectedCompanyId);

    this.companyControllerService.getCompanyUsingGET(this.companyId)
      .pipe(
        take(1)
      )
      .subscribe(response => {
        if (response && response.status === StatusEnum.OK && response.data) {
          this.imgStorageKey = response.data.logo.storageKey;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.companySubs) {
      this.companySubs.unsubscribe();
    }
  }

  openCompanyProfile() {
    if (!this.companyId) {
      return;
    }

    this.router.navigate(['companies', this.companyId, 'company']).then();
  }

}
