import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyCustomersService } from '../../../../shared-services/company-customers.service';
import { CompanyFacilitiesService } from '../../../../shared-services/company-facilities.service';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';
import { GradeAbbreviationControllerService } from '../../../../../api/api/gradeAbbreviationController.service';
import { CodebookTranslations } from '../../../../shared-services/codebook-translations';
import { take } from 'rxjs/operators';
import { defaultEmptyObject, generateFormFromMetadata } from '../../../../../shared/utils';
import { ActivatedRoute } from '@angular/router';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { AuthService } from '../../../../core/auth.service';
import { ApiProductOrderValidationScheme } from './validation';
import { ApiProductOrder } from '../../../../../api/model/apiProductOrder';
import { ListEditorManager } from '../../../../shared/list-editor/list-editor-manager';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { ApiStockOrderValidationScheme } from './product-order-item/validation';
import { Location } from '@angular/common';
import { ApiFacility } from '../../../../../api/model/apiFacility';

@Component({
  selector: 'app-global-order-details',
  templateUrl: './global-order-details.component.html',
  styleUrls: ['./global-order-details.component.scss']
})
export class GlobalOrderDetailsComponent implements OnInit {

  form: FormGroup;
  submitted = false;

  title: string = null;

  companyId: number;
  companyCurrency: string;

  userLastChanged = null;
  creatorId: number;

  companyCustomerCodebook: CompanyCustomersService;

  outputFacilitiesCodebook: CompanyFacilitiesService;
  outputFacilityForm = new FormControl(null, Validators.required);

  stockOrdersListManager = null;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private globalEventsManager: GlobalEventManagerService,
    private companyCustomerController: CompanyControllerService,
    private gradeAbbreviationController: GradeAbbreviationControllerService,
    private facilityController: FacilityControllerService,
    private companyController: CompanyControllerService,
    private codebookTranslations: CodebookTranslations,
    private authService: AuthService
  ) { }

  static StockOrderItemCreateEmptyObject(): ApiStockOrder {
    const obj = ApiStockOrder.formMetadata();
    return defaultEmptyObject(obj) as ApiStockOrder;
  }

  static StockOrderItemEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(GlobalOrderDetailsComponent.StockOrderItemCreateEmptyObject(), ApiStockOrderValidationScheme.validators);
    };
  }

  get orderItemsFormArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get outputFacility() {
    if (this.outputFacilityForm.value) {
      return this.outputFacilityForm.value as ApiFacility;
    }
    return null;
  }

  ngOnInit(): void {
    this.companyId = Number(localStorage.getItem('selectedUserCompany'));
    this.reloadProductOrder();
  }

  private async getCreatorId() {
    const profile = await this.authService.userProfile$.pipe(take(1)).toPromise();
    if (profile) {
      return profile.id;
    }
    return null;
  }

  private newTitle() {
    return $localize`:@@globalOrderEdit.newTitle:New order`;
  }

  private reloadProductOrder() {
    this.globalEventsManager.showLoading(true);
    this.submitted = false;
    this.initInitialData().then(
      () => {

        this.companyCustomerCodebook = new CompanyCustomersService(this.companyCustomerController, this.companyId);
        this.outputFacilitiesCodebook = new CompanyFacilitiesService(this.facilityController, this.companyId);

        this.newOrder();
      }
    );
  }

  private async initInitialData() {

    this.title = this.newTitle();
    this.creatorId = await this.getCreatorId();
    const companyRes = await this.companyController.getCompanyUsingGET(this.companyId).pipe(take(1)).toPromise();
    if (companyRes && companyRes.status === 'OK') {
      this.companyCurrency = companyRes.data?.currency?.code;
    }
  }

  private newOrder() {

    // Generate the initial Angular reactive form
    this.form = generateFormFromMetadata(ApiProductOrder.formMetadata(), {}, ApiProductOrderValidationScheme);

    this.initializeListManager();
    this.globalEventsManager.showLoading(false);
  }

  private initializeListManager() {
    this.stockOrdersListManager = new ListEditorManager<ApiStockOrder>(
      this.orderItemsFormArray,
      GlobalOrderDetailsComponent.StockOrderItemEmptyObjectFormFactory(),
      ApiStockOrderValidationScheme
    );
  }

  dismiss() {
    this.location.back();
  }

  async saveProductOrder() {
    // TODO: implement
  }

}
