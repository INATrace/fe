/*
 * Copyright(c) 2009 - 2019 Abelium d.o.o.
 * Kajuhova 90, 1000 Ljubljana, Slovenia
 * All rights reserved
 * Copyright(c) 1995 - 2018 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, 01129 Dresden
 * All rights reserved.
 *
 * INATrace Services API
 * Abelium INATrace Services API swagger documentation
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
import { ApiProcessingOrder } from '../model/apiProcessingOrder';
import { ApiResponseApiBaseEntity } from '../model/apiResponseApiBaseEntity';
import { ApiResponseApiProcessingOrder } from '../model/apiResponseApiProcessingOrder';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

/**
 * Namespace for createOrUpdateProcessingOrderUsingPUT.
 */
export namespace CreateOrUpdateProcessingOrderUsingPUT {
    /**
     * Parameter map for createOrUpdateProcessingOrderUsingPUT.
     */
    export interface PartialParamMap {
      /**
       * apiProcessingOrder
       */
      ApiProcessingOrder: ApiProcessingOrder;
      /**
       * language
       */
      language?: 'EN' | 'DE' | 'RW' | 'ES';
    }

    /**
     * Enumeration of all parameters for createOrUpdateProcessingOrderUsingPUT.
     */
    export enum Parameters {
      /**
       * apiProcessingOrder
       */
      ApiProcessingOrder = 'ApiProcessingOrder',
      /**
       * language
       */
      language = 'language'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of createOrUpdateProcessingOrderUsingPUT
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof CreateOrUpdateProcessingOrderUsingPUT.PartialParamMap]?: [string, ValidatorFn][]} = {
      language: [
      ],
    };
}

/**
 * Namespace for deleteProcessingOrderUsingDELETE.
 */
export namespace DeleteProcessingOrderUsingDELETE {
    /**
     * Parameter map for deleteProcessingOrderUsingDELETE.
     */
    export interface PartialParamMap {
      /**
       * ProcessingOrder ID
       */
      id: number;
    }

    /**
     * Enumeration of all parameters for deleteProcessingOrderUsingDELETE.
     */
    export enum Parameters {
      /**
       * ProcessingOrder ID
       */
      id = 'id'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of deleteProcessingOrderUsingDELETE
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof DeleteProcessingOrderUsingDELETE.PartialParamMap]?: [string, ValidatorFn][]} = {
      id: [
              ['required', Validators.required],
      ],
    };
}

/**
 * Namespace for getProcessingOrderUsingGET.
 */
export namespace GetProcessingOrderUsingGET {
    /**
     * Parameter map for getProcessingOrderUsingGET.
     */
    export interface PartialParamMap {
      /**
       * ProcessingOrder ID
       */
      id: number;
      /**
       * language
       */
      language?: 'EN' | 'DE' | 'RW' | 'ES';
    }

    /**
     * Enumeration of all parameters for getProcessingOrderUsingGET.
     */
    export enum Parameters {
      /**
       * ProcessingOrder ID
       */
      id = 'id',
      /**
       * language
       */
      language = 'language'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of getProcessingOrderUsingGET
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetProcessingOrderUsingGET.PartialParamMap]?: [string, ValidatorFn][]} = {
      id: [
              ['required', Validators.required],
      ],
      language: [
      ],
    };
}



