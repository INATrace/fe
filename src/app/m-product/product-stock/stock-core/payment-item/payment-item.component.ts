import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import _ from 'lodash-es';
import { take } from 'rxjs/operators';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { PaymentsService } from 'src/api-chain/api/payments.service';
import { UserCustomerService } from 'src/api-chain/api/userCustomer.service';
import { ChainPayment } from 'src/api-chain/model/chainPayment';
import { environment } from 'src/environments/environment';
import { dateAtMidnightISOString, dbKey, defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ActiveUserCustomersByOrganizationAndRoleService } from 'src/app/shared-services/active-user-customers-by-organization-and-role.service';
import { AllOrganizationService } from 'src/app/shared-services/all-organizations.service';
import { GenericEditableItemComponent } from 'src/app/shared/generic-editable-item/generic-editable-item.component';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ChainPaymentValidationScheme } from '../../stock-payments/product-label-stock-payment-detail/validation';

@Component({
  selector: 'app-payment-item',
  templateUrl: './payment-item.component.html',
  styleUrls: ['./payment-item.component.scss']
})
export class PaymentItemComponent extends GenericEditableItemComponent<ChainPayment> {

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    protected router: Router,
    private chainPaymentsService: PaymentsService,
    private chainUserCustomerService: UserCustomerService,
    private chainOrganizationService: OrganizationService,
    private stockOrderService: StockOrderService,
  ) {
    super(globalEventsManager)
  }

  @Input()
  disableDelete = false;
  @Input()
  formTitle = null;
  @Input()
  purchaseOrder;
  @Input()
  productId;
  @Input()
  chainProductOrganizationId;
  @Input()
  payment;

  userOrgId;
  chainProduct;
  organizationId;
  owner: boolean = true;

  chainRootUrl: string = environment.chainRelativeFileUploadUrl;
  chainDownloadRootUrl: string = environment.chainRelativeFileDownloadUrl;

  payableFromForm = new FormControl(null);
  searchFarmers = new FormControl(null);
  searchCompanies = new FormControl(null);
  searchCollectors = new FormControl(null);
  farmersCodebook: ActiveUserCustomersByOrganizationAndRoleService;
  collectorsCodebook: ActiveUserCustomersByOrganizationAndRoleService;
  orderReferenceForm: FormControl = new FormControl(null);
  viewOnly = false;
  openBalanceToBeSet;
  purchasedToBeSet;

  updatePaymentInProgress: boolean = false;

  ngOnInit(): void {
    if (dbKey(this.form.value) != null) {
      this.viewOnly = true;
      this.searchCompanies.disable();
      this.searchFarmers.disable();
      this.form.get('paymentType').disable();
      this.form.get('paymentPurposeType').disable();
      this.form.get('receiptDocument').disable();
      this.form.get('formalCreationTime').disable();
    } else {
      this.viewOnly = false;
      this.searchCompanies.enable();
      this.searchFarmers.enable();
      this.form.get('paymentType').enable();
      this.form.get('paymentPurposeType').enable();
      this.form.get('receiptDocument').enable();
      this.form.get('formalCreationTime').enable();
    }
    this.initializeData(dbKey(this.form.value) == null);
  }

  public generateForm(value: any): FormGroup {
    return generateFormFromMetadata(ChainPayment.formMetadata(), value, ChainPaymentValidationScheme)
  }

  static createEmptyObject(): ChainPayment {
    let market = ChainPayment.formMetadata();
    return defaultEmptyObject(market) as ChainPayment
  }

  static emptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(PaymentItemComponent.createEmptyObject(), ChainPaymentValidationScheme.validators)
      return f
    }
  }

  async initializeData(add: boolean) {
    this.userOrgId = localStorage.getItem("selectedUserCompany");

    if (this.payment) this.orderReferenceForm.setValue(this.payment.value.queryPurchaseOrderName);
    else this.orderReferenceForm.setValue(this.purchaseOrder.identifier);

    this.farmersCodebook = new ActiveUserCustomersByOrganizationAndRoleService(this.chainUserCustomerService, this.userOrgId, 'FARMER');
    this.collectorsCodebook = new ActiveUserCustomersByOrganizationAndRoleService(this.chainUserCustomerService, this.userOrgId, 'COLLECTOR');

    if (add) {
      let today = dateAtMidnightISOString(new Date().toDateString());
      this.form.get('formalCreationTime').setValue(today);

      if (!this.form.get('currency').value) {
        this.form.get('currency').setValue('RWF');
      }

      this.form.get('stockOrderId').setValue(dbKey(this.purchaseOrder));

      this.openBalanceToBeSet = this.purchaseOrder.balance;
      this.purchasedToBeSet = this.purchaseOrder.fullfilledQuantity;
      if (this.purchaseOrder.representativeOfProducerUserCustomerId) {
        let resC = await this.chainUserCustomerService.getUserCustomer(this.purchaseOrder.representativeOfProducerUserCustomerId).pipe(take(1)).toPromise();
        if (resC && resC.status === 'OK' && resC.data) {
          this.searchCollectors.setValue(resC.data);
          this.form.get('representativeOfRecipientUserCustomerId').setValue(dbKey(resC.data))
        }
      }
      let res = await this.chainUserCustomerService.getUserCustomer(this.purchaseOrder.producerUserCustomerId).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        this.searchFarmers.setValue(res.data);
        this.form.get('recipientUserCustomerId').setValue(dbKey(res.data))
      }

      this.form.get("payingOrganizationId").setValue(this.userOrgId);
      let resOrg = await this.chainOrganizationService.getOrganization(this.userOrgId).pipe(take(1)).toPromise();
      if (resOrg && resOrg.status === 'OK' && resOrg.data) {
        this.payableFromForm.setValue(resOrg.data.name)
      }
    } else {
      if (this.form.get('recipientOrganizationId').value) {
        let res = await this.chainOrganizationService.getOrganization(this.form.get('recipientOrganizationId').value).pipe(take(1)).toPromise();
        if (res && res.status == "OK")
          this.searchCompanies.setValue(res.data);
      }
      if (this.form.get('recipientUserCustomerId').value) {
        let res = await this.chainUserCustomerService.getUserCustomer(this.form.get('recipientUserCustomerId').value).pipe(take(1)).toPromise();
        if (res && res.status == "OK")
          this.searchFarmers.setValue(res.data);
      }
      if (this.form.get('representativeOfRecipientUserCustomerId').value) {
        let res = await this.chainUserCustomerService.getUserCustomer(this.form.get('representativeOfRecipientUserCustomerId').value).pipe(take(1)).toPromise();
        if (res && res.status == "OK")
          this.searchCollectors.setValue(res.data);
      }

      let resOrg = await this.chainOrganizationService.getOrganization(this.form.get('payingOrganizationId').value).pipe(take(1)).toPromise();
      if (resOrg && resOrg.status === 'OK' && resOrg.data) {
        this.payableFromForm.setValue(resOrg.data.name)
      }
    }
  }

  async updatePayment() {
    if (this.updatePaymentInProgress) return;
    this.globalEventsManager.showLoading(true);
    this.updatePaymentInProgress = true;
    if (this.form.get('recipientOrganizationId').value) this.form.get("recipientType").setValue('ORGANIZATION');
    else this.form.get("recipientType").setValue(null);
    if (this.form.get('recipientUserCustomerId').value) this.form.get("recipientType").setValue('USER_CUSTOMER');
    else this.form.get("recipientType").setValue(null);

    this.form.get('paymentStatus').setValue('UNCONFIRMED');

    this.submitted = true;
    if (this.form.invalid) {
      this.updatePaymentInProgress = false;
      this.globalEventsManager.showLoading(false);
      return;
    }

    let data = this.prepareData();

    try {
      // this.globalEventsManager.showLoading(true);
      let res = await this.chainPaymentsService.postPayment(data).pipe(take(1)).toPromise()
      if (res && res.status == 'OK') {
        this.onSave.next(true);
        if (this.listEditorManager && this.listEditorManagerPosition != null) {
          this.listEditorManager.save(this.listEditorManagerPosition)
        }
      }
    } finally {
      this.updatePaymentInProgress = false;
      this.globalEventsManager.showLoading(false);
    }
  }

  prepareData() {
    let data = _.cloneDeep(this.form.value);
    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

    return data;
  }

  overWriteSave(){
    this.updatePayment();
  }

  get name() {
    if (this.payment && this.payment.value && this.contentObject) return this.payment.value.queryPurchaseOrderName + " (" + this.contentObject.amount + " " + this.contentObject.currency + ")";
    return this.contentObject ? this.contentObject.receiptNumber + " (" + this.contentObject.amount + " " + this.contentObject.currency + ")": "";
  }

  whichClass() {
    if (this.payment) return "af-form-block--c12"
    return "af-form-block--c6"
  }

}
