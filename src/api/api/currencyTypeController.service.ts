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

import { ApiDefaultResponse } from '../model/apiDefaultResponse';
import { ApiPaginatedResponseApiCurrencyType } from '../model/apiPaginatedResponseApiCurrencyType';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

/**
 * Namespace for disableCurrency.
 */
export namespace DisableCurrency {
    /**
     * Parameter map for disableCurrency.
     */
    export interface PartialParamMap {
      id: number;
    }

    /**
     * Enumeration of all parameters for disableCurrency.
     */
    export enum Parameters {
      id = 'id'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of disableCurrency
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof DisableCurrency.PartialParamMap]?: [string, ValidatorFn][]} = {
      id: [
              ['required', Validators.required],
      ],
    };
}

/**
 * Namespace for enableCurrency.
 */
export namespace EnableCurrency {
    /**
     * Parameter map for enableCurrency.
     */
    export interface PartialParamMap {
      id: number;
    }

    /**
     * Enumeration of all parameters for enableCurrency.
     */
    export enum Parameters {
      id = 'id'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of enableCurrency
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof EnableCurrency.PartialParamMap]?: [string, ValidatorFn][]} = {
      id: [
              ['required', Validators.required],
      ],
    };
}

/**
 * Namespace for getCurrencyTypes.
 */
export namespace GetCurrencyTypes {
    /**
     * Parameter map for getCurrencyTypes.
     */
    export interface PartialParamMap {
      query?: string;
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
    }

    /**
     * Enumeration of all parameters for getCurrencyTypes.
     */
    export enum Parameters {
      query = 'query',
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
      sort = 'sort'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of getCurrencyTypes
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetCurrencyTypes.PartialParamMap]?: [string, ValidatorFn][]} = {
      query: [
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
    };
}

/**
 * Namespace for getDisabledCurrencyTypes.
 */
export namespace GetDisabledCurrencyTypes {
    /**
     * Parameter map for getDisabledCurrencyTypes.
     */
    export interface PartialParamMap {
      query?: string;
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
    }

    /**
     * Enumeration of all parameters for getDisabledCurrencyTypes.
     */
    export enum Parameters {
      query = 'query',
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
      sort = 'sort'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of getDisabledCurrencyTypes
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetDisabledCurrencyTypes.PartialParamMap]?: [string, ValidatorFn][]} = {
      query: [
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
    };
}

/**
 * Namespace for getEnabledCurrencyTypes.
 */
export namespace GetEnabledCurrencyTypes {
    /**
     * Parameter map for getEnabledCurrencyTypes.
     */
    export interface PartialParamMap {
      query?: string;
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
    }

    /**
     * Enumeration of all parameters for getEnabledCurrencyTypes.
     */
    export enum Parameters {
      query = 'query',
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
      sort = 'sort'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of getEnabledCurrencyTypes
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetEnabledCurrencyTypes.PartialParamMap]?: [string, ValidatorFn][]} = {
      query: [
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
    };
}



