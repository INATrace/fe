import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ControlContainer, NgForm, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { CountryService } from 'src/app/shared-services/countries.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import _ from 'lodash-es';

@Component({
  selector: 'location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit {

  faTimes = faTimes;

  @Input()
  form: FormGroup;

  @Input()
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

  constructor(
    public countryCodes: CountryService,
    public globalEventsManager: GlobalEventManagerService
  ) { }


  ngOnInit(): void {
    setTimeout(() => {
      this.form.get('village').setValidators([Validators.required])
      this.form.get('cell').setValidators([Validators.required])
      this.form.get('sector').setValidators([Validators.required])
    })

    let sub2 = this.globalEventsManager.areGoogleMapsLoadedEmmiter.subscribe(
      loaded => {
        // console.log("EMM:", loaded)
        if (loaded) this.isGoogleMapsLoaded = true;
        this.initializeMarker();
        let tmpVis = this.form.get("isPubliclyVisible").value;
        if (tmpVis != null) this.form.get("isPubliclyVisible").setValue(tmpVis.toString());
      },
      error => { }
    )
    this.subs.push(sub2);


    let sub3 = this.form.get('country').valueChanges
      .subscribe(value => {
        if (this.showVillageCellSector()) {
          this.form.get('village').setValidators([Validators.required])
          this.form.get('cell').setValidators([Validators.required])
          this.form.get('sector').setValidators([Validators.required])
        } else {
          this.form.get('village').setValidators(null)
          this.form.get('cell').setValidators(null)
          this.form.get('sector').setValidators(null)
        }
        this.form.get('village').updateValueAndValidity();
        this.form.get('cell').updateValueAndValidity();
        this.form.get('sector').updateValueAndValidity();
      });
    this.subs.push(sub3);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => { sub.unsubscribe(); });
  }

  showVillageCellSector() {
    return this.form.get('country').invalid ||
      _.isEqual(this.form.get('country').value, { id: 184, code: "RW", name: "Rwanda" })
  }

  initializeMarker() {
    if (!this.form.get('latitude') || !this.form.get('longitude')) return;
    let lat = this.form.get('latitude').value;
    let lng = this.form.get('longitude').value;
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


  updateLonLat() {

    if (this.marker) {
      this.form.get('latitude').setValue(this.marker.position.lat)
      this.form.get('longitude').setValue(this.marker.position.lng)
    } else {
      this.form.get('latitude').setValue(null)
      this.form.get('longitude').setValue(null)
    }
    this.form.get('latitude').markAsDirty();
    this.form.get('longitude').markAsDirty()
  }

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
      this.updateLonLat()
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
    this.updateLonLat()
  }


  removeOriginLocation() {
    this.marker = null;
    this.initialBounds = [];
  }


  get publiclyVisible() {
    let obj = {}
    obj['true'] = $localize`:@@locationForm.publiclyVisible.yes:YES`;
    obj['false'] = $localize`:@@locationForm.publiclyVisible.no:NO`;
    return obj;
  }

  codebookStatus = EnumSifrant.fromObject(this.publiclyVisible)
}
