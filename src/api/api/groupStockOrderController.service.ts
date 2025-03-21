/*
 * Copyright(c) 2009 - 2019 Abelium d.o.o.
 * Kajuhova 90, 1000 Ljubljana, Slovenia
 * All rights reserved
 * Copyright(c) 1995 - 2018 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, 01129 Dresden
 * All rights reserved.
 *
 * INATrace Services API
 * INATrace Services API OpenAPI documentation
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the openapi-typescript-angular-generator.
 * https://github.com/alenabelium/openapi-typescript-angular-generator
 * Do not edit the class manually.
 */

/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';

import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';
import { catchError }                                        from 'rxjs/operators';

import { ApiPaginatedResponseApiGroupStockOrder } from '../model/apiPaginatedResponseApiGroupStockOrder';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

/**
 * Namespace for getGroupedStockOrderList.
 */
export namespace GetGroupedStockOrderList {
    /**
     * Parameter map for getGroupedStockOrderList.
     */
    export interface PartialParamMap {
      /**
       * Facility ID
       */
      facilityId: number;
      /**
       * Only count, only fetch, or return both values (if null)
       */
      requestType?: 'COUNT' | 'FETCH';
      /**
       * Number of records to return. Min: 1, default: 100
       */
      limit?: number;
      /**
       * Number of records to skip before returning. Default: 0, min: 0
       */
      offset?: number;
      /**
       * Column name to be sorted by, varies for each endpoint, default is id
       */
      sortBy?: string;
      /**
       * Direction of sorting (ASC or DESC). Default DESC.
       */
      sort?: 'ASC' | 'DESC';
      /**
       * Available orders only
       */
      availableOnly?: boolean;
      /**
       * Is purchase orders only
       */
      isPurchaseOrderOnly?: boolean;
      /**
       * Semi-product ID
       */
      semiProductId?: number;
      language?: 'EN' | 'DE' | 'RW' | 'ES';
    }

    /**
     * Enumeration of all parameters for getGroupedStockOrderList.
     */
    export enum Parameters {
      /**
       * Facility ID
       */
      facilityId = 'facilityId',
      /**
       * Only count, only fetch, or return both values (if null)
       */
      requestType = 'requestType',
      /**
       * Number of records to return. Min: 1, default: 100
       */
      limit = 'limit',
      /**
       * Number of records to skip before returning. Default: 0, min: 0
       */
      offset = 'offset',
      /**
       * Column name to be sorted by, varies for each endpoint, default is id
       */
      sortBy = 'sortBy',
      /**
       * Direction of sorting (ASC or DESC). Default DESC.
       */
      sort = 'sort',
      /**
       * Available orders only
       */
      availableOnly = 'availableOnly',
      /**
       * Is purchase orders only
       */
      isPurchaseOrderOnly = 'isPurchaseOrderOnly',
      /**
       * Semi-product ID
       */
      semiProductId = 'semiProductId',
      language = 'language'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of getGroupedStockOrderList
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetGroupedStockOrderList.PartialParamMap]?: [string, ValidatorFn][]} = {
      facilityId: [
              ['required', Validators.required],
      ],
      requestType: [
      ],
      limit: [
              ['min', Validators.min(1)],
      ],
      offset: [
              ['min', Validators.min(0)],
      ],
      sortBy: [
      ],
      sort: [
      ],
      availableOnly: [
      ],
      isPurchaseOrderOnly: [
      ],
      semiProductId: [
      ],
      language: [
      ],
    };
}



@Injectable({
  providedIn: 'root'
})
export class GroupStockOrderControllerService {

