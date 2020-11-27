import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { ChainLocation } from 'src/api-chain/model/chainLocation';
import { ChainOrganization } from 'src/api-chain/model/chainOrganization';
import { ChainSemiProduct } from 'src/api-chain/model/chainSemiProduct';
import { ChainSemiProductPrice } from 'src/api-chain/model/chainSemiProductPrice';
import { ActiveFacilityTypeService } from 'src/app/shared-services/active-facility-types.service';
import { ActiveSemiProductsForProductService } from 'src/app/shared-services/active-semi-products-for-product.service';
import { CountryService } from 'src/app/shared-services/countries.service';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { dbKey, defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ChainFacilityValidationScheme } from './validation';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';

@Component({
  selector: 'app-product-label-stock-facility-modal',
  templateUrl: './product-label-stock-facility-modal.component.html',
  styleUrls: ['./product-label-stock-facility-modal.component.scss']
})
export class ProductLabelStockFacilityModalComponent implements OnInit {

  faTimes = faTimes;
  title: string = null;

  organizationId: string = null;

  chainProductId: string = null;

  update: boolean = true;

  facility: ChainFacility = null;

  form: FormGroup;

  submitted: boolean = false;

  @ViewChild(GoogleMap) set map(map: GoogleMap) {
    if (map) { this.gMap = map; this.fitBounds() };
  };

  gMap = null;
  isGoogleMapsLoaded: boolean = false;
  markers: any = [];
  defaultCenter = {
    lat: 5.274054,
    lng: 21.514503
  };
  defaultZoom = 3;
  zoomForOnePin = 10;
  bounds: any;
  initialBounds: any = [];
  subs: Subscription[] = [];
  // facilityTypeForm = new FormControl(null, Validators.required)

  constructor(
    // public activeModal: NgbActiveModal,
    private chainFacilityService: FacilityService,
    private chainOrganizationService: OrganizationService,
    private globalEventsManager: GlobalEventManagerService,
    public countryCodes: CountryService,
    public activeFacilityTypeService: ActiveFacilityTypeService,
    public activeSemiProducstForProduct: ActiveSemiProductsForProductService,
    private route: ActivatedRoute,
    private location: Location,
    private chainProductService: ProductService,
    protected codebookTranslations: CodebookTranslations
  ) { }

  productId;

  organization: ChainOrganization;
  async initInitialData() {

    let action = this.route.snapshot.data.action
    if (!action) return;
    this.organizationId = this.route.snapshot.params.organizationId
    // standalone on route
    this.productId = this.route.snapshot.params.id
    if (action === 'new') {
      this.title = $localize`:@@productLabelStockFacilityModal.newFacility.newTitle:New facility`;
      this.update = false;
      let resp = await this.chainOrganizationService.getOrganization(this.organizationId).pipe(take(1)).toPromise()
      if (resp && resp.status === 'OK') {
        this.organization = resp.data
        // return;
      }
    } else if (action == 'update') {
      this.title = $localize`:@@productLabelStockFacilityModal.newFacility.editTitle:Edit facility`;
      this.update = true;
      let resp = await this.chainFacilityService.getFacilityById(this.route.snapshot.params.facilityId).pipe(take(1)).toPromise()
      if (resp && resp.status === 'OK') {
        this.facility = resp.data;
        this.organization = resp.data.organization;
        // this.organizationId = this.facility.organizationId;
        // return;
      }
    } else {
      throw Error("Wrong action.")
    }
    let res = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise();
    if (res && res.status === "OK" && res.data && dbKey(res.data)) {
      this.chainProductId = dbKey(res.data);
      // this.organizationId = dbKey(res.data.organization);
    }
  }

