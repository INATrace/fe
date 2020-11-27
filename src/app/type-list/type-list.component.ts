import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalEventManagerService } from '../system/global-event-manager.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, debounceTime, tap, switchMap, map, shareReplay, take } from 'rxjs/operators';
import { ApiResponsePaginatedListChainFacilityType } from 'src/api-chain/model/apiResponsePaginatedListChainFacilityType';
import { ActivatedRoute } from '@angular/router';
import { ApiResponsePaginatedListChainMeasureUnitType } from 'src/api-chain/model/apiResponsePaginatedListChainMeasureUnitType';
import { ApiResponsePaginatedListChainActionType } from 'src/api-chain/model/apiResponsePaginatedListChainActionType';
import { TypeDetailModalComponent } from '../type-detail-modal/type-detail-modal.component';
import { NgbModalImproved } from '../system/ngb-modal-improved/ngb-modal-improved.service';
import { CodebookService } from 'src/api-chain/api/codebook.service';
import { ApiResponsePaginatedListChainGradeAbbreviation } from 'src/api-chain/model/apiResponsePaginatedListChainGradeAbbreviation';
import { ApiResponsePaginatedListChainProcessingEvidenceType } from 'src/api-chain/model/apiResponsePaginatedListChainProcessingEvidenceType';
import { ApiResponsePaginatedListChainOrderEvidenceType } from 'src/api-chain/model/apiResponsePaginatedListChainOrderEvidenceType';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss']
})
export class TypeListComponent implements OnInit {

  constructor(
    private chainCodebookService: CodebookService,
    private route: ActivatedRoute,
    private modalService: NgbModalImproved,
    protected globalEventsManager: GlobalEventManagerService
  ) { }

  ngOnInit(): void {
    this.setAlls();
    if (this.type === 'facility-types') this.title = $localize`:@@settingsTypes.typeList.title.facility:Facility types`;
    if (this.type === 'measurement-unit-types') this.title = $localize`:@@settingsTypes.typeList.title.measurement:Measurement unit types`;
    if (this.type === 'action-types') this.title = $localize`:@@settingsTypes.typeList.title.actions:Action types`;
    if (this.type === 'grade-abbreviation') this.title = $localize`:@@settingsTypes.typeList.title.grades:Grade abbreviations`;
    if (this.type === 'processing-evidence-types') this.title = $localize`:@@settingsTypes.typeList.title.processingEvidenceTypes:Processing evidence types`;
    if (this.type === 'order-evidence-types') this.title = $localize`:@@settingsTypes.typeList.title.orderEvidenceTypes:Order evidence types`;
  }

  ngOnChanges() {
    this.reloadPage();
  }

  @Input()
  type;

  @Input()
  parentReload: boolean;

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  searchName = new FormControl(null)
  reloadPingList$ = new BehaviorSubject<boolean>(false)

  pagingParams$ = new BehaviorSubject({})
  sortingParams$ = new BehaviorSubject({ sortBy: 'name', sort: 'ASC' })
  paging$ = new BehaviorSubject<number>(1);
  page = 1;
  pageSize = 10;

  showed: number = 0;
  all: number = 0;

  title: string = "";

  searchParams$ = combineLatest(
    this.searchName.valueChanges.pipe(
      startWith(null),
      debounceTime(200)
    ),
    (query: string) => {
      return { query }
    }
  )

  onPageChange(event) {
    this.paging$.next(event);
  }

  reloadPage(delay = true) {
    if (delay) {
      setTimeout(() => {
        this.setAlls();
        this.reloadPingList$.next(true)
      }, environment.reloadDelay)
    } else {
      this.setAlls();
      this.reloadPingList$.next(true)
    }
  }

  changeSort(event) {
    this.sortingParams$.next({ sortBy: event.key, sort: event.sortOrder })
  }

  sortOptions = [
    {
      key: 'id',
      name: $localize`:@@settingsTypes.sortOptions.id.name:Id`,
      inactive: true
    },
    {
      key: 'label',
      name: $localize`:@@settingsTypes.sortOptions.label.name:Label`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'actions',
      name: $localize`:@@settingsTypes.sortOptions.actions.name:Actions`,
      inactive: true
    },

  ]

