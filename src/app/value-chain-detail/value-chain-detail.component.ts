import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ValueChainControllerService } from '../../api/api/valueChainController.service';
import { finalize } from 'rxjs/operators';
import { GlobalEventManagerService } from '../system/global-event-manager.service';
import { defaultEmptyObject, generateFormFromMetadata } from '../../shared/utils';
import { ApiValueChain } from '../../api/model/apiValueChain';
import { ApiValueChainValidationScheme, ApiVCMeasureUnitTypeValidationScheme } from './validation';
import { ListEditorManager } from '../shared/list-editor/list-editor-manager';
import { ApiFacilityType } from '../../api/model/apiFacilityType';
import { ApiMeasureUnitType } from '../../api/model/apiMeasureUnitType';
import { ApiFacilityTypeValidationScheme, ApiGradeAbbreviationValidationScheme } from '../type-detail-modal/validation';
import { ApiGradeAbbreviation } from '../../api/model/apiGradeAbbreviation';

@Component({
  selector: 'app-value-chain-detail',
  templateUrl: './value-chain-detail.component.html',
  styleUrls: ['./value-chain-detail.component.scss']
})
export class ValueChainDetailComponent implements OnInit {

  valueChainDetailForm: FormGroup;

  submitted = false;

  title: string;

  facilityTypeListManager: ListEditorManager<ApiFacilityType>;
  measureUnitTypeListManager: ListEditorManager<ApiMeasureUnitType>;
  gradeAbbreviationTypeListManager: ListEditorManager<ApiGradeAbbreviation>;

  constructor(
    protected route: ActivatedRoute,
    private valueChainService: ValueChainControllerService,
    private globalEventsManager: GlobalEventManagerService
  ) { }

  static ApiVCFacilityTypeCreateEmptyObject(): ApiFacilityType {
    const obj = ApiFacilityType.formMetadata();
    return defaultEmptyObject(obj) as ApiFacilityType;
  }

  static ApiVCFacilityTypeEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(ValueChainDetailComponent.ApiVCFacilityTypeCreateEmptyObject(),
        ApiFacilityTypeValidationScheme.validators);
    };
  }

  static ApiVCMeasureUnitTypeCreateEmptyObject(): ApiMeasureUnitType {
    const obj = ApiMeasureUnitType.formMetadata();
    return defaultEmptyObject(obj) as ApiMeasureUnitType;
  }

  static ApiVCMeasureUnitTypeEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(ValueChainDetailComponent.ApiVCMeasureUnitTypeCreateEmptyObject(),
        ApiVCMeasureUnitTypeValidationScheme.validators);
    };
  }

  static ApiVCGradeAbbreviationTypeCreateEmptyObject(): ApiGradeAbbreviation {
    const obj = ApiGradeAbbreviation.formMetadata();
    return defaultEmptyObject(obj) as ApiGradeAbbreviation;
  }

  static ApiVCGradeAbbreviationTypeEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(ValueChainDetailComponent.ApiVCGradeAbbreviationTypeCreateEmptyObject(),
        ApiGradeAbbreviationValidationScheme.validators);
    };
  }

  get mode() {
    const id = this.route.snapshot.params.id;
    return id == null ? 'create' : 'update';
  }

  get changed() {
    return this.valueChainDetailForm.dirty;
  }

  get vcFacilityTypes(): FormControl[] {
    return (this.valueChainDetailForm.get('facilityTypes') as FormArray).controls as FormControl[];
  }

  get vcMeasureUnitTypes(): FormControl[] {
    return (this.valueChainDetailForm.get('measureUnitTypes') as FormArray).controls as FormControl[];
  }

  get vcGradeAbbreviationTypes(): FormControl[] {
    return (this.valueChainDetailForm.get('gradeAbbreviations') as FormArray).controls as FormControl[];
  }

  ngOnInit(): void {
    if (this.mode === 'update') {
      this.title = $localize`:@@valueChainDetail.title.edit:Edit value chain`;
      this.getValueChain();
    } else {
      this.title = $localize`:@@valueChainDetail.title.add:Create new value chain`;
      this.newValueChain();
    }
  }

  public canDeactivate(): boolean {
    return !this.valueChainDetailForm || !this.valueChainDetailForm.dirty;
  }

  private getValueChain() {
    this.globalEventsManager.showLoading(true);
    const id = this.route.snapshot.paramMap.get('id');
    this.valueChainService.getValueChainUsingGET(Number(id))
      .pipe(
        finalize(() => this.globalEventsManager.showLoading(false))
      )
      .subscribe(
        valueChain => {
          this.valueChainDetailForm =
            generateFormFromMetadata(ApiValueChain.formMetadata(), valueChain.data, ApiValueChainValidationScheme);
          this.initializeListManagers();
        },
        error => {
          console.log('ERR: ', error);
        }
      );
  }

  private newValueChain() {
    this.valueChainDetailForm =
      generateFormFromMetadata(ApiValueChain.formMetadata(), {} as ApiValueChain, ApiValueChainValidationScheme);
    this.initializeListManagers();
  }

  validate() {
    this.submitted = true;
  }

  save() {

  }

  create() {

  }

  initializeListManagers() {

    this.facilityTypeListManager = new ListEditorManager<ApiFacilityType>(
      this.valueChainDetailForm.get('facilityTypes') as FormArray,
      ValueChainDetailComponent.ApiVCFacilityTypeEmptyObjectFormFactory(),
      ApiFacilityTypeValidationScheme);

    this.measureUnitTypeListManager = new ListEditorManager<ApiMeasureUnitType>(
      this.valueChainDetailForm.get('measureUnitTypes') as FormArray,
      ValueChainDetailComponent.ApiVCMeasureUnitTypeEmptyObjectFormFactory(),
      ApiVCMeasureUnitTypeValidationScheme);

    this.gradeAbbreviationTypeListManager = new ListEditorManager<ApiGradeAbbreviation>(
      this.valueChainDetailForm.get('gradeAbbreviations') as FormArray,
      ValueChainDetailComponent.ApiVCGradeAbbreviationTypeEmptyObjectFormFactory(),
      ApiGradeAbbreviationValidationScheme);
  }

}
