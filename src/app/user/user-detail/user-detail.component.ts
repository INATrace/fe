import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserControllerService } from 'src/api/api/userController.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalEventManagerService } from '../../core/global-event-manager.service';
import { ComponentCanDeactivate } from '../../shared-services/component-can-deactivate';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserService } from 'src/api-chain/api/user.service';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { LanguageCodeHelper } from '../../language-code-helper';
import { ApiUser } from 'src/api/model/apiUser';
import { EnumSifrant } from '../../shared-services/enum-sifrant';
import { ApiUserRole } from 'src/api/model/apiUserRole';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent extends ComponentCanDeactivate implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  userProfileForm: FormGroup;
  submitted = false;
  userId: number;
  showPassReqText = false;
  userData = null;
  title = '';
  unconfirmedUser = false;
  returnUrl: string;
  changedCompany = false;
  fromCompany = false;

  myCompanies = null;

  roleCodebook = EnumSifrant.fromObject(this.role);

  constructor(
    private location: Location,
    private userController: UserControllerService,
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private chainUserService: UserService,
    private companyController: CompanyControllerService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    const parsed = this.router.parseUrl(this.returnUrl);
    if (parsed && parsed.root && parsed.root.children && parsed.root.children.primary && parsed.root.children.primary.segments &&
        parsed.root.children.primary.segments.some(value => value.path === 'companies')) {
      this.fromCompany = true;
    }
    this.title = $localize`:@@userDetail.title.edit:Edit user profile`;
    this.userId = +this.route.snapshot.paramMap.get('id');
    if (this.mode === 'userProfileView') {
      this.getUserProfile();
    } else {
      this.getUserProfileAsAdmin();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public canDeactivate(): boolean {
    return !this.userProfileForm || !this.userProfileForm.dirty;
  }

  get mode() {
    const id = this.route.snapshot.params.id;
    return id == null ? 'userProfileView' : 'adminUserProfileView';
  }

  getUserProfile(): void {
    this.globalEventsManager.showLoading(true);
    const sub = this.userController.getProfileForUserUsingGET().subscribe(user => {
      this.createUserProfileForm(user.data);
      if (user.data) { this.prepareMyCompanies(user.data).then(); }
      this.userData = user.data;
      this.globalEventsManager.showLoading(false);
    }, () => this.globalEventsManager.showLoading(false));
    this.subscriptions.push(sub);
  }

  getUserProfileAsAdmin(): void {
    this.globalEventsManager.showLoading(true);

    const sub = this.userController.getProfileForAdminUsingGET(this.userId)
      .subscribe(user => {
        this.createUserProfileForm(user.data);
        if (user.data) { this.prepareMyCompanies(user.data).then(); }
        this.userData = user.data;
        this.unconfirmedUser = user.data.status === 'UNCONFIRMED';
        this.globalEventsManager.showLoading(false);
      }, () => {
        this.globalEventsManager.showLoading(false);
      });
    this.subscriptions.push(sub);
  }

  goBack(): void {
    if (this.returnUrl && !(this.fromCompany && this.changedCompany)) {
      this.router.navigateByUrl(this.returnUrl).then();
    }
    else {
      this.router.navigate(['home']).then();
    }
  }

  async prepareMyCompanies(data) {
    const tmp = [];
    if (!data) { return; }
    for (const id of data.companyIds) {
      const res = await this.companyController.getCompanyUsingGET(id).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        tmp.push({
          company_id: id,
          company_name: res.data.name
        });
      }
    }
    this.myCompanies = tmp;
  }

  async setSelectedUserCompany(company) {
    if (this.mode === 'userProfileView') {
      const result = await this.globalEventsManager.openMessageModal({
        type: 'warning',
        message: $localize`:@@userDetail.warning.message:Are you sure you want to change your selected company to  ${company.company_name}?`,
        options: { centered: true },
        dismissable: false
      });
      if (result !== 'ok') { return; }
      const res = await this.companyController.getCompanyUsingGET(company.company_id).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        localStorage.setItem('selectedUserCompany', String(res.data.id));
        this.globalEventsManager.selectedUserCompany(res.data.name);
        localStorage.setItem('token', 'user-company-changed');
        this.changedCompany = true;
      }
    }
  }

  createUserProfileForm(user: any): void {
    this.userProfileForm = new FormGroup({
      name: new FormControl(user.name, [Validators.required]),
      surname: new FormControl(user.surname, [Validators.required]),
      email: new FormControl(user.email),
      language: new FormControl(user.language),
      role: new FormControl(user.role, [Validators.required])
    });
  }

  save() {
    if (this.mode === 'userProfileView') {
      this.saveUserProfile().then();
    } else {
      this.saveAsAdmin().then();
    }
  }

  async saveUserProfile(goBack = true) {
    this.submitted = true;
    if (!this.userProfileForm.invalid) {
      try {
        this.globalEventsManager.showLoading(true);
        const res = await this.userController.updateProfileUsingPUT({
          name: this.userProfileForm.get('name').value,
          surname: this.userProfileForm.get('surname').value,
          language: this.userProfileForm.get('language').value
        }).pipe(take(1)).toPromise();
        if (res && res.status === 'OK') {
          this.userProfileForm.markAsPristine();
          if (goBack) { this.goBack(); }
        }
      } catch (e) {

      } finally {
        this.globalEventsManager.showLoading(false);
      }
    }
  }

  async saveAsAdmin(goBack = true) {
    this.submitted = true;
    if (!this.userProfileForm.invalid) {

      try {
        this.globalEventsManager.showLoading(true);

        await this.userController.activateUserUsingPOST('SET_USER_ROLE', {
          id: this.userId,
          role: this.userProfileForm.get('role').value as ApiUserRole.RoleEnum
        } as ApiUserRole).pipe(take(1)).toPromise();

        const res = await this.userController.adminUpdateProfileUsingPUT({
          id: this.userId,
          name: this.userProfileForm.get('name').value,
          surname: this.userProfileForm.get('surname').value,
          language: this.userProfileForm.get('language').value
        }).pipe(take(1)).toPromise();
        if (res && res.status === 'OK') {
          this.userProfileForm.markAsPristine();
          if (goBack) { this.goBack(); }
        }
      } catch (e) {

      } finally {
        this.globalEventsManager.showLoading(false);
      }
    }
  }

  resetPasswordRequest() {

    this.globalEventsManager.showLoading(true);
    const sub = this.userController.requestResetPasswordUsingPOST({
      email: this.userProfileForm.get('email').value
    }).subscribe(() => {
      sub.unsubscribe();
      this.globalEventsManager.showLoading(false);
    },
      () => {
        this.globalEventsManager.showLoading(false);
      }
    );
  }

  async showPassReqSentModal() {
    const result = await this.globalEventsManager.openMessageModal({
      type: 'info',
      message: $localize`:@@userDetail.showPassReqSentModal.message:Are you sure you want to send password request to ${this.userProfileForm.get('email').value}`,
      options: { centered: true },
      dismissable: false
    });
    if (result !== 'ok') { return; }
    this.resetPasswordRequest();
  }

  async confirmEmail() {
    try {
      this.globalEventsManager.showLoading(true);
      const res = await this.userController.activateUserUsingPOST('CONFIRM_USER_EMAIL', { id: this.userId }).pipe(take(1)).toPromise();
      if (res.status !== 'OK') { throw Error(); }
    } catch (e) {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@userDetail.confirmEmail.error.title:Error!`,
        message: $localize`:@@userDetail.confirmEmail.error.message:Cannot confirm user email.`
      });
    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

  onToggle() {
    this.showPassReqText = !this.showPassReqText;
  }

  selectLanguage(lang: string) {
    this.userProfileForm.get('language').setValue(lang as ApiUser.LanguageEnum);
    if (this.mode === 'userProfileView') {
      this.saveUserProfile(false).then(() => this.getUserProfile()).then(() => LanguageCodeHelper.setCurrentLocale(lang.toLowerCase()));
    } else {
      this.saveAsAdmin(false).then(() => this.getUserProfileAsAdmin());
    }
  }

  get role() {
    const obj = {};
    obj['USER'] = $localize`:@@userDetail.role.user:User`;
    obj['MANAGER'] = $localize`:@@userDetail.role.manager:Manager`;
    obj['ACCOUNTANT'] = $localize`:@@userDetail.role.accountant:Accountant`;
    obj['ADMIN'] = $localize`:@@userDetail.role.admin:Admin`;
    return obj;
  }

}

