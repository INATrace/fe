import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PublicControllerService } from 'src/api/api/publicController.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { CheckBatchNumberResponseModalComponent } from '../check-batch-number-response-modal/check-batch-number-response-modal.component';
import { Subscription } from 'rxjs';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';

@Component({
  selector: 'app-check-batch-number-modal',
  templateUrl: './check-batch-number-modal.component.html',
  styleUrls: ['./check-batch-number-modal.component.scss']
})
export class CheckBatchNumberModalComponent implements OnInit, OnDestroy {

  @ViewChild(GoogleMap) set map(map: GoogleMap) {
    if (map) { this.gMap = map; this.fitBounds() };
  };

  @ViewChild(MapInfoWindow) set infoWindow(infoWindow: MapInfoWindow) {
    if (infoWindow) this.gInfoWindow = infoWindow;
  };

  gInfoWindow = null;
  gInfoWindowText: string = "";

  @Input()
  uuid: string;

  @Input()
  originTrace: boolean;

  @Input()
  public callback: () => string;

  gMap = null;
  showCheckAuthenticity: boolean = null;
  showCheckOriginTrace: boolean = null;
  showPhoto: boolean = false;
  showProductionDate: boolean = false;
  showExpiryDate: boolean = false;
  nextPressed: boolean = false;
  photo = {};
  notAll: boolean = false;

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

