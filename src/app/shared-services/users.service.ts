import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedSearchResults } from 'src/interfaces/CodebookHelperService';
import { GeneralSifrantService } from './general-sifrant.service';
import { UserControllerService, AdminListUsersUsingGET } from 'src/api/api/userController.service';
import { ApiPaginatedResponseApiUserBase } from 'src/api/model/apiPaginatedResponseApiUserBase';
import { ApiUserBase } from 'src/api/model/apiUserBase';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends GeneralSifrantService<ApiUserBase> {

    constructor(
        private userController: UserControllerService,
    ) {
        super();
    }

    public identifier(el: ApiUserBase) {
        return el.id;
    }

    public textRepresentation(el: ApiUserBase) {
        return `${el.name} ${el.surname} (${el.email})`
    }

    requestParams = {
        statuses: null,
        requestType: 'FETCH',
        limit: 1000,
        offset: 0,
        // sortBy: 'SURNAME',
        // sort: 'ASC',
        // queryString: null,
        // status: 'ACTIVE'
    } as AdminListUsersUsingGET.PartialParamMap

    public makeQuery(key: string, params?: any): Observable<PagedSearchResults<ApiUserBase>> {
        let limit = params && params.limit ? params.limit : this.limit()
        // let offset = params && params.offset ? params.offset : 0
        if (!key || key.length < 1) return new BehaviorSubject<PagedSearchResults<ApiUserBase>>({
            results: [],
            offset: 0,
            limit: limit,
            totalCount: 0
        })

        let reqPars = {
            ...this.requestParams,
            query: key
        }
        let tmp = this.userController.adminListUsersUsingGETByMap(reqPars).pipe(
            map((res: ApiPaginatedResponseApiUserBase) => {
                return {
                    results: res.data.items,
                    offset: 0,
                    limit: limit,
                    totalCount: res.data.count
                }
            })
        )
        return tmp;
    }

    public placeholder(): string {
        let placeholder = $localize`:@@userService.input.placehoder:Search ...`
        return placeholder
    }

}

