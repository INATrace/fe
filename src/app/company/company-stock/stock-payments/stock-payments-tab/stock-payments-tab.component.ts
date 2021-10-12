import { Component, OnInit } from '@angular/core';
import { StockCoreTabComponent } from '../../stock-core/stock-core-tab/stock-core-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';

@Component({
  selector: 'app-stock-payments-tab',
  templateUrl: './stock-payments-tab.component.html',
  styleUrls: ['./stock-payments-tab.component.scss']
})
export class StockPaymentsTabComponent extends StockCoreTabComponent implements OnInit {

  rootTab = 2;

  constructor(
      protected router: Router,
      protected route: ActivatedRoute,
      protected globalEventManager: GlobalEventManagerService,
      protected facilityControllerService: FacilityControllerService
  ) {
    super(router, route, globalEventManager, facilityControllerService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
