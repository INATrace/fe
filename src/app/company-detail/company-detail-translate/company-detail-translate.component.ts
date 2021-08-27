import { Component, OnInit } from '@angular/core';
import { CompanyDetailTabManagerComponent } from '../company-detail-tab-manager/company-detail-tab-manager.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { ApiCompanyGetValidationScheme, TranslateApiCompanyGetValidationScheme, ApiCompanyDocumentValidationScheme } from '../validation';
import { ApiCompanyGet } from 'src/api/model/apiCompanyGet';
import { CompanyDetailComponent } from '../company-detail.component';
import { FormGroup, FormArray } from '@angular/forms';
import { generateFormFromMetadata } from 'src/shared/utils';
import { ApiResponseApiBaseEntity } from 'src/api/model/apiResponseApiBaseEntity';
import { take } from 'rxjs/operators';
import { ListEditorManager } from 'src/app/shared/list-editor/list-editor-manager';
import { ApiCertification } from 'src/api/model/apiCertification';
import { ApiCertificationValidationScheme } from 'src/app/m-product/product-label/validation';
import { ApiCompanyDocument } from 'src/api/model/apiCompanyDocument';

@Component({
  selector: 'app-company-detail-translate',
  templateUrl: './company-detail-translate.component.html',
  styleUrls: ['./company-detail-translate.component.scss']
})
export class CompanyDetailTranslateComponent extends CompanyDetailTabManagerComponent {

  public canDeactivate(): boolean {
    return !this.companyDetailDEForm || !this.companyDetailDEForm.dirty;
  }

