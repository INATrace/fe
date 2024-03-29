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

import { ApiBeycoOrderFields } from '../model/apiBeycoOrderFields';
import { ApiResponseApiBeycoOrderFields } from '../model/apiResponseApiBeycoOrderFields';
import { ApiResponseApiBeycoTokenResponse } from '../model/apiResponseApiBeycoTokenResponse';
import { ApiResponseObject } from '../model/apiResponseObject';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

/**
 * Namespace for getBeycoOrderFieldsForSelectedStockOrdersUsingGET.
 */
export namespace GetBeycoOrderFieldsForSelectedStockOrdersUsingGET {
    /**
     * Parameter map for getBeycoOrderFieldsForSelectedStockOrdersUsingGET.
     */
    export interface PartialParamMap {
      /**
       * ID's of selected stock orders
       */
      id: Array<number>;
      /**
       * ID of company
       */
      companyId: number;
    }

    /**
     * Enumeration of all parameters for getBeycoOrderFieldsForSelectedStockOrdersUsingGET.
     */
    export enum Parameters {
      /**
       * ID's of selected stock orders
       */
      id = 'id',
      /**
       * ID of company
       */
      companyId = 'companyId'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of getBeycoOrderFieldsForSelectedStockOrdersUsingGET
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetBeycoOrderFieldsForSelectedStockOrdersUsingGET.PartialParamMap]?: [string, ValidatorFn][]} = {
      id: [
              ['required', Validators.required],
      ],
      companyId: [
              ['required', Validators.required],
      ],
    };
}

/**
 * Namespace for getTokenUsingGET.
 */
export namespace GetTokenUsingGET {
    /**
     * Parameter map for getTokenUsingGET.
     */
    export interface PartialParamMap {
      /**
       * Authorization code from Beyco OAuth2
       */
      authCode: string;
      /**
       * ID of company
       */
      companyId: number;
    }

    /**
     * Enumeration of all parameters for getTokenUsingGET.
     */
    export enum Parameters {
      /**
       * Authorization code from Beyco OAuth2
       */
      authCode = 'authCode',
      /**
       * ID of company
       */
      companyId = 'companyId'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of getTokenUsingGET
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetTokenUsingGET.PartialParamMap]?: [string, ValidatorFn][]} = {
      authCode: [
              ['required', Validators.required],
      ],
      companyId: [
              ['required', Validators.required],
      ],
    };
}

/**
 * Namespace for refreshTokenUsingGET.
 */
export namespace RefreshTokenUsingGET {
    /**
     * Parameter map for refreshTokenUsingGET.
     */
    export interface PartialParamMap {
      /**
       * Refresh token
       */
      X_Beyco_Refresh_Token: string;
      /**
       * ID of company
       */
      companyId: number;
    }

    /**
     * Enumeration of all parameters for refreshTokenUsingGET.
     */
    export enum Parameters {
      /**
       * Refresh token
       */
      X_Beyco_Refresh_Token = 'X_Beyco_Refresh_Token',
      /**
       * ID of company
       */
      companyId = 'companyId'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of refreshTokenUsingGET
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof RefreshTokenUsingGET.PartialParamMap]?: [string, ValidatorFn][]} = {
      X_Beyco_Refresh_Token: [
              ['required', Validators.required],
      ],
      companyId: [
              ['required', Validators.required],
      ],
    };
}

/**
 * Namespace for sendBeycoOrderUsingPOST.
 */
export namespace SendBeycoOrderUsingPOST {
    /**
     * Parameter map for sendBeycoOrderUsingPOST.
     */
    export interface PartialParamMap {
      /**
       * JWT token
       */
      X_Beyco_Token: string;
      /**
       * ID of company
       */
      companyId: number;
      /**
       * Beyco offer
       */
      ApiBeycoOrderFields: ApiBeycoOrderFields;
    }

    /**
     * Enumeration of all parameters for sendBeycoOrderUsingPOST.
     */
    export enum Parameters {
      /**
       * JWT token
       */
      X_Beyco_Token = 'X_Beyco_Token',
      /**
       * ID of company
       */
      companyId = 'companyId',
      /**
       * Beyco offer
       */
      ApiBeycoOrderFields = 'ApiBeycoOrderFields'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of sendBeycoOrderUsingPOST
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof SendBeycoOrderUsingPOST.PartialParamMap]?: [string, ValidatorFn][]} = {
      X_Beyco_Token: [
              ['required', Validators.required],
      ],
      companyId: [
              ['required', Validators.required],
      ],
    };
}



