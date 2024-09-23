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

import { ApiBeycoOrderFields } from '../model/apiBeycoOrderFields';
import { ApiResponseApiBeycoOrderFields } from '../model/apiResponseApiBeycoOrderFields';
import { ApiResponseApiBeycoTokenResponse } from '../model/apiResponseApiBeycoTokenResponse';
import { ApiResponseObject } from '../model/apiResponseObject';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

/**
 * Namespace for getBeycoOrderFieldsForSelectedStockOrders.
 */
export namespace GetBeycoOrderFieldsForSelectedStockOrders {
    /**
     * Parameter map for getBeycoOrderFieldsForSelectedStockOrders.
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
     * Enumeration of all parameters for getBeycoOrderFieldsForSelectedStockOrders.
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
     * A map of tuples with error name and `ValidatorFn` for each parameter of getBeycoOrderFieldsForSelectedStockOrders
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetBeycoOrderFieldsForSelectedStockOrders.PartialParamMap]?: [string, ValidatorFn][]} = {
      id: [
              ['required', Validators.required],
      ],
      companyId: [
              ['required', Validators.required],
      ],
    };
}

/**
 * Namespace for getToken.
 */
export namespace GetToken {
    /**
     * Parameter map for getToken.
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
     * Enumeration of all parameters for getToken.
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
     * A map of tuples with error name and `ValidatorFn` for each parameter of getToken
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetToken.PartialParamMap]?: [string, ValidatorFn][]} = {
      authCode: [
              ['required', Validators.required],
      ],
      companyId: [
              ['required', Validators.required],
      ],
    };
}

/**
 * Namespace for refreshToken.
 */
export namespace RefreshToken {
    /**
     * Parameter map for refreshToken.
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
     * Enumeration of all parameters for refreshToken.
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
     * A map of tuples with error name and `ValidatorFn` for each parameter of refreshToken
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof RefreshToken.PartialParamMap]?: [string, ValidatorFn][]} = {
      X_Beyco_Refresh_Token: [
              ['required', Validators.required],
      ],
      companyId: [
              ['required', Validators.required],
      ],
    };
}

/**
 * Namespace for sendBeycoOrder.
 */
export namespace SendBeycoOrder {
    /**
     * Parameter map for sendBeycoOrder.
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
      ApiBeycoOrderFields: ApiBeycoOrderFields;
    }

    /**
     * Enumeration of all parameters for sendBeycoOrder.
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
      ApiBeycoOrderFields = 'ApiBeycoOrderFields'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of sendBeycoOrder
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof SendBeycoOrder.PartialParamMap]?: [string, ValidatorFn][]} = {
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
  public getBeycoOrderFieldsForSelectedStockOrdersByMap(
    map: GetBeycoOrderFieldsForSelectedStockOrders.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiBeycoOrderFields>;
  public getBeycoOrderFieldsForSelectedStockOrdersByMap(
    map: GetBeycoOrderFieldsForSelectedStockOrders.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiBeycoOrderFields>>;
  public getBeycoOrderFieldsForSelectedStockOrdersByMap(
    map: GetBeycoOrderFieldsForSelectedStockOrders.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiBeycoOrderFields>>;
  public getBeycoOrderFieldsForSelectedStockOrdersByMap(
    map: GetBeycoOrderFieldsForSelectedStockOrders.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getBeycoOrderFieldsForSelectedStockOrders(
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
    public getBeycoOrderFieldsForSelectedStockOrders(id: Array<number>, companyId: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiBeycoOrderFields>;
    public getBeycoOrderFieldsForSelectedStockOrders(id: Array<number>, companyId: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiBeycoOrderFields>>;
    public getBeycoOrderFieldsForSelectedStockOrders(id: Array<number>, companyId: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiBeycoOrderFields>>;
    public getBeycoOrderFieldsForSelectedStockOrders(id: Array<number>, companyId: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getBeycoOrderFieldsForSelectedStockOrders.');
        }
        if (companyId === null || companyId === undefined) {
            throw new Error('Required parameter companyId was null or undefined when calling getBeycoOrderFieldsForSelectedStockOrders.');
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
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getBeycoOrderFieldsForSelectedStockOrders')));
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
  public getTokenByMap(
    map: GetToken.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiBeycoTokenResponse>;
  public getTokenByMap(
    map: GetToken.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiBeycoTokenResponse>>;
  public getTokenByMap(
    map: GetToken.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiBeycoTokenResponse>>;
  public getTokenByMap(
    map: GetToken.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getToken(
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
    public getToken(authCode: string, companyId: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiBeycoTokenResponse>;
    public getToken(authCode: string, companyId: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiBeycoTokenResponse>>;
    public getToken(authCode: string, companyId: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiBeycoTokenResponse>>;
    public getToken(authCode: string, companyId: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (authCode === null || authCode === undefined) {
            throw new Error('Required parameter authCode was null or undefined when calling getToken.');
        }
        if (companyId === null || companyId === undefined) {
            throw new Error('Required parameter companyId was null or undefined when calling getToken.');
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
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getToken')));
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
  public refreshTokenByMap(
    map: RefreshToken.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiBeycoTokenResponse>;
  public refreshTokenByMap(
    map: RefreshToken.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiBeycoTokenResponse>>;
  public refreshTokenByMap(
    map: RefreshToken.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiBeycoTokenResponse>>;
  public refreshTokenByMap(
    map: RefreshToken.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.refreshToken(
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
    public refreshToken(X_Beyco_Refresh_Token: string, companyId: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiBeycoTokenResponse>;
    public refreshToken(X_Beyco_Refresh_Token: string, companyId: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiBeycoTokenResponse>>;
    public refreshToken(X_Beyco_Refresh_Token: string, companyId: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiBeycoTokenResponse>>;
    public refreshToken(X_Beyco_Refresh_Token: string, companyId: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (X_Beyco_Refresh_Token === null || X_Beyco_Refresh_Token === undefined) {
            throw new Error('Required parameter X_Beyco_Refresh_Token was null or undefined when calling refreshToken.');
        }
        if (companyId === null || companyId === undefined) {
            throw new Error('Required parameter companyId was null or undefined when calling refreshToken.');
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
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'refreshToken')));
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
  public sendBeycoOrderByMap(
    map: SendBeycoOrder.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseObject>;
  public sendBeycoOrderByMap(
    map: SendBeycoOrder.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseObject>>;
  public sendBeycoOrderByMap(
    map: SendBeycoOrder.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseObject>>;
  public sendBeycoOrderByMap(
    map: SendBeycoOrder.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.sendBeycoOrder(
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
     * @param ApiBeycoOrderFields 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public sendBeycoOrder(X_Beyco_Token: string, companyId: number, ApiBeycoOrderFields: ApiBeycoOrderFields, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseObject>;
    public sendBeycoOrder(X_Beyco_Token: string, companyId: number, ApiBeycoOrderFields: ApiBeycoOrderFields, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseObject>>;
    public sendBeycoOrder(X_Beyco_Token: string, companyId: number, ApiBeycoOrderFields: ApiBeycoOrderFields, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseObject>>;
    public sendBeycoOrder(X_Beyco_Token: string, companyId: number, ApiBeycoOrderFields: ApiBeycoOrderFields, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (X_Beyco_Token === null || X_Beyco_Token === undefined) {
            throw new Error('Required parameter X_Beyco_Token was null or undefined when calling sendBeycoOrder.');
        }
        if (companyId === null || companyId === undefined) {
            throw new Error('Required parameter companyId was null or undefined when calling sendBeycoOrder.');
        }
        if (ApiBeycoOrderFields === null || ApiBeycoOrderFields === undefined) {
            throw new Error('Required parameter ApiBeycoOrderFields was null or undefined when calling sendBeycoOrder.');
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
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'sendBeycoOrder')));
        }
        return handle;
    }

}
