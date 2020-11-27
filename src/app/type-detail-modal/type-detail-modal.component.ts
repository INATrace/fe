import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { generateFormFromMetadata, defaultEmptyObject, dbKey } from 'src/shared/utils';
import { ChainFacilityType } from 'src/api-chain/model/chainFacilityType';
import { take } from 'rxjs/operators';
import { ChainFacilityTypeValidationScheme, ChainMeasureUnitTypeValidationScheme, ChainActionTypeValidationScheme, ChainGradeAbbreviationValidationScheme, ChainProcessingEvidenceTypeValidationScheme, ChainOrderEvidenceTypeValidationScheme } from './validation';
import _ from 'lodash-es';
import { ChainMeasureUnitType } from 'src/api-chain/model/chainMeasureUnitType';
import { ChainActionType } from 'src/api-chain/model/chainActionType';
import { CodebookService } from 'src/api-chain/api/codebook.service';
import { ChainGradeAbbreviation } from 'src/api-chain/model/chainGradeAbbreviation';
import { ChainProcessingEvidenceType } from 'src/api-chain/model/chainProcessingEvidenceType';
import { ChainOrderEvidenceType } from 'src/api-chain/model/chainOrderEvidenceType';
import { ActiveProductsService } from '../shared-services/active-products.service';
import { ChainProduct } from 'src/api-chain/model/chainProduct';
import { ActiveSemiProductsForProductServiceStandalone } from '../shared-services/active-semi-products-for-product-standalone.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { EnumSifrant } from '../shared-services/enum-sifrant';
import { ProductService } from 'src/api-chain/api/product.service';
import { CodebookTranslations } from '../shared-services/codebook-translations';
import { ActiveMeasureUnitTypeService } from '../shared-services/active-measure-unit-types.service';

@Component({
  selector: 'app-type-detail-modal',
  templateUrl: './type-detail-modal.component.html',
  styleUrls: ['./type-detail-modal.component.scss']
})
export class TypeDetailModalComponent implements OnInit {

  @Input()
  title: String = null;
  @Input()
  type: String = null;
  @Input()
  update: Boolean = false;
  @Input()
  typeElement = null;
  @Input()
  public saveCallback: () => string;

