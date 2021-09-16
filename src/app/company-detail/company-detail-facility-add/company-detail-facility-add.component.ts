import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { defaultEmptyObject, generateFormFromMetadata } from '../../../shared/utils';
import { ApiFacility } from '../../../api/model/apiFacility';
import { ApiFacilityLocation } from '../../../api/model/apiFacilityLocation';
import { ApiFacilityValidationScheme } from './validation';
import { FacilityControllerService } from '../../../api/api/facilityController.service';
import { first } from 'rxjs/operators';
import { ActiveFacilityTypeService } from '../../shared-services/active-facility-types.service';
import { ApiAddress } from '../../../api/model/apiAddress';
import { ApiCompanyBase } from '../../../api/model/apiCompanyBase';
import { EnumSifrant } from '../../shared-services/enum-sifrant';
import { SemiProductControllerService } from '../../../api/api/semiProductController.service';
import { ApiSemiProduct } from '../../../api/model/apiSemiProduct';
import { ActiveSemiProductsService } from '../../shared-services/active-semi-products.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-company-detail-facility-add',
  templateUrl: './company-detail-facility-add.component.html',
  styleUrls: ['./company-detail-facility-add.component.scss']
})
export class CompanyDetailFacilityAddComponent implements OnInit {

  public edit: boolean;
  public title: string;
  public form: FormGroup;
  public submitted = false;
  public companyId: string;
  public semiProducts: Array<ApiSemiProduct> = [];

  public codebookStatus = EnumSifrant.fromObject(this.publiclyVisible);
  public semiProductsForm = new FormControl(null);

  faTimes = faTimes;

  constructor(
      private route: ActivatedRoute,
      private location: Location,
      private facilityControllerService: FacilityControllerService,
      public activeFacilityTypeService: ActiveFacilityTypeService,
      public activeSemiProductsService: ActiveSemiProductsService,
      private semiProductControllerService: SemiProductControllerService
  ) { }

  ngOnInit(): void {
    this.edit = this.route.snapshot.params.facilityId;

    if (!this.edit) {
      this.initializeNew();
    } else {
      this.initializeEdit();
    }
  }

  initializeNew() {
    this.title = $localize `:@@productLabelStockFacilityModal.newFacility.newTitle:New facility`;
    this.form = generateFormFromMetadata(ApiFacility.formMetadata(), this.emptyObject(), ApiFacilityValidationScheme);
  }

  initializeEdit() {

    this.title = $localize`:@@productLabelStockFacilityModal.newFacility.editTitle:Edit facility`;
    this.companyId = this.route.snapshot.params.id;
    const facilityId = this.route.snapshot.params.facilityId;
    this.facilityControllerService.getFacilityUsingGET(facilityId).pipe(first()).subscribe(res => {
      this.form = generateFormFromMetadata(ApiFacility.formMetadata(), res.data, ApiFacilityValidationScheme);
      this.semiProducts = res.data.facilitySemiProductList;

      let tmpVis = this.form.get('facilityLocation.publiclyVisible').value;
      if (tmpVis != null) { this.form.get('facilityLocation.publiclyVisible').setValue(tmpVis.toString()); }
      let tmpPub = this.form.get('isPublic').value;
      if (tmpPub != null) { this.form.get('isPublic').setValue(tmpPub.toString()); }
      let tmpCollection = this.form.get('isCollectionFacility').value;
      if (tmpCollection != null) { this.form.get('isCollectionFacility').setValue(tmpCollection.toString()); }
    });
    this.semiProductControllerService.getSemiProductListUsingGET();
  }

  emptyObject() {
    const object = defaultEmptyObject(ApiFacility.formMetadata()) as ApiFacility;
    object.company = defaultEmptyObject(ApiCompanyBase.formMetadata()) as ApiCompanyBase;
    object.facilityLocation = defaultEmptyObject(ApiFacilityLocation.formMetadata()) as ApiFacilityLocation;
    object.facilityLocation.address = defaultEmptyObject(ApiAddress.formMetadata()) as ApiAddress;
    return object;
  }

  dismiss() {
    this.location.back();
  }

  save() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const facility: ApiFacility = this.form.value;
    if (!this.edit) {
      facility.company.id = this.route.snapshot.params.id;
    }
    facility.facilitySemiProductList = this.semiProducts;
    const res = this.facilityControllerService.createOrUpdateFacilityUsingPUT(facility).pipe(first()).subscribe(next => {
      this.location.back();
    });
  }

  get publiclyVisible() {
    const obj = {};
    obj['true'] = $localize`:@@productLabelStockFacilityModal.publiclyVisible.yes:YES`;
    obj['false'] = $localize`:@@productLabelStockFacilityModal.publiclyVisible.no:NO`;
    return obj;
  }



  spResultFormatter = (value: any) => {
    return this.activeSemiProductsService.textRepresentation(value);
  }

  spInputFormatter = (value: any) => {
    return this.activeSemiProductsService.textRepresentation(value);
  }

  async addSelectedSP(sp: ApiSemiProduct) {
    if (!sp || this.semiProducts.some(s => s === sp.id)) {
      setTimeout(() => this.semiProductsForm.setValue(null));
      return;
    }
    this.semiProducts.push(sp);
    setTimeout(() => this.semiProductsForm.setValue(null));
  }

  deleteSP(sp: ApiSemiProduct, idx: number) {
    this.semiProducts.splice(idx, 1);
  }

}
