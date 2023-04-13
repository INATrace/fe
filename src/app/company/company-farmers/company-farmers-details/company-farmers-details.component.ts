import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash-es';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ApiUserCustomer } from '../../../../api/model/apiUserCustomer';
import { CompanyControllerService } from '../../../../api/api/companyController.service';
import { defaultEmptyObject, generateFormFromMetadata } from '../../../../shared/utils';
import {
  ApiUserCustomerCooperativeValidationScheme,
  ApiUserCustomerValidationScheme
} from '../../company-collectors/company-collectors-details/validation';
import { ApiBankInformation } from '../../../../api/model/apiBankInformation';
import { ApiFarmInformation } from '../../../../api/model/apiFarmInformation';
import { ApiLocation } from '../../../../api/model/apiLocation';
import { ApiAddress } from '../../../../api/model/apiAddress';
import { debounceTime, first, startWith, take } from 'rxjs/operators';
import { EnumSifrant } from '../../../shared-services/enum-sifrant';
import { ThemeService } from '../../../shared-services/theme.service';
import { environment } from '../../../../environments/environment';
import { GlobalEventManagerService } from '../../../core/global-event-manager.service';
import { ApiCompany } from '../../../../api/model/apiCompany';
import { ListEditorManager } from '../../../shared/list-editor/list-editor-manager';
import { ApiUserCustomerCooperative } from '../../../../api/model/apiUserCustomerCooperative';
import UserCustomerTypeEnum = ApiUserCustomerCooperative.UserCustomerTypeEnum;
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiStockOrder } from '../../../../api/model/apiStockOrder';
import { ApiCertification } from '../../../../api/model/apiCertification';
import { ApiCertificationValidationScheme } from '../../../m-product/product-label/validation';
import { CompanyProductTypesService } from '../../../shared-services/company-product-types.service';
import { ApiProductType } from '../../../../api/model/apiProductType';
import { ListNotEmptyValidator } from '../../../../shared/validation';
import { ApiPayment } from '../../../../api/model/apiPayment';
import {ApiPlantInformation} from '../../../../api/model/apiPlantInformation';

@Component({
  selector: 'app-company-farmers-details',
  templateUrl: './company-farmers-details.component.html',
  styleUrls: ['./company-farmers-details.component.scss']
})
export class CompanyFarmersDetailsComponent implements OnInit, OnDestroy {

  faTimes = faTimes;

  subscriptions: Subscription[] = [];

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
  purchaseOrders = [];
  payments = [];

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
  selectedPayments: ApiPayment[];

  codebookStatus = EnumSifrant.fromObject(this.roles);

  farmerIdPing$ = new BehaviorSubject<number>(this.route.snapshot.params.id);
  productTypesForm = new FormControl(null);
  productTypes: Array<ApiProductType> = [];
  productTypesCodebook: CompanyProductTypesService;
  selectedProductTypesForm = new FormControl(null, [ListNotEmptyValidator()]);

  // purchase table parameters
  showedPurchaseOrders = 0;
  allPurchaseOrders = 0;
  selectedOrders: ApiStockOrder[];

