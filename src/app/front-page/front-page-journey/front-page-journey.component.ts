import { ViewportScroller } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { PublicControllerService } from '../../../api/api/publicController.service';
import { HistoryTimelineItem } from './model';
import { ApiHistoryTimelineItem } from '../../../api/model/apiHistoryTimelineItem';

@Component({
  selector: 'app-front-page-journey',
  templateUrl: './front-page-journey.component.html',
  styleUrls: ['./front-page-journey.component.scss']
})
export class FrontPageJourneyComponent implements OnInit, OnDestroy {

  pageYOffset = 0;

  tab: string = null;
  title = $localize`:@@frontPage.journey.title:Product journey`;
  subs: Subscription[] = [];
  isGoogleMapsLoaded = false;

  producerName = '';
  historyItems = [];

  uuid = this.route.snapshot.params.uuid;
  qrTag = this.route.snapshot.params.qrTag;

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

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.pageYOffset = window.pageYOffset;
  }

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

  constructor(
    private route: ActivatedRoute,
    public globalEventManager: GlobalEventManagerService,
    private publicControllerService: PublicControllerService,
    private scroll: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.tab = this.route.snapshot.data.tab;

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

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
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
    const res = await this.publicControllerService.getPublicProductLabelValuesUsingGET(this.uuid).pipe(take(1)).toPromise();
    if (res && res.status === 'OK') {
      for (const item of res.data.fields) {
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
  }

  async data() {

    if (this.qrTag !== 'EMPTY') {

      // Get the aggregated history for the QR code tag
      const resp = await this.publicControllerService.getQRTagPublicDataUsingGET(this.qrTag, true).pipe(take(1)).toPromise();
      if (resp && resp.status === 'OK' && resp.data) {
        this.historyItems = resp.data.historyTimeline.items.map(item => this.addIconStyleForIconType(item));
        this.producerName = resp.data.producerName;
        
        this.markers = resp.data.historyTimeline.items.reduce((acc, historyItem) => {
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
    if (this.qrTag === 'EMPTY') { return; }
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