  sortOptionsFPQ = [
    {
      key: 'id',
      name: $localize`:@@settingsTypes.sortOptions.id.name:Id`,
      inactive: true
    },
    {
      key: 'label',
      name: $localize`:@@settingsTypes.sortOptions.label.name:Label`,
      defaultSortOrder: 'ASC'
    },
    // {
    //   key: 'semiProduct',
    //   name: $localize`:@@settingsTypes.sortOptions.label.semiProduct:Semi-product`,
    //   // defaultSortOrder: 'ASC'
    //   inactive: true
    // },
    {
      key: 'type',
      name: $localize`:@@settingsTypes.sortOptions.label.type:Type`,
      // defaultSortOrder: 'ASC'
      inactive: true
    },
    // {
    //   key: 'mandatoryOnQuote',
    //   name: $localize`:@@settingsTypes.sortOptions.label.mandatoryOnQuote: Mand. on quote`,
    //   // defaultSortOrder: 'ASC'
    //   inactive: true
    // },
    // {
    //   key: 'requiredOnQuote',
    //   name: $localize`:@@settingsTypes.sortOptions.label.requiredOnQuote: Req. on quote`,
    //   // defaultSortOrder: 'ASC'
    //   inactive: true
    // },

    {
      key: 'fairness',
      name: $localize`:@@settingsTypes.sortOptions.fairness.name:Fairness`,
      inactive: true
    },
    {
      key: 'provenance',
      name: $localize`:@@settingsTypes.sortOptions.provenance.name:Provenance`,
      inactive: true
    },
    {
      key: 'quality',
      name: $localize`:@@settingsTypes.sortOptions.quality.name:Quality`,
      inactive: true
    },
    {
      key: 'actions',
      name: $localize`:@@settingsTypes.sortOptions.actions.name:Actions`,
      inactive: true
    },

  ]


  apiLink(params) {
    if (this.type === 'facility-types') return this.chainCodebookService.getFacilityTypeListByMap({ ...params })
    if (this.type === 'measurement-unit-types') return this.chainCodebookService.getMeasureUnitTypeListByMap({ ...params })
    if (this.type === 'action-types') return this.chainCodebookService.getActionTypeListByMap({ ...params })
    if (this.type === 'grade-abbreviation') return this.chainCodebookService.getGradeAbbreviationListByMap({ ...params })
    if (this.type === 'processing-evidence-types') return this.chainCodebookService.getProcessingEvidenceTypeListByMap({ ...params })
    if (this.type === 'order-evidence-types') return this.chainCodebookService.getOrderEvidenceTypeListByMap({ ...params })
  }

  paginatedType() {
    if (this.type === 'facility-types') return ApiResponsePaginatedListChainFacilityType;
    if (this.type === 'measurement-unit-types') return ApiResponsePaginatedListChainMeasureUnitType;
    if (this.type === 'action-types') return ApiResponsePaginatedListChainActionType;
    if (this.type === 'grade-abbreviation') return ApiResponsePaginatedListChainGradeAbbreviation;
    if (this.type === 'processing-evidence-types') return ApiResponsePaginatedListChainProcessingEvidenceType;
    if (this.type === 'order-evidence-types') return ApiResponsePaginatedListChainOrderEvidenceType;
  }

  types$ = combineLatest(this.reloadPingList$, this.paging$, this.searchParams$, this.sortingParams$,
    (ping: boolean, page: number, search: any, sorting: any) => {
      return {
        ...search,
        ...sorting,
        offset: (page - 1) * this.pageSize,
        limit: this.pageSize
      }
    }).pipe(
      tap(val => this.globalEventsManager.showLoading(true)),
      switchMap(params => {
        return this.apiLink(params)
      }),
      map((resp) => {
        if (resp) {
          this.showed = 0;
          if (resp.data && resp.data.count && (this.pageSize - resp.data.count > 0)) this.showed = resp.data.count;
          else if (resp.data && resp.data.count && (this.pageSize - resp.data.count <= 0)) {
            let temp = resp.data.count - (this.pageSize * (this.page - 1));
            this.showed = temp >= this.pageSize ? this.pageSize : temp;
          }
          this.showing.emit(this.showed);
          return resp.data
        }
      }),
      tap(val => this.globalEventsManager.showLoading(false)),
      shareReplay(1)
    )


