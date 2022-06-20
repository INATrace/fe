import { Component, OnInit } from '@angular/core';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { StockOrderControllerService } from '../../../../../api/api/stockOrderController.service';
import { PaymentControllerService } from '../../../../../api/api/paymentController.service';
import { ApiPayment } from '../../../../../api/model/apiPayment';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';
import { CompanyUserCustomersByRoleService } from '../../../../shared-services/company-user-customers-by-role.service';
import { dateAtMidnightISOString, dateAtNoonISOString, generateFormFromMetadata } from '../../../../../shared/utils';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiPaymentValidationScheme } from '../validation';
import { Location } from '@angular/common';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { ModeEnum } from '../stock-payments-form/stock-payments-form.component';
import { ApiUserCustomerCooperative } from '../../../../../api/model/apiUserCustomerCooperative';
import PaymentStatusEnum = ApiPayment.PaymentStatusEnum;
import RecipientTypeEnum = ApiPayment.RecipientTypeEnum;
import UserCustomerTypeEnum = ApiUserCustomerCooperative.UserCustomerTypeEnum;
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stock-payments-detail',
  templateUrl: './stock-payments-detail.component.html',
  styleUrls: ['./stock-payments-detail.component.scss']
})
export class StockPaymentsDetailComponent implements OnInit {

  mode = ModeEnum.PURCHASE;

  update: boolean;
  title: string;

  lastUpdatedByUser: string;
  companyId: number;

  purchaseOrderId: number;
  customerOrderId: number;

  submitted: boolean;
  paymentUpdateInProgress: boolean;

  stockOrder: ApiStockOrder;
  payment: ApiPayment;

  farmersCodebook: CompanyUserCustomersByRoleService;
  collectorsCodebook: CompanyUserCustomersByRoleService;

  paymentForm: FormGroup;

  searchFarmersForm = new FormControl(null);
  searchCollectorsForm = new FormControl(null);
  searchCompaniesForm = new FormControl(null);

  payableFromForm = new FormControl(null);
  orderReferenceForm = new FormControl(null);

  private addPricePerUnitMessage: string = $localize`:@@productLabelStockPayments.addPricePerUnit.message:Add price per unit`;

  constructor(
      private location: Location,
      private route: ActivatedRoute,
      private globalEventsManager: GlobalEventManagerService,
      private companyControllerService: CompanyControllerService,
      private stockOrderControllerService: StockOrderControllerService,
      private paymentControllerService: PaymentControllerService,
      private toasterService: ToastrService,
      private router: Router
  ) { }

  ngOnInit(): void {

    this.purchaseOrderId = this.route.snapshot.params.purchaseOrderId;
    this.customerOrderId = this.route.snapshot.params.customerOrderId;

    this.paymentUpdateInProgress = false;

    this.initInitialData().then(
        () => {
          this.farmersCodebook = new CompanyUserCustomersByRoleService(
              this.companyControllerService,
              this.companyId,
              UserCustomerTypeEnum.FARMER
          );

          this.collectorsCodebook = new CompanyUserCustomersByRoleService(
              this.companyControllerService,
              this.companyId,
              UserCustomerTypeEnum.COLLECTOR
          );

          if (this.update) {
            this.editPayment().then();
          } else {
            this.newPayment().then();
          }
        }
    );
  }

  async initInitialData() {

    const action = this.route.snapshot.data.action;
    const type = this.route.snapshot.params.type;

    if (this.customerOrderId || type === ModeEnum.CUSTOMER) {
      this.mode = ModeEnum.CUSTOMER;
    }

    if (action === 'new') {

      this.update = false;
      this.title = $localize`:@@productLabelStockPayments.newTitle:New payment`;

      // Fetch StockOrder
      const stockOrderId = this.purchaseOrderId ? this.purchaseOrderId : this.customerOrderId;
      const stockOrderResp = await this.stockOrderControllerService.getStockOrderUsingGET(stockOrderId)
          .pipe(take(1))
          .toPromise();

      if (stockOrderResp && stockOrderResp.status === 'OK' && stockOrderResp.data && stockOrderResp.data) {
        this.stockOrder = stockOrderResp.data;
      }

    } else if (action === 'update') {

      this.update = true;
      this.title = $localize`:@@productLabelStockPayments.updateTitle:Update payment`;

      // Fetch Payment
      const paymentId = this.route.snapshot.params.paymentId;
      const paymentResp = await this.paymentControllerService.getPaymentUsingGET(paymentId)
          .pipe(take(1))
          .toPromise();

      // Fetch Payment and StockOrder from received Payment
      if (paymentResp && paymentResp.status === 'OK' && paymentResp.data) {
        this.payment = paymentResp.data;
        this.stockOrder = this.payment.stockOrder;
      }

    } else {
      throw Error('Unrecognized action "' + action + '".');
    }

    this.companyId = Number(localStorage.getItem('selectedUserCompany'));
  }

