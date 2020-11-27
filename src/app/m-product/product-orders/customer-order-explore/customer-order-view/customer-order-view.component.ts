import { Component, Host, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthorisedLayoutComponent } from 'src/app/layout/authorised/authorised-layout/authorised-layout.component';
import { TabCommunicationService } from 'src/app/shared/tab-communication.service';

@Component({
  template: ''
})
export class CustomerOrderViewComponent implements OnInit {

  constructor(
    protected router: Router,
    protected route: ActivatedRoute
  ) { }

  // TABS ////////////////
  @ViewChild(AuthorisedLayoutComponent) authorizedLayout;
  rootTab = 0;
  selectedTab: Subscription;

  tabs = [
    $localize`:@@customerOrderView.tab0.title:Order details`,
    $localize`:@@customerOrderView.tab1.title:Discussions`,
    $localize`:@@customerOrderView.tab2.title:History`
  ];

  tabNames = [
    'details',
    'discussions',
    'history'
  ]

  get tabCommunicationService(): TabCommunicationService {
    return this.authorizedLayout ? this.authorizedLayout.tabCommunicationService : null
  }

  targetNavigate(segment: string) {
    this.router.navigate([segment], { relativeTo: this.route.parent })
  }
  ngAfterViewInit() {
    this.selectedTab = this.tabCommunicationService.subscribe(this.tabs, this.tabNames, this.rootTab, this.targetNavigate.bind(this), ['discussions'])
  }
  /////////////////////////

  ngOnInit(): void {
  }


  ngOnDestroy() {
    this.tabCommunicationService.announceTabTitles([]);
    if (this.selectedTab) this.selectedTab.unsubscribe();
  }


}
