import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { faEye, faSeedling, faGlobeAmericas, faFilePdf, faFileImage } from '@fortawesome/free-solid-svg-icons'
import { faFacebookSquare, faTwitterSquare, faInstagramSquare, faYoutubeSquare } from '@fortawesome/free-brands-svg-icons'
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalImproved } from '../core/ngb-modal-improved/ngb-modal-improved.service';
import { CheckBatchNumberModalComponent } from './check-batch-number-modal/check-batch-number-modal.component';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { GlobalEventManagerService } from '../core/global-event-manager.service';
import { PublicControllerService } from 'src/api/api/publicController.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiLogRequest } from 'src/api/model/apiLogRequest';
import { take } from 'rxjs/operators';
import { ProductLabelFrontFeedbackComponent } from '../product-label-front-feedback/product-label-front-feedback.component';
import _ from 'lodash-es';
import { CommonControllerService } from 'src/api/api/commonController.service';

@Component({
  selector: 'app-product-label-front-page',
  templateUrl: './product-label-front-page.component.html',
  styleUrls: ['./product-label-front-page.component.scss']
})
export class ProductLabelFrontPageComponent implements OnInit, OnDestroy {

  @ViewChild(GoogleMap) set map(map: GoogleMap) {
    if(map) this.googleMapsIsLoaded(map);
  };

  @ViewChild(MapInfoWindow) set infoWindow(infoWindow: MapInfoWindow) {
    if (infoWindow) this.gInfoWindow = infoWindow;
  };

  gInfoWindow = null;
  gInfoWindowText: string = "";
  isGoogleMapsLoaded: boolean = false;
  faSeedling = faSeedling;
  faEye = faEye;
  faFacebookSquare = faFacebookSquare;
  faTwitterSquare = faTwitterSquare;
  faInstagramSquare = faInstagramSquare;
  faYoutubeSquare = faYoutubeSquare;
  faGlobeAmericas = faGlobeAmericas;
  faFilePdf = faFilePdf;
  faFileImage = faFileImage;

