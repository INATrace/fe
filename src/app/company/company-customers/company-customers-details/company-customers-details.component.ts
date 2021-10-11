import { Component, OnInit } from '@angular/core';
import _ from 'lodash-es';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ChainOrganization } from '../../../../api-chain/model/chainOrganization';
import { ChainCompanyCustomer } from '../../../../api-chain/model/chainCompanyCustomer';
import { FormArray, FormGroup } from '@angular/forms';
import { ApiCompany } from '../../../../api/model/apiCompany';
import { ApiUserCustomer } from '../../../../api/model/apiUserCustomer';
import { GlobalEventManagerService } from '../../../core/global-event-manager.service';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../../../../api-chain/api/organization.service';
import { CompanyCustomerService } from '../../../../api-chain/api/companyCustomer.service';
import { AuthService } from '../../../core/auth.service';
import { Location } from '@angular/common';
import { ProductService } from '../../../../api-chain/api/product.service';
import { SemiProductService } from '../../../../api-chain/api/semiProduct.service';
import { take } from 'rxjs/operators';
import { dbKey, defaultEmptyObject, generateFormFromMetadata } from '../../../../shared/utils';
import { CompanyControllerService } from '../../../../api/api/companyController.service';
import { ApiCompanyCustomer } from '../../../../api/model/apiCompanyCustomer';
import { ApiCompanyCustomerValidationScheme } from './validation';
import { ApiGeoAddress } from '../../../../api/model/apiGeoAddress';
import { ApiCountry } from '../../../../api/model/apiCountry';
import { ApiAddress } from '../../../../api/model/apiAddress';

@Component({
  selector: 'app-company-customers-details',
  templateUrl: './company-customers-details.component.html',
  styleUrls: ['./company-customers-details.component.scss']
})
export class CompanyCustomersDetailsComponent implements OnInit {

  faTrashAlt = faTrashAlt;

  title: string = null;
  update = true;

  organization: ApiCompany;
  organizationId: string;
  productId;
  chainProductId;
  chainProduct;

  customer: ApiCompanyCustomer;
  customerId;
  customerForm: FormGroup;

  submitted = false;
  userProfile;
  semiProductWithPrices = new FormArray([]);

  constructor(
      private globalEventsManager: GlobalEventManagerService,
      private route: ActivatedRoute,
      private chainOrganizationService: OrganizationService,
      private chainCompanyCustomerService: CompanyCustomerService,
      private authService: AuthService,
      private location: Location,
      private chainProductService: ProductService,
      private chainSemiProductService: SemiProductService,
      private companyService: CompanyControllerService
  ) { }

  ngOnInit(): void {
    this.initialize().then(response => {
      if (this.update) {
        this.editCustomer();
      } else {
        this.newCustomer();
      }

    });
  }

  async initialize() {
    const action = this.route.snapshot.data.action;
    if (!action) { return; }
    this.organizationId = localStorage.getItem('selectedUserCompany');
    this.customerId = this.route.snapshot.params.id;
    // standalone on route
    // this.productId = this.route.snapshot.params.id
    if (action === 'new') {
      this.title = $localize`:@@customerDetail.newCustomer.title:New customer`;
      this.update = false;
      // let resp = await this.chainOrganizationService.getOrganization(this.organizationId).pipe(take(1)).toPromise()
      // if (resp && resp.status === 'OK') {
      //   this.organization = resp.data
      // }
    } else if (action === 'update') {
      this.title = $localize`:@@customerDetail.updateCustomer.title:Edit customer`;
      this.update = true;
      const res = await this.companyService.getCompanyCustomerUsingGET(this.customerId).pipe(take(1)).toPromise();
      if (res && res.status === 'OK') {
        this.customer = res.data;
      }
      // let resp = await this.chainCompanyCustomerService.getCompanyCustomer(this.route.snapshot.params.companyCustomerId).pipe(take(1)).toPromise()
      // if (resp && resp.status === 'OK') {
      //   this.customer = resp.data;
      //   this.organizationId = resp.data.organizationId;
      // }
      // let resp1 = await this.chainOrganizationService.getOrganization(this.organizationId).pipe(take(1)).toPromise()
      // if (resp1 && resp1.status === 'OK') {
      //   this.organization = resp1.data
      // }
    } else {
      throw Error('Wrong action.');
    }
    // let res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    // if (res && res.status === "OK" && res.data && dbKey(res.data)) {
    //   this.chainProductId = dbKey(res.data);
    //   this.chainProduct = res.data;
    // }
  }

  newCustomer() {
    this.customerForm = generateFormFromMetadata(ApiCompanyCustomer.formMetadata(), this.emptyCustomer(), ApiCompanyCustomerValidationScheme);
  }

  editCustomer() {
    this.customerForm = generateFormFromMetadata(ApiCompanyCustomer.formMetadata(), this.customer, ApiCompanyCustomerValidationScheme);
  }

  emptyCustomer() {
    const obj: ApiCompanyCustomer = defaultEmptyObject(ApiCompanyCustomer.formMetadata());
    obj.location = defaultEmptyObject(ApiGeoAddress.formMetadata()) as ApiGeoAddress;

    return obj;
  }

  prepareData() {
    const data: ApiCompanyCustomer = _.cloneDeep(this.customerForm.value);
    data.companyId = Number.parseInt(this.organizationId, 10);
    return data;
  }

  dismiss() {
    this.location.back();
  }

  async save() {
    this.submitted = true;
    if (this.customerForm.invalid) {
      return;
    }
    const data = this.prepareData();

    try {
      this.globalEventsManager.showLoading(true);

      let res;
      if (!this.update) {
        res = await this.companyService.createCompanyCustomerUsingPOST(data).toPromise();
      } else {
        res = await this.companyService.updateCompanyCustomerUsingPUT(data).toPromise();
      }

      if (res && res.status === 'OK') {
        this.dismiss();
      }
    } finally {
      this.globalEventsManager.showLoading(false);
    }

  }

}
