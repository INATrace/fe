import { animate, state, style, transition, trigger } from '@angular/animations';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowAltCircleDown, faCompass, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faArrowsAlt, faCodeBranch, faCog, faEye, faListOl, faPen, faQrcode, faSlidersH, faTimes } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, filter, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ProductService } from 'src/api-chain/api/product.service';
import { CommonControllerService } from 'src/api/api/commonController.service';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { ProductControllerService } from 'src/api/api/productController.service';
import { ApiAddress } from 'src/api/model/apiAddress';
import { ApiCompany } from 'src/api/model/apiCompany';
import { ApiCompanyGet } from 'src/api/model/apiCompanyGet';
import { ApiProcess } from 'src/api/model/apiProcess';
import { ApiProcessDocument } from 'src/api/model/apiProcessDocument';
import { ApiCertification } from 'src/api/model/apiCertification';
import { ApiProduct } from 'src/api/model/apiProduct';
import { ApiProductLabel } from 'src/api/model/apiProductLabel';
import { ApiProductOrigin } from 'src/api/model/apiProductOrigin';
import { ApiResponseApiBaseEntity } from 'src/api/model/apiResponseApiBaseEntity';
import { ApiResponsibility } from 'src/api/model/apiResponsibility';
import { ApiResponsibilityFarmerPicture } from 'src/api/model/apiResponsibilityFarmerPicture';
import { ApiSustainability } from 'src/api/model/apiSustainability';
import { CompanyDetailComponent } from 'src/app/company-detail/company-detail.component';
import { ComponentCanDeactivate } from 'src/app/shared-services/component-can-deactivate';
import { CountryService } from 'src/app/shared-services/countries.service';
import { UsersService } from 'src/app/shared-services/users.service';
import { ListEditorManager } from 'src/app/shared/list-editor/list-editor-manager';
import { TextinputComponent } from 'src/app/shared/textinput/textinput.component';
import { AuthService } from 'src/app/system/auth.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { environment } from 'src/environments/environment';
import { UnsubscribeList } from 'src/shared/rxutils';
import { dbKey, defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { PrefillProductSelectionModalComponent } from './prefill-product-selection-modal/prefill-product-selection-modal.component';
import { ApiProcessDocumentValidationScheme, ApiCertificationValidationScheme, ApiProductOriginValidationScheme, ApiProductValidationScheme, ApiResponsibilityFarmerPictureValidationScheme, marketShareFormMetadata, MarketShareValidationScheme, pricingTransparencyFormMetadata, pricingTransparencyValidationScheme, pricesFormMetadata, pricesValidationScheme, ApiComparisonOfPriceValidationScheme, ApiCompanyValidationScheme } from './validation';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { ApiProductSettings } from 'src/api/model/apiProductSettings';
import { ApiComparisonOfPrice } from 'src/api/model/apiComparisonOfPrice';
import { ApiProductLabelContent } from 'src/api/model/apiProductLabelContent';
import { LanguageForLabelModalComponent } from './language-for-label-modal/language-for-label-modal.component';
import { ApiCompanyGetValidationScheme } from 'src/app/company-detail/validation';

@Component({
  selector: 'app-product-label',
  templateUrl: './product-label.component.html',
  styleUrls: ['./product-label.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('closed', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0',
        margin: '0',
        padding: '0'
      })),
      state('open', style({
        opacity: '1'
      })),
      transition(
        'closed=>open',
        animate("150ms")
      ),
      transition(
        'open=>closed',
        animate('150ms ease-out')
      )
    ]),
  ]

})
export class ProductLabelComponent extends ComponentCanDeactivate implements OnInit {

  @ViewChild(GoogleMap) set map(map: GoogleMap) {
    if (map) {
      this.gMap = map;
      this.googleMapsIsLoaded();
    }
  };

  @ViewChild(MapInfoWindow) set infoWindow(infoWindow: MapInfoWindow) {
    if (infoWindow) this.gInfoWindow = infoWindow;
  };

  public canDeactivate(): boolean {
    return !this.productForm || !(this.changed)
  }

  gMap = null;
  gInfoWindow = null;
  gInfoWindowText: string = "";
  productForm: FormGroup;
  countries: any = [];
  markers: any = [];
  defaultCenter = {
    lat: 5.274054,
    lng: 21.514503
  };
  defaultZoom = 3;
  zoomForOnePin = 10;
  bounds: any;
  initialBounds: any = [];

  faTimes = faTimes;
  faArrowsAlt = faArrowsAlt
  faTrashAlt = faTrashAlt;
  faCog = faCog;
  faCodeBranch = faCodeBranch;
  faPen = faPen
  faEye = faEye
  faArrowAltCircleDown = faArrowAltCircleDown
  faListOl = faListOl
  faCompass = faCompass
  faSlidersH = faSlidersH
  faQrcode = faQrcode

  rootImageUrl: string = environment.relativeImageUplodadUrlAllSizes;
  submitted = false;

  redirectToCertainLabel = null;
  initialReload = false;

