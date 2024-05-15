import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ApiProductType} from '../../../../api/model/apiProductType';
import {CompanyProductTypesService} from '../../../shared-services/company-product-types.service';
import {ApiPlotCoordinate} from '../../../../api/model/apiPlotCoordinate';
import {PlotCoordinatesManagerService} from '../../../shared-services/plot-coordinates-manager.service';
import {ApiPlot} from '../../../../api/model/apiPlot';
import {ListEditorManager} from '../../../shared/list-editor/list-editor-manager';
import {defaultEmptyObject, generateFormFromMetadata} from '../../../../shared/utils';
import {Subject} from 'rxjs/internal/Subject';
import {ApiPlotValidationScheme} from './validation';

@Component({
  selector: 'app-plots-form',
  templateUrl: './plots-form.component.html',
  styleUrls: ['./plots-form.component.scss']
})
export class PlotsFormComponent implements OnInit {

  @Input()
  productTypesCodebook: CompanyProductTypesService;

  @Input()
  form: FormGroup; // contains the plots control

  @Input()
  submitted = false;

  plotCoordinates: Array<ApiPlotCoordinate> = [];
  showDeforestationData = true;

  plots: Array<ApiPlot> = [];
  productTypes: Array<ApiProductType> = [];
  plotCoordinatesManager: PlotCoordinatesManagerService = new PlotCoordinatesManagerService();

  pin: ApiPlotCoordinate;
  plotsListManager: any;

  plotForms: FormGroup[] = [];

  drawPlotSubject = new Subject<boolean>();

  static ApiPlotCreateEmptyObject(): ApiPlot {
    const obj = ApiPlot.formMetadata();
    return defaultEmptyObject(obj) as ApiPlot;
  }

  static ApiPlotEmptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(PlotsFormComponent.ApiPlotCreateEmptyObject(), ApiPlotValidationScheme.validators);
    };
  }

  ngOnInit(): void {
    this.plots = this.form.get('plots').value;

    this.pin = {
      latitude: this.form.get('location').value.latitude,
      longitude: this.form.get('location').value.latitude,
    };

    if (this.plots) {
      this.plots.forEach(plot => {
        const plotForm: FormGroup = this.generatePlotForm(plot);
        this.plotForms.push(plotForm);
      });
    }

    this.initializeListManager();
    this.initializeMarker();
  }

  initializeMarker() {
    if (!this.form.get('latitude') || !this.form.get('longitude')) {
      return;
    }
    const lat = this.form.get('latitude').value;
    const lng = this.form.get('longitude').value;
    if (lng == null || lat == null) {
      return;
    }

    this.pin = {
      latitude: lat,
      longitude: lng
    };
  }

  initializeListManager() {
    this.plotsListManager = new ListEditorManager<ApiPlot>(
      this.form.get('plots') as FormArray,
      PlotsFormComponent.ApiPlotEmptyObjectFormFactory(),
      ApiPlotValidationScheme
    );
  }

  updateLonLat(coordinates: Array<ApiPlotCoordinate>) {
    if (coordinates) {
      this.form.get('location.latitude').setValue(coordinates[0].latitude);
      this.form.get('location.longitude').setValue(coordinates[0].longitude);
    } else {
      this.form.get('location.latitude').setValue(null);
      this.form.get('location.longitude').setValue(null);
    }
    this.form.get('location.latitude').markAsDirty();
    this.form.get('location.longitude').markAsDirty();
  }

  private generatePlotForm(value: any): FormGroup {
    return generateFormFromMetadata(ApiPlot.formMetadata(), value, ApiPlotValidationScheme);
  }

  updateForm(index: number, controlName: string) {
    const plotsArray = this.form.get('plots') as FormArray;
    const updatedValue = this.plotForms[index].get(controlName).value;

    const previousParentValue = plotsArray.controls[index].value;
    previousParentValue[controlName] = updatedValue;

    plotsArray.controls[index].setValue(previousParentValue);
    plotsArray.controls[index].markAsDirty();
  }

  drawPlot() {
    const apiPlot: ApiPlot = {};
    const plotForm: FormGroup = this.generatePlotForm(apiPlot);
    this.plotForms.push(plotForm);

    this.drawPlotSubject.next(true);
  }
}
