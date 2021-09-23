import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import _ from 'lodash-es';
import { take } from 'rxjs/operators';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ChainMeasureUnitType } from 'src/api-chain/model/chainMeasureUnitType';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { ProductControllerService } from 'src/api/api/productController.service';
import { ApiProductListResponse } from 'src/api/model/apiProductListResponse';
import { ActiveFacilitiesForOrganizationService } from 'src/app/shared-services/active-facilities-for-organization.service';
import { ActiveMeasureUnitTypeService } from 'src/app/shared-services/active-measure-unit-types.service';
import { ActiveProductsService } from 'src/app/shared-services/active-products.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ChainStockOrderValidationScheme } from './validation';

@Component({
  selector: 'app-product-label-stock-sku-modal',
  templateUrl: './product-label-stock-sku-modal.component.html',
  styleUrls: ['./product-label-stock-sku-modal.component.scss']
})
export class ProductLabelStockSkuModalComponent implements OnInit {

  @Input()
  update: Boolean = true;

  @Input()
  title: String = null;

  @Input()
  sku: ChainStockOrder = null;

  @Input()
  organizationId: string = null;

  @Input()
  public saveCallback: () => string;

  form: FormGroup;
  submitted: boolean = false;
  productForm = new FormControl(null, Validators.required);
  facilityForm = new FormControl(null, Validators.required);
  measureUnitForm = new FormControl(null, Validators.required);

  constructor(
    public activeModal: NgbActiveModal,
    private chainFacilityService: FacilityService,
    private chainSemiProductService: SemiProductService,
    private chainStockOrderService: StockOrderService,
    private globalEventManager: GlobalEventManagerService,
    public sifrantProduct: ActiveProductsService,
    public activeMeasureUnitTypeService: ActiveMeasureUnitTypeService,
    public activeFacilitiesForOrganizationService: ActiveFacilitiesForOrganizationService,
    private productController: ProductControllerService
  ) { }

  ngOnInit(): void {
    if (this.update) {
      this.editSKU();
    } else {
      this.newSKU();
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  emptyObject() {
    let measurementUnitType = defaultEmptyObject(ChainMeasureUnitType.formMetadata()) as ChainMeasureUnitType;
    let obj = defaultEmptyObject(ChainStockOrder.formMetadata()) as ChainStockOrder;
    obj.measurementUnitType = measurementUnitType;
    return obj
  }

  newSKU() {
    this.form = generateFormFromMetadata(ChainStockOrder.formMetadata(), this.emptyObject(), ChainStockOrderValidationScheme)
  }

  async initData() {
    let res = await this.chainFacilityService.getFacilityById(this.sku.facilityId).pipe(take(1)).toPromise();
    if (res && res.status == 'OK') {
      this.facilityForm.setValue(res.data);
    }
    let resp = await this.chainSemiProductService.getSemiProduct(this.sku.semiProductId).pipe(take(1)).toPromise();
    if (resp && resp.status == 'OK' && resp.data) {
      // let resp1 = await this.productController.getProductUsingGET(resp.data.id).pipe(take(1)).toPromise();
      // if (resp1 && resp1.status == 'OK' && resp1.data) {
        let obj = {};
        obj['id'] = resp.data.product.id;
        obj['name'] = resp.data.product.name;
        obj['photoStorage'] = resp.data.product.photo.storageKey
        this.productForm.setValue(obj as ApiProductListResponse);
      // }

    };

  }

  async editSKU() {
    await this.initData();
    this.form = generateFormFromMetadata(ChainStockOrder.formMetadata(), this.sku, ChainStockOrderValidationScheme)
    this.measureUnitForm.setValue(this.form.get('measurementUnitType').value);
  }

  async updateSKU() {
    this.submitted = true;
    if (this.form.get('formalCreationTime').invalid || this.form.get('productionDate').invalid || this.productForm.invalid || this.facilityForm.invalid || this.measureUnitForm.invalid) return;
    let data = await this.prepareData();

    try {
      this.globalEventManager.showLoading(true);
      let res = await this.chainStockOrderService.postStockOrder(data).pipe(take(1)).toPromise();
      if (res && res.status != 'OK') throw Error()
      if (res && res.status == 'OK') {
        this.globalEventManager.showLoading(false);
        if (this.saveCallback) this.saveCallback();
        this.dismiss();
      }
    } catch (e) {
      this.globalEventManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@productLabelStockSKUModal.update.error.title:Error`,
        message: $localize`:@@productLabelStockSKUModal.update.error.message:Cannot save or update SKU`
      })
    } finally {
      this.globalEventManager.showLoading(false)
    }

  }

  async prepareData() {
    let productId = this.productForm.value['id'];
    // Fix !!
    // let resp1 = await this.productController.getProductByAFId(productId).pipe(take(1)).toPromise();
    // if (resp1 && resp1.status === "OK" && resp1.data && dbKey(resp1.data)) {
    //   this.form.get('productId').setValue(dbKey(resp1.data));
    // } else {
    //   this.globalEventManager.push({
    //     action: 'error',
    //     notificationType: 'error',
    //     title: $localize`:@@productLabelStockSKUModal.update.error.title:Error`,
    //     message: $localize`:@@productLabelStockSKUModal.update.error.message:Cannot save or update SKU`
    //   })
    //   return;
    // }
    this.form.get('facilityId').setValue(this.facilityForm.value['_id']);
    this.form.get('measurementUnitType').setValue(this.measureUnitForm.value);

    let data = _.cloneDeep(this.form.value);
    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);
    return data;

  }



}
