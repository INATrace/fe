import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import _ from 'lodash-es';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ApiUserCustomer } from '../../../../api/model/apiUserCustomer';
import { CompanyControllerService } from '../../../../api/api/companyController.service';
import { defaultEmptyObject, formatDateWithDots, generateFormFromMetadata } from '../../../../shared/utils';
import {
  ApiUserCustomerCooperativeValidationScheme,
  ApiUserCustomerValidationScheme
} from '../../../m-product/product-stakeholders/collector-detail-modal/validation';
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
import { ListEditorManager } from '../../../shared/list-editor/list-editor-manager';
import { ApiUserCustomerCooperative } from '../../../../api/model/apiUserCustomerCooperative';
import { CollectorDetailModalComponent } from '../../../m-product/product-stakeholders/collector-detail-modal/collector-detail-modal.component';
import UserCustomerTypeEnum = ApiUserCustomerCooperative.UserCustomerTypeEnum;
import {BehaviorSubject} from 'rxjs';
import {ApiStockOrder} from '../../../../api/model/apiStockOrder';

@Component({
  selector: 'app-company-farmers-details',
  templateUrl: './company-farmers-details.component.html',
  styleUrls: ['./company-farmers-details.component.scss']
})
export class CompanyFarmersDetailsComponent implements OnInit {

  faTimes = faTimes;

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

  producersListManager;
  codebookAssoc;
  codebookCoop;
  assocCoop;
  assocForm = new FormControl(null);

  genderCodebook = EnumSifrant.fromObject({
    MALE: $localize`:@@collectorDetail.gender.male:Male`,
    FEMALE: $localize`:@@collectorDetail.gender.female:Female`
  });

  get roles() {
    const obj = {};
    obj['FARMER'] = $localize`:@@collectorDetail.roles.farmer:Farmer`;
    obj['COLLECTOR'] = $localize`:@@collectorDetail.roles.collector:Collector`;
    return obj;
  }

  // payments table parameters
  showedPaymentOrders = 0;
  allPaymentOrders = 0;
  selectedPayments: ApiStockOrder[];
  //

  codebookStatus = EnumSifrant.fromObject(this.roles);

  farmerIdPing$ = new BehaviorSubject<number>(this.route.snapshot.params.id);

  // purchase table parameters
  showedPurchaseOrders = 0;
  allPurchaseOrders = 0;
  selectedOrders: ApiStockOrder[];
  //

  sortOptionsPay = [
    {
      key: 'date',
      name: $localize`:@@collectorDetail.sortOptionsPay.date.name:Date`,
    },
    {
      key: 'number',
      name: $localize`:@@collectorDetail.sortOptionsPay.number.name:Receipt number`,
      inactive: true
    },
    {
      key: 'purpose',
      name: $localize`:@@collectorDetail.sortOptionsPay.purpose.name:Payment purpose`,
      inactive: true
    },
    {
      key: 'amount',
      name: $localize`:@@collectorDetail.sortOptionsPay.amount.name:Amount paid to farmer (RWF)`,
      inactive: true
    },
    {
      key: 'amountCollector',
      name: $localize`:@@collectorDetail.sortOptionsPay.amountCollector.name:Amount paid to collector (RWF)`,
      inactive: true
    },
    {
      key: 'purchase',
      name: $localize`:@@collectorDetail.sortOptionsPay.purchase.name:Purchase order`,
      inactive: true
    },
    {
      key: 'status',
      name: $localize`:@@collectorDetail.sortOptionsPay.status.name:Status`,
      inactive: true
    }
  ];

  sortOptionsPO = [
    {
      key: 'date',
      name: $localize`:@@collectorDetail.sortOptionsPO.date.name:Date`,
    },
    {
      key: 'identifier',
      name: $localize`:@@collectorDetail.sortOptionsPO.identifier.name:Name`,
      inactive: true
    },
    {
      key: 'quantity',
      name: $localize`:@@collectorDetail.sortOptionsPO.quantity.name:Quantity (kg)`,
      inactive: true
    },
    {
      key: 'payableAndBalance',
      name: $localize`:@@collectorDetail.sortOptionsPO.payableAndBalance.name:Payable / Balance`,
      inactive: true
    }
  ];

