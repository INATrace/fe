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
import { ApiMeasureUnitType } from '../model/apiMeasureUnitType';
import { ApiPaginatedResponseApiMeasureUnitType } from '../model/apiPaginatedResponseApiMeasureUnitType';
import { ApiResponseApiBaseEntity } from '../model/apiResponseApiBaseEntity';
import { ApiResponseApiMeasureUnitType } from '../model/apiResponseApiMeasureUnitType';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

/**
 * Namespace for createOrUpdateMeasurementUnitType.
 */
export namespace CreateOrUpdateMeasurementUnitType {
    /**
     * Parameter map for createOrUpdateMeasurementUnitType.
     */
    export interface PartialParamMap {
      ApiMeasureUnitType: ApiMeasureUnitType;
    }

    /**
     * Enumeration of all parameters for createOrUpdateMeasurementUnitType.
     */
    export enum Parameters {
      ApiMeasureUnitType = 'ApiMeasureUnitType'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of createOrUpdateMeasurementUnitType
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof CreateOrUpdateMeasurementUnitType.PartialParamMap]?: [string, ValidatorFn][]} = {
    };
}

/**
 * Namespace for deleteMeasurementUnitType.
 */
export namespace DeleteMeasurementUnitType {
    /**
     * Parameter map for deleteMeasurementUnitType.
     */
    export interface PartialParamMap {
      /**
       * Measurement unit type ID
       */
      id: number;
    }

    /**
     * Enumeration of all parameters for deleteMeasurementUnitType.
     */
    export enum Parameters {
      /**
       * Measurement unit type ID
       */
      id = 'id'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of deleteMeasurementUnitType
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof DeleteMeasurementUnitType.PartialParamMap]?: [string, ValidatorFn][]} = {
      id: [
              ['required', Validators.required],
      ],
    };
}

/**
 * Namespace for getMeasureUnitTypeList.
 */