  rootTab = 1
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    private companyController: CompanyControllerService,
    protected globalEventsManager: GlobalEventManagerService,
  ) {
    super(router, route);
  }

  title = $localize`:@@companyDetailTranslateTranslate.title.edit:Company translations`;
  company;
  companyDE;
  companyDetailForm: FormGroup;
  companyDetailDEForm: FormGroup;
  socialMediaForm: FormGroup;
  socialMediaDEForm: FormGroup;
  sub: Subscription;
  subDE: Subscription;
  submitted: boolean = false;
  certificationListManager = null;
  videosListManager = null;
  productionRecordListManager = null;
  meetTheFarmerListManager = null;

  certificationListManagerDE = null;
  videosListManagerDE = null;
  productionRecordListManagerDE = null;
  meetTheFarmerListManagerDE = null;

  prepared: boolean = false;

  ngOnInit(): void {
    this.getCompany();
  }
  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    if (this.subDE) this.subDE.unsubscribe();
  }


  getCompany(): void {
    this.globalEventsManager.showLoading(true);
    const id = +this.route.snapshot.paramMap.get('id');
    this.sub = this.companyController.getCompanyUsingGET(id)
      .subscribe(company => {
        this.company = company.data;
        // console.log("DATA:", this.company)
        this.companyDetailForm = generateFormFromMetadata(ApiCompanyGet.formMetadata(), company.data, ApiCompanyGetValidationScheme)
        this.socialMediaForm = CompanyDetailComponent.generateSocialMediaForm();
        (this.companyDetailForm as FormGroup).setControl('mediaLinks', this.socialMediaForm)
        this.companyDetailForm.updateValueAndValidity()

        //TODO 105-108 for DE

        this.fillWebPageAndSocialMediaForm('EN');
        // console.log("FORM:", this.companyDetailForm)
        this.initializeListManagers();
        this.globalEventsManager.showLoading(false);
      },
        error => {
          this.globalEventsManager.showLoading(false);
        });

    this.subDE = this.companyController.getCompanyUsingGET(id, 'DE')
      .subscribe(company => {
        this.companyDE = company.data;
        this.companyDetailDEForm = generateFormFromMetadata(ApiCompanyGet.formMetadata(), this.companyDE, TranslateApiCompanyGetValidationScheme)
        this.socialMediaDEForm = CompanyDetailComponent.generateSocialMediaForm();
        (this.companyDetailDEForm as FormGroup).setControl('mediaLinks', this.socialMediaForm)
        this.companyDetailDEForm.updateValueAndValidity()

        // //TODO 105-108 for DE

        this.fillWebPageAndSocialMediaForm('DE');
        this.initializeListManagers('DE');
        this.globalEventsManager.showLoading(false);
      },
        error => {
          this.globalEventsManager.showLoading(false);
        });
  }


  initializeListManagers(lang = 'EN') {
    if(lang === 'DE') {
      this.certificationListManagerDE = new ListEditorManager<ApiCertification>(
        (this.companyDetailDEForm.get('certifications')) as FormArray,
        CompanyDetailComponent.ApiCertificationEmptyObjectFormFactory(),
        ApiCertificationValidationScheme
      )
      this.videosListManagerDE = new ListEditorManager<ApiCompanyDocument>(
        (this.companyDetailDEForm.get('documents')) as FormArray,
        CompanyDetailComponent.ApiCompanyDocumentEmptyObjectFormFactory(),
        ApiCompanyDocumentValidationScheme
      )
      this.productionRecordListManagerDE = new ListEditorManager<ApiCompanyDocument>(
        (this.companyDetailDEForm.get('documents')) as FormArray,
        CompanyDetailComponent.ApiCompanyDocumentEmptyObjectFormFactory(),
        ApiCompanyDocumentValidationScheme
      )
      this.meetTheFarmerListManagerDE = new ListEditorManager<ApiCompanyDocument>(
        (this.companyDetailDEForm.get('documents')) as FormArray,
        CompanyDetailComponent.ApiCompanyDocumentEmptyObjectFormFactory(),
        ApiCompanyDocumentValidationScheme
      )
      this.prepared = true;
    } else {
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

  fillWebPageAndSocialMediaForm(lang): void {
    if (lang === 'DE' && this.companyDE.mediaLinks) {
      for (let [key, value] of Object.entries(this.companyDE.mediaLinks)) {
        if (key === 'facebook' && !!value) {
          this.socialMediaDEForm.get('facebook').setValue(value);
        }
        if (key === 'instagram' && !!value) {
          this.socialMediaDEForm.get('instagram').setValue(value);
        }
        if (key === 'twitter' && !!value) {
          this.socialMediaDEForm.get('twitter').setValue(value);
        }
        if (key === 'youtube' && !!value) {
          this.socialMediaDEForm.get('youtube').setValue(value);
        }
        if (key === 'other' && !!value) {
          this.socialMediaDEForm.get('other').setValue(value);
        }
      }
      this.companyDetailDEForm.updateValueAndValidity()
    } else {
      for (let [key, value] of Object.entries(this.company.mediaLinks)) {
        if (key === 'facebook' && !!value) {
          this.socialMediaForm.get('facebook').setValue(value);
        }
        if (key === 'instagram' && !!value) {
          this.socialMediaForm.get('instagram').setValue(value);
        }
        if (key === 'twitter' && !!value) {
          this.socialMediaForm.get('twitter').setValue(value);
        }
        if (key === 'youtube' && !!value) {
          this.socialMediaForm.get('youtube').setValue(value);
        }
        if (key === 'other' && !!value) {
          this.socialMediaForm.get('other').setValue(value);
        }
      }
      this.companyDetailForm.updateValueAndValidity()
    }

  }


  async saveCompany(goBack = true) {
    this.submitted = true;
    // console.log(this.companyDetailDEForm)
    if (this.companyDetailDEForm.invalid) {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@companyDetailTranslate.saveCompany.error.title:Error`,
        message: $localize`:@@companyDetailTranslate.saveCompany.error.message:Errors on page. Please check!`
      })
      return
    }
    let data = this.companyDetailDEForm.value;
    data['language'] = 'DE'
    // console.log(data)
    try {
      this.globalEventsManager.showLoading(true);
      let params = this.route.snapshot.params;
      let res: ApiResponseApiBaseEntity = await this.companyController.updateCompanyUsingPUT({ ...params, ...data }).pipe(take(1)).toPromise()
      if (res && res.status == 'OK' && goBack) {
        this.companyDetailDEForm.markAsPristine()
        this.goBack()
      }
    } catch (e) {

    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

  goBack() {
    this.router.navigate(['companies'])
  }
//company ima pri get in put requestu možnost
//specificiranja jezika. Nisem ravno dal možnosti
// prevajanja vseh polj, ampak se bodo v zahtevanem jeziku updatala samo

//name, abbreviation, about, interview, webPage in mediaLinks.

//Ostala polja se bodo updatala v splošni(angleški verziji).
//Če rabiš še katera polja za prevest, povej.
//(Ali pa če bi morda raje, da če specificiraš neangleški jezik,
//da se updatajo samo prevedljiva polja, da ti ni treba poslat
//recimo emaila tudi takrat-- ker ga bo spremenil na globalnem nivoju)
}
