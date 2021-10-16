import { Component, OnInit } from '@angular/core';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { StockCoreTabComponent } from '../../stock-core/stock-core-tab/stock-core-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { EnumSifrant } from '../../../../shared-services/enum-sifrant';
import { dateAtMidnightISOString } from '../../../../../shared/utils';
import { QuoteOrdersOnOrganizationStandaloneService } from '../../../../shared-services/quote-orders-on-organization-standalone.service';
import { SortOption } from '../../../../shared/result-sorter/result-sorter-types';
import { AuthService } from '../../../../core/auth.service';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';

export interface SeasonalData {
  totalSeason?: any;
  totalOrder?: any;
  paymentAdvanced?: any;
  paymentCherry?: any;
  paymentBonus?: any;
  paymentPremium?: any;
  ordersTotalPropToFullFilled?: any;
}

@Component({
  selector: 'app-stock-purchases-tab',
  templateUrl: './stock-purchases-tab.component.html',
  styleUrls: ['./stock-purchases-tab.component.scss']
})
export class StockPurchasesTabComponent extends StockCoreTabComponent implements OnInit {

  rootTab = 0;

  showedPurchaseOrders = 0;
  allPurchaseOrders = 0;

  filterWomenOnly = new FormControl(null);
  womenOnlyPing$ = new BehaviorSubject<boolean>(this.filterWomenOnly.value);

  searchFarmerNameAndSurname = new FormControl(null);
  searchFarmerNameSurnamePing$ = new BehaviorSubject<string>(null);

  clickClearCheckboxesPing$ = new BehaviorSubject<boolean>(false);

  reloadPurchaseOrdersPing$ = new BehaviorSubject<boolean>(false);

  seasonalData: SeasonalData = {};

  fromSeasonalFilterDate = new FormControl(null, Validators.required);
  toSeasonalFilterDate = new FormControl(null, Validators.required);
  submitSeasonalData = false;

  producerListForm = new FormControl(null, Validators.required);
  producerListFormReadOnly = false;

  orderListForm = new FormControl(null);
  orderListCheckbox = new FormControl(true);

  codebookCoop: EnumSifrant;

  quoteOrdersOnOrganizationCodebook: QuoteOrdersOnOrganizationStandaloneService;

