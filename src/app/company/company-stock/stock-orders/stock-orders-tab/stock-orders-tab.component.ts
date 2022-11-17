import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockCoreTabComponent } from '../../stock-core/stock-core-tab/stock-core-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { AuthService } from '../../../../core/auth.service';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { FacilitySemiProductsCodebookService } from '../../../../shared-services/facility-semi-products-codebook.service';
import { CodebookTranslations } from '../../../../shared-services/codebook-translations';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-stock-orders-tab',
  templateUrl: './stock-orders-tab.component.html',
  styleUrls: ['./stock-orders-tab.component.scss']
})
export class StockOrdersTabComponent extends StockCoreTabComponent implements OnInit, OnDestroy {

  groupViewControl = new FormControl(false);
  showGroupView = false;
  rootTab = 3;

  showedOrders = 0;
  allOrders = 0;

  purchaseOrderOnly = false;
  purchaseOrderOnly$ = new BehaviorSubject<boolean>(this.purchaseOrderOnly);

  availableOnly = true;
  availableOnly$ = new BehaviorSubject<boolean>(this.availableOnly);

  semiProductFrom = new FormControl(null);

  private facilityIdChangeSub: Subscription;
  facilitySemiProducts: FacilitySemiProductsCodebookService = null;

  reloadStockOrdersPing$ = new BehaviorSubject<boolean>(false);

  semiProductId$: Observable<number> = this.semiProductFrom.valueChanges.pipe(
    startWith(null),
    map(semiProduct => {
      if (semiProduct) { return semiProduct.id; }
      return null;
    })
  );

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected globalEventManager: GlobalEventManagerService,
    protected facilityControllerService: FacilityControllerService,
    protected authService: AuthService,
    protected companyController: CompanyControllerService,
    private codebookTranslations: CodebookTranslations
  ) {
    super(router, route, globalEventManager, facilityControllerService, authService, companyController);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.facilityIdChangeSub = this.facilityIdPing$.subscribe(facilityId => this.setFacilitySemiProducts(facilityId));
    this.groupViewControl.valueChanges.subscribe(state => this.showGroupView = state);
  }

  ngOnDestroy(): void {
    if (this.facilityIdChangeSub) {
      this.facilityIdChangeSub.unsubscribe();
    }
  }

  setPurchaseOrdersOnly(poOnly: boolean) {
    this.purchaseOrderOnly = poOnly;
    this.purchaseOrderOnly$.next(poOnly);
  }

  setAvailableOnly(avOnly: boolean) {
    this.availableOnly = avOnly;
    this.availableOnly$.next(avOnly);
  }

  private setFacilitySemiProducts(facilityId: number) {
    if (facilityId !== null && facilityId !== undefined) {
      this.facilitySemiProducts = new FacilitySemiProductsCodebookService(this.facilityControllerService, facilityId, this.codebookTranslations);
    } else {
      this.facilitySemiProducts = null;
    }
  }

  onShowSO(event) {
    this.showedOrders = event;
  }

  onCountAllSO(event) {
    this.allOrders = event;
  }

}
