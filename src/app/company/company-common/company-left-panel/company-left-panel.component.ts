import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalEventManagerService } from '../../../core/global-event-manager.service';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { ApiUserGet } from '../../../../api/model/apiUserGet';
import RoleEnum = ApiUserGet.RoleEnum;
import { SelectedUserCompanyService } from '../../../core/selected-user-company.service';

@Component({
  selector: 'app-company-left-panel',
  templateUrl: './company-left-panel.component.html',
  styleUrls: ['./company-left-panel.component.scss']
})
export class CompanyLeftPanelComponent implements OnInit, OnDestroy {

  faCog = faCog;

  private companyId: number;
  companyTitle: string;
  imgStorageKey: string = null;

  isSystemOrRegionalAdmin = false;
  isCompanyAdmin = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private globalEventManager: GlobalEventManagerService,
    private authService: AuthService,
    private selUserCompanyService: SelectedUserCompanyService
  ) { }

  ngOnInit() {

    let user: ApiUserGet | null = null;
    this.subscriptions.push(
      this.authService.userProfile$
        .pipe(
          switchMap(userProfile => {
            user = userProfile;
            return this.selUserCompanyService.selectedCompanyProfile$;
          })
        )
        .subscribe(companyProfile => {
          if (user && companyProfile) {

            this.companyId = companyProfile.id;
            this.companyTitle = companyProfile.name;
            this.imgStorageKey = companyProfile.logo.storageKey;

            if (user.role === ApiUserGet.RoleEnum.SYSTEMADMIN || user.role === RoleEnum.REGIONALADMIN) {
              this.isSystemOrRegionalAdmin = true;
            }

            if (user.companyIdsAdmin.includes(this.companyId)) {
              this.isCompanyAdmin = true;
            }
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  openCompanyProfile() {
    if (!this.companyId) {
      return;
    }

    this.router.navigate(['companies', this.companyId, 'company']).then();
  }

}