  form: FormGroup;
  submitted: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private chainCodebookService: CodebookService,
    public productCodebook: ActiveProductsService,
    private chainSemiproductService: SemiProductService,
    private chainProductService: ProductService,
    public activeMeasureUnitTypeService: ActiveMeasureUnitTypeService,
    private codebookTranslations: CodebookTranslations
  ) { }

  ngOnInit(): void {
    this.init();
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  productForm = new FormControl(null, Validators.required);


  async init() {
    if (this.type === 'facility-types') {
      if (!this.update) this.form = generateFormFromMetadata(ChainFacilityType.formMetadata(), defaultEmptyObject(ChainFacilityType.formMetadata()) as ChainFacilityType, ChainFacilityTypeValidationScheme)
      else this.form = generateFormFromMetadata(ChainFacilityType.formMetadata(), this.typeElement, ChainFacilityTypeValidationScheme)
    }
    if (this.type === 'measurement-unit-types') {
      if (!this.update) this.form = generateFormFromMetadata(ChainMeasureUnitType.formMetadata(), defaultEmptyObject(ChainMeasureUnitType.formMetadata()) as ChainMeasureUnitType, ChainMeasureUnitTypeValidationScheme)
      else this.form = generateFormFromMetadata(ChainMeasureUnitType.formMetadata(), this.typeElement, ChainMeasureUnitTypeValidationScheme)
    }
    if (this.type === 'action-types') {
      if (!this.update) this.form = generateFormFromMetadata(ChainActionType.formMetadata(), defaultEmptyObject(ChainActionType.formMetadata()) as ChainActionType, ChainActionTypeValidationScheme)
      else this.form = generateFormFromMetadata(ChainActionType.formMetadata(), this.typeElement, ChainActionTypeValidationScheme)
    }
    if (this.type === 'grade-abbreviation') {
      if (!this.update) this.form = generateFormFromMetadata(ChainGradeAbbreviation.formMetadata(), defaultEmptyObject(ChainGradeAbbreviation.formMetadata()) as ChainGradeAbbreviation, ChainGradeAbbreviationValidationScheme)
      else this.form = generateFormFromMetadata(ChainGradeAbbreviation.formMetadata(), this.typeElement, ChainGradeAbbreviationValidationScheme)
    }
    if (this.type === 'processing-evidence-types') {
      if (!this.update) this.form = generateFormFromMetadata(ChainProcessingEvidenceType.formMetadata(), defaultEmptyObject(ChainProcessingEvidenceType.formMetadata()) as ChainProcessingEvidenceType, ChainProcessingEvidenceTypeValidationScheme)
      else {
        this.form = generateFormFromMetadata(ChainProcessingEvidenceType.formMetadata(), this.typeElement, ChainProcessingEvidenceTypeValidationScheme)
        // let semiProduct = (this.typeElement as ChainProcessingEvidenceType).semiProduct
        // if(semiProduct && semiProduct.productId) {
        //   let res = await this.chainProductService.getProduct(semiProduct.productId).pipe(take(1)).toPromise();
        //   if(res && res.status === 'OK') {
        //     this.productForm.setValue({
        //       id: dbKey(res.data),
        //       name: res.data.name
        //     })
        //     this.activeSemiProductsForProduct = new ActiveSemiProductsForProductServiceStandalone(this.chainSemiproductService, dbKey(res.data))
        //   }
        // }
      }
    }
    if (this.type === 'order-evidence-types') {
      if (!this.update) this.form = generateFormFromMetadata(ChainOrderEvidenceType.formMetadata(), defaultEmptyObject(ChainOrderEvidenceType.formMetadata()) as ChainOrderEvidenceType, ChainOrderEvidenceTypeValidationScheme)
      else this.form = generateFormFromMetadata(ChainOrderEvidenceType.formMetadata(), this.typeElement, ChainOrderEvidenceTypeValidationScheme)
    }
  }

  activeSemiProductsForProduct: ActiveSemiProductsForProductServiceStandalone

  async onProductSelected(product: any) {
    let prodDB = await this.chainProductService.getProductByAFId(product.id).pipe(take(1)).toPromise();
    console.log("PDB", prodDB)
    if (prodDB && prodDB.status == "OK" && prodDB.data) {
      this.activeSemiProductsForProduct = new ActiveSemiProductsForProductServiceStandalone(this.chainSemiproductService, dbKey(prodDB.data), this.codebookTranslations)
    }
  }

  async save() {
    this.submitted = true;
    if(this.form.invalid) return;
    if (this.type === 'measurement-unit-types' && (!this.form.value.weight || this.form.value.weight.toString().trim() == "")) {
      this.form.get('weight').setValue(null)
    }
    let data = _.cloneDeep(this.form.value);
    Object.keys(data).forEach((key) => (data[key] == null) && delete data[key]);

    let res = null;

    if (this.type === 'facility-types') res = await this.chainCodebookService.postFacilityType(data).pipe(take(1)).toPromise()
    if (this.type === 'measurement-unit-types') res = await this.chainCodebookService.postMeasureUnitType(data).pipe(take(1)).toPromise()
    if (this.type === 'action-types') res = await this.chainCodebookService.postActionType(data).pipe(take(1)).toPromise()
    if (this.type === 'grade-abbreviation') res = await this.chainCodebookService.postGradeAbbreviation(data).pipe(take(1)).toPromise()
    if (this.type === 'processing-evidence-types') res = await this.chainCodebookService.postProcessingEvidenceType(data).pipe(take(1)).toPromise()
    if (this.type === 'order-evidence-types') res = await this.chainCodebookService.postOrderEvidenceType(data).pipe(take(1)).toPromise()

    if (res && res.status == 'OK') {
      if (this.saveCallback) this.saveCallback();
      this.dismiss();
    }
  }

  get procesingEvidenceTypeType() {
    let obj = {}
    obj['DOCUMENT'] = $localize`:@@processingEvidenceTypeType.document:Document`
    obj['FIELD'] = $localize`:@@processingEvidenceTypeType.field:Field`
    obj['CALCULATED'] = $localize`:@@processingEvidenceTypeType.calculated:Calculated`
    return obj;
  }

  codebookProcessingEvidenceTypeType = EnumSifrant.fromObject(this.procesingEvidenceTypeType)


}
