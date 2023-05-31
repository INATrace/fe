import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserControllerService } from 'src/api/api/userController.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalEventManagerService } from '../../core/global-event-manager.service';
import { ComponentCanDeactivate } from '../../shared-services/component-can-deactivate';
import { take } from 'rxjs/operators';
import { CompanyControllerService, ListCompaniesUsingGET } from 'src/api/api/companyController.service';
import { LanguageCodeHelper } from '../../language-code-helper';
import { ApiUser } from 'src/api/model/apiUser';
import { BeycoTokenService } from '../../shared-services/beyco-token.service';
import { ApiCompanyListResponse } from '../../../api/model/apiCompanyListResponse';
import { SelectedUserCompanyService } from '../../core/selected-user-company.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent extends ComponentCanDeactivate implements OnInit {

  userProfileForm: FormGroup;
  submitted = false;
  userId: number;
  showPassReqText = false;
  userData = null;
  title = '';
  unconfirmedUser = false;
  returnUrl: string;
  changedCompany = false;

  myCompanies: ApiCompanyListResponse[] | null = null;

  constructor(
    private location: Location,
    private userController: UserControllerService,
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private companyController: CompanyControllerService,
    private router: Router,
    private beycoTokenService: BeycoTokenService,
    private selUserCompanyService: SelectedUserCompanyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.title = $localize`:@@userDetail.title.edit:Edit user profile`;
    this.userId = +this.route.snapshot.paramMap.get('id');
    if (this.mode === 'userProfileView') {
      this.getUserProfile();
    } else {
      this.getUserProfileAsAdmin();
    }
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
    this.userController.getProfileForUserUsingGET().subscribe(user => {
      this.createUserProfileForm(user.data);
      this.prepareMyCompanies().then();
      this.userData = user.data;
      this.globalEventsManager.showLoading(false);
    }, () => this.globalEventsManager.showLoading(false));
  }

  getUserProfileAsAdmin(): void {
    this.globalEventsManager.showLoading(true);

    this.userController.getProfileForAdminUsingGET(this.userId)
      .subscribe(user => {
        this.createUserProfileForm(user.data);
        this.userData = user.data;
        this.unconfirmedUser = user.data.status === 'UNCONFIRMED';
        this.globalEventsManager.showLoading(false);
      }, () => {
        this.globalEventsManager.showLoading(false);
      });
  }

  goBack(): void {
    if (this.returnUrl && !this.changedCompany) {
      this.router.navigateByUrl(this.returnUrl).then();
    }
    else {
      this.router.navigate(['home']).then();
    }
  }

  private async prepareMyCompanies(): Promise<void> {

    const requestParams = {
      statuses: null,
      requestType: 'FETCH',
      limit: 1000,
      offset: 0,
      status: 'ACTIVE'
    } as ListCompaniesUsingGET.PartialParamMap;

    const resp = await this.companyController.listCompaniesUsingGETByMap(requestParams).toPromise();
    if (resp && resp.status === 'OK' && resp.data?.items) {
      this.myCompanies = resp.data.items;
    }
  }

  async setSelectedUserCompany(company: ApiCompanyListResponse) {

    if (this.mode === 'userProfileView') {

      const result = await this.globalEventsManager.openMessageModal({
        type: 'warning',
        message: $localize`:@@userDetail.warning.message:Are you sure you want to change your selected company to  ${company.name}?`,
        options: { centered: true },
        dismissable: false
      });

      if (result !== 'ok') { return; }

      const res = await this.companyController.getCompanyUsingGET(company.id).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        this.selUserCompanyService.setSelectedCompany(res.data);
        this.changedCompany = true;
        this.beycoTokenService.removeToken();
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

  private async saveUserProfile(goBack = true) {
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

  private async saveAsAdmin(goBack = true) {

    this.submitted = true;
    if (!this.userProfileForm.invalid) {

      try {
        this.globalEventsManager.showLoading(true);
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

      this.unconfirmedUser = false;
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

}
