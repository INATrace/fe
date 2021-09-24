import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalEventManagerService } from '../../core/global-event-manager.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-left-panel',
  templateUrl: './company-left-panel.component.html',
  styleUrls: ['./company-left-panel.component.scss']
})
export class CompanyLeftPanelComponent implements OnInit, OnDestroy {

  companyTitle: string;

  private companySubs: Subscription;

  constructor(
    private globalEventManager: GlobalEventManagerService
  ) { }

  ngOnInit(): void {
    this.companySubs = this.globalEventManager.selectedUserCompanyEmitter.subscribe(company => this.companyTitle = company);
  }

  ngOnDestroy(): void {
    if (this.companySubs) {
      this.companySubs.unsubscribe();
    }
  }

}
