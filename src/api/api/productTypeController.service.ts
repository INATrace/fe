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
import { ApiPaginatedResponseApiProductType } from '../model/apiPaginatedResponseApiProductType';
import { ApiProductType } from '../model/apiProductType';
import { ApiResponseApiProductType } from '../model/apiResponseApiProductType';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

/**
 * Namespace for createProductTypeUsingPOST.
 */
export namespace CreateProductTypeUsingPOST {
    /**
     * Parameter map for createProductTypeUsingPOST.
     */
    export interface PartialParamMap {
      /**
       * apiProductType
       */
      ApiProductType: ApiProductType;
    }

    /**
     * Enumeration of all parameters for createProductTypeUsingPOST.
     */
    export enum Parameters {
      /**
       * apiProductType
       */
      ApiProductType = 'ApiProductType'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of createProductTypeUsingPOST
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof CreateProductTypeUsingPOST.PartialParamMap]?: [string, ValidatorFn][]} = {
    };
}

/**
 * Namespace for deleteProductTypeUsingDELETE.
 */
export namespace DeleteProductTypeUsingDELETE {
    /**
     * Parameter map for deleteProductTypeUsingDELETE.
     */
    export interface PartialParamMap {
      /**
       * id
       */
      id: number;
    }

    /**
     * Enumeration of all parameters for deleteProductTypeUsingDELETE.
     */
    export enum Parameters {
      /**
       * id
       */
      id = 'id'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of deleteProductTypeUsingDELETE
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof DeleteProductTypeUsingDELETE.PartialParamMap]?: [string, ValidatorFn][]} = {
      id: [
              ['required', Validators.required],
      ],
    };
}

/**
 * Namespace for getProductTypeUsingGET.
 */
export namespace GetProductTypeUsingGET {
    /**
     * Parameter map for getProductTypeUsingGET.
     */
    export interface PartialParamMap {
      /**
       * id
       */
      id: number;
    }

    /**
     * Enumeration of all parameters for getProductTypeUsingGET.
     */
    export enum Parameters {
      /**
       * id
       */
      id = 'id'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of getProductTypeUsingGET
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetProductTypeUsingGET.PartialParamMap]?: [string, ValidatorFn][]} = {
      id: [
              ['required', Validators.required],
      ],
    };
}

/**
 * Namespace for getProductTypesForCompanyUsingGET.
 */
export namespace GetProductTypesForCompanyUsingGET {
    /**
     * Parameter map for getProductTypesForCompanyUsingGET.
     */
    export interface PartialParamMap {
      /**
       * Company ID
       */
      companyId: number;
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
     * Enumeration of all parameters for getProductTypesForCompanyUsingGET.
     */
    export enum Parameters {
      /**
       * Company ID
       */
      companyId = 'companyId',
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
     * A map of tuples with error name and `ValidatorFn` for each parameter of getProductTypesForCompanyUsingGET
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetProductTypesForCompanyUsingGET.PartialParamMap]?: [string, ValidatorFn][]} = {
      companyId: [
              ['required', Validators.required],
      ],
      requestType: [
      ],
      limit: [
      ],
      offset: [
      ],
      sortBy: [
      ],
      sort: [
      ],
    };
}

/**
 * Namespace for getProductTypesUsingGET.
 */
export namespace GetProductTypesUsingGET {
    /**
     * Parameter map for getProductTypesUsingGET.
     */
    export interface PartialParamMap {
    }

    /**
     * Enumeration of all parameters for getProductTypesUsingGET.
     */
    export enum Parameters {
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of getProductTypesUsingGET
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetProductTypesUsingGET.PartialParamMap]?: [string, ValidatorFn][]} = {
    };
}

/**
 * Namespace for updateProductTypeUsingPUT.
 */
export namespace UpdateProductTypeUsingPUT {
    /**
     * Parameter map for updateProductTypeUsingPUT.
     */
    export interface PartialParamMap {
      /**
       * apiProductType
       */
      ApiProductType: ApiProductType;
    }

    /**
     * Enumeration of all parameters for updateProductTypeUsingPUT.
     */
    export enum Parameters {
      /**
       * apiProductType
       */
      ApiProductType = 'ApiProductType'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of updateProductTypeUsingPUT
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof UpdateProductTypeUsingPUT.PartialParamMap]?: [string, ValidatorFn][]} = {
    };
}



