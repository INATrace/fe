import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { ApiPaginatedResponseApiFacility } from '../../../../../api/model/apiPaginatedResponseApiFacility';
import { ApiPaginatedListApiFacility } from '../../../../../api/model/apiPaginatedListApiFacility';
import { ApiFacility } from '../../../../../api/model/apiFacility';
import { ProcessingActionControllerService } from '../../../../../api/api/processingActionController.service';
import { ApiProcessingAction } from '../../../../../api/model/apiProcessingAction';
import { ApiPaginatedResponseApiProcessingAction } from '../../../../../api/model/apiPaginatedResponseApiProcessingAction';

@Component({
  selector: 'app-stock-processing-facility-list',
  templateUrl: './stock-processing-facility-list.component.html',
  styleUrls: ['./stock-processing-facility-list.component.scss']
})
export class StockProcessingFacilityListComponent implements OnInit {

  @Input()
  reloadPingList$ = new BehaviorSubject<boolean>(false);

  @Input()
  companyId: number;

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  allFacilities = 0;
  showedFacilities = 0;

  facilities$: Observable<ApiPaginatedListApiFacility>;

  collection = [];
  other = [];
  storage = [];

  processingActions: ApiProcessingAction[] = [];

  constructor(
    private globalEventsManager: GlobalEventManagerService,
    private facilityControllerService: FacilityControllerService,
    private processingActionControllerService: ProcessingActionControllerService,
    @Inject(LOCALE_ID) public userLocale: string
  ) { }

  ngOnInit(): void {

    this.facilities$ = combineLatest([this.reloadPingList$])
      .pipe(
        tap(() => this.globalEventsManager.showLoading(true)),
        switchMap(() => this.processingActionControllerService.listProcessingActionsByCompanyUsingGET(this.companyId, this.userLocale.toUpperCase())),
        tap((res: ApiPaginatedResponseApiProcessingAction) => {
          if (res) {
            this.processingActions = res.data.items;
          }
        }),
        switchMap(() => this.loadEntityList()),
        map((res: ApiPaginatedResponseApiFacility) => {
          if (res) {
            this.showedFacilities = res.data.count;
            this.showing.emit(this.showedFacilities);
            this.arrangeFacilities(res.data.items);
            return res.data;
          } else {
            return null;
          }
        }),
        tap((res) => {
          if (res) {
            this.allFacilities = res.count;
          } else {
            this.allFacilities = 0;
          }
          this.countAll.emit(this.allFacilities);
        }),
        tap(() => this.globalEventsManager.showLoading(false))
      );
  }

  loadEntityList(): Observable<ApiPaginatedResponseApiFacility> {
    return this.facilityControllerService.listFacilitiesByCompanyUsingGETByMap({ id: this.companyId });
  }

  arrangeFacilities(facilities: ApiFacility[]) {

    const washing = [];
    const hulling = [];
    const drying = [];
    const nonSellable = [];
    const sellable = [];

    for (const item of facilities) {
      if (item.facilityType.code === 'WASHING_STATION') {
        if (item.isCollectionFacility) {
          this.collection.push(item);
        }
        else {
          washing.push(item);
        }
      } else if (item.facilityType.code === 'HULLING_STATION') {
        hulling.push(item);
      } else if (item.facilityType.code === 'DRYING_BED') {
        drying.push(item);
      } else if (item.facilityType.code === 'STORAGE') {
        if (item.isPublic) { sellable.push(item); }
        else { nonSellable.push(item); }
      }
    }

    this.collection.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    washing.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    hulling.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    drying.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    nonSellable.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    sellable.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    this.other = [...washing, ...hulling, ...drying, ...nonSellable];
    this.storage = [...sellable];
  }

}