  sortOptionsSeasonalData: SortOption[] = [
    {
      key: 'totalSeason',
      name: $localize`:@@productLabelStock.sortOptionsSeasonalData.totalSeason.name:Total purchased (kg)`,
      inactive: true
    },
    {
      key: 'totalOrder',
      name: $localize`:@@productLabelStock.sortOptionsSeasonalData.totalOrder.name:Total purchased in selected order(s) (kg)`,
      inactive: true
    },
    {
      key: 'paymentAdvanced',
      name: $localize`:@@productLabelStock.sortOptionsSeasonalData.paymentAdvanced.name:Advanced payment (RWF)`,
      inactive: true
    },
    {
      key: 'paymentCherry',
      name: $localize`:@@productLabelStock.sortOptionsSeasonalData.paymentCherry.name:Cherry payment (RWF)`,
      inactive: true
    },
    {
      key: 'paymentBonus',
      name: $localize`:@@productLabelStock.sortOptionsSeasonalData.paymentBonus.name:Member bonus (RWF)`,
      inactive: true
    },
    {
      key: 'paymentPremium',
      name: $localize`:@@productLabelStock.sortOptionsSeasonalData.paymentPremium.name:AF Women premium (RWF)`,
      inactive: true
    }
  ];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected globalEventManager: GlobalEventManagerService,
    protected facilityControllerService: FacilityControllerService,
    protected authService: AuthService,
    protected companyController: CompanyControllerService,
  ) {
    super(router, route, globalEventManager, facilityControllerService, authService, companyController);
  }

  get womenOnlyStatusValue() {
    if (this.filterWomenOnly.value != null) {
      if (this.filterWomenOnly.value) { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.womenCoffee:Women coffee`; }
      else { return $localize`:@@productLabelStockProcessingOrderDetail.womensOnlyStatus.nonWomenCoffee:Non-women coffee`; }
    }
    return null;
  }

  get isDataAvailable() {
    return Object.keys(this.seasonalData).length > 0;
  }

  get orderListFormReadOnly() {
    return this.orderListCheckbox.value;
  }

  get orderListError() {
    return (this.orderListCheckbox.value != null && !this.orderListCheckbox.value && !this.orderListForm.value);
  }

  get showSeasonalButtonShowEnable() {
    return !(this.fromSeasonalFilterDate.invalid || this.toSeasonalFilterDate.invalid ||
      this.producerListForm.invalid || this.orderListError);
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

    this.router.navigate(['my-stock', 'purchases', 'facility', this.selectedFacilityId, 'purchases', 'new']).then();
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

  newSeasonalPayment() {
    // const poIds = [];
    // if (this.orderListForm.value === null) {
    //   const orders = await this.quoteOrdersOnOrganizationCodebook.getAllCandidates().pipe(take(1)).toPromise();
    //   for (const item of orders) {
    //     poIds.push(dbKey(item));
    //   }
    // } else {
    //   poIds.push(dbKey(this.orderListForm.value));
    // }
    // this.router.navigate(['product-labels', this.productId, 'stock', 'payments', 'purchases', 'bulk-payment', poIds.toString(), 'new', 'BONUS']);
  }

  setQuoteOrdersForSeasonal() {

    // if (this.producerListForm.value && this.fromSeasonalFilterDate.value && this.toSeasonalFilterDate.value) {
    //
    //   const from = dateAtMidnightISOString(this.fromSeasonalFilterDate.value);
    //   const to = dateAtMidnightISOString(this.toSeasonalFilterDate.value);
    //   this.quoteOrdersOnOrganizationCodebook =
    //     new QuoteOrdersOnOrganizationStandaloneService(this.chainStockOrderService, this.producerListForm.value, from, to);
    // }
    // this.seasonalData = {};
  }

  clickOrderListCheckbox() {
    if (this.orderListCheckbox.value) { this.orderListForm.setValue(null); }
    this.seasonalData = {};
  }

  public async showSeasonalPayments() {

    this.globalEventManager.showLoading(true);
    this.submitSeasonalData = true;

    if (this.fromSeasonalFilterDate.invalid || this.toSeasonalFilterDate.invalid || this.producerListForm.invalid) {
      this.globalEventManager.showLoading(false);
      return;
    }

    if (this.producerListForm.value) {
      const from = dateAtMidnightISOString(this.fromSeasonalFilterDate.value);
      const to = dateAtMidnightISOString(this.toSeasonalFilterDate.value);

      let resp;
      if (this.orderListForm.value) {
        // resres = await this.chainStockOrderService
        //   .getSeasonalStatisticsForOrganization(this.producerListForm.value, from, to, this.orderListForm.value._id)
        //   .pipe(take(1)).toPromise();
      }
      else {
        // resres = await this.chainStockOrderService
        //   .getSeasonalStatisticsForOrganization(this.producerListForm.value, from, to, null)
        //   .pipe(take(1)).toPromise();
      }

      if (resp && resp.status === 'OK' && resp.data) {
        this.seasonalData = {
          totalSeason: resp.data.totalSeason,
          totalOrder: resp.data.totalOrder,
          paymentAdvanced: resp.data.paymentAdvanced,
          paymentCherry: resp.data.paymentCherry,
          paymentBonus: resp.data.paymentBonus,
          paymentPremium: resp.data.paymentPremium,
          ordersTotalPropToFullFilled: resp.data.ordersTotalPropToFullFilled
        };
        this.globalEventManager.showLoading(false);
      } else {
        this.globalEventManager.showLoading(false);
      }
    } else {
      this.globalEventManager.showLoading(false);
    }
  }

}
