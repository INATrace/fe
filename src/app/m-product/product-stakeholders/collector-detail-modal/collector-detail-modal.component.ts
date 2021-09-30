import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash-es';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { first, take } from 'rxjs/operators';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { UserCustomerService } from 'src/api-chain/api/userCustomer.service';
// import { BankAccountInfo } from 'src/api-chain/model/bankAccountInfo';
import { ChainLocation } from 'src/api-chain/model/chainLocation';
import { ChainOrganization } from 'src/api-chain/model/chainOrganization';
import { ChainUserCustomer } from 'src/api-chain/model/chainUserCustomer';
import { ContactInfo } from 'src/api-chain/model/contactInfo';
import { FarmInfo } from 'src/api-chain/model/farmInfo';
import { defaultEmptyObject, generateFormFromMetadata, isEmptyDictionary, formatDateWithDots, dbKey } from 'src/shared/utils';
import {
  ChainUserCustomerValidationScheme,
  FarmInfoValidationScheme,
  ContactInfoValidationScheme,
  ChainUserCustomerRoleValidationScheme,
  BankAccountInfoValidationScheme, ApiUserCustomerValidationScheme, ApiUserCustomerCooperativeValidationScheme
} from './validation';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ChainUserCustomerRole } from 'src/api-chain/model/chainUserCustomerRole';
import { BankAccountInfo } from 'src/api-chain/model/bankAccountInfo';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { PaymentsService } from 'src/api-chain/api/payments.service';
import { CountryService } from 'src/app/shared-services/countries.service';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { ThemeService } from 'src/app/shared-services/theme.service';
import { ListEditorManager } from 'src/app/shared/list-editor/list-editor-manager';
import { AuthService } from 'src/app/core/auth.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { ProductControllerService } from '../../../../api/api/productController.service';
import { ApiUserCustomer } from '../../../../api/model/apiUserCustomer';
import { ApiLocation } from '../../../../api/model/apiLocation';
import { ApiFarmInformation } from '../../../../api/model/apiFarmInformation';
import { ApiBankInformation } from '../../../../api/model/apiBankInformation';
import { ApiAddress } from '../../../../api/model/apiAddress';
import { CompanyControllerService } from '../../../../api/api/companyController.service';
import { ApiUserCustomerAssociation } from '../../../../api/model/apiUserCustomerAssociation';
import { ApiUserCustomerCooperative } from '../../../../api/model/apiUserCustomerCooperative';
import { ApiCompany } from '../../../../api/model/apiCompany';

@Component({
  selector: 'app-collector-detail-modal',
  templateUrl: './collector-detail-modal.component.html',
  styleUrls: ['./collector-detail-modal.component.scss']
})
export class CollectorDetailModalComponent implements OnInit {

  faTimes = faTimes;
  title: string = null;
  update: boolean = true;
  organization: ChainOrganization;
  organizationId: string;
  productOrganizationId: string;
  productId;
  chainProductId;
  chainProduct;
  openBalanceOnly: boolean;
  sortPay;
  sortPO;

  returnUrl = this.route.snapshot.queryParams['returnUrl'];

  collector: ApiUserCustomer;

  collectorForm: FormGroup;
  qrCodeSize = 110;
  appName: string = environment.appName;

  submitted: boolean = false;

  userProfile;

  purchaseOrders = [];
  payments = [];
  openBalanceForm: FormControl = new FormControl(0);
  totalPaidFarmerForm: FormControl = new FormControl(0);
  totalBroughtFarmerForm: FormControl = new FormControl(0);

  type = this.route.snapshot.params.type;

  associations: Array<ApiUserCustomerAssociation> = [];
  cooperatives: Array<ApiUserCustomerCooperative> = [];

  constructor(
    private globalEventsManager: GlobalEventManagerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private chainOrganizationService: OrganizationService,
    private chainUserCustomerService: UserCustomerService,
    private chainProductService: ProductService,
    private location: Location,
    public theme: ThemeService,
    private chainStockOrderService: StockOrderService,
    private chainPaymentsService: PaymentsService,
    public countryCodes: CountryService,
    private productService: ProductControllerService,
    private companyService: CompanyControllerService
  ) { }


