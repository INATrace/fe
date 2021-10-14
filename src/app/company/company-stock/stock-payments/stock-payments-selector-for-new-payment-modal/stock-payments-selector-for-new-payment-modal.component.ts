import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EnumSifrant } from '../../../../shared-services/enum-sifrant';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StockOrderControllerService } from '../../../../../api/api/stockOrderController.service';
import { UserCustomerControllerService } from '../../../../../api/api/userCustomerController.service';
import { ActivateUserCustomerByCompanyAndRoleService } from '../../../../shared-services/activate-user-customer-by-company-and-role.service';
import { StockOrdersForCompanyService } from '../../../../shared-services/stock-orders-for-company.service';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import OrderTypeEnum = ApiStockOrder.OrderTypeEnum;

@Component({
  selector: 'app-stock-payments-selector-for-new-payment-modal',
  templateUrl: './stock-payments-selector-for-new-payment-modal.component.html',
  styleUrls: ['./stock-payments-selector-for-new-payment-modal.component.scss']
})
export class StockPaymentsSelectorForNewPaymentModalComponent implements OnInit {

  @Input()
  dismissible = true;
  @Input()
  companyId;
  title = $localize`:@@facilityStockOrderPaymentModal.title:Select farmer and purchase order`;

  purchaseOrdersForPaymentsCodebook: StockOrdersForCompanyService;
  farmersCodebook: ActivateUserCustomerByCompanyAndRoleService;
  womenShareCodebook = EnumSifrant.fromObject(this.womenShareTypes);

  farmerForm = new FormControl(null);
  womenCoffeeOnlyForm = new FormControl(null);
  stockOrderForPaymentForm = new FormControl(null);

  purchaseOrderId = null;
  currentFarmerId = null;

  constructor(
      public activeModal: NgbActiveModal,
      private stockOrderControllerService: StockOrderControllerService,
      private userCustomerControllerService: UserCustomerControllerService // TODO: Implement on BE
  ) { }

  ngOnInit(): void {
    this.farmersCodebook = new ActivateUserCustomerByCompanyAndRoleService(this.userCustomerControllerService, this.companyId, 'FARMER');
  }

  farmersChanged(event) {
    if (event) {
      this.currentFarmerId = event.id;
      this.purchaseOrdersForPaymentsCodebook = new StockOrdersForCompanyService(
          this.stockOrderControllerService,
          this.companyId,
          this.currentFarmerId,
          true,
          this.womenCoffeeOnlyForm ? this.womenCoffeeOnlyForm.value : null,
          null,
          OrderTypeEnum.PURCHASEORDER,
          null,
          null,
          null
      );
    } else {
      this.currentFarmerId = null;
      this.purchaseOrderId = null;
      this.womenCoffeeOnlyForm.setValue(null);
    }
    this.stockOrderForPaymentForm.setValue(null);
  }

  womenCoffeeChanged(event) {
    this.purchaseOrderId = null;
    this.stockOrderForPaymentForm.setValue(null);
    this.purchaseOrdersForPaymentsCodebook = new StockOrdersForCompanyService(
        this.stockOrderControllerService,
        this.companyId,
        this.currentFarmerId,
        true,
        this.womenCoffeeOnlyForm ? this.womenCoffeeOnlyForm.value : null,
        null,
        OrderTypeEnum.PURCHASEORDER,
        null,
        null,
        null
    );

  }

  purchaseOrderForPaymentChanged(event) {
    this.purchaseOrderId = (event) ? event.id : null;
  }

  get womenShareTypes() {
    const obj = {};
    obj[0] = $localize`:@@facilityStockOrderPaymentModal.womenShareTypes.no:NO`;
    obj[1] = $localize`:@@facilityStockOrderPaymentModal.womenShareTypes.yes:YES`;
    return obj;
  }

  onConfirm() {
    if (this.stockOrderForPaymentForm.value) {
      this.activeModal.close(this.stockOrderForPaymentForm.value);
    }
  }

  cancel() {
    this.activeModal.close();
  }

}
