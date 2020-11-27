import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { PaymentsService } from 'src/api-chain/api/payments.service';
import { ApiResponsePaginatedListChainBulkPayment } from 'src/api-chain/model/apiResponsePaginatedListChainBulkPayment';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { dbKey } from 'src/shared/utils';

@Component({
  selector: 'app-product-label-stock-bulk-payment-list',
  templateUrl: './product-label-stock-bulk-payment-list.component.html',
  styleUrls: ['./product-label-stock-bulk-payment-list.component.scss']
})
export class ProductLabelStockBulkPaymentListComponent implements OnInit {

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false)
  @Input()
  organizationId: string;
  @Input()
  clickAssocPing$ = new BehaviorSubject<boolean>(false);

  allPayments: number = 0;
  showedPayments: number = 0;
  isAssociation: boolean = false;
  assocSubscription: Subscription;

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  productId = this.route.snapshot.params.id;
  pagingParams$ = new BehaviorSubject({})
  sortingParams$ = new BehaviorSubject({ sortBy: 'name', sort: 'ASC' })
  paging$ = new BehaviorSubject<number>(1);
  page: number = 0;
  pageSize = 10;

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private chainPaymentsService: PaymentsService,
  ) { }

  ngOnInit(): void {
    this.initializeObservable()
    this.assocSubscription = this.clickAssocPing$.subscribe(val => {
      if (val) {console.log(val); this.isAssociation = val; this.reloadPage()}
    });
  }

  ngOnDestroy() {
    if (this.assocSubscription) this.assocSubscription.unsubscribe();
  }

  onPageChange(event) {
    this.paging$.next(event);
  }

  reloadPage() {
    this.reloadPingList$.next(true);
  }

  changeSort(event) {
    this.sortingParams$.next({ sortBy: event.key, sort: event.sortOrder })
  }

  payments$

  initializeObservable() {
    this.payments$ = combineLatest(this.reloadPingList$, this.paging$, this.sortingParams$,
      (ping: boolean, page: number, sorting: any) => {
        return {
          ...sorting,
          offset: (page - 1) * this.pageSize,
          limit: this.pageSize
        }
      }).pipe(
        tap(val => this.globalEventsManager.showLoading(true)),
        switchMap(params => {
          return this.loadEntityList(params)
        }),
        map((resp: ApiResponsePaginatedListChainBulkPayment) => {
          if (resp) {
            this.showedPayments = 0;
            if (resp.data && resp.data.count && (this.pageSize - resp.data.count > 0)) this.showedPayments = resp.data.count;
            else if (resp.data && resp.data.count && (this.pageSize - resp.data.count <= 0)) {
              let temp = resp.data.count - (this.pageSize * (this.page - 1));
              this.showedPayments = temp >= this.pageSize ? this.pageSize : temp;
            }
            this.showing.emit(this.showedPayments);
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
    return this.chainPaymentsService.listBulkPaymentsForPayingOrganizationByMap({ ...params, payingOrganizationId: org })
  }

  edit(payment) {
    this.router.navigate(['product-labels', this.productId, 'stock', 'payments', 'bulk-payment', 'update', dbKey(payment)]);
  }

  removeEntity(entity) {
    return this.chainPaymentsService.deletePayment(entity);
  }

  async delete(entity) {
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelBulkPayments.delete.error.message:Are you sure you want to delete this payment?`,
      options: { centered: true }
    });
    if (result != "ok") return
    let res = await this.removeEntity(entity).pipe(take(1)).toPromise();
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


  sortOptions = [
    {
      key: 'name',
      name: $localize`:@@productLabelBulkPayments.sortOptions.name.name:Receipt number`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'purpose',
      name: $localize`:@@productLabelBulkPayments.sortOptions.paymentPurposeType.name:Payment purpose`,
      inactive: true
    },
    {
      key: 'amount',
      name: $localize`:@@productLabelBulkPayments.sortOptions.amount.name:Amount`,
      inactive: true
    },
    {
      key: 'actions',
      name: $localize`:@@productLabelBulkPayments.sortOptions.actions.name:Actions`,
      inactive: true
    }

  ]



}
