import { Component, OnInit } from '@angular/core';
import { CurrencyTypeControllerService } from '../../api/api/currencyTypeController.service';
import { ApiCurrencyType } from '../../api/model/apiCurrencyType';
import { first } from 'rxjs/operators';
import { SortKeyAndOrder, SortOption, SortOrder } from '../shared/result-sorter/result-sorter-types';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

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

  private sortingParams$ = new BehaviorSubject<{ sortBy: string; sort: SortOrder }>({ sortBy: 'code', sort: 'ASC' });
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

  constructor(
      private router: Router,
      private currencyService: CurrencyTypeControllerService
  ) { }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  loadCurrencies() {
    this.currencyService.getCurrencyTypesUsingGET().pipe(first()).subscribe(res => {
      this.enabledCurrencies = res.filter(value => value.enabled);
      this.disabledCurrencies = res.filter(value => !value.enabled);
      this.allCurrencies = res.length;
    });
  }

  onSortChange(event: SortKeyAndOrder) {
    this.sortingParams$.next({ sortBy: event.key, sort: event.sortOrder });
  }

  enableCurrency(id) {
    this.currencyService.enableCurrencyUsingPUT(id).pipe(first()).subscribe(res => {
      this.loadCurrencies();
    });
  }

  disableCurrency(id) {
    this.currencyService.disableCurrencyUsingPUT(id).pipe(first()).subscribe(res => {
      this.loadCurrencies();
    });
  }

}
