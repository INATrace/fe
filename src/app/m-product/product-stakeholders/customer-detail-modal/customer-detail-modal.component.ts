import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { generateFormFromMetadata, defaultEmptyObject, dbKey } from 'src/shared/utils';
import { take } from 'rxjs/operators';
import { ChainOrganization } from 'src/api-chain/model/chainOrganization';
import { ChainCompanyCustomer } from 'src/api-chain/model/chainCompanyCustomer';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { CompanyCustomerService } from 'src/api-chain/api/companyCustomer.service';
import { Location } from '@angular/common';
import { ChainLocation } from 'src/api-chain/model/chainLocation';
import _ from 'lodash-es';
import { ChainCompanyCustomerValidationScheme } from './validation';
import { ProductService } from 'src/api-chain/api/product.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { AuthService } from 'src/app/core/auth.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';

@Component({
  selector: 'app-customer-detail-modal',
  templateUrl: './customer-detail-modal.component.html',
  styleUrls: ['./customer-detail-modal.component.scss']
})
export class CustomerDetailModalComponent implements OnInit {

  title: string = null;
  update: boolean = true;

  organization: ChainOrganization;
  organizationId: string;
  productId;
  chainProductId;
  chainProduct;

  customer: ChainCompanyCustomer;
  customerForm: FormGroup;

  submitted: boolean = false;
  userProfile;
  semiProductWithPrices = new FormArray([]);
  faTrashAlt = faTrashAlt;

  constructor(
    private globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private chainOrganizationService: OrganizationService,
    private chainCompanyCustomerService: CompanyCustomerService,
    private authService: AuthService,
    private location: Location,
    private chainProductService: ProductService,
    private chainSemiProductService: SemiProductService
  ) { }

  ngOnInit(): void {

    this.initInitialData().then(
      (resp: any) => {
        if (this.update) {
          this.editCustomer();
        } else {
          this.newCustomer();
        }
        this.setSemiProductPrices();
        this.userProfile = this.authService.currentUserProfile;
      }
    )
  }


  async initInitialData() {
    let action = this.route.snapshot.data.action
    if (!action) return;
    this.organizationId = this.route.snapshot.params.organizationId
    // standalone on route
    this.productId = this.route.snapshot.params.id
    if (action === 'new') {
      this.title = $localize`:@@customerDetail.newCustomer.title:New customer`;
      this.update = false;
      let resp = await this.chainOrganizationService.getOrganization(this.organizationId).pipe(take(1)).toPromise()
      if (resp && resp.status === 'OK') {
        this.organization = resp.data
      }
    } else if (action == 'update') {
      this.title = $localize`:@@customerDetail.updateCustomer.title:Edit customer`;
      this.update = true;
      let resp = await this.chainCompanyCustomerService.getCompanyCustomer(this.route.snapshot.params.companyCustomerId).pipe(take(1)).toPromise()
      if (resp && resp.status === 'OK') {
        this.customer = resp.data;
        this.organizationId = resp.data.organizationId;
      }
      let resp1 = await this.chainOrganizationService.getOrganization(this.organizationId).pipe(take(1)).toPromise()
      if (resp1 && resp1.status === 'OK') {
        this.organization = resp1.data
      }
    } else {
      throw Error("Wrong action.")
    }
    let res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    if (res && res.status === "OK" && res.data && dbKey(res.data)) {
      this.chainProductId = dbKey(res.data);
      this.chainProduct = res.data;
    }

  }

  async setSemiProductPrices() {
    let resSP = await this.chainSemiProductService.listSemiProductsForProduct(this.chainProductId, false, false, true).pipe(take(1)).toPromise();
    if (resSP && resSP.status === "OK" && resSP.data) {
      for (let item of resSP.data.items) {
        (this.semiProductWithPrices as FormArray).push(
          new FormGroup({
            _id: new FormControl(dbKey(item)),
            name: new FormControl(item.name),
            prices: this.fillPricesArray(dbKey(item))
          })
          )
      }
    }
  }

  fillPricesArray(SPid) {
    if (!this.update) return new FormArray([]);
    let tmpArray = new FormArray([]);
    if (this.customerForm.get("semiProductPrices") != null) {
      for (let price of this.customerForm.get("semiProductPrices").value) {
        if (price.id === SPid) {
          tmpArray.push(new FormGroup({
            id: new FormControl(price.id),
            from: new FormControl(price.from),
            to: new FormControl(price.to),
            price: new FormControl(price.price),
            currency: new FormControl(price.currency)
          }))
        }
      }
      return tmpArray;
    }
    return new FormArray([]);
  }

