import { Component, OnInit } from '@angular/core';
import { OrdersTabComponent } from '../orders-tab/orders-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityControllerService } from '../../../../api/api/facilityController.service';

@Component({
  selector: 'app-orders-all-orders',
  templateUrl: './orders-all-orders.component.html',
  styleUrls: ['./orders-all-orders.component.scss']
})
export class OrdersAllOrdersComponent extends OrdersTabComponent implements OnInit {

  rootTab = 1;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected facilityController: FacilityControllerService
  ) {
    super(router, route, facilityController);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
