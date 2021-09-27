import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StockOrderType } from '../../../../../shared/types';
import { ActivatedRoute } from '@angular/router';
import { ChainStockOrder } from '../../../../../api-chain/model/chainStockOrder';
import { EnumSifrant } from '../../../../shared-services/enum-sifrant';
import { ActiveUserCustomersByOrganizationAndRoleService } from '../../../../shared-services/active-user-customers-by-organization-and-role.service';
import { ChainUserCustomer } from '../../../../../api-chain/model/chainUserCustomer';
import { dbKey } from '../../../../../shared/utils';
import { ChainSemiProduct } from '../../../../../api-chain/model/chainSemiProduct';

@Component({
  selector: 'app-stock-purchase-order-details',
  templateUrl: './stock-purchase-order-details.component.html',
  styleUrls: ['./stock-purchase-order-details.component.scss']
})
export class StockPurchaseOrderDetailsComponent implements OnInit {

  title: string = null;

  update = true;

  stockOrderForm: FormGroup;
  order: ChainStockOrder;
  orderTypeForm = new FormControl(null);
  orderTypeCodebook = EnumSifrant.fromObject(this.orderTypeOptions);

  userLastChanged = null;

  submitted = false;

  codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList);

  searchFarmers = new FormControl(null, Validators.required);
  searchCollectors = new FormControl(null);
  farmersCodebook: ActiveUserCustomersByOrganizationAndRoleService;
  collectorsCodebook: ActiveUserCustomersByOrganizationAndRoleService;

  employeeForm = new FormControl(null, Validators.required);
  codebookUsers: EnumSifrant;

  facilityNameForm = new FormControl(null);

  options: ChainSemiProduct[] = [];
  modelChoice = null;

  searchWomenCoffeeForm = new FormControl(null, Validators.required);
  codebookWomenCoffee = EnumSifrant.fromObject(this.womenCoffeeList);

  constructor(
    private route: ActivatedRoute
  ) { }

  get orderType(): StockOrderType {

    const realType = this.stockOrderForm && this.stockOrderForm.get('orderType').value;

    if (realType) {
      return realType;
    }

    if (this.route.snapshot.data.action === 'update') {
      if (this.order) {
        if (this.order.orderType) { return this.order.orderType; }
      }
      return null;
    }
    if (!this.route.snapshot.data.mode) {
      throw Error('No stock order mode set');
    }
    return this.route.snapshot.data.mode as StockOrderType;
  }

  get orderTypeOptions() {

    const obj = {};
    obj['GENERAL_ORDER'] = $localize`:@@orderType.codebook.generalOrder:General order`;
    obj['PROCESSING_ORDER'] = $localize`:@@orderType.codebook.processingOrder:Processing order`;
    obj['PURCHASE_ORDER'] = $localize`:@@orderType.codebook.purchaseOrder:Purchase order`;
    obj['SALES_ORDER'] = $localize`:@@orderType.codebook.salesOrder:Sales order`;
    return obj;
  }

  get preferredWayOfPaymentList() {

    const obj = {};
    obj['CASH_VIA_COOPERATIVE'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cashViaCooperative:Cash via cooperative`;

    if (this.stockOrderForm &&
      this.stockOrderForm.get('representativeOfProducerUserCustomerId') &&
      this.stockOrderForm.get('representativeOfProducerUserCustomerId').value) {

      obj['CASH_VIA_COLLECTOR'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cashViaCollector:Cash via collector`;
    }

    if (this.stockOrderForm &&
      this.stockOrderForm.get('producerUserCustomerId') &&
      this.stockOrderForm.get('producerUserCustomerId').value &&
      this.stockOrderForm.get('representativeOfProducerUserCustomerId') &&
      !this.stockOrderForm.get('representativeOfProducerUserCustomerId').value) {

      obj['UNKNOWN'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.unknown:Unknown`;
    }

    obj['BANK_TRANSFER'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.bankTransfer:Bank transfer`;
    return obj;
  }

  get quantityLabel() {
    if (this.orderType === 'PURCHASE_ORDER') {
      return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.quantityDelieveredInKG.label:Quantity (kg)`;
    } else {
      return $localize`:@@productLabelStockPurchaseOrdersModal.textinput.quantity.label:Quantity (units)`;
    }
  }

  get womenCoffeeList() {
    const obj = {};
    obj['YES'] = $localize`:@@productLabelStockPurchaseOrdersModal.womensCoffeeList.yes:Yes`;
    obj['NO'] = $localize`:@@productLabelStockPurchaseOrdersModal.womensCoffeeList.no:No`;
    return obj;
  }

  ngOnInit(): void {
  }

  onSelectedType(type: StockOrderType) {
    switch (type as StockOrderType) {
      case 'PURCHASE_ORDER':
        this.stockOrderForm.get('orderType').setValue(type);
        return;
      case 'GENERAL_ORDER':
        // this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'general-order', 'update', this.purchaseOrderId]);
        return;
      case 'PROCESSING_ORDER':
        // this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'processing-order', 'update', this.purchaseOrderId]);
        return;
      case 'SALES_ORDER':
        // this.router.navigate(['product-labels', this.productId, 'stock', 'stock-orders', 'sales-order', 'update', this.purchaseOrderId]);
        return;
      default:
        throw Error('Wrong order type: ' + type);
    }
  }

  setFarmer(event: ChainUserCustomer) {

    if (event) {
      this.stockOrderForm.get('producerUserCustomerId').setValue(dbKey(event));
    } else {
      this.stockOrderForm.get('producerUserCustomerId').setValue(null);
    }

    this.stockOrderForm.get('producerUserCustomerId').markAsDirty();
    this.stockOrderForm.get('producerUserCustomerId').updateValueAndValidity();
    this.codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList);
  }

  setCollector(event: ChainUserCustomer) {

    if (event) {
      this.stockOrderForm.get('representativeOfProducerUserCustomerId').setValue(dbKey(event));
      if (this.stockOrderForm.get('preferredWayOfPayment') && this.stockOrderForm.get('preferredWayOfPayment').value === 'UNKNOWN') {
        this.stockOrderForm.get('preferredWayOfPayment').setValue(null);
      }
    } else {
      this.stockOrderForm.get('representativeOfProducerUserCustomerId').setValue(null);
      if (this.stockOrderForm.get('preferredWayOfPayment') && this.stockOrderForm.get('preferredWayOfPayment').value === 'CASH_VIA_COLLECTOR') {
        this.stockOrderForm.get('preferredWayOfPayment').setValue(null);
      }
    }

    this.stockOrderForm.get('representativeOfProducerUserCustomerId').markAsDirty();
    this.stockOrderForm.get('representativeOfProducerUserCustomerId').updateValueAndValidity();
    this.codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList);
  }

  semiProductSelected(id: string) {

    if (id) {
      this.stockOrderForm.get('semiProductId').setValue(id);
    } else {
      this.stockOrderForm.get('semiProductId').setValue(null);
    }

    this.stockOrderForm.get('semiProductId').markAsDirty();
    this.stockOrderForm.get('semiProductId').updateValueAndValidity();
  }

  setToBePaid() {

    if (this.stockOrderForm && this.stockOrderForm.get('totalQuantity').value &&
      this.stockOrderForm.get('pricePerUnit').value) {

      this.stockOrderForm.get('cost').setValue(this.stockOrderForm.get('totalQuantity').value * this.stockOrderForm.get('pricePerUnit').value);
    } else {

      this.stockOrderForm.get('cost').setValue(null);
    }
  }

  setBalance() {

    if (this.stockOrderForm && this.stockOrderForm.get('cost').value) {
      if (!this.update) {
        this.stockOrderForm.get('balance').setValue(this.stockOrderForm.get('cost').value);
      }
    } else {

      this.stockOrderForm.get('balance').setValue(null);
    }
  }

}
