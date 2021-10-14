import { Component, OnInit } from '@angular/core';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { StockOrderControllerService } from '../../../../../api/api/stockOrderController.service';
import { PaymentControllerService } from '../../../../../api/api/paymentController.service';
import { ApiPayment } from '../../../../../api/model/apiPayment';
import { ApiProduct } from '../../../../../api/model/apiProduct';
import { ActivateUserCustomerByCompanyAndRoleService } from '../../../../shared-services/activate-user-customer-by-company-and-role.service';
import { UserCustomerControllerService } from '../../../../../api/api/userCustomerController.service';
import { dateAtMidnightISOString, dateAtNoonISOString, generateFormFromMetadata } from '../../../../../shared/utils';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiPaymentValidationScheme } from '../validation';
import { Location } from '@angular/common';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { ModeEnum } from '../stock-payments-form/stock-payments-form.component';
import PaymentStatusEnum = ApiPayment.PaymentStatusEnum;
import RecipientTypeEnum = ApiPayment.RecipientTypeEnum;

@Component({
  selector: 'app-stock-payments-detail',
  templateUrl: './stock-payments-detail.component.html',
  styleUrls: ['./stock-payments-detail.component.scss']
})
export class StockPaymentsDetailComponent implements OnInit {

  mode = ModeEnum.PURCHASE;

  update: boolean;
  title: string;

  companyId: number;
  userCompanyId: number;
  purchaseOrderId: number;
  customerOrderId: number;
  productId: number;
  stockOrderId: number;
  isOwner: boolean;
  submitted: boolean;
  paymentUpdateInProgress: boolean;

  stockOrder: ApiStockOrder;
  payment: ApiPayment;
  product: ApiProduct;

  farmersCodebook: ActivateUserCustomerByCompanyAndRoleService;
  collectorsCodebook: ActivateUserCustomerByCompanyAndRoleService;

  paymentForm: FormGroup;
  searchFarmersForm = new FormControl(null);
  searchCollectorsForm = new FormControl(null);
  searchCompaniesForm = new FormControl(null);
  payableFromForm = new FormControl(null);
  orderReferenceForm = new FormControl(null);

  constructor(
      private location: Location,
      private route: ActivatedRoute,
      private globalEventsManager: GlobalEventManagerService,
      private userCustomerControllerService: UserCustomerControllerService,
      private stockOrderControllerService: StockOrderControllerService,
      private paymentControllerService: PaymentControllerService
  ) { }

  ngOnInit(): void {

    this.purchaseOrderId = this.route.snapshot.params.purchaseOrderId;
    this.customerOrderId = this.route.snapshot.params.customerOrderId;

    this.paymentUpdateInProgress = false;

    this.initInitialData().then(
        () => {
          this.farmersCodebook = new ActivateUserCustomerByCompanyAndRoleService(this.userCustomerControllerService, this.companyId, 'FARMER');
          this.collectorsCodebook = new ActivateUserCustomerByCompanyAndRoleService(this.userCustomerControllerService, this.companyId, 'COLLECTOR');
          if (this.update) {
            // this.editPayment();
          } else {
            this.newPayment().then();
          }
        }
    );
  }

  async initInitialData() {

    const action = this.route.snapshot.data.action;
    const type = this.route.snapshot.params.type;

    if (this.customerOrderId || type === ModeEnum.PURCHASE) {
      this.mode = ModeEnum.CUSTOMER;
    }

    // Standalone on route
    this.productId = this.route.snapshot.params.id;

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

      // Fetch StockOrder from received Payment
      if (paymentResp && paymentResp.status === 'OK' && paymentResp.data) {
        this.payment = paymentResp.data;
        this.stockOrder = this.payment.stockOrder;
      }

    } else {
      throw Error('Unrecognized action "' + action + '".');
    }

    // Fetch product
    // const productResp = await this.productControllerService.getProductUsingGET(this.productId)
    //     .pipe(take(1))
    //     .toPromise();
    //
    // if (productResp && productResp.status === 'OK' && productResp.data && productResp.data.id) {
    //   this.product = productResp.data;
    //   this.companyId = productResp.data.company.id;
    // }

    // Check if current user is owner.
    // Owner is if product's company ID matches user's company ID
    this.userCompanyId = Number(localStorage.getItem('selectedUserCompany'));
    this.companyId = this.userCompanyId; // TODO: Temporary (company ID should be fetched from Product)
    this.isOwner = this.userCompanyId
        ? this.companyId === this.userCompanyId
        : false;
  }

  async newPayment() {
    this.submitted = false;

    this.paymentForm = generateFormFromMetadata(ApiPayment.formMetadata(), {}, ApiPaymentValidationScheme);

    // Formal creation time
    const today = dateAtMidnightISOString(new Date().toDateString());
    this.paymentForm.get('formalCreationTime').setValue(today);

    // TODO: This seems a bit sketchy, don't you think?
    if (this.mode === ModeEnum.PURCHASE) {
      if (!this.paymentForm.get('currency').value) {
        this.paymentForm.get('currency').setValue('RWF');
      }
    }

    this.paymentForm.get('paymentStatus').setValue(PaymentStatusEnum.UNCONFIRMED);
    this.paymentForm.get('stockOrder').setValue(this.stockOrder);

    // Set purchase order (identifier/LOT)
    this.orderReferenceForm.setValue(this.mode === ModeEnum.PURCHASE ? this.stockOrder.identifier : this.stockOrder.internalLotNumber);

    // Collector
    if (this.stockOrder.representativeOfProducerUserCustomer) {
      this.searchCollectorsForm.setValue(this.stockOrder.representativeOfProducerUserCustomer);
    }

    // Farmer
    if (this.stockOrder.producerUserCustomer) {
      this.searchFarmersForm.setValue(this.stockOrder.producerUserCustomer);
      this.paymentForm.get('recipientUserCustomer').setValue(this.stockOrder.producerUserCustomer);
    }

    // Paying company (a company which has created a purchase (StockOrder) should be paying for it)
    this.payableFromForm.setValue(this.stockOrder.company?.name);
    this.paymentForm.get('payingCompany').setValue(this.stockOrder.company);
  }

  async updatePayment() {

    if (this.paymentUpdateInProgress) {
      return;
    }

    this.paymentUpdateInProgress = true;
    this.globalEventsManager.showLoading(true);

    // Set recipientType
    if (this.paymentForm.get('recipientCompany').value?.id) {
      this.paymentForm.get('recipientType').setValue(RecipientTypeEnum.ORGANIZATION);

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

    // let data = this.paymentForm.value;
    // Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

    //
    // if (this.update && this.authService.currentUserProfile) {
    //   let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
    //   if (res && res.status === "OK" && res.data) data.userChangedId = dbKey(res.data);
    // } else if (this.authService.currentUserProfile) {
    //   let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
    //   if (res && res.status === "OK" && res.data) data.userCreatedId = dbKey(res.data);
    // }

    try {
      const paymentResp = await this.paymentControllerService.createOrUpdatePaymentUsingPUT(this.paymentForm.value)
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