  async initInitialData() {
    let action = this.route.snapshot.data.action;

    if (!action) return;
    this.organizationId = this.route.snapshot.params.organizationId;
    // standalone on route
    this.productId = this.route.snapshot.params.id;
    let resPO = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    if (resPO && resPO.status === 'OK' && resPO.data) {
      this.productOrganizationId = resPO.data.organizationId;
    }
    if (action === 'new') {
      if (this.type === 'farmers') this.title = $localize`:@@collectorDetail.newFarmer.title:New farmer`;
      else this.title = $localize`:@@collectorDetail.newCollector.title:New collector`;
      this.update = false;
      let resp = await this.chainOrganizationService.getOrganization(this.organizationId).pipe(take(1)).toPromise()
      if (resp && resp.status === 'OK') {
        this.organization = resp.data;
      }
    } else if (action == 'update') {
      if (this.type === 'farmers') this.title = $localize`:@@collectorDetail.editFarmer.title:Edit farmer`;
      else this.title = $localize`:@@collectorDetail.editCollector.title:Edit collector`;
      this.update = true;
      const resp = await this.productService.getUserCustomerUsingGET(this.route.snapshot.params.userCustomerId).pipe(first()).toPromise();
      if (resp && resp.status === 'OK') {
        this.collector = resp.data;
        this.organizationId = resp.data.companyId.toString();
      }
      let resp1 = await this.chainOrganizationService.getOrganization(this.organizationId).pipe(take(1)).toPromise()
      if (resp1 && resp1.status === 'OK') {
        this.organization = resp1.data;
      }
      if (this.type === 'farmers') {
        this.listPurchaseOrders(this.openBalanceOnly, this.sortPO);
        this.listPayments(this.sortPay);
      }

    } else {
      throw Error("Wrong action.")
    }
    // let res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    let res = await this.productService.getProductUsingGET(this.productId).pipe(first()).toPromise();
    if (res && res.status === "OK" && res.data && res.data.id) {
      this.chainProductId = res.data.id;
      this.chainProduct = res.data;
    }

    this.userOrgId = localStorage.getItem("selectedUserCompany");
    if (this.userOrgId) {
      this.owner = (this.productOrganizationId == this.userOrgId);
    }

    this.listOfOrgProducer();
    this.listOfOrgAssociation();
  }

  userOrgId;
  owner: boolean = true;

  ngOnInit(): void {
    this.openBalanceOnly = false;
    this.sortPay = this.sortPO = null;
    this.initInitialData().then(
      (resp: any) => {
        if (this.update) {
          this.editCollector();
        } else {
          this.newCollector();
        }
        this.userProfile = this.authService.currentUserProfile;
      }
    )

  }

  dismiss() {
    this.location.back()
  }

  emptyObject() {
    let obj = defaultEmptyObject(ApiUserCustomer.formMetadata()) as ApiUserCustomer;
    obj.location = defaultEmptyObject(ApiLocation.formMetadata()) as ApiLocation;
    obj.location.address = defaultEmptyObject(ApiAddress.formMetadata()) as ApiAddress;
    obj.bank = defaultEmptyObject(ApiBankInformation.formMetadata()) as ApiBankInformation;
    obj.farm = defaultEmptyObject(ApiFarmInformation.formMetadata()) as ApiFarmInformation;

    return obj
  }


  newCollector() {
    // this.collectorForm = generateFormFromMetadata(ChainUserCustomer.formMetadata(), this.emptyObject(), ChainUserCustomerValidationScheme);
    this.collectorForm = generateFormFromMetadata(ApiUserCustomer.formMetadata(), this.emptyObject(), ApiUserCustomerValidationScheme);
    this.initializeListManager();

  }

  editCollector() {
    this.collectorForm = generateFormFromMetadata(ApiUserCustomer.formMetadata(), this.collector, ApiUserCustomerValidationScheme);
    console.log("collector", this.collector);
    console.log("collector form", this.collectorForm);
    this.prepareEditData();
    this.initializeListManager();
  }

  prepareEditData() {
    for (let cop of this.collectorForm.value.cooperatives) {
      cop.company.id = cop.company.id.toString();
    }

    if (this.collectorForm.get('farm').value == null || isEmptyDictionary(this.collectorForm.get('farm').value)) {
      let farmInfoForm = generateFormFromMetadata(FarmInfo.formMetadata(), {
        ownsFarm: null,
        farmSize: null,
        numberOfTrees: null,
        organicFarm: null,
        fertilizerDescription: null,
        additionalInfo: null
      } as FarmInfo, FarmInfoValidationScheme);
      this.collectorForm.setControl('farm', farmInfoForm);
      this.collectorForm.updateValueAndValidity();
    }
    // if (this.collectorForm.get('contact').value == null || isEmptyDictionary(this.collectorForm.get('contact').value)) {
    //   let contactForm = generateFormFromMetadata(ContactInfo.formMetadata(), {
    //     phone: null,
    //     email: null,
    //     hasSmartPhone: null
    //   } as ContactInfo, ContactInfoValidationScheme);
    //   this.collectorForm.setControl('contactForm', contactForm);
    //   this.collectorForm.updateValueAndValidity();
    // }
    // if (this.collectorForm.get('bankAccountInfo').value == null || isEmptyDictionary(this.collectorForm.get('bankAccountInfo').value)) {
    //   let bankAccountInfoForm = generateFormFromMetadata(BankAccountInfo.formMetadata(), {
    //     accountHoldersName: null,
    //     accountNumber: null,
    //     bankName: null,
    //     branchAddress: null,
    //     country: null
    //   } as BankAccountInfo, BankAccountInfoValidationScheme);
    //   this.collectorForm.setControl('bankAccountInfo', bankAccountInfoForm);
    //   this.collectorForm.updateValueAndValidity();
    // }

  }