@Injectable({
  providedIn: 'root'
})
export class BeycoOrderControllerService {

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
   * Get list of fields necessary for Beyco order for selected Stock Orders by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getBeycoOrderFieldsForSelectedStockOrdersUsingGETByMap(
    map: GetBeycoOrderFieldsForSelectedStockOrdersUsingGET.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiBeycoOrderFields>;
  public getBeycoOrderFieldsForSelectedStockOrdersUsingGETByMap(
    map: GetBeycoOrderFieldsForSelectedStockOrdersUsingGET.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiBeycoOrderFields>>;
  public getBeycoOrderFieldsForSelectedStockOrdersUsingGETByMap(
    map: GetBeycoOrderFieldsForSelectedStockOrdersUsingGET.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiBeycoOrderFields>>;
  public getBeycoOrderFieldsForSelectedStockOrdersUsingGETByMap(
    map: GetBeycoOrderFieldsForSelectedStockOrdersUsingGET.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getBeycoOrderFieldsForSelectedStockOrdersUsingGET(
      map.id,
      map.companyId,
      observe,
      reportProgress
    );
  }


    /**
     * Get list of fields necessary for Beyco order for selected Stock Orders
     * 
     * @param id ID&#39;s of selected stock orders
     * @param companyId ID of company
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getBeycoOrderFieldsForSelectedStockOrdersUsingGET(id: Array<number>, companyId: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiBeycoOrderFields>;
    public getBeycoOrderFieldsForSelectedStockOrdersUsingGET(id: Array<number>, companyId: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiBeycoOrderFields>>;
    public getBeycoOrderFieldsForSelectedStockOrdersUsingGET(id: Array<number>, companyId: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiBeycoOrderFields>>;
    public getBeycoOrderFieldsForSelectedStockOrdersUsingGET(id: Array<number>, companyId: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getBeycoOrderFieldsForSelectedStockOrdersUsingGET.');
        }
        if (companyId === null || companyId === undefined) {
            throw new Error('Required parameter companyId was null or undefined when calling getBeycoOrderFieldsForSelectedStockOrdersUsingGET.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (id) {
            id.forEach((element) => {
                queryParameters = queryParameters.append('id', <any>element);
            })
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

        const handle = this.httpClient.get<ApiResponseApiBeycoOrderFields>(`${this.configuration.basePath}/api/chain/beyco-order/company/${encodeURIComponent(String(companyId))}/fields`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getBeycoOrderFieldsForSelectedStockOrdersUsingGET')));
        }
        return handle;
    }


  /**
   * Get OAuth2 token for Beyco integration by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getTokenUsingGETByMap(
    map: GetTokenUsingGET.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiBeycoTokenResponse>;
  public getTokenUsingGETByMap(
    map: GetTokenUsingGET.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiBeycoTokenResponse>>;
  public getTokenUsingGETByMap(
    map: GetTokenUsingGET.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiBeycoTokenResponse>>;
  public getTokenUsingGETByMap(
    map: GetTokenUsingGET.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getTokenUsingGET(
      map.authCode,
      map.companyId,
      observe,
      reportProgress
    );
  }


    /**
     * Get OAuth2 token for Beyco integration
     * 
     * @param authCode Authorization code from Beyco OAuth2
     * @param companyId ID of company
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getTokenUsingGET(authCode: string, companyId: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiBeycoTokenResponse>;
    public getTokenUsingGET(authCode: string, companyId: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiBeycoTokenResponse>>;
    public getTokenUsingGET(authCode: string, companyId: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiBeycoTokenResponse>>;
    public getTokenUsingGET(authCode: string, companyId: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (authCode === null || authCode === undefined) {
            throw new Error('Required parameter authCode was null or undefined when calling getTokenUsingGET.');
        }
        if (companyId === null || companyId === undefined) {
            throw new Error('Required parameter companyId was null or undefined when calling getTokenUsingGET.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (authCode !== undefined && authCode !== null) {
            queryParameters = queryParameters.set('authCode', <any>authCode);
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

        const handle = this.httpClient.get<ApiResponseApiBeycoTokenResponse>(`${this.configuration.basePath}/api/chain/beyco-order/company/${encodeURIComponent(String(companyId))}/token`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getTokenUsingGET')));
        }
        return handle;
    }


  /**
   * Refresh expired token by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public refreshTokenUsingGETByMap(
    map: RefreshTokenUsingGET.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiBeycoTokenResponse>;
  public refreshTokenUsingGETByMap(
    map: RefreshTokenUsingGET.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiBeycoTokenResponse>>;
  public refreshTokenUsingGETByMap(
    map: RefreshTokenUsingGET.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiBeycoTokenResponse>>;
  public refreshTokenUsingGETByMap(
    map: RefreshTokenUsingGET.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.refreshTokenUsingGET(
      map.X_Beyco_Refresh_Token,
      map.companyId,
      observe,
      reportProgress
    );
  }


    /**
     * Refresh expired token
     * 
     * @param X_Beyco_Refresh_Token Refresh token
     * @param companyId ID of company
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public refreshTokenUsingGET(X_Beyco_Refresh_Token: string, companyId: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiBeycoTokenResponse>;
    public refreshTokenUsingGET(X_Beyco_Refresh_Token: string, companyId: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiBeycoTokenResponse>>;
    public refreshTokenUsingGET(X_Beyco_Refresh_Token: string, companyId: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiBeycoTokenResponse>>;
    public refreshTokenUsingGET(X_Beyco_Refresh_Token: string, companyId: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (X_Beyco_Refresh_Token === null || X_Beyco_Refresh_Token === undefined) {
            throw new Error('Required parameter X_Beyco_Refresh_Token was null or undefined when calling refreshTokenUsingGET.');
        }
        if (companyId === null || companyId === undefined) {
            throw new Error('Required parameter companyId was null or undefined when calling refreshTokenUsingGET.');
        }

        let headers = this.defaultHeaders;
        if (X_Beyco_Refresh_Token !== undefined && X_Beyco_Refresh_Token !== null) {
            headers = headers.set('X-Beyco-Refresh-Token', String(X_Beyco_Refresh_Token));
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

        const handle = this.httpClient.get<ApiResponseApiBeycoTokenResponse>(`${this.configuration.basePath}/api/chain/beyco-order/company/${encodeURIComponent(String(companyId))}/token/refresh`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'refreshTokenUsingGET')));
        }
        return handle;
    }


  /**
   * Send order to Beyco by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public sendBeycoOrderUsingPOSTByMap(
    map: SendBeycoOrderUsingPOST.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseObject>;
  public sendBeycoOrderUsingPOSTByMap(
    map: SendBeycoOrderUsingPOST.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseObject>>;
  public sendBeycoOrderUsingPOSTByMap(
    map: SendBeycoOrderUsingPOST.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseObject>>;
  public sendBeycoOrderUsingPOSTByMap(
    map: SendBeycoOrderUsingPOST.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.sendBeycoOrderUsingPOST(
      map.X_Beyco_Token,
      map.companyId,
      map.ApiBeycoOrderFields,
      observe,
      reportProgress
    );
  }


    /**
     * Send order to Beyco
     * 
     * @param X_Beyco_Token JWT token
     * @param companyId ID of company
     * @param ApiBeycoOrderFields Beyco offer
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public sendBeycoOrderUsingPOST(X_Beyco_Token: string, companyId: number, ApiBeycoOrderFields: ApiBeycoOrderFields, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseObject>;
    public sendBeycoOrderUsingPOST(X_Beyco_Token: string, companyId: number, ApiBeycoOrderFields: ApiBeycoOrderFields, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseObject>>;
    public sendBeycoOrderUsingPOST(X_Beyco_Token: string, companyId: number, ApiBeycoOrderFields: ApiBeycoOrderFields, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseObject>>;
    public sendBeycoOrderUsingPOST(X_Beyco_Token: string, companyId: number, ApiBeycoOrderFields: ApiBeycoOrderFields, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (X_Beyco_Token === null || X_Beyco_Token === undefined) {
            throw new Error('Required parameter X_Beyco_Token was null or undefined when calling sendBeycoOrderUsingPOST.');
        }
        if (companyId === null || companyId === undefined) {
            throw new Error('Required parameter companyId was null or undefined when calling sendBeycoOrderUsingPOST.');
        }
        if (ApiBeycoOrderFields === null || ApiBeycoOrderFields === undefined) {
            throw new Error('Required parameter ApiBeycoOrderFields was null or undefined when calling sendBeycoOrderUsingPOST.');
        }

        let headers = this.defaultHeaders;
        if (X_Beyco_Token !== undefined && X_Beyco_Token !== null) {
            headers = headers.set('X-Beyco-Token', String(X_Beyco_Token));
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

        const handle = this.httpClient.post<ApiResponseObject>(`${this.configuration.basePath}/api/chain/beyco-order/company/${encodeURIComponent(String(companyId))}/order`,
            ApiBeycoOrderFields,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'sendBeycoOrderUsingPOST')));
        }
        return handle;
    }

}
