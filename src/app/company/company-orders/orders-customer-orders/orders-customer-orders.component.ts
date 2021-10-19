import { Component, OnInit } from '@angular/core';
import { OrdersTabComponent } from '../orders-tab/orders-tab.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orders-customer-orders',
  templateUrl: './orders-customer-orders.component.html',
  styleUrls: ['./orders-customer-orders.component.scss']
})
export class OrdersCustomerOrdersComponent extends OrdersTabComponent implements OnInit {

  rootTab = 2;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(router, route);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
