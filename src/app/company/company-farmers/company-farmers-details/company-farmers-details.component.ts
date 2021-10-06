import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import _ from 'lodash-es';
import { ApiUserCustomer } from '../../../../api/model/apiUserCustomer';
import { CompanyControllerService } from '../../../../api/api/companyController.service';
import { defaultEmptyObject, generateFormFromMetadata } from '../../../../shared/utils';
import { ApiUserCustomerValidationScheme } from '../../../m-product/product-stakeholders/collector-detail-modal/validation';
import { ApiBankInformation } from '../../../../api/model/apiBankInformation';
import { ApiFarmInformation } from '../../../../api/model/apiFarmInformation';
import { ApiLocation } from '../../../../api/model/apiLocation';
import { ApiAddress } from '../../../../api/model/apiAddress';
import { first, take } from 'rxjs/operators';
import { EnumSifrant } from '../../../shared-services/enum-sifrant';
import { ThemeService } from '../../../shared-services/theme.service';
import { environment } from '../../../../environments/environment';
import { GlobalEventManagerService } from '../../../core/global-event-manager.service';
import { ApiCompany } from '../../../../api/model/apiCompany';
import { StockOrderService } from '../../../../api-chain/api/stockOrder.service';
import { PaymentsService } from '../../../../api-chain/api/payments.service';

@Component({
  selector: 'app-company-farmers-details',
  templateUrl: './company-farmers-details.component.html',
  styleUrls: ['./company-farmers-details.component.scss']
})
export class CompanyFarmersDetailsComponent implements OnInit {

  title: string;
  update: boolean;
  company: ApiCompany;
  companyId;
  farmer: ApiUserCustomer;
  farmerForm: FormGroup;
  submitted = false;
  qrCodeSize = 110;
  appName = environment.appName;

  openBalanceOnly = false;
  sortPay = null;
  sortPO = null;
  purchaseOrders = [];
  payments = [];
  openBalanceForm: FormControl = new FormControl(0);
  totalPaidFarmerForm: FormControl = new FormControl(0);
  totalBroughtFarmerForm: FormControl = new FormControl(0);

  genderCodebook = EnumSifrant.fromObject({
    MALE: $localize`:@@collectorDetail.gender.farmer:Male`,
    FEMALE: $localize`:@@collectorDetail.gender.collector:Female`
  });

  constructor(
      private location: Location,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private companyService: CompanyControllerService,
      private globalEventsManager: GlobalEventManagerService,
      private chainStockOrderService: StockOrderService,
      private chainPaymentsService: PaymentsService,
      public theme: ThemeService
  ) { }

  ngOnInit(): void {
    this.initData().then(res => {
      if (!this.update) {
        this.newFarmer();
      } else {
        this.editFarmer();
      }
    });
  }

  async initData() {
    const action = this.route.snapshot.data.action;
    if (!action) { return; }
    this.companyId = localStorage.getItem('selectedUserCompany');

    const c = await this.companyService.getCompanyUsingGET(this.companyId).pipe(take(1)).toPromise();
    if (c && c.status === 'OK') {
      this.company = c.data;
    }

    switch (action) {
      case 'new':
        this.title = $localize`:@@collectorDetail.newFarmer.title:New farmer`;
        this.update = false;
        break;
      case 'update':
        this.title = $localize`:@@collectorDetail.editFarmer.title:Edit farmer`;
        this.update = true;
        console.log('route snapshot', this.route.snapshot);
        const uc = await this.companyService.getUserCustomerUsingGET(this.route.snapshot.params.id).pipe(first()).toPromise();
        if (uc && uc.status === 'OK') {
          this.farmer = uc.data;
        }
        this.listPurchaseOrders(this.openBalanceOnly, this.sortPO);
        this.listPayments(this.sortPay);
        break;
      default:
        throw Error('Wrong action!');
    }
  }

  newFarmer() {
    this.farmerForm = generateFormFromMetadata(ApiUserCustomer.formMetadata(), this.emptyFarmer(), ApiUserCustomerValidationScheme);
    console.log('new form', this.farmerForm);
    console.log('new form location', this.farmerForm.get('location'));
  }

  editFarmer() {
    console.log('farmer', this.farmer);
    this.farmerForm = generateFormFromMetadata(ApiUserCustomer.formMetadata(), this.farmer, ApiUserCustomerValidationScheme);
  }

  emptyFarmer() {
    const farmer: ApiUserCustomer = defaultEmptyObject(ApiUserCustomer.formMetadata());

    farmer.bank = defaultEmptyObject(ApiBankInformation.formMetadata()) as ApiBankInformation;
    farmer.farm = defaultEmptyObject(ApiFarmInformation.formMetadata()) as ApiFarmInformation;
    farmer.location = defaultEmptyObject(ApiLocation.formMetadata()) as ApiLocation;
    farmer.location.address = defaultEmptyObject(ApiAddress.formMetadata()) as ApiAddress;

    return farmer;
  }

  prepareData() {
    if (this.farmerForm.get('hasSmartphone').value === null) {
      this.farmerForm.get('hasSmartphone').setValue(false);
    }

    if (this.farmerForm.get('farm.organic').value === null) {
      this.farmerForm.get('farm.organic').setValue(false);
    }

    const data = _.cloneDeep(this.farmerForm.value);

    Object.keys(data.location).forEach((key) => (data.location[key] == null) && delete data.location[key]);
    if (data.farmInfo) { Object.keys(data.farmInfo).forEach((key) => (data.farmInfo[key] == null) && delete data.farmInfo[key]); }
    if (data.contact) { Object.keys(data.contact).forEach((key) => (data.contact[key] == null) && delete data.contact[key]); }
    if (data.bankAccountInfo) { Object.keys(data.bankAccountInfo).forEach((key) => (data.bankAccountInfo[key] == null) && delete data.bankAccountInfo[key]); }

    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

    return data;
  }

  async listPurchaseOrders(openBalance, sort) {
    let openB = 0;
    let totalBrought = 0;
    const res = await this.chainStockOrderService.listPurchaseOrderForUserCustomer(this.farmer.id.toString(), openBalance, sort).pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data) { this.purchaseOrders = res.data.items; }
    for (const item of this.purchaseOrders) {
      if (item.balance) { openB += item.balance; }
      if (item.totalQuantity) { totalBrought += item.totalQuantity; }
    }
    this.openBalanceForm.setValue(openB);
    this.totalBroughtFarmerForm.setValue(totalBrought);
  }

  async listPayments(sort) {
    let totalF = 0;
    const res = await this.chainPaymentsService.listPaymentsForRecipientUserCustomer(this.farmer.id.toString(), sort).pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data) { this.payments = res.data.items; }
    for (const item of this.payments) {
      if (item.amount) { totalF += item.amount; }
    }
    this.totalPaidFarmerForm.setValue(totalF);
  }

  dismiss() {
    this.location.back();
  }

  async save() {
    console.log('saving');
    this.submitted = true;
    console.log('farmer form', this.farmerForm);
    if (this.farmerForm.invalid) { return; }
    const data = this.prepareData();
    console.log('data', data);

    try {
      this.globalEventsManager.showLoading(true);
      let res;
      if (!this.update) {
        res = await this.companyService.addUserCustomerUsingPOST(this.companyId, data).toPromise();
      } else {
        res = await this.companyService.updateUserCustomerUsingPUT(data).toPromise();
      }
      if (res && res.status === 'OK') {
        this.dismiss();
      }
    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

}
