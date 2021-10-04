import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash-es';
import { take } from 'rxjs/operators';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { PaymentsService } from 'src/api-chain/api/payments.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { UserService } from 'src/api-chain/api/user.service';
import { UserCustomerService } from 'src/api-chain/api/userCustomer.service';
import { ChainPayment } from 'src/api-chain/model/chainPayment';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { ProductControllerService } from 'src/api/api/productController.service';
import { ContentsModule } from 'src/app/contents/contents.module';
import { ActiveUserCustomersByOrganizationAndRoleService } from 'src/app/shared-services/active-user-customers-by-organization-and-role.service';
import { AllOrganizationService } from 'src/app/shared-services/all-organizations.service';
import { AuthService } from 'src/app/core/auth.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { environment } from 'src/environments/environment';
import { dateAtMidnightISOString, dateAtNoonISOString, dbKey, generateFormFromMetadata } from 'src/shared/utils';
import { ChainPaymentValidationScheme } from './validation';

@Component({
  selector: 'app-product-label-stock-payment-detail',
  templateUrl: './product-label-stock-payment-detail.component.html',
  styleUrls: ['./product-label-stock-payment-detail.component.scss']
})
export class ProductLabelStockPaymentDetailComponent implements OnInit {

  constructor(
    private globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private location: Location,
    private chainPaymentsService: PaymentsService,
    private chainProductService: ProductService,
    private stockOrderService: StockOrderService,
    private chainUserCustomerService: UserCustomerService,
    private chainOrganizationService: OrganizationService,
    private chainUserService: UserService,
    public authService: AuthService,
    private productController: ProductControllerService
  ) { }

  chainRootUrl: string = environment.chainRelativeFileUploadUrl;
  chainDownloadRootUrl: string = environment.chainRelativeFileDownloadUrl;
  productId;
  update: boolean = true;
  title: string = null;
  payment;
  chainProduct;
  organizationId;
  stockOrder: ChainStockOrder;
  paymentForm: FormGroup;
  submitted: boolean = false;
  searchFarmers = new FormControl(null);
  searchCollectors = new FormControl(null);
  searchCompanies = new FormControl(null);
  farmersCodebook: ActiveUserCustomersByOrganizationAndRoleService;
  collectorsCodebook: ActiveUserCustomersByOrganizationAndRoleService;
  userOrgId;
  payableFromForm = new FormControl(null);
  owner: boolean = true;
  orderReferenceForm: FormControl = new FormControl(null);
  userLastChanged;
  openBalanceToBeSet;
  purchasedToBeSet;
  updatePaymentInProgress: boolean = false;

  mode: string = "PURCHASE";
  purchaseOrderId: string = this.route.snapshot.params.purchaseOrderId;
  customerOrderId: string = this.route.snapshot.params.customerOrderId;

  ngOnInit(): void {
    this.initInitialData().then(
      (resp: any) => {
        this.farmersCodebook = new ActiveUserCustomersByOrganizationAndRoleService(this.chainUserCustomerService, this.userOrgId, 'FARMER');
        this.collectorsCodebook = new ActiveUserCustomersByOrganizationAndRoleService(this.chainUserCustomerService, this.userOrgId, 'COLLECTOR');
        if (this.update) {
          this.editPayment();
        } else {
          this.newPayment();
        }
      }
    )
  }

