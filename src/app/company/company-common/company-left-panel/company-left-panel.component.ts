import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalEventManagerService } from '../../../core/global-event-manager.service';
import { Subscription } from 'rxjs';
import { CompanyControllerService } from '../../../../api/api/companyController.service';
import { take } from 'rxjs/operators';
import { ApiResponseApiCompanyGet } from '../../../../api/model/apiResponseApiCompanyGet';
import StatusEnum = ApiResponseApiCompanyGet.StatusEnum;

@Component({
  selector: 'app-company-left-panel',
  templateUrl: './company-left-panel.component.html',
  styleUrls: ['./company-left-panel.component.scss']
})
export class CompanyLeftPanelComponent implements OnInit, OnDestroy {

  companyTitle: string;

  imgStorageKey: string = null;

  private companySubs: Subscription;

  constructor(
    private globalEventManager: GlobalEventManagerService,
    private companyControllerService: CompanyControllerService
  ) { }

  ngOnInit() {
    this.companySubs = this.globalEventManager.selectedUserCompanyEmitter.subscribe(company => this.companyTitle = company);

    const selectedCompanyId = localStorage.getItem('selectedUserCompany');
    if (!selectedCompanyId) {
      return;
    }

    this.companyControllerService.getCompanyUsingGET(Number(selectedCompanyId))
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

}