@Injectable({
  providedIn: 'root'
})
export class CurrencyTypeControllerService {

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
   * Disable currency with the specified ID by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public disableCurrencyByMap(
    map: DisableCurrency.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiDefaultResponse>;
  public disableCurrencyByMap(
    map: DisableCurrency.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiDefaultResponse>>;
  public disableCurrencyByMap(
    map: DisableCurrency.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiDefaultResponse>>;
  public disableCurrencyByMap(
    map: DisableCurrency.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.disableCurrency(
      map.id,
      observe,
      reportProgress
    );
  }


    /**
     * Disable currency with the specified ID
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public disableCurrency(id: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiDefaultResponse>;
    public disableCurrency(id: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiDefaultResponse>>;
    public disableCurrency(id: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiDefaultResponse>>;
    public disableCurrency(id: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling disableCurrency.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
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

        const handle = this.httpClient.put<ApiDefaultResponse>(`${this.configuration.basePath}/api/chain/currency-type/${encodeURIComponent(String(id))}/disable`,
            null,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'disableCurrency')));
        }
        return handle;
    }


  /**
   * Enable currency with the specified ID by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public enableCurrencyByMap(
    map: EnableCurrency.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiDefaultResponse>;
  public enableCurrencyByMap(
    map: EnableCurrency.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiDefaultResponse>>;
  public enableCurrencyByMap(
    map: EnableCurrency.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiDefaultResponse>>;
  public enableCurrencyByMap(
    map: EnableCurrency.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.enableCurrency(
      map.id,
      observe,
      reportProgress
    );
  }


    /**
     * Enable currency with the specified ID
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public enableCurrency(id: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiDefaultResponse>;
    public enableCurrency(id: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiDefaultResponse>>;
    public enableCurrency(id: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiDefaultResponse>>;
    public enableCurrency(id: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling enableCurrency.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
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

        const handle = this.httpClient.put<ApiDefaultResponse>(`${this.configuration.basePath}/api/chain/currency-type/${encodeURIComponent(String(id))}/enable`,
            null,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'enableCurrency')));
        }
        return handle;
    }


  /**
   * Get list of enabled and disables supported currencies by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getCurrencyTypesByMap(
    map: GetCurrencyTypes.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiPaginatedResponseApiCurrencyType>;
  public getCurrencyTypesByMap(
    map: GetCurrencyTypes.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiPaginatedResponseApiCurrencyType>>;
  public getCurrencyTypesByMap(
    map: GetCurrencyTypes.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiPaginatedResponseApiCurrencyType>>;
  public getCurrencyTypesByMap(
    map: GetCurrencyTypes.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getCurrencyTypes(
      map.query,
      map.requestType,
      map.limit,
      map.offset,
      map.sortBy,
      map.sort,
      observe,
      reportProgress
    );
  }


    /**
     * Get list of enabled and disables supported currencies
     * 
     * @param query 
     * @param requestType Only count, only fetch, or return both values (if null)
     * @param limit Number of records to return. Min: 1, default: 100
     * @param offset Number of records to skip before returning. Default: 0, min: 0
     * @param sortBy Column name to be sorted by, varies for each endpoint, default is id
     * @param sort Direction of sorting (ASC or DESC). Default DESC.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCurrencyTypes(query?: string, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiPaginatedResponseApiCurrencyType>;
    public getCurrencyTypes(query?: string, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiPaginatedResponseApiCurrencyType>>;
    public getCurrencyTypes(query?: string, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiPaginatedResponseApiCurrencyType>>;
    public getCurrencyTypes(query?: string, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (query !== undefined && query !== null) {
            queryParameters = queryParameters.set('query', <any>query);
        }
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

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
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

        const handle = this.httpClient.get<ApiPaginatedResponseApiCurrencyType>(`${this.configuration.basePath}/api/chain/currency-type/list`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getCurrencyTypes')));
        }
        return handle;
    }


  /**
   * Get list of disabled supported currencies by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getDisabledCurrencyTypesByMap(
    map: GetDisabledCurrencyTypes.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiPaginatedResponseApiCurrencyType>;
  public getDisabledCurrencyTypesByMap(
    map: GetDisabledCurrencyTypes.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiPaginatedResponseApiCurrencyType>>;
  public getDisabledCurrencyTypesByMap(
    map: GetDisabledCurrencyTypes.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiPaginatedResponseApiCurrencyType>>;
  public getDisabledCurrencyTypesByMap(
    map: GetDisabledCurrencyTypes.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getDisabledCurrencyTypes(
      map.query,
      map.requestType,
      map.limit,
      map.offset,
      map.sortBy,
      map.sort,
      observe,
      reportProgress
    );
  }


    /**
     * Get list of disabled supported currencies
     * 
     * @param query 
     * @param requestType Only count, only fetch, or return both values (if null)
     * @param limit Number of records to return. Min: 1, default: 100
     * @param offset Number of records to skip before returning. Default: 0, min: 0
     * @param sortBy Column name to be sorted by, varies for each endpoint, default is id
     * @param sort Direction of sorting (ASC or DESC). Default DESC.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getDisabledCurrencyTypes(query?: string, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiPaginatedResponseApiCurrencyType>;
    public getDisabledCurrencyTypes(query?: string, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiPaginatedResponseApiCurrencyType>>;
    public getDisabledCurrencyTypes(query?: string, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiPaginatedResponseApiCurrencyType>>;
    public getDisabledCurrencyTypes(query?: string, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (query !== undefined && query !== null) {
            queryParameters = queryParameters.set('query', <any>query);
        }
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

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
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

        const handle = this.httpClient.get<ApiPaginatedResponseApiCurrencyType>(`${this.configuration.basePath}/api/chain/currency-type/list/disabled`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getDisabledCurrencyTypes')));
        }
        return handle;
    }


  /**
   * Get list of enabled supported currencies by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getEnabledCurrencyTypesByMap(
    map: GetEnabledCurrencyTypes.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiPaginatedResponseApiCurrencyType>;
  public getEnabledCurrencyTypesByMap(
    map: GetEnabledCurrencyTypes.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiPaginatedResponseApiCurrencyType>>;
  public getEnabledCurrencyTypesByMap(
    map: GetEnabledCurrencyTypes.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiPaginatedResponseApiCurrencyType>>;
  public getEnabledCurrencyTypesByMap(
    map: GetEnabledCurrencyTypes.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getEnabledCurrencyTypes(
      map.query,
      map.requestType,
      map.limit,
      map.offset,
      map.sortBy,
      map.sort,
      observe,
      reportProgress
    );
  }


    /**
     * Get list of enabled supported currencies
     * 
     * @param query 
     * @param requestType Only count, only fetch, or return both values (if null)
     * @param limit Number of records to return. Min: 1, default: 100
     * @param offset Number of records to skip before returning. Default: 0, min: 0
     * @param sortBy Column name to be sorted by, varies for each endpoint, default is id
     * @param sort Direction of sorting (ASC or DESC). Default DESC.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getEnabledCurrencyTypes(query?: string, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiPaginatedResponseApiCurrencyType>;
    public getEnabledCurrencyTypes(query?: string, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiPaginatedResponseApiCurrencyType>>;
    public getEnabledCurrencyTypes(query?: string, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiPaginatedResponseApiCurrencyType>>;
    public getEnabledCurrencyTypes(query?: string, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (query !== undefined && query !== null) {
            queryParameters = queryParameters.set('query', <any>query);
        }
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

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
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

        const handle = this.httpClient.get<ApiPaginatedResponseApiCurrencyType>(`${this.configuration.basePath}/api/chain/currency-type/list/enabled`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getEnabledCurrencyTypes')));
        }
        return handle;
    }

}
