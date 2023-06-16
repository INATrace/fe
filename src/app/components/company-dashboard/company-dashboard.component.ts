import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FacilityControllerService } from '../../../api/api/facilityController.service';
import { ApiFacility } from '../../../api/model/apiFacility';
import { EChartsOption } from 'echarts';
import { dateISOString } from '../../../shared/utils';
import { CompanyUserCustomersByRoleService } from '../../shared-services/company-user-customers-by-role.service';
import { CompanyControllerService } from '../../../api/api/companyController.service';
import { ApiSemiProduct } from '../../../api/model/apiSemiProduct';
import { CompanyProcessingActionsService } from '../../shared-services/company-processing-actions.service';
import { ProcessingActionControllerService } from '../../../api/api/processingActionController.service';
import { ValueChainControllerService } from '../../../api/api/valueChainController.service';
import {
  ApiProcessingPerformanceRequestEvidenceField
} from '../../../api/model/apiProcessingPerformanceRequestEvidenceField';
import { DashboardControllerService } from '../../../api/api/dashboardController.service';
import { FileSaverService } from 'ngx-filesaver';
import { CompanyCollectingFacilitiesService } from '../../shared-services/company-collecting-facilities.service';
import { GeneralSifrantService } from '../../shared-services/general-sifrant.service';
import { ApiProcessingAction } from '../../../api/model/apiProcessingAction';

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss']
})
export class CompanyDashboardComponent implements OnInit {

  facilityCodebook: GeneralSifrantService<any>;
  farmersCodebook: CompanyUserCustomersByRoleService;
  collectorsCodebook: CompanyUserCustomersByRoleService;
  procActionsCodebook: CompanyProcessingActionsService;

  constructor(
    private fb: FormBuilder,
    private facilityController: FacilityControllerService,
    private companyControllerService: CompanyControllerService,
    public valueChainController: ValueChainControllerService,
    private procActionController: ProcessingActionControllerService,
    private dashboardControllerService: DashboardControllerService,
    private fileSaverService: FileSaverService
  ) { }

  faTimes = faTimes;

  maxShownOnGraphs = 30;

  companyId: number = Number(localStorage.getItem('selectedUserCompany'));

  semiProductModelChoice = null;

  companyValueChains = [];

  evidenceFields = [];

  measureUnitTypes = [];

  processingActions: ApiProcessingAction[] = [];

  facilities: ApiFacility[] = [];

  semiProductOptions: ApiSemiProduct[] = [];