  unpublishedText:string = "";

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModalImproved,
    public globalEventManager: GlobalEventManagerService,
    private publicController: PublicControllerService,
    private router: Router,
    private commonController: CommonControllerService
  ) { }

  uuid: string;
  product: any = {};
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

  showProcess: boolean = false;
  showProduct: boolean = false;
  showResponsibility: boolean = false;
  showSustainability: boolean = false;
  showCompany: boolean = false;
  showMediaLinks: boolean = false;

  mediaLinksOrder = Number.MAX_SAFE_INTEGER;
  hrefMedilaLinks: string[] = [];
  hrefWebPage: string = '';
  published: boolean = true;

  checkAuthenticityCount = 0;
  traceOriginCount = 0;
  numberOfBatches = 0;

  showCheckAuthenticity: boolean = false;
  showTraceOrigin: boolean = false;
  showFeedback: boolean = false;

  gdprConsentText: string = null;

  ngOnInit(): void {
    this.initializeUnpublishedText();
    this.uuid = this.route.snapshot.params.uuid
    this.globalEventManager.showLoading(true);
    let sub1 = this.publicController.getPublicProductLabelValuesUsingGET(this.uuid).subscribe(
      prod => {
        if (prod.status == "OK" ) {
          if (prod.data && prod.data.fields && prod.data.status == "PUBLISHED") {
            this.checkAuthenticityCount = prod.data.checkAuthenticityCount;
            this.traceOriginCount = prod.data.traceOriginCount;
            this.numberOfBatches = prod.data.numberOfBatches;
            this.prepareFields(prod.data.fields);
          }
          this.globalEventManager.showLoading(false);
        }

      }, error => {
        this.globalEventManager.showLoading(false);
      }
    );
    this.subs.push(sub1);

    let sub2 = this.globalEventManager.areGoogleMapsLoadedEmmiter.subscribe(
      loaded => {
        if (loaded) this.isGoogleMapsLoaded = true;
      },
      error => { }
    )
    this.subs.push(sub2);

    let sub3 = this.globalEventManager.isProductLabelPublishedEmitter.subscribe(
      uuid => {
        if (uuid === this.uuid) this.published = false;
      },
      error => { }
    )
    this.subs.push(sub3);

  }

  googleMapsIsLoaded(map) {
    this.bounds = new google.maps.LatLngBounds()
    for (let bound of this.initialBounds) {
      this.bounds.extend(bound);
    }
    if (this.bounds.isEmpty()) {
      map.googleMap.setCenter(this.defaultCenter)
      map.googleMap.setZoom(this.defaultZoom);
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
    map.fitBounds(this.bounds.union(minBounds))
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  prepareFields(data) {
    let prodCount = 0;
    let respCount = 0;
    let procCount = 0;
    let sustCount = 0;
    let compCount = 0;
    let medLinkCount = 0;

    for(let item of data) {

      if (_.isEmpty(item.value) && !(typeof item.value === "boolean")) continue;

      let key: string = item.name.replace(/\./g, ('_'));
      if (item.section == "settings") {
        if (item.name == "settings.checkAuthenticity") this.showCheckAuthenticity = item.value;
        if (item.name == "settings.traceOrigin") this.showTraceOrigin = item.value;
        if (item.name == "settings.giveFeedback") this.showFeedback = item.value;
        if (item.name == "settings.gdprText") this.gdprConsentText = item.value;
      }
      if (item.section == "product" && (
        item.name == "ingredients" || item.name == "nutritionalValue" ||
        item.name == 'howToUse' || item.name == "origin" || item.name == "keyMarketsShare"
      )) {
        this.showProduct = true;
        this.product[key] = { "value": item.value, "id": prodCount };
        prodCount++;
      } else if (item.section == "product") {
        this.product[key] = { "value": item.value, "id": 0 };
      }
      if (item.section == "process") {
        this.showProcess = true;
        this.product[key] = { "value": item.value, "id": procCount };
        procCount++;
      }
      if (item.section == "responsibility") {
        this.showResponsibility = true;
        this.product[key] = { "value": item.value, "id": respCount };
        respCount++;
      }

      if (item.section == "sustainability") {
        this.showSustainability = true;
        this.product[key] = { "value": item.value, "id": sustCount };
        sustCount++;
      }
      if (item.section == "company") {
        this.showCompany = true;
        if(item.name == "company.webPage") this.hrefWebPage = this.checkExternalLink(item.value)

        if (item.name == "company.mediaLinks.facebook" || item.name == "company.mediaLinks.instagram" ||
          item.name == "company.mediaLinks.twitter" || item.name == "company.mediaLinks.youtube" ||
          item.name == "company.mediaLinks.other") {
            this.showMediaLinks = true;
            this.mediaLinksOrder = Math.min(this.mediaLinksOrder, compCount);
            this.product[key] = { "value": item.value, "id": medLinkCount };
            this.hrefMedilaLinks.push(this.checkExternalLink(item.value));
            medLinkCount++;
        } else {
          this.product[key] = { "value": item.value, "id": compCount };
        }
        compCount++;
      }
    }
    if (this.product.origin) this.initializeMarkers(this.product.origin.value.locations);

  }

  initializeMarkers(locations) {
    for (let loc of locations) {
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

  openInfoWindow(gMarker, marker) {
    this.gInfoWindowText = marker.infoText;
    this.gInfoWindow.open(gMarker);
  }

  checkBatchNumber(originTrace: boolean) {
    if(originTrace) {
      this.publicController.logPublicRequestUsingPOST({ token: environment.tokenForPublicLogRoute, type: ApiLogRequest.TypeEnum.CLICKVERIFYBATCHORIGIN, logKey: this.uuid })
        .pipe(take(1)).toPromise();
   } else {
      this.publicController.logPublicRequestUsingPOST({ token: environment.tokenForPublicLogRoute, type: ApiLogRequest.TypeEnum.CLICKVERIFYBATCH, logKey: this.uuid })
        .pipe(take(1)).toPromise();
   }

    this.openBatchNumberModal(originTrace);
  }

  openBatchNumberModal(originTrace: boolean) {
    const modalRef = this.modalService.open(CheckBatchNumberModalComponent, {
      centered: true
    });
    Object.assign(modalRef.componentInstance, {
      uuid: this.uuid,
      originTrace: originTrace,
      callback: () => {
        this.openBatchNumberModal(originTrace);
      }
    })
  }


  giveFeedback() {
    const modalRef = this.modalService.open(ProductLabelFrontFeedbackComponent, {
      centered: true
    });
    Object.assign(modalRef.componentInstance, {
      labelId: this.uuid,
      gdprHtmlContext: this.gdprConsentText
    })
  }


  checkExternalLink(link: string): string {
    if (!link) return '#';
    if (!link.startsWith('https://') && !link.startsWith('http://')) {
      return 'http://'+link;
    }
    return link;
  }

  click(action: string, socialMediaLink="") {
    if (action === 'CLICK_CERT_STD') {
      this.publicController.logPublicRequestUsingPOST({ token: environment.tokenForPublicLogRoute, type: ApiLogRequest.TypeEnum.CLICKCERTSTD, logKey: this.uuid })
        .pipe(take(1)).toPromise();
    }
    if (action === 'CLICK_PROD_REC') {
      this.publicController.logPublicRequestUsingPOST({ token: environment.tokenForPublicLogRoute, type: ApiLogRequest.TypeEnum.CLICKPRODREC, logKey: this.uuid })
        .pipe(take(1)).toPromise();
    }
    if (action === 'CLICK_COMPANY_PAGE') {
      this.publicController.logPublicRequestUsingPOST({ token: environment.tokenForPublicLogRoute, type: ApiLogRequest.TypeEnum.CLICKCOMPANYPAGE, logKey: this.uuid })
        .pipe(take(1)).toPromise();
    }
    if (action === 'CLICK_SOCIAL_MEDIA') {
      this.publicController.logPublicRequestUsingPOST({ token: environment.tokenForPublicLogRoute, type: ApiLogRequest.TypeEnum.CLICKSOCIALMEDIA, logKey: this.uuid, value1: socialMediaLink })
        .pipe(take(1)).toPromise();
    }

  }

  async initializeUnpublishedText() {
    let resp = await this.publicController.getPublicGlobalSettingsUsingGET(this.globalEventManager.globalSettingsKeys("UNPUBLISHED_PRODUCT_LABEL_TEXT")).pipe(take(1)).toPromise();
    if (resp && resp.data && resp.data.value)
      this.unpublishedText = resp.data.value;
  }


}



