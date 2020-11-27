import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { ProductService } from 'src/api-chain/api/product.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { ChainProduct } from 'src/api-chain/model/chainProduct';
import { ChainSemiProduct } from 'src/api-chain/model/chainSemiProduct';
import { ActiveMeasureUnitTypeService } from 'src/app/shared-services/active-measure-unit-types.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { UnsubscribeList } from 'src/shared/rxutils';
import { dbKey, generateFormFromMetadata } from 'src/shared/utils';
import { ChainSemiProductValidationScheme } from './validation';

@Component({
  selector: 'app-semi-product-detail-modal',
  templateUrl: './semi-product-detail-modal.component.html',
  styleUrls: ['./semi-product-detail-modal.component.scss']
})
export class SemiProductDetailModalComponent implements OnInit {


  title: string = null;

  update: boolean = true;

  productId: number;

  semiProduct: ChainSemiProduct;

  form: FormGroup;

  submitted: boolean = false;

  product: ChainProduct;

  unsubscribeList = new UnsubscribeList()

  constructor(
    private chainSemiProductService: SemiProductService,
    private chainProductService: ProductService,
    public productService: ProductService,
    private globalEventsManager: GlobalEventManagerService,
    public activeMeasureUnitTypeService: ActiveMeasureUnitTypeService,
    private route: ActivatedRoute,
    private location: Location
  ) { }


  async initInitialData() {

    let action = this.route.snapshot.data.action
    if (!action) return;
    // standalone on route
    this.productId = this.route.snapshot.params.id
    if (action === 'new') {
      this.title = $localize`:@@semiProductDetail.semiProduct.newTitle:New semi-product`;
      this.update = false;
      let res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data && dbKey(res.data)) {
        this.product = res.data;
      }

    } else if (action == 'update') {
      this.title = $localize`:@@semiProductDetail.semiProduct.editTitle:Edit semi-product`;
      this.update = true;
      let semiProductId = this.route.snapshot.params.semiProductId;
      let resp = await this.chainSemiProductService.getSemiProduct(semiProductId).pipe(take(1)).toPromise();
      if (resp && resp.status === 'OK') {
        this.semiProduct = resp.data;
        this.product = this.semiProduct.product;
        return;
      }
    } else {
      throw Error("Wrong action.")
    }
  }

  ngOnInit(): void {

    this.initInitialData().then(
      (resp: any) => {
        if (this.update) {
          this.editEntity();
        } else {
          this.newEntity();
        }
      }
    )
    // this.unsubscribeList.add(
    //   this.productService.getProductByAFId(this.productId).subscribe(res => {
    //     if (res && res.status === 'OK') {
    //       this.product = res.data;
    //     }
    //   })
    // )
  }

  ngOnDestroy(): void {
    this.unsubscribeList.cleanup()
  }

  dismiss() {
    this.location.back()
  }

  newEntity() {
    this.form = generateFormFromMetadata(ChainSemiProduct.formMetadata(), { measurementUnitType: null }, ChainSemiProductValidationScheme)
  }

  editEntity() {
    this.form = generateFormFromMetadata(ChainSemiProduct.formMetadata(), this.semiProduct, ChainSemiProductValidationScheme)
  }

  async updateEntity() {
    this.submitted = true;
    if (this.form.invalid) return;
    if (!this.product) return;
    this.prepareData();
    try {
      this.globalEventsManager.showLoading(true);
      let res = await this.chainSemiProductService.postSemiProduct(this.form.value).pipe(take(1)).toPromise();
      if (res && res.status == 'OK') {
        this.dismiss();
      }
    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }

  prepareData() {
    this.form.get('productId').setValue(dbKey(this.product))
  }

}



// productId: string;
// /**
//  * Description of the semi product
//  */
// description: string;
// measurementUnitType: ChainMeasureUnitType;
// /**
//  * Whether the product is considered as Stock keeping unit
//  */
// isSKU?: boolean;
