import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { SortOption, SortOrder } from '../../../shared/result-sorter/result-sorter-types';
import { GlobalEventManagerService } from '../../../core/global-event-manager.service';
import { CompanyControllerService, GetCompanyCustomersListUsingGET } from '../../../../api/api/companyController.service';
import { Router } from '@angular/router';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-company-customers-list',
  templateUrl: './company-customers-list.component.html',
  styleUrls: ['./company-customers-list.component.scss']
})
export class CompanyCustomersListComponent implements OnInit {

  organizationId;
  page = 1;
  pageSize = 10;

  showing;
  customerCount;

  searchNameCustomers = new FormControl('');
  byCategory = 'BY_NAME';

  customer$;
  sorting$ = new BehaviorSubject<{ key: string, sortOrder: SortOrder }>({ key: 'BY_NAME', sortOrder: 'ASC'});
  query$ = new BehaviorSubject('');
  pagination$ = new BehaviorSubject(1);
  search$ = new BehaviorSubject('BY_NAME');
  ping$ = new BehaviorSubject(null);

  items = [
    { name: $localize`:@@productLabelStakeholders.search.name:name`,
      category: 'BY_NAME'
    }
  ];

  sortOptions = [
    {
      key: 'name',
      name: $localize`:@@productLabelStakeholdersCustomers.sortOptions.companyName.name:Company name`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'contact',
      name: $localize`:@@productLabelStakeholdersCustomers.sortOptions.contact.name:Contact`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'email',
      name: $localize`:@@productLabelStakeholdersCustomers.sortOptions.email.name:E-mail`,
    },
    {
      key: 'actions',
      name: $localize`:@@productLabelStakeholdersCustomers.sortOptions.actions.name:Actions`,
      inactive: true
    }
  ];

  constructor(
      private globalEventsManager: GlobalEventManagerService,
      private companyController: CompanyControllerService,
      private router: Router
  ) { }

  ngOnInit(): void {
    this.organizationId = localStorage.getItem('selectedUserCompany');

    this.loadCustomers();
  }

  async loadCustomers() {
    this.customer$ = combineLatest([this.sorting$, this.query$, this.search$, this.pagination$, this.ping$])
        .pipe(
            map(([sort, queryString, search, page, ping]) => {
              const params: GetCompanyCustomersListUsingGET.PartialParamMap = {
                companyId: this.organizationId,
                sort: sort.sortOrder,
                sortBy: sort.key,
                offset: (page - 1) * this.pageSize,
                limit: this.pageSize,
                query: queryString
              };
              return params;
            }),
            tap(() => this.globalEventsManager.showLoading(true)),
            switchMap(params => this.companyController.getCompanyCustomersListUsingGETByMap(params)),
            map(response => {
              if (response) {
                this.customerCount = response.data.count;
                this.showing = this.customerCount >= this.pageSize ? Math.min(this.page * this.pageSize, this.customerCount) : this.customerCount;
                return response.data;
              }
            }),
            tap(() => this.globalEventsManager.showLoading(false)),
            shareReplay(1)
        );
  }

  addCustomer() {
    this.router.navigate(['my-customers', 'add']);
  }

  editCustomer(id) {
    this.router.navigate(['my-customers', 'edit', id]);
  }

  async deleteCustomer(id) {
    const result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelStakeholdersCustomers.deleteCustomer.error.message:Are you sure you want to delete the customer?`,
      options: {
        centered: true
      }
    });
    if (result !== 'ok') {
      return;
    }
    const res = await this.companyController.deleteCompanyCustomerUsingDELETE(id).pipe(take(1)).toPromise();
    if (res && res.status === 'OK') {
      this.ping$.next(null);
    }
  }

  changeSort(event) {
    let newKey = '';
    switch (event.key) {
      case 'id':
        newKey = 'BY_ID';
        break;
      case 'name':
        newKey = 'BY_NAME';
        break;
      case 'surname':
        newKey = 'BY_SURNAME';
        break;
    }
    event.key = newKey;
    this.sorting$.next(event);
  }

  showLocation(key, location) {
    if (location && location.address) {
      switch (key) {
        case 'cell':
          return location.address.cell ? location.address.cell : '-';
        case 'village':
          return location.address.village ? location.address.village : '-';
      }
    }
  }

  showPagination() {
    return this.customerCount && this.customerCount > this.pageSize;
  }

  onPageChange(event) {
    this.pagination$.next(event);
  }

  onSearchInput(event) {
    this.query$.next(event);
  }

  onCategoryChange(event) {
    this.search$.next(event);
  }

}
