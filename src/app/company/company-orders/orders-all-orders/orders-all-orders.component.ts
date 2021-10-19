import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersTabComponent } from '../orders-tab/orders-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityControllerService } from '../../../../api/api/facilityController.service';
import { FormControl } from '@angular/forms';
import { FacilitySemiProductsCodebookService } from '../../../shared-services/facility-semi-products-codebook.service';
import { setNavigationParameter } from '../../../../shared/utils';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CodebookTranslations } from '../../../shared-services/codebook-translations';
import { ApiSemiProduct } from '../../../../api/model/apiSemiProduct';

@Component({
  selector: 'app-orders-all-orders',
  templateUrl: './orders-all-orders.component.html',
  styleUrls: ['./orders-all-orders.component.scss']
})
export class OrdersAllOrdersComponent extends OrdersTabComponent implements OnInit, OnDestroy {

  rootTab = 1;

  // Semi-product dropdown selection component
  semiProductFrom = new FormControl(null);
  semiProductsInFacilityCodebook: FacilitySemiProductsCodebookService;
  semiProductId = null;
  semiProductId$ = new BehaviorSubject<string>(null);

  facilityChangedSubs: Subscription;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected facilityController: FacilityControllerService,
    private codebookTranslations: CodebookTranslations
  ) {
    super(router, route, facilityController);
  }

  ngOnInit(): void {

    super.ngOnInit();

    this.facilityChangedSubs = this.selectedFacilityId$.subscribe(facilityId => {
      if (facilityId !== null && facilityId !== undefined) {
        this.semiProductsInFacilityCodebook = new FacilitySemiProductsCodebookService(this.facilityController, facilityId, this.codebookTranslations);
      }
      else {
        this.semiProductsInFacilityCodebook = null;
      }

      this.selectSemiProduct(null);
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.facilityChangedSubs) {
      this.facilityChangedSubs.unsubscribe();
    }
  }

  selectSemiProduct(event: ApiSemiProduct) {

    if (event) {
      this.semiProductId = event.id;
    } else {
      this.semiProductId = null;
      this.semiProductFrom.setValue(null);
    }

    this.semiProductId$.next(this.semiProductId);
    setNavigationParameter(this.router, this.route, 'semiProductId', this.semiProductId);
  }

}
