import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserControllerService } from 'src/api/api/userController.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalEventManagerService } from '../system/global-event-manager.service';
import { ComponentCanDeactivate } from '../shared-services/component-can-deactivate';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserService } from 'src/api-chain/api/user.service';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { dbKey } from 'src/shared/utils';
import { LanguageCodeHelper } from '../language-code-helper';
import { ApiUser } from 'src/api/model/apiUser';
import { EnumSifrant } from '../shared-services/enum-sifrant';
import { ApiUserRole } from 'src/api/model/apiUserRole';
import { ApiUserBaseRoleEnum } from 'src/api-chain/model/apiUserBaseRoleEnum';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent extends ComponentCanDeactivate implements OnInit {

  subscriptions: Subscription[] = []
  userProfileForm: FormGroup;
  submitted: boolean = false;
  userId: number;
  showPassReqText: boolean = false;
  userData = null;
  title: string = "";
  unconfirmedUser: boolean = false;
  returnUrl: string;

  constructor(
    private location: Location,
    private userController: UserControllerService,
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private chainUserService: UserService,
    private companyContoller: CompanyControllerService,
    private chainOrganizationService: OrganizationService,
    private router: Router
  ) {
    super()
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

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  public canDeactivate(): boolean {
    return !this.userProfileForm || !this.userProfileForm.dirty;
  }

  get mode() {
    let id = this.route.snapshot.params.id
    return id == null ? 'userProfileView' : 'adminUserProfileView'
  }

  getUserProfile(): void {
    this.globalEventsManager.showLoading(true);
    let sub = this.userController.getProfileForUserUsingGET().subscribe(user => {
      this.createUserProfileForm(user.data);
      if (user.data) this.prepareMyCompanies(user.data);
      this.userData = user.data;
      this.globalEventsManager.showLoading(false);
    }, error => this.globalEventsManager.showLoading(false))
    this.subscriptions.push(sub);
  }

  getUserProfileAsAdmin(): void {
    this.globalEventsManager.showLoading(true);

    let sub = this.userController.getProfileForAdminUsingGET(this.userId)
      .subscribe(user => {
        this.createUserProfileForm(user.data);
        if (user.data) this.prepareMyCompanies(user.data);
        this.userData = user.data;
        this.unconfirmedUser = user.data.status === "UNCONFIRMED";
        this.globalEventsManager.showLoading(false);
      }, error => {
        this.globalEventsManager.showLoading(false);
      });
    this.subscriptions.push(sub);
  }

  goBack(): void {
    // if (this.mode === 'userProfileView') {
    //   this.router.navigate(['home']);
    // } else {
    // this.location.back();
    // }
    if (this.returnUrl) this.router.navigateByUrl(this.returnUrl);
    else this.router.navigate(['home']);
  }

  myCompanies = null;
  async prepareMyCompanies(data) {
    let tmp = [];
    if (!data) return
    for (let id of data.companyIds) {
      let res = await this.companyContoller.getCompanyUsingGET(id).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        tmp.push({
          company_id: id,
          company_name: res.data.name
        })
      }
    }
    this.myCompanies = tmp;
  }

  async setSelectedUserCompany(company) {
    if (this.mode === 'userProfileView') {
      let result = await this.globalEventsManager.openMessageModal({
        type: 'warning',
        message: $localize`:@@userDetail.warning.message:Are you sure you want to change your selected company to  ${company.company_name}?`,
        options: { centered: true },
        dismissable: false
      });
      if (result != "ok") return
      let res = await this.chainOrganizationService.getOrganizationByCompanyId(company.company_id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) {
        localStorage.setItem("selectedUserCompany", dbKey(res.data));
        this.globalEventsManager.selectedUserCompany(res.data.name);
        localStorage.setItem('token', 'user-company-changed');
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
    })
  }

  save() {
    if (this.mode === 'userProfileView') {
      this.saveUserProfile();
    } else {
      this.saveAsAdmin();
    }
  }

  async saveUserProfile(goBack = true) {
    this.submitted = true;
    if (!this.userProfileForm.invalid) {
      try {
        this.globalEventsManager.showLoading(true);
        let res = await this.userController.updateProfileUsingPUT({ "name": this.userProfileForm.get('name').value, "surname": this.userProfileForm.get('surname').value, "language": this.userProfileForm.get('language').value }).pipe(take(1)).toPromise();
        if (res && res.status === 'OK') {
          this.mapToChain();
          this.userProfileForm.markAsPristine()
          if (goBack) this.goBack();
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
        let resRole = await this.userController.activateUserUsingPOST('SET_USER_ROLE', { id: this.userId, role: this.userProfileForm.get('role').value as ApiUserRole.RoleEnum  } as ApiUserRole).pipe(take(1)).toPromise();
        if (resRole && resRole.status === 'OK') {
        }
        let res = await this.userController.adminUpdateProfileUsingPUT({ "id": this.userId, "name": this.userProfileForm.get('name').value, "surname": this.userProfileForm.get('surname').value, "language": this.userProfileForm.get('language').value }).pipe(take(1)).toPromise();
        if (res && res.status == 'OK') {
          this.mapToChain();
          this.userProfileForm.markAsPristine()
          if (goBack) this.goBack();
        }
      } catch (e) {

      } finally {
        this.globalEventsManager.showLoading(false);
      }

    }
  }

  async mapToChain() {
    this.userData['name'] = this.userProfileForm.get('name').value;
    this.userData['surname'] = this.userProfileForm.get('surname').value

    let res = await this.chainUserService.getUserByAFId(this.userData.id).pipe(take(1)).toPromise();
    if (res && 'OK' === res.status && res.data) {
      this.userData['_id'] = dbKey(res.data);
      this.userData['_rev'] = res.data._rev;
    }
    delete this.userData['actions']
    delete this.userData['companyIds']
    delete this.userData['language']
    let resP = await this.chainUserService.postUser(this.userData).pipe(take(1)).toPromise();

  }

  resetPasswordRequest() {

    this.globalEventsManager.showLoading(true);
    let sub = this.userController.requestResetPasswordUsingPOST({
      email: this.userProfileForm.get('email').value
    }).subscribe(val => {
      sub.unsubscribe()
      this.globalEventsManager.showLoading(false);
      // this.showPassReqSentModal();
    },
      error => {
        this.globalEventsManager.showLoading(false);
      }
    )
  }

  async showPassReqSentModal() {
    let result = await this.globalEventsManager.openMessageModal({
      type: 'info',
      message: $localize`:@@userDetail.showPassReqSentModal.message:Are you sure you want to send password request to ${this.userProfileForm.get('email').value}`,
      options: { centered: true },
      dismissable: false
    });
    if (result !== "ok") return;
    this.resetPasswordRequest();
  }

  async confirmEmail() {
    try {
      this.globalEventsManager.showLoading(true)
      let res = await this.userController.activateUserUsingPOST('CONFIRM_USER_EMAIL', { id: this.userId }).pipe(take(1)).toPromise();
      if (res.status != 'OK') throw Error()
    } catch (e) {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@userDetail.confirmEmail.error.title:Error!`,
        message: $localize`:@@userDetail.confirmEmail.error.message:Cannot confirm user email.`
      })
    } finally {
      this.globalEventsManager.showLoading(false)
    }
  }

  onToggle() {
    this.showPassReqText = !this.showPassReqText;
  }


  selectLanguage(lang: string) {
    this.userProfileForm.get('language').setValue(lang as ApiUser.LanguageEnum);
    if (this.mode === 'userProfileView') {
      this.saveUserProfile(false).then(() => this.getUserProfile()).then(() => LanguageCodeHelper.setCurrentLocale(lang.toLowerCase()));;
    } else {
      this.saveAsAdmin(false).then(() => this.getUserProfileAsAdmin());
    }
  }


  get role() {
    let obj = {}
    obj['USER'] = $localize`:@@userDetail.role.user:User`;
    obj['MANAGER'] = $localize`:@@userDetail.role.manager:Manager`;
    obj['ACCOUNTANT'] = $localize`:@@userDetail.role.accountant:Accountant`;
    obj['ADMIN'] = $localize`:@@userDetail.role.admin:Admin`;
    return obj;
  }
  roleCodebook = EnumSifrant.fromObject(this.role)

}

