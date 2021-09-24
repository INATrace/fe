import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { generateFormFromMetadata, defaultEmptyObject } from 'src/shared/utils';
import { ApiProductLabelFeedback } from 'src/api/model/apiProductLabelFeedback';
import { ApiProductLabelFeedbackValidationScheme, questionnaireAnswersFormMetadata, questionnaireAnswersValidationScheme } from 'src/app/product-label-front-page/product-label-front-feedback/validation';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { PublicControllerService } from 'src/api/api/publicController.service';
import { take } from 'rxjs/operators';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-front-page-feedback',
  templateUrl: './front-page-feedback.component.html',
  styleUrls: ['./front-page-feedback.component.scss']
})
export class FrontPageFeedbackComponent implements OnInit {

  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll(event){
    this.pageYoffset = window.pageYOffset;
  }

  constructor(
    private route: ActivatedRoute,
    private globalEventsManager: GlobalEventManagerService,
    private publicController: PublicControllerService,
    private scroll: ViewportScroller
  ) { }

  submitted: boolean = false;

  filterCoffeeForm = new FormControl(null);
  espressoForm = new FormControl(null);
  frenchPressForm = new FormControl(null);
  fullyAutomaticForm = new FormControl(null);
  stovetopForm = new FormControl(null);
  otherForm = new FormControl(null);
  feedbackForm: FormGroup;

  tab: string = null;

  title = $localize`:@@frontPage.feedback.title:Feedback`;

  uuid = this.route.snapshot.params.uuid;

  ngOnInit(): void {
    this.tab = this.route.snapshot.data.tab;
    this.initLabel();

    this.feedbackForm = generateFormFromMetadata(ApiProductLabelFeedback.formMetadata(), defaultEmptyObject(ApiProductLabelFeedback.formMetadata()), ApiProductLabelFeedbackValidationScheme);
    let questionnaireAnswersForm = generateFormFromMetadata(questionnaireAnswersFormMetadata(), {}, questionnaireAnswersValidationScheme);
    this.feedbackForm.setControl('questionnaireAnswers', questionnaireAnswersForm);
    this.feedbackForm.updateValueAndValidity();
  }

  scrollToTop(){
    this.scroll.scrollToPosition([0,0]);
  }

  async initLabel() {
    let res = await this.publicController.getPublicProductLabelValuesUsingGET(this.uuid).pipe(take(1)).toPromise();
    if (res && res.status === "OK") {
      this.prepareGDPR(res.data.fields);
    }
  }

  gdprHtmlContext: string = "";
  prepareGDPR(data) {
    for (let item of data) {
      if (item.name === "settings.gdprText") {
        this.gdprHtmlContext = item.value;
      }
    }
  }

  async submitFeedback() {
    this.submitted = true;
    if (this.feedbackForm.invalid) {
      return false;
    }
    let result = false;
    try {
      this.globalEventsManager.showLoading(true);
      let data = this.prepareData();
      let res = await this.publicController.addProductLabelFeedbackUsingPOST(this.uuid, data).pipe(take(1)).toPromise()
      if (res && res.status === 'OK') {
        result = true;
        this.globalEventsManager.push({
          action: 'success',
          notificationType: 'success',
          title: $localize`:@@frontPage.feedback.success.title:Submitted`,
          message: $localize`:@@frontPage.feedback.success.message:Successfully submitted.`
        })
        this.feedbackForm = generateFormFromMetadata(ApiProductLabelFeedback.formMetadata(), defaultEmptyObject(ApiProductLabelFeedback.formMetadata()), ApiProductLabelFeedbackValidationScheme);
        let questionnaireAnswersForm = generateFormFromMetadata(questionnaireAnswersFormMetadata(), {}, questionnaireAnswersValidationScheme);
        this.feedbackForm.setControl('questionnaireAnswers', questionnaireAnswersForm);
        this.feedbackForm.updateValueAndValidity();
        this.filterCoffeeForm.setValue(null);
        this.espressoForm.setValue(null);
        this.frenchPressForm.setValue(null);
        this.fullyAutomaticForm.setValue(null);
        this.stovetopForm.setValue(null);
        this.otherForm.setValue(null);
      }
    } catch (e) {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@frontPage.feedback.error.title:Something went wrong`,
        message: $localize`:@@frontPage.feedback.error.message:Please try again.`
      })
    } finally {
      this.submitted = false;
      this.globalEventsManager.showLoading(false);
    }
    return result;
  }

  prepareData() {
    let data = this.feedbackForm.value;

    data.questionnaireAnswers.howDoYouPrepare = JSON.stringify({
      FILTER_COFFEE: this.filterCoffeeForm.value,
      ESPRESSO_MACHINE: this.espressoForm.value,
      FRENCH_PRESS: this.frenchPressForm.value,
      FULLY_AUTOMATIC_MACHINE: this.fullyAutomaticForm.value,
      STOVETOP_MOKA_POT: this.stovetopForm.value,
      OTHER: this.otherForm.value
    })

    return data;
  }

  get statusList() {
    let obj = {}
    obj['PRAISE'] = $localize`:@@frontPage.feedback.statusList.registred:Praise`
    obj['PROPOSAL'] = $localize`:@@frontPage.feedback.statusList.active:Proposal`
    obj['COMPLAINT'] = $localize`:@@frontPage.feedback.statusList.deactivated:Complaint`
    return obj;
  }
  codebookStatus = EnumSifrant.fromObject(this.statusList)

  get ageCodes() {
    let obj = {}
    obj['Male'] = $localize`:@@frontPage.feedback.ageCodes.male:Male`
    obj['Female'] = $localize`:@@frontPage.feedback.ageCodes.female:Female`
    obj['N/A'] = $localize`:@@frontPage.feedback.ageCodes.na:N/A`
    return obj;
  }
  codebookAgeCodes = EnumSifrant.fromObject(this.ageCodes)


  get tasteCodes() {
    let obj = {}
    obj['Better'] = $localize`:@@frontPage.feedback.tasteCodes.better:Better`
    obj['Same'] = $localize`:@@frontPage.feedback.tasteCodes.same:Same`
    obj['Worse'] = $localize`:@@frontPage.feedback.tasteCodes.worse:Worse`
    return obj;
  }
  codebookTasteCodes = EnumSifrant.fromObject(this.tasteCodes)


  conditionConfirmation(control: AbstractControl): ValidationErrors | null {
    const condition = control.value
    return condition === true ? null : { conditionsNotConfirmed: true }
  }

}