@Injectable({
  providedIn: 'root'
})
export class ProcessingOrderControllerService {

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
   * Create or update processing order. If the ID is provided, then the entity with the provided ID is updated. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public createOrUpdateProcessingOrderUsingPUTByMap(
    map: CreateOrUpdateProcessingOrderUsingPUT.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiBaseEntity>;
  public createOrUpdateProcessingOrderUsingPUTByMap(
    map: CreateOrUpdateProcessingOrderUsingPUT.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiBaseEntity>>;
  public createOrUpdateProcessingOrderUsingPUTByMap(
    map: CreateOrUpdateProcessingOrderUsingPUT.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiBaseEntity>>;
  public createOrUpdateProcessingOrderUsingPUTByMap(
    map: CreateOrUpdateProcessingOrderUsingPUT.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.createOrUpdateProcessingOrderUsingPUT(
      map.ApiProcessingOrder,
      map.language,
      observe,
      reportProgress
    );
  }


    /**
     * Create or update processing order. If the ID is provided, then the entity with the provided ID is updated.
     * 
     * @param ApiProcessingOrder apiProcessingOrder
     * @param language language
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createOrUpdateProcessingOrderUsingPUT(ApiProcessingOrder: ApiProcessingOrder, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiBaseEntity>;
    public createOrUpdateProcessingOrderUsingPUT(ApiProcessingOrder: ApiProcessingOrder, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiBaseEntity>>;
    public createOrUpdateProcessingOrderUsingPUT(ApiProcessingOrder: ApiProcessingOrder, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiBaseEntity>>;
    public createOrUpdateProcessingOrderUsingPUT(ApiProcessingOrder: ApiProcessingOrder, language?: 'EN' | 'DE' | 'RW' | 'ES', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (ApiProcessingOrder === null || ApiProcessingOrder === undefined) {
            throw new Error('Required parameter ApiProcessingOrder was null or undefined when calling createOrUpdateProcessingOrderUsingPUT.');
        }

        let headers = this.defaultHeaders;
        if (language !== undefined && language !== null) {
            headers = headers.set('language', String(language));
        }

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

        const handle = this.httpClient.put<ApiResponseApiBaseEntity>(`${this.configuration.basePath}/api/chain/processing-order`,
            ApiProcessingOrder,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'createOrUpdateProcessingOrderUsingPUT')));
        }
        return handle;
    }


  /**
   * Deletes a processing order with the provided ID. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public deleteProcessingOrderUsingDELETEByMap(
    map: DeleteProcessingOrderUsingDELETE.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiDefaultResponse>;
  public deleteProcessingOrderUsingDELETEByMap(
    map: DeleteProcessingOrderUsingDELETE.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiDefaultResponse>>;
  public deleteProcessingOrderUsingDELETEByMap(
    map: DeleteProcessingOrderUsingDELETE.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiDefaultResponse>>;
  public deleteProcessingOrderUsingDELETEByMap(
    map: DeleteProcessingOrderUsingDELETE.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.deleteProcessingOrderUsingDELETE(
      map.id,
      observe,
      reportProgress
    );
  }


    /**
     * Deletes a processing order with the provided ID.
     * 
     * @param id ProcessingOrder ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteProcessingOrderUsingDELETE(id: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiDefaultResponse>;
    public deleteProcessingOrderUsingDELETE(id: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiDefaultResponse>>;
    public deleteProcessingOrderUsingDELETE(id: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiDefaultResponse>>;
    public deleteProcessingOrderUsingDELETE(id: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling deleteProcessingOrderUsingDELETE.');
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

        const handle = this.httpClient.delete<ApiDefaultResponse>(`${this.configuration.basePath}/api/chain/processing-order/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'deleteProcessingOrderUsingDELETE')));
        }
        return handle;
    }


  /**
   * Get a single processing order with the provided ID. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getProcessingOrderUsingGETByMap(
    map: GetProcessingOrderUsingGET.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiProcessingOrder>;
  public getProcessingOrderUsingGETByMap(
    map: GetProcessingOrderUsingGET.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiProcessingOrder>>;
  public getProcessingOrderUsingGETByMap(
    map: GetProcessingOrderUsingGET.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiProcessingOrder>>;
  public getProcessingOrderUsingGETByMap(
    map: GetProcessingOrderUsingGET.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getProcessingOrderUsingGET(
      map.id,
      map.language,
      observe,
      reportProgress
    );
  }


    /**
     * Get a single processing order with the provided ID.
     * 
     * @param id ProcessingOrder ID
     * @param language language
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getProcessingOrderUsingGET(id: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiProcessingOrder>;
    public getProcessingOrderUsingGET(id: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiProcessingOrder>>;
    public getProcessingOrderUsingGET(id: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiProcessingOrder>>;
    public getProcessingOrderUsingGET(id: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getProcessingOrderUsingGET.');
        }

        let headers = this.defaultHeaders;
        if (language !== undefined && language !== null) {
            headers = headers.set('language', String(language));
        }

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

        const handle = this.httpClient.get<ApiResponseApiProcessingOrder>(`${this.configuration.basePath}/api/chain/processing-order/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getProcessingOrderUsingGET')));
        }
        return handle;
    }

}
