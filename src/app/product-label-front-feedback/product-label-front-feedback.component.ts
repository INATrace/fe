import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { generateFormFromMetadata, defaultEmptyObject } from 'src/shared/utils';
import { ApiProductLabelFeedback } from 'src/api/model/apiProductLabelFeedback';
import { GlobalEventManagerService } from '../core/global-event-manager.service';
import { PublicControllerService } from 'src/api/api/publicController.service';
import { take } from 'rxjs/operators';
import { ApiProductLabelFeedbackValidationScheme, questionnaireAnswersValidationScheme, questionnaireAnswersFormMetadata } from './validation';
import { EnumSifrant } from '../shared-services/enum-sifrant';
import { NgbModalImproved } from '../core/ngb-modal-improved/ngb-modal-improved.service';

@Component({
  selector: 'app-product-label-front-feedback',
  templateUrl: './product-label-front-feedback.component.html',
  styleUrls: ['./product-label-front-feedback.component.scss']
})
export class ProductLabelFrontFeedbackComponent implements OnInit {

  submitted: boolean = false;

  @Input()
  labelId;

  @Input()
  gdprHtmlContext;

  @Input()
  feedback;

  filterCoffeeForm = new FormControl(null);
  espressoForm = new FormControl(null);
  frenchPressForm = new FormControl(null);
  fullyAutomaticForm = new FormControl(null);
  stovetopForm = new FormControl(null);
  otherForm = new FormControl(null);
  feedbackForm: FormGroup;

  readOnly: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private globalEventsManager: GlobalEventManagerService,
    private publicController: PublicControllerService
  ) { }

  ngOnInit(): void {
    if(this.labelId) {
      this.feedbackForm = generateFormFromMetadata(ApiProductLabelFeedback.formMetadata(), defaultEmptyObject(ApiProductLabelFeedback.formMetadata()), ApiProductLabelFeedbackValidationScheme);
      let questionnaireAnswersForm = generateFormFromMetadata(questionnaireAnswersFormMetadata(), {}, questionnaireAnswersValidationScheme);
      this.feedbackForm.setControl('questionnaireAnswers', questionnaireAnswersForm);

      this.feedbackForm.updateValueAndValidity();
    } else {
      this.readOnly = true;
      this.feedbackForm = generateFormFromMetadata(ApiProductLabelFeedback.formMetadata(), this.feedback, ApiProductLabelFeedbackValidationScheme);
      let questionnaireAnswersForm = generateFormFromMetadata(questionnaireAnswersFormMetadata(), this.feedback.questionnaireAnswers, questionnaireAnswersValidationScheme);
      this.feedbackForm.setControl('questionnaireAnswers', questionnaireAnswersForm);

      if (this.feedback.questionnaireAnswers.howDoYouPrepare) {
        let howDoYouPrepare = JSON.parse(this.feedback.questionnaireAnswers.howDoYouPrepare);
        this.filterCoffeeForm.setValue(howDoYouPrepare.FILTER_COFFE);
        this.espressoForm.setValue(howDoYouPrepare.ESPRESSO_MACHINE);
        this.frenchPressForm.setValue(howDoYouPrepare.FRENCH_PRESS);
        this.fullyAutomaticForm.setValue(howDoYouPrepare.FULLY_AUTOMATIC_MACHINE);
        this.stovetopForm.setValue(howDoYouPrepare.STOVETOP_MOKA_POT);
        this.otherForm.setValue(howDoYouPrepare.OTHER);

        this.feedbackForm.get('questionnaireAnswers.rateTaste').disable();
        this.feedbackForm.get('questionnaireAnswers.gender').disable();
      }

    }

  }

  dismiss() {
    this.activeModal.dismiss();
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
      let res = await this.publicController.addProductLabelFeedbackUsingPOST(this.labelId, data).pipe(take(1)).toPromise()
      if (res && res.status === 'OK') {
        result = true;
      }
    } catch (e) {

    } finally {
      this.globalEventsManager.showLoading(false);
    }
    this.dismiss();
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
    obj['PRAISE'] = $localize`:@@productLabelFrontFeedback.statusList.registred:Praise`
    obj['PROPOSAL'] = $localize`:@@productLabelFrontFeedback.statusList.active:Proposal`
    obj['COMPLAINT'] = $localize`:@@productLabelFrontFeedback.statusList.deactivated:Complaint`
    return obj;
  }
  codebookStatus = EnumSifrant.fromObject(this.statusList)

  get ageCodes() {
    let obj = {}
    obj['Male'] = $localize`:@@customerDetail.ageCodes.male:Male`
    obj['Female'] = $localize`:@@customerDetail.ageCodes.female:Female`
    obj['N/A'] = $localize`:@@customerDetail.ageCodes.na:N/A`
    return obj;
  }
  codebookAgeCodes = EnumSifrant.fromObject(this.ageCodes)


  get tasteCodes() {
    let obj = {}
    obj['Better'] = $localize`:@@customerDetail.tasteCodes.better:Better`
    obj['Same'] = $localize`:@@customerDetail.tasteCodes.same:Same`
    obj['Worse'] = $localize`:@@customerDetail.tasteCodes.worse:Worse`
    return obj;
  }
  codebookTasteCodes = EnumSifrant.fromObject(this.tasteCodes)

}
