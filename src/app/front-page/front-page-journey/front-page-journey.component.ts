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

  qrTag = this.route.snapshot.params.qrTag;

  locations: google.maps.LatLngLiteral[] = [
    { lat: -3.1428191, lng: 31.2247691 },
    { lat: -4.0351857, lng: 39.596223 },
    { lat: 1.611664, lng: 45.490649 },
    { lat: 5.252843, lng: 49.322321 },
    { lat: 11.872511, lng: 52.230004 },
    { lat: 12.699950, lng: 50.575840 },
    { lat: 11.291795, lng: 44.399540 },
    { lat: 17.558982, lng: 39.921926 },
    { lat: 25.669884, lng: 35.724128 },
    { lat: 31.945803, lng: 30.671221 },
    { lat: 34.112980, lng: 23.620653 },
    { lat: 36.372962, lng: 14.375589 },
    { lat: 37.913591, lng: 7.756875 },
    { lat: 35.941126, lng: -2.936486 },
    { lat: 35.791304, lng: -8.153219 },
    { lat: 39.291012, lng: -10.927130 },
    { lat: 49.112271, lng: -6.587187 },
    { lat: 50.684359, lng: 1.223039 },
    { lat: 53.234390, lng: 4.584119 },
    { lat: 52.8754751, lng: 10.6686748 }];

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
    strokeColor: '#AC1A56'
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
          fillColor: '#AC1A56',
          fillOpacity: 1,
          strokeColor: '#AC1A56',
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

  async data() {

    if (this.qrTag !== 'EMPTY') {

      // Get the aggregated history for the QR code tag
      const resp = await this.publicControllerService.getQRTagPublicDataUsingGET(this.qrTag, true).pipe(take(1)).toPromise();
      if (resp && resp.status === 'OK' && resp.data) {
        this.historyItems = resp.data.historyTimeline.items.map(item => this.addIconStyleForIconType(item));
        this.producerName = resp.data.producerName;
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
      this.markers.push(tmp);
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
