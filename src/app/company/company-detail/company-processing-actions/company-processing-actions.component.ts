import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyDetailTabManagerComponent } from '../company-detail-tab-manager/company-detail-tab-manager.component';
import { GlobalEventManagerService } from '../../../core/global-event-manager.service';
import { ProcessingActionControllerService } from '../../../../api/api/processingActionController.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-company-processing-actions',
  templateUrl: './company-processing-actions.component.html',
  styleUrls: ['./company-processing-actions.component.scss']
})
export class CompanyProcessingActionsComponent extends CompanyDetailTabManagerComponent implements OnInit {

  rootTab = 3;
  prepared = false;

  organizationId: number;

  showedProcessingActions = 0;
  allProcessingActions = 0;

  constructor(
      protected router: Router,
      protected route: ActivatedRoute,
      protected globalEventsManager: GlobalEventManagerService,
      protected processingActionControllerService: ProcessingActionControllerService
  ) {
    super(router, route);
  }

  ngOnInit(): void {
    this.organizationId = +this.route.snapshot.paramMap.get('id');
    this.setAllProcessingActions().then();
    this.prepared = true;
  }

  async setAllProcessingActions() {
    const res = await this.processingActionControllerService
        .listProcessingActionsByCompanyUsingGET(this.organizationId, 'EN', 'COUNT')
        .pipe(take(1))
        .toPromise();

    if (res && res.status === 'OK' && res.data && res.data.count >= 0) {
      this.allProcessingActions = res.data.count;
    }
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