  async initInitialData() {
    let action = this.route.snapshot.data.action
    let type = this.route.snapshot.params.type
    if (this.customerOrderId || type === 'CUSTOMER') this.mode = 'CUSTOMER';
    if (!action) return;
    // standalone on route
    this.productId = this.route.snapshot.params.id
    if (action === 'new') {
      this.update = false;
      this.title = $localize`:@@productLabelStockPayments.newTitle:New payment`;

      let orderId = this.purchaseOrderId ? this.purchaseOrderId : this.customerOrderId;
      let resp = await this.stockOrderService.getStockOrderById(orderId).pipe(take(1)).toPromise();
      if (resp && resp.status === "OK" && resp.data && resp.data) {
        this.stockOrder = resp.data;
      }
    } else if (action == 'update') {
      this.title = $localize`:@@productLabelStockPayments.updateTitle:Update payment`;
      this.update = true;

      let resp = await this.chainPaymentsService.getPayment(this.route.snapshot.params.paymentId).pipe(take(1)).toPromise()
      if (resp && resp.status === 'OK' && resp.data) {
        this.payment = resp.data;

        let respO = await this.stockOrderService.getStockOrderById(this.payment.stockOrderId).pipe(take(1)).toPromise();
        if (respO && respO.status === "OK" && respO.data && respO.data) {
          this.stockOrder = respO.data;
        }
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

    // this.listOfOrgProducer();
  }


  newPayment() {
    this.paymentForm = generateFormFromMetadata(ChainPayment.formMetadata(), {}, ChainPaymentValidationScheme)
    this.setDateAndOtherFiedlsThatCanBeFilled();
  }

  async setDateAndOtherFiedlsThatCanBeFilled() {
    let today = dateAtMidnightISOString(new Date().toDateString());
    this.paymentForm.get('formalCreationTime').setValue(today);

    if (this.mode === "PURCHASE") {
      if (!this.paymentForm.get('currency').value) {
        this.paymentForm.get('currency').setValue('RWF');
      }
    }


    this.paymentForm.get('paymentStatus').setValue('UNCONFIRMED');
    this.paymentForm.get('stockOrderId').setValue(dbKey(this.stockOrder));

    this.openBalanceToBeSet = this.stockOrder.balance;
    this.purchasedToBeSet = this.stockOrder.fullfilledQuantity;
    if (this.stockOrder.representativeOfProducerUserCustomerId) {
      let resC = await this.chainUserCustomerService.getUserCustomer(this.stockOrder.representativeOfProducerUserCustomerId).pipe(take(1)).toPromise();
      if (resC && resC.status === 'OK' && resC.data) {
        this.searchCollectors.setValue(resC.data);
        this.paymentForm.get('representativeOfRecipientUserCustomerId').setValue(dbKey(resC.data))
      }
    }
    if (this.stockOrder.producerUserCustomerId) {
      let res = await this.chainUserCustomerService.getUserCustomer(this.stockOrder.producerUserCustomerId).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        this.searchFarmers.setValue(res.data);
        this.paymentForm.get('recipientUserCustomerId').setValue(dbKey(res.data))
      }
    }
    this.paymentForm.get("payingOrganizationId").setValue(this.userOrgId);
    let resOrg = await this.chainOrganizationService.getOrganization(this.userOrgId).pipe(take(1)).toPromise();
    if (resOrg && resOrg.status === 'OK' && resOrg.data) {
      this.payableFromForm.setValue(resOrg.data.name)
    }
    this.setPurchaseOrder();
  }

  setPurchaseOrder() {
    this.orderReferenceForm.setValue(this.mode === 'PURCHASE' ? this.stockOrder.identifier : this.stockOrder.internalLotNumber);
  }

  async editPayment() {
    this.paymentForm = generateFormFromMetadata(ChainPayment.formMetadata(), this.payment, ChainPaymentValidationScheme)
    if (this.paymentForm.get('recipientOrganizationId').value) {
      let res = await this.chainOrganizationService.getOrganization(this.paymentForm.get('recipientOrganizationId').value).pipe(take(1)).toPromise();
      if (res && res.status == "OK" && res.data) {
        let resp = await this.productController.getProductUsingGET(this.productId).pipe(take(1)).toPromise();
        if (resp && resp.status == "OK" && resp.data) {
          for (let item of resp.data.associatedCompanies) {
            if (item.company.id === res.data.id)
            this.searchCompanies.setValue(item);
          }
        }
      }
    }

    if (this.paymentForm.get('representativeOfRecipientUserCustomerId').value) {
      let res = await this.chainUserCustomerService.getUserCustomer(this.paymentForm.get('representativeOfRecipientUserCustomerId').value).pipe(take(1)).toPromise();
      if (res && res.status == "OK") this.searchCollectors.setValue(res.data);
    }
    if (this.paymentForm.get('recipientUserCustomerId').value) {
      let res = await this.chainUserCustomerService.getUserCustomer(this.paymentForm.get('recipientUserCustomerId').value).pipe(take(1)).toPromise();
      if (res && res.status == "OK") this.searchFarmers.setValue(res.data);
    }

    // let resOrg = await this.chainOrganizationService.getOrganization(this.userOrgId).pipe(take(1)).toPromise();
    // if (resOrg && resOrg.status === 'OK' && resOrg.data) {
    //   this.payableFromForm.setValue(resOrg.data.name)
    // }

    let resOrg = await this.chainOrganizationService.getOrganization(this.payment.payingOrganizationId).pipe(take(1)).toPromise();
    if (resOrg && resOrg.status === 'OK' && resOrg.data) {
      this.payableFromForm.setValue(resOrg.data.name)
    }

    this.setPurchaseOrder();

    if (this.payment.userChangedId) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) this.userLastChanged = res.data.name + " " + res.data.surname;
    } else if (this.payment.userCreatedId) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) this.userLastChanged = res.data.name + " " + res.data.surname;
    }
  }

  async updatePayment() {
    if (this.updatePaymentInProgress) return;
    this.updatePaymentInProgress = true;
    this.globalEventsManager.showLoading(true);
    if (this.paymentForm.get('recipientOrganizationId').value) this.paymentForm.get("recipientType").setValue('ORGANIZATION');
    else if (this.paymentForm.get('recipientUserCustomerId').value) this.paymentForm.get("recipientType").setValue('USER_CUSTOMER');
    else this.paymentForm.get("recipientType").setValue(null);

    this.submitted = true;
    if (this.paymentForm.invalid) {
      this.updatePaymentInProgress = false;
      this.globalEventsManager.showLoading(false);
      return;
    }
    let data = this.prepareData();

    if (this.update && this.authService.currentUserProfile) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) data.userChangedId = dbKey(res.data);
    } else if (this.authService.currentUserProfile) {
      let res = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) data.userCreatedId = dbKey(res.data);
    }
    try {
      // this.globalEventsManager.showLoading(true);
      let res = await this.chainPaymentsService.postPayment(data).pipe(take(1)).toPromise()
      if (res && res.status == 'OK') {
        this.dismiss();
      }
    } finally {
      this.updatePaymentInProgress = false;
      this.globalEventsManager.showLoading(false);
    }
  }

  prepareData() {
    let pd = this.paymentForm.get('formalCreationTime').value;
    if (pd != null) this.paymentForm.get('formalCreationTime').setValue(dateAtNoonISOString(pd));

    let data = _.cloneDeep(this.paymentForm.value);
    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

    return data;
  }

  dismiss() {
    this.location.back();
  }

  hideSavedButton() {
    return this.update;
  }
}
