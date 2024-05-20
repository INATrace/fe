import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as turf from '@turf/turf';
import { generateFormFromMetadata } from 'src/shared/utils';
import { FormArray, FormGroup } from '@angular/forms';
import { GenericEditableItemComponent } from 'src/app/shared/generic-editable-item/generic-editable-item.component';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { Subject } from 'rxjs/internal/Subject';
import { PlotCoordinatesManagerService } from '../../../shared-services/plot-coordinates-manager.service';
import { ApiPlotCoordinate } from '../../../../api/model/apiPlotCoordinate';
import { PlotCoordinateAction } from '../../../shared-services/plot-coordinate-action-enum';
import { ApiPlot } from '../../../../api/model/apiPlot';
import {CompanyProductTypesService} from '../../../shared-services/company-product-types.service';
import {Feature, Polygon} from '@turf/turf';
import {ApiPlotValidationScheme} from '../plots-form/validation';

@Component({
  selector: 'app-plots-item',
  templateUrl: './plots-item.component.html',
  styleUrls: ['./plots-item.component.scss']
})
export class PlotsItemComponent extends GenericEditableItemComponent<ApiPlot> implements OnInit {

  @Input()
  disableDelete = false;

  @Input()
  formTitle = null;

  @Input()
  productTypesCodebook: CompanyProductTypesService;

  plotCoordinatesManager: PlotCoordinatesManagerService = new PlotCoordinatesManagerService();

  readonly = false;

  plotCoordinates: Array<ApiPlotCoordinate> = [];


  plotShown = true;
  showPlotSubject = new Subject<boolean>();
  existingPlotCoordinatesSubject = new Subject<ApiPlotCoordinate[]>();
  tagOpened = false;
  mapEditable = true;

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    protected router: Router
  ) {
    super(globalEventsManager);
  }

  ngOnInit() {

    if (this.form.get('id').value) {
      this.mapEditable = false;
    }

    if (this.form.get('coordinates')) {
      this.plotCoordinates = this.form.get('coordinates').value;

      this.existingPlotCoordinatesSubject.next(this.plotCoordinates);
    }

    this.showPlotSubject.asObservable().subscribe(next =>  {
      this.plotShown = next;
    });

    this.plotShown = false;
    this.showPlotSubject.next(this.plotShown);



    this.form.markAsDirty();

    setTimeout(() => {
      this.tagOpened = true;
    }, 500);
  }

  get name() {
    const plotName = this.form.get('plotName').value;
    let returnStr = plotName;
    const crop = this.form.get('crop').value?.name ? this.form.get('crop').value?.name : '/';
    const size = this.form.get('size').value ? this.form.get('size').value : '/';
    const unit = this.form.get('unit').value ? this.form.get('unit').value : '/';
    if (plotName) {
       if (this.form.get('crop').value?.name) {
         returnStr += ' - ' + crop;
       }
       if (this.form.get('size').value) {
        returnStr += ' - ' + size;
       }
       if (this.form.get('unit').value) {
        returnStr += unit;
       }

       return returnStr;
    }
  }

  public generateForm(value: any): FormGroup {
    return generateFormFromMetadata(ApiPlot.formMetadata(), value, ApiPlotValidationScheme);
  }

  showHidePlot() {
    this.plotShown = !this.plotShown;
    this.showPlotSubject.next(this.plotShown);
  }

  deletePlot() {
    this.plotCoordinatesManager.registerEvent(PlotCoordinateAction.DELETE_PLOT);
  }

  undoLastPoint() {
    if (this.plotCoordinates.length > 1) {
      this.plotCoordinatesManager.registerEvent(PlotCoordinateAction.DELETE_LAST_COORDINATE);
    }
  }

  updateFormCoordinates(coordinates: Array<ApiPlotCoordinate>) {
    if (coordinates) {

      const coordinatesFormArray = this.form.get('coordinates') as FormArray;
      coordinatesFormArray.clear();

      coordinates.forEach(c => {
        const nextPlotCoordinate = generateFormFromMetadata(ApiPlotCoordinate.formMetadata(), c, null);
        coordinatesFormArray.push(nextPlotCoordinate);
      });

      if (this.mapEditable) {
        const coordinates2Darray = this.getCoordinatesArray(coordinates);
        const geoJsonA: Feature<Polygon> = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              coordinates2Darray
            ],
          },
          properties: null,
        };

        const calculatedArea = (turf.area(geoJsonA) / 1000).toFixed(2);
        this.form.get('size').setValue(calculatedArea);
        this.form.get('unit').setValue('ha');
      }

    } else {
      this.form.get('coordinates').setValue(null);
    }
    this.form.get('coordinates').markAsDirty();
  }

  getCoordinatesArray(plotCoordinates: ApiPlotCoordinate[]): number[][] {
    const coords = [];
    plotCoordinates.forEach(v => coords.push([v.longitude, v.latitude]));
    coords.push(coords[0]);
    return coords;
  }
}
