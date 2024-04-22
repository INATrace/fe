import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { CountryService } from 'src/app/shared-services/countries.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
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
    if (map) { this.gMap = map; this.fitBounds() }
  };

  gMap = null;
  isGoogleMapsLoaded: boolean = false;
  markers: any = [];
  defaultCenter = {
    lat: 5.274054,
    lng: 21.514503
  };
  defaultZoom = 3;
  bounds: any;
  initialBounds: any = [];
  subs: Subscription[] = [];

  constructor(
    public countryCodes: CountryService,
    public globalEventsManager: GlobalEventManagerService
  ) { }


  ngOnInit(): void {
    setTimeout(() => {
      this.form.get('address.village').setValidators([Validators.required])
      this.form.get('address.cell').setValidators([Validators.required])
      this.form.get('address.sector').setValidators([Validators.required])
    })

    let sub2 = this.globalEventsManager.loadedGoogleMapsEmitter.subscribe(
      loaded => {
        if (loaded) this.isGoogleMapsLoaded = true;
        this.initializeMarker();
        let tmpVis = this.form.get("publiclyVisible").value;
        if (tmpVis != null) this.form.get("publiclyVisible").setValue(tmpVis.toString());
      },
      () => { }
    )
    this.subs.push(sub2);

    let sub3 = this.form.get('address.country').valueChanges
      .subscribe(value => {

        // Honduras specifics
        if (this.showHondurasFields()) {
          this.enableValidationHonduras();
        } else {
          this.disableValidationHonduras();
          this.clearValuesHonduras();
        }
        this.updateHonduras();

        // Rwanda specifics
        if (this.showVillageCellSector()) {
          this.enableValidationRwanda();
        } else {
          this.disableValidationRwanda();
          this.clearValuesRwanda();
        }
        this.updateRwanda();

        if (this.showHondurasFields() || this.showVillageCellSector()) {
          this.disableValidationOther();
          this.clearValuesOther();
        } else {
          this.enableValidationOther();
        }
        this.updateOther();

      });
    this.subs.push(sub3);

    // Trigger valueChanges to set validators accordingly
    this.form.get('address.country').updateValueAndValidity({emitEvent: true});
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => { sub.unsubscribe(); });
  }

  showVillageCellSector() {
    return this.form.get('address.country').invalid ||
      _.isEqual(this.form.get('address.country').value, { id: 184, code: "RW", name: "Rwanda" })
  }

  showHondurasFields() {
    return this.form.get('address.country') && _.isEqual(this.form.get('address.country').value, { id: 99, code: 'HN', name: 'Honduras'});
  }

  enableValidationHonduras() {
    this.form.get('address.hondurasDepartment').setValidators([Validators.required]);
    this.form.get('address.hondurasFarm').setValidators(null);
    this.form.get('address.hondurasMunicipality').setValidators([Validators.required]);
    this.form.get('address.hondurasVillage').setValidators([Validators.required]);
  }

  disableValidationHonduras() {
    this.form.get('address.hondurasDepartment').setValidators(null);
    this.form.get('address.hondurasFarm').setValidators(null);
    this.form.get('address.hondurasMunicipality').setValidators(null);
    this.form.get('address.hondurasVillage').setValidators(null);
  }

  clearValuesHonduras() {
    this.form.get('address.hondurasDepartment').setValue(null);
    this.form.get('address.hondurasFarm').setValue(null);
    this.form.get('address.hondurasMunicipality').setValue(null);
    this.form.get('address.hondurasVillage').setValue(null);
  }

  updateHonduras() {
    this.form.get('address.hondurasDepartment').updateValueAndValidity();
    this.form.get('address.hondurasFarm').updateValueAndValidity();
    this.form.get('address.hondurasMunicipality').updateValueAndValidity();
    this.form.get('address.hondurasVillage').updateValueAndValidity();
  }

  enableValidationRwanda() {
    this.form.get('address.village').setValidators([Validators.required]);
    this.form.get('address.cell').setValidators([Validators.required]);
    this.form.get('address.sector').setValidators([Validators.required]);
  }

  disableValidationRwanda() {
    this.form.get('address.village').setValidators(null);
    this.form.get('address.cell').setValidators(null);
    this.form.get('address.sector').setValidators(null);
  }

  clearValuesRwanda() {
    this.form.get('address.village').setValue(null);
    this.form.get('address.cell').setValue(null);
    this.form.get('address.sector').setValue(null);
  }

  updateRwanda() {
    this.form.get('address.village').updateValueAndValidity();
    this.form.get('address.cell').updateValueAndValidity();
    this.form.get('address.sector').updateValueAndValidity();
  }

  enableValidationOther() {
    this.form.get('address.address').setValidators([Validators.required]);
    this.form.get('address.city').setValidators([Validators.required]);
    this.form.get('address.state').setValidators([Validators.required]);
    this.form.get('address.zip').setValidators([Validators.required]);
  }

  disableValidationOther() {
    this.form.get('address.address').setValidators(null);
    this.form.get('address.city').setValidators(null);
    this.form.get('address.state').setValidators(null);
    this.form.get('address.zip').setValidators(null);
  }

  clearValuesOther() {
    this.form.get('address.address').setValue(null);
    this.form.get('address.city').setValue(null);
    this.form.get('address.state').setValue(null);
    this.form.get('address.zip').setValue(null);
  }

  updateOther() {
    this.form.get('address.address').updateValueAndValidity();
    this.form.get('address.city').updateValueAndValidity();
    this.form.get('address.state').updateValueAndValidity();
    this.form.get('address.zip').updateValueAndValidity();
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
      this.marker = {
        position: event.latLng.toJSON(),
        label: {
          text: ' '
        },
        infoText: ' '
      };
      this.updateLonLat()
    }
  }

  dragend(event, index) {
    this.updateMarkerLocation(event.latLng.toJSON());
  }

  updateMarkerLocation(loc) {
    let tmpCurrent = this.marker;
    this.marker = {
      position: loc,
      label: tmpCurrent.label,
      infoText: tmpCurrent.infoText
    };
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
