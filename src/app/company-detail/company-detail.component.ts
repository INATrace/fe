import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { ApiCompany } from 'src/api/model/apiCompany';
import { ApiCompanyGet } from 'src/api/model/apiCompanyGet';
import { ApiUserBase } from 'src/api/model/apiUserBase';
import { generateFormFromMetadata, dbKey, defaultEmptyObject } from 'src/shared/utils';
import { ComponentCanDeactivate } from '../shared-services/component-can-deactivate';
import { CountryService } from '../shared-services/countries.service';
import { UsersService } from '../shared-services/users.service';
import { GlobalEventManagerService } from '../system/global-event-manager.service';
import { ApiCompanyDocumentValidationScheme, ApiCompanyGetValidationScheme, ApiCompanyUserValidationScheme } from './validation';
import { environment } from 'src/environments/environment';
import { ApiResponseApiBaseEntity } from 'src/api/model/apiResponseApiBaseEntity';
import { ChainFileInfo } from 'src/api-chain/model/chainFileInfo';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { ApiCertification } from 'src/api/model/apiCertification';
import { ListEditorManager } from '../shared/list-editor/list-editor-manager';
import { ApiCertificationValidationScheme } from '../m-product/product-label/validation';
import { ApiCompanyDocument } from 'src/api/model/apiCompanyDocument';
import { CompanyDetailTabManagerComponent } from './company-detail-tab-manager/company-detail-tab-manager.component';
import { ApiCompanyUser } from 'src/api/model/apiCompanyUser';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent extends CompanyDetailTabManagerComponent implements OnInit {

  rootTab = 0
  public canDeactivate(): boolean {
    return !this.companyDetailForm || !this.companyDetailForm.dirty;
  }

  company: ApiCompany = {
    headquarters: {}
  };
  _companyErrorStatus$: BehaviorSubject<string>;
  companyDetailForm: FormGroup;
  countries: any = [];
  socialMediaForm: FormGroup;
  socialMediaDEForm: FormGroup;
  _hideWebPageField$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  _hideFacebookField$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  _hideInstagramField$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  _hideTwitterField$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  _hideYouTubeField$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  _hideOtherField$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  faTimes = faTimes;

  rootImageUrl: string = environment.relativeImageUplodadUrlAllSizes;

  submitted = false;
  title: string = "";

  constructor(
    protected route: ActivatedRoute,
    private location: Location,
    private companyController: CompanyControllerService,
    protected globalEventsManager: GlobalEventManagerService,
    public countryCodes: CountryService,
    public userSifrant: UsersService,
    private chainOrganizationService: OrganizationService,
    protected router: Router
  ) {
    super(router, route)
  }

  ngOnInit(): void {
    this._companyErrorStatus$ = new BehaviorSubject<string>("");
    this.mode
    if (this.mode === 'update') {
      this.title = $localize`:@@companyDetail.title.edit:Edit company`;
      this.getCompany();
    } else {
      this.title = $localize`:@@companyDetail.title.add:Add company`;
      this.newCompany();
    }
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  openOnStart(value: any) {
    return true;
  }

  get mode() {
    let id = this.route.snapshot.params.id
    return id == null ? 'create' : 'update'
  }
  sub: Subscription;
  getCompany(): void {
    this._companyErrorStatus$.next("");
    this.globalEventsManager.showLoading(true);
    const id = +this.route.snapshot.paramMap.get('id');
    this.sub = this.companyController.getCompanyUsingGET(id)
      .subscribe(company => {
        this.company = company.data;
        // console.log("DATA:", this.company)
        if (!this.company.headquarters) {
          this.company.headquarters = this.emptyObject().headquarters;
        }
        this.companyDetailForm = generateFormFromMetadata(ApiCompanyGet.formMetadata(), company.data, ApiCompanyGetValidationScheme)
        this.socialMediaForm = CompanyDetailComponent.generateSocialMediaForm();
        (this.companyDetailForm as FormGroup).setControl('mediaLinks', this.socialMediaForm)
        this.companyDetailForm.updateValueAndValidity()

        this.fillWebPageAndSocialMediaForm();
        // console.log("FORM:", this.companyDetailForm)
        this.initializeListManagers()
        this.globalEventsManager.showLoading(false);
      },
        error => {
          this._companyErrorStatus$.next(error.error.status);
          this.globalEventsManager.showLoading(false);
        });
  }

  emptyObject() {
    return {
      headquarters: {
        address: null,
        city: null,
        country: null,
        state: null,
        zip: null
      }
    } as ApiCompanyGet
  }

  newCompany() {
    this.companyDetailForm = generateFormFromMetadata(ApiCompanyGet.formMetadata(), this.emptyObject(), ApiCompanyGetValidationScheme)
    this.socialMediaForm = CompanyDetailComponent.generateSocialMediaForm();
    (this.companyDetailForm as FormGroup).setControl('mediaLinks', this.socialMediaForm)
    this.companyDetailForm.updateValueAndValidity()
    this.initializeListManagers()
  }

  // createCompanyDetailForm(): void {
  //   this.companyDetailForm = new FormGroup({
  //     name: new FormControl(this.company.name),
  //     logo: new FormControl(this.company.logo),
  //     headquarters: new FormGroup({
  //       address: new FormControl(this.company.headquarters ? this.company.headquarters.address : null),
  //       city: new FormControl(this.company.headquarters ? this.company.headquarters.city : null),
  //       state: new FormControl(this.company.headquarters ? this.company.headquarters.state : null),
  //       zip: new FormControl(this.company.headquarters ? this.company.headquarters.zip : null),
  //       country: new FormControl(this.company.headquarters ? this.company.headquarters.country : null)
  //       }),
  //     phone: new FormControl(this.company.phone),
  //     email: new FormControl(this.company.email, EmailValidator()),
  //     about: new FormControl(this.company.about),
  //     manager: new FormControl(this.company.manager),
  //     webPage: new FormControl(this.company.webPage),
  //     mediaLinks: new FormControl(this.company.mediaLinks)
  //   })
  // }

  static generateSocialMediaForm() {
    return new FormGroup({
      facebook: new FormControl(null),
      instagram: new FormControl(null),
      twitter: new FormControl(null),
      youtube: new FormControl(null),
      other: new FormControl(null),
    })
  }

  fillWebPageAndSocialMediaForm(): void {
    if (!!this.company.webPage) this._hideWebPageField$.next(false);
    for (let [key, value] of Object.entries(this.company.mediaLinks)) {
      if (key === 'facebook' && !!value) {
        this._hideFacebookField$.next(false);
        this.socialMediaForm.get('facebook').setValue(value);
      }
      if (key === 'instagram' && !!value) {
        this._hideInstagramField$.next(false);
        this.socialMediaForm.get('instagram').setValue(value);
      }
      if (key === 'twitter' && !!value) {
        this._hideTwitterField$.next(false);
        this.socialMediaForm.get('twitter').setValue(value);
      }
      if (key === 'youtube' && !!value) {
        this._hideYouTubeField$.next(false);
        this.socialMediaForm.get('youtube').setValue(value);
      }
      if (key === 'other' && !!value) {
        this._hideOtherField$.next(false);
        this.socialMediaForm.get('other').setValue(value);
      }
    }
    this.companyDetailForm.updateValueAndValidity()
  }

  userForm = new FormControl(null)

  userResultFormatter = (value: any) => {
    return this.userSifrant.textRepresentation(value)
  }

  userInputFormatter = (value: any) => {
    return this.userSifrant.textRepresentation(value)
  }

  //// temp

  async addSelectedUser(user: ApiUserBase) {
    if (!user) return;
    let formArray = this.companyDetailForm.get('users') as FormArray
    if (formArray.value.some(x => x.id === user.id)) {
      this.userForm.setValue(null);
      return;
    }
    formArray.push(new FormControl(user))
    formArray.markAsDirty()
    setTimeout(() => this.userForm.setValue(null))
    // console.log(this.companyDetailForm, formArray)
    // let res = await this.companyController.executeActionUsingPOST("ADD_USER_TO_COMPANY", {
    //   companyId: this.companyDetailForm.get('id').value as number,
    //   userId: user.id
    // }).pipe(take(1)).toPromise();
    // setTimeout(() => this.userForm.setValue(null))
    // await this.save(false)
    // this.getCompany()
  }

  async deleteUser(user: ApiUserBase) {
    if (!user) return
    let formArray = this.companyDetailForm.get('users') as FormArray
    let index = (formArray.value as ApiUserBase[]).findIndex(x => x.id === user.id)
    if (index >= 0) {
      formArray.removeAt(index)
      formArray.markAsDirty()
    }
    // let res = await this.companyController.executeActionUsingPOST("REMOVE_USER_FROM_COMPANY", {
    //   companyId: this.companyDetailForm.get('id').value as number,
    //   userId: user.id
    // }).pipe(take(1)).toPromise();
    // await this.save(false)
    // this.getCompany()
  }


  get changed() {
    return this.companyDetailForm.dirty;
  }


  goBack(): void {
    // this.location.back();
    this.router.navigate(['companies'])
  }

  async saveCompany(goBack = true) {
    this.submitted = true;
    if (this.companyDetailForm.invalid) {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@companyDetail.saveCompany.error.title:Error`,
        message: $localize`:@@companyDetail.saveCompany.error.message:Errors on page. Please check!`
      })
      return
    }

    try {
      this.globalEventsManager.showLoading(true);
      let params = this.route.snapshot.params;
      let res: ApiResponseApiBaseEntity = await this.companyController.updateCompanyUsingPUT({ ...params, ...this.companyDetailForm.value }).pipe(take(1)).toPromise()
      if (res && res.status == 'OK' && goBack) {
        this.mapToChain(params.id, true)
        this.companyDetailForm.markAsPristine()
        this.goBack()
      }
    } catch (e) {

    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

  async create() {
    this.submitted = true;
    this._companyErrorStatus$.next("");

    if (this.companyDetailForm.invalid) {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@companyDetail.create.error.title:Error`,
        message: $localize`:@@companyDetail.create.error.message:Errors on page. Please check!`
      })
      return
    }

    try {
      this.globalEventsManager.showLoading(true);
      let res: ApiResponseApiBaseEntity = await this.companyController.createCompanyUsingPOST(this.companyDetailForm.value).pipe(take(1)).toPromise()
      if (res && res.status === 'OK') {
        if (res.data && res.data.id) this.mapToChain(res.data.id)
        this.companyDetailForm.markAsPristine()
        this.goBack();
      }
    } catch (e) {

    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

  async mapToChain(companyId: number, update: boolean = false) {
    let respComp = await this.companyController.getCompanyUsingGET(companyId).pipe(take(1)).toPromise();
    if (respComp && 'OK' === respComp.status && respComp.data) {
      let c = respComp.data;
      let obj = {
        id: c.id,
        name: c.name,
        email: c.email,
        // certifications: c.certifications,
        // documents: c.documents,
        about: c.about,
        phone: c.phone,
        headquarters: c.headquarters,
        logo: c.logo as ChainFileInfo,
        manager: c.manager ? c.manager : "",
        mediaLinks: c.mediaLinks ? c.mediaLinks : {},
        webPage: c.webPage ? c.webPage : "",
        abbreviation: c.abbreviation ? c.abbreviation : "",
        entityType: 'company',
        interview: c.interview
      }
      delete obj.logo['id'];
      if (update) {
        let res = await this.chainOrganizationService.getOrganizationByCompanyId(companyId).pipe(take(1)).toPromise();
        if (res && 'OK' === res.status && res.data) {
          obj['_id'] = dbKey(res.data);
          obj['_rev'] = res.data._rev;
        }
      }

      let res = await this.chainOrganizationService.postOrganization(obj).pipe(take(1)).toPromise()
      if (res && 'OK' != res.status) {
        // console.log("ORGANIZATION NOT imported to CHAIN", res);
      }
    }
  }

  onFileUpload(event) {
    // console.log(event)
  }

  toggleField(_field: BehaviorSubject<Boolean>): void {
    _field.next(!_field.value);
  }


  companySection = {
    anchor: 'COMPANY_GENERAL',
    title: $localize`:@@companyDetail.companySection.general:Company`
  }

  companyHeadquartersSection = {
    anchor: 'COMPANY_HEADQUARTERS',
    title: $localize`:@@companyDetail.companySection.headquarters:Company headquarters`
  }

  socialMediaSection = {
    anchor: 'COMPANY_SOCIAL_MEDIA',
    title: $localize`:@@companyDetail.companySection.socialMedia:Social media`,
  }

  usersSection = {
    anchor: 'COMPANY_USERS',
    title: $localize`:@@companyDetail.companySection.users:Users`,
  }

  toc = [
    this.companySection,
    this.companyHeadquartersSection,
    this.socialMediaSection,
    this.usersSection
  ]

  validate() {
    this.submitted = true;
  }

  static ApiCertificationCreateEmptyObject(): ApiCertification {
    let obj = ApiCertification.formMetadata();
    return defaultEmptyObject(obj) as ApiCertification
  }

  static ApiCertificationEmptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(CompanyDetailComponent.ApiCertificationCreateEmptyObject(), ApiCertificationValidationScheme.validators)
      return f
    }
  }

  static ApiCompanyUserCreateEmptyObject(): () => FormControl {
    return () => {
      let f = new FormControl(CompanyDetailComponent.ApiCompanyUserCreateEmptyObject(), ApiCompanyUserValidationScheme.validators)
      return f
    }
  }

  static ApiCompanyDocumentCreateEmptyObject(): ApiCompanyDocument {
    let obj = ApiCompanyDocument.formMetadata();
    return defaultEmptyObject(obj) as ApiCompanyDocument
  }

  static ApiCompanyDocumentEmptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(CompanyDetailComponent.ApiCompanyDocumentCreateEmptyObject(), ApiCompanyDocumentValidationScheme.validators)
      return f
    }
  }

  static ApiCompanyUserEmptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(CompanyDetailComponent.ApiCompanyUserCreateEmptyObject(), ApiCompanyUserValidationScheme.validators)
      return f
    }
  }

  certificationListManager = null
  videosListManager = null
  productionRecordListManager = null
  meetTheFarmerListManager = null
  companyUserListManager = null;

  initializeListManagers() {
    this.companyUserListManager = new ListEditorManager<ApiCompanyUser>(
      this.companyDetailForm.get('users') as FormArray,
      CompanyDetailComponent.ApiCompanyUserEmptyObjectFormFactory(),
      ApiCompanyUserValidationScheme
    )
    this.certificationListManager = new ListEditorManager<ApiCertification>(
      (this.companyDetailForm.get('certifications')) as FormArray,
      CompanyDetailComponent.ApiCertificationEmptyObjectFormFactory(),
      ApiCertificationValidationScheme
    )
    this.videosListManager = new ListEditorManager<ApiCompanyDocument>(
      (this.companyDetailForm.get('documents')) as FormArray,
      CompanyDetailComponent.ApiCompanyDocumentEmptyObjectFormFactory(),
      ApiCompanyDocumentValidationScheme
    )
    this.productionRecordListManager = new ListEditorManager<ApiCompanyDocument>(
      (this.companyDetailForm.get('documents')) as FormArray,
      CompanyDetailComponent.ApiCompanyDocumentEmptyObjectFormFactory(),
      ApiCompanyDocumentValidationScheme
    )
    this.meetTheFarmerListManager = new ListEditorManager<ApiCompanyDocument>(
      (this.companyDetailForm.get('documents')) as FormArray,
      CompanyDetailComponent.ApiCompanyDocumentEmptyObjectFormFactory(),
      ApiCompanyDocumentValidationScheme
    )
  }


}
