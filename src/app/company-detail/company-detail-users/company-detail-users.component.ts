import { Component, OnInit } from '@angular/core';
import { ListEditorManager } from '../../shared/list-editor/list-editor-manager';
import { ApiCompanyUser } from '../../../api/model/apiCompanyUser';
import { FormArray, FormControl } from '@angular/forms';
import { ApiCompanyUserValidationScheme } from '../validation';
import { CompanyControllerService } from '../../../api/api/companyController.service';
import { GlobalEventManagerService } from '../../system/global-event-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { defaultEmptyObject } from '../../../shared/utils';
import { ApiResponseListApiCompanyUser } from '../../../api/model/apiResponseListApiCompanyUser';
import StatusEnum = ApiResponseListApiCompanyUser.StatusEnum;
import { CompanyDetailTabManagerComponent } from '../company-detail-tab-manager/company-detail-tab-manager.component';

@Component({
  selector: 'app-company-detail-users',
  templateUrl: './company-detail-users.component.html',
  styleUrls: ['./company-detail-users.component.scss']
})
export class CompanyDetailUsersComponent extends CompanyDetailTabManagerComponent implements OnInit {

  companyUsersFormArray: FormArray;
  companyUserListManager = null;

  submitted = false;

  rootTab = 1;

  title = $localize`:@@companyDetailUsers.title.edit:Company users`;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private companyController: CompanyControllerService,
    private globalEventsManager: GlobalEventManagerService
  ) {
    super(router, route);
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
    this.globalEventsManager.showLoading(true);
    const id = this.route.snapshot.paramMap.get('id');
    this.companyController.getCompanyUsersUsingGET(Number(id))
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
