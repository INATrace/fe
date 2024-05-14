import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { SortOption, SortOrder } from '../../../shared/result-sorter/result-sorter-types';
import { GlobalEventManagerService } from '../../../core/global-event-manager.service';
import { CompanyControllerService, GetUserCustomersForCompanyAndTypeUsingGET } from '../../../../api/api/companyController.service';
import { Router } from '@angular/router';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import { SelectedUserCompanyService } from '../../../core/selected-user-company.service';
import { ApiUserGet } from '../../../../api/model/apiUserGet';
import RoleEnum = ApiUserGet.RoleEnum;

@Component({
  selector: 'app-company-farmers-list',
  templateUrl: './company-farmers-list.component.html',
  styleUrls: ['./company-farmers-list.component.scss']
})
export class CompanyFarmersListComponent implements OnInit {

  organizationId;
  page = 1;
  pageSize = 10;

  showing;
  farmerCount;

  searchNameFarmers = new FormControl('');
  byCategory = 'BY_NAME';

  farmer$;
  sorting$ = new BehaviorSubject<{ key: string, sortOrder: SortOrder }>({ key: 'BY_NAME', sortOrder: 'ASC'});
  query$ = new BehaviorSubject('');
  pagination$ = new BehaviorSubject(1);
  search$ = new BehaviorSubject('BY_NAME');
  ping$ = new BehaviorSubject(null);

  showRwanda = false;
  showHonduras = false;

  items = [
    { name: $localize`:@@productLabelStakeholders.search.firstName:First name`,
      category: 'BY_NAME'
    },
    { name: $localize`:@@productLabelStakeholders.search.lastName:Last name`,
      category: 'BY_SURNAME'
    }
  ];

  sortOptions: SortOption[] = [
    {
      key: 'name',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.name.name:First name`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'surname',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.surname.name:Last name`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'gender',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.gender.name:Gender`,
      inactive: true
    },
    {
      key: 'id',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.id.name:Id`,
    },
    {
      key: 'city',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.city.name:City/Town/Village`,
      inactive: true
    },
    {
      key: 'state',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.state.name:State/Province/Region`,
      inactive: true
    },
    {
      key: 'actions',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.actions.name:Actions`,
      inactive: true
    }
  ];

  sortOptionsRwanda: SortOption[] = [
    {
      key: 'name',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.name.name:First name`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'surname',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.surname.name:Last name`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'gender',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.gender.name:Gender`,
      inactive: true
    },
    {
      key: 'id',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.id.name:Id`,
    },
    {
      key: 'village',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.village.name:Village`,
      inactive: true
    },
    {
      key: 'cell',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.cell.name:Cell`,
      inactive: true
    },
    {
      key: 'actions',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.actions.name:Actions`,
      inactive: true
    }
  ];

  sortOptionsHonduras: SortOption[] = [
    {
      key: 'name',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.name.name:First name`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'surname',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.surname.name:Last name`,
      defaultSortOrder: 'ASC'
    },
    {
      key: 'gender',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.gender.name:Gender`,
      inactive: true
    },
    {
      key: 'id',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.id.name:Id`,
    },
    {
      key: 'municipality',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.municipality.name:Municipality`,
      inactive: true
    },
    {
      key: 'village',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.village.name:Village`,
      inactive: true
    },
    {
      key: 'actions',
      name: $localize`:@@productLabelStakeholdersCollectors.sortOptions.actions.name:Actions`,
      inactive: true
    }
  ];

  isSystemOrRegionalAdmin = false;

  constructor(
      private globalEventsManager: GlobalEventManagerService,
      private companyController: CompanyControllerService,
      private router: Router,
      private authService: AuthService,
      private selUserCompanyService: SelectedUserCompanyService
  ) { }

  ngOnInit(): void {

    this.authService.userProfile$.pipe(take(1)).subscribe(up => {
      this.isSystemOrRegionalAdmin = up && (up.role === RoleEnum.SYSTEMADMIN || up.role === RoleEnum.REGIONALADMIN);
    });

    this.selUserCompanyService.selectedCompanyProfile$.pipe(take(1)).subscribe(cp => {
      if (cp) {

        this.organizationId = cp.id;

        this.showRwanda = cp.headquarters &&
            cp.headquarters.country &&
            cp.headquarters.country.code &&
            cp.headquarters.country.code === 'RW';

        this.showHonduras = cp.headquarters &&
          cp.headquarters.country &&
          cp.headquarters.country.code &&
          cp.headquarters.country.code === 'HN';

        this.loadFarmers().then();
      }
    });
  }

  private async loadFarmers() {
    this.farmer$ = combineLatest([this.sorting$, this.query$, this.search$, this.pagination$, this.ping$])
        .pipe(
            map(([sort, queryString, search, page, ping]) => {
              const params: GetUserCustomersForCompanyAndTypeUsingGET.PartialParamMap = {
                companyId: this.organizationId,
                type: 'FARMER',
                sort: sort.sortOrder,
                sortBy: sort.key,
                offset: (page - 1) * this.pageSize,
                limit: this.pageSize,
                query: queryString,
                searchBy: search
              };
              return params;
            }),
            tap(() => this.globalEventsManager.showLoading(true)),
            switchMap(params => this.companyController.getUserCustomersForCompanyAndTypeUsingGETByMap(params)),
            map(response => {
              if (response) {
                this.farmerCount = response.data.count;
                this.showing = this.farmerCount >= this.pageSize ? Math.min(this.page * this.pageSize, this.farmerCount) : this.farmerCount;
                return response.data;
              }
            }),
            tap(() => this.globalEventsManager.showLoading(false)),
            shareReplay(1)
        );
  }

  addFarmer() {
    this.router.navigate(['my-farmers', 'add']).then();
  }

  editFarmer(id) {
    this.router.navigate(['my-farmers', 'edit', id]).then();
  }

  async deleteFarmer(id) {
    const result = await this.globalEventsManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabelStakeholdersCollectors.deleteCollector.error.message:Are you sure you want to delete the collector?`,
      options: {
        centered: true
      }
    });
    if (result !== 'ok') {
      return;
    }
    const res = await this.companyController.deleteUserCustomerUsingDELETE(id).pipe(take(1)).toPromise();
    if (res && res.status === 'OK') {
      this.ping$.next(null);
    }
  }

  importFarmers() {
    this.router.navigate(['my-farmers', 'import']).then();
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

  showPagination() {
    return this.farmerCount && this.farmerCount > this.pageSize;
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
