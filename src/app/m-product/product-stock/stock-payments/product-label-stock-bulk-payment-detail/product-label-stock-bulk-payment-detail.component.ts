import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import _ from 'lodash-es';
import { of, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { PaymentsService } from 'src/api-chain/api/payments.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { UserService } from 'src/api-chain/api/user.service';
import { UserCustomerService } from 'src/api-chain/api/userCustomer.service';
import { ChainActivityProof } from 'src/api-chain/model/chainActivityProof';
import { ChainBulkPayment } from 'src/api-chain/model/chainBulkPayment';
import { ChainPayment } from 'src/api-chain/model/chainPayment';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { ListEditorManager } from 'src/app/shared/list-editor/list-editor-manager';
import { AuthService } from 'src/app/core/auth.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { environment } from 'src/environments/environment';
import { dateAtMidnightISOString, dateAtNoonISOString, dbKey, defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ApiActivityProofValidationScheme } from '../../../../company/company-stock/stock-core/additional-proof-item/validation';
import { StockPurchaseOrderEditComponent } from '../../stock-core/stock-purchase-order-edit/stock-purchase-order-edit.component';
import { ChainPaymentValidationScheme } from '../product-label-stock-payment-detail/validation';
import { ChainBulkPaymentValidationScheme } from './validation';

@Component({
  selector: 'app-product-label-stock-bulk-payment-detail',
  templateUrl: './product-label-stock-bulk-payment-detail.component.html',
  styleUrls: ['./product-label-stock-bulk-payment-detail.component.scss']
})
export class ProductLabelStockBulkPaymentDetailComponent implements OnInit {

  chainRootUrl: string = environment.chainRelativeFileUploadUrl;
  chainDownloadRootUrl: string = environment.chainRelativeFileDownloadUrl;

  faTrashAlt = faTrashAlt;

  update: Boolean = true;
  title: String = null;
  submitted: boolean = false;
  userOrgId;
  payableFromForm = new FormControl(null);
  owner: boolean = true;
  productId;
  bulkPaymentForm: FormGroup;

  organizationId;
  chainProduct;
  additionalProofsListManager = null;
  paymentsListManager = null;
  additionalProofsForm: any;
  subConditional: Subscription;
  payment;
  userLastChanged;
  paymentsForm;

  balanceSeasonalForm = new FormControl(null);
  totalPurchasedKgForm = new FormControl(null);

  bulkType = this.route.snapshot.params.bulkType;

  payableToCompany = new FormControl(null);
  payableToFarmer = new FormControl($localize`:@@productLabelStockBulkPayments.payableTo.multiple:Multiple`);
  payableToCollector = new FormControl(this.bulkType === 'PO' ? $localize`:@@productLabelStockBulkPayments.payableTo.multiple:Multiple` : null);

  updateBulkInProgress: boolean = false;

  constructor(
    private location: Location,
    private globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private chainPaymentsService: PaymentsService,
    private chainProductService: ProductService,
    private stockOrderService: StockOrderService,
    private chainUserCustomerService: UserCustomerService,
    private chainOrganizationService: OrganizationService,
    private chainUserService: UserService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initInitialData().then(
      (resp: any) => {
        if (this.update) {
          this.editBulkPayment();
        } else {
          this.newBulkPayment();
        }
      }
    )
  }

  ngOnDestroy() {
    if (this.subConditional) this.subConditional.unsubscribe();
  }

  async initInitialData() {
    this.paymentsForm = new FormArray([]);
    let action = this.route.snapshot.data.action
    if (!action) return;
    // standalone on route
    this.productId = this.route.snapshot.params.id

    if (action === 'new') {
      this.update = false;
      this.title = $localize`:@@productLabelStockBulkPayments.newTitle:New bulk payment`;

      // let purchaseOrderId = this.route.snapshot.params.purchaseOrderId;
      // let resp = await this.stockOrderService.getStockOrderById(purchaseOrderId).pipe(take(1)).toPromise();
      // if (resp && resp.status === "OK" && resp.data && resp.data) {
      //   this.purchaseOrder = resp.data;
      // }
    } else if (action == 'update') {
      this.title = $localize`:@@productLabelStockBulkPayments.updateTitle:Update bulk payment`;
      this.update = true;

      let resp = await this.chainPaymentsService.getBulkPayment(this.route.snapshot.params.bulkPaymentId).pipe(take(1)).toPromise()
      if (resp && resp.status === 'OK' && resp.data) {
        this.payment = resp.data;
        this.preparePaymentsForEdit();
      }
    } else {
      throw Error("Wrong action.")
    }

    let res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    if (res && res.status === "OK" && res.data && dbKey(res.data)) {
      this.chainProduct = res.data;
      this.organizationId = dbKey(res.data.organization);
    }

    this.userOrgId = localStorage.getItem("selectedUserCompany");
    if (this.userOrgId) {
      this.owner = (this.organizationId == this.userOrgId);
    }

  }

  newBulkPayment() {
    this.bulkPaymentForm = generateFormFromMetadata(ChainBulkPayment.formMetadata(), {}, ChainBulkPaymentValidationScheme)
    this.setDateAndOtherFiedlsThatCanBeFilled();
    this.conditionalValidators();
    this.initializeListManager();
    this.initPOs();
    if (this.bulkType === "BONUS") {
      this.bulkPaymentForm.get('paymentPurposeType').setValue('SECOND_INSTALLMENT');
    }
  }

  editBulkPayment() {
    this.bulkPaymentForm = generateFormFromMetadata(ChainBulkPayment.formMetadata(), this.payment, ChainBulkPaymentValidationScheme)
    this.conditionalValidators();
    this.initializeListManager();
    this.initPayments();
    this.bulkPaymentForm.get('paymentPurposeType').disable();
  }

  async initPayments() {
    let resOrg = await this.chainOrganizationService.getOrganization(this.payment.payingOrganizationId).pipe(take(1)).toPromise();
    if (resOrg && resOrg.status === 'OK' && resOrg.data) {
      this.payableFromForm.setValue(resOrg.data.name)
    }

    if (this.payment.userChangedId) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) this.userLastChanged = res.data.name + " " + res.data.surname;
    } else if (this.payment.userCreatedId) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) this.userLastChanged = res.data.name + " " + res.data.surname;
    }
  }

  async initPOs() {
    if (this.bulkType === 'PO') {
      let POIds = this.route.snapshot.params.purchaseOrderIds.split(',');

      for (let po of POIds) {
        let res = await this.stockOrderService.getStockOrderById(po).pipe(take(1)).toPromise();
        if (res && res.status === 'OK' && res.data) {

          if (res.data.preferredWayOfPayment === 'CASH_VIA_COLLECTOR' && res.data.representativeOfProducerUserCustomerId) {
            let resUserBank = await this.chainUserCustomerService.getUserCustomer(res.data.representativeOfProducerUserCustomerId).pipe(take(1)).toPromise();
            if (resUserBank && resUserBank.status === 'OK' && resUserBank.data) {
              if (resUserBank.data.bankAccountInfo == null || (resUserBank.data.bankAccountInfo && !resUserBank.data.bankAccountInfo.accountNumber)) {
                this.purchaseItemsNoBankAccount.push(new FormGroup({
                  _id: new FormControl(dbKey(res.data)),
                  name: new FormControl(res.data.identifier),
                  recipientName: new FormControl(resUserBank.data.name),
                  recipientSurname: new FormControl(resUserBank.data.surname),
                  productId: new FormControl(resUserBank.data.productId),
                  recipientId: new FormControl(resUserBank.data._id),
                  preferredWayOfPayment: new FormControl(res.data.preferredWayOfPayment)
                }, { validators: this.payingEqualOrLessThanBalance }))
              } else {
                this.purchaseItems.push(new FormGroup({
                  _id: new FormControl(dbKey(res.data)),
                  recipientUserCustomerId: new FormControl(res.data.producerUserCustomerId),
                  representativeOfRecipientUserCustomerId: new FormControl(res.data.representativeOfProducerUserCustomerId),
                  name: new FormControl(res.data.identifier),
                  amount: new FormControl(res.data.cost),
                  balance: new FormControl(res.data.balance),
                  paying: new FormControl(res.data.balance),
                  preferredWayOfPayment: new FormControl(res.data.preferredWayOfPayment)
                }, { validators: this.payingEqualOrLessThanBalance }))
              }
            }
          } else {

            let resUserBank = await this.chainUserCustomerService.getUserCustomer(res.data.producerUserCustomerId).pipe(take(1)).toPromise();
            if (resUserBank && resUserBank.status === 'OK' && resUserBank.data) {
              if (resUserBank.data.bankAccountInfo == null || (resUserBank.data.bankAccountInfo && !resUserBank.data.bankAccountInfo.accountNumber)) {
                this.purchaseItemsNoBankAccount.push(new FormGroup({
                  _id: new FormControl(dbKey(res.data)),
                  name: new FormControl(res.data.identifier),
                  recipientName: new FormControl(resUserBank.data.name),
                  recipientSurname: new FormControl(resUserBank.data.surname),
                  productId: new FormControl(resUserBank.data.productId),
                  recipientId: new FormControl(resUserBank.data._id),
                  preferredWayOfPayment: new FormControl(res.data.preferredWayOfPayment)
                }, { validators: this.payingEqualOrLessThanBalance }))
              } else {
                this.purchaseItems.push(new FormGroup({
                  _id: new FormControl(dbKey(res.data)),
                  recipientUserCustomerId: new FormControl(res.data.producerUserCustomerId),
                  representativeOfRecipientUserCustomerId: new FormControl(res.data.representativeOfProducerUserCustomerId),
                  name: new FormControl(res.data.identifier),
                  amount: new FormControl(res.data.cost),
                  balance: new FormControl(res.data.balance),
                  paying: new FormControl(res.data.balance),
                  preferredWayOfPayment: new FormControl(res.data.preferredWayOfPayment)
                }, { validators: this.payingEqualOrLessThanBalance }))
              }
            }

          }

        }
      }
    }
    if (this.bulkType === 'BONUS') {
      let POIds = this.route.snapshot.params.purchaseOrderIds.split(',');
      let checkedStockOrderList: string[] = [];
      let sumPurchased = 0;
      for (let po of POIds) {

        let resOrder = await this.stockOrderService.getAggregatesForStockOrder(po).pipe(take(1)).toPromise();
        if (resOrder && resOrder.status === 'OK' && resOrder.data) {
          const order = resOrder.data[0];
          let orderName = order.stockOrderAggs[0].stockOrder.internalLotNumber;
          let orderId = order.stockOrderAggs[0].stockOrder._id;
          const len = resOrder.data.length;
          for (const so of resOrder.data[len - 1].stockOrderAggs) {
            if (so.stockOrder.orderType != "PURCHASE_ORDER") continue;
            if (checkedStockOrderList.includes(so.stockOrder._id)) continue;
            checkedStockOrderList.push(so.stockOrder._id)
            let resUserBank = await this.chainUserCustomerService.getUserCustomer(so.stockOrder.producerUserCustomerId).pipe(take(1)).toPromise();
            if (resUserBank && resUserBank.status === 'OK' && resUserBank.data) {
              if (resUserBank.data.bankAccountInfo == null || (resUserBank.data.bankAccountInfo && !resUserBank.data.bankAccountInfo.accountNumber)) {
                this.purchaseItemsNoBankAccount.push(new FormGroup({
                  _id: new FormControl(dbKey(so.stockOrder)),
                  name: new FormControl(so.stockOrder.identifier),
                  recipientName: new FormControl(resUserBank.data.name),
                  recipientSurname: new FormControl(resUserBank.data.surname),
                  productId: new FormControl(resUserBank.data.productId),
                  recipientId: new FormControl(resUserBank.data._id),
                  orderName: new FormControl(orderName),
                }, { validators: this.payingEqualOrLessThanBalance }))
              } else {
                this.purchaseItems.push(new FormGroup({
                  _id: new FormControl(dbKey(so.stockOrder)),
                  recipientUserCustomerId: new FormControl(so.stockOrder.producerUserCustomerId),
                  representativeOfRecipientUserCustomerId: new FormControl(so.stockOrder.representativeOfProducerUserCustomerId),
                  name: new FormControl(so.stockOrder.identifier),
                  purchased: new FormControl(so.stockOrder.totalQuantity),
                  balance: new FormControl(null),
                  paying: new FormControl(null),
                  orderName: new FormControl(orderName),
                  orderId: new FormControl(orderId)
                }, { validators: this.payingEqualOrLessThanBalance }))
                sumPurchased += so.stockOrder.totalQuantity;
              }
            }
          }
        }
      }
      this.totalPurchasedKgForm.setValue(sumPurchased);
    }

  }

  payingEqualOrLessThanBalance(control: FormGroup): ValidationErrors | null {
    let balance = control.value && control.value['balance'];
    let paying = control.value && control.value['paying'];
    return Number(paying) <= balance
      ? null
      : { payingEqualOrLessThanBalance: true }
  }

  async setDateAndOtherFiedlsThatCanBeFilled() {
    let today = dateAtMidnightISOString(new Date().toDateString());
    this.bulkPaymentForm.get('formalCreationTime').setValue(today);

    if (!this.bulkPaymentForm.get('currency').value) {
      this.bulkPaymentForm.get('currency').setValue('RWF');
    }

    this.bulkPaymentForm.get("payingOrganizationId").setValue(this.userOrgId);
    let resOrg = await this.chainOrganizationService.getOrganization(this.userOrgId).pipe(take(1)).toPromise();
    if (resOrg && resOrg.status === 'OK' && resOrg.data) {
      this.payableFromForm.setValue(resOrg.data.name)
    }

  }

  conditionalValidators() {
    this.subConditional = this.bulkPaymentForm.get('additionalCost').valueChanges.subscribe(val => {
      if (val) {
        this.bulkPaymentForm.controls['additionalCostDescription'].setValidators([Validators.required]);
        this.bulkPaymentForm.controls['additionalCostDescription'].updateValueAndValidity();
      } else {
        this.bulkPaymentForm.controls['additionalCostDescription'].clearValidators();
        this.bulkPaymentForm.controls['additionalCostDescription'].updateValueAndValidity();
      }
    });
    if (this.bulkType === 'BONUS') {
      this.bulkPaymentForm.controls['paymentPerKg'].setValidators([Validators.required]);
      this.bulkPaymentForm.controls['paymentPerKg'].updateValueAndValidity();
    }
  }


  get paymentPurposeTypes() {
    let obj = {}
    obj['ADVANCE_PAYMENT'] = $localize`:@@productLabelStockBulkPayments.paymentPurposeTypes.advancedPayment:Advanced payment`;
    obj['FIRST_INSTALLMENT'] = $localize`:@@productLabelStockBulkPayments.paymentPurposeTypes.firstInstallment:Cherry payment`;
    obj['SECOND_INSTALLMENT'] = $localize`:@@productLabelStockBulkPayments.paymentPurposeTypes.secondInstallment:Member bonus`;
    obj['WOMEN_PREMIUM'] = $localize`:@@productLabelStockBulkPayments.paymentPurposeTypes.womenPreminum:AF Women premium`;
    obj['INVOICE_PAYMENT'] = $localize`:@@productLabelStockBulkPayments.paymentPurposeTypes.invoicePayment:Invoice payment`;
    return obj;
  }
  paymentPurposeTypesCodebook = EnumSifrant.fromObject(this.paymentPurposeTypes);


  async updateBulkPayment() {
    if (this.updateBulkInProgress) return;
    this.updateBulkInProgress = true;
    this.globalEventsManager.showLoading(true);
    this.submitted = true;

    if (this.bulkPaymentForm.invalid || this.purchaseItems.invalid) {
      this.updateBulkInProgress = false;
      this.globalEventsManager.showLoading(false);
      return;
    }

    let userChangedId = "";
    let userCreatedId = "";
    if (this.update && this.authService.currentUserProfile) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) userChangedId = dbKey(res.data);
    } else if (this.authService.currentUserProfile) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) userCreatedId = dbKey(res.data);
    }

    let pd = this.bulkPaymentForm.get('formalCreationTime').value;
    if (pd != null) this.bulkPaymentForm.get('formalCreationTime').setValue(dateAtNoonISOString(pd));

    (this.bulkPaymentForm.get('stockOrderIds') as FormArray).clear();

    if (!this.update) {
      this.bulkPaymentForm.get('userCreatedId').setValue(userCreatedId);
      for (let item of this.purchaseItems.value) {
        (this.bulkPaymentForm.get('stockOrderIds') as FormArray).push(new FormControl(dbKey(item)))
      }
    } else {
      this.bulkPaymentForm.get('userChangedId').setValue(userChangedId);
    }

    let data = _.cloneDeep(this.bulkPaymentForm.value);
    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);
    for (let item of data.additionalProofs) {
      Object.keys(item).forEach((key) => (item[key] == null) && delete item[key]);
    }
    let res = await this.chainPaymentsService.postBulkPayment(data).pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data) {

      for (let item of this.purchaseItems.value) {
        let payment = {
          formalCreationTime: this.bulkPaymentForm.get('formalCreationTime').value,
          paymentType: 'BANK',
          currency: this.bulkPaymentForm.get('currency').value,
          amount: item.paying,
          stockOrderId: dbKey(item),
          payingOrganizationId: this.bulkPaymentForm.get('payingOrganizationId').value,
          recipientUserCustomerId: item.recipientUserCustomerId,
          recipientType: 'USER_CUSTOMER',
          receiptNumber: this.bulkPaymentForm.get('receiptNumber').value,
          paymentPurposeType: this.bulkPaymentForm.get('paymentPurposeType').value,
          paymentStatus: 'UNCONFIRMED',
          userCreatedId: userCreatedId,
          bankTransferId: dbKey(res.data),
          // amountPaidToTheCollector: item.preferredWayOfPayment === 'CASH_VIA_COLLECTOR' ? this.paying
        } as ChainPayment;
        if (item.representativeOfRecipientUserCustomerId != null) {
          payment.representativeOfRecipientUserCustomerId = item.representativeOfRecipientUserCustomerId
        }
        if (item.preferredWayOfPayment === 'CASH_VIA_COLLECTOR') {
          payment.amountPaidToTheCollector = item.paying;
        }
        if (item.preferredWayOfPayment) {
          payment.preferredWayOfPayment = item.preferredWayOfPayment;
        }
        if (item.orderId) {
          payment.orderId = item.orderId;
        }

        let resP = await this.chainPaymentsService.postPayment(payment).pipe(take(1)).toPromise();

      }
      this.updateBulkInProgress = false;
      this.globalEventsManager.showLoading(false);
      this.dismiss();
    }
    this.updateBulkInProgress = false;
    this.globalEventsManager.showLoading(false);
  }

  dismiss() {
    this.location.back();
  }

  initializeListManager() {
    this.additionalProofsListManager = new ListEditorManager<ChainActivityProof>(
      this.bulkPaymentForm.get('additionalProofs') as FormArray,
      ProductLabelStockBulkPaymentDetailComponent.AdditionalProofItemEmptyObjectFormFactory(),
      ApiActivityProofValidationScheme
    )

    this.paymentsListManager = new ListEditorManager<ChainPayment>(
      this.paymentsForm as FormArray,
      StockPurchaseOrderEditComponent.ChainPaymentEmptyObjectFormFactory(),
      ChainPaymentValidationScheme
    )
  }


  static AdditionalProofItemCreateEmptyObject(): ChainActivityProof {
    let obj = ChainActivityProof.formMetadata();
    return defaultEmptyObject(obj) as ChainActivityProof
  }

  static AdditionalProofItemEmptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(ProductLabelStockBulkPaymentDetailComponent.AdditionalProofItemCreateEmptyObject(), ApiActivityProofValidationScheme.validators)
      return f
    }
  }

  preparePaymentsForEdit() {
    for (let pay of this.payment.payments) {
      (this.paymentsForm as FormArray).push(new FormControl(pay));
    }
  }

  //purchase orders
  purchaseItems: FormArray = new FormArray([]);
  //purchase orders
  purchaseItemsNoBankAccount: FormArray = new FormArray([]);

  removeItem(idx) {
    this.purchaseItems.removeAt(idx);
  }

  setToBePaid() {
    if (this.update && this.payment) {
      this.bulkPaymentForm.get('totalAmount').setValue(this.payment.totalAmount);
      return;
    }
    let sum = 0;
    for (let item of this.purchaseItems.value) {
      sum += Number(item.paying);
    }
    this.bulkPaymentForm.get('totalAmount').setValue(sum);
  }

  setBalanceToBePaid() {
    let val = 0;
    if (this.bulkPaymentForm && this.bulkPaymentForm.get('paymentPerKg') && this.bulkPaymentForm.get('paymentPerKg').value) {
      for (let item of this.purchaseItems.value) {
        val += item.purchased * this.bulkPaymentForm.get('paymentPerKg').value;
      }
      this.balanceSeasonalForm.setValue(val);
    }

  }

  setBalanceBonus(val, form) {
    if (this.bulkPaymentForm && this.bulkPaymentForm.get('paymentPerKg') && this.bulkPaymentForm.get('paymentPerKg').value) {
      form.setValue(this.bulkPaymentForm.get('paymentPerKg').value * val);
    }
  }

  hideSavedButton() {
    return this.update;
  }


}


