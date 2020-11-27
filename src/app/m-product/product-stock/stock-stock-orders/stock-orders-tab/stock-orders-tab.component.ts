import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, startWith, take } from 'rxjs/operators';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { PaymentsService } from 'src/api-chain/api/payments.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ActiveSemiProductsForProductServiceStandalone } from 'src/app/shared-services/active-semi-products-for-product-standalone.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { OrganizationsCodebookService } from 'src/app/shared-services/organizations-codebook.service';
import { AuthService } from 'src/app/system/auth.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { environment } from 'src/environments/environment';
import { dbKey, setSelectedIdFieldFromQueryParams } from 'src/shared/utils';
import { StockTabCore } from '../../stock-core/stock-tab-core/stock-tab-core.component';
// import { FacilityStockOrderSelectorForNewPaymentModalComponent } from '../facility-stock-order-selector-for-new-payment-modal/facility-stock-order-selector-for-new-payment-modal.component';

@Component({
  selector: 'app-stock-orders-tab',
  templateUrl: './stock-orders-tab.component.html',
  styleUrls: ['./stock-orders-tab.component.scss']
})
export class StockStockOrdersTab extends StockTabCore {

  rootTab = 4;

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
    protected chainSemiproductService: SemiProductService,
    protected codebookTranslations: CodebookTranslations,
    protected chainPaymentsContoller: PaymentsService,
    protected authService: AuthService
  ) {
    super(route, chainProductService, chainSemiProductService, router, chainOrganizationService, chainOrganizationCodebook, globalEventManager, chainFacilityService, chainStockOrderService, modalService, codebookTranslations, chainPaymentsContoller, authService)
  }

  availableOnly: boolean = true;

  public availableOnly$ = new BehaviorSubject<boolean>(this.availableOnly);

  public setAvailableOnly(avOnly: boolean) {
    this.availableOnly = avOnly;
    this.availableOnly$.next(avOnly)
  }


  semiProductFrom = new FormControl(null)

  semiProductId$ = this.semiProductFrom.valueChanges.pipe(
    startWith(null),
    map(val => {
      if(val) return dbKey(val)
      return null
    }),
    shareReplay(1)
  )

  public reloadDataPing$ = new BehaviorSubject<boolean>(false);
  public reloadPage() {
    setTimeout(() => this.reloadDataPing$.next(true), environment.reloadDelay)
  }

  async deleteSelectedOrders() {
    let orders = this.selectedOrders.map(order => {
      let ord = {
        ...order
      } as any
      delete ord.selected
      delete ord.selectedQuantity
      return ord
    })
    let res = await this.chainStockOrderService.deleteStockOrders(orders).pipe(take(1)).toPromise()
    this.reloadPage()
  }

  ngOnInit() {
    super.ngOnInit()
    console.log("ORGID:", this.organizationId)
    setSelectedIdFieldFromQueryParams(this, this.route, 'facilityId', this.facilityForStockOrderForm, this.facilityCodebook, (val) => this.facilityForStockOrderChanged(val))
  }
}
