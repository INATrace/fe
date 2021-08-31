import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TabCommunicationService } from 'src/app/shared/tab-communication.service';
import { AuthorisedLayoutComponent } from 'src/app/layout/authorised/authorised-layout/authorised-layout.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentCanDeactivate } from 'src/app/shared-services/component-can-deactivate';

@Component({
  selector: 'app-company-detail-tab-manager',
  templateUrl: './company-detail-tab-manager.component.html',
  styleUrls: ['./company-detail-tab-manager.component.scss']
})
export class CompanyDetailTabManagerComponent extends ComponentCanDeactivate implements OnInit, AfterViewInit {

  // TABS
  @ViewChild(AuthorisedLayoutComponent) authorizedLayout;
  rootTab = 0;

  tabs = [
    $localize`:@@companyDetailTab.tab0.title:Company`,
    $localize`:@@companyDetailTab.tab2.title:Users`,
    $localize`:@@companyDetailTab.tab3.title:Facilities`,
    $localize`:@@companyDetailTab.tab1.title:Translations`
  ];

  tabNames = [
    'company',
    'users',
    'facilities',
    'translate'
  ];

  cId = this.route.snapshot.params.id;
  selectedTab: Subscription;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
  ) { super(); }

  get tabCommunicationService(): TabCommunicationService {
    return this.authorizedLayout ? this.authorizedLayout.tabCommunicationService : null;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.selectedTab = this.tabCommunicationService.subscribe(this.tabs, this.tabNames, this.rootTab, this.targetNavigate.bind(this));
  }

  canDeactivate(): boolean {
    throw new Error('Method not implemented.');
  }

  targetNavigate(segment: string) {
    this.router.navigate(['companies', this.cId, segment]).then();
  }

}
