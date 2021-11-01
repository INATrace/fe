import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GenericEditableItemComponent } from '../../../../../shared/generic-editable-item/generic-editable-item.component';
import { ApiStockOrder } from '../../../../../../api/model/apiStockOrder';
import { GlobalEventManagerService } from '../../../../../core/global-event-manager.service';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { generateFormFromMetadata } from '../../../../../../shared/utils';
import { ApiProcessingOrderValidationScheme, ApiStockOrderValidationScheme } from './validation';
import { CompanyFinalProductQuoteOrderActionsService } from '../../../../../shared-services/company-final-product-quote-order-actions.service';
import { ProcessingActionControllerService } from '../../../../../../api/api/processingActionController.service';
import { AvailableSellingFacilitiesForCompany } from '../../../../../shared-services/available-selling-facilities-for.company';
import { FacilityControllerService } from '../../../../../../api/api/facilityController.service';
import { ApiProcessingAction } from '../../../../../../api/model/apiProcessingAction';
import { ApiMeasureUnitType } from '../../../../../../api/model/apiMeasureUnitType';
import { ApiProcessingOrder } from '../../../../../../api/model/apiProcessingOrder';
import { ApiFacility } from '../../../../../../api/model/apiFacility';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-product-order-item',
  templateUrl: './product-order-item.component.html',
  styleUrls: ['./product-order-item.component.scss']
})
export class ProductOrderItemComponent extends GenericEditableItemComponent<ApiStockOrder> implements OnInit, OnDestroy {

  @Input()
  disableDelete = false;

  @Input()
  set globalOrderId(value: string) {
    this.globalOrderIdLocal = value;
    if (value) {
      this.globalOrderId$.next(value);
    } else {
      this.globalOrderId$.next('-');
    }
  }

  get globalOrderId(): string {
    return this.globalOrderIdLocal;
  }

  @Input()
  set companyId(value: number) {
    this.companyIdLocal = value;
  }

  get companyId(): number {
    return this.companyIdLocal;
  }

  @Input()
  private companyCurrency;

  @Input()
  outputFacility: ApiFacility;

  globalOrderIdLocal = '-';

  companyIdLocal = null;

  globalOrderId$ = new BehaviorSubject<string>('-');

  codebookOrderingProcessingActions: CompanyFinalProductQuoteOrderActionsService;

  inputFacilitiesCodebook: AvailableSellingFacilitiesForCompany;
  inputFacilityForm = new FormControl(null, Validators.required);

  internalLotSubs: Subscription;

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    private processingActionController: ProcessingActionControllerService,
    private facilityController: FacilityControllerService
  ) {
    super(globalEventsManager);
  }

  get name() {

    if (this.contentObject) {

      const stockOrder = this.contentObject as ApiStockOrder;

      if (!stockOrder.processingOrder?.processingAction) {
        return null;
      }

      const procAction = stockOrder.processingOrder.processingAction;

      let res = `${ procAction.inputFinalProduct.name }: ${ stockOrder.totalQuantity } ${ procAction.inputFinalProduct.measurementUnitType.label }`;

      if (stockOrder.pricePerUnitForEndCustomer) {
        res += `, ${ stockOrder.pricePerUnitForEndCustomer } ${stockOrder.currencyForEndCustomer}/per ${ procAction.inputFinalProduct.measurementUnitType.label }`;
      }

      const kgFactor = (procAction.inputFinalProduct.measurementUnitType as ApiMeasureUnitType).weight;

      if (kgFactor) {
        res += ` (${ stockOrder.totalQuantity * kgFactor } kg)`;
      }

      return res;
    }

    return '';
  }

  private get processingAction(): ApiProcessingAction {
    if (this.form.get('processingOrder.processingAction')) {
      return this.form.get('processingOrder.processingAction').value as ApiProcessingAction;
    }
    return null;
  }

  private get measurementUnit(): string {
    const prAction = this.processingAction;
    if (prAction) {
      return prAction.outputFinalProduct.measurementUnitType.label;
    }
    return null;
  }

  get outputQuantityLabel() {
    if (this.measurementUnit) {
      return $localize`:@@stockOrderItem.textinput.quantityLabelWithUnits.label:Quantity in` + ' ' + this.measurementUnit;
    }
    return $localize`:@@stockOrderItem.textinput.quantity.label:Quantity`;
  }

  get pricePerUnitLabel() {
    return $localize`:@@stockOrderItem.textinput.pricePerUnitForEndCustomer.label:Price per item at end customer` + ` (${this.companyCurrency})`;
  }

  get pricePerUnitPlaceholder() {
    return $localize`:@@stockOrderItem.textinput.pricePerUnitForEndCustomer.placeholder:Enter price in` + ` ${this.companyCurrency}`;
  }

  ngOnInit(): void {

    super.ngOnInit();
    this.codebookOrderingProcessingActions =
      new CompanyFinalProductQuoteOrderActionsService(this.processingActionController, this.companyId,  this.outputFacility);

    if (this.form) {
      this.form.get('currencyForEndCustomer').setValue(this.companyCurrency);
    }

    // Set the internal LOT number (name) automatically from the other fields
    this.internalLotSubs = combineLatest([
      this.form.get('totalQuantity').valueChanges.pipe(startWith(0)),
      this.form.get('processingOrder.processingAction').valueChanges.pipe(startWith(null)),
      this.globalOrderId$
    ]).pipe(
      map(([totalQuantity, processingAction, globalOrderId]) => {
        if (totalQuantity && processingAction && globalOrderId) {
          return `${ globalOrderId } (${ processingAction.inputFinalProduct.name }, ${ totalQuantity } ${ processingAction.inputFinalProduct.measurementUnitType.label })`;
        }
        return '-';
      })
    ).subscribe(internalLotName => {
      this.form.get('internalLotNumber').setValue(internalLotName);
      this.form.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    if (this.internalLotSubs) {
      this.internalLotSubs.unsubscribe();
    }
  }

  public generateForm(value: any): FormGroup {

    const form = generateFormFromMetadata(ApiStockOrder.formMetadata(), value, ApiStockOrderValidationScheme);
    form.setControl('inputFacilityForm', this.inputFacilityForm);
    form.setControl('processingOrder', generateFormFromMetadata(ApiProcessingOrder.formMetadata(), {}, ApiProcessingOrderValidationScheme));
    form.updateValueAndValidity();

    return form;
  }

  setProcessingAction(event: ApiProcessingAction) {
    if (event) {
      this.inputFacilitiesCodebook = new AvailableSellingFacilitiesForCompany(this.facilityController, this.companyId, null, event.inputFinalProduct.id);
    } else {
      this.inputFacilitiesCodebook = null;
    }
  }

}
