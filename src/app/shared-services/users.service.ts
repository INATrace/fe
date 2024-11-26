import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { AdminListUsers, UserControllerService } from 'src/api/api/userController.service';
import { ApiPaginatedResponseApiUserBase } from 'src/api/model/apiPaginatedResponseApiUserBase';
import { ApiUserBase } from 'src/api/model/apiUserBase';
import { AuthService } from '../core/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends GeneralSifrantService<ApiUserBase> {

    requestParams = {
        statuses: null,
        requestType: 'FETCH',
        limit: 1000,
        offset: 0,
    } as AdminListUsers.PartialParamMap;

    constructor(
        private userController: UserControllerService,
        private authService: AuthService
    ) {
        super();
    }

    public identifier(el: ApiUserBase) {
        return el.id;
    }

    public textRepresentation(el: ApiUserBase) {
        return `${el.name} ${el.surname} (${el.email})`;
    }

    public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiUserBase>> {

        const limit = params && params.limit ? params.limit : this.limit();
        if (!key || key.length < 1) {
            return new BehaviorSubject<PagedSearchResults<ApiUserBase>>({
                results: [],
                offset: 0,
                limit,
                totalCount: 0
            });
        }

        const reqPars = {
            ...this.requestParams,
            query: key
        };

        return this.authService.userProfile$.pipe(
          take(1),
          switchMap(up => {
              if (up?.role === 'REGIONAL_ADMIN') {
                  return this.userController.regionalAdminListUsersByMap(reqPars);
              } else {
                  return this.userController.adminListUsersByMap(reqPars);
              }
          }),
          map((resp: ApiPaginatedResponseApiUserBase) => {
              return {
                  results: resp.data.items,
                  offset: 0,
                  limit,
                  totalCount: resp.data.count
              };
          })
        );
    }

    public placeholder(): string {
        return $localize`:@@userService.input.placehoder:Search ...`;
    }

}
