import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { B2cPageComponent } from '../b2c-page.component';
import { ApiBusinessToCustomerSettings } from '../../../../api/model/apiBusinessToCustomerSettings';
import { Subscription } from 'rxjs';
import { GoogleMap } from '@angular/google-maps';
import { ApiHistoryTimelineItem } from '../../../../api/model/apiHistoryTimelineItem';
import { HistoryTimelineItem } from '../../../front-page/front-page-journey/model';
import { take } from 'rxjs/operators';
import { GlobalEventManagerService } from '../../../core/global-event-manager.service';

@Component({
  selector: 'app-b2c-journey',
  templateUrl: './b2c-journey.component.html',
  styleUrls: ['./b2c-journey.component.scss']
})
export class B2cJourneyComponent implements OnInit {

  constructor(
      @Inject(B2cPageComponent) private b2cPage: B2cPageComponent,
      public globalEventManager: GlobalEventManagerService
  ) {
    this.productName = b2cPage.productName;
    this.b2cSettings = b2cPage.b2cSettings;
  }

  productName: string;

  headerColor: string;

  b2cSettings: ApiBusinessToCustomerSettings;

  subs: Subscription[] = [];
  isGoogleMapsLoaded = false;

  producerName = '';
  historyItems = [];

  // uuid = this.route.snapshot.params.uuid;
  // qrTag = this.route.snapshot.params.qrTag;

  locations: google.maps.LatLngLiteral[] = [];

  markers: any = [];
  initialBounds: any = [];
  defaultCenter = {
    lat: 5.274054,
    lng: 21.514503
  };
  defaultZoom = 3;
  zoomForOnePin = 10;
  bounds: any;

  lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 2,
    strokeColor: '#25265E'
  };

  options: google.maps.PolylineOptions = {
    icons: [
      {
        icon: this.lineSymbol,
        offset: '0',
        repeat: '20px'
      },
    ],
    strokeOpacity: 0,
  };

  gMap: GoogleMap = null;

  mapMarkerOption: any;

  @ViewChild(GoogleMap)
  set map(map: GoogleMap) {
    if (map) {
      this.gMap = map;
      this.mapMarkerOption = {
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 4,
          fillColor: '#25265E',
          fillOpacity: 1,
          strokeColor: '#25265E',
        }
      };
      setTimeout(() => this.googleMapsIsLoaded(map));
    }
  }

  get map(): GoogleMap {
    return this.gMap;
  }

  ngOnInit(): void {
    const sub2 = this.globalEventManager.areGoogleMapsLoadedEmmiter.subscribe(
        loaded => {
          if (loaded) { this.isGoogleMapsLoaded = true; }
        },
        () => { }
    );
    this.subs.push(sub2);

    this.initLabel().then();
    this.data().then();
  }

  styleForIconType(iconType: string) {
    switch (iconType) {
      case 'SHIP': return 'af-journey-dot-shape--ship';
      case 'LEAF': return 'af-journey-dot-shape--leaf';
      case 'WAREHOUSE': return 'af-journey-dot-shape--warehouse';
      case 'QRCODE': return 'af-journey-dot-shape--qr-code';
      case 'OTHER': return 'af-journey-dot-shape--other';
      default:
        return 'af-journey-dot-shape--leaf';
    }
  }

  addIconStyleForIconType(item: ApiHistoryTimelineItem): HistoryTimelineItem {

    let iconClass;
    if (!item.iconType) {
      if (item.type === 'TRANSFER') {
        iconClass = 'af-journey-dot-shape--ship';
      } else {
        iconClass = 'af-journey-dot-shape--leaf';
      }
    } else {
      iconClass = this.styleForIconType(item.iconType);
    }
    return {...item, iconClass};
  }

  async initLabel() {
    const labelData = this.b2cPage.publicProductLabel;

    for (const item of labelData.fields) {
      if (item.name === 'name') {
        this.producerName = item.value;
      }
      if (item.name === 'journeyMarkers') {
        this.locations = item.value.map(marker => {
          return {
            lat: marker.latitude,
            lng: marker.longitude,
          };
        });
      }
    }
  }

  async data() {

    if (this.b2cPage.qrTag !== 'EMPTY') {

      // Get the aggregated history for the QR code tag
      // const resp = await this.publicControllerService.getQRTagPublicDataUsingGET(this.qrTag, true).pipe(take(1)).toPromise();
      const qrData = this.b2cPage.qrProductLabel;
      if (qrData) {
        this.historyItems = qrData.historyTimeline.items.map(item => this.addIconStyleForIconType(item));
        this.producerName = qrData.producerName;

        this.markers = qrData.historyTimeline.items.reduce((acc, historyItem) => {
          if (historyItem.longitude && historyItem.latitude) {
            acc.push({
              position: {
                lat: historyItem.latitude,
                lng: historyItem.longitude,
              },
            });
          }
          return acc;
        }, []);
      }
    }
  }

  googleMapsIsLoaded(map) {
    this.isGoogleMapsLoaded = true;
    if (this.b2cPage.qrTag === 'EMPTY') { return; }
    for (const [i, loc] of this.locations.entries()) {
      const tmp = {
        position: {
          lat: loc.lat,
          lng: loc.lng,
          type: i === 0 || i === this.locations.length - 1 ? 'bound' : 'middle'
        },
      };
      this.initialBounds.push(tmp.position);
    }
    this.bounds = new google.maps.LatLngBounds();
    for (const bound of this.initialBounds) {
      this.bounds.extend(bound);
    }
    if (this.bounds.isEmpty()) {
      map.googleMap.setCenter(this.defaultCenter);
      map.googleMap.setZoom(this.defaultZoom);
      return;
    }
    const center = this.bounds.getCenter();
    const offset = 0.02;
    const northEast = new google.maps.LatLng(
        center.lat() + offset,
        center.lng() + offset
    );
    const southWest = new google.maps.LatLng(
        center.lat() - offset,
        center.lng() - offset
    );
    const minBounds = new google.maps.LatLngBounds(southWest, northEast);
    map.fitBounds(this.bounds.union(minBounds));
  }

  get polyOptions() {
    return this.options;
  }

  formatDate(date) {
    if (date) {
      const split = date.split('-');
      return split[2] + '.' + split[1] + '.' + split[0];
    }
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    return day + '.' + month + '.' + year;
  }

}
