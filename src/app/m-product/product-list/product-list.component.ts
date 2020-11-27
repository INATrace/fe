import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { debounceTime, map, shareReplay, startWith, switchMap, tap, take } from 'rxjs/operators';
import { ProductControllerService } from 'src/api/api/productController.service';
import { ApiPaginatedResponseApiProductListResponse } from 'src/api/model/apiPaginatedResponseApiProductListResponse';
import { faTimes, faFilter } from '@fortawesome/free-solid-svg-icons';
import { CompanySelectModalComponent } from 'src/app/company-list/company-select-modal/company-select-modal.component';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { AuthService } from 'src/app/system/auth.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  faTimes = faTimes;
  faFilter = faFilter;

  searchName = new FormControl(null);
  searchStatus = new FormControl("");
  searchRole = new FormControl("");
  myProducts = new FormControl(true)
  reloadPing$ = new BehaviorSubject<boolean>(false)
  pagingParams$ = new BehaviorSubject({})
  sortingParams$ = new BehaviorSubject({ sortBy: 'name', sort: 'ASC' })
  paging$ = new BehaviorSubject<number>(1);

  page: number = 0;
  pageSize = 10;

  allProducts: number = 0;
  showedProducts: number = 0;

  constructor(
    private productController: ProductControllerService,
    protected globalEventsManager: GlobalEventManagerService,
    private modalService: NgbModalImproved,
    private router: Router,
    private authService: AuthService
  ) { }

  routerSub: Subscription;

  ngOnInit(): void {

    this.routerSub = this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd && event.url === '/product-labels') {
        this.reloadPage()
      }
    })
    this.setAllProducts();

  }

  async setAllProducts() {
    if (this.isAdmin) {
      let res = await this.productController.listProductsAdminUsingGET('COUNT').pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data && res.data.count >= 0) {
        this.allProducts = res.data.count;
      }
    } else {
      let res = await this.productController.listProductsUsingGET('COUNT').pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data && res.data.count >= 0) {
        this.allProducts = res.data.count;
      }
    }
  }


  ngOnDestroy() {
    if(this.routerSub) this.routerSub.unsubscribe();
  }

  searchParams$ = combineLatest(
    this.searchName.valueChanges.pipe(
      startWith(null),
      debounceTime(200)
    ),
    this.searchStatus.valueChanges.pipe(
      startWith(null)
    ),
    this.myProducts.valueChanges.pipe(
      startWith(true),
    ),
    (name: string, status: string, myProducts: boolean) => {
      return { name, status, myProducts }
    }
  )

  get isAdmin() {
    return this.authService.currentUserProfile && this.authService.currentUserProfile.role === 'ADMIN'
  }

  products$ = combineLatest(this.reloadPing$, this.paging$, this.searchParams$, this.sortingParams$,
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
        let myProducts = params.myProducts
        let newParams = {...params}
        delete newParams['myProducts']
        if(myProducts) {
          return this.productController.listProductsUsingGETByMap(params)
        } else {
          return this.productController.listProductsAdminUsingGETByMap(params)
        }
      }),
      map((resp: ApiPaginatedResponseApiProductListResponse) => {
        if (resp) {
          if (resp.data && resp.data.count && (this.pageSize - resp.data.count > 0)) this.showedProducts = resp.data.count;
          else {
            let temp = resp.data.count - (this.pageSize * (this.page - 1));
            this.showedProducts = temp >= this.pageSize ? this.pageSize : temp;
          }

          return resp.data
        }
      }),
      tap(val => this.globalEventsManager.showLoading(false)),
      shareReplay(1)
    )



  get statusList() {
    let obj = {}
    obj[""] = $localize`:@@productList.statusList.all:All`
    obj['ACTIVE'] = $localize`:@@productList.statusList.active:Active`
    obj['DISABLED'] = $localize`:@@productList.statusList.disabled:Disabled`
    return obj;
  }
  codebookStatus = EnumSifrant.fromObject(this.statusList)

  reloadPage() {
    this.reloadPing$.next(true)
  }

  onPageChange(event) {
    this.paging$.next(event);
  }

  async createProductForCompany() {
    const modalRef = this.modalService.open(CompanySelectModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      title: $localize`:@@productList.createProductForCompany.title:Product Company`,
      instructionsHtml: $localize`:@@productList.createProductForCompany.instructionsHtml:Select a company for your product:`
    })
    let company = await modalRef.result;
    if (company) {
      this.router.navigate(['product-labels', 'new', company.id])
    }
  }

  showStatus(status: string) {
    this.searchStatus.setValue(status);
  }

  myProductsOnly(my: boolean) {
    this.myProducts.setValue(my);
  }

  clearValue(form: FormControl, myProducts: boolean = false) {
    if (myProducts) form.setValue(false);
    else form.setValue("");
  }

  showPagination() {
    if (((this.showedProducts - this.pageSize) == 0 && this.allProducts >= this.pageSize) || this.page > 1) return true;
    else return false
  }

}
