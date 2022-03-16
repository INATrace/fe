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
import { ApiPaginatedResponseApiTransaction } from '../model/apiPaginatedResponseApiTransaction';
import { ApiTransaction } from '../model/apiTransaction';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

/**
 * Namespace for approveTransactionUsingPUT.
 */
export namespace ApproveTransactionUsingPUT {
    /**
     * Parameter map for approveTransactionUsingPUT.
     */
    export interface PartialParamMap {
      /**
       * Transaction ID
       */
      id: number;
      /**
       * language
       */
      language?: 'EN' | 'DE' | 'RW' | 'ES';
    }

    /**
     * Enumeration of all parameters for approveTransactionUsingPUT.
     */
    export enum Parameters {
      /**
       * Transaction ID
       */
      id = 'id',
      /**
       * language
       */
      language = 'language'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of approveTransactionUsingPUT
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof ApproveTransactionUsingPUT.PartialParamMap]?: [string, ValidatorFn][]} = {
      id: [
              ['required', Validators.required],
      ],
      language: [
      ],
    };
}

/**
 * Namespace for getStockOrderInputTransactionsUsingGET.
 */
export namespace GetStockOrderInputTransactionsUsingGET {
    /**
     * Parameter map for getStockOrderInputTransactionsUsingGET.
     */
    export interface PartialParamMap {
      /**
       * Company ID
       */
      stockOrderId: number;
    }

    /**
     * Enumeration of all parameters for getStockOrderInputTransactionsUsingGET.
     */
    export enum Parameters {
      /**
       * Company ID
       */
      stockOrderId = 'stockOrderId'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of getStockOrderInputTransactionsUsingGET
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetStockOrderInputTransactionsUsingGET.PartialParamMap]?: [string, ValidatorFn][]} = {
      stockOrderId: [
              ['required', Validators.required],
      ],
    };
}

/**
 * Namespace for rejectTransactionUsingPUT.
 */
export namespace RejectTransactionUsingPUT {
    /**
     * Parameter map for rejectTransactionUsingPUT.
     */
    export interface PartialParamMap {
      /**
       * Transaction ID
       */
      id: number;
      /**
       * apiTransaction
       */
      ApiTransaction: ApiTransaction;
      /**
       * language
       */
      language?: 'EN' | 'DE' | 'RW' | 'ES';
    }

