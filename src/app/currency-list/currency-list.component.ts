import { Component, OnInit } from '@angular/core';
import { CurrencyTypeControllerService } from '../../api/api/currencyTypeController.service';
import { ApiCurrencyType } from '../../api/model/apiCurrencyType';
import { first, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { SortKeyAndOrder, SortOption, SortOrder } from '../shared/result-sorter/result-sorter-types';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalEventManagerService } from '../system/global-event-manager.service';
import { FormControl } from '@angular/forms';
import { ApiPaginatedResponseApiCurrencyType } from '../../api/model/apiPaginatedResponseApiCurrencyType';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.scss']
})
export class CurrencyListComponent implements OnInit {

  public enabledCurrencies: ApiCurrencyType[];
  public disabledCurrencies: ApiCurrencyType[];

  public displayedCurrencies = 0;
  public allCurrencies = 0;

  public ping$ = new BehaviorSubject(null);

  public enabledCurrencyType$;
  public enabledSortingParam$ = new BehaviorSubject<{ sortBy: string; sort: SortOrder; }>({ sortBy: 'code', sort: 'ASC' });
  public enabledSearch$ = new BehaviorSubject<string>(null);
  public enabledPagination$ = new BehaviorSubject(1);
  public enabledPage = 1;

  public disabledCurrencyType$;
  public disabledSortingParam$ = new BehaviorSubject<{ sortBy: string; sort: SortOrder; }>({ sortBy: 'code', sort: 'ASC' });
  public disabledSearch$ = new BehaviorSubject<string>(null);
  public disabledPagination$ = new BehaviorSubject(1);
  public disabledPage = 1;

  public pageSize = 10;

  sortOptions: SortOption[] = [
    {
      key: 'code',
      name: $localize`:@@valueChainList.sortOptions.name.name:Name`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'label',
      name: $localize`:@@valueChainList.sortOptions.description.name:Description`
    },
    {
      key: 'actions',
      name: $localize`:@@valueChainList.sortOptions.actions.name:Actions`,
      inactive: true
    }
  ];

  public enabledSearchText = new FormControl(null);
  public disabledSearchText = new FormControl(null);

  constructor(
      private router: Router,
      private currencyService: CurrencyTypeControllerService,
      private globalEventsManager: GlobalEventManagerService
  ) { }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  loadCurrencies() {
    this.enabledCurrencyType$ = combineLatest([this.enabledSortingParam$, this.enabledSearch$, this.enabledPagination$, this.ping$],
        (sorting, search, page) => {
      return {
        query: search,
        ...sorting,
        offset: this.pageSize * (page - 1),
        limit: this.pageSize
      };
    }).pipe(
      tap(_ => this.globalEventsManager.showLoading(true)),
      switchMap(params => {
        return this.currencyService.getEnabledCurrencyTypesUsingGETByMap(params);
      }),
      map((resp: ApiPaginatedResponseApiCurrencyType) => {
        if (resp) {
          return resp.data;
        }
      }),
      tap(_ => this.globalEventsManager.showLoading(false)),
      shareReplay(1)
    );

    this.disabledCurrencyType$ = combineLatest([this.disabledSortingParam$, this.disabledSearch$, this.disabledPagination$, this.ping$],
        (sorting, search, page) => {
      return {
        query: search,
        ...sorting,
        offset: this.pageSize * (page - 1),
        limit: this.pageSize
      };
    }).pipe(
        tap(_ => this.globalEventsManager.showLoading(true)),
        switchMap(params => {
          return this.currencyService.getDisabledCurrencyTypesUsingGETByMap(params);
        }),
        map((resp: ApiPaginatedResponseApiCurrencyType) => {
          if (resp) {
            return resp.data;
          }
        }),
        tap(_ => this.globalEventsManager.showLoading(false)),
        shareReplay(1)
    );
  }

  onSortChangeEnabled(event: SortKeyAndOrder) {
    this.enabledSortingParam$.next({
      sortBy: event.key,
      sort: event.sortOrder
    });
  }

  onSortChangeDisabled(event: SortKeyAndOrder) {
    this.disabledSortingParam$.next({
      sortBy: event.key,
      sort: event.sortOrder
    });
  }

  enableCurrency(id) {
    this.currencyService.enableCurrencyUsingPUT(id).pipe(first()).subscribe(res => {
      this.ping$.next(null);
    });
  }

  disableCurrency(id) {
    this.currencyService.disableCurrencyUsingPUT(id).pipe(first()).subscribe(res => {
      this.ping$.next(null);
    });
  }

  searchEnabledInput(event) {
    this.enabledSearch$.next(event);
  }

  searchDisabledInput(event) {
    this.disabledSearch$.next(event);
  }

  enabledPageChange(event) {
    this.enabledPagination$.next(event);
  }

  disabledPageChange(event) {
    this.disabledPagination$.next(event);
  }

}
