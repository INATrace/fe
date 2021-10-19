import { Component, OnInit } from '@angular/core';
import { OrdersTabComponent } from '../orders-tab/orders-tab.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.scss']
})
export class OrdersDashboardComponent extends OrdersTabComponent implements OnInit {

  rootTab = 0;

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
