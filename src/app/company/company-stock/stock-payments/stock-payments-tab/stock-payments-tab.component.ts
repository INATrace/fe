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

@Component({
  selector: 'app-stock-payments-tab',
  templateUrl: './stock-payments-tab.component.html',
  styleUrls: ['./stock-payments-tab.component.scss']
})
export class StockPaymentsTabComponent extends StockCoreTabComponent implements OnInit {

  rootTab = 2;

  showedPayments = 0;
  allPayments = 0;

  reloadPaymentPingList$ = new BehaviorSubject<boolean>(false);

  filterPaymentStatus = new FormControl('');
  paymentStatusPing$ = new BehaviorSubject<string>(this.filterPaymentStatus.value);

  searchFarmerNameAndSurname = new FormControl(null);
  searchFarmerNameSurnamePing$ = new BehaviorSubject<string>(null);


  constructor(
      protected router: Router,
      protected route: ActivatedRoute,
      protected globalEventManager: GlobalEventManagerService,
      protected facilityControllerService: FacilityControllerService,
      private paymentControllerService: PaymentControllerService
  ) {
    super(router, route, globalEventManager, facilityControllerService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  newPayment() {
    // this.router.navigate(['my-stock', 'payments', 'new']).then();
  }

  setPaymentStatus(value: string){
    this.filterPaymentStatus.setValue(value);
    this.paymentStatusPing$.next(value);
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
