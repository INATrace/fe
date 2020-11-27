import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { UserCustomerService } from 'src/api-chain/api/userCustomer.service';
import { ActiveUserCustomersByOrganizationAndRoleService } from 'src/app/shared-services/active-user-customers-by-organization-and-role.service';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { StockOrdersForOrganizationStandalone } from 'src/app/shared-services/stock-orders-for-organization-standalone';
import { dbKey } from 'src/shared/utils';

@Component({
  selector: 'app-facility-stock-order-selector-for-new-payment-modal',
  templateUrl: './facility-stock-order-selector-for-new-payment-modal.component.html',
  styleUrls: ['./facility-stock-order-selector-for-new-payment-modal.component.scss']
})
export class FacilityStockOrderSelectorForNewPaymentModalComponent implements OnInit {

  @Input()
  dismissable = true;
  @Input()
  organizationId;
  title = $localize`:@@facilityStockOrderPaymentModal.title:Select farmer and purchase order`;

  farmerForStockOrderForm = new FormControl(null);
  womenCoffeeForm = new FormControl(null);
  stockOrderForPaymentForm = new FormControl(null);
  purchaseOrderId;
  purchaseOrdersForPaymentsCodebook: StockOrdersForOrganizationStandalone = null;
  farmersCodebook: ActiveUserCustomersByOrganizationAndRoleService = null;
  currentFarmerId = null;

  get womenShareTypes() {
    let obj = {}
    obj[1] = $localize`:@@facilityStockOrderPaymentModal.womenShareTypes.yes:YES`;
    obj[0] = $localize`:@@facilityStockOrderPaymentModal.womenShareTypes.no:NO`;
    return obj;
  }
  womenShareCodebook = EnumSifrant.fromObject(this.womenShareTypes);

  constructor(
    public activeModal: NgbActiveModal,
    private chainStockOrderService: StockOrderService,
    private chainUserCustomerService: UserCustomerService
  ) { }

  ngOnInit(): void {
    this.farmersCodebook = new ActiveUserCustomersByOrganizationAndRoleService(this.chainUserCustomerService, this.organizationId, 'FARMER');
  }

  cancel() {
    this.activeModal.close()
  }

  onConfirm() {
    if (this.stockOrderForPaymentForm.value) {
      this.activeModal.close(this.stockOrderForPaymentForm.value)
    }
  }

  farmersChanged(event) {
    if(event) {
      this.currentFarmerId = dbKey(event);
      this.purchaseOrdersForPaymentsCodebook = new StockOrdersForOrganizationStandalone(this.chainStockOrderService, true, true, this.organizationId, this.currentFarmerId, this.womenCoffeeForm ? this.womenCoffeeForm.value : null);
    } else {
      this.currentFarmerId = null;
      this.purchaseOrderId = null;
      this.womenCoffeeForm.setValue(null)
    }
  }

  womenCoffeeChanged(event) {
    this.purchaseOrderId = null;
    this.purchaseOrdersForPaymentsCodebook = new StockOrdersForOrganizationStandalone(this.chainStockOrderService, true, true, this.organizationId, this.currentFarmerId, this.womenCoffeeForm ? this.womenCoffeeForm.value : null);
  }

  purchaseOrderForPaymentChanged(event) {
    if (event) this.purchaseOrderId = dbKey(event);
    else this.purchaseOrderId = null;
  }

}
