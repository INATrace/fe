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
import {BeycoTokenService} from '../../../../shared-services/beyco-token.service';

@Component({
  selector: 'app-stock-orders-tab',
  templateUrl: './stock-orders-tab.component.html',
  styleUrls: ['./stock-orders-tab.component.scss']
})
export class StockOrdersTabComponent extends StockCoreTabComponent implements OnInit, OnDestroy {

  showGroupView = true;
  rootTab = 3;

  isBeycoAuthorized = false;

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
    private codebookTranslations: CodebookTranslations,
    private beycoTokenService: BeycoTokenService
  ) {
    super(router, route, globalEventManager, facilityControllerService, authService, companyController);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.beycoTokenService.tokenAvailable$.subscribe(isAvailable => {
      this.isBeycoAuthorized = isAvailable;
    });

    // this.route.queryParams.subscribe(params => {
    //   if (params['code'] && params['scope'] && params['state']) {
    //     this.beycoTokenService.requestToken(params['code']).subscribe(
    //         () => {
    //           this.globalEventManager.push({
    //             action: 'success',
    //             notificationType: 'success',
    //             title: $localize`:@@beycoToken.notification.login.success.title:Beyco application authorized`,
    //             message: $localize`:@@beycoToken.notification.login.success.message:You can now send Beyco orders!`
    //           });
    //         },
    //         (err) => {
    //           this.globalEventManager.push({
    //             action: 'error',
    //             notificationType: 'error',
    //             title: $localize`:@@beycoToken.notification.login.error.title:Error on Beyco authorization`,
    //             message: this.getErrorMessage(err.error)
    //           });
    //         }
    //     );
    //   }
    // });

    this.facilityIdChangeSub = this.facilityIdPing$.subscribe(facilityId => this.setFacilitySemiProducts(facilityId));
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

  getAuthBeyco() {
    // this.beycoTokenService.redirectToBeycoAuthorization('/my-stock/orders/tab');
    this.beycoTokenService.redirectToBeycoAuthorization('/oauth2');
  }

  logoutFromBeyco() {
    this.beycoTokenService.removeToken();
    this.globalEventManager.push({
      action: 'success',
      notificationType: 'success',
      title: $localize`:@@beycoToken.notification.logout.title:Logout from Beyco`,
      message: $localize`:@@beycoToken.notification.logout.message:You successfully logged out!`
    });
  }

  openBeycoOrderFieldList() {
    const stockOrderIds = (this.showGroupView ? this.selectedGroupOrders.map(o => o.groupedIds[0]) : this.selectedOrders.map(o => o.id));
    this.router.navigate(['my-stock', 'beyco', 'list'], { queryParams: { id: stockOrderIds } });
  }

  changeShowGroupView(doShow: boolean) {
    this.showGroupView = doShow;
  }

  // private getErrorMessage(errorField: string): string {
  //   switch (errorField) {
  //     case 'AccessDenied':
  //       return  $localize`:@@beycoToken.notification.login.error.AccessDenied.message:Access to Beyco was denied! Please, try again later!`;
  //     case 'UnknownState':
  //       return 'Beyco authorization was returned with unknown state! Token is ignored!';
  //     default:
  //       return $localize`:@@beycoToken.notification.login.error.default.message:Error occurred while authorizing Beyco application. Please, try again later!`;
  //   }
  // }

}