  certificationListManager = null;

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
    plantCultivatedLabel: $localize`:@@collectorDetail.textinput.plantCultivatedArea.label:Area cultivated with`,
    plantCultivatedPlaceholder: $localize`:@@collectorDetail.textinput.plantCultivatedArea.placeholder:Enter area cultivated with`,
    organicCertifiedLabel: $localize`:@@collectorDetail.textinput.areaOrganicCertified.label:Organic certified area`,
    organicCertifiedPlaceholder: $localize`:@@collectorDetail.textinput.areaOrganicCertified.placeholder:Enter organic certified area`,
    numberOfPlantsLabel: $localize`:@@collectorDetail.textinput.numberOfPlants.label:Number of plants`,
    numberOfPlantsPlaceholder: $localize`:@@collectorDetail.textinput.numberOfPlants.placeholder:Enter number of plants`,
  };

  constructor(
      private location: Location,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private companyService: CompanyControllerService,
      private globalEventsManager: GlobalEventManagerService,
      public theme: ThemeService
  ) { }

  static ApiUserCustomerCooperativeCreateEmptyObject(): ApiUserCustomerCooperative {
    const obj: ApiUserCustomerCooperative = defaultEmptyObject(ApiUserCustomerCooperative.formMetadata());
    obj.company = defaultEmptyObject(ApiCompany.formMetadata());
    return obj;
  }

  static ApiUserCustomerCooperativeEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(CompanyFarmersDetailsComponent.ApiUserCustomerCooperativeCreateEmptyObject(),
        ApiUserCustomerCooperativeValidationScheme.validators);
    };
  }

  static ApiCertificationCreateEmptyObject(): ApiCertification {
    const obj = ApiCertification.formMetadata();
    return defaultEmptyObject(obj) as ApiCertification;
  }

  static ApiCertificationEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(CompanyFarmersDetailsComponent.ApiCertificationCreateEmptyObject(), ApiCertificationValidationScheme.validators);
    };
  }

  get certifications(): AbstractControl[] {
    return (this.farmerForm.get('certifications') as FormArray).controls;
  }

  get farmPlantInfos(): AbstractControl[] {
    return (this.farmerForm.get('farm.plantInformationList') as FormArray).controls;
  }

  ngOnInit(): void {
    this.initData().then(() => {
      if (!this.update) {
        this.newFarmer();
      } else {
        this.editFarmer();
      }

      this.farmerForm.setControl('productTypes', this.selectedProductTypesForm);

      this.selectedProductTypesForm.setValue(this.productTypes);

      this.productTypesCodebook = new CompanyProductTypesService(this.companyService, this.companyId);

      this.initializeListManager();
      this.updateAreaUnitValidators();
      this.initValueChangeListeners();
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
        // this code sets the default product type, when only 1 is available
        const defaultProdTypeCheck = await this.companyService.getCompanyProductTypesUsingGET(this.companyId).pipe(take(1)).toPromise();
        if (defaultProdTypeCheck && defaultProdTypeCheck.status === 'OK') {
          if (defaultProdTypeCheck.data.count === 1) {
            this.productTypes = defaultProdTypeCheck.data.items;
          }
        }
        break;
      case 'update':
        this.title = $localize`:@@collectorDetail.editFarmer.title:Edit farmer`;
        this.update = true;
        const uc = await this.companyService.getUserCustomerUsingGET(this.route.snapshot.params.id).pipe(first()).toPromise();
        if (uc && uc.status === 'OK') {
          this.farmer = uc.data;
          this.productTypes = uc.data.productTypes;
        }
        break;
      default:
        throw Error('Wrong action!');
    }

    this.listOfOrgProducer().then();
    this.listOfOrgAssociation().then();
  }

  private prefillFarmPlantInformation(): void {
    const listControls = (this.farmerForm.get('farm.plantInformationList') as FormArray).controls;
    const newListControls: AbstractControl[] = [];
    listControls.forEach(control => {
      const plantInformation = control.value as ApiPlantInformation;

      const formGroup = new FormGroup({
        productType: new FormControl(plantInformation.productType),
        plantCultivatedArea: new FormControl(plantInformation.plantCultivatedArea),
        numberOfPlants: new FormControl(plantInformation.numberOfPlants)
      });

      this.addControlValueChangeListener(formGroup.get('plantCultivatedArea') as FormControl);

      newListControls.push(formGroup);
    });

    (this.farmerForm.get('farm.plantInformationList') as FormArray).clear();

    newListControls.forEach(newControl => {
      (this.farmerForm.get('farm.plantInformationList') as FormArray).push(newControl);
    });
  }

  private initFarmPlantInformation(): void {

    this.addNewFarmPlantInformation(null);
  }

  private addNewFarmPlantInformation(productType: ApiProductType): void {

    const formGroup = new FormGroup({
      productType: new FormControl(productType),
      plantCultivatedArea: new FormControl(null),
      numberOfPlants: new FormControl(null)
    });

    this.addControlValueChangeListener(formGroup.get('plantCultivatedArea') as FormControl);

    (this.farmerForm.get('farm.plantInformationList') as FormArray).push(formGroup);
  }

  private removeFarmPlantInformation(productType: ApiProductType): void {

    const plantInfoListArray = this.farmerForm.get('farm.plantInformationList') as FormArray;

    const resultArrayControls = plantInfoListArray.controls.filter(control => control.get('productType').value.id !== productType.id);

    plantInfoListArray.clear();
    resultArrayControls.forEach(res => plantInfoListArray.push(res));
  }


  initValueChangeListeners() {
    this.subscriptions.push(this.areaUnit.valueChanges.pipe(
      startWith(null),
      debounceTime(100)).subscribe(
      val => {
        if (val !== null && val !== undefined) {
          this.updateAreaUnitValidators();
        }
      }
    ));
    this.subscriptions.push(this.totalCultivatedArea.valueChanges.pipe(
      startWith(null),
      debounceTime(100)).subscribe(
      val => {
        if (val !== null && val !== undefined) {
          this.updateAreaUnitValidators();
        }
      }
    ));
    this.subscriptions.push(this.areaOrganicCertified.valueChanges.pipe(
      startWith(null),
      debounceTime(100)).subscribe(
      val => {
        if (val !== null && val !== undefined) {
          this.updateAreaUnitValidators();
        }
      }
    ));
  }

  private addControlValueChangeListener(control: FormControl) {
    this.subscriptions.push(control.valueChanges.pipe(
      startWith(null),
      debounceTime(100)).subscribe(
      val => {
        if (val !== null && val !== undefined) {
          this.updateAreaUnitValidators();
        }
      }
    ));
  }

  newFarmer() {
    this.farmerForm = generateFormFromMetadata(ApiUserCustomer.formMetadata(), this.emptyFarmer(), ApiUserCustomerValidationScheme);

    this.initFarmPlantInformation();
  }

  editFarmer() {
    this.prepareEdit();
    this.farmerForm = generateFormFromMetadata(ApiUserCustomer.formMetadata(), this.farmer, ApiUserCustomerValidationScheme);

    this.prefillFarmPlantInformation();
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

  dismiss() {
    this.location.back();
  }

  async addSelectedProductType(productType: ApiProductType) {
    if (!productType) {
      return;
    }
    if (this.productTypes.some(pt => pt?.id === productType?.id)) {
      setTimeout(() => this.productTypesForm.setValue(null));
      return;
    }
    this.productTypes.push(productType);
    setTimeout(() => {
      this.selectedProductTypesForm.setValue(this.productTypes);
      this.farmerForm.markAsDirty();
      this.productTypesForm.setValue(null);
      this.addNewFarmPlantInformation(productType);
    });
  }

  deleteProductType(idx: number) {
    this.confirmProductTypeRemove().then(confirmed => {
      if (confirmed) {
        const productType = this.productTypes[idx];
        this.productTypes.splice(idx, 1);
        setTimeout(() => this.selectedProductTypesForm.setValue(this.productTypes));
        this.farmerForm.markAsDirty();
        this.removeFarmPlantInformation(productType);
      }
    });
  }

  private async confirmProductTypeRemove(): Promise<boolean> {

    const result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@companyDetailProductTypeModal.removeProductType.confirm.message:Are you sure you want to remove the product type?`,
      options: {
        centered: true
      }
    });

    return result === 'ok';
  }

  async save() {
    this.submitted = true;

    if (this.farmerForm.invalid) {
      return;
    }
    if (this.checkNullEmpty(this.areaUnit) && this.checkAreaFieldsRequired()){
      this.updateAreaUnitValidators();
      return;
    }

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
        CompanyFarmersDetailsComponent.ApiUserCustomerCooperativeEmptyObjectFormFactory(),
        ApiUserCustomerCooperativeValidationScheme
    );

    this.certificationListManager = new ListEditorManager<ApiCertification>(
      (this.farmerForm.get('certifications')) as FormArray,
      CompanyFarmersDetailsComponent.ApiCertificationEmptyObjectFormFactory(),
      ApiCertificationValidationScheme
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

  updateAreaUnitValidators() {
    this.areaUnit.clearValidators();
    this.areaUnit.setValidators(
      this.checkAreaFieldsRequired() ?
        [Validators.required] : []
    );
    this.farmerForm.markAllAsTouched();
    this.farmerForm.updateValueAndValidity();
  }

  get checkAreaFieldInvalid() {
    return this.checkNullEmpty(this.areaUnit) && this.checkAreaFieldsRequired();
  }

  checkAreaFieldsRequired() {
    return (!this.checkNullEmpty(this.totalCultivatedArea) ||
      this.checkPlantsCutivatedAreaFields() ||
      !this.checkNullEmpty(this.areaOrganicCertified));
  }

  checkNullEmpty(control: FormControl){
    return control.value === null || control.value === undefined || control.value === '';
  }

  checkPlantsCutivatedAreaFields() {
    const controls = (this.farmerForm.get('farm.plantInformationList') as FormArray).controls;
    return controls.some(control => !this.checkNullEmpty(control.get('plantCultivatedArea') as FormControl));
  }

  public get areaUnit(): FormControl {
    return this.farmerForm.get('farm.areaUnit') as FormControl;
  }

  public get totalCultivatedArea(): FormControl {
    return this.farmerForm.get('farm.totalCultivatedArea') as FormControl;
  }

  public get areaOrganicCertified(): FormControl {
    return this.farmerForm.get('farm.areaOrganicCertified') as FormControl;
  }
  
  appendAreaUnit(message: string, unit: string): string {
    if (unit && unit.length > 0) {
      return message + ` (${unit})`;
    }
    return message;
  }

  getProductTypeName(index: number): string {
    const selectedControl = (this.farmerForm.get('farm.plantInformationList') as FormArray).controls[index];
    const productType = selectedControl.get('productType')?.value;
    return (productType) ? productType.name : '';
  }

  appendAreaUnitAndProductType(message: string, unit: string, index: number): string {
    const productTypeName = this.getProductTypeName(index);
    if (unit && unit.length > 0) {
      return message + ` ${productTypeName} (${unit})`;
    }
    return message + ` ${productTypeName}`;
  }

  appendProductType(message: string, index: number): string {
    const selectedControl = (this.farmerForm.get('farm.plantInformationList') as FormArray).controls[index];
    const productType = selectedControl.get('productType')?.value;
    const productTypeName = (productType) ? `(${productType.name})` : '';
    return message + ` ${productTypeName}`;
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

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
