import { Component, OnInit } from '@angular/core';
import { OrdersTabComponent } from '../orders-tab/orders-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityControllerService } from '../../../../api/api/facilityController.service';
import { SelectedUserCompanyService } from '../../../core/selected-user-company.service';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.scss']
})
export class OrdersDashboardComponent extends OrdersTabComponent implements OnInit {

  rootTab = 0;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected facilityController: FacilityControllerService,
    protected selUserCompanyService: SelectedUserCompanyService
  ) {
    super(router, route, facilityController, selUserCompanyService);
  }

  async ngOnInit(): Promise<void> {
    super.ngOnInit().then();
  }

}
