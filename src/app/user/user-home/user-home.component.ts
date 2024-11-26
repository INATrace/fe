import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { GlobalEventManagerService } from '../../core/global-event-manager.service';
import { ProductControllerService } from '../../../api/api/productController.service';
import { ApiPaginatedResponseApiProductListResponse } from '../../../api/model/apiPaginatedResponseApiProductListResponse';
import { SelectedUserCompanyService } from '../../core/selected-user-company.service';
import { ApiCompanyGet } from '../../../api/model/apiCompanyGet';
import StatusEnum = ApiPaginatedResponseApiProductListResponse.StatusEnum;
import CompanyRolesEnum = ApiCompanyGet.CompanyRolesEnum;

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit, OnDestroy {

  sub: Subscription;

  private paging$ = new BehaviorSubject(1);
  page = 0;
  pageSize = 10;

  myProductsCount = 0;

  products$ = combineLatest([
    this.paging$
  ]).pipe(
    map(([page]) => {
      return {
        offset: (page - 1) * this.pageSize,
        limit: this.pageSize
      };
    }),
    tap(() => this.globalEventManager.showLoading(true)),
    switchMap(reqParams => this.productControllerService.listProductsByMap(reqParams)),
    map((response: ApiPaginatedResponseApiProductListResponse) => {
      if (response && response.status === StatusEnum.OK) {
        this.myProductsCount = response.data.count;
        return response.data;
      }
    }),
    tap(() => this.globalEventManager.showLoading(false))
  );

  showCollectorsNavButton = false;
  showMyCustomersNavButton = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private globalEventManager: GlobalEventManagerService,
    private productControllerService: ProductControllerService,
    private selUserCompanyService: SelectedUserCompanyService
  ) { }

  ngOnInit(): void {

    this.sub = this.selUserCompanyService.selectedCompanyProfile$.subscribe(company => {
      this.showCollectorsNavButton = company?.supportsCollectors;
      company?.companyRoles?.forEach(cr => {
        if (cr === CompanyRolesEnum.BUYER) {
          this.showMyCustomersNavButton = true;
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onPageChange(event) {
    this.paging$.next(event);
  }

  showPagination() {
    return (this.myProductsCount >= this.pageSize) || this.page > 1;
  }

}
