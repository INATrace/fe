import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { debounceTime, map, shareReplay, startWith, switchMap, take, tap, filter } from 'rxjs/operators';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { ApiPaginatedResponseApiCompanyListResponse } from 'src/api/model/apiPaginatedResponseApiCompanyListResponse';
import { EnumSifrant } from '../shared-services/enum-sifrant';
import { AuthService } from '../system/auth.service';
import { GlobalEventManagerService } from '../system/global-event-manager.service';
import { NgbModalImproved } from '../system/ngb-modal-improved/ngb-modal-improved.service';
import { CompanySelectModalComponent } from './company-select-modal/company-select-modal.component';
import { faTimes, faFilter } from '@fortawesome/free-solid-svg-icons';
import { ChainFileInfo } from 'src/api-chain/model/chainFileInfo';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { dbKey } from 'src/shared/utils';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

  faTimes = faTimes;
  faFilter = faFilter;


  companies = [];
  _listErrorStatus$: BehaviorSubject<string>;

  searchName = new FormControl(null)
  searchStatus = new FormControl("")
  myCompanies = new FormControl(true)

  reloadPing$ = new BehaviorSubject<boolean>(false)
  pagingParams$ = new BehaviorSubject({})
  sortingParams$ = new BehaviorSubject({ sortBy: 'name', sort: 'ASC' })
  paging$ = new BehaviorSubject<number>(1);

  page: number = 0;
  pageSize = 10;

  allCompanies: number = 0;
  showedCompanies: number = 0;

  showSearch: boolean = false;

  reloadPage() {
    this.reloadPing$.next(true)
  }

  onPageChange(event) {
    this.paging$.next(event);
  }

  constructor(
    private companyController: CompanyControllerService,
    private router: Router,
    private route: ActivatedRoute,
    protected globalEventsManager: GlobalEventManagerService,
    private authService: AuthService,
    private modalService: NgbModalImproved,
    private chainOrganizationService: OrganizationService
  ) { }

  searchParams$ = combineLatest(
    this.searchName.valueChanges.pipe(
      startWith(null),
      debounceTime(200)
    ),
    this.searchStatus.valueChanges.pipe(
      startWith(null)
    ),
    this.myCompanies.valueChanges.pipe(
      startWith(true),
    ),
    (name: string, status: string, myCompanies: boolean) => {
      return { name, status, myCompanies }
    }
  )

  get isAdmin() {
    return this.authService.currentUserProfile && this.authService.currentUserProfile.role === 'ADMIN'
  }

  routerSub: Subscription
  ngOnInit(): void {
    this._listErrorStatus$ = new BehaviorSubject<string>("");
    //do not allow access via breadcrumbs - temp fix
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/companies') {
        this.reloadPage()
      }
    })

    this.setAllCompanies();
    // this.searchParams$.next({})
    // this.listCompanies();
    // this.unsubscribeList.add(
    //   this.searchParamsForm$.subscribe(val => this.searchParams$.next(val))
    // )
  }

  async setAllCompanies() {
    if (this.isAdmin) {
      let res = await this.companyController.listCompaniesAdminUsingGET('COUNT').pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data && res.data.count >= 0) {
        this.allCompanies = res.data.count;
      }
    } else {
      let res = await this.companyController.listCompaniesUsingGET('COUNT').pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data && res.data.count >= 0) {
        this.allCompanies = res.data.count;
      }
    }
  }



  // 'REGISTERED' | 'ACTIVE' | 'DEACTIVATED';

  get statusList() {
    let obj = {}
    obj[""] = $localize`:@@companyList.statusList.all:All`
    obj['REGISTERED'] = $localize`:@@companyList.statusList.registred:Registred`
    obj['ACTIVE'] = $localize`:@@companyList.statusList.active:Active`
    obj['DEACTIVATED'] = $localize`:@@companyList.statusList.deactivated:Deactivated`
    return obj;
  }

  codebookStatus = EnumSifrant.fromObject(this.statusList)

  companies$ = combineLatest(this.reloadPing$, this.paging$, this.searchParams$, this.sortingParams$,
    (ping: boolean, page: number, search: any, sorting: any) => {
      return {
        ...search,
        ...sorting,
        offset: (page - 1) * this.pageSize,
        limit: this.pageSize
      }
    }).pipe(
      // distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
      tap(val => this.globalEventsManager.showLoading(true)),
      switchMap(params => {
        let myCompanies = params.myCompanies
        let newParams = { ...params }
        delete newParams['myCompanies']
        if (myCompanies) {
          return this.companyController.listCompaniesUsingGETByMap(newParams)
        } else {
          return this.companyController.listCompaniesAdminUsingGETByMap(newParams)
        }
        // .pipe(
        //   catchError(val => of(null))
        // )
      }),
      map((resp: ApiPaginatedResponseApiCompanyListResponse) => {
        if (resp) {
          if (resp.data && resp.data.count && (this.pageSize - resp.data.count > 0)) this.showedCompanies = resp.data.count;
          else {
            let temp = resp.data.count - (this.pageSize * (this.page - 1));
            this.showedCompanies = temp >= this.pageSize ? this.pageSize : temp;
          }
          return resp.data
        }
      }),
      tap(val => this.globalEventsManager.showLoading(false)),
      shareReplay(1)
    )

  createCompany(): void {
    this.router.navigate(['companies/new'])
  }

  async activate(id) {
    try {
      this.globalEventsManager.showLoading(true)
      let res = await this.companyController.executeActionUsingPOST('ACTIVATE_COMPANY', { companyId: id }).pipe(take(1)).toPromise();
      if (res.status == 'OK') this.mapToChain(id)
      else throw Error()
      this.reloadPage()
      this.globalEventsManager.push({
        action: 'success',
        notificationType: 'success',
        title: $localize`:@@companyList.activate.success.title:Activated!`,
        message: $localize`:@@companyList.activate.success.message:Company has been successfully activated`
      })
    } catch (e) {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@companyList.activate.error.title:Error`,
        message: $localize`:@@companyList.activate.error.message:Cannot activate the company`
      })
    } finally {
      this.globalEventsManager.showLoading(false)
    }
  }

  async deactivate(id) {
    try {
      this.globalEventsManager.showLoading(true)
      let res = await this.companyController.executeActionUsingPOST('DEACTIVATE_COMPANY', { companyId: id }).pipe(take(1)).toPromise();
      if (res.status == 'OK') this.mapToChain(id)
      else throw Error()
      this.reloadPage()
      this.globalEventsManager.push({
        action: 'success',
        notificationType: 'success',
        title: $localize`:@@companyList.deactivate.success.title:Deactivated!`,
        message: $localize`:@@companyList.deactivate.success.message:Company has been successfully deactivated`
      })
    } catch (e) {
      this.globalEventsManager.push({
        action: 'error',
        notificationType: 'error',
        title: $localize`:@@companyList.deactivate.error.title:Error`,
        message: $localize`:@@companyList.deactivate.error.message:Cannot deactivate the company`
      })
    } finally {
      this.globalEventsManager.showLoading(false)
    }
  }

  changeSort(event) {
    this.sortingParams$.next({ sortBy: event.key, sort: event.sortOrder })
  }

  async mergeTo(company) {
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@companyList.mergeTo.modal.title:Merge to Company`,
      instructionsHtml: $localize`:@@companyList.mergeTo.modal.instructionsHtml:Merge company ${company.name} to:`
    })
    let otherCompany = await modalRef.result;
    if (otherCompany) {
      let res = await this.companyController.executeActionUsingPOST('MERGE_TO_COMPANY', {
        companyId: company.id,
        otherCompanyId: otherCompany.id
      }).pipe(take(1)).toPromise()
      if (res && res.status == 'OK') {
        this.mapToChain(company.id);
        this.mapToChain(otherCompany.id);
        this.reloadPage();
        this.globalEventsManager.push({
          action: 'success',
          notificationType: 'success',
          title: $localize`:@@companyList.mergeTo.success.title:Merged!`,
          message: $localize`:@@companyList.mergeTo.success.message:Company has been successfully merged to ${otherCompany.name}.`
        })
      }
    }
  }

  sortOptions = [
    {
      key: 'name',
      name: $localize`:@@companyList.sortOptions.name.name:Name`,
      defaultSortOrder: 'ASC'
      // inactive?: boolean;
    },
    {
      key: 'status',
      name: $localize`:@@companyList.sortOptions.status.name:Status`,
      // defaultSortOrder?: SortOrder;
      // inactive?: boolean;
    },
    {
      key: 'actions',
      name: $localize`:@@companyList.sortOptions.actions.name:Actions`,
      // defaultSortOrder?: SortOrder;
      inactive: true
    }
  ]

  ngOnDestroy() {
    if (this.routerSub) this.routerSub.unsubscribe()
  }

  showStatus(status: string) {
    this.searchStatus.setValue(status);
  }

  myCompaniesOnly(my: boolean) {
    this.myCompanies.setValue(my);
  }

  clearValue(form: FormControl, myCompanies: boolean = false) {
    if (myCompanies) form.setValue(false);
    else form.setValue("");
  }

  showPagination() {
    if (((this.showedCompanies - this.pageSize) == 0 && this.allCompanies >= this.pageSize) || this.page > 1) return true;
    else return false
  }


  async mapToChain(companyId: number) {
    let respComp = await this.companyController.getCompanyUsingGET(companyId).pipe(take(1)).toPromise();
    if (respComp && 'OK' === respComp.status && respComp.data) {
      let c = respComp.data;
      let obj = {
        id: c.id,
        name: c.name,
        email: c.email,
        about: c.about,
        phone: c.phone,
        headquarters: c.headquarters,
        logo: c.logo as ChainFileInfo,
        manager: c.manager ? c.manager : "",
        mediaLinks: c.mediaLinks ? c.mediaLinks : {},
        webPage: c.webPage ? c.webPage : "",
        abbreviation: c.abbreviation ? c.abbreviation : "",
        entityType: 'company'
      }
      delete obj.logo['id'];

      let resGetIdRev = await this.chainOrganizationService.getOrganizationByCompanyId(companyId).pipe(take(1)).toPromise();
      if (resGetIdRev && 'OK' === resGetIdRev.status && resGetIdRev.data) {
        obj['_id'] = dbKey(resGetIdRev.data);
        obj['_rev'] = resGetIdRev.data._rev;
      }

      let res = await this.chainOrganizationService.postOrganization(obj).pipe(take(1)).toPromise()

    }
  }

}
