import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyDetailTabManagerComponent } from '../company-detail-tab-manager/company-detail-tab-manager.component';
import { GlobalEventManagerService } from '../../../core/global-event-manager.service';
import { AuthService } from '../../../core/auth.service';
import { CompanyControllerService } from '../../../../api/api/companyController.service';

@Component({
  selector: 'app-company-processing-actions',
  templateUrl: './company-processing-actions.component.html',
  styleUrls: ['./company-processing-actions.component.scss']
})
export class CompanyProcessingActionsComponent extends CompanyDetailTabManagerComponent implements OnInit, OnDestroy {

  rootTab = 3;
  prepared = false;

  organizationId: number;

  showedProcessingActions = 0;
  allProcessingActions = 0;

  constructor(
      protected router: Router,
      protected route: ActivatedRoute,
      protected globalEventsManager: GlobalEventManagerService,
      protected authService: AuthService,
      protected companyController: CompanyControllerService,
  ) {
    super(router, route, authService, companyController);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.organizationId = +this.route.snapshot.paramMap.get('id');
    this.prepared = true;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  async newProcessingAction() {
    await this.router.navigate(['companies', this.organizationId, 'processingActions', 'new']);
  }

  onShowSP(event) {
    this.showedProcessingActions = event;
  }

  onCountAll(event){
    this.allProcessingActions = event;
  }

  canDeactivate() {
    return true;
  }

}
