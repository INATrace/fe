import { Component, Input, OnInit } from '@angular/core';
import { GenericEditableItemComponent } from '../../../../../shared/generic-editable-item/generic-editable-item.component';
import { ApiStockOrder } from '../../../../../../api/model/apiStockOrder';
import { GlobalEventManagerService } from '../../../../../core/global-event-manager.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-product-order-item',
  templateUrl: './product-order-item.component.html',
  styleUrls: ['./product-order-item.component.scss']
})
export class ProductOrderItemComponent extends GenericEditableItemComponent<ApiStockOrder> implements OnInit {

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
    if (value) {
      this.initialize();
    }
  }

  get companyId(): number {
    return this.companyIdLocal;
  }

  @Input()
  outputFacilityId: number;

  globalOrderIdLocal = '-';

  companyIdLocal = null;

  globalOrderId$ = new BehaviorSubject<string>('-');

  constructor(
    protected globalEventsManager: GlobalEventManagerService
  ) {
    super(globalEventsManager);
  }

  get name() {

    // TODO: correct this
    // if (this.contentObject) {
    //
    //   const content = this.contentObject as ApiStockOrder;
    //
    //   if (!content.processingAction) {
    //     return null;
    //   }
    //
    //   let res = `${ content.processingAction.inputSemiProduct.name }: ${ content.totalQuantity } ${ content.processingAction.inputSemiProduct.measurementUnitType.label }`;
    //
    //   if (content.pricePerUnitForEndCustomer) {
    //     res += `, ${ content.pricePerUnitForEndCustomer } EUR/per ${ content.processingAction.inputSemiProduct.measurementUnitType.label }`;
    //   }
    //
    //   const kgFactor = (content.processingAction.inputSemiProduct.measurementUnitType as ApiMeasureUnitType).weight;
    //
    //   if (kgFactor) {
    //     res += ` (${ content.totalQuantity * kgFactor } kg)`;
    //   }
    //
    //   return res;
    // }

    return '';
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  async initialize() {
    if (this.companyId) {
      // TODO: correct this
      // this.codebookOrderingProcessingActions = new
      // OrderProcessiongActionsForProductAndOrganizationStandaloneService(this.chainProcessingActionService, this.productId, this.organizationId, this.codebookTranslations)
    }
  }

}