  public areaTranslations = {
    totalCultivatedLabel: $localize`:@@collectorDetail.textinput.totalCultivatedArea.label:Total cultivated area`,
    totalCultivatedPlaceholder: $localize`:@@collectorDetail.textinput.totalCultivatedArea.placeholder:Enter total cultivated area`,
    coffeeCultivatedLabel: $localize`:@@collectorDetail.textinput.coffeeCultivatedArea.label:Area cultivated with coffee`,
    coffeeCultivatedPlaceholder: $localize`:@@collectorDetail.textinput.coffeeCultivatedArea.placeholder:Enter area cultivated with coffee`,
    organicCertifiedLabel: $localize`:@@collectorDetail.textinput.areaOrganicCertified.label:Organic certified area`,
    organicCertifiedPlaceholder: $localize`:@@collectorDetail.textinput.areaOrganicCertified.placeholder:Enter organic certified area`,
  };

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
    this.initData().then(() => {
      if (!this.update) {
        this.newFarmer();
      } else {
        this.editFarmer();
      }
      this.initializeListManager();
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

    this.listOfOrgProducer();
    this.listOfOrgAssociation();
  }

  newFarmer() {
    this.farmerForm = generateFormFromMetadata(ApiUserCustomer.formMetadata(), this.emptyFarmer(), ApiUserCustomerValidationScheme);
  }

  editFarmer() {
    this.prepareEdit();
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

  prepareEdit() {
    if (this.farmer.bank == null) {
      this.farmer.bank = defaultEmptyObject(ApiBankInformation.formMetadata());
    }
  }

  prepareData() {
    this.farmerForm.get('type').setValue(UserCustomerTypeEnum.FARMER);

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
    this.submitted = true;
    if (this.farmerForm.invalid) { return; }
    const data = this.prepareData();

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

  initializeListManager() {
    this.producersListManager = new ListEditorManager<ApiUserCustomerCooperative>(
        this.farmerForm.get('cooperatives') as FormArray,

        CollectorDetailModalComponent.ApiUserCustomerCooperativeEmptyObjectFormFactory(),
        ApiUserCustomerCooperativeValidationScheme
    );
  }

  async listOfOrgProducer() {
    const company = await this.companyService.getCompanyUsingGET(this.companyId).pipe(take(1)).toPromise();

    if (company && company.status === 'OK' && company.data) {
      const companiesObj = {};
      companiesObj[company.data.id] = company.data.name;
      this.codebookCoop = EnumSifrant.fromObject(companiesObj);
      this.assocCoop = companiesObj;
    }
  }

  async listOfOrgAssociation() {
    const res = await this.companyService.getAssociationsUsingGET(this.companyId).pipe(take(1)).toPromise();

    if (res && res.status === 'OK' && res.data) {
      const companiesObj = {};
      for (const company of res.data.items) {
        companiesObj[company.id] = company.name;
      }
      this.codebookAssoc = EnumSifrant.fromObject(companiesObj);
    }
  }

  roleResultFormatter = (value: any) => {
    return this.codebookStatus.textRepresentation(value);
  }

  roleInputFormatter = (value: any) => {
    return this.codebookStatus.textRepresentation(value);
  }

  addAssociation(item, form) {
    if (!item) {
      return;
    }
    if (this.farmerForm.value.associations.some(a => a.company.id === item.id)) {
      form.setValue(null);
      return;
    }
    this.farmerForm.value.associations.push({
      company: {
        id: item.id,
        name: item.name
      }
    });
    setTimeout(() => form.setValue(null));
  }

  deleteAssociation(item, index) {
    this.farmerForm.value.associations.splice(index, 1);
  }

  formatDate(productionDate) {
    if (productionDate) { return formatDateWithDots(productionDate); }
    return '';
  }

  changeSort(event, type) {
    if (type === 'PAYMENT') {
      this.sortPay = event.sortOrder;
      this.listPayments(event.sortOrder);
      return;
    }
    this.sortPO = event.sortOrder;
    this.listPurchaseOrders(this.openBalanceOnly, event.sortOrder);
  }

  setOpenBalanceOnly(action) {
    this.openBalanceOnly = action;
    this.listPurchaseOrders(this.openBalanceOnly, this.sortPO);
  }

  public get areaUnit(): FormControl {
    return this.farmerForm.get('farm.areaUnit') as FormControl;
  }
  
  appendAreaUnit(message: string, unit: string): string {
    if (unit && unit.length > 0) {
      return message + ` (${unit})`;
    }
    return message;
  }

  selectedIdsChanged(event, type?) {
    if (type === 'PURCHASE') {
      this.selectedOrders = event;
    }
    else {
      this.selectedPayments = event;
    }
  }

  onShowPO(event) {
    this.showedPurchaseOrders = event;
  }

  onCountAllPO(event) {
    this.allPurchaseOrders = event;
  }

  onShowPayments(event) {
    this.showedPaymentOrders = event;
  }

  onCountAllPayments(event) {
    this.allPaymentOrders = event;
  }

}
