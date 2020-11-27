import { Component, Host, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthorisedLayoutComponent } from 'src/app/layout/authorised/authorised-layout/authorised-layout.component';
import { TabCommunicationService } from 'src/app/shared/tab-communication.service';

@Component({
  template: ''
})
export class ProductLabelOrdersComponent implements OnInit {

  constructor(
    protected router: Router,
    protected route: ActivatedRoute
  ) { }

  // TABS ////////////////
  @ViewChild(AuthorisedLayoutComponent) authorizedLayout;
  rootTab = 0;
  selectedTab: Subscription;

  tabs = [
    $localize`:@@productLabelOrder.tab0.title:Dashboard`,
    $localize`:@@productLabelOrder.tab1.title:Orders for me`,
    $localize`:@@productLabelOrder.tab2.title:My orders`
  ];

  tabNames = [
    'dashboard',
    'all-orders',
    'customer-orders'
  ]

  get tabCommunicationService(): TabCommunicationService {
    return this.authorizedLayout ? this.authorizedLayout.tabCommunicationService : null
  }

  targetNavigate(segment: string) {
    this.router.navigate([segment], { relativeTo: this.route.parent })
  }
  ngAfterViewInit() {
    this.selectedTab = this.tabCommunicationService.subscribe(this.tabs, this.tabNames, this.rootTab, this.targetNavigate.bind(this))
  }
  /////////////////////////

  ngOnInit(): void {
  }


  ngOnDestroy() {
    this.tabCommunicationService.announceTabTitles([]);
    if (this.selectedTab) this.selectedTab.unsubscribe();
  }


}
