import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, startWith, take } from 'rxjs/operators';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { PaymentsService } from 'src/api-chain/api/payments.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { TransactionService } from 'src/api-chain/api/transaction.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { OrganizationsCodebookService } from 'src/app/shared-services/organizations-codebook.service';
import { AuthService } from 'src/app/system/auth.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { environment } from 'src/environments/environment';
import { dateAtMidnight, dbKey } from 'src/shared/utils';
import { StockTabCore } from '../../stock-core/stock-tab-core/stock-tab-core.component';

@Component({
  selector: 'app-stock-transaction-tab',
  templateUrl: './stock-transaction-tab.component.html',
  styleUrls: ['./stock-transaction-tab.component.scss']
})
export class StockTransactionTabComponent extends StockTabCore {

  rootTab = 5;

  constructor(
    protected route: ActivatedRoute,
    protected chainProductService: ProductService,
    protected chainSemiProductService: SemiProductService,
    // protected tabCommunicationService: TabCommunicationService,
    protected router: Router,
    public chainOrganizationService: OrganizationService,
    public chainOrganizationCodebook: OrganizationsCodebookService,
    protected globalEventManager: GlobalEventManagerService,
    protected chainFacilityService: FacilityService,
    protected chainStockOrderService: StockOrderService,
    protected modalService: NgbModalImproved,
    protected chainTransactionService: TransactionService,
    protected codebookTranslations: CodebookTranslations,
    protected chainPaymentsContoller: PaymentsService,
    protected authService: AuthService
  ) {
    super(route, chainProductService, chainSemiProductService, router, chainOrganizationService, chainOrganizationCodebook, globalEventManager, chainFacilityService, chainStockOrderService, modalService, codebookTranslations, chainPaymentsContoller, authService)
  }

  transactionListingForm = new FormGroup({
    inputFacility: new FormControl(null),
    outputFacility: new FormControl(null),
    semiProduct: new FormControl(null),
    startDate: new FormControl(null),
    endDate: new FormControl(null)
  })

  public reloadDataPing$ = new BehaviorSubject<boolean>(false);
  public reloadPage() {
    setTimeout(() => this.reloadDataPing$.next(true), environment.reloadDelay)
  }

  sourceFacilityId$ = this.transactionListingForm.get('inputFacility').valueChanges.pipe(
    startWith(""),
    map(val => val ? dbKey(val) : null),
    shareReplay(1)
  )

  targetFacilityId$ = this.transactionListingForm.get('outputFacility').valueChanges.pipe(
    startWith(""),
    map(val => val ? dbKey(val) : null),
    shareReplay(1)
  )
  semiProductId$  = this.transactionListingForm.get('semiProduct').valueChanges.pipe(
    startWith(""),
    map(val => val ? dbKey(val) : null),
    shareReplay(1)
  )
  startDate$  = this.transactionListingForm.get('startDate').valueChanges.pipe(
    startWith(""),
    map(x => {
      if(x && typeof x != "string") return dateAtMidnight(x).toISOString()
      return x
    }),
    shareReplay(1)
  )
  endDate$  = this.transactionListingForm.get('endDate').valueChanges.pipe(
    startWith(""),
    map(x => {
      if(x && typeof x != "string") return dateAtMidnight(x).toISOString()
      return x
    }),
    shareReplay(1)
  )

  selectedTransactions = [];

  async deleteSelectedTransactions() {
    let orders = this.selectedTransactions.map(order => {
      let ord = {
        ...order
      } as any
      delete ord.selected
      delete ord.selectedQuantity
      return ord
    })
    // console.log("DELETING TXS", this.selectedTransactions)
    let res = await this.chainTransactionService.deleteTransactions(orders).pipe(take(1)).toPromise()
    this.reloadPage()
  }

  public selectedIdsChanged(event) {
    this.selectedTransactions = event;
  }


}
