import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListEditorManager } from '../../../shared/list-editor/list-editor-manager';
import { ApiCompanyUser } from '../../../../api/model/apiCompanyUser';
import { FormArray, FormControl } from '@angular/forms';
import { ApiCompanyUserValidationScheme } from '../validation';
import { CompanyControllerService } from '../../../../api/api/companyController.service';
import { GlobalEventManagerService } from '../../../core/global-event-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { defaultEmptyObject } from '../../../../shared/utils';
import { CompanyDetailTabManagerComponent } from '../company-detail-tab-manager/company-detail-tab-manager.component';
import { AuthService } from '../../../core/auth.service';
import { ApiResponseApiCompanyName } from '../../../../api/model/apiResponseApiCompanyName';
import StatusEnum = ApiResponseApiCompanyName.StatusEnum;

@Component({
  selector: 'app-company-detail-users',
  templateUrl: './company-detail-users.component.html',
  styleUrls: ['./company-detail-users.component.scss']
})
export class CompanyDetailUsersComponent extends CompanyDetailTabManagerComponent implements OnInit, OnDestroy {

  companyUsersFormArray: FormArray;
  companyUserListManager = null;

  submitted = false;

  rootTab = 1;

  title = $localize`:@@companyDetailUsers.title.edit:Company users`;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected companyController: CompanyControllerService,
    private globalEventsManager: GlobalEventManagerService,
    protected authService: AuthService
  ) {
    super(router, route, authService, companyController);
  }

  static ApiCompanyUserCreateEmptyObject(): ApiCompanyUser {
    const obj = ApiCompanyUser.formMetadata();
    return defaultEmptyObject(obj) as ApiCompanyUser;
  }

  static ApiCompanyUserEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(CompanyDetailUsersComponent.ApiCompanyUserCreateEmptyObject(), ApiCompanyUserValidationScheme.validators);
    };
  }

  get companyUsersControls(): FormControl[] {
    return this.companyUsersFormArray.controls as FormControl[];
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.globalEventsManager.showLoading(true);
    const id = this.route.snapshot.paramMap.get('id');
    this.companyController.getCompanyUsers(Number(id))
      .pipe(
        finalize(() => this.globalEventsManager.showLoading(false))
      )
      .subscribe(
        response => {
          if (response && response.status === StatusEnum.OK) {
            this.companyUsersFormArray = new FormArray([]);
            response.data.forEach(apiCompanyUser => this.companyUsersFormArray.push(new FormControl(apiCompanyUser)));
            this.initializeListManagers();
          }
        }
      );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  canDeactivate(): boolean {
    return true;
  }

  private initializeListManagers() {
    this.companyUserListManager = new ListEditorManager<ApiCompanyUser>(
      this.companyUsersFormArray,
      CompanyDetailUsersComponent.ApiCompanyUserEmptyObjectFormFactory(),
      ApiCompanyUserValidationScheme
    );
  }

}
