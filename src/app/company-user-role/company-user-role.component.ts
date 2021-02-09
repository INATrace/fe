import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { ApiCompanyUser } from 'src/api/model/apiCompanyUser';
import { ApiUserBase } from 'src/api/model/apiUserBase';
import { defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ApiCompanyUserValidationScheme } from '../company-detail/validation';
import { EnumSifrant } from '../shared-services/enum-sifrant';
import { UsersService } from '../shared-services/users.service';
import { GenericEditableItemComponent } from '../shared/generic-editable-item/generic-editable-item.component';
import { GlobalEventManagerService } from '../system/global-event-manager.service';

@Component({
  selector: 'app-company-user-role',
  templateUrl: './company-user-role.component.html',
  styleUrls: ['./company-user-role.component.scss']
})
export class CompanyUserRoleComponent extends GenericEditableItemComponent<ApiCompanyUser> {

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    protected router: Router,
    public userSifrant: UsersService,
    private companyController: CompanyControllerService,
    private route: ActivatedRoute
  ) {
    super(globalEventsManager)
  }
  @Input()
  disableDelete = false

  @Input()
  formTitle = null

  readonly: boolean = false;

  userForm = new FormControl(null, Validators.required);
  ngOnInit() {
    if (this.contentObject && this.contentObject.name) this.userForm.setValue(this.contentObject);
  }

  public generateForm(value: any): FormGroup {
    return generateFormFromMetadata(ApiCompanyUser.formMetadata(), value, ApiCompanyUserValidationScheme)
  }

  static createEmptyObject(): ApiCompanyUser {
    let market = ApiCompanyUser.formMetadata();
    return defaultEmptyObject(market) as ApiCompanyUser
  }

  static emptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(CompanyUserRoleComponent.createEmptyObject(), ApiCompanyUserValidationScheme.validators)
      return f
    }
  }

  setUser($event) {
    if ($event) {
      let role = this.form.get('companyRole').value;
      let data = { ...$event, companyRole: role };
      this.form.setValue(data)
    }
  }

  get roles() {
    let obj = {}
    obj['ACCOUNTANT'] = $localize`:@@companyUserRole.roles.accountant:Accountant`;
    obj['MANAGER'] = $localize`:@@companyUserRole.roles.manager:Manager`;
    obj['USER'] = $localize`:@@companyUserRole.roles.user:User`;
    obj['ADMIN'] = $localize`:@@companyUserRole.roles.admin:Admin`;
    return obj;
  }
  codebookRoles = EnumSifrant.fromObject(this.roles)

  async firstSendToServer() {
    if (this.form && this.form.value && this.form.value.id && this.form.value.companyRole) {
      let id = this.route.snapshot.params.id;
      if(this.contentObject && !this.contentObject.name) {
          //add new user to company first
          let res = await this.companyController.executeActionUsingPOST('ADD_USER_TO_COMPANY',  {companyId: id, userId: this.form.value.id}).pipe(take(1)).toPromise();
          if (res.status == 'OK') {
            let res = await this.companyController.executeActionUsingPOST('SET_USER_COMPANY_ROLE', { companyId: id, userId: this.form.value.id, companyUserRole: this.form.value.companyRole }).pipe(take(1)).toPromise();
            if (res.status == 'OK') this.save();
          }
        } else {
          let res = await this.companyController.executeActionUsingPOST('SET_USER_COMPANY_ROLE', { companyId: id, userId: this.form.value.id, companyUserRole: this.form.value.companyRole }).pipe(take(1)).toPromise();
          if (res.status == 'OK') this.save();
        }
    }
  }


}
