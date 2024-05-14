import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { generateFormFromMetadata } from 'src/shared/utils';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { GenericEditableItemComponent } from 'src/app/shared/generic-editable-item/generic-editable-item.component';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { Subject } from 'rxjs/internal/Subject';
import { PlotCoordinatesManagerService } from '../../../shared-services/plot-coordinates-manager.service';
import { ApiPlotCoordinate } from '../../../../api/model/apiPlotCoordinate';
import { PlotCoordinateAction } from '../../../shared-services/plot-coordinate-action-enum';
import { ApiPlot } from '../../../../api/model/apiPlot';
import {CompanyProductTypesService} from '../../../shared-services/company-product-types.service';

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


  plotShown = false;
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

    this.plotShown = false;
    this.showPlotSubject.next(this.plotShown);

    this.form.markAsDirty();

    setTimeout(() => {
      this.tagOpened = true;
    }, 500);
  }

  get name() {
    if (this.form.get('plotName').value) {
      return this.form.get('plotName').value;
    }
  }

  public generateForm(value: any): FormGroup {
    return generateFormFromMetadata(ApiPlot.formMetadata(), value, null);
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

    } else {
      this.form.get('coordinates').setValue(null);
    }
    this.form.get('coordinates').markAsDirty();
  }

}