  ngOnInit(): void {
    // let sub2 = this.globalEventsManager.areGoogleMapsLoadedEmmiter.subscribe(
    //   loaded => {
    //     if (loaded) this.isGoogleMapsLoaded = true;
    //   },
    //   error => { }
    // )
    // this.subs.push(sub2);

    this.initInitialData().then(
      (resp: any) => {
        if (this.update) {
          this.editFacility();
        } else {
          this.newFacility();
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => { sub.unsubscribe(); });
  }

  dismiss() {
    // this.activeModal.dismiss();
    this.location.back()
  }

  emptyObject(organizationId: string) {
    // let facilityType = defaultEmptyObject(ChainFacilityType.formMetadata()) as ChainFacilityType;
    let obj = defaultEmptyObject(ChainFacility.formMetadata()) as ChainFacility;
    obj.location = {
      address: null,
      city: null,
      country: null,
      state: null,
      zip: null,
      latitude: null,
      longitude: null,
      site: null,
      sector: null,
      cell: null,
      village: null,
      isPubliclyVisible: false
    } as ChainLocation
    obj.organizationId = this.organizationId
    return obj
  }

  newFacility() {
    this.form = generateFormFromMetadata(ChainFacility.formMetadata(), this.emptyObject(this.organizationId), ChainFacilityValidationScheme)
  }

  editFacility() {
    this.form = generateFormFromMetadata(ChainFacility.formMetadata(), this.facility, ChainFacilityValidationScheme)
    // this.facilityTypeForm.setValue(this.form.get('facilityType').value);
    this.initializeMarker();
    let tmpVis = this.form.get("location.isPubliclyVisible").value;
    if (tmpVis != null) this.form.get("location.isPubliclyVisible").setValue(tmpVis.toString());
    let tmpPub = this.form.get("isPublic").value;
    if (tmpPub != null) this.form.get("isPublic").setValue(tmpPub.toString());
    let tmpCollection = this.form.get("isCollectionFacility").value;
    if (tmpCollection != null) this.form.get("isCollectionFacility").setValue(tmpCollection.toString());


    let tmp = new FormArray([]);
    for (let semi of this.semiProductPricesArray.value) {
      tmp.push(new FormGroup({ semiProductId: new FormControl(semi.semiProductId), price: new FormControl(semi.price), currency: new FormControl(semi.currency) }))
    }
    (this.form as FormGroup).setControl('semiProductPrices', tmp);
    this.form.updateValueAndValidity()

  }

  get semiProductPricesArray(): FormArray {
    return this.form.get('semiProductPrices') as FormArray
  }

  async updateFacility() {
    this.submitted = true;
    // console.log("form", this.form, this.update)
    if (this.form.invalid) return;
    if (this.update) {
      let data = this.prepareData();
      let res = await this.chainFacilityService.postFacility(data).pipe(take(1)).toPromise()
      if (res && res.status == 'OK') {
        this.globalEventsManager.showLoading(false);
        // if (this.saveCallback) this.saveCallback();
        this.dismiss();
      }
    } else {
      let data = this.prepareData();
      let res = await this.chainFacilityService.postFacility(data).pipe(take(1)).toPromise()
      if (res && res.status == 'OK') {
        this.globalEventsManager.showLoading(false);
        // if (this.saveCallback) this.saveCallback();
        this.dismiss();
      }
    }

  }

  prepareData() {
    let sps = this.form.get('semiProducts').value;
    (this.form.get('semiProductIds') as FormArray).clear();
    sps.forEach(sp => {
      (this.form.get('semiProductIds') as FormArray).push(new FormControl(dbKey(sp)))
    });
    let data = this.form.value;
    return data;
  }

  initializeMarker() {
    if (!this.form.get('location.latitude') || !this.form.get('location.longitude')) return;
    let lat = this.form.get('location.latitude').value;
    let lng = this.form.get('location.longitude').value;
    if (lng == null || lat == null) return;

    let tmp = {
      position: {
        lat: lat,
        lng: lng
      }
    }
    this.marker = tmp;
    this.initialBounds.push(tmp.position);
  }

  fitBounds() {
    this.bounds = new google.maps.LatLngBounds()
    for (let bound of this.initialBounds) {
      this.bounds.extend(bound);
    }
    if (this.bounds.isEmpty()) {
      this.gMap.googleMap.setCenter(this.defaultCenter)
      this.gMap.googleMap.setZoom(this.defaultZoom);
      return;
    }
    let center = this.bounds.getCenter()
    let offset = 0.02
    let northEast = new google.maps.LatLng(
      center.lat() + offset,
      center.lng() + offset
    )
    let southWest = new google.maps.LatLng(
      center.lat() - offset,
      center.lng() - offset
    )
    let minBounds = new google.maps.LatLngBounds(southWest, northEast)
    this.gMap.fitBounds(this.bounds.union(minBounds))
  }

  marker = null;

  dblClick(event: google.maps.MouseEvent) {
    if (this.marker) {
      this.updateMarkerLocation(event.latLng.toJSON());
    } else {
      let tmp = {
        position: event.latLng.toJSON(),
        label: {
          text: ' '
        },
        infoText: ' '
      }
      this.marker = tmp;
    }
  }

  dragend(event, index) {
    this.updateMarkerLocation(event.latLng.toJSON());
  }

  updateMarkerLocation(loc) {
    let tmpCurrent = this.marker;
    let tmp = {
      position: loc,
      label: tmpCurrent.label,
      infoText: tmpCurrent.infoText
    }
    this.marker = tmp;
  }


  removeOriginLocation() {
    this.marker = null;
    this.initialBounds = [];
  }


  get publiclyVisible() {
    let obj = {}
    obj['true'] = $localize`:@@productLabelStockFacilityModal.publiclyVisible.yes:YES`;
    obj['false'] = $localize`:@@productLabelStockFacilityModal.publiclyVisible.no:NO`;
    return obj;
  }

  codebookStatus = EnumSifrant.fromObject(this.publiclyVisible)





  semiProductsForm = new FormControl(null)

  spResultFormatter = (value: any) => {
    return this.activeSemiProducstForProduct.textRepresentation(value)
  }

  spInputFormatter = (value: any) => {
    return this.activeSemiProducstForProduct.textRepresentation(value)
  }

  //// temp

  async addSelectedSP(sp: ChainSemiProduct) {
    if (!sp) return;
    let formArray = this.form.get('semiProducts') as FormArray
    if (formArray.value.some(x => dbKey(x) === dbKey(sp))) {
      this.semiProductsForm.setValue(null);
      return;
    }
    formArray.push(new FormControl(sp))
    formArray.markAsDirty()

    let semiProductsPricesFormArray = this.form.get('semiProductPrices') as FormArray
    if (semiProductsPricesFormArray.value.some(x => x.semiProductId === dbKey(sp))) {
      return;
    }
    semiProductsPricesFormArray.push(new FormGroup({ semiProductId: new FormControl(dbKey(sp)), price: new FormControl(null), currency: new FormControl("RWF") }))
    semiProductsPricesFormArray.updateValueAndValidity();
    semiProductsPricesFormArray.markAsDirty()

    setTimeout(() => this.semiProductsForm.setValue(null))
  }

  async deleteSP(sp: ChainSemiProduct) {
    if (!sp) return
    let formArray = this.form.get('semiProducts') as FormArray
    let index = (formArray.value as ChainSemiProduct[]).findIndex(x => dbKey(x) === dbKey(sp))
    if (index >= 0) {
      formArray.removeAt(index)
      formArray.markAsDirty()
    }

    let semiProductsPricesFormArray = this.form.get('semiProductPrices') as FormArray
    let indexP = (semiProductsPricesFormArray.value as ChainSemiProductPrice[]).findIndex(x => x.semiProductId === dbKey(sp))
    if (indexP >= 0) {
      semiProductsPricesFormArray.removeAt(index)
      semiProductsPricesFormArray.markAsDirty()
    }
  }

  semiProductName(semiProductId) {
    for (let item of this.form.get('semiProducts').value) {
      if (dbKey(item) === semiProductId) {
        return this.codebookTranslations.translate(item, 'name')
      }
    }
    return "";
  }

}
