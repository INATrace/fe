import { Component, OnInit } from '@angular/core';
import { OrdersTabComponent } from '../orders-tab/orders-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityControllerService } from '../../../../api/api/facilityController.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { setNavigationParameter } from '../../../../shared/utils';
import { ApiCompanyCustomer } from '../../../../api/model/apiCompanyCustomer';
import { CompanyCustomersService } from '../../../shared-services/company-customers.service';
import { CompanyControllerService } from '../../../../api/api/companyController.service';

@Component({
  selector: 'app-orders-customer-orders',
  templateUrl: './orders-customer-orders.component.html',
  styleUrls: ['./orders-customer-orders.component.scss']
})
export class OrdersCustomerOrdersComponent extends OrdersTabComponent implements OnInit {

  rootTab = 2;

  // Controls for company customer dropdown selection component
  companyCustomerForm = new FormControl(null);
  companyCustomerId = null;
  companyCustomerId$ = new BehaviorSubject<number>(null);
  companyCustomerCodebook: CompanyCustomersService;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected facilityController: FacilityControllerService,
    private companyControllerService: CompanyControllerService
  ) {
    super(router, route, facilityController);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.companyCustomerCodebook = new CompanyCustomersService(this.companyControllerService, this.companyId);
  }

  newGlobalOrder() {
    this.router.navigate(['global-order', 'create'], { relativeTo: this.route.parent }).then();
  }

  customerChanged(event: ApiCompanyCustomer) {

    if (event) {
      this.companyCustomerId = event.id;
    } else {
      this.companyCustomerId = null;
      this.companyCustomerForm.setValue(null);
    }

    this.companyCustomerId$.next(this.companyCustomerId);
    setNavigationParameter(this.router, this.route, 'companyCustomerId', this.companyCustomerId);
  }

}