  dismiss() {
    this.location.back()
  }


  emptyObject() {
    let obj = defaultEmptyObject(ChainCompanyCustomer.formMetadata()) as ChainCompanyCustomer;
    obj.location = {
      address: null,
      city: null,
      country: null,
      state: null,
      zip: null,
      latitude: null,
      longitude: null,
      site: null,
      sector: null,
      cell: null,
      village: null,
      isPubliclyVisible: null
    } as ChainLocation;
    return obj
  }


  newCustomer() {
    this.customerForm = generateFormFromMetadata(ChainCompanyCustomer.formMetadata(), this.emptyObject(), ChainCompanyCustomerValidationScheme)
  }

  editCustomer() {
    this.customerForm = generateFormFromMetadata(ChainCompanyCustomer.formMetadata(), this.customer, ChainCompanyCustomerValidationScheme)
  }



  async updateCustomer() {
    this.submitted = true;
    if (this.customerForm.invalid) return;
    let data = this.prepareData();
    if (this.update) {
      // let updateJavaCompanyCustomer = { companyId: data.companyId, name: data.name };
      // let resJava = await this.productController.updateCompanyCustomerUsingPUT(updateJavaCompanyCustomer).pipe(take(1)).toPromise();
      // if (resJava && resJava.status == 'OK') {
      //   this.globalEventsManager.showLoading(false);

      let res = await this.chainCompanyCustomerService.postCompanyCustomer(data).pipe(take(1)).toPromise()
      if (res && res.status == 'OK') {
        this.globalEventsManager.showLoading(false);
        this.dismiss();
      }
      // }

    } else {
      // let newJavaCompanyCustomer = { companyId: this.organization.id, name: data.name };
      // let resJava = await this.productController.addCompanyCustomerUsingPOST(this.productId, this.organization.id, newJavaCompanyCustomer).pipe(take(1)).toPromise();
      // if (resJava && resJava.status == 'OK') {
      //   this.globalEventsManager.showLoading(false);
      //   console.log(resJava);
      //   data.id = resJava.data.id;
      let res = await this.chainCompanyCustomerService.postCompanyCustomer(data).pipe(take(1)).toPromise()
      if (res && res.status == 'OK') {
        this.globalEventsManager.showLoading(false);
        this.dismiss();
      }
      // }

    }

  }

  prepareData() {

    if (!this.update) {
      //TODO - FIX ... should be from AFdb
      // this.customerForm.get("id").setValue(this.route.snapshot.params.customerId);
      this.customerForm.get("productId").setValue(this.productId);
      this.customerForm.get("companyId").setValue(this.organization.id);
      this.customerForm.get("type").setValue("CUSTOMER");
    }

    (this.customerForm.get("semiProductPrices") as FormArray).clear();
    for (let item of this.semiProductWithPrices.value) {
      if (item.prices.length > 0) {
        for (let price of item.prices) {
          (this.customerForm.get("semiProductPrices") as FormArray).push(
            new FormGroup({
              id: new FormControl(dbKey(item)),
              from: new FormControl(price.from),
              to: new FormControl(price.to),
              price: new FormControl(price.price),
              currency: new FormControl(price.currency)
            })
          )
        }
      }
    }

    let data = _.cloneDeep(this.customerForm.value);
    Object.keys(data.location).forEach((key) => (data.location[key] == null) && delete data.location[key]);

    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

    return data;
  }

  addPrice(item) {
    (item.get('prices') as FormArray).push(
      new FormGroup({
        id: new FormControl(dbKey(item.value)),
        from: new FormControl(null),
        to: new FormControl(null),
        price: new FormControl(null)
      })
    );
  }

  removePriceAtIdx(item, idx) {
    (item.get('prices') as FormArray).removeAt(idx);
  }

  get currencyCodes() {
    let obj = {}
    obj['EUR'] = $localize`:@@customerDetail.currencyCodes.eur:EUR`
    obj['USD'] = $localize`:@@customerDetail.currencyCodes.usd:USD`
    obj['RWF'] = $localize`:@@customerDetail.currencyCodes.rwf:RWF`
    return obj;
  }
  codebookCurrencyCodes = EnumSifrant.fromObject(this.currencyCodes)

}
