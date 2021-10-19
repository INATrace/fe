import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorisedLayoutComponent } from '../../../layout/authorised/authorised-layout/authorised-layout.component';
import { Subscription } from 'rxjs';
import { TabCommunicationService } from '../../../shared/tab-communication.service';

@Component({
  template: ''
})
export class OrdersTabComponent implements OnInit, AfterViewInit, OnDestroy {

  rootTab = 0;

  selectedTab: Subscription;

  tabs = [
    $localize`:@@productLabelOrder.tab0.title:Dashboard`,
    $localize`:@@productLabelOrder.tab1.title:All orders`,
    $localize`:@@productLabelOrder.tab2.title:Customer orders`
  ];

  tabNames = [
    'dashboard',
    'all-orders',
    'customer-orders'
  ];

  // TABS
  @ViewChild(AuthorisedLayoutComponent)
  authorizedLayout;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute
  ) { }

  get tabCommunicationService(): TabCommunicationService {
    return this.authorizedLayout ? this.authorizedLayout.tabCommunicationService : null;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.selectedTab = this.tabCommunicationService.subscribe(this.tabs, this.tabNames, this.rootTab, this.targetNavigate.bind(this));
  }

  ngOnDestroy() {
    this.tabCommunicationService.announceTabTitles([]);
    if (this.selectedTab) {
      this.selectedTab.unsubscribe();
    }
  }

  targetNavigate(segment: string) {
    this.router.navigate([segment], {relativeTo: this.route.parent}).then();
  }

}
