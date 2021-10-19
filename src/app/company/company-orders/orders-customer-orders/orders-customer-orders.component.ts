import { Component, OnInit } from '@angular/core';
import { OrdersTabComponent } from '../orders-tab/orders-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityControllerService } from '../../../../api/api/facilityController.service';

@Component({
  selector: 'app-orders-customer-orders',
  templateUrl: './orders-customer-orders.component.html',
  styleUrls: ['./orders-customer-orders.component.scss']
})
export class OrdersCustomerOrdersComponent extends OrdersTabComponent implements OnInit {

  rootTab = 2;

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