export namespace GetMeasureUnitTypeList {
    /**
     * Parameter map for getMeasureUnitTypeList.
     */
    export interface PartialParamMap {
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
     * Enumeration of all parameters for getMeasureUnitTypeList.
     */
    export enum Parameters {
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
     * A map of tuples with error name and `ValidatorFn` for each parameter of getMeasureUnitTypeList
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetMeasureUnitTypeList.PartialParamMap]?: [string, ValidatorFn][]} = {
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
 * Namespace for getMeasurementUnitType.
 */
export namespace GetMeasurementUnitType {
    /**
     * Parameter map for getMeasurementUnitType.
     */
    export interface PartialParamMap {
      /**
       * Measurement unit type ID
       */
      id: number;
    }

    /**
     * Enumeration of all parameters for getMeasurementUnitType.
     */
    export enum Parameters {
      /**
       * Measurement unit type ID
       */
      id = 'id'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of getMeasurementUnitType
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetMeasurementUnitType.PartialParamMap]?: [string, ValidatorFn][]} = {
      id: [
              ['required', Validators.required],
      ],
    };
}



@Injectable({
  providedIn: 'root'
})
export class MeasureUnitTypeControllerService {

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
   * Create or update measurement unit type. If ID is provided, the entity with the provided ID is updated. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public createOrUpdateMeasurementUnitTypeByMap(
    map: CreateOrUpdateMeasurementUnitType.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiBaseEntity>;
  public createOrUpdateMeasurementUnitTypeByMap(
    map: CreateOrUpdateMeasurementUnitType.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiBaseEntity>>;
  public createOrUpdateMeasurementUnitTypeByMap(
    map: CreateOrUpdateMeasurementUnitType.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiBaseEntity>>;
  public createOrUpdateMeasurementUnitTypeByMap(
    map: CreateOrUpdateMeasurementUnitType.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.createOrUpdateMeasurementUnitType(
      map.ApiMeasureUnitType,
      observe,
      reportProgress
    );
  }


    /**
     * Create or update measurement unit type. If ID is provided, the entity with the provided ID is updated.
     * 
     * @param ApiMeasureUnitType 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createOrUpdateMeasurementUnitType(ApiMeasureUnitType: ApiMeasureUnitType, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiBaseEntity>;
    public createOrUpdateMeasurementUnitType(ApiMeasureUnitType: ApiMeasureUnitType, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiBaseEntity>>;
    public createOrUpdateMeasurementUnitType(ApiMeasureUnitType: ApiMeasureUnitType, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiBaseEntity>>;
    public createOrUpdateMeasurementUnitType(ApiMeasureUnitType: ApiMeasureUnitType, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (ApiMeasureUnitType === null || ApiMeasureUnitType === undefined) {
            throw new Error('Required parameter ApiMeasureUnitType was null or undefined when calling createOrUpdateMeasurementUnitType.');
        }

        let headers = this.defaultHeaders;

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
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

            if (additionalHeaders) {
                for(let pair of additionalHeaders) {
                    headers = headers.set(pair[0], pair[1]);
                }
            }

        const handle = this.httpClient.put<ApiResponseApiBaseEntity>(`${this.configuration.basePath}/api/chain/measure-unit-type`,
            ApiMeasureUnitType,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'createOrUpdateMeasurementUnitType')));
        }
        return handle;
    }


  /**
   * Deletes a measurement with the provided ID. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public deleteMeasurementUnitTypeByMap(
    map: DeleteMeasurementUnitType.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiDefaultResponse>;
  public deleteMeasurementUnitTypeByMap(
    map: DeleteMeasurementUnitType.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiDefaultResponse>>;
  public deleteMeasurementUnitTypeByMap(
    map: DeleteMeasurementUnitType.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiDefaultResponse>>;
  public deleteMeasurementUnitTypeByMap(
    map: DeleteMeasurementUnitType.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.deleteMeasurementUnitType(
      map.id,
      observe,
      reportProgress
    );
  }


    /**
     * Deletes a measurement with the provided ID.
     * 
     * @param id Measurement unit type ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteMeasurementUnitType(id: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiDefaultResponse>;
    public deleteMeasurementUnitType(id: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiDefaultResponse>>;
    public deleteMeasurementUnitType(id: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiDefaultResponse>>;
    public deleteMeasurementUnitType(id: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling deleteMeasurementUnitType.');
        }

        let headers = this.defaultHeaders;

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

        const handle = this.httpClient.delete<ApiDefaultResponse>(`${this.configuration.basePath}/api/chain/measure-unit-type/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'deleteMeasurementUnitType')));
        }
        return handle;
    }


  /**
   * Get a paginated list of measurement types. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getMeasureUnitTypeListByMap(
    map: GetMeasureUnitTypeList.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiPaginatedResponseApiMeasureUnitType>;
  public getMeasureUnitTypeListByMap(
    map: GetMeasureUnitTypeList.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiPaginatedResponseApiMeasureUnitType>>;
  public getMeasureUnitTypeListByMap(
    map: GetMeasureUnitTypeList.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiPaginatedResponseApiMeasureUnitType>>;
  public getMeasureUnitTypeListByMap(
    map: GetMeasureUnitTypeList.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getMeasureUnitTypeList(
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
     * Get a paginated list of measurement types.
     * 
     * @param requestType Only count, only fetch, or return both values (if null)
     * @param limit Number of records to return. Min: 1, default: 100
     * @param offset Number of records to skip before returning. Default: 0, min: 0
     * @param sortBy Column name to be sorted by, varies for each endpoint, default is id
     * @param sort Direction of sorting (ASC or DESC). Default DESC.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getMeasureUnitTypeList(requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiPaginatedResponseApiMeasureUnitType>;
    public getMeasureUnitTypeList(requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiPaginatedResponseApiMeasureUnitType>>;
    public getMeasureUnitTypeList(requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiPaginatedResponseApiMeasureUnitType>>;
    public getMeasureUnitTypeList(requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {

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

        let headers = this.defaultHeaders;

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

        const handle = this.httpClient.get<ApiPaginatedResponseApiMeasureUnitType>(`${this.configuration.basePath}/api/chain/measure-unit-type/list`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getMeasureUnitTypeList')));
        }
        return handle;
    }


  /**
   * Get a single measurement unit type with the provided ID. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getMeasurementUnitTypeByMap(
    map: GetMeasurementUnitType.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiMeasureUnitType>;
  public getMeasurementUnitTypeByMap(
    map: GetMeasurementUnitType.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiMeasureUnitType>>;
  public getMeasurementUnitTypeByMap(
    map: GetMeasurementUnitType.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiMeasureUnitType>>;
  public getMeasurementUnitTypeByMap(
    map: GetMeasurementUnitType.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getMeasurementUnitType(
      map.id,
      observe,
      reportProgress
    );
  }


    /**
     * Get a single measurement unit type with the provided ID.
     * 
     * @param id Measurement unit type ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getMeasurementUnitType(id: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiMeasureUnitType>;
    public getMeasurementUnitType(id: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiMeasureUnitType>>;
    public getMeasurementUnitType(id: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiMeasureUnitType>>;
    public getMeasurementUnitType(id: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getMeasurementUnitType.');
        }

        let headers = this.defaultHeaders;

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

        const handle = this.httpClient.get<ApiResponseApiMeasureUnitType>(`${this.configuration.basePath}/api/chain/measure-unit-type/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getMeasurementUnitType')));
        }
        return handle;
    }

}
