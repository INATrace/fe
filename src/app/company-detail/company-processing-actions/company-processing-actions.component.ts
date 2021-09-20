import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyDetailTabManagerComponent } from '../company-detail-tab-manager/company-detail-tab-manager.component';
import { GlobalEventManagerService } from '../../system/global-event-manager.service';
import { BehaviorSubject } from 'rxjs';
import { ProcessingActionService } from '../../../api-chain/api/processingAction.service';
import { ProcessingActionControllerService } from '../../../api/api/processingActionController.service';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-company-processing-actions',
  templateUrl: './company-processing-actions.component.html',
  styleUrls: ['./company-processing-actions.component.scss']
})
export class CompanyProcessingActionsComponent extends CompanyDetailTabManagerComponent implements OnInit {

  rootTab = 4;
  prepared = false;

  organizationId: number;

  reloadProcessingActionsListPing$ = new BehaviorSubject<boolean>(false);
  showedProcessingActions = 0;
  allProcessingActions = 0;

  constructor(
      protected router: Router,
      protected route: ActivatedRoute,
      protected globalEventsManager: GlobalEventManagerService,
      protected processingActionService: ProcessingActionService,
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
        .listProcessingActionsByCompanyUsingGET(this.organizationId, 'COUNT')
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

  // reloadPage() {
  //   setTimeout(() => this.reloadProcessingActionsListPing$.next(true), environment.reloadDelay);
  // }

  canDeactivate() {
    return true;
  }

}
