import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleMap } from '@angular/google-maps';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { Subscription } from 'rxjs';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ViewportScroller } from '@angular/common';
import { ProcessingOrderHistory } from 'src/api-chain/model/processingOrderHistory';

@Component({
  selector: 'app-front-page-journey',
  templateUrl: './front-page-journey.component.html',
  styleUrls: ['./front-page-journey.component.scss']
})
export class FrontPageJourneyComponent implements OnInit {

  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll(event) {
    this.pageYoffset = window.pageYOffset;
  }

  @ViewChild(GoogleMap) set map(map: GoogleMap) {
    if (map) {
      this._map = map;
      setTimeout(() => this.googleMapsIsLoaded(map));
    }
  };

  constructor(
    private route: ActivatedRoute,
    public globalEventManager: GlobalEventManagerService,
    private chainStockOrderController: StockOrderService,
    private scroll: ViewportScroller
  ) { }

  _map: GoogleMap = null
  get map(): GoogleMap {
    return this._map;
  }

  tab: string = null;
  title = $localize`:@@frontPage.journey.title:Product journey`;
  subs: Subscription[] = [];
  isGoogleMapsLoaded: boolean = false;
  processing = [];
  coopName: string = ""
  processingShorter = []


  soid = this.route.snapshot.params.soid;
  // soid = "f454a462-0d97-42b8-9888-f8844d945bf3";

  ngOnInit(): void {
    this.tab = this.route.snapshot.data.tab;

    let sub2 = this.globalEventManager.areGoogleMapsLoadedEmmiter.subscribe(
      loaded => {
        if (loaded) this.isGoogleMapsLoaded = true;
      },
      error => { }
    )
    this.subs.push(sub2);

    this.data();
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }

  iconStyle(item: ProcessingOrderHistory) {
    let iconType = item.processingOrder.processingAction.publicTimelineIcon
    if (!iconType) {
      if (item.processingOrder.processingAction.type === 'TRANSFER') return 'af-journey-dot-shape--ship'
      return 'af-journey-dot-shape--leaf'
    }
    switch (iconType) {
      case 'SHIP': return 'af-journey-dot-shape--ship'
      case 'LEAF': return 'af-journey-dot-shape--leaf'
      case 'WAREHOUSE': return 'af-journey-dot-shape--warehouse'
      case 'QRCODE': return 'af-journey-dot-shape--qr-code'
      case 'OTHER': return 'af-journey-dot-shape--other'
      default:
        return 'af-journey-dot-shape--leaf'
    }
  }

  async data() {
    if (this.soid != 'EMPTY') {

      let res = await this.chainStockOrderController.getAggregatesForStockOrder(this.soid).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) {
        // console.log(res.data)
        for (let item of res.data) {
          if (item.processingOrder && item.processingOrder.processingAction) {
            if (item.stockOrderAggs.length >= 1) {
              let tmp = {
                type: item.processingOrder.processingAction.type,
                name: item.processingOrder.processingAction.name,
                location: item.stockOrderAggs[0].stockOrder.facility.name,
                date: item.stockOrderAggs[0].stockOrder.productionDate
              }
              this.processing.push(tmp);
              if (item.processingOrder.processingAction.publicTimelineLabel) {
                let defaultLocation = item.stockOrderAggs[0].stockOrder.facility.name
                let publicTimelineLocation = item.processingOrder.processingAction.publicTimelineLocation
                let tmp = {
                  type: item.processingOrder.processingAction.type,
                  name: item.processingOrder.processingAction.publicTimelineLabel,
                  location: publicTimelineLocation ? publicTimelineLocation : defaultLocation,
                  date: item.processingOrder.processingDate,
                  iconClass: this.iconStyle(item)
                }
                // console.log(item.processingOrder.processingDate)
                this.processingShorter.push(tmp)
              }
            }
          } else {
            if (item.stockOrderAggs.length >= 1) {
              let tmp = {
                type: null,
                name: null,
                location: item.stockOrderAggs[0].stockOrder.facility.name,
                date: item.stockOrderAggs[0].stockOrder.productionDate
              }
              this.coopName = item.stockOrderAggs[0].stockOrder.organization.name;
              this.processing.push(tmp);
              this.processingShorter.push(tmp)
            }
          }
        }
        // let len = res.data.length;
        // let processingOH = res.data[len - 2];
        // let processingArr = processingOH.stockOrderAggs;
        // if (processingArr.length >= 1) {
        //   this.processing = processingArr[0].stockOrder;
        // console.log(this.processing, this.processingShorter);
        // }
      }

    }
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

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

  googleMapsIsLoaded(map) {
    this.isGoogleMapsLoaded = true;
    if (this.soid === 'EMPTY') return;
    for (const [i, loc] of this.locations.entries()) {
      let tmp = {
        position: {
          lat: loc.lat,
          lng: loc.lng,
          type: i == 0 || i == this.locations.length - 1 ? "bound" : "middle",
          // icon: new google.maps.MarkerImage('/path/to/icon.svg',
          //   null, null, null, new google.maps.Size(64, 64)),
        },
      }
      this.markers.push(tmp);
      this.initialBounds.push(tmp.position);
    }
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


  markerOption(i) {
    return {
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 4,
        fillColor: "#AC1A56",
        fillOpacity: 1,
        strokeColor: "#AC1A56",
      }
    }
  }

  lineSymbol = {
    path: "M 0,-1 0,1",
    strokeOpacity: 1,
    scale: 2,
    strokeColor: "#AC1A56"
  };

  get polyOptions() {
    return this.options;
  }

  options: google.maps.PolylineOptions = {
    icons: [
      {
        icon: this.lineSymbol,
        offset: "0",
        repeat: "20px"
      },
    ],
    strokeOpacity: 0,
  };

  formatDate(date) {
    if (date) {
      let split = date.split("-");
      return split[2] + "." + split[1] + "." + split[0];
    }
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    return day + "." + month + "." + year;
  }

  short = true;
  toggleShort() {
    this.short = !this.short
  }
}
