import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {environment} from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {Observable, Subscription} from 'rxjs';
import {ApiPlotCoordinate} from '../../../api/model/apiPlotCoordinate';
import {PlotCoordinatesManagerService} from '../../shared-services/plot-coordinates-manager.service';
import {PlotActionWrapper, PlotCoordinateAction} from '../../shared-services/plot-coordinate-action-enum';
import {ApiPlot} from '../../../api/model/apiPlot';
import {GlobalEventManagerService} from '../../core/global-event-manager.service';
import {Subject} from 'rxjs/internal/Subject';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  
  private lat = 45.7; // initial values for focus
  private lng = 13.7; // initial values for focus
  
  private map: mapboxgl.Map;
  private mapStyle = 'mapbox://styles/mapbox/outdoors-v12'; // style of the map
  private LAYER_ID = 'deforestation_layer';

  private mapTitle: string;
  private mapUrl;

  @Input()
  mapId = 'map';

  @Input()
  plotCoordinateDeletionEvent: Observable<PlotCoordinateAction>;

  @Input()
  plotCoordinatesManager: PlotCoordinatesManagerService;

  @Input()
  deforestationObs: Observable<boolean>;

  @Input()
  showPlotSubject: Subject<boolean>;

  @Input()
  editMode = false;

  @Input()
  plotCoordinates: Array<ApiPlotCoordinate>;  // used for adding/editing single plot

  @Input()
  plots: Array<ApiPlot>;  // used for viewing multiple plots

  @Input()
  pin: ApiPlotCoordinate;

  @Output()
  plotCoordinatesChange = new EventEmitter<Array<ApiPlotCoordinate>>();

  @Input()
  dfDataVisible = true;

  @Output()
  dfDataVisibleChange = new EventEmitter<boolean>();

  @Input()
  showPlotVisible = false;
  
  subscriptions: Subscription = new Subscription();
  markers: Array<mapboxgl.Marker> = [];
  
  constructor(private globalEventsManager: GlobalEventManagerService) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.initializeMap();
    if (this.plotCoordinatesManager) {
      this.subscriptions.add(this.plotCoordinatesManager.plotCoordinateAction$.subscribe(actionWrapper => {
        this.handlePlotCoordinateEvent(actionWrapper);
      }));
    }
    if (this.editMode) {
      if (this.showPlotSubject) {
        this.subscriptions.add(this.showPlotSubject.asObservable().subscribe(show => {
          this.togglePlot(show);
          this.showPlotVisible = show;
        }));
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  handlePlotCoordinateEvent(actionWrapper: PlotActionWrapper) {
    switch (actionWrapper.action) {
      case PlotCoordinateAction.DELETE_LAST_COORDINATE:
        this.undoLastPlotCoordinate(actionWrapper.plotId);
        break;
      case PlotCoordinateAction.DELETE_PLOT:
        this.deletePlot(actionWrapper.plotId);
        break;
      case PlotCoordinateAction.ADD_COORDINATE_CURRENT_LOCATION:
        this.addPlotCoordinateCurrentLocation(actionWrapper.plotId);
        break;
    }
  }

  getInitialMapExtremes(coordinates: Array<ApiPlotCoordinate>): [[number, number], [number, number]] {
    let latMin = coordinates[0].latitude;
    let latMax = coordinates[0].latitude;
    let lngMin = coordinates[0].longitude;
    let lngMax = coordinates[0].longitude;

    coordinates.forEach(v => {
      if (latMax < v.latitude) { latMax = v.latitude; }
      if (latMin > v.latitude) { latMin = v.latitude; }
      if (lngMax < v.longitude) { lngMax = v.longitude; }
      if (lngMin > v.longitude) { lngMin = v.longitude; }
    });
    const offset = 0.02;
    return [[lngMin - offset, latMin - offset], [lngMax + offset, latMax + offset]];
  }

  setExistingPlots(plots: Array<ApiPlot>) {

    const allPlotsCoordinates = [];
    plots.forEach(plot => {
      allPlotsCoordinates.push(...plot.coordinates);
    });

    if (allPlotsCoordinates.length > 0) {
      this.map.fitBounds(this.getInitialMapExtremes(allPlotsCoordinates));

      plots.forEach(plot => {
        this.showPlot(plot.plotName, this.getCoordinatesArray(plot.coordinates));
        this.setPlotCenterMarker(plot);
      });
    }
  }

  setExistingPlotCoordinates(coordinates: Array<ApiPlotCoordinate>) {
    if (this.markers.length > 0) {
      this.deletePlot();
    }
    coordinates.forEach(v => this.placeMarkerOnMap(v.latitude, v.longitude));
    this.map.fitBounds(this.getInitialMapExtremes(this.plotCoordinates));
    this.plotCoordinatesChange.emit(this.plotCoordinates);
  }

  undoLastPlotCoordinate(plotId?: string) {
    const lastMarker = this.markers.pop();
    lastMarker.remove();
    this.plotCoordinates.pop();
    this.plotCoordinatesChange.emit(this.plotCoordinates);
  }

  deletePlot(plotId?: string) {
    if (plotId) {
      this.hidePlot(plotId);
    } else {
      this.markers.forEach(m => m.remove());
      this.markers = [];
      this.plotCoordinates = [];
      this.plotCoordinatesChange.emit(this.plotCoordinates);
    }
  }

  addPlotCoordinateCurrentLocation(plotId?: string) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      this.placeMarkerOnMap(lat, lng);
      this.plotCoordinatesChange.emit(this.plotCoordinates);
    }, err => console.error(`Error while getting current location: ${err.code} ${err.message}`));
  }
  
  initializeMap(): void {
    if (this.editMode) {
      navigator.geolocation.getCurrentPosition( position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        });
      });
    }
    this.buildMap();
  }
  
  buildMap(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapboxAccessToken,
      container: this.mapId, // id of div that holds the map
      style: this.mapStyle,
      zoom: 10,
      center: [this.lng, this.lat]
    });

    this.map.on('click', e => this.mapClicked(e));
    this.map.on('load', () => this.mapLoaded());
    this.map.on('zoom', () => this.reactToZoom());
    
  }

  reactToZoom() {
    if (this.map.getZoom() > 12 && this.map.getLayer(this.LAYER_ID)) {
      this.map.removeLayer(this.LAYER_ID);
      this.dfDataVisible = false;
      this.dfDataVisibleChange.emit(false);
    }
  }

  placeMarkerOnMap(lat: number, lng: number, plot?: ApiPlot) {
    const idx = this.plotCoordinates.length;

    // create a HTML element for each feature
    const el = document.createElement('div');
    el.classList.add('marker');
    el.innerHTML = '<span><b>' + (idx + 1) + '</b></span>';


    if (plot) {
      const cropLabel = $localize`:@@map.modal.crop.title:Crop`;
      const sizeLabel = $localize`:@@map.modal.size.title:Size`;
      const geoIdLabel = $localize`:@@map.modal.geoId.title:GeoId`;
      const certificationLabel = $localize`:@@map.modal.certification.title:Certification`;
      const euOrganic = $localize`:@@map.modal.eu.organic.title:EU Organic`;
      const name = plot.plotName;
      const crop = plot.crop?.name;
      const size = plot.size;
      const geoId = plot.geoId;
      const popupHtml = `<div class="marker-popup">
                                  <div class="marker-popup-row-header">${name}</div>
                                  <div class="marker-popup-row">
                                    <div class="row-left">${cropLabel}</div>
                                    <div class="row-right">${crop}</div>
                                  </div>
                                  <div class="marker-popup-row">
                                    <div class="row-left">${sizeLabel}</div>
                                    <div class="row-right">${size}</div>
                                  </div>
                                  <div class="marker-popup-row">
                                    <div class="row-left">${geoIdLabel}</div>
                                    <div class="row-right">${geoId}</div>
                                  </div>
                                  <div class="marker-popup-row">
                                    <div class="row-left">${certificationLabel}</div>
                                    <div class="row-right">${euOrganic}</div>
                                  </div>
                                </div>`;

      const popup = new mapboxgl.Popup(
        {
          anchor: 'top',
          offset: { top: [0, -10]},
          closeOnClick: true
        }
      ).setHTML(popupHtml);

      // make a marker for each feature and add it to the map
      const marker = new mapboxgl.Marker(el)
        .setDraggable(false)
        .setPopup(popup)
        .setLngLat([lng, lat])
        .addTo(this.map);

      this.markers.push(marker);

    } else {
      // make a marker for each feature and add it to the map
      const marker = new mapboxgl.Marker(el)
        .setDraggable(true)
        .setLngLat([lng, lat])
        .addTo(this.map);

      this.markers.push(marker);
    }

    const coord: ApiPlotCoordinate = {
      latitude: lat,
      longitude: lng
    };

    this.plotCoordinates.push(coord);

  }
  
  // when the map is clicked, we add the plot-coordinate to the coordinates
  mapClicked(e) {
    if (this.editMode) {
      const lng = e.lngLat.wrap()['lng'];
      const lat = e.lngLat.wrap()['lat'];
      this.placeMarkerOnMap(lat, lng);
      this.plotCoordinatesChange.emit(this.plotCoordinates);
    } else {

      if (!this.plots || this.plots.length === 0) {
        this.dialogEUDR().then(
          (res) => {
            if (res === 'ok') {
              const lng = e.lngLat.wrap()['lng'];
              const lat = e.lngLat.wrap()['lat'];

              this.pin = {
                latitude: lat,
                longitude: lng
              };
              this.setPin(this.pin);
            }
          }
        );
      }
    }
  }

  async dialogEUDR() {
    return await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@map.modal.eudr.warning.title:European legislation (EUDR) requires polygon data instead of single pin for all plots of land >4ha. Would you like to proceed anyways?.`,
      options: {
        centered: true
      },
      dismissable: false
    });
  }
  async callApiDatasetMetadata(uuid: string) {
      const response = await fetch('https://api.resourcewatch.org/v1/dataset/' + uuid + '?includes=layer,metadata');
      if (!response.ok) {
        console.error(`Error while retrieving resources, status: ${response.status}`);
      }
      return response.json();
  }

  getTileLayerUrlForTreeCoverLoss(obj) {
      // drill down to get a useful object
      const layerConfig = obj['data']['attributes']['layer'][0]['attributes']['layerConfig'];
      // get the URL template parameters
      const defaultParams = layerConfig['params_config'];

      // get the full templated URL
      let url = layerConfig['source']['tiles'][0];
      // substitute default parameters iteratively
      for (const param of defaultParams) {
          url = url.replace('{' + param['key'] + '}', param['default'].toString());
      }
      return url;
  }


  getLayerSlug(obj) {
      return obj['data']['attributes']['layer'][0]['attributes']['slug'];
  }

  addTileLayerToMap(mapVar) {
      mapVar.addSource(this.mapTitle, {
          id: 10,
          type: 'raster',
          tiles: [
              this.mapUrl
          ],
          tilesize: 256
      });

      this.addLayer();
    }
    
  addLayer() {
    this.map.addLayer({
        id: this.LAYER_ID,
        type: 'raster',
        source: this.mapTitle,
        paint: {
            'raster-opacity': 1  // let mapbox baselayer peak through
        }
    });
  }

  async mapLoaded() {
      const datasetId = environment.mapboxDeforestationDatasetId;
      const metadata = await this.callApiDatasetMetadata(datasetId);
      const slug = this.getLayerSlug(metadata);
      const tileLayerUrl = this.getTileLayerUrlForTreeCoverLoss(metadata);
      this.mapTitle = slug;
      this.mapUrl = tileLayerUrl;
      this.addTileLayerToMap(this.map);

      if (!this.editMode) {
        // load plots
        if (this.plots && this.plots.length > 0) {
          this.setExistingPlots(this.plots);
        } else {
         if (this.pin) {
          this.setPin(this.pin);
          this.map.fitBounds(this.getInitialMapExtremes(this.plotCoordinates));
         }
        }
      } else {
        // edit mode
        if (this.plotCoordinates && this.plotCoordinates.length > 0) {
          const plotCoordinates = [...this.plotCoordinates];
          this.plotCoordinates = [];
          this.setExistingPlotCoordinates(plotCoordinates);
        }
      }
  }

  private setPin(pin: ApiPlotCoordinate) {
    // remove all previous markers
    this.markers.forEach(m => m.remove());
    this.markers = [];
    this.plotCoordinates = [];

    this.placeMarkerOnMap(pin.latitude, pin.longitude);
    this.plotCoordinatesChange.emit(this.plotCoordinates);
  }



  showPlot(name: string, coordinates: number[][]) {
    this.map.addSource(name, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            coordinates
          ]
        },
        properties: {
          name: 'polygon'
        }
      }
    });

    // Add a new layer to visualize the polygon.
    this.map.addLayer({
      id: name,
      type: 'fill',
      source: name, // reference the data source
      layout: {},
      paint: {
      'fill-color': '#999933',
      'fill-opacity': 0.5
      }
    });

    const borderId = name + 'Border';

    this.map.addLayer({
      id: borderId,
      type: 'line',
      source: name,
      layout: {},
      paint: {
      'line-color': '#999933',
      'line-width': 1
      }
    });
    
  }

  hidePlot(plotName?: string) {
    if (!plotName) {
      this.map.removeLayer('polygonPreview');
      this.map.removeLayer('polygonPreviewBorder');
      this.map.removeSource('polygonPreview');
    } else {
      this.map.removeLayer(plotName);
      const borderName = plotName + 'Border';
      this.map.removeLayer(borderName);
      this.map.removeSource(plotName);
    }
  }

  togglePlot(show: boolean) {
    if (show) {
      this.showPlot('polygonPreview', this.getCoordinatesArray(this.plotCoordinates));
    } else {
      this.hidePlot();
    }
  }

  getCoordinatesArray(plotCoordinates: ApiPlotCoordinate[]): number[][] {
    const coords = [];
    plotCoordinates.forEach(v => coords.push([v.longitude, v.latitude]));
    coords.push(coords[0]);
    return coords;
  }

  private setPlotCenterMarker(plot: ApiPlot) {

    const plotCoordinates: ApiPlotCoordinate[] = plot.coordinates;

    let lonCenter = plotCoordinates.reduce( (sum, element) => sum += element.longitude , 0);
    lonCenter = lonCenter / plotCoordinates.length;

    let latCenter = plotCoordinates.reduce( (sum, element) => sum += element.latitude , 0);
    latCenter = latCenter / plotCoordinates.length;

    this.placeMarkerOnMap(latCenter, lonCenter, plot);
  }
}