  deliveriesOptions: EChartsOption = {
    legend: {
      bottom: 0
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {},
    series: [{
      name: 'Quantity (in kg)',
      type: 'bar',
      label: {
        show: true,
        position: 'top'
      },
      data: []
    }],
  };

  mergeOptions: EChartsOption;

  // search fields form control
  deliveriesForm: FormGroup = this.fb.group({
    from: this.fb.control(new Date(new Date().getFullYear() - 2, new Date().getMonth(), new Date().getDay(), 12)),
    to: this.fb.control(new Date()),
    timeUnitGraphType: this.fb.control(undefined),
    facility: this.fb.control(null),
    semiProduct: this.fb.control(undefined),
    farmer: this.fb.control(undefined),
    collector: this.fb.control(undefined),
    organic: this.fb.control(undefined),
    womenOnly: this.fb.control(undefined),
    productInDeposit: this.fb.control(undefined),
    exportType: this.fb.control('EXCEL')
  });

  processingPerformanceOption = {
    legend: {
      bottom: 0
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: [{
      type: 'value',
      name: '',
      position: 'left'
    }, {
      type: 'value',
      name: '',
      position: 'right',
      axisLabel: {
        formatter: `{value} %`
      }
    }],
    series: [{
      name: 'Input',
      type: 'bar',
      label: {
        show: true,
        position: 'top'
      },
      yAxisIndex: 0,
      data: []
    }, {
      name: 'Output',
      type: 'bar',
      label: {
        show: true,
        position: 'top'
      },
      color: '#ff8c00',
      yAxisIndex: 0,
      data: []
    }, {
      name: 'Input-Output ratio in %',
      type: 'line',
      label: {
        show: true,
        position: 'top'
      },
      color: '#a9a9a9',
      yAxisIndex: 1,
      data: []
    }]
  };

  processingPerformanceMergeOptions: EChartsOption;

  processingPerformanceForm: FormGroup = this.fb.group({
    from: this.fb.control(new Date(new Date().getFullYear() - 2, new Date().getMonth(), new Date().getDay(), 12)),
    to: this.fb.control(new Date()),
    timeUnitGraphType: this.fb.control(undefined),
    facility: this.fb.control(null),
    process: this.fb.control(null),
    exportType: this.fb.control('EXCEL')
  });

  get facilityFormControl(): FormControl{
    return (this.deliveriesForm.get('facility') as FormControl);
  }

  get farmerFormControl(): FormControl{
    return (this.deliveriesForm.get('farmer') as FormControl);
  }

  get collectorFormControl(): FormControl{
    return (this.deliveriesForm.get('collector') as FormControl);
  }

  get organicFormControl(): FormControl{
    return (this.deliveriesForm.get('organic') as FormControl);
  }

  get womensOnlyFormControl(): FormControl{
    return (this.deliveriesForm.get('womenOnly') as FormControl);
  }

  get productInDepositFormControl(): FormControl{
    return (this.deliveriesForm.get('productInDeposit') as FormControl);
  }

  get processingFacilityFormControl(): FormControl{
    return (this.processingPerformanceForm.get('facility') as FormControl);
  }

  get processingActionFormControl(): FormControl{
    return (this.processingPerformanceForm.get('process') as FormControl);
  }

  processingEvidenceInputField(name: string) {
    return (this.processingPerformanceForm.get(name) as FormControl);
  }

  ngOnInit(): void {
    this.companyId = Number(localStorage.getItem('selectedUserCompany'));
    this.facilityCodebook = new CompanyCollectingFacilitiesService(this.facilityController, this.companyId);

    this.companyControllerService.getCompanyUsingGET(this.companyId).subscribe(
      next => {
        this.companyValueChains = next.data.valueChains;

        this.companyValueChains.forEach(valueChain => {
          this.valueChainController.getValueChainUsingGET(valueChain.id).subscribe(
            vchain => {
              if (vchain?.data?.measureUnitTypes) {
                vchain.data.measureUnitTypes.forEach(unitType => {
                  if (!this.measureUnitTypes.some(ut => ut.id === unitType.id)) {
                    this.measureUnitTypes.push(unitType);
                  }
                });
              }
            }
          );
        });
      }
    );

    this.farmersCodebook = new CompanyUserCustomersByRoleService(this.companyControllerService, this.companyId, 'FARMER');
    this.collectorsCodebook = new CompanyUserCustomersByRoleService(this.companyControllerService, this.companyId, 'COLLECTOR');

    this.procActionsCodebook =
      new CompanyProcessingActionsService(this.procActionController, this.companyId);

    this.procActionController.listProcessingActionsByCompanyUsingGETByMap({
      limit: 1000,
      offset: 0,
      id: this.companyId
    }).subscribe(next => {
      if (next?.data) {
        this.processingActions = next.data.items;
        setTimeout(() => {
          this.processingPerformanceForm.get('process').setValue(this.processingActions[0]);
          this.reloadProcessingFields(this.processingActions[0]);
        });
      }
    });

    this.facilityController.listCollectingFacilitiesByCompanyUsingGETByMap({
      limit: 1000,
      offset: 0,
      id: this.companyId
    }).subscribe(next => {
      this.facilities.push(next.data.items[0]);
      this.refreshSemiProducts();
      this.semiProductModelChoice = next.data.items[0].facilitySemiProductList[0]?.id;
      setTimeout(() => {
        this.semiProductSelected(next.data.items[0].facilitySemiProductList[0]?.id?.toString());
      });
    });

    // Init interval for delivery graph
    let diff = Math.abs(this.deliveriesForm.get('from').value.getTime() - this.deliveriesForm.get('to').value.getTime());
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    if (diffDays < 7) {
      this.deliveriesForm.get('timeUnitGraphType').setValue('DAY');
    } else if (diffDays < 30) {
      this.deliveriesForm.get('timeUnitGraphType').setValue('WEEK');
    } else if (diffDays < 905) {
      this.deliveriesForm.get('timeUnitGraphType').setValue('MONTH');
    } else {
      this.deliveriesForm.get('timeUnitGraphType').setValue('YEAR');
    }
    
    // Init interval for processing performance
    diff = Math.abs(this.processingPerformanceForm.get('from').value.getTime() - this.processingPerformanceForm.get('to').value.getTime());
    diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    if (diffDays < 7) {
      this.processingPerformanceForm.get('timeUnitGraphType').setValue('DAY');
    } else if (diffDays < 30) {
      this.processingPerformanceForm.get('timeUnitGraphType').setValue('WEEK');
    } else if (diffDays < 900) {
      this.processingPerformanceForm.get('timeUnitGraphType').setValue('MONTH');
    } else {
      this.processingPerformanceForm.get('timeUnitGraphType').setValue('YEAR');
    }
  }

  refreshDeliveriesData() {

    // True when checked, otherwise no filter (null)
    const womenOnlyFilter = this.deliveriesForm.get('womenOnly')?.value ? true : null;
    const organicFilter = this.deliveriesForm.get('organic')?.value ? true : null;
    const productInDepositFilter = this.deliveriesForm.get('productInDeposit')?.value ? true : null;
    const facilityIds = this.facilities.map(facility => facility.id);

    this.dashboardControllerService.getDeliveriesAggregatedDataUsingGETByMap({
          companyId: this.companyId,
          farmerId: this.deliveriesForm.get('farmer')?.value?.id,
          facilityIds,
          collectorId: this.deliveriesForm.get('collector')?.value?.id,
          semiProductId: this.deliveriesForm.get('semiProduct')?.value?.id,
          isWomenShare: womenOnlyFilter,
          organicOnly: organicFilter,
          priceDeterminedLater: productInDepositFilter,
          productionDateStart: dateISOString(this.deliveriesForm.get('from')?.value),
          productionDateEnd: dateISOString(this.deliveriesForm.get('to')?.value),
          aggregationType: this.deliveriesForm.get('timeUnitGraphType').value
        }).subscribe(next => {
          if (next.data) {
            const labelData = [];
            const graphData = [];

            // only first n results are shown in the graph
            next.data.totals?.slice(0, this.maxShownOnGraphs).forEach(
              total => {
                const timeUnit = this.calculateTimeUnit(total.unit, total.year, this.deliveriesForm.get('timeUnitGraphType').value);
                labelData.push(timeUnit);
                graphData.push(total.totalQuantity);
            });

            this.mergeOptions = {
              xAxis: {
                data: labelData
              },
              series: [{
                data: graphData
              }]
            };
          }
    });
  }

  refreshProcessingPerformanceData() {

    const efs: ApiProcessingPerformanceRequestEvidenceField[] = [];

    // Check given evidenceFields
    this.evidenceFields.forEach(evidenceField => {
      const value = this.processingPerformanceForm.get(evidenceField.fieldName)?.value;
      if (value) {
        if (evidenceField.fieldName === 'WASHING_DATE') {
          efs.push({
            evidenceField: {
              fieldName: evidenceField.fieldName
            },
            instantValue: value
          });

        } else if (evidenceField.fieldName === 'SIZE') {
          efs.push({
            evidenceField: {
              fieldName: evidenceField.fieldName
            },
            numericValue: value
          });
        } else {
          // string
          efs.push({
            evidenceField: {
              fieldName: evidenceField.fieldName
            },
            stringValue: value
          });
        }
      }
    });

    this.dashboardControllerService
      .calculateProcessingPerformanceDataUsingPOST({
      companyId: this.companyId,
      facilityId: this.processingPerformanceForm.get('facility')?.value?.id,
      processActionId: this.processingPerformanceForm.get('process')?.value?.id,
      dateStart: dateISOString(this.processingPerformanceForm.get('from')?.value),
      dateEnd: dateISOString(this.processingPerformanceForm.get('to')?.value),
      aggregationType: this.processingPerformanceForm.get('timeUnitGraphType').value,
      evidenceFields: efs
      }).subscribe(next => {
      if (next.data) {
        const labelData = [];
        const inputQuantityData = [];
        const outputQuantityData = [];
        const ratioData = [];

        // only first n results are shown in the graph
        next.data.totals?.slice(0, this.maxShownOnGraphs).forEach(
          total => {
            const timeUnit = this.calculateTimeUnit(total.unit, total.year, this.processingPerformanceForm.get('timeUnitGraphType').value);
            labelData.push(timeUnit);
            inputQuantityData.push(total.inputQuantity);
            outputQuantityData.push(total.outputQuantity);
            ratioData.push(total.ratio);
          });

        this.processingPerformanceMergeOptions = {
          xAxis: {
            data: labelData
          },
          yAxis: [{
            axisLabel: {
              formatter: `{value} ${next.data.measureUnitType.label}`
            }
          }],
          series: [{
              name: `Input (in ${next.data.measureUnitType.label})`,
              data: inputQuantityData
            }, {
              name: `Output (in ${next.data.measureUnitType.label})`,
              data: outputQuantityData
            }, {
              data: ratioData
            }]
        };
      }
    });
  }

  private calculateTimeUnit(stringUnit: string, year: number, aggregationType: string) {
    let timeUnit = stringUnit;
    if (aggregationType === 'WEEK') {
      timeUnit = this.translateGraphWeek(stringUnit, year);
    } else if (aggregationType === 'MONTH') {
      timeUnit = this.translateGraphMonth(stringUnit, year);
    }
    return timeUnit;
  }

  private translateGraphWeek(weekNum: string, year: number) {
    return $localize `:@@companyDashboardComponent.graph.timeUnit.week:Week` + '-' + weekNum + ' ' + year;
  }

  private translateGraphMonth(monthNum: string, year: number) {
    let translated;
    if (monthNum === '0') {
      translated = $localize `:@@companyDashboardComponent.graph.timeUnit.month.Jan:Jan`;
    } else if (monthNum === '1') {
      translated = $localize `:@@companyDashboardComponent.graph.timeUnit.month.Feb:Feb`;
    } else if (monthNum === '2') {
      translated = $localize `:@@companyDashboardComponent.graph.timeUnit.month.Mar:Mar`;
    } else if (monthNum === '3') {
      translated = $localize `:@@companyDashboardComponent.graph.timeUnit.month.Apr:Apr`;
    } else if (monthNum === '4') {
      translated = $localize `:@@companyDashboardComponent.graph.timeUnit.month.May:May`;
    } else if (monthNum === '5') {
      translated = $localize `:@@companyDashboardComponent.graph.timeUnit.month.Jun:Jun`;
    } else if (monthNum === '6') {
      translated = $localize `:@@companyDashboardComponent.graph.timeUnit.month.Jul:Jul`;
    } else if (monthNum === '7') {
      translated = $localize `:@@companyDashboardComponent.graph.timeUnit.month.Aug:Aug`;
    } else if (monthNum === '8') {
      translated = $localize `:@@companyDashboardComponent.graph.timeUnit.month.Sep:Sep`;
    } else if (monthNum === '9') {
      translated = $localize `:@@companyDashboardComponent.graph.timeUnit.month.Oct:Oct`;
    } else if (monthNum === '10') {
      translated = $localize `:@@companyDashboardComponent.graph.timeUnit.month.Nov:Nov`;
    } else if (monthNum === '11') {
      translated = $localize `:@@companyDashboardComponent.graph.timeUnit.month.Dec:Dec`;
    }

    return translated + ' ' + year;
  }

  onFilterDateRangeChange() {
    setTimeout(() => this.refreshDeliveriesData());
  }

  onFilterProcessingDateRangeChange() {
    setTimeout(() => this.refreshProcessingPerformanceData());
  }

  semiProductSelected(id: string) {
    if (id) {
      this.deliveriesForm.get('semiProduct').setValue({ id });
    } else {
      this.deliveriesForm.get('semiProduct').setValue(null);
    }

    this.deliveriesForm.get('semiProduct').markAsDirty();
    this.deliveriesForm.get('semiProduct').updateValueAndValidity();

    setTimeout(() => this.refreshDeliveriesData());
  }

  setDeliveryInterval(interval: string) {

    const previousVal = this.deliveriesForm.get('timeUnitGraphType').value;
    let newVal;

    if (interval === 'day') {
      newVal = 'DAY';
    } else if (interval === 'week') {
      newVal = 'WEEK';
    } else if (interval === 'month') {
      newVal = 'MONTH';
    } else if (interval === 'year') {
      newVal = 'YEAR';
    }

    if (previousVal !== newVal) {
      this.deliveriesForm.get('timeUnitGraphType').setValue(newVal);
      this.refreshDeliveriesData();
    }
  }

  setProcessingPerformanceInterval(interval: string) {

    const previousVal = this.processingPerformanceForm.get('timeUnitGraphType').value;
    let newVal;

    if (interval === 'day') {
      newVal = 'DAY';
    } else if (interval === 'week') {
      newVal = 'WEEK';
    } else if (interval === 'month') {
      newVal = 'MONTH';
    } else if (interval === 'year') {
      newVal = 'YEAR';
    }

    if (previousVal !== newVal) {
      this.processingPerformanceForm.get('timeUnitGraphType').setValue(newVal);
      this.refreshProcessingPerformanceData();
    }
  }

  async addSelectedFacility(facility: ApiFacility) {
    if (!facility) {
      // no element is selected, only user input
      return;
    }
    if (this.facilities.some(s => s.id === facility.id)) {
      // same element selected. refresh the input element, but do not update the list
      setTimeout(() => this.deliveriesForm.get('facility').setValue(null));
      return;
    }
    this.facilities.push(facility);
    this.refreshSemiProducts();
    this.refreshDeliveriesData();
    setTimeout(() => this.deliveriesForm.get('facility').setValue(null));
  }

  deleteFacility(facility: ApiFacility, idx: number) {
    this.facilities.splice(idx, 1);
    this.refreshSemiProducts();
    this.refreshDeliveriesData();
  }

  refreshSemiProducts() {
    this.semiProductOptions = [];

    this.facilities.forEach(f => {
      if (f.facilitySemiProductList) {
        f.facilitySemiProductList.forEach((sp => {
          if (!this.semiProductOptions.some(el => el.id === sp.id)) {
            this.semiProductOptions.push(sp);
          }
        }));
      }
    });
  }

  exportDeliveries() {

    const womenOnlyFilter = this.deliveriesForm.get('womenOnly')?.value ? true : null;
    const organicFilter = this.deliveriesForm.get('organic')?.value ? true : null;
    const productInDepositFilter = this.deliveriesForm.get('productInDeposit')?.value ? true : null;
    const facilityIds = this.facilities.map(facility => facility.id);
    const exportType = this.deliveriesForm.get('exportType')?.value;

    this.dashboardControllerService.exportDeliveriesDataUsingGETByMap({
      companyId: this.companyId,
      farmerId: this.deliveriesForm.get('farmer')?.value?.id,
      facilityIds,
      collectorId: this.deliveriesForm.get('collector')?.value?.id,
      semiProductId: this.deliveriesForm.get('semiProduct')?.value?.id,
      isWomenShare: womenOnlyFilter,
      organicOnly: organicFilter,
      priceDeterminedLater: productInDepositFilter,
      productionDateStart: dateISOString(this.deliveriesForm.get('from')?.value),
      productionDateEnd: dateISOString(this.deliveriesForm.get('to')?.value),
      aggregationType: this.deliveriesForm.get('timeUnitGraphType').value,
      exportType
    }).subscribe(next => {
      if (exportType === 'CSV') {
        this.fileSaverService.save(next, 'deliveries.csv');
      } else if (exportType === 'EXCEL') {
        this.fileSaverService.save(next, 'deliveries.xls');
      } else if (exportType === 'PDF') {
        this.fileSaverService.save(next, 'deliveries.pdf');
      }
    });
  }

  exportProcessingPerformance() {

    const efs: ApiProcessingPerformanceRequestEvidenceField[] = [];

    // check given evidenceFields
    this.evidenceFields.forEach(evidenceField => {
      const value = this.processingPerformanceForm.get(evidenceField.fieldName)?.value;
      if (value) {
        if (evidenceField.fieldName === 'WASHING_DATE') {
          efs.push({
            evidenceField: {
              fieldName: evidenceField.fieldName
            },
            instantValue: value
          });

        } else if (evidenceField.fieldName === 'SIZE') {
          efs.push({
            evidenceField: {
              fieldName: evidenceField.fieldName
            },
            numericValue: value
          });
        } else {
          // string
          efs.push({
            evidenceField: {
              fieldName: evidenceField.fieldName
            },
            stringValue: value
          });
        }
      }
    });

    const exportType = this.processingPerformanceForm.get('exportType')?.value;

    this.dashboardControllerService
      .exportProcessingPerformanceDataUsingPOST({
          companyId: this.companyId,
          facilityId: this.processingPerformanceForm.get('facility')?.value?.id,
          processActionId: this.processingPerformanceForm.get('process')?.value?.id,
          dateStart: dateISOString(this.processingPerformanceForm.get('from')?.value),
          dateEnd: dateISOString(this.processingPerformanceForm.get('to')?.value),
          aggregationType: this.processingPerformanceForm.get('timeUnitGraphType').value,
          evidenceFields: efs,
          exportType
        }).subscribe(next => {
          if (exportType === 'CSV') {
            this.fileSaverService.save(next, 'processing.csv');
          } else if (exportType === 'EXCEL') {
            this.fileSaverService.save(next, 'processing.xls');
          } else if (exportType === 'PDF') {
            this.fileSaverService.save(next, 'processing.pdf');
          }
        });
  }

  reloadProcessingFields(procAction: ApiProcessingAction) {
    if (procAction) {

      // reset previous evidence fields
      this.evidenceFields.forEach(ef => {
        if (this.processingPerformanceForm.contains(ef.fieldName)) {
          this.processingPerformanceForm.removeControl(ef.fieldName);
        }
      });
      this.evidenceFields = [];

      const foundProcAction = this.processingActions.find(pa => pa.id === procAction.id);
      if (foundProcAction) {
        foundProcAction.requiredEvidenceFields.forEach(evidenceField => {
          if (!this.evidenceFields.some(ef => ef.fieldName === evidenceField.fieldName)) {
            this.evidenceFields.push(evidenceField);
            this.processingPerformanceForm.addControl(evidenceField.fieldName, this.fb.control(undefined));
          }
        });
      }

      this.refreshProcessingPerformanceData();
    }
  }
}
