import { Component, OnInit } from '@angular/core';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { GlobalEventManagerService } from '../system/global-event-manager.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CountryService } from '../shared-services/countries.service';
import { EmailValidator } from 'src/shared/validation';

@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['./company-create.component.scss']
})
export class CompanyCreateComponent implements OnInit {

  submitted: boolean = false;
  _companyErrorStatus$: BehaviorSubject<string>;
  companyCreateForm: FormGroup;
  countries: any = [];
  socialMediaForm: FormGroup;
  _hideWebPageField$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  _hideFacebookField$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  _hideInstagramField$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  _hideTwitterField$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  _hideYouTubeField$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  _hideOtherField$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private location: Location,
    private companyController: CompanyControllerService,
    protected globalEventsManager: GlobalEventManagerService,
    public countryCodes: CountryService
  ) { }

  ngOnInit(): void {
    this._companyErrorStatus$ = new BehaviorSubject<string>("");
    this.createCompanyDetailForm();
    this.createSocialMediaForm();
  }

  createCompanyDetailForm(): void {
    this.companyCreateForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      logo: new FormControl(null),
      headquarters: new FormGroup({
        address: new FormControl(null),
        city: new FormControl(null),
        state: new FormControl(null),
        zip: new FormControl(null),
        country: new FormControl(null)
      }),
      email: new FormControl(null, EmailValidator()),
      phone: new FormControl(null),
      about: new FormControl(null),
      manager: new FormControl(null),
      webPage: new FormControl(null),
      mediaLinks: new FormControl(null)
    })
  }

  createSocialMediaForm(): void {
    this.socialMediaForm = new FormGroup({
      facebook: new FormControl(null),
      instagram: new FormControl(null),
      twitter: new FormControl(null),
      youtube: new FormControl(null),
      other: new FormControl(null),
    })
  }

  goBack(): void {
    this.location.back();
  }

  create(): void {
    this.submitted = true;
    this._companyErrorStatus$.next("");
    if (!this.companyCreateForm.invalid) {
    this.companyCreateForm.get('mediaLinks').setValue(this.socialMediaForm.value);
    this.companyController.createCompanyUsingPOST(this.companyCreateForm.value)
        .subscribe(() => {
          this.goBack();
          this.globalEventsManager.showLoading(false);},
          error => {
            this._companyErrorStatus$.next(error.error.status);
            this.globalEventsManager.showLoading(false);
          });
    }
  }

  onFileUpload(event) {
  }

  toggleField(_field: BehaviorSubject<Boolean>): void {
    _field.next(!_field.value);
  }
}