  async getOrgName(id) {
    let res = await this.chainOrganizationService.getOrganization(id).pipe(take(1)).toPromise();
    if (res && res.status === "OK" && res.data) {
      return res.data.name;
    }

  }


  async updateCollector() {
    this.submitted = true;
    if (this.collectorForm.invalid) return;
    let data = this.prepareData();
    try {
      this.globalEventsManager.showLoading(true);
      let res;
      if (!this.update) {
        res = await this.productService.addUserCustomerUsingPOST(this.route.snapshot.params.id, this.route.snapshot.params.organizationId, data).toPromise();
      } else {
        res = await this.productService.updateUserCustomerUsingPUT(data).toPromise();
      }
      if (res && res.status == 'OK') {
        this.dismiss();
      }
      // let res = await this.chainUserCustomerService.postUserCustomer(data).pipe(take(1)).toPromise()
      // if (res && res.status == 'OK') {
      //   this.dismiss();
      // }
    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

  prepareData() {
    // (this.collectorForm.get('associations') as FormArray).clear();
    // for (let item of this.assocForForm.value) {
    //   (this.collectorForm.get('associations') as FormArray).push(new FormControl(item));
    // }
    const assocs: Array<ApiUserCustomerAssociation> = [];
    for (const as of this.collectorForm.value.associations) {
      assocs.push(as);
    }

    const coops: Array<ApiUserCustomerCooperative> = [];
    for (const co of this.collectorForm.value.cooperatives) {
      coops.push(co);
    }

    if (this.route.snapshot.params.type === 'farmers') {
      this.collectorForm.get('type').setValue(ApiUserCustomer.TypeEnum.FARMER);
    }
    if (this.route.snapshot.params.type === 'collectors') {
      this.collectorForm.get('type').setValue(ApiUserCustomer.TypeEnum.COLLECTOR);
    }

    if (!this.update) {
      //TODO - FIX ... should be from AFdb
      // this.collectorForm.get("id").setValue(this.route.snapshot.params.collectorId);
      console.log("route params", this.route.snapshot.params);
      // this.collectorForm.get("productId").setValue(this.route.snapshot.params.id);
      this.collectorForm.get("companyId").setValue(this.chainProduct.companyId);
    }


    // let custRoles = this.collectorForm.get("customerRoles").value
    // this.collectorForm.get("customerRoles").setValue(custRoles.map(item => item.id))

    let data = _.cloneDeep(this.collectorForm.value);
    Object.keys(data.location).forEach((key) => (data.location[key] == null) && delete data.location[key]);
    if (data.farmInfo) Object.keys(data.farmInfo).forEach((key) => (data.farmInfo[key] == null) && delete data.farmInfo[key]);
    if (data.contact) Object.keys(data.contact).forEach((key) => (data.contact[key] == null) && delete data.contact[key]);
    if (data.bankAccountInfo) Object.keys(data.bankAccountInfo).forEach((key) => (data.bankAccountInfo[key] == null) && delete data.bankAccountInfo[key]);

    data.associations = assocs;
    data.cooperatives = coops;

    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

    return data;
  }

  get gender() {
    let obj = {}
    obj['MALE'] = $localize`:@@collectorDetail.gender.farmer:Male`;
    obj['FEMALE'] = $localize`:@@collectorDetail.gender.collector:Female`;
    return obj;
  }

  genderCodebook = EnumSifrant.fromObject(this.gender)


  get roles() {
    let obj = {}
    obj['FARMER'] = $localize`:@@collectorDetail.roles.farmer:Farmer`;
    obj['COLLECTOR'] = $localize`:@@collectorDetail.roles.collector:Collector`;
    return obj;
  }

  codebookStatus = EnumSifrant.fromObject(this.roles)

  rolesForm = new FormControl(null)

  roleResultFormatter = (value: any) => {
    return this.codebookStatus.textRepresentation(value)
  }

  roleInputFormatter = (value: any) => {
    return this.codebookStatus.textRepresentation(value)
  }

  //// temp

  async addSelectedRole(role) {
    if (!role) return;
    let formArray = this.collectorForm.get('customerRoles') as FormArray
    if (formArray.value.some(x => x.id === role.id)) {
      this.rolesForm.setValue(null);
      return;
    }
    formArray.push(new FormControl(role))
    formArray.markAsDirty()
    setTimeout(() => this.rolesForm.setValue(null))
  }

  async deleteRole(role) {
    if (!role) return
    let formArray = this.collectorForm.get('customerRoles') as FormArray
    let index = (formArray.value as any[]).findIndex(x => x.id === role.id)
    if (index >= 0) {
      formArray.removeAt(index)
      formArray.markAsDirty()
    }
  }



  assocForm = new FormControl(null)
  coopForm = new FormControl(null)
  assocForForm = new FormArray([])
  coopForForm = new FormArray([])
  async addAssocCoop(item, form, fArray) {
    if (!item) return;
    // do not use triple-equals(===)
    if (fArray.value.some(x => x.id == item.id)) {
      form.setValue(null);
      return;
    }
    fArray.push(new FormControl(item));
    fArray.markAsDirty();
    setTimeout(() => form.setValue(null));
    // if (!item) return;
    // let formArray = fArray as FormArray
    // if (formArray.value.some(x => x.id === item.id)) {
    //   form.setValue(null);
    //   return;
    // }
    // formArray.push(new FormControl(item))
    // formArray.markAsDirty()
    // setTimeout(() => form.setValue(null))
  }

  async deleteAssocCoop(item, fArray) {
    if (!item) return
    let formArray = fArray as FormArray
    let index = (formArray.value as any[]).findIndex(x => x.id === item.id)
    if (index >= 0) {
      formArray.removeAt(index)
      formArray.markAsDirty()
    }
  }

  async addAssoc(item, form) {
    if (this.collectorForm.value.associations.some(a => a.company.id = item.id)) {
      form.setValue(null);
      return;
    }
    this.collectorForm.value.associations.push({
      company: {
        id: item.id,
        name: item.name
      }
    });
    setTimeout(() => form.setValue(null));
  }

  async deleteAssoc(item, index) {
    this.collectorForm.value.associations.splice(index, 1);
  }


  codebookAssoc;
  codebookCoop;
  assocCoop;
  async listOfOrgProducer() {
    const producers = this.chainProduct.associatedCompanies.filter(item => item.type === 'PRODUCER');
    const producersObj = {};
    for (const producer of producers) {
      const res = await this.companyService.getCompanyUsingGET(producer.company.id).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        if (this.owner) {
          producersObj[res.data.id] = res.data.name;
        } else {
          if (this.userOrgId == res.data.id) {
            producersObj[res.data.id] = res.data.name;
          }
        }
      }
    }
    this.codebookCoop = EnumSifrant.fromObject(producersObj);
    this.assocCoop = producersObj;
    // let assoc = this.chainProduct.organizationRoles.filter(item => item.role == "PRODUCER");
    // let assocObj = {};
    // for (let item of assoc) {
    //   let res = await this.chainOrganizationService.getOrganizationByCompanyId(item.companyId).pipe(take(1)).toPromise();
    //   if (res && res.status === "OK" && res.data) {
    //     if (this.owner) {
    //       assocObj[dbKey(res.data)] = res.data.name;
    //     } else {
    //       if (this.userOrgId == dbKey(res.data)) {
    //         assocObj[dbKey(res.data)] = res.data.name;
    //       }
    //     }
    //   }
    // }
    // this.codebookCoop = EnumSifrant.fromObject(assocObj);
    // this.assocCoop = assocObj;
    // console.log("assocCoop", this.assocCoop);
  }

  async listOfOrgAssociation() {
    const associations = this.chainProduct.associatedCompanies.filter(item => item.type === 'ASSOCIATION');
    const associationsObj = {};
    for (const association of associations) {
      const res = await this.companyService.getCompanyUsingGET(association.company.id).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        if (this.owner) {
          associationsObj[res.data.id] = res.data.name;
        } else {
          associationsObj[res.data.id] = res.data.name;
        }
      }
    }
    this.codebookAssoc = EnumSifrant.fromObject(associationsObj);
    // let assoc = this.chainProduct.organizationRoles.filter(item => item.role == "ASSOCIATION");
    // let assocObj = {};
    // for (let item of assoc) {
    //   let res = await this.chainOrganizationService.getOrganizationByCompanyId(item.companyId).pipe(take(1)).toPromise();
    //   if (res && res.status === "OK" && res.data) {
    //     if (this.owner) {
    //       assocObj[dbKey(res.data)] = res.data.name;
    //     } else {
    //       //   associationIds: ['8b7afab6-c9ce-4739-b4b7-2cff8e473304'],//Icyerekezo
    //       //   cooperativeIdsAndRoles: [{ organizationId: 'ade24b49-8548-45b6-ab12-65ce801803db', role: "FARMER" }],//Koakaka
    //       //       associationIds: ['21777c51-8263-4e5c-8b3b-2f03a953dd2a'],//ramba
    //       //       cooperativeIdsAndRoles: [{ organizationId: '7dc83d0b-898c-4fc3-ae7f-1c2c527b5af4', role: "FARMER" }],//musasa
    //       //TODO link together appropriate assoc and producer, check also B2C page
    //       if (dbKey(res.data) === '8b7afab6-c9ce-4739-b4b7-2cff8e473304' && this.userOrgId === 'ade24b49-8548-45b6-ab12-65ce801803db') {//koakaka in icye
    //         assocObj[dbKey(res.data)] = res.data.name;
    //       }
    //       if (dbKey(res.data) === '21777c51-8263-4e5c-8b3b-2f03a953dd2a' && this.userOrgId === '7dc83d0b-898c-4fc3-ae7f-1c2c527b5af4') {//musasa and ramba
    //         assocObj[dbKey(res.data)] = res.data.name;
    //       }
    //     }
    //
    //   }
    // }
    // this.codebookAssoc = EnumSifrant.fromObject(assocObj);
  }

