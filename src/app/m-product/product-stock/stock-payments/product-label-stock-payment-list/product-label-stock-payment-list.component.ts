import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { PaymentsService } from 'src/api-chain/api/payments.service';
import { UserService } from 'src/api-chain/api/user.service';
import { ApiResponsePaginatedListChainPayment } from 'src/api-chain/model/apiResponsePaginatedListChainPayment';
import { ChainPayment } from 'src/api-chain/model/chainPayment';
import { AuthService } from 'src/app/system/auth.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { dbKey, formatDateWithDots } from 'src/shared/utils';
import { DeliveryDates } from '../../stock-core/stock-tab-core/stock-tab-core.component';

@Component({
  selector: 'app-product-label-stock-payment-list',
  templateUrl: './product-label-stock-payment-list.component.html',
  styleUrls: ['./product-label-stock-payment-list.component.scss']
})
export class ProductLabelStockPaymentListComponent implements OnInit {

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false)
  @Input()
  organizationId: string;
  @Input()
  queryPing$ = new BehaviorSubject<string>(null);
  @Input()
  byCategoryPing$;
  @Input()
  paymentStatusPing$ = new BehaviorSubject<string>("");
  @Input()
  clickConfirmPaymentsPing$ = new BehaviorSubject<boolean>(false);
  @Input()
  clickAssocPing$ = new BehaviorSubject<boolean>(false);
  @Input()
  clickCoopPing$ = new BehaviorSubject<boolean>(true);
  @Input()
  wayOfPaymentPing$ = new BehaviorSubject<string>("");
  @Input()
  deliveryDatesPingPayments$ = new BehaviorSubject<DeliveryDates>({ from: null, to: null });
  @Input()
  sortOptions: any = [];

  isCooperative: boolean = true;
  isAssociation: boolean = false;
  allPayments: number = 0;
  showedPayments: number = 0;

  @Input()
  selectedIds: ChainPayment[];

  cbChecked = new FormControl(false);

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  @Output()
  selectedIdsChanged = new EventEmitter<ChainPayment[]>();

  productId = this.route.snapshot.params.id;
  pagingParams$ = new BehaviorSubject({})
  sortingParams$ = new BehaviorSubject({ sortBy: 'DELIVERY_DATE', sort: 'DESC' })
  paging$ = new BehaviorSubject<number>(1);
  page: number = 0;
  pageSize = 10;
  currentData;
  clickSubscription: Subscription;
  assocSubscription: Subscription;
  coopSubscription: Subscription;

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private chainPaymentsService: PaymentsService,
    private chainUserService: UserService,
    private authService: AuthService,
    private chainOrganizationController: OrganizationService
  ) { }

  ;
  ngOnInit(): void {
    this.initializeObservable()
    this.clickSubscription = this.clickConfirmPaymentsPing$.subscribe(val => {
      if (val) this.confirmPayments();
    });
    this.assocSubscription = this.clickAssocPing$.subscribe(val => {
      if (val != null) {this.isAssociation = val; this.reloadPage()}
    });
    this.coopSubscription = this.clickCoopPing$.subscribe(val => {
      if (val != null) {this.isCooperative = val; this.reloadPage()}
    });
  }

  ngOnDestroy() {
    if (this.clickSubscription) this.clickSubscription.unsubscribe();
    if (this.assocSubscription) this.assocSubscription.unsubscribe();
    if (this.coopSubscription) this.coopSubscription.unsubscribe();
  }

  onPageChange(event) {
    this.paging$.next(event);
    // this.clearCBs();
  }

  reloadPage() {
    this.reloadPingList$.next(true);
    this.clearCBs();
  }

  changeSort(event) {
    if (event.key === "cb") {
      this.selectAll(event.checked);
      return;
    }
    this.sortingParams$.next({ sortBy: event.key, sort: event.sortOrder })
    this.clearCBs();
  }

  payments$

  initializeObservable() {
    this.payments$ = combineLatest(this.reloadPingList$, this.paging$, this.sortingParams$, this.queryPing$, this.byCategoryPing$, this.paymentStatusPing$, this.wayOfPaymentPing$, this.deliveryDatesPingPayments$,
      (ping: boolean, page: number, sorting: any, query: string, queryBy: string, paymentStatus: string, wayOfPayment: string, deliveryDates: DeliveryDates) => {
        return {
          query: query,
          queryBy: queryBy,
          paymentStatus: paymentStatus,
          wayOfPayment: wayOfPayment,
          ...sorting,
          offset: (page - 1) * this.pageSize,
          limit: this.pageSize,
          deliveryDateStart: deliveryDates.from,
          deliveryDateEnd: deliveryDates.to,
        }
      }).pipe(
        tap(val => this.globalEventsManager.showLoading(true)),
        switchMap(params => {
          return this.loadEntityList(params)
        }),
        map((resp: ApiResponsePaginatedListChainPayment) => {
          if (resp) {
            this.clearCBs();
            this.showedPayments = 0;
            if (resp.data && resp.data.count && (this.pageSize - resp.data.count > 0)) this.showedPayments = resp.data.count;
            else if (resp.data && resp.data.count && (this.pageSize - resp.data.count <= 0)) {
              let temp = resp.data.count - (this.pageSize * (this.page - 1));
              this.showedPayments = temp >= this.pageSize ? this.pageSize : temp;
            }
            this.showing.emit(this.showedPayments);
            this.currentData = resp.data.items;
            // console.log("payments$", resp.data)
            return resp.data
          } else {
            return null
          }
        }),
        tap(val => {
          if (val) {
            this.allPayments = val.count
            this.countAll.emit(this.allPayments);
          } else {
            this.allPayments = 0;
            this.countAll.emit(0)
          }
        }),
        tap(val => this.globalEventsManager.showLoading(false)),
        shareReplay(1)
      )
  }

  loadEntityList(params: any) {
    if (params.paymentStatus === "") delete params.paymentStatus
    if (params.wayOfPayment === "") delete params.wayOfPayment
    if (params.query === "") params.query = null
    let org = this.organizationId;
    if (this.isAssociation) {
        //   associationIds: ['8b7afab6-c9ce-4739-b4b7-2cff8e473304'],//Icyerekezo
          //   cooperativeIdsAndRoles: [{ organizationId: 'ade24b49-8548-45b6-ab12-65ce801803db', role: "FARMER" }],//Koakaka
          //       associationIds: ['21777c51-8263-4e5c-8b3b-2f03a953dd2a'],//ramba
          //       cooperativeIdsAndRoles: [{ organizationId: '7dc83d0b-898c-4fc3-ae7f-1c2c527b5af4', role: "FARMER" }],//musasa
          //TODO link together appropriate assoc and producer, check also B2C page
      if (this.organizationId === '8b7afab6-c9ce-4739-b4b7-2cff8e473304') org = 'ade24b49-8548-45b6-ab12-65ce801803db';
      if (this.organizationId === '21777c51-8263-4e5c-8b3b-2f03a953dd2a') org = '7dc83d0b-898c-4fc3-ae7f-1c2c527b5af4';
    }
    return this.chainPaymentsService.listPaymentsForPayingOrganizationByMap({ ...params, payingOrganizationId: org })
  }

  edit(payment) {
    this.router.navigate(['product-labels', this.productId, 'stock', 'payments', 'update', dbKey(payment), this.isCooperative ? 'PURCHASE' : 'CUSTOMER']);
  }

  removeEntity(entity) {
    return this.chainPaymentsService.deletePayment(entity);
  }

  async delete(entity) {
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelPayments.delete.error.message:Are you sure you want to delete this payment?`,
      options: { centered: true }
    });
    if (result != "ok") return
    let res = await this.removeEntity(entity).pipe(take(1)).toPromise();
    if (res && res.status == 'OK') {
      this.reloadPage()
    }
  }

  async confirm(payment) {
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelPayments.confirm.error.message:Are you sure you want to confirm this payment?`,
      options: { centered: true }
    });
    if (result != "ok") return
    this.confirmPayment(payment);
  }

  async confirmPayments() {
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelPayments.confirmPayments.error.message:Are you sure you want to confirm payments?`,
      options: { centered: true }
    });
    if (result != "ok") return
    for (let payment of this.selectedIds) {
      this.confirmPayment(payment);
    }
    this.selectedIds = [];
    this.selectedIdsChanged.emit(this.selectedIds);
  }

  async confirmPayment(payment: ChainPayment) {
    delete payment['selected'];
    payment.paymentStatus = "CONFIRMED";
    payment.paymentConfirmedAtTime = new Date().toUTCString();
    let resUser = await this.chainUserService.getUserByAFId(this.authService.currentUserProfile.id).pipe(take(1)).toPromise();
    if (resUser && resUser.status === "OK" && resUser.data) {
      payment.paymentConfirmedByUser = dbKey(resUser.data);
    }
    payment.paymentConfirmedByOrganization = localStorage.getItem('selectedUserCompany');

    let res = await this.chainPaymentsService.confirmPayment(payment).pipe(take(1)).toPromise();
    if (res && res.status == 'OK') {
      this.reloadPage()
    }
  }

  showPagination() {
    if (((this.showedPayments - this.pageSize) == 0 && this.allPayments >= this.pageSize) || this.page > 1) return true;
    else return false
  }

  readablePaymentPurpose(id) {
    return this.paymentPurposeTypes[id];
  }

  get paymentPurposeTypes() {
    let obj = {}
    obj['ADVANCE_PAYMENT'] = $localize`:@@paymentForm.paymentPurposeTypes.advancedPayment:Advanced payment`;
    obj['FIRST_INSTALLMENT'] = $localize`:@@paymentForm.paymentPurposeTypes.firstInstallment:Cherry payment`;
    obj['SECOND_INSTALLMENT'] = $localize`:@@paymentForm.paymentPurposeTypes.secondInstallment:Member bonus`;
    obj['WOMEN_PREMIUM'] = $localize`:@@paymentForm.paymentPurposeTypes.womenPreminum:AF Women premium`;
    obj['INVOICE_PAYMENT'] = $localize`:@@paymentForm.paymentPurposeTypes.invoicePayment:Invoice payment`;
    return obj;
  }

  totalPaid(preferredWayOfPayment, toFarmer, toCollector) {
    if (preferredWayOfPayment === 'CASH_VIA_COLLECTOR') return toFarmer;
    if (toCollector) return toFarmer + toCollector;
    return toFarmer;
  }

  select(payment) {
    const index = this.selectedIds.indexOf(payment);

    if (index !== -1) {
      this.selectedIds.splice(index, 1);
    } else {
      this.selectedIds.push(payment);
    }
    this.selectedIdsChanged.emit(this.selectedIds);
  }

  allSelected: boolean = false;
  async selectAll(checked) {
    if (checked) {
      this.selectedIds = [];
      for (let item of this.currentData) {
        if (item.paymentStatus === "UNCONFIRMED") {
          this.selectedIds.push(item);
        }
      }
      this.currentData.map(item => { if (item.paymentStatus === "UNCONFIRMED") { item.selected = true; return item; } })
      this.allSelected = true;
      this.selectedIdsChanged.emit(this.selectedIds);
    } else {
      this.selectedIds = [];
      this.allSelected = false;
      this.currentData.map(item => { item.selected = false; return item; })
      this.selectedIdsChanged.emit(this.selectedIds);
    }
  }

  cbSelected(payment: ChainPayment, index: number) {
    if (this.allSelected) {
      this.allSelected = false;
      this.cbChecked.setValue(false);
    }
    this.currentData[index].selected = !this.currentData[index].selected;
    this.select(payment);
  }

  clearCBs() {
    this.selectedIds = [];
    this.allSelected = false;
    this.cbChecked.setValue(false);
    this.selectedIdsChanged.emit(this.selectedIds);
  }

  formatDate(productionDate) {
    if (productionDate) return formatDateWithDots(productionDate);
    return "";
  }


}


