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
import { SelectedUserCompanyService } from '../../../core/selected-user-company.service';

@Component({
  selector: 'app-placed-orders',
  templateUrl: './placed-orders.component.html',
  styleUrls: ['./placed-orders.component.scss']
})
export class PlacedOrdersComponent extends OrdersTabComponent implements OnInit {

  rootTab = 1;

  // Controls for company customer dropdown selection component
  companyCustomerForm = new FormControl(null);
  companyCustomerId = null;
  companyCustomerId$ = new BehaviorSubject<number>(null);
  companyCustomerCodebook: CompanyCustomersService;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected facilityController: FacilityControllerService,
    private companyControllerService: CompanyControllerService,
    protected selUserCompanyService: SelectedUserCompanyService
  ) {
    super(router, route, facilityController, selUserCompanyService);
  }

  async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.companyCustomerCodebook = new CompanyCustomersService(this.companyControllerService, this.companyId);
  }

  addCustomerOrder() {
    this.router.navigate(['customer-order', 'add'], { relativeTo: this.route.parent }).then();
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