    protected basePath = 'http://localhost:8080';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {

        if (configuration) {
            this.configuration = configuration;
            this.configuration.basePath = configuration.basePath != null ? configuration.basePath : (basePath != null ? basePath : this.basePath);
        } else {
            this.configuration.basePath = basePath != null ? basePath : this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }



  /**
   * Get a paginated list of grouped stock orders. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getGroupedStockOrderListByMap(
    map: GetGroupedStockOrderList.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiPaginatedResponseApiGroupStockOrder>;
  public getGroupedStockOrderListByMap(
    map: GetGroupedStockOrderList.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiPaginatedResponseApiGroupStockOrder>>;
  public getGroupedStockOrderListByMap(
    map: GetGroupedStockOrderList.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiPaginatedResponseApiGroupStockOrder>>;
  public getGroupedStockOrderListByMap(
    map: GetGroupedStockOrderList.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getGroupedStockOrderList(
      map.facilityId,
      map.requestType,
      map.limit,
      map.offset,
      map.sortBy,
      map.sort,
      map.availableOnly,
      map.isPurchaseOrderOnly,
      map.semiProductId,
      map.language,
      observe,
      reportProgress
    );
  }


    /**
     * Get a paginated list of grouped stock orders.
     * 
     * @param facilityId Facility ID
     * @param requestType Only count, only fetch, or return both values (if null)
     * @param limit Number of records to return. Min: 1, default: 100
     * @param offset Number of records to skip before returning. Default: 0, min: 0
     * @param sortBy Column name to be sorted by, varies for each endpoint, default is id
     * @param sort Direction of sorting (ASC or DESC). Default DESC.
     * @param availableOnly Available orders only
     * @param isPurchaseOrderOnly Is purchase orders only
     * @param semiProductId Semi-product ID
     * @param language 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getGroupedStockOrderList(facilityId: number, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', availableOnly?: boolean, isPurchaseOrderOnly?: boolean, semiProductId?: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiPaginatedResponseApiGroupStockOrder>;
    public getGroupedStockOrderList(facilityId: number, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', availableOnly?: boolean, isPurchaseOrderOnly?: boolean, semiProductId?: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiPaginatedResponseApiGroupStockOrder>>;
    public getGroupedStockOrderList(facilityId: number, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', availableOnly?: boolean, isPurchaseOrderOnly?: boolean, semiProductId?: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiPaginatedResponseApiGroupStockOrder>>;
    public getGroupedStockOrderList(facilityId: number, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', availableOnly?: boolean, isPurchaseOrderOnly?: boolean, semiProductId?: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (facilityId === null || facilityId === undefined) {
            throw new Error('Required parameter facilityId was null or undefined when calling getGroupedStockOrderList.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (requestType !== undefined && requestType !== null) {
            queryParameters = queryParameters.set('requestType', <any>requestType);
        }
        if (limit !== undefined && limit !== null) {
            queryParameters = queryParameters.set('limit', <any>limit);
        }
        if (offset !== undefined && offset !== null) {
            queryParameters = queryParameters.set('offset', <any>offset);
        }
        if (sortBy !== undefined && sortBy !== null) {
            queryParameters = queryParameters.set('sortBy', <any>sortBy);
        }
        if (sort !== undefined && sort !== null) {
            queryParameters = queryParameters.set('sort', <any>sort);
        }
        if (availableOnly !== undefined && availableOnly !== null) {
            queryParameters = queryParameters.set('availableOnly', <any>availableOnly);
        }
        if (isPurchaseOrderOnly !== undefined && isPurchaseOrderOnly !== null) {
            queryParameters = queryParameters.set('isPurchaseOrderOnly', <any>isPurchaseOrderOnly);
        }
        if (semiProductId !== undefined && semiProductId !== null) {
            queryParameters = queryParameters.set('semiProductId', <any>semiProductId);
        }

        let headers = this.defaultHeaders;
        if (language !== undefined && language !== null) {
            headers = headers.set('language', String(language));
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

            if (additionalHeaders) {
                for(let pair of additionalHeaders) {
                    headers = headers.set(pair[0], pair[1]);
                }
            }

        const handle = this.httpClient.get<ApiPaginatedResponseApiGroupStockOrder>(`${this.configuration.basePath}/api/chain/group-stock-order/list/facility/${encodeURIComponent(String(facilityId))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getGroupedStockOrderList')));
        }
        return handle;
    }

}
