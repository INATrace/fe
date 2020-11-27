import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { ProcessingActionService } from 'src/api-chain/api/processingAction.service';
import { ChainMeasureUnitType } from 'src/api-chain/model/chainMeasureUnitType';
import { ChainProcessingAction } from 'src/api-chain/model/chainProcessingAction';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService } from 'src/app/shared-services/active-facilities-for-organization-and-semi-product-id-standalone';
import { ActiveSellingFacilitiesForOrganizationAndSemiProductIdStandaloneService } from 'src/app/shared-services/active-selling-facilities-for-organization-and-semi-product-id-standalone';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { OrderProcessiongActionsForProductAndOrganizationStandaloneService } from 'src/app/shared-services/order-processing-actions-for-product-and-organization-standalone';
import { GenericEditableItemComponent } from 'src/app/shared/generic-editable-item/generic-editable-item.component';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ChainStockOrderValidationScheme } from './validation';

@Component({
  selector: 'app-stock-order-item',
  templateUrl: './stock-order-item.component.html',
  styleUrls: ['./stock-order-item.component.scss']
})
export class StockOrderItemComponent extends GenericEditableItemComponent<ChainStockOrder> {

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    protected router: Router,
    private route: ActivatedRoute,
    private chainProcessingActionService: ProcessingActionService,
    private chainFacilityService: FacilityService,
    protected codebookTranslations: CodebookTranslations
    // private modalService: NgbModalImproved
  ) {
    super(globalEventsManager)
  }

  @Input()
  disableDelete = false;

  @Input()
  formTitle = null;

  _productId: string = null
  @Input()
  set productId(value: string) {
    this._productId = value;
    if (value) {
      this.initialize()
    }
  }

  _globalOrderId: string = '-'
  @Input()
  set globalOrderId(value: string) {
    this._globalOrderId = value;
    if(value) {
    this.globalOrderId$.next(value);
    } else {
      this.globalOrderId$.next("-")
    }
  }

  get globalOrderid(): string {
    return this._globalOrderId
  }

  get productId(): string {
    return this._productId
  }

  _organizationId: string = null;

  @Input()
  set organizationId(value: string) {
    this._organizationId = value;
    if (value) {
      this.initialize()
    }
  }

  get organizationId(): string {
    return this._organizationId
  }

  @Input()
  outputFacilityId: string;

  // chainRootUrl: string = environment.chainRelativeFileUploadUrl;
  // chainDownloadRootUrl: string = environment.chainRelativeFileDownloadUrl;

  codebookOrderingProcessingActions: OrderProcessiongActionsForProductAndOrganizationStandaloneService;

  globalOrderId$ = new BehaviorSubject<string>("-")
  ngOnInit(): void {
    super.ngOnInit()
    this.sub = combineLatest(
      this.form.get('totalQuantity').valueChanges.pipe(startWith(0)),
      this.form.get('processingAction').valueChanges.pipe(startWith(this.globalOrderId)),
      this.globalOrderId$,
    (totalQuantity: number, processingAction: ChainProcessingAction, globalOrderId: string) => {
      if(globalOrderId && totalQuantity && processingAction) {
        let name = `${ globalOrderId } (${ processingAction.inputSemiProduct.name }, ${ totalQuantity } ${ processingAction.inputSemiProduct.measurementUnitType.label })`
        return name
      }
      return "-"
    }).pipe(
      startWith(this.form.get('internalLotNumber').value)
    ).subscribe(val => {
      this.form.get('internalLotNumber').setValue(val)
      this.form.updateValueAndValidity()
    })
    // this.initialize()
    // if (dbKey(this.form.value) == null) {
    //   let today = dateAtMidnightISOString(new Date().toDateString());
    //   this.form.get('formalCreationDate').setValue(today);
    // }
  }

  async initialize() {
    if (this.organizationId && this.productId) {
      this.codebookOrderingProcessingActions = new OrderProcessiongActionsForProductAndOrganizationStandaloneService(this.chainProcessingActionService, this.productId, this.organizationId, this.codebookTranslations)
    }
  }

  inputFacilityForm = new FormControl(null, Validators.required);
  // outputFacilityForm = new FormControl(null, Validators.required);

  inputFacilitiesCodebook: ActiveSellingFacilitiesForOrganizationAndSemiProductIdStandaloneService;
  outputFacilitiesCodebook: ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService;

  setProcessingAction(event) {
    this.inputFacilitiesCodebook = new ActiveSellingFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService, this.organizationId, event.inputSemiProductId, this.codebookTranslations);
    // this.outputFacilitiesCodebook = new ActiveFacilitiesForOrganizationAndSemiProductIdStandaloneService(this.chainFacilityService, this.organizationId, event.inputSemiProductId, this.codebookTranslations);
  }

  public generateForm(value: any): FormGroup {
    let form = generateFormFromMetadata(ChainStockOrder.formMetadata(), value, ChainStockOrderValidationScheme)
    form.setControl('inputFacilityForm', this.inputFacilityForm)
    form.updateValueAndValidity()
    return form
  }

  static createEmptyObject(): ChainStockOrder {
    let market = ChainStockOrder.formMetadata();
    return defaultEmptyObject(market) as ChainStockOrder
  }

  static emptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(StockOrderItemComponent.createEmptyObject(), ChainStockOrderValidationScheme.validators)
      return f
    }
  }

  get processingAction(): ChainProcessingAction {
    if (this.form) return this.form.get('processingAction').value as ChainProcessingAction
    return null
  }

  get measurementUnit(): string {
    let prAction = this.processingAction
    if (prAction) return this.codebookTranslations.translate(prAction.outputSemiProduct.measurementUnitType, "label")
    return null
  }

  get outputQuantityLabel() {
    if (this.measurementUnit) {
      return $localize`:@@stockOrderItem.textinput.quantityLabelWithUnits.label: Quantity in ${ this.measurementUnit }`
    }
    return $localize`:@@stockOrderItem.textinput.quantity.label: Quantity`
  }

  setInternalLotName() {
    let orderData = this.form.value as ChainStockOrder;
    let name = `${ this.globalOrderId } (${ orderData.processingAction.inputSemiProduct.name }, ${ orderData.totalQuantity } ${ orderData.processingAction.inputSemiProduct.measurementUnitType.label })`
  }

  // get addProofs() {
  //   let obj = {};
  //   obj['PAYMENT_LIST'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.paymentList:Payment list`;
  //   obj['PAYMENT_ORDER_APPROVED'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.paymentOrderApproved:Payment order approved`;
  //   obj['PAYMENT_PROOF'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.paymentProof:Payment proof`;
  //   obj['PURCHASE_SHEET'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.purchaseSheet:Purchase sheet`;
  //   obj['PURCHASE_SHEET_BANK_TRANSFER'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.purchaseSheetBankTransfer:Purchase sheet bank transfer`;
  //   obj['PURCHASE_SHEET_COLLECTOR'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.purchaseSheetCollector:Purchase sheet collector`;
  //   obj['RECEIPT'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.receipt:Receipt`;
  //   obj['RECEIPT_BANK_TRANSFER'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.receiptBankTransfer:Receipt bank transfer`;
  //   obj['RECEIPT_COLLECTOR'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.receiptCollector:Receipt collector`;
  //   return obj;
  // }
  // codebookAdditionalProofs = EnumSifrant.fromObject(this.addProofs);

  get name() {
    if (this.contentObject) {
      let content = this.contentObject as ChainStockOrder
      if (!content.processingAction) return null
      let res = `${ content.processingAction.inputSemiProduct.name }: ${ content.totalQuantity } ${ content.processingAction.inputSemiProduct.measurementUnitType.label }`
      if (content.pricePerUnitForEndCustomer) {
        res += `, ${ content.pricePerUnitForEndCustomer } EUR/per ${ content.processingAction.inputSemiProduct.measurementUnitType.label }`
      }
      let kgFactor = (content.processingAction.inputSemiProduct.measurementUnitType as ChainMeasureUnitType).weight
      if (kgFactor) {
        res += ` (${ content.totalQuantity * kgFactor } kg)`
      }

      return res
    }
    // if (this.contentObject && this.contentObject.formalCreationDate && this.contentObject.type) {
    //   let tmpDate = new Date(this.contentObject.formalCreationDate);
    //   let day = tmpDate.getDate();
    //   let month = tmpDate.getMonth() + 1;
    //   let year = tmpDate.getFullYear();
    //   return this.addProofs[this.contentObject.type] + " (" + day + "." + month + "." + year + ")";
    // }
    // return ""
  }

  sub: Subscription;

  ngOnDestroy() {
    if(this.sub) this.sub.unsubscribe()
  }
}