  edit(type) {
    let editTitle = ""
    if (this.type === 'facility-types') editTitle = $localize`:@@settingsTypes.editFacilityType.editTitle:Edit facility type`;
    if (this.type === 'measurement-unit-types') editTitle = $localize`:@@settingsTypes.editMeasurementUnitType.editTitle:Edit measurement unit type`;
    if (this.type === 'action-types') editTitle = $localize`:@@settingsTypes.editActionType.editTitle:Edit action type`;
    if (this.type === 'grade-abbreviation') editTitle = $localize`:@@settingsTypes.editGradeAbbreviation.editTitle:Edit grade abbreviation`;
    if (this.type === 'processing-evidence-types') editTitle = $localize`:@@settingsTypes.editProcessingEvidenceType.editTitle:Edit processing evidence type`;
    if (this.type === 'order-evidence-types') editTitle = $localize`:@@settingsTypes.editOrderEvidenceType.editTitle:Edit order evidence type`;

    this.modalService.open(TypeDetailModalComponent, {
      centered: true
    }, {
      update: true,
      title: editTitle,
      type: this.type,
      typeElement: type,
      saveCallback: () => {
        this.reloadPage();
      }
    });
  }

  async delete(type) {
    let result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@settingsTypes.remove.warning.message:Are you sure you want to remove ${ type.label }?`,
      options: { centered: true },
      dismissable: false
    });
    if (result != "ok") return

    try {
      this.globalEventsManager.showLoading(true);
      if (this.type === 'facility-types') {
        let res = await this.chainCodebookService.deleteFacilityType(type).pipe(take(1)).toPromise()
        if (res && res.status === 'OK') {
          this.reloadPage();
        }
      }
      if (this.type === 'measurement-unit-types') {
        let res = await this.chainCodebookService.deleteMeasureUnitType(type).pipe(take(1)).toPromise()
        if (res && res.status === 'OK') {
          this.reloadPage();
        }
      }
      if (this.type === 'action-types') {
        let res = await this.chainCodebookService.deleteActionType(type).pipe(take(1)).toPromise()
        if (res && res.status === 'OK') {
          this.reloadPage();
        }
      }
      if (this.type === 'grade-abbreviation') {
        let res = await this.chainCodebookService.deleteGradeAbbreviation(type).pipe(take(1)).toPromise()
        if (res && res.status === 'OK') {
          this.reloadPage();
        }
      }
      if (this.type === 'processing-evidence-types') {
        let res = await this.chainCodebookService.deleteProcessingEvidenceType(type).pipe(take(1)).toPromise()
        if (res && res.status === 'OK') {
          this.reloadPage();
        }
      }
      if (this.type === 'order-evidence-types') {
        let res = await this.chainCodebookService.deleteOrderEvidenceType(type).pipe(take(1)).toPromise()
        if (res && res.status === 'OK') {
          this.reloadPage();
        }
      }

      // let res = await this.productController.updateProductUsingPUT(this.currentProduct).pipe(take(1)).toPromise()
      // if (res && res.status === 'OK') {
      //   this.reload()
      // }
    } catch (e) {
    } finally {
      this.globalEventsManager.showLoading(false);
    }
  }




  showPagination() {
    if (((this.showed - this.pageSize) == 0 && this.all >= this.pageSize) || this.page > 1) return true;
    else return false
  }


  async setAlls() {

    if (this.type === 'facility-types') {
      let res = await this.chainCodebookService.getFacilityTypeList().pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data && res.data.count >= 0) {
        this.all = res.data.count;
        this.countAll.emit(res.data.count);
      }
    }
    if (this.type === 'measurement-unit-types') {
      let res = await this.chainCodebookService.getMeasureUnitTypeList().pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data && res.data.count >= 0) {
        this.all = res.data.count;
        this.countAll.emit(res.data.count);
      }
    }
    if (this.type === 'action-types') {
      let res = await this.chainCodebookService.getActionTypeList().pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data && res.data.count >= 0) {
        this.all = res.data.count;
        this.countAll.emit(res.data.count);
      }
    }
    if (this.type === 'grade-abbreviation') {
      let res = await this.chainCodebookService.getGradeAbbreviationList().pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data && res.data.count >= 0) {
        this.all = res.data.count;
        this.countAll.emit(res.data.count);
      }
    }
    if (this.type === 'processing-evidence-types') {
      let res = await this.chainCodebookService.getProcessingEvidenceTypeList().pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data && res.data.count >= 0) {
        this.all = res.data.count;
        this.countAll.emit(res.data.count);
      }
    }
    if (this.type === 'order-evidence-types') {
      let res = await this.chainCodebookService.getOrderEvidenceTypeList().pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data && res.data.count >= 0) {
        this.all = res.data.count;
        this.countAll.emit(res.data.count);
      }
    }
  }

  setFPQ(fpq: boolean) {
    if (fpq) return '✓';
    return null;
  }

}