    /**
     * Enumeration of all parameters for rejectTransactionUsingPUT.
     */
    export enum Parameters {
      /**
       * Transaction ID
       */
      id = 'id',
      /**
       * apiTransaction
       */
      ApiTransaction = 'ApiTransaction',
      /**
       * language
       */
      language = 'language'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of rejectTransactionUsingPUT
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof RejectTransactionUsingPUT.PartialParamMap]?: [string, ValidatorFn][]} = {
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
export class TransactionControllerService {

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
   * Approves transaction with provided ID. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public approveTransactionUsingPUTByMap(
    map: ApproveTransactionUsingPUT.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiDefaultResponse>;
  public approveTransactionUsingPUTByMap(
    map: ApproveTransactionUsingPUT.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiDefaultResponse>>;
  public approveTransactionUsingPUTByMap(
    map: ApproveTransactionUsingPUT.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiDefaultResponse>>;
  public approveTransactionUsingPUTByMap(
    map: ApproveTransactionUsingPUT.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.approveTransactionUsingPUT(
      map.id,
      map.language,
      observe,
      reportProgress
    );
  }


    /**
     * Approves transaction with provided ID.
     * 
     * @param id Transaction ID
     * @param language language
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public approveTransactionUsingPUT(id: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiDefaultResponse>;
    public approveTransactionUsingPUT(id: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiDefaultResponse>>;
    public approveTransactionUsingPUT(id: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiDefaultResponse>>;
    public approveTransactionUsingPUT(id: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling approveTransactionUsingPUT.');
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

        const handle = this.httpClient.put<ApiDefaultResponse>(`${this.configuration.basePath}/api/chain/transaction/${encodeURIComponent(String(id))}/approve`,
            null,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'approveTransactionUsingPUT')));
        }
        return handle;
    }


  /**
   * Get a paginated list of input transactions for provided stock order ID. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getStockOrderInputTransactionsUsingGETByMap(
    map: GetStockOrderInputTransactionsUsingGET.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiPaginatedResponseApiTransaction>;
  public getStockOrderInputTransactionsUsingGETByMap(
    map: GetStockOrderInputTransactionsUsingGET.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiPaginatedResponseApiTransaction>>;
  public getStockOrderInputTransactionsUsingGETByMap(
    map: GetStockOrderInputTransactionsUsingGET.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiPaginatedResponseApiTransaction>>;
  public getStockOrderInputTransactionsUsingGETByMap(
    map: GetStockOrderInputTransactionsUsingGET.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getStockOrderInputTransactionsUsingGET(
      map.stockOrderId,
      observe,
      reportProgress
    );
  }


    /**
     * Get a paginated list of input transactions for provided stock order ID.
     * 
     * @param stockOrderId Company ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getStockOrderInputTransactionsUsingGET(stockOrderId: number, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiPaginatedResponseApiTransaction>;
    public getStockOrderInputTransactionsUsingGET(stockOrderId: number, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiPaginatedResponseApiTransaction>>;
    public getStockOrderInputTransactionsUsingGET(stockOrderId: number, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiPaginatedResponseApiTransaction>>;
    public getStockOrderInputTransactionsUsingGET(stockOrderId: number, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (stockOrderId === null || stockOrderId === undefined) {
            throw new Error('Required parameter stockOrderId was null or undefined when calling getStockOrderInputTransactionsUsingGET.');
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

        const handle = this.httpClient.get<ApiPaginatedResponseApiTransaction>(`${this.configuration.basePath}/api/chain/transaction/list/input/stock-order/${encodeURIComponent(String(stockOrderId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getStockOrderInputTransactionsUsingGET')));
        }
        return handle;
    }


  /**
   * Rejects transaction with provided ID and reverts it&#39;s quantities. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public rejectTransactionUsingPUTByMap(
    map: RejectTransactionUsingPUT.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiDefaultResponse>;
  public rejectTransactionUsingPUTByMap(
    map: RejectTransactionUsingPUT.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiDefaultResponse>>;
  public rejectTransactionUsingPUTByMap(
    map: RejectTransactionUsingPUT.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiDefaultResponse>>;
  public rejectTransactionUsingPUTByMap(
    map: RejectTransactionUsingPUT.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.rejectTransactionUsingPUT(
      map.id,
      map.ApiTransaction,
      map.language,
      observe,
      reportProgress
    );
  }


    /**
     * Rejects transaction with provided ID and reverts it&#39;s quantities.
     * 
     * @param id Transaction ID
     * @param ApiTransaction apiTransaction
     * @param language language
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public rejectTransactionUsingPUT(id: number, ApiTransaction: ApiTransaction, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiDefaultResponse>;
    public rejectTransactionUsingPUT(id: number, ApiTransaction: ApiTransaction, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiDefaultResponse>>;
    public rejectTransactionUsingPUT(id: number, ApiTransaction: ApiTransaction, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiDefaultResponse>>;
    public rejectTransactionUsingPUT(id: number, ApiTransaction: ApiTransaction, language?: 'EN' | 'DE' | 'RW' | 'ES', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling rejectTransactionUsingPUT.');
        }
        if (ApiTransaction === null || ApiTransaction === undefined) {
            throw new Error('Required parameter ApiTransaction was null or undefined when calling rejectTransactionUsingPUT.');
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

        const handle = this.httpClient.put<ApiDefaultResponse>(`${this.configuration.basePath}/api/chain/transaction/${encodeURIComponent(String(id))}/reject`,
            ApiTransaction,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'rejectTransactionUsingPUT')));
        }
        return handle;
    }

}