  producersListManager = null;

  initializeListManager() {
    this.producersListManager = new ListEditorManager<ApiUserCustomerCooperative>(
      this.collectorForm.get('cooperatives') as FormArray,

      CollectorDetailModalComponent.ApiUserCustomerCooperativeEmptyObjectFormFactory(),
        ApiUserCustomerCooperativeValidationScheme
    )
  }


  static ChainUserCustomerRoleCreateEmptyObject(): ChainUserCustomerRole {
    let obj = ChainUserCustomerRole.formMetadata();
    return defaultEmptyObject(obj) as ChainUserCustomerRole
  }

  static ChainUserCustomerRoleEmptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(CollectorDetailModalComponent.ChainUserCustomerRoleCreateEmptyObject(), ChainUserCustomerRoleValidationScheme.validators)
      return f
    }
  }

  static ApiUserCustomerCooperativeCreateEmptyObject(): ApiUserCustomerCooperative {
    const obj: ApiUserCustomerCooperative = defaultEmptyObject(ApiUserCustomerCooperative.formMetadata());
    obj.company = defaultEmptyObject(ApiCompany.formMetadata());
    return obj;
  }

  static ApiUserCustomerCooperativeEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(CollectorDetailModalComponent.ApiUserCustomerCooperativeCreateEmptyObject(), ApiUserCustomerCooperativeValidationScheme.validators);
    }
  }


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
  ]

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
  ]


  changeSort(event, type) {
    if (type === 'PAYMENT') {
      this.sortPay = event.sortOrder;
      this.listPayments(event.sortOrder);
      return;
    }
    this.sortPO = event.sortOrder;
    this.listPurchaseOrders(this.openBalanceOnly, event.sortOrder);
  }

  formatDate(productionDate) {
    if (productionDate) return formatDateWithDots(productionDate);
    return "";
  }


  async listPurchaseOrders(openBalance, sort) {
    let openB = 0;
    let totalBrought = 0;
    let res = await this.chainStockOrderService.listPurchaseOrderForUserCustomer(this.collector.id.toString(), openBalance, sort).pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data) this.purchaseOrders = res.data.items;
    for (let item of this.purchaseOrders) {
      if (item.balance) openB += item.balance;
      if (item.totalQuantity) totalBrought += item.totalQuantity;
    }
    this.openBalanceForm.setValue(openB);
    this.totalBroughtFarmerForm.setValue(totalBrought);
  }

  async listPayments(sort) {
    let totalF = 0;
    let res = await this.chainPaymentsService.listPaymentsForRecipientUserCustomer(this.collector.id.toString(), sort).pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data) this.payments = res.data.items;
    for (let item of this.payments) {
      if (item.amount) totalF += item.amount;
    }
    this.totalPaidFarmerForm.setValue(totalF);
  }

  setOpenBalanceOnly(action) {
    this.openBalanceOnly = action;
    this.listPurchaseOrders(this.openBalanceOnly, this.sortPO);
  }
}
