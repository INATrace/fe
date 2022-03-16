import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TabCommunicationService } from 'src/app/shared/tab-communication.service';
import { AuthorisedLayoutComponent } from 'src/app/layout/authorised/authorised-layout/authorised-layout.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentCanDeactivate } from 'src/app/shared-services/component-can-deactivate';
import { AuthService } from '../../../core/auth.service';
import { ApiUserGet } from '../../../../api/model/apiUserGet';

@Component({
  selector: 'app-company-detail-tab-manager',
  templateUrl: './company-detail-tab-manager.component.html',
  styleUrls: ['./company-detail-tab-manager.component.scss']
})
export class CompanyDetailTabManagerComponent extends ComponentCanDeactivate implements OnInit, OnDestroy, AfterViewInit {

  // TABS
  @ViewChild(AuthorisedLayoutComponent) authorizedLayout;
  rootTab = 0;

  tabs = [
    $localize`:@@companyDetailTab.tab0.title:Company`,
    $localize`:@@companyDetailTab.tab2.title:Users`,
    $localize`:@@companyDetailTab.tab3.title:Facilities`,
    $localize`:@@companyDetailTab.tab4.title:Processing actions`,
    $localize`:@@companyDetailTab.tab1.title:Translations`
  ];

  tabNames = [
    'company',
    'users',
    'facilities',
    'processingActions',
    'translate'
  ];

  cId = this.route.snapshot.params.id;
  selectedTab: Subscription;

  isAdmin = false;
  userProfileSubscription: Subscription;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected authService: AuthService
  ) { super(); }

  get tabCommunicationService(): TabCommunicationService {
    return this.authorizedLayout ? this.authorizedLayout.tabCommunicationService : null;
  }

  ngOnInit(): void {
    this.userProfileSubscription = this.authService.userProfile$
      .subscribe(userProfile => {
        if (userProfile) {
          this.isAdmin = userProfile.role === ApiUserGet.RoleEnum.ADMIN;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.userProfileSubscription) {
      this.userProfileSubscription.unsubscribe();
    }
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