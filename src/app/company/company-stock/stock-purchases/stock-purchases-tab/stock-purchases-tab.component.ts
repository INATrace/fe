import { Component, OnInit } from '@angular/core';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { StockCoreTabComponent } from '../../stock-core/stock-core-tab/stock-core-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-stock-purchases-tab',
  templateUrl: './stock-purchases-tab.component.html',
  styleUrls: ['./stock-purchases-tab.component.scss']
})
export class StockPurchasesTabComponent extends StockCoreTabComponent implements OnInit {

  showedPurchaseOrders = 0;
  allPurchaseOrders = 0;

  filterWomenOnly = new FormControl(null);
  womenOnlyPing$ = new BehaviorSubject<boolean>(this.filterWomenOnly.value);

  searchFarmerNameAndSurname = new FormControl(null);
  searchFarmerNameSurnamePing$ = new BehaviorSubject<string>(null);

  clickClearCheckboxesPing$ = new BehaviorSubject<boolean>(false);

  reloadPurchaseOrdersPing$ = new BehaviorSubject<boolean>(false);

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected globalEventManager: GlobalEventManagerService,
    protected facilityControllerService: FacilityControllerService
  ) {
    super(router, route, globalEventManager, facilityControllerService);
  }

  get womenOnlyStatusValue() {
    if (this.filterWomenOnly.value != null) {
      if (this.filterWomenOnly.value) { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.womenCoffee:Women coffee`; }
      else { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.nonWomenCoffee:Non-women coffee`; }
    }
    return null;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  newPurchaseOrder() {

    if (!this.facilityForStockOrderForm.value) {
      const title = $localize`:@@productLabelStock.purchase.warning.title:Missing facility`;
      const message = $localize`:@@productLabelStock.purchase.warning.message:Please select facility before continuing`;
      this.showWarning(title, message);
      return;
    }
    // this.router.navigate(['product-labels', this.productId, 'stock', 'purchases', 'facility', this.facilityId, 'purchases', 'new']);
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

}