  private async newPayment() {

    if (this.stockOrder.priceDeterminedLater) {
      this.toasterService.error(this.addPricePerUnitMessage);
      this.router.navigate(['my-stock', 'purchases', 'tab']).then();
    }

    this.submitted = false;

    this.paymentForm = generateFormFromMetadata(ApiPayment.formMetadata(), {}, ApiPaymentValidationScheme);

    // Formal creation time
    const today = dateAtMidnightISOString(new Date().toDateString());
    this.paymentForm.get('formalCreationTime').setValue(today);

    // If we are in purchase mode (purchase order from a farmer), set the currency of the payment to be the currency of the stock order
    if (this.mode === ModeEnum.PURCHASE) {
      this.paymentForm.get('currency').setValue(this.stockOrder.currency);
    }

    this.paymentForm.get('paymentStatus').setValue(PaymentStatusEnum.UNCONFIRMED);
    this.paymentForm.get('stockOrder').setValue(this.stockOrder);

    // Set purchase order (identifier/LOT)
    this.orderReferenceForm.setValue(this.mode === ModeEnum.PURCHASE
        ? this.stockOrder.identifier
        : this.stockOrder.internalLotNumber);

    // Collector
    if (this.stockOrder.representativeOfProducerUserCustomer) {
      this.searchCollectorsForm.setValue(this.stockOrder.representativeOfProducerUserCustomer);
      this.paymentForm.get('representativeOfRecipientUserCustomer').setValue(this.stockOrder.representativeOfProducerUserCustomer);
    }

    // Farmer
    if (this.stockOrder.producerUserCustomer) {
      this.searchFarmersForm.setValue(this.stockOrder.producerUserCustomer);
      this.paymentForm.get('recipientUserCustomer').setValue(this.stockOrder.producerUserCustomer);
    }

    // Set the recipient company
    if (this.stockOrder.quoteCompany) {
      this.searchCompaniesForm.setValue(this.stockOrder.quoteCompany);
      this.paymentForm.get('recipientCompany').setValue(this.stockOrder.quoteCompany);
    }

    // Paying company (a company which has created the stock order (Purchase or Quote) should be paying for it)
    this.payableFromForm.setValue(this.stockOrder.company?.name);
    this.paymentForm.get('payingCompany').setValue(this.stockOrder.company);
  }

  private async editPayment() {

    this.paymentForm = generateFormFromMetadata(ApiPayment.formMetadata(), this.payment, ApiPaymentValidationScheme);

    this.searchCompaniesForm.setValue(this.paymentForm.get('recipientCompany').value);
    this.searchCollectorsForm.setValue(this.paymentForm.get('representativeOfRecipientUserCustomer').value);
    this.searchFarmersForm.setValue(this.paymentForm.get('recipientUserCustomer').value);

    this.payableFromForm.setValue(this.payment.payingCompany?.name);

    this.orderReferenceForm.setValue(this.mode === ModeEnum.PURCHASE
        ? this.stockOrder.identifier
        : this.stockOrder.internalLotNumber);

    if (this.payment.updatedBy) {
      this.lastUpdatedByUser = this.payment.updatedBy.name + ' ' + this.payment.updatedBy.surname;
    }
  }

  async updatePayment() {

    if (this.paymentUpdateInProgress) {
      return;
    }

    this.paymentUpdateInProgress = true;
    this.globalEventsManager.showLoading(true);

    // Set recipientType
    if (this.paymentForm.get('recipientCompany').value?.id) {

      this.paymentForm.get('recipientType').setValue(RecipientTypeEnum.COMPANY);

    } else if (this.paymentForm.get('recipientUserCustomer').value?.id) {

      this.paymentForm.get('recipientType').setValue(RecipientTypeEnum.USERCUSTOMER);

    } else {
      this.paymentForm.get('recipientType').setValue(null);
    }

    this.submitted = true;
    if (this.paymentForm.invalid) {
      this.paymentUpdateInProgress = false;
      this.globalEventsManager.showLoading(false);
      return;
    }

    const formalCreationTime = this.paymentForm.get('formalCreationTime').value;
    if (formalCreationTime) {
      this.paymentForm.get('formalCreationTime').setValue(dateAtNoonISOString(formalCreationTime));
    }

    try {

      const paymentResp = await this.paymentControllerService.createOrUpdatePaymentUsingPUT(this.paymentForm.getRawValue())
        .pipe(take(1))
        .toPromise();

      if (paymentResp && paymentResp.status === 'OK') {
        this.dismiss();
      }

    } finally {
      this.paymentUpdateInProgress = false;
      this.globalEventsManager.showLoading(false);
    }
  }

  get modeEnum(): typeof ModeEnum{
    return ModeEnum;
  }

  dismiss() {
    this.location.back();
  }

}