  submitted: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private publicService: PublicControllerService,
    private modalService: NgbModalImproved,
    public globalEventManager: GlobalEventManagerService
  ) { }

  ngOnInit(): void {
    let sub2 = this.globalEventManager.areGoogleMapsLoadedEmmiter.subscribe(
      loaded => {
        if (loaded) this.isGoogleMapsLoaded = true;
      },
      error => { }
    )
    this.subs.push(sub2);
  }
  ngOnDestroy(): void {
    this.subs.forEach(sub => { sub.unsubscribe(); });
  }

  checkBatchForm = new FormGroup({
    batchNumber: new FormControl(null, [Validators.required]),
    expDateYear: new FormControl(''),
    expDateMonth: new FormControl(''),
    expDateDay: new FormControl(''),
    prodDateYear: new FormControl(''),
    prodDateMonth: new FormControl(''),
    prodDateDay: new FormControl(''),
  })

  get batchNumber() {
    return this.checkBatchForm.get('batchNumber').value;
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  dateFormatter(year: string, month: string, day: string): string {
    if (!year || !month || !day) return null;
    let dd: string = day.length > 1 ? day : '0' + day;
    let mm: string = month.length > 1 ? month : '0' + month;
    return year + "-" + mm + "-" + dd;
  }

  next() {
    this.nextPressed = true;
    if (this.checkBatchForm.invalid) return

    let sub = this.publicService.getPublicProductLabelBatchUsingGET(this.uuid, this.batchNumber)
      .subscribe(res => {
        if (res.status == "OK" && res.data != null) {
          if (this.originTrace) {
            this.showCheckOriginTrace = res.data.traceOrigin != null ? res.data.traceOrigin : false;
            this.showLocations(res.data.traceOrigin)
          } else {
            this.showCheckAuthenticity = res.data.checkAuthenticity != null ? res.data.checkAuthenticity : false;
            this.showPhoto = res.data.photo != null;
            this.photo = res.data.photo;
            this.showProductionDate = res.data.productionDate != null;
            this.showExpiryDate = res.data.expiryDate != null;
          }
        } else if (res.status == "OK" && res.data == null) {
          //no data in db => show counterfeit
          this.counterfeitCase(this.originTrace);
          this.showCounterfeitModal();
        } else {
          //something went wrong
          this.globalEventManager.push({
            action: 'error',
            notificationType: 'warning',
            title: $localize`:@@checkBatchNumber.next.warning.title:Error`,
            message: $localize`:@@checkBatchNumber.next.warning.message:Something went wrong. Please try again.`
          })
        }
      }, err => { }
      )
    this.subs.push(sub);
  }

  counterfeitCase(origin) {
    if (origin) {
      let sub = this.publicService.checkPublicProductLabelBatchOriginUsingGET(this.uuid, null, this.batchNumber)
        .subscribe(res => {
          if (res.status != "OK") {
            //something went wrong
            this.globalEventManager.push({
              action: 'error',
              notificationType: 'warning',
              title: $localize`:@@checkBatchNumber.counterfeitCase.warning.title:Error`,
              message: $localize`:@@checkBatchNumber.counterfeitCase.warning.message:Something went wrong. Please try again.`
            })
          }
        }
        )
      this.subs.push(sub);
    } else {
      let sub = this.publicService.checkPublicProductLabelBatchAuthenticityUsingGET(this.uuid, null, this.checkBatchForm.get('batchNumber').value, null, null)
        .subscribe(res => {
          if (res.status != "OK") {
            //something went wrong
            this.globalEventManager.push({
              action: 'error',
              notificationType: 'warning',
              title: $localize`:@@checkBatchNumber.counterfeitCase2.warning.title:Error`,
              message: $localize`:@@checkBatchNumber.counterfeitCase2.warning.message:Something went wrong. Please try again.`
            })
          }
        },
          err => {})
      this.subs.push(sub);

    }
  }


  showLocations(show) {
    this.markers = [];
    this.initialBounds = [];
    if (show) {
      let sub = this.publicService.checkPublicProductLabelBatchOriginUsingGET(this.uuid, null, this.batchNumber)
        .subscribe(res => {
          if (res.status == "OK") {
            this.intializeMarkers(res.data);
            this.fitBounds();
          } else {
            //something went wrong
            this.globalEventManager.push({
              action: 'error',
              notificationType: 'warning',
              title: $localize`:@@checkBatchNumber.showLocations.warning.title:Error`,
              message: $localize`:@@checkBatchNumber.showLocations.warning.message:Something went wrong. Please try again.`
            })
          }
        }
        )
      this.subs.push(sub);
    }
  }

  intializeMarkers(locs) {
    for (let loc of locs) {
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

  openInfoWindow(gMarker, marker) {
    this.gInfoWindowText = marker.infoText;
    this.gInfoWindow.open(gMarker);
  }

  showCounterfeitModal() {
    this.activeModal.dismiss();
    const modalRef = this.modalService.open(CheckBatchNumberResponseModalComponent, {
      centered: true
    });
    Object.assign(modalRef.componentInstance, {
      success: false,
      callback: () => {
        if(this.callback) this.callback();
      }
    })
  }

  showSuccessModal() {
    this.activeModal.dismiss();
    const modalRef = this.modalService.open(CheckBatchNumberResponseModalComponent, {
      centered: true
    });
    Object.assign(modalRef.componentInstance, {
      success: true
    })
  }


  verifyAuthenticity() {
    this.submitted = true;
    if (this.checkBatchForm.invalid || !this.nextPressed) return
    if (this.notAllFieldsAreField()) {
      return;
    }
    let expDate: string = this.dateFormatter(this.checkBatchForm.get('expDateYear').value, this.checkBatchForm.get('expDateMonth').value, this.checkBatchForm.get('expDateDay').value);
    let prodDate: string = this.dateFormatter(this.checkBatchForm.get('prodDateYear').value, this.checkBatchForm.get('prodDateMonth').value, this.checkBatchForm.get('prodDateDay').value);
    let sub = this.publicService.checkPublicProductLabelBatchAuthenticityUsingGET(this.uuid, null, this.checkBatchForm.get('batchNumber').value, prodDate, expDate)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data) this.showSuccessModal();
          if (!res.data) this.showCounterfeitModal();
        } else {
          //something went wrong
          this.globalEventManager.push({
            action: 'error',
            notificationType: 'warning',
            title: $localize`:@@checkBatchNumber.verifyAuthenticity.warning.title:Error`,
            message: $localize`:@@checkBatchNumber.verifyAuthenticity.warning.message:Something went wrong. Please try again.`
          })
        }
      },
        err => {})
    this.subs.push(sub);
  }


  notAllFieldsAreField() {
    if (this.submitted && this.showCheckAuthenticity) {
      if (this.showProductionDate && this.showExpiryDate) {
        this.notAll = !this.checkBatchForm.get('expDateYear').value || !this.checkBatchForm.get('expDateMonth').value || !this.checkBatchForm.get('expDateDay').value ||
          !this.checkBatchForm.get('prodDateYear').value || !this.checkBatchForm.get('prodDateMonth').value || !this.checkBatchForm.get('prodDateDay').value
        return this.notAll;
      } else if (this.showProductionDate) {
        this.notAll = !this.checkBatchForm.get('prodDateYear').value || !this.checkBatchForm.get('prodDateMonth').value || !this.checkBatchForm.get('prodDateDay').value
        return this.notAll;
      } else if (this.showExpiryDate) {
        this.notAll = !this.checkBatchForm.get('expDateYear').value || !this.checkBatchForm.get('expDateMonth').value || !this.checkBatchForm.get('expDateDay').value
        return this.notAll;
      }
    }
  }

  get modalTitle() {
    let traceOriginTitle = $localize`:@@checkBatchNumber.modal.title:Trace origin`;
    let checkAuthenticityTitle = $localize`:@@checkBatchNumber.modal.title:Check authenticity`;
    if (this.originTrace) return traceOriginTitle;
    else return checkAuthenticityTitle;
  }

}
