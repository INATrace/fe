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
import { FileSaverService } from 'ngx-filesaver';
import { SelectedUserCompanyService } from '../../../../core/selected-user-company.service';

@Component({
  selector: 'app-stock-payments-tab',
  templateUrl: './stock-payments-tab.component.html',
  styleUrls: ['./stock-payments-tab.component.scss']
})
export class StockPaymentsTabComponent extends StockCoreTabComponent implements OnInit {

  rootTab = 2;

  showedPayments = 0;
  allPayments = 0;
  showedBulkPayments = 0;
  allBulkPayments = 0;

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
      private fileSaverService: FileSaverService,
      protected selUserCompanyService: SelectedUserCompanyService
  ) {
    super(router, route, globalEventManager, facilityControllerService, authService, companyController, selUserCompanyService);
  }

  async ngOnInit(): Promise<void> {

    await super.ngOnInit();

    if (this.companyProfile) {
      this.currency = this.companyProfile.currency.code;
    }
  }

  async newPayment() {
    const modalRef = this.modalService.open(StockPaymentsSelectorForNewPaymentModalComponent, {centered: true});
    Object.assign(modalRef.componentInstance, {
      companyId: this.companyId,
    });
    const stockOrder = await modalRef.result;
    if (stockOrder) {
      await this.router.navigate(['my-stock', 'payments', 'delivery', stockOrder.id, 'new']);
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

      const res = await this.paymentControllerService.createOrUpdatePayment(payment)
          .pipe(take(1))
          .toPromise();

      if (res && res.status === 'OK') {
        this.reloadPage();
      }
    }
    this.selectedPayments = [];
    this.selectedIdsChanged(this.selectedPayments);
  }

  async exportPaymentsExcel(): Promise<void> {

    this.globalEventManager.showLoading(true);
    try {
      const res = await this.paymentControllerService.exportPaymentsByCompany(this.companyId)
          .pipe(take(1))
          .toPromise();

      this.fileSaverService.save(res, 'payments.xlsx');
    } finally {
      this.globalEventManager.showLoading(false);
    }
  }

  async exportBulkPaymentsExcel(): Promise<void> {

    const res = await this.paymentControllerService.exportBulkPaymentsByCompany(this.companyId)
        .pipe(take(1))
        .toPromise();

    this.fileSaverService.save(res, 'bulk_payments.xlsx');
  }

  onShowPayments(event) {
    this.showedPayments = event;
  }

  onCountAllPayments(event) {
    this.allPayments = event;
  }

  onShowBulkPayments(event) {
    this.showedBulkPayments = event;
  }

  onCountAllBulkPayments(event) {
    this.allBulkPayments = event;
  }

  reloadPage() {
    this.reloadPaymentPingList$.next(true);
  }

}
