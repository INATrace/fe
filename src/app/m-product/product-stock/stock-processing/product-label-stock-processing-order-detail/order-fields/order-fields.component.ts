import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { take } from 'rxjs/operators';
import { CodebookService } from 'src/api-chain/api/codebook.service';
import { CompanyCustomerService } from 'src/api-chain/api/companyCustomer.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ChainProcessingAction } from 'src/api-chain/model/chainProcessingAction';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { FieldDefinition } from 'src/api-chain/model/fieldDefinition';
import { ProductControllerService } from 'src/api/api/productController.service';
import { ActionTypesService } from 'src/app/shared-services/action-types.service';
import { ActiveCompanyCustomersByOrganizationService } from 'src/app/shared-services/active-company-customers-by-organization.service';
import { AssociatedCompaniesService } from 'src/app/shared-services/associated-companies.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { codeToFieldInfo, FieldType, KeyFieldDescription } from 'src/app/shared-services/document-translations.service';
import { GradeAbbreviationCodebook } from 'src/app/shared-services/grade-abbreviation-codebook';
import { OpenQuoteOrdersOnOrganizationForSemiProductStandaloneService } from 'src/app/shared-services/open-quote-orders-on-organization-for-semi-product-standalone.service';
import { dbKey } from 'src/shared/utils';

@Component({
  selector: 'app-order-fields',
  templateUrl: './order-fields.component.html',
  styleUrls: ['./order-fields.component.scss']
})
export class OrderFieldsComponent implements OnInit {

  _fieldInfo: FieldDefinition;
  @Input()
  set fieldInfo(value: FieldDefinition) {
    this._fieldInfo = value;
    this.initialize()
  }

  get fieldInfo(): FieldDefinition {
    return this._fieldInfo
  }

  _formGroup: FormGroup;
  @Input()
  set formGroup(value: FormGroup) {
    this._formGroup = value;
    this.initialize()
  }

  get formGroup(): FormGroup {
    return this._formGroup
  }

  @Input() submitted: boolean;

  @Input() productId: number;

  @Input() side: 'left' | 'right' = 'right'

  @Input() isQuote = false;

  @Input() rowClass: string = "af-row"

  @Input() colClass: string = "af-c12"


  _disabled = false;
  @Input() set disabled(value: boolean) {
    this._disabled = value;
    this.refreshDisabled()
  }

  get disabled(): boolean {
    return this._disabled
  }

  faTimes = faTimes

  refreshDisabled() {
    if (!this.form) return;
    if (!this.isOnCorrectSide) return
    if (this.disabled && this.form) {
      setTimeout(() => this.form.disable())
    } else {
      setTimeout(() => this.form.enable())
    }
  }

  organizationId: string;

  gradeAbbreviationCodebook: GradeAbbreviationCodebook;
  associatedCompaniesService: AssociatedCompaniesService;
  companyCustomerCodebook: ActiveCompanyCustomersByOrganizationService;
  triggerOrderCodebook: OpenQuoteOrdersOnOrganizationForSemiProductStandaloneService;

  constructor(
    private chainCodebookService: CodebookService,
    private chainStockOrderService: StockOrderService,
    protected codebookTranslations: CodebookTranslations,
    public productController: ProductControllerService,
    private chainCompanyCustomerService: CompanyCustomerService,
    private route: ActivatedRoute,
    public actionTypeService: ActionTypesService
  ) { }

  doNotSetValidators(label: string) {
    return ['REQUIRED_WOMENS_COFFEE'].indexOf(label) >= 0
  }

  get semiProductId() {
    let action = this.formGroup && this.formGroup.get('processingActionForm').value as ChainProcessingAction
    return dbKey(action.inputSemiProduct)
  }

  initialize() {
    if (this.fieldInfo && this.formGroup && this.settings && this.settings) {
      this.gradeAbbreviationCodebook = new GradeAbbreviationCodebook(this.chainCodebookService, this.codebookTranslations)
      this.associatedCompaniesService = new AssociatedCompaniesService(this.productController, this.route.snapshot.params.id, 'BUYER')
      this.organizationId = localStorage.getItem("selectedUserCompany");
      this.companyCustomerCodebook = new ActiveCompanyCustomersByOrganizationService(this.chainCompanyCustomerService, this.organizationId)
      // if (this.semiProductId) {
        this.triggerOrderCodebook = new OpenQuoteOrdersOnOrganizationForSemiProductStandaloneService(this.chainStockOrderService, this.organizationId, null, this.codebookTranslations)
      // }
      // this.initializeClientName()
      this.form.clearValidators()
      if (this.fieldInfo.mandatory && !this.doNotSetValidators(this.fieldInfo.label)) {
        this.form.setValidators([Validators.required]);
      }
      // console.log(this.fieldInfo.label, this.form.value)
      // if(typeof this.form.value === 'undefined') {
      //   this.form.setValue(null)
      // }
      this.refreshDisabled()
      this.form.updateValueAndValidity()
    }
  }

  ngOnInit(): void {
  }

  get settings(): KeyFieldDescription {
    // console.log("ST:", this.fieldInfo)
    if (!this.fieldInfo) return null
    return codeToFieldInfo[this.fieldInfo.label]
  }

  get isOnCorrectSide() {
    if (!this.settings) return false
    if (this.side === 'right') {
      if (this.isQuote && this.settings.leftOnQuote) return false;
      return true;
    }
    if (this.side === 'left') {
      if (this.isQuote && this.settings.leftOnQuote) return true;
      return false;
    }
  }

  get showRow() {
    return this.fieldInfo && this.formGroup && this.settings && this.settings.field && this.isOnCorrectSide
  }

  showForType(type: FieldType, label = null) {
    if (!this.fieldInfo.required) return false
    if (!label) return type === this.settings.type
    return this.fieldInfo.label === label
  }

  async initializeClientName() {
    if (this.fieldInfo.label === 'CLIENT_NAME') {
      let form = this.formGroup.get('clientId')
      if (!form || !form.value) return
      let candidates = await this.associatedCompaniesService.getAllCandidates().pipe(take(1)).toPromise()
      let val = candidates.find(x => x.company.id === form.value)
      if (val) {
        form.setValue(val)
      } else {
        form.setValue(null)
      }
    }
  }

  get form() {
    if (this.settings && this.settings.field) {
      return this.formGroup.get(this.settings.field)
    }
  }

  triggerOrderSearchForm = new FormControl(null)

  orderResultFormatter = (value: any) => {
    return this.triggerOrderCodebook.textRepresentation(value)
  }

  orderInputFormatter = (value: any) => {
    return this.triggerOrderCodebook.textRepresentation(value)
  }

  //// temp

  async addTriggerOrder(order: ChainStockOrder) {
    if (!order) return;
    let formArray = this.form as FormArray
    if (formArray.value.some(x => dbKey(x) === dbKey(order))) {
      this.triggerOrderSearchForm.setValue(null);
      return;
    }
    // sp.required = true;
    formArray.push(new FormControl({
      ...order
    }))
    formArray.markAsDirty()

    setTimeout(() => this.triggerOrderSearchForm.setValue(null))
  }

  async deleteTriggerOrder(sp: ChainStockOrder) {
    if (!sp) return
    let formArray = this.form as FormArray
    let index = (formArray.value as ChainStockOrder[]).findIndex(x => dbKey(x) === dbKey(sp))
    if (index >= 0) {
      formArray.removeAt(index)
      formArray.markAsDirty()
    }
  }

}
