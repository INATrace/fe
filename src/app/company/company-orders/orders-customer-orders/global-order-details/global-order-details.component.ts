import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyCustomersService } from '../../../../shared-services/company-customers.service';
import { CompanyFacilitiesService } from '../../../../shared-services/company-facilities.service';
import { GradeAbbreviationCodebook } from '../../../../shared-services/grade-abbreviation-codebook';
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

@Component({
  selector: 'app-global-order-details',
  templateUrl: './global-order-details.component.html',
  styleUrls: ['./global-order-details.component.scss']
})
export class GlobalOrderDetailsComponent implements OnInit {

  form: FormGroup;
  submitted = false;

  title: string = null;

  update = true;

  companyId: number;

  userLastChanged = null;
  creatorId: number;

  companyCustomerCodebook: CompanyCustomersService;

  outputFacilitiesCodebook: CompanyFacilitiesService;
  outputFacilityForm = new FormControl(null, Validators.required);

  gradeAbbreviationCodebook: GradeAbbreviationCodebook;

  stockOrdersListManager = null;

  constructor(
    private route: ActivatedRoute,
    private globalEventsManager: GlobalEventManagerService,
    private companyCustomerController: CompanyControllerService,
    private gradeAbbreviationController: GradeAbbreviationControllerService,
    private facilityController: FacilityControllerService,
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

  get outputFacilityId() {
    if (this.outputFacilityForm.value) {
      return this.outputFacilityForm.value.id;
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

  private updateTitle() {
    return $localize`:@@globalOrderEdit.updateTitle:Update order`;
  }

  private reloadProductOrder() {
    this.globalEventsManager.showLoading(true);
    this.submitted = false;
    this.initInitialData().then(
      (resp: any) => {
        this.companyCustomerCodebook = new CompanyCustomersService(this.companyCustomerController, this.companyId);
        this.outputFacilitiesCodebook = new CompanyFacilitiesService(this.facilityController, this.companyId);
        this.gradeAbbreviationCodebook = new GradeAbbreviationCodebook(this.gradeAbbreviationController, this.codebookTranslations);
        if (this.update) {
          this.editStockOrder().then();
        } else {
          this.newOrder();
        }
      }
    );
  }

  private async initInitialData() {

    const action = this.route.snapshot.data.action;

    if (action === 'new') {

      this.update = false;
      this.title = this.newTitle();

    } else if (action === 'update') {

      this.title = this.updateTitle();
      this.update = true;

      // TODO: check and rethink this part
      // if (this.stockOrderId) {
      //   const resp = await this.chainStockOrderService.getStockOrderById(this.stockOrderId).pipe(take(1)).toPromise();
      //   if (resp && resp.status === 'OK' && resp.data) {
      //     this.stockOrder = resp.data;
      //     const resp2 = await this.chainOrderService.getOrder(this.stockOrder.orderId).pipe(take(1)).toPromise();
      //     if (resp2 && resp2.status === 'OK') {
      //       this.order = resp2.data;
      //     }
      //   }
      // }

    } else {
      throw Error('Wrong action.');
    }

    this.creatorId = await this.getCreatorId();
  }

  private async editStockOrder() {

    // TODO: implement edit stock order
    // this.form = generateFormFromMetadata(ChainProductOrder.formMetadata(), this.order, ChainProductOrderValidationScheme);
    // const AFuserIdRes = await this.chainUserService.getUser(this.form.get('creatorId').value).pipe(take(1)).toPromise();
    // this.initializeListManager();
    // this.globalEventsManager.showLoading(false);
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

}