  editInfoLabelLink: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private productController: ProductControllerService,
    protected globalEventsManager: GlobalEventManagerService,
    public countryCodes: CountryService,
    public userSifrant: UsersService,
    public companyController: CompanyControllerService,
    private modalService: NgbModalImproved,
    private authService: AuthService,
    private commonController: CommonControllerService,
    private chainProductService: ProductService
  ) {
    super()
    this.generateLabelMaps()
    if (this.router.getCurrentNavigation().extras.state && this.router.getCurrentNavigation().extras.state.labelId) {
      this.redirectToCertainLabel = this.router.getCurrentNavigation().extras.state.labelId;
      this.initialReload = true;
    }
  }

  unsubscribeList = new UnsubscribeList()

  currentLabel: ApiProductLabel = null

  userProfile = null
  showLabelInfoLink: boolean = false;
  reloadProductNoLabel: boolean = true;

  get currentLabelName() {
    // if(this.currentLabel && this.currentLabel.title) return this.currentLabel.title
    let noName = $localize`:@@productLabel.qrLabels.untitled:NO NAME`
    if (!this.currentLabel) return noName;
    return this.labelTitleForm.value || noName
  }

  action = this.route.snapshot.data.action
  ngOnInit(): void {
    this.userProfile = this.authService.currentUserProfile;
    let subUserProfile = this.authService.userProfile$.subscribe(val => {
      this.userProfile = val
      if (this.userProfile) this.showLabelInfoLink = "ADMIN" == this.userProfile.role;
    })
    this.unsubscribeList.add(subUserProfile);
    this.initializeLabelsHelperLink();

    if (this.mode === 'update') {
      // this.getProduct();
      this.unsubscribeList.add(
        this.product$.subscribe(val => { }),
      )
      this.unsubscribeList.add(
        this.currentLabel$.subscribe(label => {
          this.currentLabel = label;
        })
      )
      this.reload();
    } else {
      this.newProduct();
    }
  }

  ngOnDestroy() {
    this.unsubscribeList.cleanup();
  }

  get mode() {
    let id = this.route.snapshot.params.id
    return id == null ? 'create' : 'update'
  }

  reloadPing$ = new BehaviorSubject(false)

  reload() {
    this.reloadPing$.next(true)
  }

  id$ = this.route.paramMap.pipe(
    map(m => m.get('id')),
    shareReplay(1)
  )


  product$ = combineLatest(this.reloadPing$, this.id$,
    (ping: any, id: string) => {
      return ping && id != null ? Number(id) : null
    }
  ).pipe(
    filter(val => val != null),
    tap(val => { this.globalEventsManager.showLoading(true); }),
    switchMap(id => this.productController.getProductUsingGET(id).pipe(
      catchError(val => of(null))
    )),
    filter(resp => !!resp),
    map(resp => {
      return resp.data
    }),
    tap(val => {
      this.reloadLabels();
      if (this.action === 'labels') {
        this.reloadLabel();
      } else {
        if (this.currentLabel) this.labelSelect$.next({ id: this.currentLabel.id, preventEmit: true, selected: false });
        this.currentLabel = null;
      }
    }),
    tap(val => { this.globalEventsManager.showLoading(false); }),
    tap(data => {
      let product = data
      // console.log("PRODUCT", data);
      this.productForm = generateFormFromMetadata(ApiProduct.formMetadata(), product, ApiProductValidationScheme)
      let marketShareForm = generateFormFromMetadata(marketShareFormMetadata(), product.keyMarketsShare, MarketShareValidationScheme)
      this.productForm.setControl('keyMarketsShare', marketShareForm)
      let pricingTransparencyForm = generateFormFromMetadata(pricingTransparencyFormMetadata(), product.settings.pricingTransparency, pricingTransparencyValidationScheme);
      (this.productForm.get('settings') as FormGroup).setControl('pricingTransparency', pricingTransparencyForm);
      let comparisonOfPriceForm = generateFormFromMetadata(ApiComparisonOfPrice.formMetadata(), product.comparisonOfPrice, ApiComparisonOfPriceValidationScheme);
      this.productForm.setControl('comparisonOfPrice', comparisonOfPriceForm)
      let priceForm = generateFormFromMetadata(pricesFormMetadata(), product.comparisonOfPrice.prices, pricesValidationScheme);
      (this.productForm.get('comparisonOfPrice') as FormGroup).setControl('prices', priceForm);
      this.initializeListManagers()
      let companyFormMediaLinks = CompanyDetailComponent.generateSocialMediaForm();
      let oldMediaLinks = this.productForm.get('company.mediaLinks').value;
      companyFormMediaLinks.setValue({ ...companyFormMediaLinks.value, ...oldMediaLinks });
      (this.productForm.get('company') as FormGroup).setControl('mediaLinks', companyFormMediaLinks);
      this.productForm.updateValueAndValidity()
      this.initializeOriginLocations();
      this.initializeMarkers()
    }),
    shareReplay(1)
  )

  reloadLabels() {
    this.labelsReload$.next(true)
  }

  labelsReload$ = new BehaviorSubject<boolean>(false);

  pId = this.route.snapshot.params.id

  labels$ = combineLatest(this.labelsReload$, this.pId,
    (ping: boolean, pId: number) => {
      if (ping && pId != null) return Number(pId)
      return null
    }
  ).pipe(
    filter(val => val != null),
    switchMap(id => this.productController.getProductLabelsUsingGET(id).pipe(
      catchError(val => of(null))
    )),
    filter(val => val != null),
    map(resp => {
      return resp.data
    }),
    // tap(val => console.log("LAB:", val)),
    shareReplay(1)
  )

  reloadLabel$ = new BehaviorSubject<number>(null)

  reloadLabel() {
    if (this.currentLabel) {
      this.reloadLabel$.next(this.currentLabel.id)
    }
  }

  loadLabel(label) {
    // console.log("LOAD: X", label, this.currentLabel)
    if (this.changed) {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'warning',
        title: $localize`:@@productLabel.loadLabel.warning.title:Error`,
        message: $localize`:@@productLabel.loadLabel.warning.message:Unsaved data. Please save changes before creating a new label.`
      })
      if (this.currentLabel) {
        this.labelSelect$.next({ id: this.currentLabel.id, preventEmit: true })
      }
      return;
    }

    if (this.initialReload) {
      this.initialReload = false;
      this.labelSelect$.next({ id: this.redirectToCertainLabel, preventEmit: true })
      this.reloadLabel$.next(this.redirectToCertainLabel)
      this.reload();
    }
    else {
      this.reloadLabel$.next(label.id)
      this.labelTitleForm.setValue(null);
    }
  }

  initialized$ = new BehaviorSubject<boolean>(false);

  currentLabel$ = combineLatest(this.initialized$, this.reloadLabel$,
    (initialized: boolean, labelId: number) => {
      return initialized ? labelId : null;
    }).pipe(
      filter(val => val != null),
      switchMap(id => this.productController.getProductLabelUsingGET(id).pipe(
        catchError(val => of(null))
      )),
      filter(x => x != null),
      tap(resp => {
        this.fadeInProductOnRefresh()
      }),
      map(resp => {
        return resp.data
      }),
      tap(label => this.initializeByLabel(label)),
      shareReplay(1)
    )


  async prepareForm(data) {
    let product = data
    // console.log("CURRENT LABEL DATA:", data)
    this.productForm = generateFormFromMetadata(ApiProduct.formMetadata(), product, ApiProductValidationScheme)
    let marketShareForm = generateFormFromMetadata(marketShareFormMetadata(), product.keyMarketsShare, MarketShareValidationScheme)
    this.productForm.setControl('keyMarketsShare', marketShareForm)
    let pricingTransparencyForm = generateFormFromMetadata(pricingTransparencyFormMetadata(), product.settings.pricingTransparency, pricingTransparencyValidationScheme);
    (this.productForm.get('settings') as FormGroup).setControl('pricingTransparency', pricingTransparencyForm);
    let comparisonOfPriceForm = generateFormFromMetadata(ApiComparisonOfPrice.formMetadata(), product.comparisonOfPrice, ApiComparisonOfPriceValidationScheme);
    this.productForm.setControl('comparisonOfPrice', comparisonOfPriceForm)
    let priceForm = generateFormFromMetadata(pricesFormMetadata(), product.comparisonOfPrice.prices, pricesValidationScheme);
    (this.productForm.get('comparisonOfPrice') as FormGroup).setControl('prices', priceForm);
    this.initializeListManagers()
    let companyFormMediaLinks = CompanyDetailComponent.generateSocialMediaForm();
    let oldMediaLinks = this.productForm.get('company.mediaLinks').value;
    companyFormMediaLinks.setValue({ ...companyFormMediaLinks.value, ...oldMediaLinks });
    (this.productForm.get('company') as FormGroup).setControl('mediaLinks', companyFormMediaLinks);
    this.productForm.updateValueAndValidity()
    this.initializeOriginLocations();
    this.initializeMarkers()
    //console.log("FORM:", this.productForm)
  }

  static ApiProcessDocumentCreateEmptyObject(): ApiProcessDocument {
    let obj = ApiProcessDocument.formMetadata();
    return defaultEmptyObject(obj) as ApiProcessDocument
  }

  static ApiProcessDocumentEmptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(ProductLabelComponent.ApiProcessDocumentCreateEmptyObject(), ApiProcessDocumentValidationScheme.validators)
      return f
    }
  }

  static ApiResponsibilityFarmerPictureCreateEmptyObject(): ApiResponsibilityFarmerPicture {
    let obj = ApiResponsibilityFarmerPicture.formMetadata();
    return defaultEmptyObject(obj) as ApiResponsibilityFarmerPicture
  }

  static ApiResponsibilityFarmerPictureEmptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(ProductLabelComponent.ApiResponsibilityFarmerPictureCreateEmptyObject(), ApiResponsibilityFarmerPictureValidationScheme.validators)
      return f
    }
  }

  standardsListManager = null
  recordsListManager = null
  farmerPhotosListManager = null



  initializeListManagers() {
    this.standardsListManager = new ListEditorManager<ApiCertification>(
      this.productForm.get('process.standards') as FormArray,
      CompanyDetailComponent.ApiCertificationEmptyObjectFormFactory(),
      ApiCertificationValidationScheme
    )
    this.recordsListManager = new ListEditorManager<ApiProcessDocument>(
      this.productForm.get('process.records') as FormArray,
      ProductLabelComponent.ApiProcessDocumentEmptyObjectFormFactory(),
      ApiProcessDocumentValidationScheme
    )
    this.farmerPhotosListManager = new ListEditorManager<ApiResponsibilityFarmerPicture>(
      this.productForm.get('responsibility.pictures') as FormArray,
      ProductLabelComponent.ApiResponsibilityFarmerPictureEmptyObjectFormFactory(),
      ApiResponsibilityFarmerPictureValidationScheme
    )
  }


  formProductionRecord = new FormControl(null)

  emptyObject() {
    let obj = defaultEmptyObject(ApiProduct.formMetadata()) as ApiProduct;
    obj.process = defaultEmptyObject(ApiProcess.formMetadata())
    obj.responsibility = defaultEmptyObject(ApiResponsibility.formMetadata())
    obj.sustainability = defaultEmptyObject(ApiSustainability.formMetadata())
    obj.settings = defaultEmptyObject(ApiProductSettings.formMetadata())
    obj.company = defaultEmptyObject(ApiCompany.formMetadata())
    obj.company.headquarters = defaultEmptyObject(ApiAddress.formMetadata())
    return obj
  }

  async newProduct() {
    this.productForm = generateFormFromMetadata(ApiProduct.formMetadata(), this.emptyObject(), ApiProductValidationScheme)
    let marketShareForm = generateFormFromMetadata(marketShareFormMetadata(), {}, MarketShareValidationScheme)
    this.productForm.setControl('keyMarketsShare', marketShareForm)
    let pricingTransparencyForm = generateFormFromMetadata(pricingTransparencyFormMetadata(), {}, pricingTransparencyValidationScheme);
    (this.productForm.get('settings') as FormGroup).setControl('pricingTransparency', pricingTransparencyForm);

    let comparisonOfPriceForm = generateFormFromMetadata(ApiComparisonOfPrice.formMetadata(), {}, ApiComparisonOfPriceValidationScheme);
    this.productForm.setControl('comparisonOfPrice', comparisonOfPriceForm);
    let priceForm = generateFormFromMetadata(pricesFormMetadata(), {}, pricesValidationScheme);
    (this.productForm.get('comparisonOfPrice') as FormGroup).setControl('prices', priceForm);

    let originForm = generateFormFromMetadata(ApiProductOrigin.formMetadata(), {}, ApiProductOriginValidationScheme);
    this.productForm.setControl('origin', originForm);

    this.initializeListManagers()
    let companyFormMediaLinks = CompanyDetailComponent.generateSocialMediaForm();
    (this.productForm.get('company') as FormGroup).setControl('mediaLinks', companyFormMediaLinks);
    this.productForm.updateValueAndValidity()
    let companyId = this.route.snapshot.params.companyId;
    try {
      this.globalEventsManager.showLoading(true)
      let resp = await this.companyController.getCompanyUsingGET(Number(companyId)).pipe(take(1)).toPromise()
      let company = resp.data
      let companyForm = generateFormFromMetadata(ApiCompany.formMetadata(), company, ApiCompanyValidationScheme)
      this.productForm.setControl('company', companyForm);
      this.productForm.updateValueAndValidity()
      this.productForm.get('settings.language').setValue("EN");
    } catch (e) {
      // console.log(e)
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@productLabel.newProduct.error.title:Error`,
        message: $localize`:@@productLabel.newProduct.error.message:Wrong company data. Cannot create a product.`
      })
      this.router.navigate(['product-labels'])
    } finally {
      this.globalEventsManager.showLoading(false)
    }
  }

  userForm = new FormControl(null)

  userResultFormatter = (value: any) => {
    return this.userSifrant.textRepresentation(value)
  }

  userInputFormatter = (value: any) => {
    return this.userSifrant.textRepresentation(value)
  }


  goBack(): void {
    // console.log("GOBACK")
    this.router.navigate(['product-labels'])
  }

  async save() {
    this.submitted = true;
    if (!this.changed) return // nothing to save
    if (!this.currentLabel) {   // No labels
      let res = await this.saveProduct(true)   // save and reload product
      if (res) {
        this.submitted = false;
      }
      return res;
    } else {
      let res = await this.saveCurrentLabel(true);
      if (res) {
        this.submitted = false;
      }
      // label is changed
      // if (this.productChanged) {
      //   let res = await this.saveCurrentLabel(false);  // first save label, but do not reload
      //   if (res) {
      //     res = await this.saveProduct(true)  // save product and reload all
      //   }
      //   if (res) {
      //     this.submitted = false;
      //   }
      //   return res;
      // } else {  // save label and reload
      // let res = await this.saveCurrentLabel(true);
      // if (res) {
      //   this.submitted = false;
      // }
      return res;
    }
  }

  // returns true if no error
  async saveProduct(reload = true) {
    this.submitted = true;
    if (this.productForm.invalid) {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@productLabel.saveProduct.error.title:Error`,
        message: $localize`:@@productLabel.saveProduct.error.message:Errors on page. Please check!`
      })
      return false;
    }

    let result = false;
    try {
      this.globalEventsManager.showLoading(true);
      let data = this.productForm.value
      // console.log("DATA", data);
      let res = await this.productController.updateProductUsingPUT(data).pipe(take(1)).toPromise()
      if (res && res.status === 'OK') {
        this.productForm.markAsPristine()
        if(this.visibilityForm) this.visibilityForm.markAsPristine();
        this.mapToChain(this.pId);
        if (reload) {
          this.reload()
        }
        result = true;
      }
    } catch (e) {

    } finally {
      this.globalEventsManager.showLoading(false);
    }
    return result;
  }

  async saveCurrentLabel(reload = false) {
    let labels = this.currentLabelFields()
    let res = await this.productController.updateProductLabelUsingPUT(
      {
        ...this.currentLabel,
        fields: labels,
        title: this.labelTitleForm.value
      },
    ).pipe(take(1)).toPromise();
    if (res && res.status === 'OK') {
      let data = this.productForm.value;

      data['labelId'] = this.currentLabel.id;
      data['id'] = this.pId;
      let resC = await this.productController.updateProductLabelContentUsingPUT(data as ApiProductLabelContent).pipe(take(1)).toPromise();
      if (resC && resC.status === 'OK') this.productForm.markAsPristine();
      this.mapToChain(this.pId);
      this.visibilityForm.markAsPristine();
      this.labelTitleForm.setValue(null);
      this.labelTitleForm.markAsPristine();
      this.resetMoveIndicator();
      if (reload) {
        this.reloadLabels()
      }
      return true;
    }
    return false;
  }

  async create() {
    this.submitted = true;

    if (this.productForm.invalid) {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@productLabel.create.error.title:Error`,
        message: $localize`:@@productLabel.create.error.message:Errors on page. Please check!`
      })
      return
    }
    try {
      this.globalEventsManager.showLoading(true);
      let data = this.productForm.value
      delete data['id']
      // data.company.id = 1 //* I guess this should be removed? */
      let res: ApiResponseApiBaseEntity = await this.productController.createProductUsingPOST(data).pipe(take(1)).toPromise()
      if (res && res.status === 'OK') {
        if (res.data && res.data.id) this.mapToChain(res.data.id, false)
        this.productForm.markAsPristine()
        this.goBack();
      }
    } catch (e) {

    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }


  async mapToChain(id: number, update: boolean = true) {
    let respProd = await this.productController.getProductUsingGET(id).pipe(take(1)).toPromise();
    if (respProd && 'OK' === respProd.status && respProd.data) {
      let p = respProd.data;
      let organizationRoles = [];
      if (p.associatedCompanies && p.associatedCompanies.length > 0) {
        for (let com of p.associatedCompanies) {
          let assocComp = {
            companyId: com.company.id,
            role: com.type
          }
          organizationRoles.push(assocComp);
        }
      }
      let labels = [];
      let respProd1 = await this.productController.getProductLabelsUsingGET(id).pipe(take(1)).toPromise();
      if (respProd1 && "OK" == respProd1.status && respProd1.data) {
        for (let d of respProd1.data) {
          let respProd2 = await this.productController.getProductLabelValuesUsingGET(d.id).pipe(take(1)).toPromise();
          if (respProd2 && "OK" === respProd2.status && respProd2.data) {
            labels.push(respProd2.data);
          }
        }
      }
      let obj = {
        id: p.id,
        name: p.name,
        description: p.description,
        howToUse: p.howToUse ? p.howToUse : "",
        ingredients: p.ingredients ? p.ingredients : "",
        nutritionalValue: p.nutritionalValue ? p.nutritionalValue : "",
        origin: p.origin,
        photo: p.photo,
        process: p.process,
        responsibility: p.responsibility,
        sustainability: p.sustainability,
        keyMarketsShare: p.keyMarketsShare ? p.keyMarketsShare : {},
        companyId: p.company && p.company.id ? p.company.id : null,
        organizationRoles: organizationRoles,
        labels: labels
      }
      if (update) {
        let res = await this.chainProductService.getProductByAFId(id).pipe(take(1)).toPromise();
        if (res && 'OK' === res.status && res.data) {
          obj['_id'] = dbKey(res.data);
          obj['_rev'] = res.data._rev;
        }
      }
      let res = await this.chainProductService.postProduct(obj).pipe(take(1)).toPromise()
      if (res && 'OK' != res.status) {
      }
    }
  }



  onFileUpload(event) {
    // console.log(event)
  }

  labelsSection = {
    anchor: 'PRODUCT_LABELS',
    title: $localize`:@@productLabel.labelsSection.labels:QR labels`,
    icon: 'info'
  }

  productSection = {
    anchor: 'PRODUCT_GENERAL',
    title: $localize`:@@productLabel.labelsSection.general:Product`
  }

  processSection = {
    anchor: 'PRODUCT_PROCESS',
    title: $localize`:@@productLabel.labelsSection.process:Process`
  }

  socialResponsibilitySection = {
    anchor: 'PRODUCT_SOCIAL_RESPONSIBILITY',
    title: $localize`:@@productLabel.labelsSection.responsibility:Social responsibility`,
  }

  environmentalSustainabilitySection = {
    anchor: 'PRODUCT_ENVIRONMENTAL_SUSTAINABILITY',
    title: $localize`:@@productLabel.labelsSection.sustainability:Environmental sustainability`,
  }

  settingsSection = {
    anchor: 'SETTINGS',
    title: $localize`:@@productLabel.labelsSection.settings:Settings`,
  }


  companySection = {
    anchor: 'PRODUCT_COMPANY',
    title: $localize`:@@productLabel.labelsSection.company:Company`,
  }

  toc = [
    this.labelsSection,
    this.productSection,
    this.processSection,
    this.socialResponsibilitySection,
    this.environmentalSustainabilitySection,
    this.settingsSection,
    this.companySection
  ]


  //origin location helper methods
  get originLocations(): FormArray {
    return this.productForm.get('origin.locations') as FormArray
  }

  createOrFillOriginLocationsItem(loc: any, create: boolean): FormGroup {
    return new FormGroup({
      latitude: new FormControl(create ? loc.lat : loc.latitude),
      longitude: new FormControl(create ? loc.lng : loc.longitude),
      pinName: new FormControl(create ? null : loc.pinName),
      numberOfFarmers: new FormControl(create ? null : loc.numberOfFarmers),
    });
  }

  initializeOriginLocations(): void {
    let tmp = new FormArray([]);
    for (let loc of this.originLocations.value) {
      tmp.push(this.createOrFillOriginLocationsItem(loc, false));
    };
    (this.productForm.get('origin') as FormGroup).setControl('locations', tmp)
    this.productForm.updateValueAndValidity()
  }

  initializeMarkers(): void {
    this.markers = [];
    for (let loc of this.originLocations.value) {
      let tmp = {
        position: {
          lat: loc.latitude,
          lng: loc.longitude
        },
        label: {
          text: loc.numberOfFarmers ? String(loc.numberOfFarmers) : ' '
        },
        infoText: loc.pinName
      }
      this.markers.push(tmp);
      this.initialBounds.push(tmp.position);
    }
  }

  addOriginLocations(loc) {
    let tmp = {
      position: loc,
      label: {
        text: ' '
      },
      infoText: ' '
    }
    this.markers.push(tmp)
    this.originLocations.push(this.createOrFillOriginLocationsItem(loc, true) as FormGroup);
    this.productForm.markAsDirty();
  }

  removeOriginLocation(index: number) {
    this.originLocations.removeAt(index);
    this.markers.splice(index, 1);
    this.productForm.markAsDirty();
  }

  updateMarkerLocation(loc, index) {
    this.originLocations.at(index).get('latitude').setValue(loc.lat);
    this.originLocations.at(index).get('longitude').setValue(loc.lng);
    let tmpCurrent = this.markers[index];
    let tmp = {
      position: loc,
      label: tmpCurrent.label,
      infoText: tmpCurrent.infoText
    }
    this.markers.splice(index, 1, tmp);
  }
  updateInfoWindow(infoText, index) {
    let tmpCurrent = this.markers[index];
    let tmp = {
      position: tmpCurrent.position,
      label: tmpCurrent.label,
      infoText: infoText
    }
    this.markers.splice(index, 1, tmp);
  }

  dblClick(event: google.maps.MouseEvent) {
    this.addOriginLocations(event.latLng.toJSON());
  }

  dragend(event, index) {
    this.updateMarkerLocation(event.latLng.toJSON(), index);
  }

  openInfoWindow(gMarker, marker) {
    this.gInfoWindowText = marker.infoText;
    this.gInfoWindow.open(gMarker);
  }

  onKey(event, index) {
    this.updateInfoWindow(event.target.value, index)
  }

  get isGoogleMapsLoaded() {  // fix of a google maps glitch
    return !!window.google
  }

  googleMapsIsLoaded() {
    if (this.initialBounds.length == 0) return;
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

  resetMap() {
    this.initialBounds = [];
    for (let m of this.markers) {
      this.initialBounds.push(m.position);
    }
    this.googleMapsIsLoaded();
  }

  //
  openOnStart(value: any) {
    return true;
  }

  nonEmptyFormArray(value: any) {
    return value && value.length > 0
  }

  emptyField = '-'

  // indicator of at least on move
  _itemMoved = false;

  registerMove() {
    this._itemMoved = true;
  }

  resetMoveIndicator() {
    this._itemMoved = false;
  }

  get moved() {
    return this._itemMoved;
  }

  // PRODUCT
  @ViewChild("productName", { static: false })
  productNameTmpl: TemplateRef<any>;

  @ViewChild("productLogo", { static: false })
  productLogoTmpl: TemplateRef<any>;

  @ViewChild("productDescription", { static: false })
  productDescriptionTmpl: TemplateRef<any>;

  @ViewChild("ingredients", { static: false })
  ingredientsTmpl: TemplateRef<any>;

  @ViewChild("nutritionalValue", { static: false })
  nutritionalValueTmpl: TemplateRef<any>;

  @ViewChild("howToUse", { static: false })
  howToUseTmpl: TemplateRef<any>;

  @ViewChild("origin", { static: false })
  originValueTmpl: TemplateRef<any>;

  @ViewChild("keyMarkets", { static: false })
  keyMarketsTmpl: TemplateRef<any>;

  @ViewChild("speciality", { static: false })
  specialityTmpl: TemplateRef<any>;

  productElements: any[] = []

  generateProductElements() {
    this.productElements = [
      { name: 'name', section: 'product', visible: new FormControl(true), template: this.productNameTmpl, disableDrag: true },
      { name: 'photo', section: 'product', visible: new FormControl(true), template: this.productLogoTmpl, disableDrag: true },
      { name: 'description', section: 'product', visible: new FormControl(true), template: this.productDescriptionTmpl, disableDrag: true },
      { name: 'ingredients', section: 'product', visible: new FormControl(false), template: this.ingredientsTmpl },
      { name: 'nutritionalValue', section: 'product', visible: new FormControl(false), template: this.nutritionalValueTmpl },
      { name: 'howToUse', section: 'product', visible: new FormControl(false), template: this.howToUseTmpl },
      { name: 'origin', section: 'product', visible: new FormControl(true), template: this.originValueTmpl },
      { name: 'keyMarketsShare', section: 'product', visible: new FormControl(false), template: this.keyMarketsTmpl },
      { name: 'speciality', section: 'product', visible: new FormControl(false), template: this.specialityTmpl }
    ];
  }

  onDropProductSection(event) {
    if (this.productElements[event.previousIndex].disableDrag || this.productElements[event.currentIndex].disableDrag) return
    moveItemInArray(this.productElements, event.previousIndex, event.currentIndex);
    if (event.previousIndex != event.currentIndex) {
      this.registerMove()
    }
  }

  // PROCESS
  @ViewChild("production", { static: false })
  productionTmpl: TemplateRef<any>;

  @ViewChild("storage", { static: false })
  storageTmpl: TemplateRef<any>;

  @ViewChild("codesOfConduct", { static: false })
  codesOfConductTmpl: TemplateRef<any>;

  @ViewChild("certificationsAndStandards", { static: false })
  certificationsAndStandardsTmpl: TemplateRef<any>;

  @ViewChild("productionRecords", { static: false })
  productionRecordsTmpl: TemplateRef<any>;

  processElements: any[] = []

  generateProcessElements() {
    this.processElements = [
      { name: 'process.production', section: 'process', visible: new FormControl(false), template: this.productionTmpl },
      { name: 'process.storage', section: 'process', visible: new FormControl(false), template: this.storageTmpl },
      { name: 'process.codesOfConduct', section: 'process', visible: new FormControl(false), template: this.codesOfConductTmpl },
      { name: 'process.standards', section: 'process', visible: new FormControl(false), template: this.certificationsAndStandardsTmpl },
      { name: 'process.records', section: 'process', visible: new FormControl(false), template: this.productionRecordsTmpl },
    ];
  }

  onDropProcessSection(event) {
    if (this.processElements[event.previousIndex].disableDrag || this.processElements[event.currentIndex].disableDrag) return
    moveItemInArray(this.processElements, event.previousIndex, event.currentIndex);
    if (event.previousIndex != event.currentIndex) {
      this.registerMove()
    }
  }

  // SOCIAL RESPONSIBILITY
  @ViewChild("laborPolicies", { static: false })
  laborPoliciesTmpl: TemplateRef<any>;

  @ViewChild("relationshipWithFarmersSuppliers", { static: false })
  relationshipWithFarmersSuppliersTmpl: TemplateRef<any>;

  @ViewChild("farmerStory", { static: false })
  farmerStoryTmpl: TemplateRef<any>;

  // @ViewChild("farmerStoryName", { static: false })
  // farmerStoryNameTmpl: TemplateRef<any>;

  // @ViewChild("farmerStoryPhotos", { static: false })
  // farmerStoryPhotosTmpl: TemplateRef<any>;

  // @ViewChild("farmerStoryStory", { static: false })
  // farmerStoryStoryTmpl: TemplateRef<any>;

  socialResponsibilityElements: any[] = []

  generateSocialResponsibilityElements() {
    this.socialResponsibilityElements = [
      { name: 'responsibility.laborPolicies', section: 'responsibility', visible: new FormControl(false), template: this.laborPoliciesTmpl },
      { name: 'responsibility.relationship', section: 'responsibility', visible: new FormControl(false), template: this.relationshipWithFarmersSuppliersTmpl },
      // {name: 'responsibility.farmer', section: 'responsibility', visible: new FormControl(false), template: this.farmerStoryNameTmpl},
      // {name: 'responsibility.pictures', section: 'responsibility', visible: new FormControl(false), template: this.farmerStoryPhotosTmpl},
      // {name: 'responsibility.story', section: 'responsibility', visible: new FormControl(false), template: this.farmerStoryStoryTmpl},
      { name: 'responsibility.farmerStory', section: 'responsibility', visible: new FormControl(false), template: this.farmerStoryTmpl },
    ];
  }

  onDropSocialResponsibilitySection(event) {
    if (this.socialResponsibilityElements[event.previousIndex].disableDrag || this.socialResponsibilityElements[event.currentIndex].disableDrag) return
    moveItemInArray(this.socialResponsibilityElements, event.previousIndex, event.currentIndex);
    if (event.previousIndex != event.currentIndex) {
      this.registerMove()
    }
  }

  // ENVIRONMENTAL SUSTAINABILITY
  @ViewChild("environmentalyFriendlyProduction", { static: false })
  environmentalyFriendlyProductionTmpl: TemplateRef<any>;

  @ViewChild("sustainablePackaging", { static: false })
  sustainablePackagingTmpl: TemplateRef<any>;

  @ViewChild("co2Footprint", { static: false })
  co2FootprintTmpl: TemplateRef<any>;

  environmentalSustainabilityElements: any[] = []

  generateEnvironmentalSustainabilityElements() {
    this.environmentalSustainabilityElements = [
      { name: 'sustainability.production', section: 'sustainability', visible: new FormControl(false), template: this.environmentalyFriendlyProductionTmpl },
      { name: 'sustainability.packaging', section: 'sustainability', visible: new FormControl(false), template: this.sustainablePackagingTmpl },
      { name: 'sustainability.co2Footprint', section: 'sustainability', visible: new FormControl(false), template: this.co2FootprintTmpl },
    ];
  }

  onDropEnvironmentalSustainabilitySection(event) {
    if (this.environmentalSustainabilityElements[event.previousIndex].disableDrag || this.environmentalSustainabilityElements[event.currentIndex].disableDrag) return
    moveItemInArray(this.environmentalSustainabilityElements, event.previousIndex, event.currentIndex);
    if (event.previousIndex != event.currentIndex) {
      this.registerMove()
    }
  }

  // COMPANY
  @ViewChild("companyName", { static: false })
  companyNameTmpl: TemplateRef<any>;

  @ViewChild("companyLogo", { static: false })
  companyLogoTmpl: TemplateRef<any>;

  @ViewChild("companyHeadquarters", { static: false })
  companyHeadquartersTmpl: TemplateRef<any>;

  @ViewChild("aboutTheCompany", { static: false })
  aboutTheCompanyTmpl: TemplateRef<any>;

  @ViewChild("nameOfManagerCEO", { static: false })
  nameOfManagerCEOTmpl: TemplateRef<any>;

  @ViewChild("contactEmail", { static: false })
  contactEmailTmpl: TemplateRef<any>;

  @ViewChild("contactPhoneNumber", { static: false })
  contactPhoneNumberTmpl: TemplateRef<any>;

  @ViewChild("companyWebPage", { static: false })
  companyWebPageTmpl: TemplateRef<any>;

  @ViewChild("facebook", { static: false })
  facebookTmpl: TemplateRef<any>;

  @ViewChild("instagram", { static: false })
  instagramTmpl: TemplateRef<any>;

  @ViewChild("twitter", { static: false })
  twitterTmpl: TemplateRef<any>;

  @ViewChild("youtube", { static: false })
  youtubeTmpl: TemplateRef<any>;

  @ViewChild("other", { static: false })
  otherTmpl: TemplateRef<any>;

  companyElements: any[] = []

  generateCompanyElements() {
    this.companyElements = [
      { name: 'company.name', section: 'company', visible: new FormControl(false), template: this.companyNameTmpl },
      { name: 'company.logo', section: 'company', visible: new FormControl(false), template: this.companyLogoTmpl },
      { name: 'company.headquarters', section: 'company', visible: new FormControl(false), template: this.companyHeadquartersTmpl },
      { name: 'company.about', section: 'company', visible: new FormControl(false), template: this.aboutTheCompanyTmpl },
      { name: 'company.manager', section: 'company', visible: new FormControl(false), template: this.nameOfManagerCEOTmpl },
      { name: 'company.email', section: 'company', visible: new FormControl(false), template: this.contactEmailTmpl },
      { name: 'company.phone', section: 'company', visible: new FormControl(false), template: this.contactPhoneNumberTmpl },
      { name: 'company.webPage', section: 'company', visible: new FormControl(false), template: this.companyWebPageTmpl },
      { name: 'company.mediaLinks.facebook', section: 'company', visible: new FormControl(false), template: this.facebookTmpl },
      { name: 'company.mediaLinks.instagram', section: 'company', visible: new FormControl(false), template: this.instagramTmpl },
      { name: 'company.mediaLinks.twitter', section: 'company', visible: new FormControl(false), template: this.twitterTmpl },
      { name: 'company.mediaLinks.youtube', section: 'company', visible: new FormControl(false), template: this.youtubeTmpl },
      { name: 'company.mediaLinks.other', section: 'company', visible: new FormControl(false), template: this.otherTmpl },
    ];
  }

  onDropCompanySection(event) {
    if (this.companyElements[event.previousIndex].disableDrag || this.companyElements[event.currentIndex].disableDrag) return
    moveItemInArray(this.companyElements, event.previousIndex, event.currentIndex);
    if (event.previousIndex != event.currentIndex) {
      this.registerMove()
    }
  }

  // COMPARISON OF PRICE
  @ViewChild("description", { static: false })
  descriptionTmpl: TemplateRef<any>;

  @ViewChild("prices", { static: false })
  pricesTmpl: TemplateRef<any>;

  comparisonOfPriceElements: any[] = []

  generateComparisonOfPriceElementsElements() {
    this.comparisonOfPriceElements = [
      { name: 'comparisonOfPrice.prices', section: 'comparisonOfPrice', visible: new FormControl(false), template: this.pricesTmpl },
      { name: 'comparisonOfPrice.description', section: 'comparisonOfPrice', visible: new FormControl(false), template: this.descriptionTmpl }
    ];
  }

  onDropComparisonOfPriceElementsSection(event) {
    if (this.comparisonOfPriceElements[event.previousIndex].disableDrag || this.comparisonOfPriceElements[event.currentIndex].disableDrag) return
    moveItemInArray(this.comparisonOfPriceElements, event.previousIndex, event.currentIndex);
    if (event.previousIndex != event.currentIndex) {
      this.registerMove()
    }
  }

  // SETTINGS
  @ViewChild("language", { static: false })
  languageTmpl: TemplateRef<any>;

  @ViewChild("checkAuthenticity", { static: false })
  checkAuthenticityTmpl: TemplateRef<any>;

  @ViewChild("traceOrigin", { static: false })
  traceOriginTmpl: TemplateRef<any>;

  @ViewChild("giveFeedback", { static: false })
  giveFeedbackTmpl: TemplateRef<any>;

  @ViewChild("pricingTransparency", { static: false })
  pricingTransparencyTmpl: TemplateRef<any>;

  @ViewChild("increaseIncome", { static: false })
  increaseIncomeTmpl: TemplateRef<any>;

  // @ViewChild("costBreakdown", { static: false })
  // costBreakdownTmpl: TemplateRef<any>;

  @ViewChild("increaseIncomeDescription", { static: false })
  increaseIncomeDescriptionTmpl: TemplateRef<any>;

  @ViewChild("gdprText", { static: false })
  gdprTextTmpl: TemplateRef<any>;

  @ViewChild("privacyPolicyText", { static: false })
  privacyPolicyTextTmpl: TemplateRef<any>;

  @ViewChild("termsOfUseText", { static: false })
  termsOfUseTextTmpl: TemplateRef<any>;

  @ViewChild("knowledgeBlog", { static: false })
  knowledgeBlogTmpl: TemplateRef<any>;

  settingsElements: any[] = []

  generateSettingsElements() {
    if(this.action === 'labels') {
      this.settingsElements = [
        { name: 'settings.language', section: 'settings', visible: new FormControl(false), template: this.languageTmpl },
        { name: 'settings.checkAuthenticity', section: 'settings', visible: new FormControl(false), template: this.checkAuthenticityTmpl },
        { name: 'settings.traceOrigin', section: 'settings', visible: new FormControl(false), template: this.traceOriginTmpl },
        { name: 'settings.giveFeedback', section: 'settings', visible: new FormControl(false), template: this.giveFeedbackTmpl },
        { name: 'settings.gdprText', section: 'settings', visible: new FormControl(false), template: this.gdprTextTmpl },
        { name: 'settings.privacyPolicyText', section: 'settings', visible: new FormControl(false), template: this.privacyPolicyTextTmpl },
        { name: 'settings.termsOfUseText', section: 'settings', visible: new FormControl(false), template: this.termsOfUseTextTmpl }
      ];
      return;
    }
    this.settingsElements = [
      { name: 'settings.language', section: 'settings', visible: new FormControl(false), template: this.languageTmpl },
      { name: 'knowledgeBlog', section: 'settings', visible: new FormControl(false), template: this.knowledgeBlogTmpl },
      { name: 'settings.checkAuthenticity', section: 'settings', visible: new FormControl(false), template: this.checkAuthenticityTmpl },
      { name: 'settings.traceOrigin', section: 'settings', visible: new FormControl(false), template: this.traceOriginTmpl },
      { name: 'settings.giveFeedback', section: 'settings', visible: new FormControl(false), template: this.giveFeedbackTmpl },
      { name: 'settings.gdprText', section: 'settings', visible: new FormControl(false), template: this.gdprTextTmpl },
      { name: 'settings.privacyPolicyText', section: 'settings', visible: new FormControl(false), template: this.privacyPolicyTextTmpl },
      { name: 'settings.termsOfUseText', section: 'settings', visible: new FormControl(false), template: this.termsOfUseTextTmpl }
    ];
  }

  pricingTransparencyElements: any[] = []
  generatePricingTransparenctElements() {
    this.pricingTransparencyElements = [
      { name: 'settings.incomeIncreaseDescription', section: 'settings', visible: new FormControl(false), template: this.increaseIncomeDescriptionTmpl },
      { name: 'settings.pricingTransparency', section: 'settings', visible: new FormControl(false), template: this.pricingTransparencyTmpl },
      { name: 'settings.increaseIncome', section: 'settings', visible: new FormControl(false), template: this.increaseIncomeTmpl },
      // { name: 'settings.costBreakdown', section: 'settings', visible: new FormControl(false), template: this.costBreakdownTmpl }
    ];
  }

  onDropSettingsSection(event) {
    if (this.settingsElements[event.previousIndex].disableDrag || this.settingsElements[event.currentIndex].disableDrag) return
    moveItemInArray(this.settingsElements, event.previousIndex, event.currentIndex);
    if (event.previousIndex != event.currentIndex) {
      this.registerMove()
    }
  }


  generateDefaultElements() {
    this.generateProductElements();
    this.generateProcessElements();
    this.generateSocialResponsibilityElements();
    this.generateEnvironmentalSustainabilityElements();
    this.generatePricingTransparenctElements();
    this.generateComparisonOfPriceElementsElements();
    this.generateSettingsElements();
    this.generateCompanyElements();

    this.generateJointVisibilityForm();
  }

  visibilityForm: FormGroup = null;
  generateJointVisibilityForm() {
    let allList = [...this.productElements, ...this.processElements, ...this.socialResponsibilityElements,
    ...this.environmentalSustainabilityElements, ...this.pricingTransparencyElements, ...this.comparisonOfPriceElements, ...this.settingsElements, ...this.companyElements];
console.log(allList)
    let formObj = {}
    allList.forEach(element => {
      let fixedKey = element.name.replace(/\./g, "_")
      formObj[fixedKey] = element.visible
    })
    this.visibilityForm = new FormGroup(formObj)
  }

  get labelChanged() {
    return this.moved || (this.visibilityForm && this.visibilityForm.dirty) || this.labelTitleForm.dirty
  }

  get productChanged() {
    return this.productForm.dirty
  }

  ngAfterViewInit() {   // ViewChildren for templates works only after ngAfterViewInit
    setTimeout(() => {
      this.generateDefaultElements()
      this.initialized$.next(true)
    });
  }

  sectionToNameToObj = new Map()

  generateLabelMaps() {
    let productMap = new Map()
    this.processElements.forEach(el => {
      productMap.set(el.name, el)
    })
    let processMap = new Map()
    this.processElements.forEach(el => {
      processMap.set(el.name, el)
    })
    let socialResponsibilityMap = new Map()
    this.socialResponsibilityElements.forEach(el => {
      socialResponsibilityMap.set(el.name, el)
    })
    let environmentalSustainabilityMap = new Map()
    this.environmentalSustainabilityElements.forEach(el => {
      environmentalSustainabilityMap.set(el.name, el)
    })
    let comparisonOfPriceMap = new Map()
    this.comparisonOfPriceElements.forEach(el => {
      comparisonOfPriceMap.set(el.name, el)
    })
    let settingsMap = new Map()
    this.settingsElements.forEach(el => {
      settingsMap.set(el.name, el)
    })
    this.pricingTransparencyElements.forEach(el => {
      settingsMap.set(el.name, el)
    })
    let companyMap = new Map()
    this.companyElements.forEach(el => {
      companyMap.set(el.name, el)
    })
    this.sectionToNameToObj.set('product', productMap);
    this.sectionToNameToObj.set('process', processMap)
    this.sectionToNameToObj.set('responsibility', socialResponsibilityMap)
    this.sectionToNameToObj.set('sustainability', environmentalSustainabilityMap)
    this.sectionToNameToObj.set('comparisonOPrice', comparisonOfPriceMap)
    this.sectionToNameToObj.set('settings', settingsMap)
    this.sectionToNameToObj.set('company', companyMap)
  }

  labelSelect$ = new BehaviorSubject(null)

  async createLabel() {
    if (this.changed) {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'warning',
        title: $localize`:@@productLabel.createLabel.warning.title:Error`,
        message: $localize`:@@productLabel.createLabel.warning.message:Unsaved data. Please save changes before creating a new label.`
      })
      return;
    }
    if (this.mode === 'create') {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@productLabel.createLabel.error.title:Error`,
        message: $localize`:@@productLabel.createLabel.error.message:Cannot create a label. Please create and save the product first.`
      })
      return;
    }
    this.setLanguageForLabel();
  }


  async deleteLabel(labelMessage) {
    let position = labelMessage.position;
    let label = labelMessage.label
    // if(this.productChanged || (label.id != this.currentLabel.id && this.labelChanged)) {
    if (this.changed) {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'warning',
        title: $localize`:@@productLabel.deleteLabel.warning.title:Error`,
        message: $localize`:@@productLabel.deleteLabel.warning.message:Unsaved data. Please save changes before deleting the label.`
      })
      return;
    }
    let res = await this.productController.deleteProductLabelUsingDELETE(label.id).pipe(take(1)).toPromise()
    if (res && res.status == 'OK') {
      this.mapToChain(this.pId);
      if (label.id === this.currentLabel.id) {
        this.labelSelect$.next({ position: position, preventEmit: false })
      }
      this.reload()
    }
  }

  //   export interface ApiProductLabel {
  //     fields?: Array<ApiProductLabelField>;
  //     id?: number;
  //     productId?: number;
  //     title?: string;
  //     uuid?: string;
  // }

  preparePricingTransparencyElements(): any[] {
    let elts = [];
    this.pricingTransparencyElements.forEach(elt => {
      if (elt.name == "settings.increaseIncome") {
        elts.push({
          name: "settings.increaseOfCoffee",
          section: elt.section,
          visible: elt.visible
        })
        elts.push({
          name: "settings.incomeIncreaseDescription",
          section: elt.section,
          visible: elt.visible
        })
        elts.push({
          name: "settings.incomeIncreaseDocument",
          section: elt.section,
          visible: elt.visible
        })
      } else {
        elts.push(elt);
      }
    });
    return elts;
  }

  prepareProductElements(): any[] {
    let elts = [];
    this.productElements.forEach(elt => {
      if (elt.name == "speciality") {
        elts.push({
          name: "specialityDescription",
          section: elt.section,
          visible: elt.visible
        })
        elts.push({
          name: "specialityDocument",
          section: elt.section,
          visible: elt.visible
        })
      } else {
        elts.push(elt);
      }
    });
    return elts;
  }

  prepareSocialResponsibilityElements(): any[] {
    let elts = [];
    this.socialResponsibilityElements.forEach(elt => {
      if (elt.name == "responsibility.farmerStory") {
        elts.push({
          name: "responsibility.farmer",
          section: elt.section,
          visible: elt.visible
        })
        elts.push({
          name: "responsibility.pictures",
          section: elt.section,
          visible: elt.visible
        })
        elts.push({
          name: "responsibility.story",
          section: elt.section,
          visible: elt.visible
        })
      } else {
        elts.push(elt);
      }
    });
    return elts;
  }

  currentLabelFields() {
    let labels = []
    let allSocialResponsibilityElements = this.prepareSocialResponsibilityElements();
    let allProductElements = this.prepareProductElements();
    let allPricingTransparencyElements = this.preparePricingTransparencyElements();
    let allList = [allProductElements, this.processElements, allSocialResponsibilityElements,
      this.environmentalSustainabilityElements, allPricingTransparencyElements, this.comparisonOfPriceElements, this.settingsElements, this.companyElements];
    allList.forEach(list => {
      list.forEach(val => {
        labels.push({
          name: val.name,
          section: val.section,
          visible: val.visible.value
        })
      })
    });
    return labels;
  }

  visibilityMap = new Map()

  async initializeByLabel(label: ApiProductLabel) {

    if (!this.currentLabel) { this.currentLabel = label; this.labelSelect$.next({ id: this.currentLabel.id, preventEmit: true });};
    let res = await this.productController.getProductLabelContentUsingGET(label.id).pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data) {
      this.prepareForm(res.data);
    }
    let newFieldMap = new Map();
    let sortOrderMap = new Map();
    let farmerStoryVisible = false;
    let specialityVisible = false;
    let increaseVisible = false;
    this.generateDefaultElements();
    let allList = [...this.productElements, ...this.processElements, ...this.socialResponsibilityElements,
    ...this.environmentalSustainabilityElements, ...this.pricingTransparencyElements, ...this.comparisonOfPriceElements, ...this.settingsElements, ...this.companyElements];
    let i = 0;
    allList.forEach(el => {    // default order
      sortOrderMap.set(el.name, i);
      i++;
    })
    i = 0;
    label.fields.forEach(field => {
      if (field.name == 'responsibility.farmer') farmerStoryVisible = field.visible;
      if (field.name == 'specialityDescription') specialityVisible = field.visible;
      if (field.name == 'settings.incomeIncreaseDescription') increaseVisible = field.visible;
      newFieldMap.set(field.name, field)
      sortOrderMap.set(field.name, i);
      i++;
    })
    this.productElements.sort((a, b) => sortOrderMap.get(a.name) < sortOrderMap.get(b.name) ? -1 : 1)
    this.processElements.sort((a, b) => sortOrderMap.get(a.name) < sortOrderMap.get(b.name) ? -1 : 1)
    this.socialResponsibilityElements.sort((a, b) => sortOrderMap.get(a.name) < sortOrderMap.get(b.name) ? -1 : 1)
    this.environmentalSustainabilityElements.sort((a, b) => sortOrderMap.get(a.name) < sortOrderMap.get(b.name) ? -1 : 1)
    this.pricingTransparencyElements.sort((a, b) => sortOrderMap.get(a.name) < sortOrderMap.get(b.name) ? -1 : 1)
    this.comparisonOfPriceElements.sort((a, b) => sortOrderMap.get(a.name) < sortOrderMap.get(b.name) ? -1 : 1)
    this.settingsElements.sort((a, b) => sortOrderMap.get(a.name) < sortOrderMap.get(b.name) ? -1 : 1)
    this.companyElements.sort((a, b) => sortOrderMap.get(a.name) < sortOrderMap.get(b.name) ? -1 : 1)
    this.visibilityMap = new Map()
    allList.forEach(el => {    // set visibility forms
      let field = newFieldMap.get(el.name)
      if (field) {
        el.visible.setValue(field.visible)
        // el.visible.markAsDirty()
        // el.visible.updateValueAndValidity()
      } else {
        // console.log("STRANGE", el, field, newFieldMap)
        el.visible.setValue(false)
      }
      if (el.name == "responsibility.farmerStory") el.visible.setValue(farmerStoryVisible)
      if (el.name == "speciality") el.visible.setValue(specialityVisible)
      if (el.name == "settings.increaseIncome") el.visible.setValue(increaseVisible)
      this.visibilityMap.set(el.name, el.visible)
    })
    this.visibilityForm.markAsPristine()
    this.labelTitleForm.setValue(label.title)
    this.labelTitleForm.markAsPristine()
  }

  get changed(): Boolean {
    // console.log("CHG:", this.productChanged, this.labelChanged)
    return this.productChanged || this.labelChanged
  }

  get invalid() {
    return this.productForm.invalid || (this.visibilityForm && this.visibilityForm.invalid)
  }

  reorderMode = false;
  toggleReorder() {
    this.reorderMode = !this.reorderMode;
  }

  labelTitleForm = new FormControl(null)
  editTitleMode = false;

  @ViewChild("labelTitleInput", { static: false })
  labelTitleInput: TextinputComponent;

  toggleEditTitleMode(mode: boolean) {
    if (mode == null) {
      this.editTitleMode = !this.editTitleMode;
    } else {
      this.editTitleMode = mode;
    }
    if (this.editTitleMode) {
      this.labelTitleInput.focus()
    }

  }

  publishString = $localize`:@@productLabel.qrLabels.publish:Publish`
  unpublishString = $localize`:@@productLabel.qrLabels.unpublish:Unpublish`
  get publishText() {
    if (!this.currentLabel) return this.publishString
    if (this.currentLabel.status == ApiProductLabel.StatusEnum.PUBLISHED) return this.unpublishString
    if (this.currentLabel.status == ApiProductLabel.StatusEnum.UNPUBLISHED) return this.publishString
    return this.publishString
  }

  async togglePublish() {
    if (this.changed) {
      // this.globalEventsManager.push({
      //   action: 'error',
      //   notificationType: 'warning',
      //   title: "Error",
      //   message: "Unsaved data. Please save changes before publishing."
      // })
      return;
    }
    let successTitlePublished = $localize`:@@productLabel.togglePublish.success.title.published:Published`;
    let successTitleWithdrawn = $localize`:@@productLabel.togglePublish.success.title.withdrawn:Withdrawn`;
    let successMessagePublished = $localize`:@@productLabel.togglePublish.success.message.published:Label has been successfully published.`;
    let successMessageWithdrawn = $localize`:@@productLabel.togglePublish.success.message.withdrawn:Label is not published anymore.`;
    if (!this.currentLabel || !this.currentLabel.status) return;
    let toBePublished = this.currentLabel.status === ApiProductLabel.StatusEnum.UNPUBLISHED
    let action = toBePublished ? 'PUBLISH_LABEL' : 'UNPUBLISH_LABEL'
    let res = await this.productController.executeAction(action as any, this.currentLabel).pipe(take(1)).toPromise()
    if (res && res.status == "OK") {
      this.mapToChain(this.pId);
      this.reloadLabel();
      this.reloadLabels();//this is needed for label-card updating (maybe there is a better way of doing)
      this.globalEventsManager.push({
        action: 'success',
        notificationType: 'success',
        title: toBePublished ? successTitlePublished : successTitleWithdrawn,
        message: toBePublished ? successMessagePublished : successMessageWithdrawn
      })
    } else {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@productLabel.togglePublish.error.title:Error`,
        message: $localize`:@@productLabel.togglePublish.error.message:Operation cannot be executed. Please try again.`
      })
    }
  }

  async deleteCurrentProduct() {
    if (this.changed) return;
    let productId = Number(this.pId);
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabel.deleteCurrentProduct.warning.message:Are you sure you want to delete the product? This will delete all labels and batches attached to the product as well!`,
      options: { centered: true },
      dismissable: false
    });
    if (result != "ok") return
    let res = await this.productController.deleteProductUsingDELETE(productId).pipe(take(1)).toPromise()
    if (res && res.status == 'OK') {
      this.globalEventsManager.push({
        action: 'success',
        notificationType: 'success',
        title: $localize`:@@productLabel.deleteCurrentProduct.success.title:Deleted`,
        message: $localize`:@@productLabel.deleteCurrentProduct.success.message:Product was successfuly deleted`
      })
      this.router.navigate(['/product-labels'])
      return;
    }
    this.globalEventsManager.push({
      action: 'error',
      notificationType: 'error',
      title: $localize`:@@productLabel.deleteCurrentProduct.error.title:Error`,
      message: $localize`:@@productLabel.deleteCurrentProduct.error.message:Product cannot be deleted. Please try again.`
    })

  }

  fadeInProduct = false;
  fadeInProductOnRefresh() {
    this.fadeInProduct = true;
    setTimeout(() => {
      this.fadeInProduct = false;
    }, 500)
  }

  batches() {
    if (!this.currentLabel) return;
    if (this.changed) return;
    let productId = this.route.snapshot.params.id;
    let labelId = this.currentLabel.id
    this.router.navigate(['/product-labels', productId, 'labels', labelId, 'batches'])
  }

  get showBatches() {
    if (this.productForm && this.productForm.get('settings')) {
      return this.productForm.get('settings.traceOrigin').value;
    }
  }

  statistics() {
    if (!this.currentLabel) return;
    if (this.changed) return;
    let productId = this.route.snapshot.params.id;
    let labelId = this.currentLabel.id
    this.router.navigate(['/product-labels', productId, 'labels', labelId, 'statistics'])
  }

  viewLabel() {
    if (this.changed) return;
    if (this.currentLabel) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/p-cd', this.currentLabel.uuid, 'EMPTY'])
      );
      if (this.productForm.value && this.productForm.value.settings && this.productForm.value.settings.language) {
        window.open(this.productForm.value.settings.language.toLowerCase() + url, '_blank');
      } else {
        window.open(url, '_blank');
      }
    }
  }

  get downloadFileName() {
    let productName = this.productForm.get('name').value;
    let LabelName = this.currentLabelName;
    return productName + "-" + LabelName + "-" + "instructions.pdf"
  }

  downloadInstructions() {
    if (this.changed) return;
    if (this.currentLabel) {
      let sub = this.productController.getProductLabelInstructionsUsingGET(this.currentLabel.id).subscribe(
        blob => {
          let a = document.createElement("a");
          let blobURL = URL.createObjectURL(blob);
          a.download = this.downloadFileName;
          a.href = blobURL;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        error => {
          this.globalEventsManager.push({
            action: 'error',
            notificationType: 'error',
            title: $localize`:@@productLabel.downloadInstructions.error.title:Error`,
            message: $localize`:@@productLabel.downloadInstructions.error.message:PDF cannot be generated. Please try again.`
          })
        }
      )
      this.unsubscribeList.add(sub);
    }
  }

  feedbacks() {
    if (!this.currentLabel) return;
    if (this.changed) return;
    let productId = this.route.snapshot.params.id;
    let labelId = this.currentLabel.id
    this.router.navigate(['/product-labels', productId, 'labels', labelId, 'feedback'], { state: { data: this.currentLabel.uuid } })
  }


  async prefillFromOther(fromSocialResp: boolean) {
    const modalRef = this.modalService.open(PrefillProductSelectionModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabel.prefillFromOther.title:Products`,
      instructionsHtmlProduct: $localize`:@@productLabel.prefillFromOther.instructionsHtmlProduct:Select a product`,
      skipItemId: this.productForm.get('id').value
    })
    let product = await modalRef.result;
    if (product) {
      this.productController.getProductUsingGET(product.id).pipe(take(1))
        .subscribe(resp => {
          if (resp.status == "OK") {
            this.prefillFields(fromSocialResp, resp.data);
          }

        }
        )
    }
  }

  prefillFields(fromSocialResp: boolean, data: any) {
    if (fromSocialResp) {
      if (data.responsibility.laborPolicies) {
        this.productForm.get('responsibility.laborPolicies').setValue(data.responsibility.laborPolicies);
      }
      if (data.responsibility.relationship) {
        this.productForm.get('responsibility.relationship').setValue(data.responsibility.relationship);
      }
      if (data.responsibility.farmer) {
        this.productForm.get('responsibility.farmer').setValue(data.responsibility.farmer);
      }
      if (data.responsibility.pictures) {
        (this.productForm.get('responsibility.pictures') as FormArray).clear();
        data.responsibility.pictures.forEach(pic => {
          (this.productForm.get('responsibility.pictures') as FormArray).push(new FormControl(pic))
        });
      }
      if (data.responsibility.story) {
        this.productForm.get('responsibility.story').setValue(data.responsibility.story);
      }
    } else {
      if (data.sustainability.production) {
        this.productForm.get('sustainability.production').setValue(data.sustainability.production);
      }
      if (data.sustainability.packaging) {
        this.productForm.get('sustainability.packaging').setValue(data.sustainability.packaging);
      }
      if (data.sustainability.co2Footprint) {
        this.productForm.get('sustainability.co2Footprint').setValue(data.sustainability.co2Footprint);
      }
    }
    this.productForm.markAsDirty();
  }

  goToOrders() {
    if (!this.currentLabel) return;
    if (this.changed) return;
    let productId = this.route.snapshot.params.id;
    let labelId = this.currentLabel.id
    this.router.navigate(['/product-labels', productId, 'orders'])
  }


  async prefillCertsFromOther(certsAndStds: boolean) {
    const modalRef = this.modalService.open(PrefillProductSelectionModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabel.prefillCertsFromOther.title:Products`,
      instructionsHtmlProduct: $localize`:@@productLabel.prefillCertsFromOther.instructionsHtmlProduct:Select a product`,
      skipItemId: this.productForm.get('id').value
    })
    let product = await modalRef.result;
    if (product) {
      this.productController.getProductUsingGET(product.id).pipe(take(1))
        .subscribe(resp => {
          if (resp.status == "OK") {
            this.prefillCertFields(certsAndStds, resp.data);
          }

        }
        )
    }
  }

  prefillCertFields(certsAndStds: boolean, data: any) {
    if (certsAndStds) {
      if (data.process.standards) {
        (this.productForm.get('process.standards') as FormArray).clear();
        data.process.standards.forEach(doc => {
          (this.productForm.get('process.standards') as FormArray).push(new FormControl(doc))
        });
      }
    } else {
      if (data.process.records) {
        (this.productForm.get('process.records') as FormArray).clear();
        data.process.records.forEach(doc => {
          (this.productForm.get('process.records') as FormArray).push(new FormControl(doc))
        });
      }
    }
    this.productForm.markAsDirty();
  }

  checkExternalLink(link: string): string {
    if (!link) return '#';
    if (!link.startsWith('https://') && !link.startsWith('http://')) {
      return 'http://' + link;
    }
    return link;
  }

  labelsInfo(evt) {
    let message = "";
    let link = this.editInfoLabelLink;
    if (!link || /^\s*$/.test(link)) {
      message = $localize`:@@productLabel.labelsInfo.message:You can communicate the information about your products through QR labels so that you attach them to your product packaging. Add multiple QR labels to share different information about the same product. You can add QR labels for different package sizes (e.g. label for 50g and 100g packaging) or share information for consumers on one label and information for distributors on another. You can add numerous labels and can use them in communicating different information about the same product to different readers. Always make sure to publish the labels to activate them! <br> If you have any other questions regarding QR labels, please contact us through the brown chat button in your bottom right corner.`
    } else {
      link = this.checkExternalLink(link);
      message = $localize`:@@productLabel.labelsInfo.messageWithLink:You can communicate the information about your products through QR labels so that you attach them to your product packaging. Add multiple QR labels to share different information about the same product. You can add QR labels for different package sizes (e.g. label for 50g and 100g packaging) or share information for consumers on one label and information for distributors on another. You can add numerous labels and can use them in communicating different information about the same product to different readers. Always make sure to publish the labels to activate them! <br> If you have any other questions regarding QR labels, please contact us through the brown chat button in your bottom right corner. <br> <a href=${link} target="_blank" class="labelInfoLink">More Information</a>`
    }
    this.globalEventsManager.openMessageModal({
      type: 'general',
      title: $localize`:@@productLabel.labelsInfo.title:QR  multiple labels`,
      message: message,
      options: { centered: true, size: 'lg' },
      dismissable: false,
      buttons: ['ok'],
      buttonTitles: { ok: 'OK' }
    });
  }

  async initializeLabelsHelperLink() {
    let resp = await this.commonController.getGlobalSettingsUsingGET(this.globalEventsManager.globalSettingsKeys("PRODUCT_LABELS_HELPER_LINK")).pipe(take(1)).toPromise();
    if (resp && resp.data && resp.data.value) this.editInfoLabelLink = resp.data.value
  }

  get languageCodes() {
    let obj = {}
    obj['EN'] = $localize`:@@productLabel.languageCodes.en:EN`
    obj['DE'] = $localize`:@@productLabel.languageCodes.de:DE`
    return obj;
  }
  codebookLanguageCodes = EnumSifrant.fromObject(this.languageCodes)


  productNameLabelAndPlaceholder(type, field) {
    if (this.currentLabel) {
      if (type === 'LABEL' && field === 'name') return $localize`:@@productLabel.label.textinput.label.name:Label name`
      if (type === 'LABEL' && field === 'photo') return $localize`:@@productLabel.label.textinput.label.photo:Label photo`
      if (type === 'LABEL' && field === 'description') return $localize`:@@productLabel.label.textinput.label.description:Label description`
      if (type === 'PLACEHOLDER' && field === 'name') return $localize`:@@productLabel.label.textinput.placeholder.name:Enter label name`
      // if (type === 'PLACEHOLDER' && field === 'photo') return $localize`:@@productLabel.label.textinput.placeholder.photo:Upload label photo`
      // if (type === 'PLACEHOLDER' && field === 'description') return $localize`:@@productLabel.label.textinput.placeholder.description:Enter label description`
    } else {
      if (type === 'LABEL' && field === 'name') return $localize`:@@productLabel.product.textinput.label.name:Product name`
      if (type === 'LABEL' && field === 'photo') return $localize`:@@productLabel.product.textinput.label.photo:Product photo`
      if (type === 'LABEL' && field === 'description') return $localize`:@@productLabel.product.textinput.label.description:Product description`
      if (type === 'PLACEHOLDER' && field === 'name') return $localize`:@@productLabel.product.textinput.placeholder.name:Enter product name`
      // if (type === 'PLACEHOLDER' && field === 'photo') return $localize`:@@productLabel.product.textinput.placeholder.photo:Upload product photo`
      // if (type === 'PLACEHOLDER' && field === 'description') return $localize`:@@productLabel.product.textinput.placeholder.description:Enter product description`
    }
  }

  async setLanguageForLabel() {
    const modalRef = this.modalService.open(LanguageForLabelModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productLabel.languageForLabel.title:Label language`,
      instructionsHtml: $localize`:@@productLabel.languageForLabel.instructionsHtml:Select language for new label:`
    })
    let lang = await modalRef.result;
    if (lang) {

      let labels = this.currentLabelFields()
      let productId = this.pId;
      let res = await this.productController.createProductLabelUsingPOST(
        {
          fields: labels,
          productId: productId
        }
      ).pipe(take(1)).toPromise();
      if (res && res.status === 'OK') {
        let resp = await this.productController.getProductLabelContentUsingGET(res.data.id).pipe(take(1)).toPromise();
        if (resp && resp.status === 'OK' && resp.data) {
          if (lang != 'EN') {
            let data = resp.data;
            data.settings.language = lang;
            data['labelId'] = res.data.id;
            delete data['id'];
            let resC = await this.productController.updateProductLabelContentUsingPUT(data as ApiProductLabelContent).pipe(take(1)).toPromise();
            if (resC && resC.status === 'OK') {
              this.fadeInProductOnRefresh()
              this.labelSelect$.next({ id: res.data.id, preventEmit: false })
              this.reload()
            }
          } else {
            this.fadeInProductOnRefresh()
            this.labelSelect$.next({ id: res.data.id, preventEmit: false })
            this.reload()
          }
        }

      }

    }
  }


}
