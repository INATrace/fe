import { Component, OnInit } from '@angular/core';
import { StockCoreTabComponent } from '../../stock-core/stock-core-tab/stock-core-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { ApiPayment } from '../../../../../api/model/apiPayment';
import { take } from 'rxjs/operators';
import { PaymentControllerService } from '../../../../../api/api/paymentController.service';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModalImproved } from '../../../../core/ngb-modal-improved/ngb-modal-improved.service';
import { StockPaymentsSelectorForNewPaymentModalComponent } from '../stock-payments-selector-for-new-payment-modal/stock-payments-selector-for-new-payment-modal.component';
import { AuthService } from '../../../../core/auth.service';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';
import { CommonCsvControllerService } from '../../../../../api/api/commonCsvController.service';
import { FileSaverService } from 'ngx-filesaver';
import {ApiResponseApiCompanyGet} from '../../../../../api/model/apiResponseApiCompanyGet';

@Component({
  selector: 'app-stock-payments-tab',
  templateUrl: './stock-payments-tab.component.html',
  styleUrls: ['./stock-payments-tab.component.scss']
})
export class StockPaymentsTabComponent extends StockCoreTabComponent implements OnInit {

  rootTab = 2;

  showedPayments = 0;
  allPayments = 0;

  // currency code
  currency: string;

  reloadPaymentPingList$ = new BehaviorSubject<boolean>(false);

  searchFarmerNameAndSurname = new FormControl(null);
  searchFarmerNameSurnamePing$ = new BehaviorSubject<string>(null);

  constructor(
      protected router: Router,
      protected route: ActivatedRoute,
      protected globalEventManager: GlobalEventManagerService,
      protected modalService: NgbModalImproved,
      protected facilityControllerService: FacilityControllerService,
      protected authService: AuthService,
      protected companyController: CompanyControllerService,
      private paymentControllerService: PaymentControllerService,
      private companyService: CompanyControllerService,
      private commonCsvControllerService: CommonCsvControllerService,
      private fileSaverService: FileSaverService
  ) {
    super(router, route, globalEventManager, facilityControllerService, authService, companyController);
  }

  ngOnInit(): void {
    super.ngOnInit();

    // additional call for reading company's currency
    this.companyService.getCompanyUsingGET(this.companyId).pipe(
      take(1)
    )
      .subscribe(response => {
        if (response && response.status === ApiResponseApiCompanyGet.StatusEnum.OK && response.data) {
          this.currency = response.data.currency.code;
        }
      });

  }

  async newPayment() {
    const modalRef = this.modalService.open(StockPaymentsSelectorForNewPaymentModalComponent, {centered: true});
    Object.assign(modalRef.componentInstance, {
      companyId: this.companyId,
    });
    const stockOrder = await modalRef.result;
    if (stockOrder) {
      await this.router.navigate(['my-stock', 'payments', 'purchase-order', stockOrder.id, 'new']);
    }
  }

  searchPaymentByFarmerNameInput(event) {
    this.searchFarmerNameSurnamePing$.next(event);
  }

  async confirmPayments(){
    if (this.selectedPayments.length === 0) {
      return;
    }
    const result = await this.globalEventManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelPayments.confirmPayments.error.message:Are you sure you want to confirm payments?`,
      options: { centered: true }
    });
    if (result !== 'ok') {
      return;
    }

    for (const payment of this.selectedPayments) {

      payment.paymentStatus = ApiPayment.PaymentStatusEnum.CONFIRMED;

      const res = await this.paymentControllerService.createOrUpdatePaymentUsingPUT(payment)
          .pipe(take(1))
          .toPromise();

      if (res && res.status === 'OK') {
        this.reloadPage();
      }
    }
    this.selectedPayments = [];
    this.selectedIdsChanged(this.selectedPayments);
  }

  async generatePaymentsCsv(){

    const res = await this.commonCsvControllerService.generatePaymentsByCompanyCsvUsingPOST(this.companyId)
    .pipe(take(1))
    .toPromise();

    this.fileSaverService.save(res, 'payments.csv');
  }

  onShowPayments(event) {
    this.showedPayments = event;
  }

  onCountAllPayments(event) {
    this.allPayments = event;
  }

  reloadPage() {
    this.reloadPaymentPingList$.next(true);
  }

}
