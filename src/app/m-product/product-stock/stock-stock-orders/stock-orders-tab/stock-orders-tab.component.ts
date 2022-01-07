import { Component, OnInit } from '@angular/core';
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
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { UserControllerService } from 'src/api/api/userController.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { OrganizationsCodebookService } from 'src/app/shared-services/organizations-codebook.service';
import { AuthService } from 'src/app/core/auth.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { NgbModalImproved } from 'src/app/core/ngb-modal-improved/ngb-modal-improved.service';
import { environment } from 'src/environments/environment';
import { dbKey, setSelectedIdFieldFromQueryParams } from 'src/shared/utils';
import { StockTabCoreComponent } from '../../stock-core/stock-tab-core/stock-tab-core.component';

@Component({
  selector: 'app-stock-orders-tab',
  templateUrl: './stock-orders-tab.component.html',
  styleUrls: ['./stock-orders-tab.component.scss']
})
export class StockStockOrdersTabComponent extends StockTabCoreComponent implements OnInit {

  rootTab = 3;

  constructor(
    protected route: ActivatedRoute,
    protected chainProductService: ProductService,
    protected chainSemiProductService: SemiProductService,
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
    protected authService: AuthService,
    protected companyController: CompanyControllerService,
    protected userController: UserControllerService
  ) {
    super(
      route,
      chainProductService,
      chainSemiProductService,
      router,
      chainOrganizationService,
      chainOrganizationCodebook,
      globalEventManager,
      chainFacilityService,
      chainStockOrderService,
      modalService,
      codebookTranslations,
      chainPaymentsContoller,
      authService,
      companyController,
      userController);
  }

  availableOnly = true;

  public availableOnly$ = new BehaviorSubject<boolean>(this.availableOnly);

  semiProductFrom = new FormControl(null);

  semiProductId$ = this.semiProductFrom.valueChanges.pipe(
    startWith(null),
    map(val => {
      if (val) { return dbKey(val); }
      return null;
    }),
    shareReplay(1)
  );

  public reloadDataPing$ = new BehaviorSubject<boolean>(false);

  public setAvailableOnly(avOnly: boolean) {
    this.availableOnly = avOnly;
    this.availableOnly$.next(avOnly);
  }

  public reloadPage() {
    setTimeout(() => this.reloadDataPing$.next(true), environment.reloadDelay);
  }

  async deleteSelectedOrders() {
    const orders = this.selectedOrders.map(order => {
      const ord = {
        ...order
      } as any;
      delete ord.selected;
      delete ord.selectedQuantity;
      return ord;
    });
    await this.chainStockOrderService.deleteStockOrders(orders).pipe(take(1)).toPromise();
    this.reloadPage();
  }

  ngOnInit() {
    super.ngOnInit();
    setSelectedIdFieldFromQueryParams(this, this.route, 'facilityId', this.facilityForStockOrderForm,
      this.facilityCodebook, (val) => this.facilityForStockOrderChanged(val));
  }
}