@Injectable({
  providedIn: 'root'
})
export class ProductTypeControllerService {

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
   * createProductType by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public createProductTypeUsingPOSTByMap(
    map: CreateProductTypeUsingPOST.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiProductType>;
  public createProductTypeUsingPOSTByMap(
    map: CreateProductTypeUsingPOST.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiProductType>>;
  public createProductTypeUsingPOSTByMap(
    map: CreateProductTypeUsingPOST.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiProductType>>;
  public createProductTypeUsingPOSTByMap(
    map: CreateProductTypeUsingPOST.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.createProductTypeUsingPOST(
      map.ApiProductType,
      observe,
      reportProgress
    );
  }


    /**
     * createProductType
     * 
     * @param ApiProductType apiProductType
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createProductTypeUsingPOST(ApiProductType: ApiProductType, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiProductType>;
    public createProductTypeUsingPOST(ApiProductType: ApiProductType, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiProductType>>;
    public createProductTypeUsingPOST(ApiProductType: ApiProductType, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiProductType>>;
    public createProductTypeUsingPOST(ApiProductType: ApiProductType, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (ApiProductType === null || ApiProductType === undefined) {
            throw new Error('Required parameter ApiProductType was null or undefined when calling createProductTypeUsingPOST.');
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

        const handle = this.httpClient.post<ApiResponseApiProductType>(`${this.configuration.basePath}/api/product-type`,
            ApiProductType,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'createProductTypeUsingPOST')));
        }
        return handle;
    }


  /**
   * deleteProductType by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public deleteProductTypeUsingDELETEByMap(
    map: DeleteProductTypeUsingDELETE.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiDefaultResponse>;
  public deleteProductTypeUsingDELETEByMap(
    map: DeleteProductTypeUsingDELETE.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiDefaultResponse>>;
  public deleteProductTypeUsingDELETEByMap(
    map: DeleteProductTypeUsingDELETE.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiDefaultResponse>>;
  public deleteProductTypeUsingDELETEByMap(
    map: DeleteProductTypeUsingDELETE.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.deleteProductTypeUsingDELETE(
      map.id,
      observe,
      reportProgress
    );
  }


    /**
     * deleteProductType
     * 
     * @param id id
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteProductTypeUsingDELETE(id: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiDefaultResponse>;
    public deleteProductTypeUsingDELETE(id: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiDefaultResponse>>;
    public deleteProductTypeUsingDELETE(id: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiDefaultResponse>>;
    public deleteProductTypeUsingDELETE(id: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling deleteProductTypeUsingDELETE.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (id !== undefined && id !== null) {
            queryParameters = queryParameters.set('id', <any>id);
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

        const handle = this.httpClient.delete<ApiDefaultResponse>(`${this.configuration.basePath}/api/product-type/${encodeURIComponent(String(id))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'deleteProductTypeUsingDELETE')));
        }
        return handle;
    }


  /**
   * getProductType by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getProductTypeUsingGETByMap(
    map: GetProductTypeUsingGET.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiProductType>;
  public getProductTypeUsingGETByMap(
    map: GetProductTypeUsingGET.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiProductType>>;
  public getProductTypeUsingGETByMap(
    map: GetProductTypeUsingGET.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiProductType>>;
  public getProductTypeUsingGETByMap(
    map: GetProductTypeUsingGET.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getProductTypeUsingGET(
      map.id,
      observe,
      reportProgress
    );
  }


    /**
     * getProductType
     * 
     * @param id id
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getProductTypeUsingGET(id: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiProductType>;
    public getProductTypeUsingGET(id: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiProductType>>;
    public getProductTypeUsingGET(id: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiProductType>>;
    public getProductTypeUsingGET(id: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getProductTypeUsingGET.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (id !== undefined && id !== null) {
            queryParameters = queryParameters.set('id', <any>id);
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

        const handle = this.httpClient.get<ApiResponseApiProductType>(`${this.configuration.basePath}/api/product-type/${encodeURIComponent(String(id))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getProductTypeUsingGET')));
        }
        return handle;
    }


  /**
   * Get a list of product types that the company with the provided id has acccess to by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getProductTypesForCompanyUsingGETByMap(
    map: GetProductTypesForCompanyUsingGET.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiPaginatedResponseApiProductType>;
  public getProductTypesForCompanyUsingGETByMap(
    map: GetProductTypesForCompanyUsingGET.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiPaginatedResponseApiProductType>>;
  public getProductTypesForCompanyUsingGETByMap(
    map: GetProductTypesForCompanyUsingGET.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiPaginatedResponseApiProductType>>;
  public getProductTypesForCompanyUsingGETByMap(
    map: GetProductTypesForCompanyUsingGET.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getProductTypesForCompanyUsingGET(
      map.companyId,
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
     * Get a list of product types that the company with the provided id has acccess to
     * 
     * @param companyId Company ID
     * @param requestType Only count, only fetch, or return both values (if null)
     * @param limit Number of records to return. Min: 1, default: 100
     * @param offset Number of records to skip before returning. Default: 0, min: 0
     * @param sortBy Column name to be sorted by, varies for each endpoint, default is id
     * @param sort Direction of sorting (ASC or DESC). Default DESC.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getProductTypesForCompanyUsingGET(companyId: number, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiPaginatedResponseApiProductType>;
    public getProductTypesForCompanyUsingGET(companyId: number, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiPaginatedResponseApiProductType>>;
    public getProductTypesForCompanyUsingGET(companyId: number, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiPaginatedResponseApiProductType>>;
    public getProductTypesForCompanyUsingGET(companyId: number, requestType?: 'COUNT' | 'FETCH', limit?: number, offset?: number, sortBy?: string, sort?: 'ASC' | 'DESC', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (companyId === null || companyId === undefined) {
            throw new Error('Required parameter companyId was null or undefined when calling getProductTypesForCompanyUsingGET.');
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

        const handle = this.httpClient.get<ApiPaginatedResponseApiProductType>(`${this.configuration.basePath}/api/product-type/company/${encodeURIComponent(String(companyId))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getProductTypesForCompanyUsingGET')));
        }
        return handle;
    }


  /**
   * getProductTypes by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getProductTypesUsingGETByMap(
    map: GetProductTypesUsingGET.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiPaginatedResponseApiProductType>;
  public getProductTypesUsingGETByMap(
    map: GetProductTypesUsingGET.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiPaginatedResponseApiProductType>>;
  public getProductTypesUsingGETByMap(
    map: GetProductTypesUsingGET.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiPaginatedResponseApiProductType>>;
  public getProductTypesUsingGETByMap(
    map: GetProductTypesUsingGET.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getProductTypesUsingGET(
      observe,
      reportProgress
    );
  }


    /**
     * getProductTypes
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getProductTypesUsingGET(observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiPaginatedResponseApiProductType>;
    public getProductTypesUsingGET(observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiPaginatedResponseApiProductType>>;
    public getProductTypesUsingGET(observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiPaginatedResponseApiProductType>>;
    public getProductTypesUsingGET(observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {

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

        const handle = this.httpClient.get<ApiPaginatedResponseApiProductType>(`${this.configuration.basePath}/api/product-type`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getProductTypesUsingGET')));
        }
        return handle;
    }


  /**
   * updateProductType by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public updateProductTypeUsingPUTByMap(
    map: UpdateProductTypeUsingPUT.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiProductType>;
  public updateProductTypeUsingPUTByMap(
    map: UpdateProductTypeUsingPUT.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiProductType>>;
  public updateProductTypeUsingPUTByMap(
    map: UpdateProductTypeUsingPUT.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiProductType>>;
  public updateProductTypeUsingPUTByMap(
    map: UpdateProductTypeUsingPUT.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.updateProductTypeUsingPUT(
      map.ApiProductType,
      observe,
      reportProgress
    );
  }


    /**
     * updateProductType
     * 
     * @param ApiProductType apiProductType
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateProductTypeUsingPUT(ApiProductType: ApiProductType, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiProductType>;
    public updateProductTypeUsingPUT(ApiProductType: ApiProductType, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiProductType>>;
    public updateProductTypeUsingPUT(ApiProductType: ApiProductType, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiProductType>>;
    public updateProductTypeUsingPUT(ApiProductType: ApiProductType, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (ApiProductType === null || ApiProductType === undefined) {
            throw new Error('Required parameter ApiProductType was null or undefined when calling updateProductTypeUsingPUT.');
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

        const handle = this.httpClient.put<ApiResponseApiProductType>(`${this.configuration.basePath}/api/product-type`,
            ApiProductType,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'updateProductTypeUsingPUT')));
        }
        return handle;
    }

}
