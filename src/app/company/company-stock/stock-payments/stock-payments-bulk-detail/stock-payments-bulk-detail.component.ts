import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {GlobalEventManagerService} from '../../../../core/global-event-manager.service';
import {ActivatedRoute} from '@angular/router';
import {PaymentControllerService} from '../../../../../api/api/paymentController.service';
import {StockOrderControllerService} from '../../../../../api/api/stockOrderController.service';
import {FormArray, FormGroup, Validators} from '@angular/forms';
import {take} from 'rxjs/operators';
import {ApiBulkPayment} from '../../../../../api/model/apiBulkPayment';
import {CompanyControllerService} from "../../../../../api/api/companyController.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-stock-payments-bulk-detail',
  templateUrl: './stock-payments-bulk-detail.component.html',
  styleUrls: ['./stock-payments-bulk-detail.component.scss']
})
export class StockPaymentsBulkDetailComponent implements OnInit, OnDestroy {

  title: string;
  update: boolean;

  bulkPayment: ApiBulkPayment;

  bulkPaymentForm: FormGroup;
  paymentsForm: FormArray;
  subConditional: Subscription;

  constructor(
      private route: ActivatedRoute,
      private location: Location,
      private globalEventsManager: GlobalEventManagerService,
      private paymentControllerService: PaymentControllerService,
      private stockOrderControllerService: StockOrderControllerService,
      private companyControllerService: CompanyControllerService
  ) {
  }

  ngOnInit(): void {
    this.initInitialData().then(
        () => {
          if (this.update) {
            // this.editBulkPayment();
          } else {
            this.newBulkPayment();
          }
        }
    );
  }

  ngOnDestroy() {
    if (this.subConditional) {
      this.subConditional.unsubscribe();
    }
  }

  async initInitialData() {


    this.paymentsForm = new FormArray([]);
    const action = this.route.snapshot.data.action;

    if (!action) {
      return;
    }

    if (action === 'new') {

      this.update = false;
      this.title = $localize`:@@productLabelStockBulkPayments.newTitle:New bulk payment`;

      // let purchaseOrderId = this.route.snapshot.params.purchaseOrderId;
      // let resp = await this.stockOrderService.getStockOrderById(purchaseOrderId).pipe(take(1)).toPromise();
      // if (resp && resp.status === "OK" && resp.data && resp.data) {
      //   this.purchaseOrder = resp.data;
      // }
    } else if (action === 'update') {

      this.update = true;
      this.title = $localize`:@@productLabelStockBulkPayments.updateTitle:Update bulk payment`;

      const resp = await this.paymentControllerService.getBulkPaymentUsingGET(this.route.snapshot.params.bulkPaymentId)
          .pipe(take(1))
          .toPromise();

      if (resp && resp.status === 'OK' && resp.data) {
        this.bulkPayment = resp.data;
        this.preparePaymentsForEdit();
      }

    } else {
      throw Error('Wrong action.');
    }

    // TODO: This part should probably just go out
    // const res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    // if (res && res.status === 'OK' && res.data && dbKey(res.data)) {
    //   this.chainProduct = res.data;
    //   this.organizationId = dbKey(res.data.organization);
    // }
    //
    // this.userOrgId = localStorage.getItem('selectedUserCompany');
    // if (this.userOrgId) {
    //   this.owner = (this.organizationId == this.userOrgId);
    // }

  }

  newBulkPayment() {
    // this.bulkPaymentForm = generateFormFromMetadata(ApiBulkPayment.formMetadata(), {}, ApiBulkPaymentValidationScheme);
    // this.setDateAndOtherFieldsThatCanBeFilled();
    // this.conditionalValidators();
    // this.initializeListManager();
    // this.initPOs();
    // if (this.bulkType === "BONUS") {
    //   this.bulkPaymentForm.get('paymentPurposeType').setValue('SECOND_INSTALLMENT');
    // }
  }

  editBulkPayment() {
    // this.bulkPaymentForm = generateFormFromMetadata(ChainBulkPayment.formMetadata(), this.payment, ChainBulkPaymentValidationScheme)
    // this.conditionalValidators();
    // this.initializeListManager();
    // this.initPayments();
    // this.bulkPaymentForm.get('paymentPurposeType').disable();
  }

  async setDateAndOtherFieldsThatCanBeFilled() {

    // TODO: Currency -> A bit sketchy, isn't it?
    if (!this.bulkPaymentForm.get('currency').value) {
      this.bulkPaymentForm.get('currency').setValue('RWF');
    }

    // Paying company is the company in which the user is currently logged in
    const userCompanyId = Number(localStorage.getItem('selectedUserCompany'));
    const userCompanyResp = await this.companyControllerService.getCompanyUsingGET(userCompanyId)
        .pipe(take(1))
        .toPromise();

    if (userCompanyResp && userCompanyResp.status === 'OK' && userCompanyResp.data) {
      this.bulkPaymentForm.get('payingCompany').setValue(userCompanyResp.data);
      // this.payableFromForm.setValue(userCompanyResp.data.name);
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

    // TODO: TBD
    // if (this.bulkType === 'BONUS') {
    //   this.bulkPaymentForm.controls['paymentPerKg'].setValidators([Validators.required]);
    //   this.bulkPaymentForm.controls['paymentPerKg'].updateValueAndValidity();
    // }
  }

  preparePaymentsForEdit() {
    // TODO: TBD
  }

}
