import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { StockCoreTabComponent } from '../../stock-core/stock-core-tab/stock-core-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { take } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../../core/auth.service';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';
import { FacilitySemiProductsCodebookService } from '../../../../shared-services/facility-semi-products-codebook.service';
import { map, startWith } from 'rxjs/operators';
import { CodebookTranslations } from '../../../../shared-services/codebook-translations';
import { ApiFacility } from '../../../../../api/model/apiFacility';
import { FileSaverService } from 'ngx-filesaver';
import { SelectedUserCompanyService } from '../../../../core/selected-user-company.service';
import { StockOrderControllerService } from "../../../../../api/api/stockOrderController.service";

@Component({
  selector: 'app-stock-deliveries-tab',
  templateUrl: './stock-deliveries-tab.component.html',
  styleUrls: ['./stock-deliveries-tab.component.scss']
})
export class StockDeliveriesTabComponent extends StockCoreTabComponent implements OnInit, OnDestroy {

  rootTab = 0;

  showedPurchaseOrders = 0;
  allPurchaseOrders = 0;

  filterWomenOnly = new FormControl(null);
  womenOnlyPing$ = new BehaviorSubject<boolean>(this.filterWomenOnly.value);

  searchFarmerNameAndSurname = new FormControl(null);
  searchFarmerNameSurnamePing$ = new BehaviorSubject<string>(null);

  reloadPurchaseOrdersPing$ = new BehaviorSubject<boolean>(false);

  semiProductFrom = new FormControl(null);
  facilitySemiProducts: FacilitySemiProductsCodebookService = null;

  semiProductId$: Observable<number> = this.semiProductFrom.valueChanges.pipe(
      startWith(null),
      map(semiProduct => {
        if (semiProduct) { return semiProduct.id; }
        return null;
      })
  );

  private facilityIdChangeSub: Subscription;

  get womenOnlyStatusValue() {
    if (this.filterWomenOnly.value != null) {
      if (this.filterWomenOnly.value) { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.womenCoffee:Women coffee`; }
      else { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.nonWomenCoffee:Non-women coffee`; }
    }
    return null;
  }

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected globalEventManager: GlobalEventManagerService,
    protected facilityControllerService: FacilityControllerService,
    protected authService: AuthService,
    protected companyController: CompanyControllerService,
    private stockOrderControllerService: StockOrderControllerService,
    private codebookTranslations: CodebookTranslations,
    private fileSaverService: FileSaverService,
    protected selUserCompanyService: SelectedUserCompanyService
  ) {
    super(router, route, globalEventManager, facilityControllerService, authService, companyController, selUserCompanyService);
  }

  async ngOnInit(): Promise<void> {

    await super.ngOnInit();

    this.facilityIdChangeSub = this.facilityIdPing$.subscribe(facilityId => this.setFacilitySemiProducts(facilityId));
  }

  ngOnDestroy() {
    if (this.facilityIdChangeSub) {
      this.facilityIdChangeSub.unsubscribe();
    }
  }

  newPurchaseOrder() {

    if (!this.facilityForStockOrderForm.value) {
      const title = $localize`:@@productLabelStock.purchase.warning.title:Missing facility`;
      const message = $localize`:@@productLabelStock.purchase.warning.message:Please select facility before continuing`;
      this.showWarning(title, message);
      return;
    }

    this.router.navigate(['my-stock', 'deliveries', 'facility', this.selectedFacilityId, 'deliveries', 'new']).then();
  }

  newPurchaseOrderBulk() {

    if (!this.facilityForStockOrderForm.value) {
      const title = $localize`:@@productLabelStock.purchase.warning.title:Missing facility`;
      const message = $localize`:@@productLabelStock.purchase.warning.message:Please select facility before continuing`;
      this.showWarning(title, message);
      return;
    }

    this.router.navigate(['my-stock', 'deliveries', 'facility', this.selectedFacilityId, 'deliveries', 'new-bulk']).then();
  }

  async exportDeliveriesExcel(): Promise<void> {

    this.globalEventManager.showLoading(true);
    try {
      const res = await this.stockOrderControllerService.exportDeliveriesByCompany(this.companyId)
          .pipe(take(1))
          .toPromise();

      this.fileSaverService.save(res, 'deliveries.xlsx');
    } finally {
      this.globalEventManager.showLoading(false);
    }
  }

  onShowPO(event) {
    this.showedPurchaseOrders = event;
  }

  onCountAllPO(event) {
    this.allPurchaseOrders = event;
  }

  public setWomenOnly(value: boolean) {
    this.filterWomenOnly.setValue(value);
    this.womenOnlyPing$.next(value);
  }

  searchPurchaseInput(event) {
    this.searchFarmerNameSurnamePing$.next(event);
  }
  
  private setFacilitySemiProducts(facilityId: number) {
    if (facilityId !== null && facilityId !== undefined) {
      this.facilitySemiProducts = new FacilitySemiProductsCodebookService(this.facilityControllerService, facilityId, this.codebookTranslations);
    } else {
      this.facilitySemiProducts = null;
    }
  }
  
  whenFacilityForStockOrderChanged(event: ApiFacility) {
    if (event === null) {
      this.semiProductFrom.setValue(null);
    }
    this.facilityForStockOrderChanged(event);
  }
  
}
